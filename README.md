quran
==========

node.js interface to Holy Quran

Installation
------------

npm install quran

Usage
-----

var quran = require('quran');

Fetch the first verse of second chapter

```
quran.get(2,1,function(err,verse) {
  if (!err) {
    console.log('Verse 1: Chapter 1: ' + verse.arabic);
  }
});

Fetch the first chapter

```
quran.get(1,function(err,verse) {
  if (!err) {
    console.log('Verse 1: Chapter 1: ' + verse);
  }
});
`````
