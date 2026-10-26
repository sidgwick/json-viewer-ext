# JSON Viewer Chrome extension

This project is a Chrome extension wrapper around [sidgwick/json-viewer](https://github.com/sidgwick/json-viewer). The upstream viewer lives in `json-viewer/`; this project adds the Chrome extension integration.

This extension reuses the viewer source in `json-viewer` to format top-level HTTP(S) pages served with `Content-Type: application/json`. It preserves the original page if the JSON cannot be parsed. The extension build compiles the viewer as a regular Svelte component because Chrome's JSON document does not provide a usable custom element registry to content scripts.

## Build and install

```sh
npm install
npm run build
```

Open `chrome://extensions`, enable **Developer mode**, select **Load unpacked**, and choose this directory's `dist` folder. After a rebuild, click the extension's reload button there, then reload any already-open JSON tab.

The extension runs on HTTP(S) tabs. Chrome does not inject content scripts into internal pages; local `file://` pages are outside the configured match patterns.
