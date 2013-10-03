function toArabDigits(num) {
  var anum = '';
  var arabdigits = [ '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧',  '٨','٩' ];
  num = Number(num);
  while (num) {
    anum += arabdigits[num%10]; 
    num = Math.floor(num/10,0);
  }
  return anum;
}

var thisScript = document.currentScript || Array.prototype.slice.call(document.getElementsByTagName('script')).pop();
var chapter = thisScript.getAttribute('chapter')|0;
var verse = thisScript.getAttribute('verse')|0;
var selector = thisScript.getAttribute('selector');
var renderFunc = function(x) { 
  document.querySelector(selector).innerHTML = x.entry.content.$t + ' ﴿' + toArabDigits(verse) + '﴾ ';
};
var vnum = 0;
for (var i = 1; i < chapter; i++) {
  vnum += QuranData.Sura[i][1];
}
vnum += verse + 1; // compensate for header row
var gs = document.createElement('script');
gs.async="true";
gs.src = "https://spreadsheets.google.com/feeds/cells/0Aps7j0tW_eq0dFUzN3djMC1IUUYyMHV4VFhqRUhJSmc/od6/public/values/R" + vnum + "C3?alt=json-in-script&callback=renderFunc";
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(gs, s);
