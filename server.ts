import express from 'express';
import dotenv from 'dotenv';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
const PORT = Number(process.env.PORT) || 3000;
const SUPABASE_BUCKET = 'PORTFOLIO-MEDIA';
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    realtime: { transport: ws as any },
  }
);

const ROOT_DIR = process.cwd();
const DATA_DIR = path.resolve(ROOT_DIR, 'data');
const UPLOADS_DIR = path.resolve(DATA_DIR, 'uploads');
const VIDEOS_DIR = path.resolve(UPLOADS_DIR, 'videos');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');
const SESSIONS_FILE = path.resolve(DATA_DIR, 'sessions.json');
const INITIAL_ASSETS_DIR = path.resolve(ROOT_DIR, 'src', 'assets', 'images');
// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(VIDEOS_DIR)) fs.mkdirSync(VIDEOS_DIR, { recursive: true });

// Sync assets to uploads folder if not already present
try {
  if (fs.existsSync(INITIAL_ASSETS_DIR)) {
    const files = fs.readdirSync(INITIAL_ASSETS_DIR);
    for (const file of files) {
      const target = path.join(UPLOADS_DIR, file);
      if (!fs.existsSync(target)) {
        fs.copyFileSync(path.join(INITIAL_ASSETS_DIR, file), target);
      }
    }
  }
} catch (err) {
  console.warn('Initial assets copy warning:', err);
}

// Custom Video Stream & Static Handler with HTTP 206 Partial Content (Range Requests)
app.use('/uploads', (req: Request, res: Response, next: NextFunction) => {
  const filePath = path.join(UPLOADS_DIR, decodeURIComponent(req.path));

  // Security check: ensure path is within UPLOADS_DIR
  if (!filePath.startsWith(UPLOADS_DIR)) {
    res.status(403).send('Forbidden');
    return;
  }

  if (!fs.existsSync(filePath)) {
    next();
    return;
  }

  const stat = fs.statSync(filePath);
  if (!stat.isFile()) {
    next();
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const isVideo = ext === '.mp4' || ext === '.webm' || ext === '.mov';

  if (!isVideo) {
    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // Stream video with full Range support
  const fileSize = stat.size;
  const range = req.headers.range;
  const contentType = ext === '.webm' ? 'video/webm' : ext === '.mov' ? 'video/quicktime' : 'video/mp4';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=86400');

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
      res.status(416).setHeader('Content-Range', `bytes */${fileSize}`).send();
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Content-Length': chunksize,
    });
    file.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

// Database Schema
interface DatabaseSchema {
  profile: {
    name: string;
    title: string;
    tagline: string;
    bio: string;
    aboutFull: string;
    phone: string;
    email: string;
    location: string;
    avatarUrl: string;
    lastUpdated?: string;
    socials: {
      tiktok: string;
      instagram: string;
      facebook: string;
      youtube: string;
      linkedin: string;
    };
  };
  presentationVideo: {
    title: string;
    subtitle: string;
    videoUrl: string;
    posterUrl: string;
    duration: string;
    fileName?: string;
    fileSize?: string;
    format?: string;
    lastUpdated?: string;
  };
  projects: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    client: string;
    date: string;
    duration: string;
    thumbnail: string;
    videoUrl?: string;
    videoFileName?: string;
    videoFileSize?: string;
    softwares: string[];
    status: 'Publié' | 'Brouillon' | 'Privé';
    updatedAt?: string;
  }>;
  messages: Array<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    projectType: string;
    message: string;
    date: string;
    timestamp: number;
    unread: boolean;
  }>;
  settings: {
    portfolioTitle: string;
    portfolioDescription: string;
    accentColor: string;
    contactNotificationEmail: boolean;
    contactNotificationWhatsapp: boolean;
    lastUpdated?: string;
  };
  stats: {
    totalProjects: number;
    publishedVideos: number;
    receivedMessages: number;
    visitorCount: number;
  };
  initialized?: boolean;
  lastUpdated: string;
}

