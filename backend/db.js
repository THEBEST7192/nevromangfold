import mysql from 'mysql2/promise';
import { ensureCloudflareTunnel } from './cloudflareTunnel.js';
import { getEnv, requireEnv } from './env.js';

let poolPromise = null;

const createPool = async () => {
  const originalDbHost = requireEnv('DB_HOST');
  const dbUser = requireEnv('DB_USER');
  const dbPassword = requireEnv('DB_PASSWORD');
  const dbName = requireEnv('DB_NAME');
  const defaultDbPort = Number(getEnv('DB_PORT') || 3306);

  const cfClientId = getEnv('CF_ACCESS_CLIENT_ID');
  const cfClientSecret = getEnv('CF_ACCESS_CLIENT_SECRET');
  const cfHostname = getEnv('CF_ACCESS_HOSTNAME') || originalDbHost;

  let hostForMysql = originalDbHost;
  let portForMysql = defaultDbPort;

  if ((cfClientId && !cfClientSecret) || (!cfClientId && cfClientSecret)) {
    throw new Error('Both CF_ACCESS_CLIENT_ID and CF_ACCESS_CLIENT_SECRET are required to use Cloudflare Access.');
  }

  if (cfClientId && cfClientSecret) {
    const tunnelPort = Number(getEnv('DB_TUNNEL_PORT') || 53306);

    await ensureCloudflareTunnel({
      hostname: cfHostname,
      localPort: tunnelPort,
      clientId: cfClientId,
      clientSecret: cfClientSecret,
    });

    hostForMysql = '127.0.0.1';
    portForMysql = tunnelPort;
    console.log(`[cloudflared] forwarding ${cfHostname} -> localhost:${tunnelPort}`);
  }

  return mysql.createPool({
    host: hostForMysql,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    port: portForMysql,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10_000,
  });
};

export const getDbPool = async () => {
  if (!poolPromise) {
    poolPromise = createPool().catch((err) => {
      poolPromise = null;
      throw err;
    });
  }

  return poolPromise;
};
