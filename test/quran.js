"use strict";

var quran = require('../index');

console.log('Fetching verse 1 of Al Fatiha');
quran.get(1,1,function(err,v) {
  console.log(err || v);
});

console.log('Fetching chapter 1 - Al Fatiha');
quran.get(1,function(err,v) {
  console.log(err || v.join(','));
});

console.log('Fetch meta info about chapter 1');
quran.chapter(1, function(err,v) {
  console.log(err || v);
});

console.log('Fetch meta info about all chapters');
quran.chapter(function(err,v) {
  console.log(err || v);
});

console.log('Fetch first 10 verses of juz 2');
quran.juz(28,function(err,j) {
  console.log(err || j[0]);
  if (!err) {
    quran.select({ chapter: j[0].surah }, { offset: j[0].ayah - 1, limit: 10 }, function(err,verses) {
      console.log(err || verses);
    });
  }
});
