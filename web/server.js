import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import multer from "multer";
import next from "next";
import { Server } from "socket.io";
import * as yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 3000);
const workspaceRoot = path.resolve(process.cwd(), "..");
const adminToken = process.env.ADMIN_TOKEN || "";
const standaloneDir = path.join(process.cwd(), ".next", "standalone");
const appDir = fs.existsSync(path.join(__dirname, ".next"))
  ? __dirname
  : fs.existsSync(path.join(standaloneDir, ".next"))
    ? standaloneDir
    : process.cwd();
const contentDir = process.env.CONTENT_DIR || path.join(workspaceRoot, "content");
const mediaDir =
  process.env.MEDIA_DIR ||
  path.join(contentDir, "media");
const mediaCacheSeconds = Number(process.env.MEDIA_CACHE_SECONDS || 2592000);

const app = next({ dev, hostname, port, dir: appDir });
const handler = app.getRequestHandler();

const kiosk = {
  ready: false,
  busy: false,
  current: "idle",
  lastSeen: 0,
};

function getKioskStatus() {
  return {
    ready: kiosk.ready,
    busy: kiosk.busy,
    current: kiosk.current,
    lastSeen: kiosk.lastSeen,
  };
}

function attachSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  const emitKioskStatus = () => {
    io.emit("kiosk:status", getKioskStatus());
  };

  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);
    socket.emit("kiosk:status", getKioskStatus());

    socket.on("register", (role) => {
      console.log("Client registered", role, socket.id);
    });

    socket.on("kiosk:ready", (payload) => {
      kiosk.ready = true;
      kiosk.busy = false;
      kiosk.current = payload?.current ?? kiosk.current;
      kiosk.lastSeen = Date.now();
      emitKioskStatus();
    });

    socket.on("kiosk:heartbeat", () => {
      kiosk.ready = true;
      kiosk.lastSeen = Date.now();
      emitKioskStatus();
    });

    socket.on("kiosk:busy", (payload) => {
      kiosk.busy = true;
      kiosk.current = payload?.current ?? kiosk.current;
      kiosk.lastSeen = Date.now();
      emitKioskStatus();
    });

    socket.on("kiosk:done", (payload) => {
      kiosk.busy = false;
      kiosk.current = payload?.current ?? kiosk.current;
      kiosk.lastSeen = Date.now();
      emitKioskStatus();
    });

    socket.on("kiosk:get_status", (_, ack) => {
      const status = getKioskStatus();
      ack?.(status);
      socket.emit("kiosk:status", status);
    });

    socket.on("navigate", (direction) => {
      if (!kiosk.ready) {
        socket.emit("pageStatus", {
          state: "rejected",
          target: "navigate",
          reason: "NOT_READY",
        });
        return;
      }

      if (kiosk.busy) {
        socket.emit("pageStatus", {
          state: "rejected",
          target: "navigate",
          reason: "BUSY",
        });
        return;
      }

      io.emit("updateCoverflow", direction);
    });

    socket.on("changePage", (contentSelect) => {
      if (!kiosk.ready) {
        socket.emit("pageStatus", {
          state: "rejected",
          target: contentSelect,
          reason: "NOT_READY",
        });
        return;
      }

      if (kiosk.busy) {
        socket.emit("pageStatus", {
          state: "rejected",
          target: contentSelect,
          reason: "BUSY",
        });
        return;
      }

      socket.emit("pageStatus", { state: "accepted", target: contentSelect });
      kiosk.busy = true;
      kiosk.lastSeen = Date.now();
      emitKioskStatus();
      io.emit("changePage", contentSelect);
    });

    socket.on("highlightContent", (currentIndex) => {
      if (!kiosk.ready) {
        socket.emit("pageStatus", {
          state: "rejected",
          target: "highlightContent",
          reason: "NOT_READY",
        });
        return;
      }

      io.emit("handleContentChange", currentIndex);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });

  setInterval(() => {
    if (!kiosk.ready || !kiosk.lastSeen) return;
    if (Date.now() - kiosk.lastSeen < 15000) return;

    kiosk.ready = false;
    kiosk.busy = false;
    kiosk.current = "idle";
    emitKioskStatus();
  }, 5000);
}

const contentFiles = {
  collect: "collect.yml",
  figures: "figures.yml",
  videos: "videos.yml",
};

const allowedUploadTargets = new Set([
  "flowImg",
  "figures",
  "video",
  "videoThumb",
]);