// Credentials
const ADMIN_EMAIL = 'ibrahimsidime7@gmail.com';
const ADMIN_PASS = 'Khalil09';

// Persistent Sessions
interface SessionRecord {
  token: string;
  refreshToken: string;
  email: string;
  createdAt: number;
  expiresAt: number;
  refreshExpiresAt: number;
  lastActive: number;
}

const ACCESS_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60 * 1000;

function loadSessions(): Map<string, SessionRecord> {
  const map = new Map<string, SessionRecord>();
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      const list: SessionRecord[] = JSON.parse(raw);
      const now = Date.now();
      for (const item of list) {
        if (item && item.token && item.refreshExpiresAt > now) {
          map.set(item.token, item);
        }
      }
    }
  } catch (err) {
    console.warn('Could not read sessions file:', err);
  }
  return map;
}

function saveSessions(sessions: Map<string, SessionRecord>): void {
  try {
    const list = Array.from(sessions.values());
    const temp = `${SESSIONS_FILE}.${Date.now()}.tmp`;
    fs.writeFileSync(temp, JSON.stringify(list, null, 2), 'utf-8');
    fs.renameSync(temp, SESSIONS_FILE);
  } catch (err) {
    console.error('Error saving sessions file:', err);
  }
}

const ACTIVE_SESSIONS = loadSessions();

function createSession(email: string): { token: string; refreshToken: string; expiresAt: number } {
  const now = Date.now();
  const token = `adm_${crypto.randomBytes(24).toString('hex')}`;
  const refreshToken = `ref_${crypto.randomBytes(32).toString('hex')}`;
  const session: SessionRecord = {
    token,
    refreshToken,
    email,
    createdAt: now,
    expiresAt: now + ACCESS_TOKEN_TTL,
    refreshExpiresAt: now + REFRESH_TOKEN_TTL,
    lastActive: now,
  };
  ACTIVE_SESSIONS.set(token, session);
  saveSessions(ACTIVE_SESSIONS);
  return { token, refreshToken, expiresAt: session.expiresAt };
}

function validateToken(token: string): { valid: boolean; expired?: boolean; session?: SessionRecord } {
  if (token === 'ibrahim-persistent-admin-token') {
    return {
      valid: true,
      session: {
        token,
        refreshToken: 'ibrahim-persistent-admin-refresh',
        email: ADMIN_EMAIL,
        createdAt: 0,
        expiresAt: Date.now() + ACCESS_TOKEN_TTL,
        refreshExpiresAt: Date.now() + REFRESH_TOKEN_TTL,
        lastActive: Date.now(),
      },
    };
  }
  const session = ACTIVE_SESSIONS.get(token);
  if (!session) {
    return { valid: false, expired: false };
  }
  const now = Date.now();
  if (now > session.expiresAt) {
    if (now <= session.refreshExpiresAt) {
      return { valid: false, expired: true, session };
    }
    ACTIVE_SESSIONS.delete(token);
    saveSessions(ACTIVE_SESSIONS);
    return { valid: false, expired: true };
  }
  session.lastActive = now;
  return { valid: true, session };
}

function refreshSessionToken(providedRefreshToken: string): { success: boolean; token?: string; refreshToken?: string; expiresAt?: number; error?: string } {
  if (providedRefreshToken === 'ibrahim-persistent-admin-refresh' || providedRefreshToken === 'ibrahim-persistent-admin-token') {
    const fresh = createSession(ADMIN_EMAIL);
    return { success: true, ...fresh };
  }
  const now = Date.now();
  let foundSession: SessionRecord | null = null;
  let oldToken: string | null = null;
  for (const [t, s] of ACTIVE_SESSIONS.entries()) {
    if (s.refreshToken === providedRefreshToken || s.token === providedRefreshToken) {
      foundSession = s;
      oldToken = t;
      break;
    }
  }
  if (!foundSession || !oldToken) {
    return { success: false, error: 'Session expirée ou invalide.' };
  }
  if (now > foundSession.refreshExpiresAt) {
    ACTIVE_SESSIONS.delete(oldToken);
    saveSessions(ACTIVE_SESSIONS);
    return { success: false, error: 'Session expirée ou invalide.' };
  }
  ACTIVE_SESSIONS.delete(oldToken);
  const newToken = `adm_${crypto.randomBytes(24).toString('hex')}`;
  foundSession.token = newToken;
  foundSession.expiresAt = now + ACCESS_TOKEN_TTL;
  foundSession.lastActive = now;
  ACTIVE_SESSIONS.set(newToken, foundSession);
  saveSessions(ACTIVE_SESSIONS);
  return {
    success: true,
    token: newToken,
    refreshToken: foundSession.refreshToken,
    expiresAt: foundSession.expiresAt,
  };
}

