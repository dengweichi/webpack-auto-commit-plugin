
const compressing = require('compressing');
const path = require('path');
const axios = require('axios');

const fs = require('fs');
const FormData = require('form-data');
const {commitType} =require('../utils/constant');
const { deleteExtnameFile} = require('../utils');
/**
 * webpack 提交插件
 */
class WebpackCommitPlugin {

    constructor(options = {}) {
        const defaultOptions = {
            outputDir:null,
            remoteAddress:'',
            target:'',
            sourceMap:true,
            commitType:commitType.MERGE
        };
        Object.assign(defaultOptions,options);
        this.options = defaultOptions;
    }
    apply(compiler) {

        compiler.plugin('afterEmit', ( stats) => {
            let {compiler} = stats;
            // 获取输出目录
            let outputPath = compiler.outputPath;

            if (!this.options.outputDir) {
                this.options.outputDir = outputPath;
            }

            // 校验是否是绝对路径
            if (!path.isAbsolute(this.options.outputDir)){
                return console.error(`${this.options.outputDir}不是绝对路径，请填写绝对路径`)
            }
            // 如果需要上传source map文件
            if (!this.options.sourceMap) {
                deleteExtnameFile(outputPath,'.map');
            }
            // 在指定的目录下压缩文件
            compressing.zip.compressDir(outputPath, `${this.options.outputDir}.zip`).then((result) => {
                console.log('success');
                if (this.options.remoteAddress){
                    const formData = new FormData();
                    formData.append('file', fs.createReadStream(`${this.options.outputDir}.zip`));
                    formData.append('target',this.options.target);
                    formData.append('commitType',this.options.commitType);
                    // 上传文件
                    axios.post(this.options.remoteAddress,formData,{
                        headers:{
                            ... formData.getHeaders(),
                        },
                        timeout:10000,
                        // 上传进度
                        onUploadProgress: (progressEvent) => {
                            let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%';
                            console.log(complete);
                        }
                    }).then(function (response) {
                        console.log(response.data);
                    }).catch(function (error) {
                        console.log(error);
                    })
                }
            }).catch((err) => {
                console.error(err);
            });

        });
    }
}


module.exports = WebpackCommitPlugin;
