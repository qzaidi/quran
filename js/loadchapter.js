/* stuff that we will use from outside */
var $;
var dust;
var document;

function loadchapter(e,data) {
  "use strict";

  var arabdigits = [ '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧',  '٨','٩' ];

  function toArabDigits(num) {
    var anum = '';
    num = Number(num);
    while (num) {
      anum += arabdigits[num%10]; 
      num = Math.floor(num/10,0);
    }
    return anum;
  }

  function errCallback(tx,err){
    console.log("Oh noes! There haz bin a datamabase error!");
    console.log(err);
  }

  var db = openDatabase("quran", "1.0", "Offline Quran DB", 32678);

  var loadChapter = function(idx,successCallback) {
    db.transaction(function(transaction){
      transaction.executeSql("SELECT * FROM metadata where id = ?;",[idx],
      function(tx,info) {
        transaction.executeSql(("SELECT * FROM quran where chapter = ?;"),[idx],
          function(tx, verses){
            successCallback(verses,info);
          }, errCallback);
      }, errCallback);
    });
  };

 var idx = ($.mobile.chapter || 'surah=1').split('=')[1];
 if (idx < 1 || idx > 114) {
  idx = 1;
 }

 loadChapter(idx,function(res,info) {
   var i,item,data,title;
   var len = res.rows.length;
   var items = [];
   for (i = 0; i < len; i++) {
     item = res.rows.item(i);
     data = {
      verse: toArabDigits(item.verse),
      ar: item.ar
     };
     items.push(data);
   }
   title = info.rows.item(0);
   dust.render("surat",{ verses: items }, function(err,out) {
     $('#surat').html(out);
   });
   $('#name').text(title.arname);
   $('#header').text(title.enname + '-' + title.tname);
 });
}

$(document).on('pagebeforeshow','#offquran',loadchapter);

