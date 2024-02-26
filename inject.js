function addScript(src) {
  const s = document.createElement("script");
  s.defer = true;
  s.async = false;
  s.src = chrome.runtime.getURL(src);
  s.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

[
  "constants.js",
  "event-bus.js",
  "indexDB.js",
  "helpers.js",
  "db.js",
  "history-selector.js",
  "tilda-layout.js",
  "url-watcher.js",
  "app.js",
].forEach(addScript);
