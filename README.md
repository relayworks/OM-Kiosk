# OM-Kiosk

Local Next.js standalone kiosk server for the OM exhibition kiosk.

## Run

```bash
cd web
npm install
npm run build
HOST=0.0.0.0 PORT=3000 ADMIN_TOKEN=change-me npm run start:standalone
```

Pages:

- Kiosk: `http://SERVER_IP:3000/coverflow`
- Controller: `http://SERVER_IP:3000/controller`
- Admin: `http://SERVER_IP:3000/admin`

## Content

Editable content lives outside the app bundle:

```txt
content/
  collect.yml
  figures.yml
  videos.yml
  media/
```

The YAML files are tracked in Git. Runtime media uploads and backups are ignored:

```txt
content/media/
content/backups/
content/.uploads/
```

This keeps the code repository light and avoids GitHub's large-file limits.

## Media Recommendation

Use Git for source code and YAML only. Keep large media in one of these:

1. A separate media archive delivered to the kiosk machine.
2. Tailscale/SFTP/manual sync into `content/media`.
3. Git LFS only if the project really needs versioned media history.

Current recommendation: keep `content/media` out of Git and back it up separately. The admin uploader creates timestamped filenames, so browsers can cache `/media` aggressively while YAML points to the current file.

Hard-coded PIP assets are also ignored from Git because they are large and layout-specific. Restore them separately under:

```txt
web/public/PIP/
```

## Useful Scripts

```bash
cd web
npm run content:init
npm run content:migrate-media
npm run build
```

## Cache Policy

- `/media/*`: long-lived cache, default 30 days.
- `/api/content/*`: `no-store`, always fresh.

Override media cache duration:

```bash
MEDIA_CACHE_SECONDS=604800 npm run start:standalone
```
