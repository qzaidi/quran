"use strict";

var util = require('util');
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

    var l = function(x) {
      query += ' join ' + x + ' using(chapter,verse)'; 
    };

    if (!callback && typeof (options) === 'function') {
      callback = options;
      options = {};
    } 

    language = options.language || 'ar';

    if (language != 'ar') {
      if (util.isArray(language)) {
        language.forEach(l);
      } else {
        l(language);
      }
    }

    if (filters) {
      Object.keys(filters).forEach(function(k) { 
        var f = filters[k];
        if (f) {
          if (util.isArray(f)) {
            params.push(' a.' + k + ' in (' + f.join(',') + ')');
          } else {
            params.push(' a.' + k + '=' + f);
          }
        }
      });

      query += ' where ' + params.join(' and ') ;
    }
    
    query += ' order by chapter,verse ';

    if (options) {
      [ 'limit', 'offset' ].forEach(function(x) {
        if (options[x]) {
          query += x + ' ' + options[x] + ' '; 
        }
      });
    }

    if (options.debug) {
      console.log(query);
    }
    
    qurandb.all(query,function(err,res) {
      if (!err && res.length == 0) {
        err = new Error('Selectors out of range ' + query);
      }
      callback(err,res);
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
  },

  juz: function(juzNum, callback) {
    var query = 'select * from juz';

    if (!callback && typeof(juzNum) == 'function') {
      callback = juzNum;
      juzNum = undefined;
    }

    if (juzNum && juzNum > 30) {
      return callback(new Error('Juz Index out of bounds ' + juzNum));
    }

    if (juzNum) {
      query += ' where id=' + juzNum;
    }

    qurandb.all(query, function(err,res) {
      callback(err,res);
    });
  },

  search: function(lang,text,callback) {
    // todo:sanitize input
    var query = 'select chapter,verse,' + lang + ' from ' + lang + ' where ' + lang + ' like "%' + text + '%";'; 
    qurandb.all(query, function(err,res) {
      callback(err,res)
    });
  }
};

module.exports = quran;
