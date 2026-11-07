# Chrome Web Store listing

Copy each field into the matching box in the Developer Dashboard.

## Store listing tab

**Name:** Tab Refresh

**Summary** (from manifest, max 132 chars):
Auto refresh the current tab on a timer. Set the delay in seconds, press Start, and watch the countdown.

**Description:** Copy all of `store/description.txt`.

**Category:** Productivity → Tools

**Language:** English

**Graphic assets:**
- Store icon: `icons/icon128.png`
- Screenshots (1280x800, upload in this order):
  1. `store/screenshot-1-countdown.png`
  2. `store/screenshot-2-set-delay.png`
  3. `store/screenshot-3-any-tab.png`
  4. `store/screenshot-4-private.png`
- Small promo tile: `store/promo-small-440x280.png`

## Privacy tab

**Single purpose:**
Tab Refresh has one purpose: to automatically reload a browser tab at a time interval the user sets. The user opens the popup, enters a delay in seconds, and presses Start. The tab then reloads on that timer, with a countdown, until the user presses Stop or closes the tab.

**Alarms justification:**
The alarms permission is used to schedule the tab reload when the user sets a delay of 30 seconds or more. Chrome alarms keep the timer running reliably after the popup is closed and while the background service worker is asleep. An alarm is only created when the user presses Start, and it is cleared when they press Stop or close the tab.

**Storage justification:**
The storage permission is used to remember which tabs are being refreshed, their delay, and when they started. This lets the popup show the status and countdown, and lets the timer resume if the background service worker restarts. Only chrome.storage.session is used, so the data stays on the device, is never sent anywhere, and is cleared when the browser closes.

**Remote code:** No, I am not using remote code.

**Data usage:** Tick none of the data types. Tick all three certification boxes.

**Privacy policy URL:** https://github.com/fakhar-ud-din/simple-tab-refresher/blob/main/store/privacy-policy.md
