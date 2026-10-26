import JsonViewer from "../json-viewer/src/lib/JsonViewer.svelte";
import JSONBigFix from "../json-viewer/src/utils/bignumber-json";

if (document.contentType.toLowerCase() === "application/json" && document.body) {
  const raw = document.body.textContent ?? "";

  try {
    const value = JSONBigFix.parse(raw);
    const mount = document.createElement("main");
    new JsonViewer({
      target: mount,
      props: { value, keyName: false, path: [], showActionForm: true },
    });

    document.body.replaceChildren(mount);
    document.body.classList.add("json-viewer-extension");
  } catch (error) {
    console.warn("JSON Viewer: failed to render response", error);
  }
}
