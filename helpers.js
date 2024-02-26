const eventStream = new EventStream();

const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
  let [resource, config] = args;

  let response = await originalFetch(resource, config);

  if (resource === "/zero/submit/") {
    const value = JSON.parse(config.body.get("code"));
    eventStream.publish(eventActions.addRecord, {
      timestamp: value.timestamp,
      data: config.body.get("code"),
      blockId: config.body.get(recordIdKey),
    });
  }

  return response;
};

async function isElementLoaded(selector, parent = document) {
  while (parent.querySelector(selector) === null) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return parent.querySelector(selector);
}

async function isAllElementLoaded(selector, count, parent = document) {
  while (parent.querySelectorAll(selector).length !== count) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return parent.querySelectorAll(selector);
}

async function delay(delayInms) {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
}

function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

/**
 * @param {string} url
 * @return {string}
 */
function getRecordId(url = location.search) {
  const searchParams = new URLSearchParams(url);

  return searchParams.get(recordIdKey) || "";
}
