const fileUpload = require('express-fileupload');
const express = require('express');
const compressing = require('compressing');
const fs = require('fs');
const path = require('path');
const {commitType} =require('../utils/constant');
const app = express();
const {deleteDir,mergeDir} = require('../utils');
app.use(fileUpload({}));

app.post('/', function (req, res) {


    let files = req.files;
    // 校验目标路径是否存在
    if ( req.body.target) {

        // 判断目标路径是否是目录
        if (fs.existsSync(req.body.target) && !fs.statSync(req.body.target).isDirectory()) {
            return  res.status(500).send(new Error(`目标目录${req.body.target}不是目录类型`));
        }

        // 接收的文件为zip格式
        let filename =path.basename(files.file.name, '.zip');
        if (!filename){
            return res.status(500).send(new Error('只能识别zip文件'));
        }

        // 目录路径
        let dirPath = path.dirname( req.body.target);
        let dirname = path.basename(req.body.target);

        // 如果为替换策略，或者目标文件不存在
        if (req.body.commitType === commitType.REPLACE || !fs.existsSync(req.body.target)) {

            // 如果存在就文件夹，删除
            if (fs.existsSync(req.body.target)){
                deleteDir(req.body.target);
            }

            compressing.zip.uncompress(files.file.data, dirPath).then(() => {
                // 修改名称
                fs.renameSync(path.resolve(dirPath,filename),path.resolve(dirPath,dirname));
                res.send('部署成功');
            }).catch((error) => {
                return res.status(500).send(error);
            });
        }else {

            compressing.zip.uncompress(files.file.data, dirPath).then(() => {
                try {
                    mergeDir(dirPath+'\\'+filename,req.body.target);
                    deleteDir(dirPath+'\\'+filename);
                    res.send('部署成功');
                }catch (error) {
                    console.log(error);
                    return res.status(500).send(error);
                }
            }).catch((error) => {
                return res.status(500).send(error);
            });
        }

    }else {
        return res.status(404).send(new Error(`目标路径不存在,请填写target`));
    }

});

app.listen(3000, () => console.log('服务器启动 端口：3000!'));
