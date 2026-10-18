/* stuff that we will use from outside */
var $;
var dust;
var document;

function loadchapter(e,data) {
  "use strict";

  var arabdigits = [ '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧',  '٨','٩' ];

  function toArabDigits(num) {
    return String(num).split('').map(function (digit) {
      return arabdigits[Number(digit)];
    }).join('');
  }

  var idx = ($.mobile.chapter || 'surah=1').split('=')[1];
  if (idx < 1 || idx > 114) {
    idx = 1;
  }

  Promise.all([
    QuranStore.whenPopulated().then(function () { return QuranStore.getChapter(idx); }),
    QuranStore.whenPopulated().then(function () { return QuranStore.getMeta(idx); })
  ]).then(function (result) {
    var verses = result[0] || [];
    var title = result[1];

    verses.sort(function (a, b) { return a.verse - b.verse; });

    var items = verses.map(function (verse) {
      return {
        verse: toArabDigits(verse.verse),
        ar: verse.ar
      };
    });

    dust.render("surat", { verses: items }, function (err, out) {
      if (err) {
        console.log(err);
        return;
      }
      $('#surat').html(out);
    });

    if (title) {
      $('#name').text(title.arname);
      $('#header').text(title.enname + '-' + title.tname);
    }
  }).catch(function (err) {
    console.log("Could not load this chapter");
    console.log(err);
    $('#header').text('Could not load this chapter');
  });
}

$(document).on('pagebeforeshow','#offquran',loadchapter);
