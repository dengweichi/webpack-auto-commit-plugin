const fs = require('fs');
const path = require('path');

/**
 * 删除文件夹
 */
const deleteDir = function (pathname) {
    let files = [];
    if (fs.existsSync(pathname)) {
        files = fs.readdirSync(pathname);
        files.forEach((file, index) => {
            let currentPath = pathname + "\\" + file;
            if (fs.statSync(currentPath).isDirectory()) {
                deleteDir(currentPath); //递归删除文件夹
            } else {
                fs.unlinkSync(currentPath); //删除文件
            }
        });
        fs.rmdirSync(pathname);
    }
};
/**
 * 删除知道扩展名的文件
 */
const deleteExtnameFile = function (pathname, extname) {
    let files = [];
    if (fs.existsSync(pathname)) {
        files = fs.readdirSync(pathname);
        files.forEach((file, index) => {
            let currentPath = pathname + "\\" + file;
            if (fs.statSync(currentPath).isDirectory()) {
                deleteExtnameFile(currentPath, extname); //递归删除文件夹
            } else {
                if (path.extname(file) === extname)
                    fs.unlinkSync(currentPath); //删除文件
            }
        });
    }
};

// 合并文件夹
const mergeDir = function (sourceDir, targetDir) {
    const merge = function (source, target) {
        let files = [];
        if (fs.existsSync(source)) {
            files = fs.readdirSync(source);
            if (files && files.length) {
                files.forEach((file, index) => {
                    let currentPath = source + "\\" + file;
                    let relativePath = path.relative(sourceDir, currentPath);
                    let absolutePath = path.resolve(targetDir, relativePath);
                    // 如果是目录
                    if (fs.statSync(currentPath).isDirectory()) {
                        // 如果目标目录不存在对于的文件夹，创建文件夹
                        if (!fs.existsSync(absolutePath)) {
                            fs.mkdirSync(absolutePath);
                        }
                        merge(currentPath, target);
                    } else {
                        // 如果找到文件，直接覆盖
                        if (fs.existsSync(absolutePath)) {
                            //fs.unlinkSync(absolutePath);
                            fs.copyFileSync(currentPath, absolutePath);
                        } else {
                            // 如果找不到文件。通过hash分割查找
                            let array = file.split('.');

                            if (!array || !Array.isArray(array) || !array.length) {
                                return;
                            }
                            // 如果为没有hash的文件
                            if (array.length === 2) {
                                return fs.copyFileSync(currentPath, absolutePath);
                            }

                            let fileName = array[0]; // 文件名
                            let suffix = array[array.length - 1]; // 文件后缀
                            let dirPath = path.dirname(absolutePath);
                            let targetFiles = fs.readdirSync(dirPath);
                            // 如果为空文件夹
                            if (targetFiles && targetFiles.length){
                                let targetFile = targetFiles.find((targetFile) => {
                                    if (!fs.statSync(dirPath+'\\'+targetFile).isDirectory()){
                                        let targetArray = targetFile.split('.');
                                        if (targetArray && targetArray.length > 2) {
                                            if (targetArray[0] === fileName && targetArray[targetArray.length-1] === suffix) {
                                                return true;
                                            }
                                            return false;
                                        }
                                        return  false;
                                    }
                                    return false;
                                });
                                // 如果找到改文件
                                if (targetFile) {
                                    fs.unlinkSync(dirPath+'\\'+targetFile);
                                }
                                fs.copyFileSync(currentPath,dirPath+'\\'+file);
                            }else {
                                fs.copyFileSync(currentPath,dirPath+'\\'+file);
                            }
                        }
                    }
                })
            }
        }
    };
    merge(sourceDir, targetDir);
};

module.exports = {
    deleteDir,
    mergeDir,
    deleteExtnameFile
}
