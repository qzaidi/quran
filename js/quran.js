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
function getRenderFunc(params) { 
  var elem = params.elem;
  var selector = params.selector;
  var trans = params.trans;
  var verse = params.verse;
  var randnum = Math.random()*1000000|0;
  var func = 'quran' + randnum;

  window[func] = function(x) {
    // late resolution of elem 
    if (!elem) {
      elem = document.querySelector(params.selector);
    }
    if (x.entry && x.entry.content) {
      elem.innerHTML = x.entry.content.$t + ' ﴿' + toArabDigits(verse) + '﴾ ';
    } else {
      elem.innerHTML = x.table.rows.map(function(row,idx) {
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
  var func = getRenderFunc(params);
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
  var scripts = document.getElementsByTagName('script');
  var thisScript = document.currentScript || scripts[scripts.length-1];
  var params = {};
  var s = scripts[0];
  var gs,l;

  [ 'chapter', 'verse', 'count', 'selector', 'trans' ].forEach(function(k) {
    var p =thisScript.getAttribute(k);
    if (p) {
      params[k] = p;
    }
  });

  if (!params.selector) {
    l = document.createElement('link');
    l.setAttribute('rel','stylesheet');
    l.setAttribute('type','text/css');
    l.setAttribute('href', thisScript.getAttribute('src').replace('.js','.css'));
    s.parentNode.insertBefore(l,s);
    params.elem = document.createElement('div');
    params.elem.className = 'qarabic qdoublespaced';
    //params.elem.style.cssText="direction: rtl; line-height: 2.35em; font-size: 20px; word-spacing: 5px";
    thisScript.parentNode.insertBefore(params.elem,thisScript);
  }

  gs = document.createElement('script');
  gs.async="true";
  gs.src=getDataSource(params);
  s.parentNode.insertBefore(gs, s);
}());
