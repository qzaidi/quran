"use strict";

var quran = require('../index');

console.log('Fetching 3 verses in arabic via select');
quran.select( { chapter: 1 }, { limit : 3 }, function(err,v) {
  console.log(err || v);
});

console.log('Fetching first chapter in arabic via select');
quran.select( { chapter: 1 }, function(err,v) {
  console.log(err || v);
});

console.log('Fetching all verses of chapter 1 with urdu translation via select');
quran.select( { chapter: 1 }, { language: 'ur' }, function(err,v) {
  console.log(err || v);
});

console.log('Fetching verses 4-5 of chapter 1 via select');
quran.select( { chapter: 1, verse: [2,4,6] }, { language: [ 'en', 'ur' ] }, function(err,v) {
  console.log(err || v);
});
