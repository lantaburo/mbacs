# Deployment MBACS

Stack MBACS bersifat portabel dan dapat dijalankan pada VPS apa pun yang menyediakan Docker Engine dan Docker Compose v2.

## Kebutuhan minimum

- 2 vCPU;
- 4 GB RAM untuk API, PostgreSQL, n8n, dan Caddy dalam satu VPS;
- 40 GB disk;
- Ubuntu 24.04 atau distribusi Linux setara;
- port publik 80 dan 443.

Jangan membuka port PostgreSQL 5432 ke internet. Konfigurasi bawaan hanya mengikat port tersebut ke `127.0.0.1` pada VPS.

## Persiapan

```bash
git clone https://github.com/lantaburo/mbacs.git
cd mbacs
cp .env.example .env
```

Buat secret acak:

```bash
openssl rand -hex 32
openssl rand -hex 32
openssl rand -hex 32
openssl rand -hex 32
```

Gunakan hasil yang berbeda untuk password PostgreSQL, `MBACS_PROXY_TOKEN`, dan `N8N_ENCRYPTION_KEY`. Jangan commit `.env`.

Buat password akses sementara untuk dashboard dan n8n, lalu simpan hash bcrypt yang dihasilkan ke `MBACS_BASIC_AUTH_HASH`:

```bash
docker run --rm caddy:2-alpine caddy hash-password --plaintext 'PASSWORD-YANG-KUAT'
```

Gunakan single quote di `.env` karena hash mengandung karakter `$`:

```dotenv
MBACS_BASIC_AUTH_USER=mbacs
MBACS_BASIC_AUTH_HASH='$2a$14$HASIL_HASH_DARI_CADDY'
```

Untuk server publik, ubah bagian berikut:

```dotenv
MBACS_HTTP_PORT=80
MBACS_HTTPS_PORT=443
MBACS_DOMAIN=mbacs.example.com
N8N_DOMAIN=n8n.example.com
N8N_HOST=n8n.example.com
N8N_PROTOCOL=https
N8N_PUBLIC_URL=https://n8n.example.com
N8N_SECURE_COOKIE=true
```

Arahkan DNS kedua subdomain ke alamat IP VPS, kemudian jalankan:

```bash
docker compose up -d --build
docker compose ps
```

Caddy akan memperoleh dan memperbarui sertifikat HTTPS secara otomatis setelah DNS dan port 80/443 tersedia.

## Pemeriksaan

```bash
curl -fsS -u 'mbacs:PASSWORD-YANG-KUAT' https://mbacs.example.com/health
docker compose logs --tail=100 api
docker compose logs --tail=100 n8n
```

Respons health check yang normal:

```json
{"status":"ok","database":"ok"}
```

## Backup dan restore

Backup tidak menghentikan layanan:

```bash
scripts/backup-postgres.sh
```

File tersimpan di `backups/` dan tidak masuk Git. Salin backup ke penyimpanan lain yang terenkripsi.

Restore bersifat destruktif dan meminta konfirmasi eksplisit:

```bash
scripts/restore-postgres.sh backups/mbacs-TIMESTAMP.dump
```

## Memindahkan penyedia VPS

1. Buat backup PostgreSQL dari VPS lama.
2. Clone repository di VPS baru dan salin `.env` secara aman.
3. Jalankan stack baru.
4. Restore backup.
5. Ubah DNS setelah health check berhasil.

Tidak ada konfigurasi aplikasi yang bergantung pada Oracle, Sumopod, Alibaba, atau penyedia VPS tertentu.
