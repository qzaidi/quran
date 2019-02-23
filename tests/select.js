'use strict';
var test = require('ava');
var q = require('q');
var quran = require('../quran/index');


// Fetching a chapter in arabic via select
test.serial('SelectChapter', t => {

  var deferred = q.defer();

  quran.select({ chapter: 1 }, function (err, v) {
    if (!!err) {
      deferred.reject(err);
    } else {
      // run tests
      t.is(v.length, 7); // TEST: Surah Fatiha has 7 ayahs
      t.truthy(v[2]['ar']); // TEST: Arabic text must be included by default
      t.is(v[2]['ar'], 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'); // TEST: Arabic text of the 3rd ayah of Surah Fatiha matches

      deferred.resolve(v);
    }
  });

  return deferred.promise;
});

// Fetching a chapter in urdu via select
test.serial('SelectChapterInUrdu', t => {
  var deferred = q.defer();

  quran.select({ chapter: 1 }, { language: 'ur' }, function (err, v) {
    if (!!err) {
      deferred.reject(err);
    } else {
      // run tests
      t.is(v.length, 7); // TEST: Surah Fatiha has 7 ayahs
      t.truthy(v[2]['ar']); // TEST: Arabic text must be included by default
      t.is(v[2]['ur'], 'وہ عظیم اوردائمی رحمتوں والا ہے'); // TEST: Urdu text of the 3rd ayah of Surah Fatiha matches

      deferred.resolve(v);
    }
  });

  return deferred.promise;
});

// Fetching some top verses from a chapter in arabic via select
test.serial('SelectTopVersesFromChapter', t => {
  var deferred = q.defer();

  quran.select({ chapter: 1 }, { limit: 3 }, function (err, v) {
    if (!!err) {
      deferred.reject(err);
    } else {
      // run tests
      t.is(v.length, 3); // TEST: Surah Fatiha has 7 ayahs, of which we are fetching 3
      t.truthy(v[2]['ar']); // TEST: Arabic text must be included by default
      t.is(v[2]['ar'], 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'); // TEST: Arabic text of the 3rd ayah of Surah Fatiha matches

      deferred.resolve(v);
    }
  });

  return deferred.promise;
});

// Fetching some random verses from a chapter in urdu and english via select
test.serial('SelectRandomVersesFromChapterMultipleLanguages', t => {
  var deferred = q.defer();

  quran.select({ chapter: 1, verse: [2, 4, 6] }, { language: ['en', 'ur'] }, function (err, v) {
    if (!!err) {
      deferred.reject(err);
    } else {
      // run tests
      t.is(v.length, 3); // TEST: Surah Fatiha has 7 ayahs, of which we are fetching 3
      t.truthy(v[1]['ar']); // TEST: Arabic text must be included by default
      t.is(v[1]['ur'], 'روزِقیامت کا مالک و مختار ہے'); // TEST: Urdu text of the 4th ayah of Surah Fatiha matches
      t.is(v[1]['en'], 'Master of the Day of Judgment.'); // TEST: English text of the 4th ayah of Surah Fatiha matches

      deferred.resolve(v);
    }
  });

  return deferred.promise;
});

// fetch a random lang that is not loaded in db
test.serial('FetchUnsupportedLanguage', t => {
  var deferred = q.defer();

  var cb = function() {
    console.log('inside cb');
    quran.select({ chapter: 1, verse: 2}, { debug: true, language: [  'kr', 'ur'] },function(err,v) {
      if (!!err) {
        deferred.reject(err);
      } else {
        t.is(v.length,1);
      }
    });
  }

  quran.safe(cb);

});
