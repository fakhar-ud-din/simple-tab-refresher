const ALARM_PREFIX = 'refresh-';
const ALARM_MIN_SECONDS = 30;
const intervals = new Map();

async function getActiveTabs() {
  const { activeTabs = {} } = await chrome.storage.session.get('activeTabs');
  return activeTabs;
}

function reloadTab(tabId) {
  chrome.tabs.reload(tabId).catch(() => stop(tabId));
}

function clearTimer(tabId) {
  clearInterval(intervals.get(tabId));
  intervals.delete(tabId);
  chrome.alarms.clear(ALARM_PREFIX + tabId);
}

// Chrome alarms can't fire faster than 30s, so short delays use setInterval.
// Each reload call keeps the service worker awake between ticks.
function startTimer(tabId, seconds) {
  clearTimer(tabId);

  if (seconds >= ALARM_MIN_SECONDS) {
    chrome.alarms.create(ALARM_PREFIX + tabId, { periodInMinutes: seconds / 60 });
    return;
  }

  const intervalId = setInterval(() => reloadTab(tabId), seconds * 1000);
  intervals.set(tabId, intervalId);
}

async function start(tabId, seconds) {
  startTimer(tabId, seconds);

  const activeTabs = await getActiveTabs();
  activeTabs[tabId] = { seconds, startedAt: Date.now() };
  await chrome.storage.session.set({ activeTabs });

  return activeTabs[tabId];
}

async function stop(tabId) {
  clearTimer(tabId);

  const activeTabs = await getActiveTabs();
  delete activeTabs[tabId];
  await chrome.storage.session.set({ activeTabs });
}

const handlers = {
  start: ({ tabId, seconds }) => start(tabId, seconds),
  stop: ({ tabId }) => stop(tabId),
  status: async ({ tabId }) => (await getActiveTabs())[tabId],
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handlers[message.action](message).then(sendResponse);
  return true;
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (!alarm.name.startsWith(ALARM_PREFIX)) {
    return;
  }

  const tabId = Number(alarm.name.slice(ALARM_PREFIX.length));
  reloadTab(tabId);
});

chrome.tabs.onRemoved.addListener((tabId) => stop(tabId));

// Restart short timers if the service worker was restarted.
getActiveTabs().then(async (activeTabs) => {
  for (const [tabId, { seconds }] of Object.entries(activeTabs)) {
    if (seconds < ALARM_MIN_SECONDS) {
      await start(Number(tabId), seconds);
    }
  }
});
