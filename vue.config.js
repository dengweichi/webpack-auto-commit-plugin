
const {webpackCommitPlugin,commitType} = require('./src/client');
const path = require('path');

module.exports = {
   // assetsDir:'assets',
    configureWebpack(options) {
        if (process.env.NODE_ENV === 'production') {
            options.plugins.push(new webpackCommitPlugin({
                remoteAddress:'http://localhost:3000',
                target:'C:\\Users\\user\\Desktop\\target',
                sourceMap:false,
            }));
        }
    }
};
