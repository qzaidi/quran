"use strict";

var model = require('./db');
var qurandb = model('qurandb','r');

var quran = {
  get: function(chapter,verse,callback) {
    if (!callback && typeof (verse) === 'function') {
      callback = verse;
      verse = undefined;
    }
    this.select({ chapter: chapter, verse: verse }, function(err,res) {
      var verses;
      if (!err && res.length) {
        verses = res.map(function(x) { return x.ar; });
      }
      callback(err,verses);
    });
  },

  select: function(filters,options,callback) {

    if (!callback && typeof (options) === 'function') {
      callback = options;
      options = undefined;
    } 

    var query = 'select * from ar where ';
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

    qurandb.all(query,callback);
  },

  selectWithTrans: function(filters,options,callback) {
    var table = options.language;
    var query = 'select * from ar a left join en e on a.chapter = e.chapter and a.verse = e.verse' 
    var params = [];

    Object.keys(filters).forEach(function(k) { 
      if (filters[k]) {
        params.push(' a.' + k + '=' + filters[k]);
      }
    });

    query += ' where ' + params.join(' and ') + ' order by verse ';

    if (options) {
      [ 'limit', 'offset' ].forEach(function(x) {
        if (options[x]) {
          query += x + ' ' + options[x] + ' '; 
        }
      });
    }
    
    qurandb.all(query,callback);
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
