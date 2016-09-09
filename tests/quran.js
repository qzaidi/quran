'use strict';
var test = require('ava');
var q = require('q');
var quran = require('../index');

// Fetching verse 1 of Al Fatiha via get
test.serial('GetVerse', t => {
  var deferred = q.defer();

  quran.get(1, 3, function (err, v) {
    if (!!err) {
      deferred.reject(err);
    } else {
      // run tests
      t.is(v.length, 1); // TEST: Surah Fatiha has 7 ayahs, of which we are fetching the 3rd
      t.is(v[0], 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'); // TEST: Arabic text of the 3rd ayah of Surah Fatiha matches

      deferred.resolve(v);
    }
  });

  return deferred.promise;
});

// Fetching chapter 1 - Al Fatiha via get
test.serial('GetChapter', t => {
  var deferred = q.defer();

  quran.get(1, function (err, v) {
    if (!!err) {
      deferred.reject(err);
    } else {
      // run tests
      t.is(v.length, 7); // TEST: Surah Fatiha has 7 ayahs
      t.is(v[2], 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'); // TEST: Arabic text of the 3rd ayah of Surah Fatiha matches

      deferred.resolve(v);
    }
  });

  return deferred.promise;
});

// Fetch meta info about chapter 1
test.serial('GetSingleChapterMetadata', t => {
  var deferred = q.defer();

  quran.chapter(1, function (err, v) {
    if (!!err) {
      deferred.reject(err);
    } else {
      // run tests
      t.is(v.length, 1); // TEST: We are getting metadata for 1 chapter
      t.is(v[0].type, 'Meccan'); // TEST: Surah Fatiha is Meccan

      deferred.resolve(v);
    }
  });

  return deferred.promise;
});

// Fetch meta info about all chapters
test.serial('GetAllChapterMetadata', t => {
  var deferred = q.defer();

  quran.chapter(function (err, v) {
    if (!!err) {
      deferred.reject(err);
    } else {
      // run tests
      t.is(v.length, 114); // TEST: There are 114 surahs
      t.is(v[v.length - 1].type, 'Meccan'); // TEST: Surah Al-Nas is Meccan

      deferred.resolve(v);
    }
  });

  return deferred.promise;
});

// Fetch first 10 verses of juz 2
test.serial('GetVersesInJuz', t => {
  var deferred = q.defer();

  // fetch juz
  quran.juz(28, function (err, j) {
    if (!!err) {
      deferred.reject(err);
    } else {
      // now, fetch verses in juz
      quran.select({ chapter: j[0].surah }, { offset: j[0].ayah - 1, limit: 10 }, function (err, verses) {
        if (!!err) {
          deferred.reject(err);
        } else {
          // TEST: There are 10 verses fetched
          t.is(verses.length, 10);
          // TEST: Arabic text of the 6th verse of the juz matches
          t.truthy(verses[5]['ar'].startsWith('يَوْمَ يَبْعَثُهُمُ ٱللَّهُ جَمِيعًا فَيُنَبِّئُهُم بِمَا'));

          deferred.resolve(verses);
        }
      });
    }
  });

  return deferred.promise;
});
