#!/usr/bin/env node
'use strict';

var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

var db;

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

/* file format
 * chapter|verse|text
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
      if (row.length > 3) {
        row[2] += row.pop();
      }
      rows.push(row);
    });

    cb(rows);
  });
}

function initdb (rows) {
  var trans = process.argv[2].split('/').pop();
  var sp = trans.split('.');
  var table = sp[0];
  var translator = sp[1];

  db = new sqlite3.Database('data/qurandb');
  db.serialize(function () {
    db.run('CREATE TABLE ' + table + ' (chapter INTEGER, verse INTEGER, ' + table + ' TEXT, translator TEXT)', function (err) {
      // handle error
      if (!!err) {
        throw new Error(err);
      }

      rows.forEach(function (row, index) {
        var stmt = db.prepare('INSERT INTO ' + table + ' VALUES (?,?,?,?)');
        row.push(translator);
        stmt.run(row);
        if (index % 1000 === 0) {
          stmt.finalize();
        }
      });
    });
  });
}

(function main () {
  readFile(process.argv[2], initdb);
}());