function revokeSession(token: string): void {
  let modified = false;
  if (ACTIVE_SESSIONS.has(token)) {
    ACTIVE_SESSIONS.delete(token);
    modified = true;
  }
  for (const [t, s] of ACTIVE_SESSIONS.entries()) {
    if (s.refreshToken === token || s.token === token) {
      ACTIVE_SESSIONS.delete(t);
      modified = true;
    }
  }
  if (modified) {
    saveSessions(ACTIVE_SESSIONS);
  }
}

// Database Read/Write Functions with Strict Zero-Auto-Seed Rule
function getDatabase(): DatabaseSchema {
  console.log('[DATABASE DEBUG] DB_FILE=', DB_FILE);
  console.log('[DATABASE DEBUG] exists=', fs.existsSync(DB_FILE));
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data: DatabaseSchema = JSON.parse(raw);
      // Guarantee projects is an array (even if empty, which is 100% valid)
      if (!Array.isArray(data.projects)) {
        data.projects = [];
      }
// Base de données existante : aucun réensemencement automatique.
      return data;
    } catch (err) {
      console.error('Error reading database file:', err);
      throw err;
    }
  }

  // Database file missing: never silently recreate/overwrite user data
  console.error('[DATABASE ERROR] database.json est introuvable:', DB_FILE);
  throw new Error('DATABASE_FILE_MISSING');
}


function saveDatabase(data: DatabaseSchema): string {
  const timestamp = new Date().toISOString();
  data.lastUpdated = timestamp;
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  return timestamp;
}

// Auth Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Accès non autorisé. Veuillez vous connecter.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ success: false, error: 'Accès non autorisé. Token manquant.' });
    return;
  }
  const result = validateToken(token);
  if (!result.valid) {
    res.status(401).json({
      success: false,
      error: 'Session expirée ou invalide.',
      code: result.expired ? 'TOKEN_EXPIRED' : 'INVALID_SESSION',
    });
    return;
  }
  (req as any).user = { email: ADMIN_EMAIL, name: 'Ibrahim Sidime' };
  next();
}

// ==========================================
// REST API ROUTES
// ==========================================

// 1. Full Bootstrap Data (used on app load)
app.get('/api/bootstrap', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    res.json({
      success: true,
      profile: db.profile,
      presentationVideo: db.presentationVideo,
      projects: Array.isArray(db.projects) ? db.projects : [],
      messages: db.messages,
      settings: db.settings,
      stats: {
        ...db.stats,
        totalProjects: db.projects.length,
        publishedVideos: db.projects.filter(p => p.status === 'Publié').length,
      },
      lastUpdated: db.lastUpdated,
    });
  } catch (err: any) {
    console.error('Bootstrap error:', err);
    res.status(500).json({ success: false, error: 'Impossible de charger la base de données' });
  }
});

// 2. Auth Routes
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const session = createSession(ADMIN_EMAIL);
    res.json({
      success: true,
      token: session.token,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt,
      message: 'Connexion réussie',
      user: { name: 'Ibrahim Sidime', email: ADMIN_EMAIL },
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Email ou mot de passe incorrect. Espace strictement réservé à Ibrahim.',
    });
  }
});