const allowedUploadExts = {
  flowImg: new Set([".jpg", ".jpeg", ".png", ".webp"]),
  figures: new Set([".jpg", ".jpeg", ".png", ".webp"]),
  videoThumb: new Set([".jpg", ".jpeg", ".png", ".webp"]),
  video: new Set([".mp4"]),
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      const uploadTempDir = path.join(contentDir, ".uploads");
      fs.mkdirSync(uploadTempDir, { recursive: true });
      callback(null, uploadTempDir);
    },
    filename: (req, file, callback) => {
      const ext = path.extname(file.originalname || "").toLowerCase();
      callback(null, `upload-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 1024,
    files: 1,
  },
});

function ensureContentDirs() {
  fs.mkdirSync(contentDir, { recursive: true });
  fs.mkdirSync(path.join(contentDir, "backups"), { recursive: true });
  fs.mkdirSync(path.join(contentDir, ".uploads"), { recursive: true });
  fs.mkdirSync(mediaDir, { recursive: true });

  for (const target of allowedUploadTargets) {
    fs.mkdirSync(path.join(mediaDir, target), { recursive: true });
  }
}

function safeJoin(base, ...segments) {
  const target = path.resolve(base, ...segments);
  const root = path.resolve(base);

  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    throw new Error("INVALID_PATH");
  }

  return target;
}

function getContentFile(type) {
  const fileName = contentFiles[type];
  if (!fileName) {
    const error = new Error("UNKNOWN_CONTENT_TYPE");
    error.statusCode = 404;
    throw error;
  }

  return safeJoin(contentDir, fileName);
}

function readYamlFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return yaml.load(fs.readFileSync(filePath, "utf8")) ?? {};
}

function writeYamlFile(filePath, data) {
  if (fs.existsSync(filePath)) {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupName = `${path.basename(filePath, ".yml")}-${stamp}.yml`;
    fs.copyFileSync(filePath, path.join(contentDir, "backups", backupName));
  }

  fs.writeFileSync(
    filePath,
    yaml.dump(data, {
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    }),
  );
}

function getUploadFileName(file, requestedName) {
  const originalExt = path.extname(file.originalname || "").toLowerCase();
  const baseName = requestedName
    ? path.basename(requestedName, path.extname(requestedName))
    : path.basename(file.originalname || "upload", originalExt);
  const cleanedBase = baseName
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${cleanedBase || "upload"}-${Date.now()}${originalExt}`;
}

function attachContentServer(expressApp) {
  ensureContentDirs();

  expressApp.use(express.json({ limit: "10mb" }));
  expressApp.use(
    "/media",
    express.static(mediaDir, {
      acceptRanges: true,
      etag: true,
      immutable: true,
      lastModified: true,
      maxAge: `${mediaCacheSeconds}s`,
      setHeaders: (res) => {
        res.setHeader(
          "Cache-Control",
          `public, max-age=${mediaCacheSeconds}, immutable`,
        );
      },
    }),
  );

  expressApp.get("/api/content", (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.json({
      contentDir,
      mediaDir,
      types: Object.keys(contentFiles),
    });
  });

  expressApp.get("/api/content/:type", (req, res) => {
    try {
      const filePath = getContentFile(req.params.type);
      const data = readYamlFile(filePath);

      if (!data) {
        res.status(404).json({ error: "CONTENT_NOT_FOUND" });
        return;
      }

      res.setHeader("Cache-Control", "no-store");
      res.json(data);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  });

  expressApp.use(["/api/content/:type", "/api/upload"], (req, res, nextFn) => {
    if (req.method === "GET" || !adminToken) {
      nextFn();
      return;
    }

    if (req.get("x-admin-token") === adminToken) {
      nextFn();
      return;
    }

    res.status(401).json({ error: "UNAUTHORIZED" });
  });

  expressApp.put("/api/content/:type", (req, res) => {
    try {
      const filePath = getContentFile(req.params.type);
      writeYamlFile(filePath, req.body);
      res.setHeader("Cache-Control", "no-store");
      res.json({ ok: true, type: req.params.type });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  });

  expressApp.post("/api/upload", upload.single("file"), (req, res) => {
    try {
      const target = req.body?.target;
      if (!allowedUploadTargets.has(target)) {
        if (req.file?.path) fs.rmSync(req.file.path, { force: true });
        res.status(400).json({ error: "INVALID_UPLOAD_TARGET" });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: "MISSING_FILE" });
        return;
      }

      const ext = path.extname(req.file.originalname || "").toLowerCase();
      if (!allowedUploadExts[target].has(ext)) {
        fs.rmSync(req.file.path, { force: true });
        res.status(400).json({ error: "INVALID_FILE_TYPE" });
        return;
      }

      const fileName = getUploadFileName(req.file, req.body?.name);
      const targetDir = safeJoin(mediaDir, target);
      const filePath = safeJoin(targetDir, fileName);

      fs.renameSync(req.file.path, filePath);

      res.setHeader("Cache-Control", "no-store");
      res.json({
        ok: true,
        target,
        fileName,
        path: `/media/${target}/${fileName}`,
        size: req.file.size,
      });
    } catch (error) {
      if (req.file?.path) fs.rmSync(req.file.path, { force: true });
      res.status(500).json({ error: error.message });
    }
  });

  expressApp.use((error, req, res, nextFn) => {
    if (!req.url?.startsWith("/api/")) {
      nextFn(error);
      return;
    }

    res.status(error.statusCode || 400).json({
      error: error.type === "entity.parse.failed" ? "INVALID_JSON" : error.message,
    });
  });
}

app.prepare().then(() => {
  const expressApp = express();

  attachContentServer(expressApp);

  const httpServer = createServer((req, res) => {
    if (req.url?.startsWith("/media") || req.url?.startsWith("/api/")) {
      expressApp(req, res);
      return;
    }

    handler(req, res);
  });

  attachSocketServer(httpServer);

  httpServer.listen(port, hostname, () => {
    console.log(`Ready on http://${hostname}:${port}`);
    console.log(`Next app dir: ${appDir}`);
    console.log(`Content dir: ${contentDir}`);
    console.log(`Media dir: ${mediaDir}`);
    console.log(`Admin writes: ${adminToken ? "token protected" : "open"}`);
  });
});
