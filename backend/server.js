import process from 'node:process';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { requireEnv, getEnv } from './env.js';
import { getDbPool } from './db.js';

const app = express();

const CLIENT_ORIGIN = requireEnv('CLIENT_ORIGIN');
const ALLOWED_ORIGINS = CLIENT_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const PORT = Number(getEnv('PORT') || 3001);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json({ limit: '1mb' }));

const isValidUsername = (username) => {
  const trimmed = username.trim();
  if (trimmed.length < 3 || trimmed.length > 15) {
    return false;
  }
  return /^[A-Za-z0-9_]+$/.test(trimmed);
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, name, email, password } = req.body ?? {};

    if (!username || !name || !email || !password) {
      res.status(400).json({ error: 'missing_fields' });
      return;
    }

    if (!isValidUsername(username)) {
      res.status(400).json({ error: 'invalid_username' });
      return;
    }

    const trimmedUsername = username.trim();
    const brukernavn = trimmedUsername;
    const visningsnavn = name;

    const pool = await getDbPool();

    const [existingUsernameRows] = await pool.query(
      'SELECT brukernavn FROM Brukere WHERE brukernavn = ? LIMIT 1',
      [brukernavn],
    );
    if (Array.isArray(existingUsernameRows) && existingUsernameRows.length > 0) {
      res.status(409).json({ error: 'username_taken' });
      return;
    }

    const [existingEmailRows] = await pool.query(
      'SELECT email FROM Brukere WHERE email = ? LIMIT 1',
      [email],
    );
    if (Array.isArray(existingEmailRows) && existingEmailRows.length > 0) {
      res.status(409).json({ error: 'user_exists' });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO Brukere (brukernavn, passord, email, visningsnavn) VALUES (?, ?, ?, ?)',
      [brukernavn, hashed, email, visningsnavn],
    );

    res.status(201).json({
      message: 'registered',
      user: {
        username: brukernavn,
        displayName: visningsnavn,
        email,
      },
    });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ error: 'server_error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      res.status(400).json({ error: 'missing_fields' });
      return;
    }

    const pool = await getDbPool();
    const [rows] = await pool.query(
      'SELECT brukernavn, visningsnavn, email, passord FROM Brukere WHERE email = ? LIMIT 1',
      [email],
    );

    const users = Array.isArray(rows) ? rows : [];

    if (users.length === 0) {
      res.status(401).json({ error: 'invalid_credentials' });
      return;
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.passord);

    if (!match) {
      res.status(401).json({ error: 'invalid_credentials' });
      return;
    }

    res.json({
      message: 'logged_in',
      user: {
        username: user.brukernavn,
        displayName: user.visningsnavn,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'server_error' });
  }
});

const startServer = async () => {
  try {
    await getDbPool();
    const server = app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
    });

    const shutdown = () => {
      server.close(() => {
        process.exit(0);
      });
    };

    for (const signal of ['SIGTERM', 'SIGINT']) {
      process.on(signal, shutdown);
    }
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

startServer();
