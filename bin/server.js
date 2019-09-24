#!/usr/bin/env node

'use strict';
let argv = require('optimist')
	.boolean('cors')
	.boolean('log-ip')
	.argv;
console.log(argv);
if (argv.h || argv.help) {
	console.log([
		'usage: server -p [port]',
		'',
		'options:',
		'  -p --port    Port to use [8080]',
	].join('\n'));
	process.exit();
}

let port = argv.p || argv.port || 8080;

console.log(`服务器启动：${port}端口`);

const app = require('../src/server');

app.listen(port, () => console.log('服务器已启动'));


