/* Offline storage for the Quran browser.
 *
 * This used to be WebSQL: openDatabase() plus executeSql() on two tables.
 * Chrome removed WebSQL in version 119 and Firefox never shipped it, so on
 * any current browser openDatabase is undefined and the reader never gets
 * past its first statement. IndexedDB is the standards-based replacement and
 * keeps the same two logical tables:
 *
 *   metadata  { id, start, ayas, ord, rukus, arname, tname, enname, type }
 *   quran     { chapter, verse, ar }        (index: byChapter)
 *
 * Every method returns a promise. If IndexedDB is unavailable (a locked-down
 * or private-mode context) the store degrades to memory: reading still works
 * for the session, it just does not survive a reload.
 */
var QuranStore = (function () {
  "use strict";

  var DB_NAME = "quran";
  var DB_VERSION = 1;
  var STORES = ["metadata", "quran"];

  var dbPromise = null;
  var memory = null;
  var populated = {};
  populated.promise = new Promise(function (resolve) { populated.resolve = resolve; });

  function inMemory() {
    if (!memory) {
      memory = { metadata: [], quran: [] };
    }
    return memory;
  }

  function open() {
    if (dbPromise) {
      return dbPromise;
    }
    dbPromise = new Promise(function (resolve, reject) {
      if (typeof indexedDB === "undefined") {
        reject(new Error("IndexedDB unavailable"));
        return;
      }
      var request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = function () {
        var db = request.result;
        if (!db.objectStoreNames.contains("metadata")) {
          db.createObjectStore("metadata", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("quran")) {
          var verses = db.createObjectStore("quran", { keyPath: ["chapter", "verse"] });
          verses.createIndex("byChapter", "chapter", { unique: false });
        }
      };

      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error); };
      request.onblocked = function () { reject(new Error("IndexedDB blocked")); };
    });
    return dbPromise;
  }

  // Resolves once the database is open, or switches the whole store to the
  // in-memory fallback if it cannot be.
  function ready() {
    return open().catch(function (err) {
      if (!memory) {
        memory = { metadata: [], quran: [] };
        console.warn("QuranStore: falling back to memory storage (" + err.message + ")");
      }
      return null;
    });
  }

  function run(storeName, mode, work) {
    return ready().then(function (db) {
      if (!db) {
        return work(null);
      }
      return new Promise(function (resolve, reject) {
        var transaction = db.transaction(storeName, mode);
        var result;
        transaction.oncomplete = function () { resolve(result); };
        transaction.onerror = function () { reject(transaction.error); };
        transaction.onabort = function () { reject(transaction.error); };
        result = work(transaction.objectStore(storeName));
      });
    });
  }

  function requestResult(request) {
    return new Promise(function (resolve, reject) {
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error); };
    });
  }

  return {
    ready: ready,

    count: function (storeName) {
      return run(storeName, "readonly", function (store) {
        if (!store) {
          return Promise.resolve(inMemory()[storeName].length);
        }
        return requestResult(store.count());
      });
    },

    // Wholesale replace, used when (re)building the local copy.
    replaceAll: function (storeName, rows) {
      return run(storeName, "readwrite", function (store) {
        if (!store) {
          inMemory()[storeName] = rows.slice();
          return Promise.resolve(rows.length);
        }
        store.clear();
        rows.forEach(function (row) { store.put(row); });
        return Promise.resolve(rows.length);
      });
    },

    getAll: function (storeName) {
      return run(storeName, "readonly", function (store) {
        if (!store) {
          return Promise.resolve(inMemory()[storeName].slice());
        }
        return requestResult(store.getAll());
      });
    },

    getMeta: function (id) {
      return run("metadata", "readonly", function (store) {
        if (!store) {
          return Promise.resolve(inMemory().metadata.filter(function (row) {
            return row.id === Number(id);
          })[0] || null);
        }
        return requestResult(store.get(Number(id)));
      });
    },

    getChapter: function (chapter) {
      return run("quran", "readonly", function (store) {
        if (!store) {
          return Promise.resolve(inMemory().quran.filter(function (row) {
            return row.chapter === Number(chapter);
          }));
        }
        return requestResult(store.index("byChapter").getAll(Number(chapter)));
      });
    },

    // Reading a chapter can be asked for before the first visit has finished
    // downloading the text (a deep link straight to #offquran), so the reader
    // waits on this instead of reading an empty store.
    whenPopulated: function () {
      return populated.promise;
    },

    markPopulated: function () {
      populated.resolve();
    }
  };
}());
