// Simple background script that watches tab updates and notifies native app for matching distractors
const DISTRACTOR_DOMAINS = ['youtube.com', 'twitter.com', 'reddit.com', 'facebook.com', 'instagram.com'];

chrome.tabs.onActivated.addListener(async activeInfo => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  checkTab(tab);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') checkTab(tab);
});

function checkTab(tab) {
  if (!tab || !tab.url) return;
  try {
    const url = new URL(tab.url);
    const domain = url.hostname.replace('www.', '');
    const isDistractor = DISTRACTOR_DOMAINS.some(d => domain.includes(d));
    if (isDistractor) {
      // Send a native message to the host app indicating a distractor domain is active
      chrome.runtime.sendNativeMessage('com.yourdeskpet.host', { type: 'distractor', domain }, response => {
        // optional logging
      });
    } else {
      chrome.runtime.sendNativeMessage('com.yourdeskpet.host', { type: 'non-distractor', domain }, () => {});
    }
  } catch (e) { /* ignore */ }
}
