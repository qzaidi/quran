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
```
verses is an array of objects, and has additional info (chapter number, verse number).

You can also fetch meta data about a chapter 

```
quran.chapter(1,function(err,info) {
  if (!err) {
    console.log(info);
  }
});
```
Or all the chapters, by omitting the first argument
```
quran.chapter(function(err,info) {
  if (!err) {
    console.log(info);
  }
});
```