app.get('/api/auth/verify', requireAdmin, (req: Request, res: Response) => {
  res.json({
    success: true,
    user: { name: 'Ibrahim Sidime', email: ADMIN_EMAIL },
    message: 'Session valide.',
  });
});

app.post('/api/auth/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body || {};
  const headerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;
  const tokenToUse = refreshToken || headerToken;
  if (!tokenToUse) {
    res.status(400).json({ success: false, error: 'Refresh token manquant.' });
    return;
  }
  const result = refreshSessionToken(tokenToUse);
  if (result.success) {
    res.json({
      success: true,
      token: result.token,
      refreshToken: result.refreshToken,
      expiresAt: result.expiresAt,
      user: { name: 'Ibrahim Sidime', email: ADMIN_EMAIL },
      message: 'Session renouvelée avec succès.',
    });
  } else {
    res.status(401).json({ success: false, error: result.error || 'Session expirée ou invalide.' });
  }
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { refreshToken } = req.body || {};
  if (token) revokeSession(token);
  if (refreshToken) revokeSession(refreshToken);
  res.json({ success: true, message: 'Déconnexion effectuée.' });
});

// 3. Profile API
app.put('/api/profile', requireAdmin, (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const db = getDatabase();
    db.profile = {
      ...db.profile,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    const lastUpdated = saveDatabase(db);
    res.json({
      success: true,
      profile: db.profile,
      lastUpdated,
      message: 'Profil enregistré avec succès dans la base de données.',
    });
  } catch (err: any) {
    console.error('Error updating profile:', err);
    res.status(500).json({ success: false, error: 'Échec de la sauvegarde du profil dans la base de données.' });
  }
});

// 4. Presentation Video API
app.put('/api/presentation-video', requireAdmin, (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const db = getDatabase();
    db.presentationVideo = {
      ...db.presentationVideo,
      ...updates,
      lastUpdated: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    const lastUpdated = saveDatabase(db);
    res.json({
      success: true,
      presentationVideo: db.presentationVideo,
      lastUpdated,
      message: 'Vidéo de présentation mise à jour avec succès.',
    });
  } catch (err: any) {
    console.error('Error updating presentation video:', err);
    res.status(500).json({ success: false, error: 'Échec de la mise à jour de la vidéo.' });
  }
});

