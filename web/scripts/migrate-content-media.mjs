import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";

const root = process.cwd();
const workspaceRoot = path.resolve(root, "..");
const contentDir = process.env.CONTENT_DIR || path.join(workspaceRoot, "content");
const mediaDir = path.join(contentDir, "media");
const publicDir = path.join(root, "public");

const imageExts = [".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"];

function readYaml(fileName) {
  return yaml.load(fs.readFileSync(path.join(contentDir, fileName), "utf8")) ?? {};
}

function writeYaml(fileName, data) {
  fs.writeFileSync(
    path.join(contentDir, fileName),
    yaml.dump(data, {
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    }),
  );
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyDirFiles(source, target) {
  if (!fs.existsSync(source)) return;
  ensureDir(target);

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    fs.copyFileSync(path.join(source, entry.name), path.join(target, entry.name));
  }
}

function findPublicImage(baseName) {
  for (const ext of imageExts) {
    const filePath = path.join(publicDir, `${baseName}${ext}`);
    if (fs.existsSync(filePath)) return `${baseName}${ext}`;
  }

  return null;
}

function migrateCollect() {
  const data = readYaml("collect.yml");
  data.items = (data.items || []).map((item) => ({
    ...item,
    media: {
      ...(item.media || {}),
      cover: item.media?.cover || `/media/flowImg/${item.serial}.jpg`,
    },
  }));
  writeYaml("collect.yml", data);
}

function migrateFigures() {
  const data = readYaml("figures.yml");
  data.items = (data.items || []).map((item) => {
    const imageName = findPublicImage(item.nameEn);
    return {
      ...item,
      media: {
        ...(item.media || {}),
        portrait:
          item.media?.portrait ||
          (imageName ? `/media/figures/${imageName}` : ""),
      },
    };
  });
  writeYaml("figures.yml", data);
}

ensureDir(mediaDir);
copyDirFiles(path.join(publicDir, "flowImg"), path.join(mediaDir, "flowImg"));
copyDirFiles(path.join(publicDir, "videoThumb"), path.join(mediaDir, "videoThumb"));

const figuresDir = path.join(mediaDir, "figures");
ensureDir(figuresDir);
for (const entry of fs.readdirSync(publicDir, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  if (!imageExts.includes(path.extname(entry.name).toLowerCase())) continue;
  fs.copyFileSync(path.join(publicDir, entry.name), path.join(figuresDir, entry.name));
}

ensureDir(path.join(mediaDir, "video"));
migrateCollect();
migrateFigures();

console.log(`Migrated media and YAML references under ${contentDir}`);
