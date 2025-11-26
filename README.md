# Nevromangfold
Dette er en nettside laget for "Frivillig organisasjons" oppgaven, jeg valgte [Nevromangfold.org](https://nevromangfold.org) som mitt utgangspunkt siden den hadde dårlig design og manglet flere ting som jeg ser på som nødvendig.

Siden er en forbedret versjon av [Nevromangfold.org](https://nevromangfold.org)
x
Prosjektet er laget ved hjelp av React.js, Typescript og Vite

### Installasjon

1. Klon repositoriet
   ```bash
   git clone https://github.com/THEBEST7192/nevromangfold
   cd nevromangfold
   ```
2. Installer avhengigheter
   ```bash
   npm install
   ```
3. Kopier `.env.example` til `.env.local` og fyll ut verdiene (se seksjonen om miljøvariabler under).

### Lokal utvikling

Standardoppsettet speiler produksjon: backend kjører som en Express-app (samme som Render), mens frontend fortsatt bruker Vite. Start begge prosessene i hver sin terminal:

| Prosess | Kommando | Standard URL |
| --- | --- | --- |
| Backend (Render/Express) | `npm run server` | http://localhost:3001 (eller verdien i `PORT`) |
| Frontend (Vite) | `npm run dev` | http://localhost:5173 |

Sett `CLIENT_ORIGIN` til den faktiske frontend-adressen og `VITE_API_BASE_URL` til `http://localhost:3001` (eller porten du velger) når du bruker Express-serveren lokalt. Dette matcher Render-oppsettet og gjør det enklere å feilsøke tunnel/DB.

### Utviklingsmiljø og porter

- **Backend (Express/Render)** kjører som standard på `http://localhost:3001` når du kjører `npm run server`. Sett `PORT` hvis du ønsker en annen port, og oppdater `VITE_API_BASE_URL` tilsvarende.
- **Frontend (Vite)** kjører som standard på `http://localhost:5173`. Hvis du vil bruke en annen port, sett `server.port` i `vite.config.ts` eller start med `npm run dev -- --port 6767` og oppdater `CLIENT_ORIGIN`.
- **CLIENT_ORIGIN** må samsvare med adressen du åpner frontend fra og brukes kun til CORS-konfigurasjon.

| Scenario | Frontend URL | `CLIENT_ORIGIN` | `VITE_API_BASE_URL` |
| --- | --- | --- | --- |
| Standard (Render backend) | `http://localhost:5173` | `http://localhost:5173` | `http://localhost:3001` |
| Egendefinert frontend | `http://localhost:6767` | `http://localhost:6767` | `http://localhost:3001` (eller den porten Express kjører på) |

Hvis backend skal tillate flere domener samtidig (f.eks. Vercel-produksjon + lokal utvikling), sett `CLIENT_ORIGIN` som en kommaseparert liste: `CLIENT_ORIGIN=https://nevromangfold.vercel.app,https://nevromangfold.onrender.com,http://localhost:5173`.

### Unike miljøvariabler

De fleste verdiene i `.env.example` er klassiske `DB_*`-felt. Disse variablene skiller seg ut og styrer integrasjonen mellom frontend, backend og Cloudflare Access:

- **CLIENT_ORIGIN** – én eller flere adresser som tillates i CORS-konfigurasjonen. Verdien kan være en kommaseparert liste (f.eks. `https://nevromangfold.vercel.app,http://localhost:5173`).
- **VITE_API_BASE_URL** – baseadresse for API-kall i frontend. Typisk `http://localhost:3001` under lokal kjøring med `npm run server`, og tom streng i produksjon slik at forespørsler går mot samme domene (`/api/*`).
- **CF_ACCESS_* / DB_TUNNEL_PORT** – styrer Cloudflare Zero Trust-tunnelen. Når både `CF_ACCESS_CLIENT_ID` og `CF_ACCESS_CLIENT_SECRET` er satt, startes `cloudflared access tcp` automatisk og MariaDB-trafikk sendes via `localhost:<DB_TUNNEL_PORT>` (standard 53306).

### Cloudflare Access Databinding

API-serveren støtter MariaDB-tilkoblinger via Cloudflare Zero Trust Access. Sett følgende miljøvariabler (enten i `.env` eller `.env.local`) når databasen kun er tilgjengelig over et Access-beskyttet domene:

```
CF_ACCESS_HOSTNAME=<cloudflare_access_vert>
CF_ACCESS_CLIENT_ID=<client_id>
CF_ACCESS_CLIENT_SECRET=<client_secret>
DB_TUNNEL_PORT=53306 # valgfritt, standard er 53306
```

Når `CF_ACCESS_CLIENT_ID` og `CF_ACCESS_CLIENT_SECRET` er konfigurert, så starter serveren automatisk en `cloudflared access tcp`-tunnel mot `CF_ACCESS_HOSTNAME` (eller `DB_HOST` hvis hostname utelates) før den oppretter MySQL-tilkoblingspoolen. Lokale forespørsler går da mot `localhost:<DB_TUNNEL_PORT>` og videresendes gjennom Zero Trust-tunnelen.

### Backend på Render

Frontend hostes på Vercel, mens backend (Express + Cloudflare-tunnel) kjøres som en Render Web Service:

1. Koble GitHub-repoet til Render og opprett en **Web Service** med `render.yaml` som mal.

2. Render bruker `npm run start` (definert i `package.json`) for å starte `backend/server.js`. Ikke overstyr `PORT`; Render injiserer en portverdi automatisk.
3. Legg til alle relevante miljøvariabler i Render-dashboardet (samme sett som i `.env.local`, men med `CLIENT_ORIGIN` satt til den faktiske Vercel-URL-en).
4. Sett `VITE_API_BASE_URL` i Vercel til `https://nevromangfold.onrender.com` slik at frontend ruter API-kall til Render.

Render sin gratisplan går i dvale etter en stund uten trafikk, så første forespørsel kan ta litt ekstra tid mens `cloudflared` og Node vekkes.

#### Produksjonsmiljøer

- **Render (backend)**: trenger alle `DB_*`, `CLIENT_ORIGIN` (peker til Vercel-domenet), `CF_ACCESS_*`, `DB_TUNNEL_PORT` og *ingen* hardkodet `PORT`.
- **Vercel (frontend)**: trenger kun `VITE_API_BASE_URL` (pek til Render-URL-en, f.eks. `https://nevromangfold.onrender.com`).