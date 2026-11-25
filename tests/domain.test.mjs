import test from 'node:test';
import assert from 'node:assert/strict';
import { action, phone, sanitizeCRM, workshop } from '../src/domain.mjs';

const seed = () => ({
  conversations: [{ id: 1, name: 'Dimas', messages: [], preview: '', time: '', unread: 1 }],
  appointments: [],
  tasks: [],
  leadColumns: [
    { title: 'Baru', cards: [['Ari', 'Servis rutin', 'Avanza', 70, 'Respons']] },
    { title: 'Dihubungi', cards: [] }
  ],
  customers: []
});

test('normalisasi nomor telepon Indonesia', () => {
  assert.equal(phone('0812 3456 7890'), '+6281234567890');
  assert.equal(phone('+62 812-3456-7890'), '+6281234567890');
});

test('snapshot CRM hanya menyimpan koleksi yang diizinkan', () => {
  const crm = sanitizeCRM({ ...seed(), unexpected: ['secret'] });
  assert.deepEqual(Object.keys(crm), ['conversations', 'appointments', 'tasks', 'leadColumns', 'customers']);
});

test('aksi CRM membuat pelanggan, booking, dan memajukan lead', () => {
  const record = workshop({ name: 'MBACS Test', seed: seed(), actor: 'owner@example.com' });
  action(record, 'customer', { name: 'Budi Santoso', phone: '081234567890', vehicle: 'Toyota Avanza', plate: 'b 1234 xyz' }, 'agent@example.com');
  action(record, 'appointment', { name: 'Budi Santoso', date: '2026-11-26', time: '10:00', job: 'Servis rutin', bay: 2 }, 'agent@example.com');
  const moved = action(record, 'advance_lead', { from: 0, index: 0 }, 'agent@example.com');

  assert.equal(record.crm.customers[0][5], 'B 1234 XYZ');
  assert.equal(record.crm.appointments[0].bay, 2);
  assert.equal(moved.stage, 'Dihubungi');
  assert.equal(record.crm.leadColumns[1].cards[0][0], 'Ari');
  assert.ok(record.audit.length >= 4);
});

test('aksi pesan memperbarui konteks percakapan', () => {
  const record = workshop({ name: 'MBACS Test', seed: seed() });
  action(record, 'message', { conversation: '1', body: 'Silakan datang pukul 10.00.' }, 'agent@example.com');
  assert.equal(record.crm.conversations[0].unread, 0);
  assert.equal(record.crm.conversations[0].messages[0][0], 'agent');
});

test('webhook WhatsApp membuat percakapan, lead, dan tugas', () => {
  const record = workshop({ name: 'MBACS Test', seed: seed() });
  const result = action(record, 'receive_message', {
    from: '0812 0000 9911',
    name: 'Rina Wijaya',
    body: 'Mobil saya perlu servis rutin.',
    vehicle: 'Toyota Calya 2021',
  }, 'whatsapp-webhook');

  assert.equal(result.created, true);
  assert.equal(record.crm.conversations[0].phone, '+6281200009911');
  assert.equal(record.crm.conversations[0].messages[0][1], 'Mobil saya perlu servis rutin.');
  assert.equal(record.crm.leadColumns[0].cards[0][0], 'Rina Wijaya');
  assert.match(record.crm.tasks[0][0], /Rina Wijaya/);
});