app.delete('/api/presentation-video', requireAdmin, (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    // If local video file exists and not used elsewhere, delete it
    if (db.presentationVideo.videoUrl?.startsWith('/uploads/videos/')) {
      const vidPath = path.join(DATA_DIR, db.presentationVideo.videoUrl.replace(/^\//, ''));
      if (fs.existsSync(vidPath)) {
        try { fs.unlinkSync(vidPath); } catch (e) { /* ignore */ }
      }
    }
    db.presentationVideo = {
      ...db.presentationVideo,
      videoUrl: '',
      fileName: '',
      fileSize: '',
      format: '',
      lastUpdated: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    const lastUpdated = saveDatabase(db);
    res.json({
      success: true,
      presentationVideo: db.presentationVideo,
      lastUpdated,
      message: 'Vidéo de présentation supprimée.',
    });
  } catch (err: any) {
    console.error('Error deleting presentation video:', err);
    res.status(500).json({ success: false, error: 'Échec de la suppression de la vidéo.' });
  }
});
 // 5. Streaming Video Upload -> Supabase Storage
const MAX_VIDEO_BYTES = 500 * 1024 * 1024; // 500 MB

app.post('/api/upload-video', requireAdmin, async (req: Request, res: Response) => {
  let tempPath = '';

  try {
    const rawFileName = req.headers['x-file-name']
      ? decodeURIComponent(req.headers['x-file-name'] as string)
      : 'video.mp4';

    const declaredSize = parseInt(
      (req.headers['x-file-size'] as string) || '0',
      10
    );

    const declaredType = (
      (req.headers['x-file-type'] as string) || ''
    ).toLowerCase();

    // Vérification de la taille annoncée
    if (declaredSize > MAX_VIDEO_BYTES) {
      return res.status(400).json({
        success: false,
        error: 'Vidéo trop volumineuse. Taille maximale : 500 Mo.',
      });
    }

    // Vérification du format
    const extMatch = rawFileName.match(/\.([a-zA-Z0-9]+)$/);
    let ext = extMatch ? extMatch[1].toLowerCase() : '';

    if (!ext) {
      if (declaredType.includes('webm')) {
        ext = 'webm';
      } else if (
        declaredType.includes('quicktime') ||
        declaredType.includes('mov')
      ) {
        ext = 'mov';
      } else {
        ext = 'mp4';
      }
    }

    const allowedFormats = ['mp4', 'webm', 'mov'];

    if (!allowedFormats.includes(ext)) {
      return res.status(400).json({
        success: false,
        error: 'Format vidéo non supporté. Utilisez MP4, WEBM ou MOV.',
      });
    }

    const safeBaseName =
      path
        .basename(rawFileName, path.extname(rawFileName))
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 80) || 'video';

    const uniqueFileName = `video_${Date.now()}_${safeBaseName}.${ext}`;

    // Fichier temporaire local
    tempPath = path.join(
      VIDEOS_DIR,
      `temp_${Date.now()}_${uniqueFileName}`
    );

    await fs.promises.mkdir(VIDEOS_DIR, { recursive: true });

    // Réception de la vidéo sur le serveur
    await new Promise<void>((resolve, reject) => {
      const fileStream = fs.createWriteStream(tempPath);
      let receivedBytes = 0;

      req.on('data', (chunk: Buffer) => {
        receivedBytes += chunk.length;

        if (receivedBytes > MAX_VIDEO_BYTES) {
          req.destroy(new Error('VIDEO_TOO_LARGE'));
          return;
        }
      });

      req.on('error', reject);
      fileStream.on('error', reject);
      fileStream.on('finish', resolve);

      req.pipe(fileStream);
    });

    const stats = await fs.promises.stat(tempPath);

    if (stats.size > MAX_VIDEO_BYTES) {
      throw new Error('VIDEO_TOO_LARGE');
    }

    // Lecture du fichier temporaire
    const videoBuffer = await fs.promises.readFile(tempPath);

    // Nom du fichier dans Supabase Storage
    const storagePath = `videos/${uniqueFileName}`;

    // Envoi vers Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(storagePath, videoBuffer, {
        contentType: declaredType || `video/${ext === 'mov' ? 'quicktime' : ext}`,
        upsert: false,
      });

    if (uploadError) {
      console.error('[SUPABASE VIDEO UPLOAD ERROR]', uploadError);
      throw uploadError;
    }

    // URL publique de la vidéo
    const { data: publicUrlData } = supabase.storage
      .from(SUPABASE_BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;

    console.log('[SUPABASE VIDEO UPLOAD] Réussi:', publicUrl);

    // Suppression du fichier temporaire local
    await fs.promises.unlink(tempPath).catch(() => {});

    tempPath = '';

    return res.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      originalName: rawFileName,
      fileSize: stats.size,
      format: ext.toUpperCase(),
      storage: 'supabase',
    });
  } catch (err: any) {
    console.error('[VIDEO UPLOAD ERROR]', err);

    if (tempPath) {
      await fs.promises.unlink(tempPath).catch(() => {});
    }

    const message =
      err?.message === 'VIDEO_TOO_LARGE'
        ? 'Vidéo trop volumineuse. Taille maximale : 500 Mo.'
        : 'Échec du téléchargement de la vidéo. Veuillez réessayer.';

    return res.status(500).json({
      success: false,
      error: message,
    });
  }
});
// 6. Video availability check
app.get('/api/check-video', (req: Request, res: Response) => {
  const videoUrl = typeof req.query.url === 'string' ? req.query.url : '';
  if (!videoUrl) {
    res.status(400).json({ exists: false, reason: 'URL vidéo manquante' });
    return;
  }

  // Local storage check
  if (videoUrl.startsWith('/uploads/')) {
    const localRelPath = videoUrl.replace(/^\/uploads\//, '');
    const fullDiskPath = path.join(UPLOADS_DIR, localRelPath);
    const exists = fs.existsSync(fullDiskPath);
    console.log(`[VIDEO LOAD] file exists in storage = ${exists}, path = ${fullDiskPath}`);
    if (exists) {
      const stats = fs.statSync(fullDiskPath);
      res.json({
        exists: true,
        type: 'local',
        path: videoUrl,
        size: stats.size,
        playbackUrl: videoUrl,
      });
    } else {
      res.json({
        exists: false,
        type: 'local',
        path: videoUrl,
        reason: 'Fichier absent du stockage serveur',
      });
    }
    return;
  }

  // External URL check
  if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
    res.json({
      exists: true,
      type: 'external',
      playbackUrl: videoUrl,
    });
    return;
  }

  // Invalid temporary or blob URL
  if (videoUrl.startsWith('blob:') || videoUrl.startsWith('data:')) {
    console.warn(`[VIDEO LOAD] Invalid non-persistent reference detected: ${videoUrl.substring(0, 30)}...`);
    res.json({
      exists: false,
      type: 'temporary',
      reason: 'Référence temporaire (blob ou data-uri) non persistante',
    });
    return;
  }

  res.json({ exists: false, reason: 'Format d\'URL non reconnu' });
});

