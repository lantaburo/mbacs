# MBACS

**MBACS** adalah fondasi aplikasi Customer Service dan CRM untuk bengkel. Fokus produk mengikuti alur:

`Customer Service → Lead Management → Booking → CRM → Retention`

Versi awal ini menyediakan prototipe antarmuka yang responsif untuk:

- ringkasan operasional dan KPI;
- inbox WhatsApp dengan konteks pelanggan dan saran AI;
- lead pipeline dengan next action;
- kalender booking dan kapasitas bay;
- Customer 360;
- after-sales dan retensi;
- pengaturan integrasi, workflow, dan guardrail AI.

## Menjalankan secara lokal

Proyek ini buildless. Jalankan server statis dari root proyek:

```bash
python3 -m http.server 4173 -d dist
```

Lalu buka `http://localhost:4173`.

## Status

Data pada antarmuka masih berupa data contoh untuk validasi alur dan desain. Integrasi PostgreSQL, n8n, WhatsApp Business Cloud API, backend, dan autentikasi akan menjadi tahap implementasi berikutnya.
