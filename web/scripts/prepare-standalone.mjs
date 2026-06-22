import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const standaloneDir = path.join(root, ".next", "standalone");
const staticSource = path.join(root, ".next", "static");
const staticTarget = path.join(standaloneDir, ".next", "static");
const publicSource = path.join(root, "public");
const publicTarget = path.join(standaloneDir, "public");
const serverSource = path.join(root, "server.js");
const serverTarget = path.join(standaloneDir, "server.js");

if (!fs.existsSync(standaloneDir)) {
  throw new Error("Missing .next/standalone. Run next build first.");
}

fs.rmSync(staticTarget, { recursive: true, force: true });
fs.cpSync(staticSource, staticTarget, { recursive: true });

if (fs.existsSync(publicSource)) {
  fs.rmSync(publicTarget, { recursive: true, force: true });
  fs.cpSync(publicSource, publicTarget, { recursive: true });
}

fs.copyFileSync(serverSource, serverTarget);

console.log("Prepared standalone server assets.");
