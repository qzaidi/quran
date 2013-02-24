quran
==========

node.js interface to Holy Quran

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

Currently, only arabic text and a single english translation is supported ( M H Shakir). To fetch both the arabic text and translation,
set the language option to en.

```
quran.select({ chapter: 1}, { offset: 1, limit: 3, language: 'en'}, function(err,verses) {
  if (!err) {
    console.log(verses);
  }
});
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