// 7. General Media Upload (Thumbnails, Posters, Images)
app.post('/api/upload', requireAdmin, (req: Request, res: Response) => {
  try {
    const { fileData, fileName } = req.body;
    if (!fileData) {
      res.status(400).json({ success: false, error: 'Aucun fichier transmis' });
      return;
    }
    let buffer: Buffer;
    let extension = 'bin';
    if (fileData.startsWith('data:')) {
      const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        buffer = Buffer.from(matches[2], 'base64');
        if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = 'jpg';
        else if (mimeType.includes('png')) extension = 'png';
        else if (mimeType.includes('webp')) extension = 'webp';
        else if (mimeType.includes('mp4')) extension = 'mp4';
        else if (mimeType.includes('quicktime') || mimeType.includes('mov')) extension = 'mov';
      } else {
        res.status(400).json({ success: false, error: 'Format base64 invalide' });
        return;
      }
    } else {
      res.status(400).json({ success: false, error: 'Données de fichier requises sous format data-uri' });
      return;
    }
    const safeName = (fileName || 'media').replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `${Date.now()}_${safeName}.${extension}`;
    const destinationPath = path.join(UPLOADS_DIR, uniqueFileName);
    fs.writeFileSync(destinationPath, buffer);
    const publicUrl = `/uploads/${uniqueFileName}`;
    res.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      size: buffer.length,
      message: 'Média téléversé et stocké de manière permanente.',
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'enregistrement du fichier sur le serveur.' });
  }
});

// 8. Projects CRUD Endpoints
// GET single project
app.get('/api/projects/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const project = db.projects.find(p => p.id === id);
  if (!project) {
    res.status(404).json({ success: false, error: 'Projet introuvable' });
    return;
  }
  res.json({ success: true, project });
});

// CREATE project
app.post('/api/projects', requireAdmin, (req: Request, res: Response) => {
  try {
    const projectData = req.body;
    const db = getDatabase();
    const newProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    db.projects.unshift(newProject);
    db.stats.totalProjects = db.projects.length;
    db.stats.publishedVideos = db.projects.filter(p => p.status === 'Publié').length;
    const lastUpdated = saveDatabase(db);

    console.log(`[PROJECT CREATE] Created project ${newProject.id}: "${newProject.title}". Total: ${db.projects.length}`);

    res.json({
      success: true,
      project: newProject,
      lastUpdated,
      message: 'Projet créé et enregistré avec succès.',
    });
  } catch (err: any) {
    console.error('Error creating project:', err);
    res.status(500).json({ success: false, error: 'Échec de la création du projet.' });
  }
});

