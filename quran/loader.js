#!/usr/bin/env node
"use strict";

var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var util = require('util');

/* file format
 * arabic
 * blank
 * english
 * blank
 * the above repeats ...
 */
function readFile(file,cb) {
  fs.readFile(file, function(err,data) {
    var lines = data.toString().split('\n');
    var rows = [];
    var index = 0;
    var row = [];

    lines.forEach(function(line) {
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

function initdb(rows) {
  var db = new sqlite3.Database('qurandb');
  var table = process.argv[2];
  db.serialize(function() {
    db.run("CREATE TABLE " + table + " (arabic TEXT,verse INTEGER,chapter INTEGER)",function(err) {
      if (!err) {
        var stmt = db.prepare("INSERT INTO " + table + " VALUES (?,?,?)");
        rows.forEach(function(row,index) {
          stmt.run(row);
          if (index % 1000 == 0) {
            stmt.finalize();
            console.log('added 1000 verses');
            stmt = db.prepare("INSERT INTO " + table + " VALUES (?,?,?)");
          }
        });
      } else {
        console.log(err);
        console.log(row);
      }
    });

  });

}

(function main() {
  process.argv.shift();
  if (process.argv.length < 3) {
    console.log(util.format('Usage: %s <fileondisk> <table>',process.argv[0]));
    process.exit(1);
  }

  console.log('going to load ' + process.argv[1] + ' to table ' + process.argv[2]);

  readFile(process.argv[1],initdb);
}());
