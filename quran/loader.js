#!/usr/bin/env node
'use strict';

var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var QuranData = require('../contrib/quran-data');

var db;

/* file format
 * arabic
 * blank
 * english
 * blank
 * the above repeats ...
 */
function readFile (file, cb) {
  fs.readFile(file, function (err, data) {
    // handle error
    if (!!err) {
      throw new Error(err);
    }

    var lines = data.toString().split('\n');
    var rows = [];

    lines.forEach(function (line) {
      line = line.trim();
      if (!line || line.match(/^#/)) {
        return;
      }
      var row = line.split('|');
      rows.push(row);
    });

    cb(rows);
  });
}

function initdb (rows) {
  var table = 'ar';
  db = new sqlite3.Database('data/qurandb');
  db.serialize(function () {
    db.run('CREATE TABLE ' + table + ' (chapter INTEGER,verse INTEGER, ' + table + ' TEXT)', function (err) {
      // handle error
      if (!!err) {
        throw new Error(err);
      }

      var stmt = db.prepare('INSERT INTO ' + table + ' VALUES (?,?,?)');
      rows.forEach(function (row, index) {
        stmt.run(row);
        if (index % 1000 === 0) {
          stmt.finalize();
          stmt = db.prepare('INSERT INTO ' + table + ' VALUES (?,?,?)');
        }
      });

      loadmeta();
    });
  });
}

function loadmeta () {
  db.serialize(function () {
    var sql = 'CREATE TABLE chapters (start INTEGER, ayas INTEGER, ord INTEGER, rukus INTEGER, arname TEXT, tname TEXT, ' +
      'enname TEXT, type TEXT, id INTEGER);';
    db.run(sql, function (err) {
      if (!err) {
        var stmt = db.prepare('INSERT INTO chapters values (?,?,?,?,?,?,?,?,?)');
        QuranData.Sura.forEach(function (x, idx) {
          if (idx && idx < 115) {
            x.push(idx);
            stmt.run(x);
          }
        });
        stmt.finalize();
      } else {
        console.log(err);
      }
    });

    db.run('create table juz (surah INTEGER, ayah INTEGER, id INTEGER)', function (err) {
      if (!err) {
        var stmt = db.prepare('INSERT INTO juz values (?,?,?)');
        QuranData.Juz.forEach(function (x, idx) {
          x.push(idx);
          stmt.run(x);
        });
        stmt.finalize();
      } else {
        console.log(err);
      }
    });
  });
}

(function main () {
  readFile(process.argv[2], initdb);
}());
