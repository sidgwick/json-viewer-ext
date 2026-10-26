import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, renameSync, rmSync, readFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const version = JSON.parse(readFileSync(join(dist, "manifest.json"), "utf8")).version;
const chrome = process.env.CHROME_BIN ?? [
  "/opt/google/chrome/chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find(existsSync);
const key = resolve(process.env.CRX_KEY_PATH ?? join(homedir(), ".config/json-viewer-extension/private.pem"));
const generatedCrx = join(root, "dist.crx");
const generatedKey = join(root, "dist.pem");
const hasKey = existsSync(key);

if (!chrome) throw new Error("Chrome not found; set CHROME_BIN to its executable path.");
if (!hasKey && existsSync(generatedKey)) {
  throw new Error(`Found ${generatedKey}; move it to ${key} before packaging.`);
}

rmSync(generatedCrx, { force: true });
const profile = mkdtempSync(join(tmpdir(), "json-viewer-crx-"));
try {
  const args = [`--user-data-dir=${profile}`, `--pack-extension=${dist}`];
  if (process.platform === "linux") args.unshift("--no-sandbox", "--no-zygote");
  if (hasKey) args.push(`--pack-extension-key=${key}`);
  const result = spawnSync(chrome, args, { cwd: root, encoding: "utf8" });
  if (result.error) throw result.error;
  if (result.status !== 0 || !existsSync(generatedCrx)) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    throw new Error(`Chrome failed to package the extension (exit ${result.status}).`);
  }
} finally {
  rmSync(profile, { recursive: true, force: true });
}

if (!hasKey) {
  mkdirSync(dirname(key), { recursive: true, mode: 0o700 });
  renameSync(generatedKey, key);
  chmodSync(key, 0o600);
  console.log(`Created signing key: ${key}`);
}

const release = join(root, "release");
mkdirSync(release, { recursive: true });
const output = join(release, `json-viewer-extension-${version}.crx`);
renameSync(generatedCrx, output);
console.log(`Created ${output}`);
