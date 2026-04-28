---
name: quran
description: |
  Query the Holy Quran — fetch verses, chapters, juz, and translations.
  Use when the user asks about Quran verses, surahs, chapters, juz,
  Arabic text, or translations (English, Urdu, Hindi).
allowed-tools:
  - Bash
  - Read
---

# Quran Skill

Interface to the Holy Quran via the local `quran` npm module (Node.js + SQLite).

## What It Does

- Fetch Arabic text and translations (en, ur, hi)
- Query by chapter (surah), verse (ayah), juz, or search text
- Supports single verses, verse ranges, arrays of verses, and full chapters

## Install

If this skill is not yet linked, run from the repo root:

```bash
ln -s "$(pwd)/.claude/skills/quran" ~/.claude/skills/quran
```

Or install via the helper:

```bash
gh install skill  # symlinks .claude/skills/quran → ~/.claude/skills/quran
```

## API Reference

```javascript
var quran = require('../../..');
```

The module root is three levels above this skill directory (`../../..`).

### `quran.get(chapter, [verse], callback)`

Fetch Arabic text only. Callback receives `(err, verses)` where `verses` is an array of Arabic strings.

```javascript
// Single verse
quran.get(2, 1, (err, v) => console.log(v[0]));
// → "الٓمٓ"

// Full chapter
quran.get(1, (err, verses) => console.log(verses.join('\n')));
```

### `quran.select(filters, [options], callback)`

Advanced query. Callback receives `(err, verses)` where each verse is an object:
`{ chapter, verse, ar, [lang...] }`.

```javascript
// Verses 2–4 of chapter 1 with English translation
quran.select({ chapter: 1 }, { offset: 1, limit: 3, language: 'en' }, (err, verses) => {
  verses.forEach(v => console.log(`${v.verse}: ${v.ar} — ${v.en}`));
});

// Specific verses by array
quran.select({ chapter: 1, verse: [2, 4, 6] }, (err, verses) => {
  console.log(verses);
});
```

**Filters:** `{ chapter, verse }` — `verse` can be a number or array of numbers.

**Options:**
- `offset` — skip N verses
- `limit` — return N verses
- `language` — translation code (`'en'`, `'ur'`, `'hi'`) or array of codes
- `debug` — print generated SQL

### `quran.chapter([chapterNum], callback)`

Get chapter metadata. Without `chapterNum`, returns all 114 chapters.

```javascript
quran.chapter(1, (err, info) => console.log(info));
// → [{ id: 1, name: 'Al-Faatiha', ... }]
```

### `quran.juz([juzNum], callback)`

Get juz (para) boundaries. `juzNum` must be 1–30.

```javascript
quran.juz(1, (err, juz) => console.log(juz));
// → [{ id: 1, chapter: 1, verse: 1, ... }]
```

### `quran.search(lang, text, callback)`

Search translations for text (LIKE match).

```javascript
quran.search('en', 'mercy', (err, results) => console.log(results));
// → [{ chapter: 1, verse: 1, en: 'In the name of Allah...' }, ...]
```

## Supported Languages

The SQLite database ships with:
- `ar` — Arabic (Uthmani script, default)
- `en` — English (Sahih International)
- `ur` — Urdu
- `hi` — Hindi

To check available translation tables at runtime:

```javascript
quran.safe(() => console.log(quran.langs));
```

## Usage Patterns

| Task | Method |
|------|--------|
| Read a single verse | `quran.get(chapter, verse, cb)` |
| Read a full chapter | `quran.get(chapter, cb)` |
| Read with translation | `quran.select({chapter}, {language: 'en'}, cb)` |
| Read a range | `quran.select({chapter}, {offset: 0, limit: 5}, cb)` |
| Search a word | `quran.search('en', 'word', cb)` |
| Chapter info | `quran.chapter(num, cb)` |
| Juz boundaries | `quran.juz(num, cb)` |

## Running in Claude

All examples below run from the **skill directory** (`.claude/skills/quran`).
The module is resolved via `../../..` (repo root).

```bash
node -e "var q=require('../../..'); q.get(1,1,(e,v)=>console.log(v[0]))"
```

Or write temporary scripts to `/tmp` and run them.

## Examples

**User:** "What is the first verse of Surah Al-Baqarah?"

```bash
node -e "var q=require('../../..'); q.get(2,1,(e,v)=>console.log(v[0]))"
```

**User:** "Show me the English translation of Surah Fatiha"

```bash
node -e "var q=require('../../..'); q.select({chapter:1},{language:'en'},(e,v)=>v.forEach(x=>console.log(x.verse+'. '+x.en)))"
```

**User:** "Search for verses about mercy"

```bash
node -e "var q=require('../../..'); q.search('en','mercy',(e,r)=>r.slice(0,5).forEach(v=>console.log(v.chapter+':'+v.verse+' '+v.en)))"
```
