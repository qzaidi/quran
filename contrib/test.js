var fs = require('fs');
var crypto = require('crypto');
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

fs.readFile('quran-uthmani.txt', { encoding: 'utf-8' }, function(err,data) {
/*
    var pos = 0;
    var md5sum = crypto.createHash('md5');
    do {
      pos = data.indexOf('\n');
      md5sum.update(data.substr(0,pos));
      data = data.substr(pos+1);
    } while(pos != -1);
    console.log(md5sum.digest('hex'));
*/

  runSuite(data);
});

function runSuite(data) {
  suite.add('splitandproc', function() {
    var lines = data.split('\n');
    var md5sum = crypto.createHash('md5');
    for (var i = 0; i < lines.length; i++) {
      md5sum.update(lines[i]); 
    }
    md5sum.digest('hex');
  })
  .add('linebyline', function() {
    var pos = 0;
    var md5sum = crypto.createHash('md5');
    do {
      pos = data.indexOf('\n');
      md5sum.update(data.substr(0,pos));
      data = data.substr(pos+1);
    } while(pos != -1);
    md5sum.digest('hex');
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
  })

  .run({ async: true });
}
