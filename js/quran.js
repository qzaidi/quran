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

/**
 *
 * Return a custom rendering function for a given selector
 *
 **/
function getRenderFunc(selector,trans,verse) { 
  var randnum = Math.random()*1000000|0;
  var func = 'quran' + randnum;
  window[func] = function(x) {
    if (x.entry && x.entry.content) {
      document.querySelector(selector).innerHTML = x.entry.content.$t + ' ﴿' + toArabDigits(verse) + '﴾ ';
    } else {
      document.querySelector(selector).innerHTML = x.table.rows.map(function(row,idx) {
        return row.c[0].v + '<nobr> ﴿' + toArabDigits(verse+idx) + '﴾ </nobr>';
      }).join('');
      if (trans) {
        document.querySelector(trans).innerHTML = x.table.rows.map(function(row,idx) {
          return row.c[1].v;
        }).join(' ');
      }
    }
  }
  return func;
}

function getDataSource(params) {
  var vnum = 0;
  var chapter = params.chapter;
  var verse = params.verse|0;
  var count = params.count|0;
  var chapter = params.chapter|0;
  var selector = params.selector;
  var trans = params.trans;
  var src = "https://spreadsheets.google.com/";
  var func = getRenderFunc(selector,trans,verse);
  var end;

  for (var i = 1; i < chapter; i++) {
    vnum += QuranData.Sura[i][1];
  }
  vnum += verse + 1; // compensate for header row
  if (count) {
    end = trans?'D':'C';
    src+="a/zaidi.me/tq?key=0Aps7j0tW_eq0dFUzN3djMC1IUUYyMHV4VFhqRUhJSmc&range=C" + vnum + "%3a"+end+(vnum+count)+"&tqx=responseHandler:" + func;
  } else {
    src+="feeds/cells/0Aps7j0tW_eq0dFUzN3djMC1IUUYyMHV4VFhqRUhJSmc/od6/public/values/R" + vnum + "C3?alt=json-in-script&callback=" + func ;
  }
  return src;
}

(function() {
  var thisScript = document.currentScript || Array.prototype.slice.call(document.getElementsByTagName('script')).pop();
  var params = {};
  [ 'chapter', 'verse', 'count', 'selector', 'trans' ].forEach(function(k) {
    var p =thisScript.getAttribute(k);
    if (p) {
      params[k] = p;
    }
  });
  var gs = document.createElement('script');
  gs.async="true";
  gs.src=getDataSource(params);
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(gs, s);
}());
