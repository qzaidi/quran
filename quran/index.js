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
    qurandb.all(query,function(err,res) {
      var verses;
      if (!err && res.length) {
        verses = res.map(function(x) { return x.arabic; });
      }
      callback(err,verses);
    });
  },
  chapter: function(chapterNum,callback) {
    var query = 'select * from chapters';
    if (!callback && typeof(chapterNum) == 'function') {
      callback = chapterNum;
      chapterNum = undefined;
    }

    if (chapterNum) {
      query += ' where id=' + chapterNum;
    }

    qurandb.all(query, function(err,res) {
      callback(err,res);
    });
  }
};

module.exports = quran;
