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

console.log('Fetching 3 verses with english translation via select');
quran.select( { chapter: 1 }, { language: 'en' }, function(err,v) {
  console.log(err || v);
});
