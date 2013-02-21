quran
==========

node.js interface to Holy Quran

Installation
------------

npm install quran

Usage
-----

var quran = require('quran');

...
quran.get(1,1,function(err,verse) {
  if (!err) {
    console.log('Verse 1: Chapter 1: ' + verse);
  }
});
...
