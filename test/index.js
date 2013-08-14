var fs = require('fs');
var path = require('path');
var cssSpecReport = require('../');

cssSpecReport(fs.readFileSync(path.resolve(__dirname, './test.css'),'utf8'), console.log);