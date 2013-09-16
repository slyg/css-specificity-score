var fs = require('fs')
var path = require('path')
var assert = require("assert")
var _ = require("underscore")
var cssSpecReporter = require("../")
var testCSSPath = path.resolve(__dirname, './test.css')
var testCSSMediaQueries = path.resolve(__dirname, './media.css')

describe('"CSS Specificity Reporter"', function(){
    
    // Object itself
    describe('Object', function(){
        
        it('should be a function', function(){
            
            assert.equal("function", typeof cssSpecReporter)
            
        })
        
        it('should call a callback', function(done){
            
            cssSpecReporter("", function(){ done() })
            
        })
        
    })
    
    // callback's report object
    describe('callback report object', function(){
    
        it('should be an array when no css rules matched', function(done){
            
            cssSpecReporter("", function(err, report){
            
                assert.deepEqual(true, report instanceof Array)
                done()
                
            })
            
        })
        
        it('should be an empty array when no css rules matched', function(done){
            
            cssSpecReporter("", function(err, report){
                
                assert.equal(0, report.length)
                done()
                
            })
            
        })
        
        it('should be an empty array when passed argument is not a string', function(done){
            
            cssSpecReporter(2, function(err, report){
                
                assert.equal(0, report.length)
                done()
                
            })
            
        })
        
        it('should be an array of length 1 when selector is "ul{}"', function(done){
            
            cssSpecReporter("ul {}", function(err, report){
                assert.equal(1, report.length)
                done() 
            })
        })
        
    })
    
    // callback's error object
    describe('callback error object', function(){
        
        it('should be a string when passed argument is not a string', function(done){
            
            cssSpecReporter(2, function(err, report){
                
                assert.deepEqual("string", typeof err)
                done()
                
            })
            
        })
        
        it('should be null when passed argument is an empty string', function(done){
            
            cssSpecReporter("", function(err, report){
                
                assert.deepEqual(null, err)
                done()
                
            })
            
        })
        
    })
    
    // Tests some results
    describe('report', function(){
    
        describe('length', function(){
        
            var attendedResults = [
                {
                    css: 'html > body .truc ul#main-navigation:hover {}',
                    attendedLength : 1
                },
                {
                    css: 'ul {border: 1px solid red;} html > body .truc ul#main-navigation:hover {}',
                    attendedLength : 2
                },
                {
                    css: 'ul, li {border: 1px solid red;}',
                    attendedLength : 2
                }
            ]
            
            _.each(attendedResults, function(attendedResult){
                
                it('should be ' + attendedResult.attendedLength + ' for the CSS : ' + attendedResult.css, function(done){
                
                    cssSpecReporter(attendedResult.css, function(err, report){
                    
                        assert.deepEqual(attendedResult.attendedLength, report.length)
                        
                        done()
                        
                    })
                    
                })
                
            })
            
        })
        
        describe('result', function(){
        
            var attendedResults = [
                {
                    selector: 'html > body p.truc ul#main-navigation:hover',
                    score: 124,
                    explainScore: 3,
                    specificity: [ 1, 2, 4 ]
                },
                {
                    selector: 'html > body .truc ul#main-navigation:hover',
                    score: 123,
                    explainScore: 3,
                    specificity: [ 1, 2, 3 ]
                },
                {
                    selector: 'html > body p ul#main-navigation:hover',
                    score: 114,
                    explainScore: 3,
                    specificity: [ 1, 1, 4 ]
                },
                {
                    selector: 'body p ul#main-navigation:hover',
                    score: 113,
                    explainScore: 3,
                    specificity: [ 1, 1, 3 ]
                },
                {
                    selector: 'body ul#main-navigation:hover',
                    score: 112,
                    explainScore: 3,
                    specificity: [ 1, 1, 2 ]
                },
                {
                    selector: 'ul#main-navigation:hover',
                    score: 111,
                    explainScore: 2,
                    specificity: [ 1, 1, 1 ]
                },
                { 
                    selector: '#main-navigation:hover',
                    score: 110,
                    explainScore: 1,
                    specificity: [ 1, 1, 0 ]
                },
                {
                    selector: '#main-navigation',
                    score: 100,
                    explainScore: 1,
                    specificity: [ 1, 0, 0 ]
                },
                {
                    selector: 'ul:hover',
                    score: 11,
                    explainScore: 3,
                    specificity: [ 0, 1, 1 ]
                },
                {
                    selector: 'ul',
                    score: 1,
                    explainScore: 3,
                    specificity: [ 0, 0, 1 ]
                },
                {
                    selector: 'ul',
                    score: 1,
                    explainScore: 3,
                    specificity: [ 0, 0, 1 ]
                },
                {
                    selector: 'li',
                    score: 1,
                    explainScore: 3,
                    specificity: [ 0, 0, 1 ]
                }
            ]
            
            _.each(attendedResults, function(attendedResult){
                
                it('should match the attended result for the following selector ' + attendedResult.selector, function(done){
                
                    cssSpecReporter(attendedResult.selector + "{}", function(err, report){
                    
                        assert.deepEqual(attendedResult, report[0])
                        
                        done()
                        
                    })
                    
                })
                
            })
            
            // Testing multiline real-world css file
            
            it('should give the attended result for several css instructions', function(done){
                
                cssSpecReporter(fs.readFileSync(testCSSPath, 'utf8'), function(err, report){
                    assert.deepEqual(attendedResults, report)
                    done()
                })
                
            })

            it('should match selectors embded in @media queries', function(done){

                cssSpecReporter(fs.readFileSync(testCSSMediaQueries, 'utf8'), function(err, report){
                    assert.deepEqual([
                        { 
                            selector: '#main-navigation',
                            score: 100,
                            explainScore: 1,
                            specificity: [ 1, 0, 0 ] 
                        },
                        { 
                            selector: '#main-navigation .insidemediaquery',
                            score: 110,
                            explainScore: 6,
                            specificity: [ 1, 1, 0 ] 
                        },
                        { 
                            selector: '.outsidemediaquery',
                            score: 10,
                            explainScore: 2,
                            specificity: [ 0, 1, 0 ] 
                        }
                    ], report)
                    done()
                })

            })
            
        })
        
    })
    
})









