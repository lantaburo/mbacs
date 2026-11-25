# MBACS

**MBACS** adalah aplikasi Customer Service dan CRM untuk bengkel. Fokus produk mengikuti alur:

`Customer Service → Lead Management → Booking → CRM → Retention`

Versi ini menyediakan antarmuka responsif dan backend Site dengan penyimpanan D1 untuk:

- ringkasan operasional dan KPI;
- inbox WhatsApp dengan konteks pelanggan dan saran AI;
- lead pipeline dengan next action;
- kalender booking dan kapasitas bay;
- Customer 360;
- after-sales dan retensi;
- pengaturan integrasi, workflow, dan guardrail AI.

## Arsitektur

- **Dashboard:** HTML, CSS, dan JavaScript buildless di `dist/`.
- **Backend portabel:** Node.js di `src/api/` dengan REST API dan PostgreSQL.
- **Backend Site:** Cloudflare Worker di `src/worker.mjs` untuk deployment ChatGPT Site yang sudah ada.
- **Penyimpanan Site:** D1 melalui binding `DB`, dengan sinkronisasi optimistis dan fallback `localStorage`.
- **Target produksi VPS:** Caddy, MBACS API, PostgreSQL 16, dan n8n melalui `docker-compose.yml`.
- **Skema bisnis:** `database/postgres/001_schema.sql` mencakup workshop, pelanggan, kendaraan, lead, percakapan, booking, servis, retensi, AI, dan audit.

## Menjalankan dashboard secara lokal

Proyek ini buildless. Jalankan server statis dari root proyek:

```bash
python3 -m http.server 4173 -d dist
```

Lalu buka `http://localhost:4173`.

Pemeriksaan runtime ringan dapat dijalankan dengan:

```bash
node scripts/smoke-ui.mjs
node --test tests/domain.test.mjs
```

## Menjalankan stack lengkap secara lokal

Salin `.env.example` menjadi `.env`, ganti seluruh kata sandi, `MBACS_PROXY_TOKEN`, dan encryption key, lalu jalankan:

```bash
docker compose up -d
```

Dashboard tersedia di `http://localhost:8080`, sedangkan n8n tersedia di `http://n8n.localhost:8080`. PostgreSQL hanya dipublikasikan pada loopback host dan membuat database serta role terpisah: `mbacs_db`/`mbacs_app` untuk CRM serta `n8n_db`/`n8n_app` untuk workflow.

API menyediakan dua kontrak:

- `POST /api` untuk sinkronisasi dashboard yang sudah ada;
- `/api/v1/workshops/...` untuk integrasi portabel, termasuk n8n.

Reverse proxy menyisipkan token internal ke API. Token tidak pernah dikirim ke JavaScript browser. Caddy juga mewajibkan Basic Auth untuk dashboard, API, dan n8n selama login multi-pengguna belum diaktifkan.

Panduan VPS, HTTPS, firewall, backup, restore, dan migrasi tersedia di [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).
Kontrak integrasi untuk n8n dan layanan lain tersedia di [`docs/API.md`](docs/API.md).
Petunjuk import workflow dan pengujian WhatsApp tersedia di [`docs/AUTOMATION.md`](docs/AUTOMATION.md).

Untuk menjalankan pemeriksaan proyek:

```bash
npm install
npm run check
```

## Status

Data dashboard disinkronkan ke D1 untuk pengguna Site yang telah masuk. Jika backend belum tersedia—misalnya pada preview statis lokal—aplikasi otomatis memakai `localStorage` tanpa menghilangkan fungsi utama.

Backend PostgreSQL dan paket Docker tidak terikat pada penyedia VPS. Simulator WhatsApp dan workflow draft reminder tersedia untuk pengujian tanpa akun Meta. Pengiriman WhatsApp nyata, OpenAI API, login multi-pengguna, serta domain produksi masih memerlukan kredensial dan konfigurasi lingkungan milik pengguna.
