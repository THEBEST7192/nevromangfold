# Nevromangfold
Dette er en nettside laget for "Frivillig organisasjons" oppgaven, jeg valgte [Nevromangfold.org](https://nevromangfold.org) som mitt utgangspunkt siden den hadde dårlig design og manglet flere ting som jeg ser på som nødvendig.

Siden er en forbedret versjon av [Nevromangfold.org](https://nevromangfold.org)
x
Prosjektet er laget ved hjelp av React.js, Typescript og Vite

### Installasjon

1. Klon repositoriet
`git clone https://github.com/THEBEST7192/nevromangfold`
2. Naviger til prosjektmappen
`cd nevromangfold`
3. Installer avhengigheter: `npm install`
4. Start backend (Express): `npm run server`
5. Start frontend (Vite): `npm run dev`

### Utviklingsmiljø og porter

- **Frontend (Vite)** kjører som standard på `http://localhost:5173`. Hvis du vil bruke en annen port, sett `server.port` i `vite.config.ts` eller start med `npm run dev -- --port 6767`.
- **Backend (Express API)** bruker miljøvariabelen `PORT` (standard `3001`). Sett `PORT=` i `.env.local` for å endre dette.
- **CLIENT_ORIGIN** må samsvare med URL-en du faktisk åpner frontend fra. Eksempel:

| Scenario | Frontend URL | `CLIENT_ORIGIN` | `PORT` | `VITE_API_BASE_URL` |
| --- | --- | --- | --- | --- |
| Standard | `http://localhost:5173` | `http://localhost:5173` | `3001` | `http://localhost:3001` |
| Egendefinert | `http://localhost:6767` | `http://localhost:6767` | `6969` | `http://localhost:6969` |

`CLIENT_ORIGIN` påvirker **kun** CORS-innstillingen i Express. Den styrer ikke hvilken port Vite bruker - det gjør Vite-konfigen.

### Cloudflare Access Databinding

API-serveren støtter MariaDB-tilkoblinger via Cloudflare Zero Trust Access. Sett følgende miljøvariabler (enten i `.env` eller `.env.local`) når databasen kun er tilgjengelig over et Access-beskyttet domene:

```
CF_ACCESS_HOSTNAME=<cloudflare_access_vert>
CF_ACCESS_CLIENT_ID=<client_id>
CF_ACCESS_CLIENT_SECRET=<client_secret>
DB_TUNNEL_PORT=53306 # valgfritt, standard er 53306
```

Når `CF_ACCESS_CLIENT_ID` og `CF_ACCESS_CLIENT_SECRET` er konfigurert, så starter serveren automatisk en `cloudflared access tcp`-tunnel mot `CF_ACCESS_HOSTNAME` (eller `DB_HOST` hvis hostname utelates) før den oppretter MySQL-tilkoblingspoolen. Lokale forespørsler går da mot `localhost:<DB_TUNNEL_PORT>` og videresendes gjennom Zero Trust-tunnelen.