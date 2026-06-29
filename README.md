# Toggle JavaScript

A minimal Chrome extension (Manifest V3) that enables/disables JavaScript for the
current site with a **single click** on the toolbar icon, then reloads the tab so
the change takes effect.

## Features

- One-click toggle of JavaScript for the active site.
- Toolbar badge shows the current state: green **ON** / red **OFF**.
- Automatically reloads the tab after toggling.
- No popup, no options — just click the icon.

## How it works

When you click the toolbar icon (`background.js`):

1. Reads the current JavaScript content setting for the active tab's site.
2. Flips it (`allow` ⇄ `block`) for the site's domain pattern (`scheme://host/*`).
3. Updates the toolbar badge to reflect the new state.
4. Reloads the tab.

## Install (load unpacked)

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked** and select this folder.
4. Pin the extension and click it on any `http`/`https` page to toggle JavaScript.

## Project structure

```
manifest.json   # MV3 manifest (contentSettings + tabs permissions)
background.js   # toggle + reload logic
icons/          # 16 / 48 / 128 px icons
```

## Permissions

- `contentSettings` — to read and change the JavaScript setting per site.
- `tabs` — to read the active tab's URL and reload it.
- `host_permissions: <all_urls>` — so the toggle works on any site.

## Notes & limitations

- Chrome's `chrome.contentSettings.javascript` API works **per-site (domain)**, not
  strictly per-tab — there is no true per-tab JavaScript toggle in Chrome. Toggling
  on `example.com` therefore affects all tabs on that domain. The badge is set
  per-tab for clarity, but the underlying setting is per-site.
- Only `http`/`https` pages are affected. Pages like `chrome://`, `about:`, and the
  Chrome Web Store are skipped because the API cannot control them.
- The included icons are simple auto-generated "JS" badges — replace the PNGs in
  `icons/` with your own anytime.
