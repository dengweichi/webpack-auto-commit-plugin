# webpack-auto-commit-plugin（webpack自动部署插件）
***
### 介绍
执行npm run build 后会自动部署到远程服务器，如果远程服务器使用 pm2管理工具，可实现自定化部署<br>
[点击查看pm2文档](https://github.com/Unitech/pm2)<br>
#### webpack-auto-commit-plugin 包含两种文件操作策略<br>
* commitType.MERGE 合并策略（默认）
    > 根据文件名字和后缀名来区分文件，忽略文件名上的hash值，会自动覆盖相同的文件。完全相同的文件，也会执行替换
     如果远程服务器找不到该文件夹，会自动创建
* commitType.REPLACE 替换策略
    > 采用粗暴的文件替换，会把旧的文件夹删除再覆盖新的上去
***
欢迎star [github邓伟驰](https://github.com/dengweichi/webpack-auto-commit-plugin)

### 安装
```
    服务器
    npm install webpack-auto-commit-plugin -g
    客户端
    npm install webpack-auto-commit-plugin -D
```

***

###  服务器端使用
```
    server -p 80 // 端口号,自定义
    server -h // 查看帮助文档
```
### 客户端使用vue.config.js(vue-cli 3.0使用，webpack工程在plugin增加即可)
``` javascript 1.8
    const {WebpackAutoCommitPlugin,commitType} = require('webpack-auto-commit-plugin');
    module.exports = {
        configureWebpack(options) {
            if (process.env.NODE_ENV === 'production') {
                options.plugins.push(new WebpackAutoCommitPlugin({
                    remoteAddress:'http://localhost:3000',
                    target:'C:\\Users\\190542\\Desktop\\target',
                    sourceMap:false,
                }));
            }
        }
    };
```

``` javascript 1.8
  options.plugins.push(new WebpackAutoCommitPlugin({
                 outputDir:null, // 压缩包输出目录,绝对路径
                 remoteAddress:'http://localhost:3000',// 远程服务器地址
                 target:'C:\\Users\\190542\\Desktop\\target',// 远程的目标目录
                 sourceMap:false, // 是否上传source map文件
                 commitType:commitType.MERGE // 提交类型 默认为合并文件，会根据 文件名和文件后缀匹配，自覆盖不同hash而文件名一样的文件,可选 commitType.REPLACE,会直接替换目标目录
             }));
```
