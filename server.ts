import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const DATA_DIR = path.resolve(process.cwd(), 'server_data');
const FILES_DIR = path.join(DATA_DIR, 'files');
const META_DIR = path.join(DATA_DIR, 'meta');
const RESOURCES_FILE = path.join(DATA_DIR, 'resources.json');

// Ensure directories exist
for (const dir of [DATA_DIR, FILES_DIR, META_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readResourcesFromDisk(): any[] {
  try {
    if (!fs.existsSync(RESOURCES_FILE)) return [];
    const raw = fs.readFileSync(RESOURCES_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeResourcesToDisk(items: any[]): void {
  try {
    fs.writeFileSync(RESOURCES_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error writing resources to disk:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON body parser for metadata
  app.use('/api/resources', express.json({ limit: '50mb' }));

  // 1. GET all resources metadata
  app.get('/api/resources', (_req, res) => {
    const items = readResourcesFromDisk();
    res.json({ resources: items });
  });

  // 2. POST/Upsert single resource or bulk resources
  app.post('/api/resources', (req, res) => {
    const body = req.body;
    const current = readResourcesFromDisk();

    if (Array.isArray(body?.resources)) {
      // Bulk merge
      const map = new Map<string, any>();
      for (const item of current) {
        if (item && item.id) map.set(item.id, item);
      }
      for (const item of body.resources) {
        if (item && item.id) map.set(item.id, item);
      }
      const merged = Array.from(map.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
      writeResourcesToDisk(merged);
      res.json({ success: true, resources: merged });
      return;
    }

    if (body && body.id) {
      const idx = current.findIndex((r) => r.id === body.id);
      if (idx >= 0) {
        current[idx] = { ...current[idx], ...body };
      } else {
        current.unshift(body);
      }
      const sorted = current.sort((a, b) => (a.order || 0) - (b.order || 0));
      writeResourcesToDisk(sorted);
      res.json({ success: true, resource: body });
      return;
    }

    res.status(400).json({ error: 'Invalid resource payload' });
  });

  // 3. DELETE a resource
  app.delete('/api/resources/:id', (req, res) => {
    const { id } = req.params;
    const current = readResourcesFromDisk();
    const filtered = current.filter((r) => r.id !== id);
    writeResourcesToDisk(filtered);

    const filePath = path.join(FILES_DIR, id);
    const metaPath = path.join(META_DIR, `${id}.json`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (fs.existsSync(metaPath)) fs.unlinkSync(metaPath);

    res.json({ success: true });
  });

  // 4. PUT / POST binary file upload (supports up to 500MB+)
  app.put(
    '/api/files/:id',
    express.raw({ type: '*/*', limit: '500mb' }),
    (req, res) => {
      try {
        const { id } = req.params;
        const fileName = decodeURIComponent((req.headers['x-file-name'] as string) || `${id}.bin`);
        const contentType = (req.headers['content-type'] as string) || 'application/octet-stream';
        const buffer = req.body as Buffer;

        if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
          res.status(400).json({ error: 'Empty file buffer' });
          return;
        }

        const filePath = path.join(FILES_DIR, id);
        const metaPath = path.join(META_DIR, `${id}.json`);

        fs.writeFileSync(filePath, buffer);
        fs.writeFileSync(
          metaPath,
          JSON.stringify({
            id,
            fileName,
            contentType,
            size: buffer.length,
            uploadedAt: new Date().toISOString()
          }),
          'utf-8'
        );

        res.json({
          success: true,
          fileUrl: `/api/files/${id}`,
          fileName,
          size: buffer.length
        });
      } catch (err) {
        console.error('Error saving uploaded file:', err);
        res.status(500).json({ error: 'Failed to save file' });
      }
    }
  );

  // 5. HEAD check file size
  app.head('/api/files/:id', (req, res) => {
    const { id } = req.params;
    const filePath = path.join(FILES_DIR, id);
    if (!fs.existsSync(filePath)) {
      res.status(404).end();
      return;
    }
    const stat = fs.statSync(filePath);
    res.setHeader('Content-Length', stat.size);
    res.status(200).end();
  });

  // 6. GET binary file stream/download with exact MIME type and filename
  app.get('/api/files/:id', (req, res) => {
    const { id } = req.params;
    const filePath = path.join(FILES_DIR, id);
    const metaPath = path.join(META_DIR, `${id}.json`);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const stat = fs.statSync(filePath);
    res.setHeader('Content-Length', stat.size);

    let contentType = 'application/octet-stream';
    let fileName = id;
    if (fs.existsSync(metaPath)) {
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
        if (meta.contentType) contentType = meta.contentType;
        if (meta.fileName) fileName = meta.fileName;
      } catch {
        // ignore
      }
    }

    const lower = fileName.toLowerCase();
    if (lower.endsWith('.pdf')) contentType = 'application/pdf';
    else if (lower.endsWith('.docx'))
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (lower.endsWith('.pptx') || lower.endsWith('.ppsx'))
      contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    else if (lower.endsWith('.xlsx'))
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    else if (lower.endsWith('.mp4')) contentType = 'video/mp4';
    else if (lower.endsWith('.mp3')) contentType = 'audio/mpeg';

    res.setHeader('Content-Type', contentType);
    if (req.query.download === '1') {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`
      );
    } else {
      res.setHeader(
        'Content-Disposition',
        `inline; filename*=UTF-8''${encodeURIComponent(fileName)}`
      );
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
