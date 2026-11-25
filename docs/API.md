# MBACS API

API berjalan pada jaringan internal Docker di `http://api:3000`. Permintaan wajib membawa header internal berikut, kecuali health check:

```http
X-MBACS-Proxy-Token: <MBACS_PROXY_TOKEN>
```

Browser tidak mengetahui token tersebut. Caddy menyisipkannya pada request same-origin ke `/api`. n8n menerima `MBACS_INTERNAL_API_URL` dan `MBACS_PROXY_TOKEN` melalui environment container.

## Endpoint

```text
GET  /health
GET  /api/v1/workshops
POST /api/v1/workshops
GET  /api/v1/workshops/:id/state
PUT  /api/v1/workshops/:id/state
POST /api/v1/workshops/:id/actions/customer
POST /api/v1/workshops/:id/actions/lead
POST /api/v1/workshops/:id/actions/appointment
POST /api/v1/workshops/:id/actions/message
POST /api/v1/workshops/:id/actions/advance_lead
```

`PUT state` menggunakan optimistic concurrency. Kirim `revision` terakhir bersama snapshot CRM:

```json
{
  "revision": 4,
  "data": {
    "conversations": [],
    "appointments": [],
    "tasks": [],
    "leadColumns": [],
    "customers": []
  }
}
```

Jika data telah diubah perangkat lain, API mengembalikan HTTP `409` dan klien harus memuat state terbaru sebelum mencoba kembali.

## Contoh dari jaringan Docker

```bash
curl -sS \
  -H "X-MBACS-Proxy-Token: $MBACS_PROXY_TOKEN" \
  http://api:3000/api/v1/workshops
```

Kontrak lama `POST /api` tetap tersedia untuk dashboard dan ChatGPT Site. Integrasi baru sebaiknya menggunakan `/api/v1`.
