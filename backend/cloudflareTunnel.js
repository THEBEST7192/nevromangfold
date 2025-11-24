import { spawn } from 'node:child_process';
import net from 'node:net';
import { bin as cloudflaredBin } from 'cloudflared';

let tunnelProcess = null;
let tunnelInfo = null;
let tunnelReadyPromise = null;

const waitForLocalPort = ({ host = '127.0.0.1', port, timeoutMs = 15_000, intervalMs = 250 }) =>
  new Promise((resolve, reject) => {
    const start = Date.now();

    const tryConnect = () => {
      const socket = net.createConnection({ host, port }, () => {
        socket.end();
        resolve();
      });

      socket.on('error', (err) => {
        socket.destroy();
        if (Date.now() - start >= timeoutMs) {
          reject(new Error(`Cloudflare tunnel did not open ${host}:${port} within ${timeoutMs}ms (${err.message})`));
          return;
        }
        setTimeout(tryConnect, intervalMs);
      });
    };

    tryConnect();
  });

const pipeLogs = (stream, { prefix, level = 'log' }) => {
  stream.on('data', (chunk) => {
    chunk
      .toString()
      .split(/\r?\n/u)
      .filter(Boolean)
      .forEach((line) => {
        const logger = level === 'error' ? console.error : console.log;
        logger(`${prefix} ${line}`);
      });
  });
};

const startTunnel = async ({ hostname, localPort, clientId, clientSecret, logPrefix = '[cloudflared]' }) => {
  console.log(`${logPrefix} starting tunnel to ${hostname} -> localhost:${localPort}`);

  tunnelProcess = spawn(
    cloudflaredBin,
    ['access', 'tcp', '--hostname', hostname, '--url', `localhost:${localPort}`],
    {
      env: {
        ...process.env,
        CF_ACCESS_CLIENT_ID: clientId,
        CF_ACCESS_CLIENT_SECRET: clientSecret,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  tunnelProcess.on('error', (err) => {
    console.error(`${logPrefix} failed to start tunnel`, err);
  });

  tunnelProcess.on('exit', (code, signal) => {
    if (code !== 0) {
      console.error(`${logPrefix} tunnel exited with code ${code ?? 'null'} signal ${signal ?? 'null'}`);
    } else {
      console.log(`${logPrefix} tunnel exited`);
    }
    tunnelProcess = null;
    tunnelInfo = null;
  });

  pipeLogs(tunnelProcess.stdout, { prefix: logPrefix });
  pipeLogs(tunnelProcess.stderr, { prefix: logPrefix, level: 'error' });

  await waitForLocalPort({ port: localPort });

  tunnelInfo = { hostname, localPort };
  console.log(`${logPrefix} tunnel ready on localhost:${localPort}`);
  return tunnelInfo;
};

export const ensureCloudflareTunnel = async (options) => {
  if (tunnelInfo) {
    return tunnelInfo;
  }

  if (!tunnelReadyPromise) {
    tunnelReadyPromise = startTunnel(options).catch((err) => {
      tunnelReadyPromise = null;
      tunnelInfo = null;
      throw err;
    });
  }

  try {
    tunnelInfo = await tunnelReadyPromise;
    return tunnelInfo;
  } finally {
    tunnelReadyPromise = null;
  }
};

export const stopCloudflareTunnel = () => {
  if (tunnelProcess) {
    tunnelProcess.kill();
    tunnelProcess = null;
    tunnelInfo = null;
  }
};

process.on('exit', stopCloudflareTunnel);
for (const signal of ['SIGINT', 'SIGTERM', 'SIGQUIT']) {
  process.on(signal, () => {
    stopCloudflareTunnel();
  });
}
