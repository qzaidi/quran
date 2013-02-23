"use strict";

var quran = require('../index');

console.log('Fetching verse 1 of Al Fatiha');
quran.get(1,1,function(err,v) {
  console.log(err || v);
});


console.log('Fetching chapter 1 - Al Fatiha');
quran.get(1,function(err,v) {
  console.log(err || v);
});

console.log('Fetch meta info about chapter 1');
quran.chapter(1, function(err,v) {
  console.log(err || v);
});

console.log('Fetch meta info about all chapters');
quran.chapter(function(err,v) {
  console.log(err || v);
});
