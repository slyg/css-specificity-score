var css = require('css');
var cssExplain = require('css-explain').cssExplain;
var _ = require('underscore');

// custom css specificity score
function getScore(specArray){
	var score = 0;
	var len = i = specArray.length;
	while(i--){
		score = +score + (+specArray[i]) * Math.pow(10, +len-i-1);
	}
	return score;
}

function generateReport(cssStringData, cb){

    var report = [], err = null;

    if(!(typeof cssStringData === "string")){
        err = "Argument is not a string";
    } else {

        cssStringData = cssStringData.replace(/\/\*[^]*?\*\//g, ''); // strip comments /**/
        
        // get all selectors from css file
        var selectors = css
            .parse(cssStringData)
        	.stylesheet
        	.rules
        	.map(function(rule){return rule.selectors;})
        ;
        
        // flattens selectors when several selectors for the same css rule
        // e.g. 'ul, li {}' -> [['ul', 'li'], ...]
        // while 'ul {} li {}' -> ['ul', 'li', ...]
        selectors = _.flatten(selectors);
        
        // build a report based on css-explain module
        // and a customized score
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
    
    }
    
    cb(err, report);
    
}

module.exports = generateReport;
