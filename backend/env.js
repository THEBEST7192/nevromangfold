import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

let envLoaded = false;

const loadEnv = () => {
  if (envLoaded) {
    return;
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const projectRoot = path.resolve(__dirname, '..');

  const defaultEnvPath = path.join(projectRoot, '.env');
  const localEnvPath = path.join(projectRoot, '.env.local');

  dotenv.config({ path: defaultEnvPath });
  if (fs.existsSync(localEnvPath)) {
    dotenv.config({ path: localEnvPath, override: true });
  }

  envLoaded = true;
};

export const requireEnv = (key) => {
  loadEnv();
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const getEnv = (key) => {
  loadEnv();
  return process.env[key];
};
