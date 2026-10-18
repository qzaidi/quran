var QuranData;
var $;

var TOTAL_CHAPTERS = 114;
var TOTAL_VERSES = 6236;

function showTOC() {
  "use strict";

  QuranStore.getAll("metadata").then(function (items) {
    items.sort(function (a, b) { return a.id - b.id; });
    dust.render("chapters", { chapters: items }, function (err, out) {
      if (err) {
        console.log(err);
        return;
      }
      // Re-rendering the list must not stack a second copy of it.
      $('#chapterlist').empty().append(out).listview('refresh');
    });
  }).catch(function (err) {
    console.log("Could not read the chapter list");
    console.log(err);
  });
}

function init() {
  "use strict";

  (function() {
    $(window).scroll(function() {
      if($(this).scrollTop() > 150) {
        $('#toTop').fadeIn();
      } else {
        $('#toTop').fadeOut();
      }
    });

    $('#toTop').click(function() {
      $('body,html').animate({scrollTop:0},800);
    });
  }());

  function status(message) {
    $.mobile.showPageLoadingMsg('e', message);
  }

  // [start, ayas, order, rukus, arabic name, transliteration, english name, type]
  function metadataRows() {
    return QuranData.Sura.slice(1, TOTAL_CHAPTERS + 1).map(function (sura, i) {
      return {
        id: i + 1,
        start: sura[0],
        ayas: sura[1],
        ord: sura[2],
        rukus: sura[3],
        arname: sura[4],
        tname: sura[5],
        enname: sura[6],
        type: sura[7]
      };
    });
  }

  // contrib/quran-uthmani.txt is chapter|verse|text per line, with a Tanzil
  // copyright block at the end that must not be mistaken for verses.
  function parseVerses(text) {
    var rows = [];
    text.split('\n').forEach(function (line) {
      var parts = line.split('|');
      if (parts.length < 3) {
        return;
      }
      var chapter = parseInt(parts[0], 10);
      var verse = parseInt(parts[1], 10);
      if (!chapter || !verse) {
        return;
      }
      rows.push({ chapter: chapter, verse: verse, ar: parts.slice(2).join('|') });
    });
    return rows;
  }

  function downloadVerses() {
    return fetch('contrib/quran-uthmani.txt').then(function (response) {
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      return response.text();
    }).then(function (text) {
      var rows = parseVerses(text);
      if (rows.length !== TOTAL_VERSES) {
        throw new Error('Expected ' + TOTAL_VERSES + ' verses, parsed ' + rows.length);
      }
      status('Saving Quran text for offline viewing ...');
      return QuranStore.replaceAll('quran', rows);
    });
  }

  function downloadMetadata() {
    status('Loading Quran metadata ...');
    return QuranStore.replaceAll('metadata', metadataRows());
  }

  status('Loading ...');

  Promise.all([
    QuranStore.count('metadata'),
    QuranStore.count('quran')
  ]).then(function (counts) {
    var haveMetadata = counts[0] === TOTAL_CHAPTERS;
    var haveVerses = counts[1] === TOTAL_VERSES;

    if (haveMetadata && haveVerses) {
      $.mobile.hidePageLoadingMsg();
      QuranStore.markPopulated();
      showTOC();
      return;
    }

    // The two halves are independent, so a half-finished first visit only
    // re-downloads the half that is missing.
    var work = Promise.resolve();
    if (!haveMetadata) {
      work = work.then(downloadMetadata);
    }
    if (!haveVerses) {
      status('Downloading Quran text ...');
      work = work.then(downloadVerses);
    }

    return work.then(function () {
      $.mobile.hidePageLoadingMsg();
      QuranStore.markPopulated();
      showTOC();
    });
  }).catch(function (err) {
    console.log('Could not prepare the offline copy');
    console.log(err);
    status('Could not load the Quran text. Check your connection and reload.');
    // Let the reader report its own empty state rather than hang on "Loading".
    QuranStore.markPopulated();
  });
}

// A deep link straight to a chapter (#offquran?surah=N) never initialises the
// table-of-contents page, so pageinit alone would leave the reader hanging on
// "Loading ...". Run the same work on ready in that case, once only.
var started = false;
function start() {
  if (started) {
    return;
  }
  started = true;
  init();
}

$(document).on('pageinit','#quranOffline', start);

$(function () {
  if (window.location.hash.indexOf('#offquran') === 0) {
    start();
  }
});

$( document ).on( "pagebeforechange", function( e, data ) {
  if (typeof data.toPage === 'string') {
    if (data.toPage.indexOf('#offquran') > 1){
      $.mobile.chapter = data.toPage.substring(data.toPage.indexOf('?')+1);
    }
  }
});
