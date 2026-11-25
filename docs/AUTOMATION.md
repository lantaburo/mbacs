# Otomasi n8n dan Simulator WhatsApp

Folder `workflows/` berisi template n8n yang dapat diimpor setelah stack MBACS aktif.

Template membaca URL dan token API dari environment container. Karena itu akses editor n8n hanya boleh diberikan kepada administrator tepercaya; workflow yang dapat diedit juga dapat membaca environment tersebut.

## WhatsApp Simulator

Workflow `whatsapp-simulator.json` menerima payload simulasi, menormalisasi bentuk pesan, mencari workshop pertama, lalu menyimpan pesan ke MBACS. Pesan baru otomatis membuat:

- percakapan Inbox;
- lead pada tahap Baru;
- tugas respons untuk CS.

Buka dashboard MBACS sekali setelah deployment agar workspace awal dibuat, baru jalankan workflow simulator.

Impor workflow melalui menu **Workflows → Import from File**, kemudian aktifkan workflow. Production webhook tersedia pada:

```text
https://n8n.example.com/webhook/mbacs-whatsapp-simulator
```

Untuk menguji langsung ke API MBACS tanpa melewati n8n:

```bash
MBACS_PUBLIC_URL=https://mbacs.example.com \
MBACS_BASIC_AUTH_USER=mbacs \
MBACS_BASIC_AUTH_PASSWORD='password-akses' \
npm run simulate:whatsapp -- \
  --phone=081234567890 \
  --name='Rina Wijaya' \
  --message='Saya ingin booking servis rutin.'
```

Untuk menguji melalui workflow n8n, tambahkan URL webhook:

```bash
MBACS_N8N_WEBHOOK_URL=https://n8n.example.com/webhook/mbacs-whatsapp-simulator \
MBACS_BASIC_AUTH_USER=mbacs \
MBACS_BASIC_AUTH_PASSWORD='password-akses' \
npm run simulate:whatsapp
```

Gunakan kembali nilai `--id` yang sama untuk menguji idempotensi. Percobaan kedua akan mengembalikan `duplicate: true` dan tidak menambah pesan lagi.

## Draft Pengingat Booking

Workflow `booking-reminder.json` berjalan setiap hari pukul 08.00 WIB. Workflow mencari booking untuk hari berikutnya dan menambahkan draf pengingat ke percakapan pelanggan yang namanya cocok.

Workflow ini sengaja hanya membuat **draf**. Pesan tidak dikirim ke nomor pelanggan sampai WhatsApp Business Cloud API dan template resmi Meta dikonfigurasi.

Sebelum mengaktifkan workflow terjadwal:

1. pastikan workflow WhatsApp simulator berhasil;
2. periksa timezone workflow `Asia/Jakarta`;
3. jalankan workflow secara manual;
4. periksa draf pada Inbox MBACS;
5. baru aktifkan jadwal.

## Format payload simulator

```json
{
  "externalId": "wamid.contoh-001",
  "from": "081234567890",
  "name": "Rina Wijaya",
  "body": "Saya ingin booking servis rutin.",
  "vehicle": "Toyota Calya 2021",
  "plate": "B 1234 SIM"
}
```

`externalId` wajib unik. Pada integrasi Meta nanti, nilainya diambil dari WhatsApp message ID asli.
