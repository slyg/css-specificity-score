CSS specificity score [![Build Status](https://travis-ci.org/slyg/css-specificity-score.png?branch=master)](https://travis-ci.org/slyg/css-specificity-score)
=====================

Generate a (customized) report on css rules specificity + score

## Install

<code>prompt> npm install</code>

## Tests

<code>prompt> mocha</code>

## Signature

<pre>

var cssReport = require('../');

cssReport(cssString, function(err, report){ ... });

</pre>


* <code>err</code> : <code>null</code> by default, returns a string if true, e.g. "argument not valid"
* <code>report</code> : <code>[]</code> empty array by default

Each report's array item : 

<pre>
{
  selector : "#main-navigation:hover", // String, css selector
  specificity: [ 1, 1, 0 ],            // Array of Numbers, css specificity
  score : 110,                         // Number, computed css specificity
  explainScore : 1                     // Number, score given by css-explain module (see dependencies)
}
</pre>
