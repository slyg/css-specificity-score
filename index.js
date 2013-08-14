var css = require('css');
var cssExplain = require('css-explain').cssExplain;

function getScore(specArray){
	var score = 0;
	var len = i = specArray.length;
	while(i--){
		score = +score + (+specArray[i]) * Math.pow(10, +len-i-1);
	}
	return score;
}

function generateReport(cssStringData, cb){
    
    var selectors = css
        .parse(cssStringData)
    	.stylesheet
    	.rules
    	.map(function(rule){return rule.selectors[0];})
    ;
    
    var report = selectors.map(function(selector){
    	var explained = cssExplain(selector);
    	var spec = explained.specificity;
    	return {
    		selector : selector,
    		score : getScore(spec),
    		explainScore : explained.score,
    		specificity : spec
    	};
    });
    
    cb(report);
    
}

module.exports = generateReport;
