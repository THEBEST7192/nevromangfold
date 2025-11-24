import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureCloudflareTunnel } from './cloudflareTunnel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const defaultEnvPath = path.join(projectRoot, '.env');
const localEnvPath = path.join(projectRoot, '.env.local');

dotenv.config({ path: defaultEnvPath });
if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath, override: true });
}

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const app = express();
const PORT = Number(requireEnv('PORT'));
let pool;
let httpServer;

app.use(cors({
  origin: requireEnv('CLIENT_ORIGIN'),
  credentials: true,
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({ error: 'missing_fields' });
    }

    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 15 || !/^[A-Za-z0-9_]+$/.test(trimmedUsername)) {
      return res.status(400).json({ error: 'invalid_username' });
    }

    const brukernavn = trimmedUsername;
    const visningsnavn = name;

    const [existingUsernameRows] = await pool.query(
      'SELECT brukernavn FROM Brukere WHERE brukernavn = ?',
      [brukernavn]
    );

    if (Array.isArray(existingUsernameRows) && existingUsernameRows.length > 0) {
      return res.status(409).json({ error: 'username_taken' });
    }

    const [existingEmailRows] = await pool.query(
      'SELECT email FROM Brukere WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingEmailRows) && existingEmailRows.length > 0) {
      return res.status(409).json({ error: 'user_exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO Brukere (brukernavn, passord, email, visningsnavn) VALUES (?, ?, ?, ?)',
      [brukernavn, hashed, email, visningsnavn]
    );

    return res.status(201).json({
      message: 'registered',
      user: {
        username: brukernavn,
        displayName: visningsnavn,
        email,
      },
    });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ error: 'server_error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'missing_fields' });
    }

    const [rows] = await pool.query(
      'SELECT brukernavn, visningsnavn, email, passord FROM Brukere WHERE email = ?',
      [email]
    );

    const users = Array.isArray(rows) ? rows : [];

    if (users.length === 0) {
      return res.status(401).json({ error: 'invalid_credentials' });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.passord);

    if (!match) {
      return res.status(401).json({ error: 'invalid_credentials' });
    }

    return res.json({
      message: 'logged_in',
      user: {
        username: user.brukernavn,
        displayName: user.visningsnavn,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'server_error' });
  }
});

const startServer = async () => {
  const originalDbHost = requireEnv('DB_HOST');
  const dbUser = requireEnv('DB_USER');
  const dbPassword = requireEnv('DB_PASSWORD');
  const dbName = requireEnv('DB_NAME');
  const defaultDbPort = Number(process.env.DB_PORT || 3306);

  const cfClientId = process.env.CF_ACCESS_CLIENT_ID;
  const cfClientSecret = process.env.CF_ACCESS_CLIENT_SECRET;
  const hostnameForTunnel = process.env.CF_ACCESS_HOSTNAME || originalDbHost;

  let hostForMysql = originalDbHost;
  let portForMysql = defaultDbPort;

  if ((cfClientId && !cfClientSecret) || (!cfClientId && cfClientSecret)) {
    throw new Error('Both CF_ACCESS_CLIENT_ID and CF_ACCESS_CLIENT_SECRET are required to use Cloudflare Access.');
  }

  if (cfClientId && cfClientSecret) {
    const tunnelPort = Number(process.env.DB_TUNNEL_PORT || 53306);

    await ensureCloudflareTunnel({
      hostname: hostnameForTunnel,
      localPort: tunnelPort,
      clientId: cfClientId,
      clientSecret: cfClientSecret,
    });

    hostForMysql = '127.0.0.1';
    portForMysql = tunnelPort;
    console.log(`[cloudflared] forwarding ${hostnameForTunnel} -> localhost:${tunnelPort}`);
  }

  pool = mysql.createPool({
    host: hostForMysql,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    port: portForMysql,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  httpServer = app.listen(PORT, () => {
    console.log(`Auth server listening on port ${PORT}`);
  });
  httpServer.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Is another server instance running?`);
    } else {
      console.error('HTTP server error', err);
    }
    process.exit(1);
  });
};

const shutdown = () => {
  if (httpServer) {
    httpServer.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
