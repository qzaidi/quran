"use strict";

var model = require('./db');
var qurandb = model('qurandb','r');

var quran = {
  get: function(chapter,verse,cb) {
    var query = 'select * from arabic where chapter=' + chapter + ' and verse=' + verse;
    qurandb.get(query,cb);
  }
};

module.exports = quran;
