var fs = require('fs');
var path = require('path');
var cssSpecReport = require('../');
var sampleCSSPath = path.resolve(__dirname, './sample.css');

cssSpecReport(fs.readFileSync(sampleCSSPath,'utf8'), console.log);