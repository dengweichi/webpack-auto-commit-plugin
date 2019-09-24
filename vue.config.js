
const {WebpackAutoCommitPlugin,commitType} = require('./src/client');
const path = require('path');

module.exports = {
   // assetsDir:'assets',
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
