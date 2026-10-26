# JSON Viewer Chrome extension

This project is a Chrome extension wrapper around [sidgwick/json-viewer](https://github.com/sidgwick/json-viewer). The upstream viewer lives in `json-viewer/`; this project adds the Chrome extension integration.

This extension reuses the viewer source in `json-viewer` to format top-level HTTP(S) pages served with `Content-Type: application/json`. It preserves the original page if the JSON cannot be parsed. The extension build compiles the viewer as a regular Svelte component because Chrome's JSON document does not provide a usable custom element registry to content scripts.

## Build and install

```sh
git clone git@github.com:sidgwick/json-viewer.git json-viewer # if json-viewer/ is absent
npm install
npm run build
```

Open `chrome://extensions`, enable **Developer mode**, select **Load unpacked**, and choose this directory's `dist` folder. After a rebuild, click the extension's reload button there, then reload any already-open JSON tab.

The extension runs on HTTP(S) tabs. Chrome does not inject content scripts into internal pages; local `file://` pages are outside the configured match patterns.

## Packed CRX

```sh
npm run build:crx
```

This builds `dist/` and writes `release/json-viewer-extension-<version>.crx`. The first run creates a signing key at `~/.config/json-viewer-extension/private.pem`; later runs reuse it so the extension ID stays the same. Keep this key safe. Set `CHROME_BIN` if Chrome is installed at a different path, or `CRX_KEY_PATH` to use an existing signing key.

On Linux, you can drag the CRX onto `chrome://extensions` to try installing it locally. Windows and macOS generally require Chrome Web Store distribution or enterprise policy for extensions outside the store.

## ZIP for Chrome Web Store

```sh
npm run build:zip
```

This builds `dist/` and writes `release/json-viewer-extension-<version>.zip`, with `manifest.json` at the ZIP root. Upload the ZIP to the Chrome Web Store developer dashboard. For local developer mode, load the `dist/` directory instead.
