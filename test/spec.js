var assert = require("assert")
var cssSpecReporter = require("../")


describe('"CSS Specificity Reporter"', function(){
    
    describe('Object', function(){
        
        it('should be a function', function(){
            
            assert.equal("function", typeof cssSpecReporter);
            
        })
        
        it('should call a callback', function(done){
            
            cssSpecReporter("", function(){ done(); })
            
        })
        
    })
    
    describe('callback report', function(){
    
        it('should be an array when no css rules matched', function(done){
            
            cssSpecReporter("", function(err, report){
            
                assert.equal(true, report instanceof Array);
                done();
                
            })
            
        })
        
        it('should be an empty array when no css rules matched', function(done){
            
            cssSpecReporter("", function(err, report){
                
                assert.equal(0, report.length);
                done();
                
            })
            
        })
        
        it('should be an empty array when passed argument is not a string', function(done){
            
            cssSpecReporter(2, function(err, report){
                
                assert.equal(0, report.length);
                done();
                
            })
            
        })
        
        it('should be an array of length 1 when selector is "ul{}"', function(done){
            
            cssSpecReporter("ul{}", function(err, report){
                assert.equal(1, report.length);
                done(); 
            })
        })
        
    })
    
    describe('callback error', function(){
        
        it('should be a string when passed argument is not a string', function(done){
            
            cssSpecReporter(2, function(err, report){
                
                assert.equal("string", typeof err);
                done();
                
            })
            
        })
        
        it('should be null when passed argument is an empty string', function(done){
            
            cssSpecReporter("", function(err, report){
                
                assert.equal(null, err);
                done();
                
            })
            
        })
        
    })
    
});