// Toggle JavaScript for the current tab's site, then reload it.

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url) return;

  let url;
  try {
    url = new URL(tab.url);
  } catch (e) {
    // chrome://, about:, file pages with no parseable origin — nothing to do.
    return;
  }

  // contentSettings only applies to http/https pages.
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return;
  }

  // Match the whole domain (and subdomains) for this site.
  const pattern = `${url.protocol}//${url.hostname}/*`;
  const primaryUrl = url.origin + "/";

  // Read the current effective setting for this URL.
  const current = await new Promise((resolve) => {
    chrome.contentSettings.javascript.get({ primaryUrl }, (details) => {
      resolve(details ? details.setting : "allow");
    });
  });

  const next = current === "block" ? "allow" : "block";

  await new Promise((resolve, reject) => {
    chrome.contentSettings.javascript.set(
      { primaryPattern: pattern, setting: next },
      () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      }
    );
  });

  // Reflect state on the toolbar badge.
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: next === "block" ? "OFF" : "ON",
  });
  await chrome.action.setBadgeBackgroundColor({
    tabId: tab.id,
    color: next === "block" ? "#c0392b" : "#27ae60",
  });

  // Reload so the change takes effect.
  chrome.tabs.reload(tab.id);
});
