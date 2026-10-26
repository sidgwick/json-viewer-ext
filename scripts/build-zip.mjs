import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const version = JSON.parse(readFileSync(join(dist, "manifest.json"), "utf8")).version;
const release = join(root, "release");
const output = join(release, `json-viewer-extension-${version}.zip`);

mkdirSync(release, { recursive: true });
rmSync(output, { force: true });

const result = spawnSync("zip", ["-q", "-r", output, "."], { cwd: dist, stdio: "inherit" });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

console.log(`Created ${output}`);
