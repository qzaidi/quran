"use strict";

var model = require('./db');
var qurandb = model('qurandb','r');

var quran = {
  get: function(chapter,verse,callback) {
    var query = 'select * from arabic where chapter=' + Number(chapter); 
    if (!callback && typeof (verse) === 'function') {
      callback = verse;
      query += ' order by verse';
    } else {
      query += ' and verse=' + Number(verse);
    }
    console.log(query);
    qurandb.all(query,callback);
  },
  chapterInfo: function(chapterNum) {

  }
};

module.exports = quran;
