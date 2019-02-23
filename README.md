quran
==========

node.js interface to Holy Quran. See the javascript and websql versions at http://qzaidi.github.io/quran.

Installation
------------

npm install quran

Usage
-----

var quran = require('quran');

Fetch the first verse of second chapter

```
quran.get(2,1,function(err,verse) {
  if (!err) {
    console.log('Verse 1: Chapter 1: ' + verse.arabic);
  }
});
```

Fetch the first chapter

```
quran.get(1,function(err,verses) {
  if (!err) {
    console.log('Chapter 1: ' + verses.join(','));
  }
});
```
verses is an array, so you can join them in the above.

.get is simply a wrapper on select, so you can directly invoke it
and do advanced filtering, like getting verse 2-4 of first chapter.

```
quran.select({ chapter: 1}, { offset: 1, limit: 3}, function(err,verses) {
  if (!err) {
    console.log(verses);
  }
});

[
  { chapter: 1,
    verse: 1,
    ar: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' },
  { chapter: 1,
    verse: 2,
    ar: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ' },
  { chapter: 1, verse: 3, ar: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' } 
]
```
verses is an array of objects, and has additional info (chapter number, verse number).

The second argument to select is optional. 

If you want to fetch multiple verses, not necessarily in sequence, use an array to specify this.

```
quran.select({ chapter: 1, verse: [ 2, 4, 6 ]}, function(err,verses) {
  if (!err) {
    console.log(verses);
  }
});

[ { chapter: 1,
    verse: 2,
    ar: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ'
  },
  { 
    chapter: 1, 
    verse: 4, 
    ar: 'مَٰلِكِ يَوْمِ ٱلدِّينِ' 
  },
  { chapter: 1,
    verse: 6,
    ar: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ'
  } 
]

```

Currently, only arabic text and english, hindi and urdu translations are supported, to limit package size.
You can however, easily add translations to this package. Open an issue if you want to.

To fetch both the arabic text and translation, set the language option to en.

```
quran.select({ chapter: 1}, { offset: 1, limit: 3, language: 'en'}, function(err,verses) {
  if (!err) {
    console.log(verses);
  }
});
```
Similarly for hindi

```
Code:
quran.select({ chapter: 1}, { offset: 1, limit: 3, language: 'hi'}, function(err,verses) {
  if (!err) {
    console.log(verses);
  }
});
Output
[ 
  { chapter: 1,
    verse: 1,
    ar: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    hi: 'अल्लाह के नाम से जो रहमान व रहीम है।',
    translator: 'hindi' },
  { chapter: 1,
    verse: 2,
    ar: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
    hi: 'तारीफ़ अल्लाह ही के लिये है जो तमाम क़ायनात का रब है।',
    translator: 'hindi' },
  { chapter: 1,
    verse: 3,
    ar: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    hi: 'रहमान और रहीम है।',
    translator: 'hindi' } 
]
```

Want multiple translations at once? Use an array when specifying language

```
quran.select({ chapter: 1, verse: [ 2, 4, 6 ]}, 
             { language: ['ur', 'en ] }, function(err,verses) {
  if (!err) {
    console.log(verses);
  }
});

[ { chapter: 1,
    verse: 2,
    ar: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
    en: 'All praise is due to Allah, the Lord of the Worlds.',
    ur: 'ساری تعریف اللہ کے لئے ہے جو عالمین کا پالنے والا ہے'
  },
  { chapter: 1,
    verse: 4,
    ar: 'مَٰلِكِ يَوْمِ ٱلدِّينِ',
    en: 'Master of the Day of Judgment.',
    ur: 'روزِقیامت کا مالک و مختار ہے' 
  },
  { chapter: 1,
    verse: 6,
    ar: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ',
    en: 'Keep us on the right path.',
    ur: 'ہمیں سیدھے راستہ کی ہدایت فرماتا رہ' 
  } 
] 
```

You can also fetch meta data about a chapter 

```
quran.chapter(1,function(err,info) {
  if (!err) {
    console.log(info);
  }
});
```
Or all the chapters, by omitting the optional argument

```
quran.chapter(function(err,info) {
  if (!err) {
    console.log(info);
  }
});

```

To access by juz, for example, first 10 verses of juz 28, use this pattern

```
quran.juz(28,function(err,j) {
  console.log(err || j[0]);
  if (!err) {
    quran.select({ chapter: j[0].surah }, { offset: j[0].ayah-1, limit: 10 }, function(err,verses) {
      console.log(err || verses);
    });
  }
});
```

To search in a translation, use the search API

```
quran.search('en','islam',function(err,verses) {
  // verses is an array of verses matching 'islam'
});
```

See Also
----
The npm module stores quran db as a sqlite database and exposes it via an API. With webSQL, it is possible to do the same for a pure javascript application, without requiring a server side component. That's the idea behind [Quran browser](http://qzaidi.github.io/quran). There is also a javascript version which pulls data from a [google spreadsheet] (http://qzaidi.github.io/quran/javascript), and another one using [firebase](http://qzaidi.github.io/quran/javascript), which can be easily embedded on a website.

Linting
-------

You can run eslint to check your code for best practices: http://eslint.org/. A local install of eslint as well as the
the standard linting rule set is included as part of dev dependencies for this package and you can use the following 
convenient command to run the linter on all JavaScript files in this package:

```bash
npm run lint
```

Run Unit Tests
--------------

Some basic tests are included, which are written using ava: https://github.com/avajs. Here's how you install ava:

```bash
npm install -g ava
```

Once you have ava, you can run the tests:

```bash
npm test
```

Credits
-------

This work is based on Quran Text and Translations made available by http://tanzil.net. 

Sites using this package
------------------------

http://duas.mobi/quran.

To add yours, submit a pull request.

Known Issues
------------

quran.select has some unsafe joins to fetch translations and can be abused. User should sanitise what is passed in as language options, or they 
could use quran.safe to wrap the calls (see test/select.js#FetchUnsupportedLanguage)