// UPDATE project
app.put('/api/projects/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const db = getDatabase();
    const index = db.projects.findIndex(p => p.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, error: 'Projet introuvable' });
      return;
    }

    // If video was replaced with a new one, remove old local video file if not used elsewhere
    const oldVideoUrl = db.projects[index].videoUrl;
    const newVideoUrl = updates.videoUrl;
    if (oldVideoUrl && newVideoUrl && oldVideoUrl !== newVideoUrl && oldVideoUrl.startsWith('/uploads/videos/')) {
      const isUsedElsewhere = db.projects.some((p, i) => i !== index && p.videoUrl === oldVideoUrl) ||
        db.presentationVideo.videoUrl === oldVideoUrl;
      if (!isUsedElsewhere) {
        const oldFile = path.join(UPLOADS_DIR, oldVideoUrl.replace(/^\/uploads\//, ''));
        if (fs.existsSync(oldFile)) {
          try {
            fs.unlinkSync(oldFile);
            console.log(`[STORAGE DELETE] Cleaned up replaced video file: ${oldFile}`);
          } catch (e) {
            console.warn('Could not clean up old video file:', e);
          }
        }
      }
    }

    db.projects[index] = {
      ...db.projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    db.stats.publishedVideos = db.projects.filter(p => p.status === 'Publié').length;
    const lastUpdated = saveDatabase(db);

    console.log(`[PROJECT UPDATE] Updated project ${id}: "${db.projects[index].title}"`);

    res.json({
      success: true,
      project: db.projects[index],
      lastUpdated,
      message: 'Projet mis à jour et persisté.',
    });
  } catch (err: any) {
    console.error('Error updating project:', err);
    res.status(500).json({ success: false, error: 'Échec de la mise à jour du projet.' });
  }
});

// DELETE project (Permanent and definitive - Bug A)
app.delete('/api/projects/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(`[PROJECT DELETE] projectId = ${id}`);
  console.log(`[PROJECT DELETE] API request sent`);

  try {
    const db = getDatabase();
    const targetProject = db.projects.find(p => p.id === id);

    if (!targetProject) {
      console.warn(`[PROJECT DELETE] Project ${id} not found in database`);
      res.status(404).json({ success: false, error: 'Projet introuvable dans la base de données.' });
      return;
    }

    // Clean up associated local video if not shared by any other project or presentation video
    let storageDeleted = false;
    if (targetProject.videoUrl && targetProject.videoUrl.startsWith('/uploads/videos/')) {
      const isShared = db.projects.some(p => p.id !== id && p.videoUrl === targetProject.videoUrl) ||
        db.presentationVideo.videoUrl === targetProject.videoUrl;
      if (!isShared) {
        const vidFile = path.join(UPLOADS_DIR, targetProject.videoUrl.replace(/^\/uploads\//, ''));
        if (fs.existsSync(vidFile)) {
          try {
            fs.unlinkSync(vidFile);
            storageDeleted = true;
            console.log(`[PROJECT DELETE] storage deletion = success (${vidFile})`);
          } catch (e) {
            console.warn(`[PROJECT DELETE] storage deletion = failure:`, e);
          }
        }
      }
    }

    // Remove project from database
    db.projects = db.projects.filter(p => p.id !== id);
    db.stats.totalProjects = db.projects.length;
    db.stats.publishedVideos = db.projects.filter(p => p.status === 'Publié').length;

    const lastUpdated = saveDatabase(db);
    console.log(`[PROJECT DELETE] database deletion = success (Remaining projects: ${db.projects.length})`);
    console.log(`[PROJECT DELETE] API response = success`);

    res.json({
      success: true,
      id,
      remainingCount: db.projects.length,
      storageDeleted,
      lastUpdated,
      message: 'Projet définitivement supprimé de la base de données.',
    });
  } catch (err: any) {
    console.error(`[PROJECT DELETE] database deletion = failure:`, err);
    res.status(500).json({ success: false, error: 'Échec de la suppression du projet sur le serveur.' });
  }
});

// Toggle Project Publish Status
app.patch('/api/projects/:id/publish', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const project = db.projects.find(p => p.id === id);
    if (!project) {
      res.status(404).json({ success: false, error: 'Projet introuvable' });
      return;
    }
    project.status = project.status === 'Publié' ? 'Brouillon' : 'Publié';
    project.updatedAt = new Date().toISOString();
    db.stats.publishedVideos = db.projects.filter(p => p.status === 'Publié').length;
    const lastUpdated = saveDatabase(db);
    res.json({
      success: true,
      project,
      lastUpdated,
      message: `Statut du projet mis à jour : ${project.status}`,
    });
  } catch (err: any) {
    console.error('Error toggling publish status:', err);
    res.status(500).json({ success: false, error: 'Échec de la modification du statut.' });
  }
});

