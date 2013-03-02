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
    var language; 
    var params = [];
    var query = 'select * from ar a ';
    
    if (!callback && typeof (options) === 'function') {
      callback = options;
      options = {};
    } 

    language = options.language || 'ar';

    if (language != 'ar') {
      query += ' left join ' + language + ' e on a.chapter = e.chapter and a.verse = e.verse';
    }

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
