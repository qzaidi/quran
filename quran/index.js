"use strict";

var model = require('./db');
var qurandb = model('qurandb','r');

var quran = {
  get: function(chapter,verse,callback) {
    if (!callback && typeof (verse) === 'function') {
      callback = verse;
      verse = undefined;
    }
    this.select({ chapter: chapter, verse: verse }, callback);
  },

  select: function(filters,options,callback) {

    if (!callback && typeof (options) === 'function') {
      callback = options;
      options = undefined;
    } 

    var query = 'select * from arabic where ';
    var params = [];

    Object.keys(filters).forEach(function(k) { 
      if (filters[k]) {
        params.push(' ' + k + '=' + filters[k]);
      }
    });

    query += params.join(' and ') +  ' order by verse ';

    if (options) {
      [ 'limit', 'offset' ].forEach(function(x) {
        if (options[x]) {
          query += x + ' ' + options[x] + ' '; 
        }
      });
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