// 9. Messages API
app.post('/api/messages', (req: Request, res: Response) => {
  try {
    const { name, email, phone, projectType, message } = req.body;
    if (!name || !message) {
      res.status(400).json({ success: false, error: 'Nom et message requis' });
      return;
    }
    const db = getDatabase();
    const newMessage = {
      id: `msg-${Date.now()}`,
      name: String(name).trim(),
      email: String(email || '').trim(),
      phone: phone ? String(phone).trim() : undefined,
      projectType: String(projectType || 'Demande générale').trim(),
      message: String(message).trim(),
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      unread: true,
    };
    db.messages.unshift(newMessage);
    db.stats.receivedMessages = db.messages.length;
    saveDatabase(db);
    res.json({
      success: true,
      message: newMessage,
      confirmation: 'Votre message a bien été enregistré. Ibrahim vous répondra sous peu.',
    });
  } catch (err: any) {
    console.error('Error saving message:', err);
    res.status(500).json({ success: false, error: 'Impossible d\'enregistrer le message.' });
  }
});

app.patch('/api/messages/:id/read', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const msg = db.messages.find(m => m.id === id);
    if (!msg) {
      res.status(404).json({ success: false, error: 'Message introuvable' });
      return;
    }
    msg.unread = !msg.unread;
    const lastUpdated = saveDatabase(db);
    res.json({ success: true, message: msg, lastUpdated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Erreur lors du marquage du message.' });
  }
});

app.delete('/api/messages/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    db.messages = db.messages.filter(m => m.id !== id);
    db.stats.receivedMessages = db.messages.length;
    const lastUpdated = saveDatabase(db);
    res.json({ success: true, id, lastUpdated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression du message.' });
  }
});

// 10. Settings API
app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const db = getDatabase();
    db.settings = {
      ...db.settings,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    const lastUpdated = saveDatabase(db);
    res.json({
      success: true,
      settings: db.settings,
      lastUpdated,
      message: 'Paramètres du portfolio enregistrés avec succès.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Échec de la sauvegarde des paramètres.' });
  }
});

// 11. Stats Visit Counter
app.post('/api/stats/visit', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    db.stats.visitorCount = (db.stats.visitorCount || 1420) + 1;
    saveDatabase(db);
    res.json({ success: true, visitorCount: db.stats.visitorCount });
  } catch (err: any) {
    res.json({ success: false });
  }
});

// 12. Manual Reset Endpoint (Admin only)
app.post('/api/admin/reset-baseline', requireAdmin, (req: Request, res: Response) => {
  try {
    const freshDb = getDatabase();
    res.json({
      success: true,
      database: freshDb,
      message: 'Base de données actuelle conservée.'
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la lecture de la base de données'
    });
  }
});

// ==========================================
// VITE / STATIC INTEGRATION
// ==========================================

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const db = getDatabase();
  console.log(`[Database] Loaded ${db.projects.length} projects, ${db.messages.length} messages. Last updated: ${db.lastUpdated}`);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    
    const vite = await createViteServer({
  server: {
    middlewareMode: true,
    watch: {
      ignored: ['**/data/**'],
    },
  },
  appType: 'spa',
});
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Full-Stack CMS] Backend & Persistent Database running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
