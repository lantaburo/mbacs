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
- **Backend Site:** Cloudflare Worker di `src/worker.mjs`.
- **Penyimpanan Site:** D1 melalui binding `DB`, dengan sinkronisasi optimistis dan fallback `localStorage`.
- **Target produksi VPS:** PostgreSQL 16 dan n8n melalui `docker-compose.yml`.
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

## Menjalankan PostgreSQL dan n8n

Salin `.env.example` menjadi `.env`, ganti seluruh kata sandi dan encryption key, lalu jalankan:

```bash
docker compose up -d
```

PostgreSQL membuat database dan role terpisah: `mbacs_db`/`mbacs_app` untuk CRM serta `n8n_db`/`n8n_app` untuk workflow.

## Status

Data dashboard disinkronkan ke D1 untuk pengguna Site yang telah masuk. Jika backend belum tersedia—misalnya pada preview statis lokal—aplikasi otomatis memakai `localStorage` tanpa menghilangkan fungsi utama.

PostgreSQL dan n8n sudah memiliki fondasi lokal, tetapi WhatsApp Business Cloud API, OpenAI API, serta deployment VPS masih memerlukan kredensial dan konfigurasi lingkungan milik pengguna.
