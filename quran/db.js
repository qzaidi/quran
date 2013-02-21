"use strict";

var sqlite3 = require('sqlite3').verbose();

var dbopts = {
  'r': sqlite3.OPEN_READONLY,
  'w': sqlite3.OPEN_READWRITE
};

module.exports = function(dbfile,opt) {
  var db;
  var options = dbopts[opt || 'r'];
  var file = __dirname + '/../data/' + dbfile;
  console.log('opening db from ' + file);
  db = new sqlite3.Database(file, options);

  return db;
}
