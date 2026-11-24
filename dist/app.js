const icons = {
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.5 9.5 0 0 1-3.8-.8L3 21l1.8-4.7A8.4 8.4 0 1 1 21 11.5Z"/></svg>',
  pipeline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h5M15 6h5M9 6h6M7 6v12h4M17 6v5h-4M11 18h6v-7h-4"/><circle cx="7" cy="6" r="2"/><circle cx="17" cy="6" r="2"/><circle cx="11" cy="18" r="2"/><circle cx="13" cy="11" r="2"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.14.36.35.7.6 1 .28.3.65.45 1.1.4H21a2 2 0 1 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M14.7 21h-5.4"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 10 4 4 4-4"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m12 3 1.4 4.2L18 9l-4.6 1.8L12 15l-1.4-4.2L6 9l4.6-1.8L12 3Z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></svg>',
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m5 11 1.5-4.5h11L19 11M3 14v5h3v-2h12v2h3v-5l-2-3H5l-2 3Z"/><circle cx="7" cy="14" r="1"/><circle cx="17" cy="14" r="1"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 4 4L19 6"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/></svg>',
};

document.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = icons[el.dataset.icon] || ''; });

let conversations = [
  { id: 1, name: 'Dimas Prasetyo', initials: 'DP', tone: 'avatar-blue', time: '09:42', unread: 2, preview: 'Ada bunyi gluduk saat lewat polisi tidur...', status: 'Perlu respons', vehicle: 'Honda HR-V 2021', plate: 'B 1842 KZT', source: 'Instagram Ads', score: 86, messages: [
    ['customer', 'Pagi kak, mobil saya belakangan ada bunyi gluduk kalau lewat polisi tidur.', '09:38'],
    ['agent', 'Selamat pagi Pak Dimas. Saya bantu cek dulu ya. Bunyinya terasa dari bagian depan atau belakang kendaraan?', '09:39'],
    ['customer', 'Sepertinya dari depan kiri. Kalau jalan rata tidak terlalu terasa.', '09:42']
  ]},
  { id: 2, name: 'Sari Wulandari', initials: 'SW', tone: 'avatar-purple', time: '09:35', unread: 1, preview: 'Bisa booking servis rutin untuk besok?', status: 'Booking', vehicle: 'Toyota Yaris 2019', plate: 'B 2215 UFX', source: 'Referral', score: 92, messages: [
    ['customer', 'Halo, bisa booking servis rutin untuk besok pagi?', '09:31'],
    ['agent', 'Bisa Bu Sari. Untuk besok tersedia pukul 09.00 dan 11.00. Ibu lebih nyaman yang mana?', '09:33'],
    ['customer', 'Jam 09.00 ya, Kak.', '09:35']
  ]},
  { id: 3, name: 'Rizky Maulana', initials: 'RM', tone: 'avatar-orange', time: '09:18', unread: 1, preview: 'AC-nya tidak dingin sejak kemarin.', status: 'Perlu eskalasi', vehicle: 'Daihatsu Xenia 2018', plate: 'B 9781 CK', source: 'WhatsApp', score: 78, messages: [
    ['customer', 'AC mobil saya tidak dingin sejak kemarin. Kira-kira kenapa ya?', '09:16'],
    ['agent', 'Kami perlu pemeriksaan langsung untuk memastikan penyebabnya, Pak Rizky. Apakah hembusan anginnya masih kuat?', '09:17'],
    ['customer', 'Masih kuat, cuma udaranya panas.', '09:18']
  ]},
  { id: 4, name: 'Maya Anggraini', initials: 'MA', tone: 'avatar-green', time: '08:56', unread: 0, preview: 'Baik, terima kasih informasinya.', status: 'Menunggu pelanggan', vehicle: 'Suzuki Ertiga 2020', plate: 'B 3058 PZH', source: 'Organik', score: 72, messages: [
    ['customer', 'Apakah hari Sabtu bengkel buka?', '08:51'],
    ['agent', 'Buka, Bu Maya. Hari Sabtu kami melayani pukul 08.00–16.00. Apakah Ibu ingin saya bantu cek slot?', '08:53'],
    ['customer', 'Baik, terima kasih informasinya.', '08:56']
  ]},
  { id: 5, name: 'Fajar Nugroho', initials: 'FN', tone: 'avatar-slate', time: 'Kemarin', unread: 0, preview: 'Saya konfirmasi datang jam 13.00.', status: 'Selesai', vehicle: 'Mitsubishi Xpander 2022', plate: 'B 1428 VME', source: 'Repeat customer', score: 95, messages: [['customer', 'Saya konfirmasi datang jam 13.00 besok.', '16:20'], ['agent', 'Siap Pak Fajar, booking sudah kami konfirmasi. Sampai bertemu besok.', '16:22']] }
];

const attentionData = [
  { id: 3, badge: 'Eskalasi', time: '4 mnt', text: 'AC tidak dingin, pelanggan meminta estimasi biaya.' },
  { id: 1, badge: 'Belum dibalas', time: '7 mnt', text: 'Ada bunyi gluduk saat melewati polisi tidur.' },
  { id: 2, badge: 'Konfirmasi', time: '12 mnt', text: 'Memilih slot servis rutin besok pukul 09.00.' },
  { id: 4, badge: 'Follow-up', time: '28 mnt', text: 'Menanyakan jam operasional hari Sabtu.' }
];

let appointments = [
  { time: '08:30', name: 'Budi Santoso', job: 'Servis berkala · Avanza', status: 'Hadir', bay: 1, date: '2026-11-25', tone: 'green' },
  { time: '08:00', name: 'Nadia Putri', job: 'Pemeriksaan rem · Brio', status: 'Dikonfirmasi', bay: 3, date: '2026-11-25', tone: 'blue' },
  { time: '10:00', name: 'Rizal Akbar', job: 'Ganti oli · Agya', status: 'Dikonfirmasi', bay: 2, date: '2026-11-25', tone: 'amber' },
  { time: '10:30', name: 'Dewi Kurnia', job: 'Spooring · Mobilio', status: 'Dikonfirmasi', bay: 3, date: '2026-11-25', tone: 'green' },
  { time: '12:00', name: 'Fajar Nugroho', job: 'Ganti oli & filter · Xpander', status: 'Dikonfirmasi', bay: 1, date: '2026-11-25', tone: 'blue' },
  { time: '14:00', name: 'Arman Hakim', job: 'Diagnostik AC · Jazz', status: 'Belum konfirmasi', bay: 1, date: '2026-11-25', tone: 'amber' },
  { time: '14:30', name: 'Tono Wijaya', job: 'Cek kelistrikan · Innova', status: 'Dikonfirmasi', bay: 2, date: '2026-11-25', tone: 'green' }
];

let tasks = [
  ['Hubungi kembali Pak Hendra', 'Lead · Toyota Rush 2020', '10:00'],
  ['Konfirmasi booking Bu Sari', 'Booking besok · 09.00', '11:30'],
  ['Follow-up estimasi Pak Dimas', 'Lead qualified · Suspensi', '13:00'],
  ['Minta feedback Bu Nadia', 'After-sales · Servis rem', '16:00'],
  ['Ingatkan servis Pak Agung', 'Maintenance recall', '17:00']
];

let leadColumns = [
  { title: 'Baru', value: 'Rp 18,5 jt', cards: [
    ['Aldi Saputra', 'Bunyi pada kaki-kaki depan', 'Honda Jazz 2017', 78, 'Respons · 10.30'],
    ['Lina Marlina', 'Servis rutin 40.000 km', 'Toyota Raize 2022', 84, 'Hubungi · 11.00'],
    ['Reno Aditya', 'Cek mesin bergetar', 'Suzuki Baleno 2019', 69, 'Kualifikasi · 13.00']
  ]},
  { title: 'Dihubungi', value: 'Rp 26,2 jt', cards: [
    ['Dimas Prasetyo', 'Pemeriksaan suspensi', 'Honda HR-V 2021', 86, 'Follow-up · 13.00'],
    ['Tia Permata', 'AC kurang dingin', 'Nissan Livina 2020', 73, 'Tunggu respons · 14.00']
  ]},
  { title: 'Qualified', value: 'Rp 31,8 jt', cards: [
    ['Hendra Wijaya', 'Paket servis besar', 'Toyota Rush 2020', 91, 'Tawarkan slot · 10.00'],
    ['Arman Hakim', 'Diagnostik AC', 'Honda Jazz 2018', 88, 'Konfirmasi · 12.30']
  ]},
  { title: 'Booking Pending', value: 'Rp 22,4 jt', cards: [
    ['Sari Wulandari', 'Servis rutin', 'Toyota Yaris 2019', 92, 'Konfirmasi · 11.30'],
    ['Maya Anggraini', 'Pemeriksaan umum', 'Suzuki Ertiga 2020', 81, 'Follow-up · 15.00']
  ]},
  { title: 'Booked', value: 'Rp 47,6 jt', cards: [
    ['Fajar Nugroho', 'Ganti oli & filter', 'Mitsubishi Xpander 2022', 95, 'Datang · Hari ini'],
    ['Nadia Putri', 'Pemeriksaan rem', 'Honda Brio 2021', 94, 'Datang · Hari ini'],
    ['Budi Santoso', 'Servis berkala', 'Toyota Avanza 2019', 97, 'Sudah hadir']
  ]}
];

let customers = [
  ['Budi Santoso','BS','avatar-green','0812 8421 7712','Toyota Avanza 2019','B 1923 TZA','Hari ini','Rp 8,4 jt','Aktif'],
  ['Nadia Putri','NP','avatar-purple','0813 5572 9018','Honda Brio 2021','B 2811 KFI','Hari ini','Rp 4,7 jt','Aktif'],
  ['Fajar Nugroho','FN','avatar-blue','0857 3324 1109','Mitsubishi Xpander 2022','B 1428 VME','25 Nov 2026','Rp 6,2 jt','Aktif'],
  ['Sari Wulandari','SW','avatar-orange','0819 7741 3802','Toyota Yaris 2019','B 2215 UFX','18 Okt 2026','Rp 11,9 jt','Aktif'],
  ['Dimas Prasetyo','DP','avatar-slate','0822 6321 4017','Honda HR-V 2021','B 1842 KZT','Belum servis','—','Prospek'],
  ['Maya Anggraini','MA','avatar-green','0812 9034 5521','Suzuki Ertiga 2020','B 3058 PZH','08 Sep 2026','Rp 3,8 jt','Aktif']
];

const STORAGE_KEY = 'mbacs.crm.v2';
const seedState = JSON.parse(JSON.stringify({ conversations, appointments, tasks, leadColumns, customers }));
let activeConversationId = 1;

function restoreState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return;
    conversations = Array.isArray(saved.conversations) ? saved.conversations : conversations;
    appointments = Array.isArray(saved.appointments) ? saved.appointments : appointments;
    tasks = Array.isArray(saved.tasks) ? saved.tasks : tasks;
    leadColumns = Array.isArray(saved.leadColumns) ? saved.leadColumns : leadColumns;
    customers = Array.isArray(saved.customers) ? saved.customers : customers;
  } catch (error) {
    console.warn('Data lokal MBACS tidak dapat dibaca.', error);
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ conversations, appointments, tasks, leadColumns, customers, savedAt: new Date().toISOString() }));
}

function resetDemoState() {
  ({ conversations, appointments, tasks, leadColumns, customers } = JSON.parse(JSON.stringify(seedState)));
  persistState();
  renderAll();
}

restoreState();

function renderDashboard() {
  document.querySelector('#attentionList').innerHTML = attentionData.map((item) => {
    const c = conversations.find((entry) => entry.id === item.id);
    return `<div class="attention-item" data-conversation="${c.id}"><div class="avatar ${c.tone}">${c.initials}</div><div class="attention-main"><div class="attention-title"><strong>${c.name}</strong><span>${item.badge}</span></div><p>${item.text}</p></div><div class="attention-meta"><time>${item.time}</time>${c.unread ? `<b>${c.unread}</b>` : ''}</div></div>`;
  }).join('');
  document.querySelector('#todayTimeline').innerHTML = appointments.slice().sort((a,b) => a.time.localeCompare(b.time)).slice(0,4).map((a) => `<div class="timeline-item"><time>${a.time}</time><i class="timeline-marker"></i><div class="timeline-copy"><strong>${escapeHtml(a.name)}</strong><p>${escapeHtml(a.job)}</p><span>${a.status}</span></div></div>`).join('');
  const bars = [['Baru', 36, 18], ['Dihubungi', 54, 27], ['Qualified', 78, 39], ['Booking', 48, 24], ['Konversi', 28, 14]];
  document.querySelector('#pipelineBars').innerHTML = bars.map(([name,width,total]) => `<div class="pipeline-row"><label>${name}</label><div class="bar"><span style="width:${width}%"></span></div><strong>${total}</strong></div>`).join('');
  document.querySelector('#taskList').innerHTML = tasks.map((t,i) => `<div class="task-item ${t[3] ? 'done' : ''}"><button class="task-check" data-task="${i}" aria-label="Tandai tugas selesai"></button><div class="task-copy"><strong>${t[0]}</strong><span>${t[1]}</span></div><time>${t[2]}</time></div>`).join('');
}

function renderConversationList(filter = '') {
  const list = conversations.filter((c) => `${c.name} ${c.preview}`.toLowerCase().includes(filter.toLowerCase()));
  document.querySelector('#conversationList').innerHTML = list.map((c, i) => `<div class="conversation-card ${i === 0 && !filter ? 'active' : ''}" data-id="${c.id}"><div class="avatar ${c.tone}">${c.initials}</div><div><strong>${c.name}</strong><p>${c.preview}</p></div><div><time>${c.time}</time>${c.unread ? `<b>${c.unread}</b>` : ''}</div></div>`).join('');
}

function renderChat(id = 1) {
  const c = conversations.find((item) => item.id === Number(id)) || conversations[0];
  activeConversationId = c.id;
  document.querySelectorAll('.conversation-card').forEach((el) => el.classList.toggle('active', Number(el.dataset.id) === c.id));
  document.querySelector('#chatPane').innerHTML = `<header class="chat-head"><div class="chat-head-main"><div class="avatar ${c.tone}">${c.initials}</div><div><strong>${c.name}</strong><span>WhatsApp · terakhir aktif ${c.time}</span></div></div><span class="chat-status">${c.status}</span></header><div class="messages">${c.messages.map((m) => `<div class="message ${m[0]}"><div class="bubble">${m[1]}</div><time>${m[2]}</time></div>`).join('')}</div><div class="ai-suggestion"><span data-icon="spark">${icons.spark}</span><div><strong>Saran balasan AI</strong><p>Sebaiknya jadwalkan pemeriksaan langsung agar tim teknisi dapat memastikan penyebabnya tanpa memberi diagnosis awal.</p></div><button data-use-suggestion>Gunakan</button></div><form class="composer" id="messageComposer"><textarea rows="1" placeholder="Tulis balasan..."></textarea><button class="send-button" aria-label="Kirim pesan">${icons.send}</button></form>`;
  document.querySelector('#contextPane').innerHTML = `<div class="context-profile"><div class="avatar ${c.tone}">${c.initials}</div><h3>${c.name}</h3><p>+62 812 3400 ${String(c.id).padStart(4,'0')}</p></div><div class="context-section"><h3>Ringkasan lead</h3><div class="context-detail"><span>Status</span><strong>${c.status}</strong></div><div class="context-detail"><span>Skor</span><strong>${c.score}/100</strong></div><div class="context-detail"><span>Sumber</span><strong>${c.source}</strong></div></div><div class="context-section"><h3>Kendaraan</h3><div class="vehicle-card"><strong>${c.vehicle}</strong><span>${c.plate}</span></div></div><div class="context-section"><h3>Catatan AI</h3><p style="font-size:.65rem;color:var(--muted);line-height:1.5;margin:0">Pelanggan menjelaskan gejala dengan jelas. Hindari diagnosis final; arahkan ke pemeriksaan teknisi.</p></div>`;
  bindChatActions();
}

function bindChatActions() {
  document.querySelector('[data-use-suggestion]')?.addEventListener('click', () => {
    document.querySelector('#messageComposer textarea').value = 'Baik, untuk memastikan penyebabnya kami sarankan pemeriksaan langsung oleh teknisi. Saya bisa bantu cek slot kunjungan yang tersedia. Kapan Bapak/Ibu berencana datang?';
  });
  document.querySelector('#messageComposer')?.addEventListener('submit', (event) => {
    event.preventDefault(); const input = event.currentTarget.querySelector('textarea'); if (!input.value.trim()) return;
    const c = conversations.find((item) => item.id === activeConversationId); const text = input.value.trim();
    c.messages.push(['agent', text, 'Baru saja']); c.preview = text; c.time = 'Baru saja'; c.unread = 0; persistState();
    const messages = document.querySelector('.messages'); messages.insertAdjacentHTML('beforeend', `<div class="message agent"><div class="bubble">${escapeHtml(text)}</div><time>Baru saja</time></div>`); input.value = ''; messages.scrollTop = messages.scrollHeight; renderConversationList(); showToast('Pesan terkirim', 'Balasan tercatat di riwayat pelanggan.');
  });
}

function renderPipeline() {
  document.querySelector('#kanbanBoard').innerHTML = leadColumns.map((col,i) => `<section class="kanban-column"><div class="kanban-head"><div class="kanban-title"><i style="opacity:${.55+i*.1}"></i><strong>${col.title}</strong><span>${col.cards.length}</span></div><span class="kanban-value">${col.value}</span></div>${col.cards.map((c,cardIndex) => `<article class="lead-card"><div class="lead-card-top"><strong>${escapeHtml(c[0])}</strong><span class="score">${c[3]}</span></div><p>${escapeHtml(c[1])}</p><span class="lead-vehicle">${icons.car}${escapeHtml(c[2])}</span><div class="lead-next"><span>${c[4]}</span><div class="lead-controls"><i class="mini-avatar">AR</i>${i < leadColumns.length - 1 ? `<button class="advance-lead" data-advance-lead="${i}:${cardIndex}" title="Pindahkan ke ${leadColumns[i+1].title}">${icons.right}</button>` : ''}</div></div></article>`).join('')}</section>`).join('');
}

function renderBooking() {
  const slots = [8,10,12,14,16];
  const rows = slots.map((hour) => [String(hour).padStart(2,'0') + ':00', ...[1,2,3].map((bay) => appointments.find((a) => Number(a.bay) === bay && Math.floor(Number(a.time.split(':')[0]) / 2) * 2 === hour))]);
  document.querySelector('#scheduleGrid').innerHTML = rows.map((r) => `<div class="schedule-row"><div class="schedule-time">${r[0]}</div>${r.slice(1).map((b) => `<div class="schedule-cell">${b ? `<div class="booking-block ${b.tone || 'green'}"><strong>${escapeHtml(b.name)}</strong><span>${escapeHtml(b.job)}</span></div>` : ''}</div>`).join('')}</div>`).join('');
  const confirmed = appointments.filter((a) => a.status === 'Dikonfirmasi').length; const present = appointments.filter((a) => a.status === 'Hadir').length; const pending = appointments.length - confirmed - present; const total = 15;
  document.querySelector('#bookingSummary').innerHTML = `<div class="summary-block"><div class="capacity-number"><strong>${appointments.length}</strong><span>dari ${total} slot terisi</span></div><div class="capacity-bar"><span style="width:${Math.min(100, appointments.length/total*100)}%"></span></div></div><div class="summary-block"><div class="summary-stat"><span>Dikonfirmasi</span><strong>${confirmed}</strong></div><div class="summary-stat"><span>Menunggu konfirmasi</span><strong>${pending}</strong></div><div class="summary-stat"><span>Sudah hadir</span><strong>${present}</strong></div><div class="summary-stat"><span>Slot tersedia</span><strong>${Math.max(0,total-appointments.length)}</strong></div></div>`;
}

function renderCustomers(filter = '') {
  const list = customers.filter((c) => c.join(' ').toLowerCase().includes(filter.toLowerCase()));
  document.querySelector('#customerTable').innerHTML = `<div class="customer-row header"><span>Pelanggan</span><span>Kendaraan</span><span>Terakhir servis</span><span>Nilai transaksi</span><span>Status</span><span></span></div>${list.map((c) => { const idx = customers.indexOf(c); return `<div class="customer-row" data-customer-index="${idx}"><div class="customer-name"><div class="avatar ${c[2]}">${c[1]}</div><div><strong>${escapeHtml(c[0])}</strong><span>${escapeHtml(c[3])}</span></div></div><div class="customer-vehicle"><strong>${escapeHtml(c[4])}</strong><span>${escapeHtml(c[5])}</span></div><span>${c[6]}</span><strong style="font-size:.7rem">${c[7]}</strong><span class="status-chip">${c[8]}</span><button class="row-action" aria-label="Buka profil pelanggan">•••</button></div>`; }).join('')}`;
}

function renderRetention() {
  const metrics = [['clock','Reminder jatuh tempo','18','6 perlu dikirim hari ini'],['message','Feedback menunggu','9','setelah servis 2 hari'],['star','Rating rata-rata','4.8','dari 126 ulasan'],['heart','Repeat visit','38.6%','naik 4.2% bulan ini']];
  document.querySelector('.retention-metrics').innerHTML = metrics.map((m,i) => `<article class="metric-card"><div class="metric-top"><span class="metric-icon ${['amber','blue','green','coral'][i]}" data-icon="${m[0]}">${icons[m[0]]}</span><span class="trend up">Aktif</span></div><p>${m[1]}</p><strong>${m[2]}</strong><small>${m[3]}</small></article>`).join('');
  const items = [['clock','Pengingat servis 10.000 km','12 pelanggan','Hari ini'],['message','Minta feedback setelah servis','6 pelanggan','Besok'],['star','Permintaan ulasan Google','8 pelanggan','27 Nov'],['heart','Follow-up pelanggan pasif','14 pelanggan','30 Nov']];
  document.querySelector('#retentionList').innerHTML = items.map((i) => `<div class="retention-item"><span class="retention-icon">${icons[i[0]]}</span><div><strong>${i[1]}</strong><p>${i[2]}</p></div><time>${i[3]}</time></div>`).join('');
}

function renderSettings() {
  const settings = [['settings','Profil bengkel','Alamat, jam operasional, dan kebijakan layanan'],['users','Tim & hak akses','Atur supervisor, CS, dan penanggung jawab lead'],['message','Integrasi WhatsApp','Nomor, webhook, dan template pesan resmi'],['spark','Aturan AI Assistant','Knowledge base, guardrail, dan human handoff'],['pipeline','Workflow n8n','Status otomasi customer service dan CRM'],['calendar','Slot & kapasitas','Jam booking, bay servis, dan hari libur']];
  document.querySelector('#settingsGrid').innerHTML = settings.map((s) => `<article class="panel setting-card"><span class="setting-icon">${icons[s[0]]}</span><div><h3>${s[1]}</h3><p>${s[2]}</p></div>${icons.right}</article>`).join('') + `<article class="panel setting-card data-card"><span class="setting-icon">${icons.check}</span><div><h3>Data lokal</h3><p>Data operasional tersimpan aman di browser ini.</p><div class="setting-actions"><button data-export-data>Ekspor JSON</button><button class="danger-link" data-reset-data>Reset demo</button></div></div></article>`;
}

function navigate(view) {
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${view}`));
  document.querySelectorAll('.nav-item[data-view]').forEach((n) => n.classList.toggle('active', n.dataset.view === view));
  document.querySelector('#sidebar').classList.remove('open'); window.scrollTo({top:0, behavior:'smooth'});
}

function openModal(action = 'booking') {
  const title = action === 'new-lead' ? 'Tambah lead baru' : action === 'new-customer' ? 'Tambah pelanggan baru' : 'Buat booking baru';
  const today = new Date().toISOString().slice(0,10); const form = document.querySelector('#quickForm'); form.dataset.action = action;
  document.querySelector('#modalTitle').textContent = title;
  document.querySelector('#formSubmitButton').hidden = false; document.querySelector('#formSubmitButton').textContent = action === 'new-lead' ? 'Simpan lead' : action === 'new-customer' ? 'Simpan pelanggan' : 'Simpan booking';
  const common = `<label>Nama pelanggan<input required name="customer" placeholder="Contoh: Budi Santoso" /></label><div class="form-row"><label>Nomor WhatsApp<input required name="phone" inputmode="tel" placeholder="08xxxxxxxxxx" /></label><label>Nomor polisi<input required name="plate" placeholder="B 1234 XYZ" /></label></div>`;
  document.querySelector('#quickFormFields').innerHTML = action === 'new-customer' ? `${common}<label>Kendaraan<input required name="vehicle" placeholder="Contoh: Toyota Avanza 2021" /></label>` : action === 'new-lead' ? `${common}<label>Kendaraan<input required name="vehicle" placeholder="Contoh: Honda Brio 2020" /></label><label>Keluhan / kebutuhan<textarea required name="need" rows="3" placeholder="Jelaskan kebutuhan pelanggan secara singkat"></textarea></label><label>Sumber lead<select required name="source"><option>WhatsApp</option><option>Instagram Ads</option><option>Referral</option><option>Datang langsung</option></select></label>` : `${common}<label>Keluhan / kebutuhan<textarea required name="need" rows="3" placeholder="Jelaskan kebutuhan pelanggan secara singkat"></textarea></label><div class="form-row"><label>Tanggal<input required name="date" type="date" value="${today}" /></label><label>Jam<input required name="time" type="time" value="10:00" /></label></div><label>Bay servis<select required name="bay"><option value="1">Bay 1</option><option value="2">Bay 2</option><option value="3">Bay 3</option></select></label>`;
  document.querySelector('#modalBackdrop').hidden = false; document.body.style.overflow = 'hidden';
}
function openCustomer(index) {
  const c = customers[index]; if (!c) return; const form = document.querySelector('#quickForm'); form.dataset.action = 'customer-detail';
  document.querySelector('#modalTitle').textContent = 'Customer 360'; document.querySelector('#formSubmitButton').hidden = true;
  document.querySelector('#quickFormFields').innerHTML = `<div class="customer-detail"><div class="customer-detail-head"><div class="avatar ${c[2]}">${c[1]}</div><div><h3>${escapeHtml(c[0])}</h3><p>${escapeHtml(c[3])}</p></div><span class="status-chip">${c[8]}</span></div><div class="detail-grid"><div><span>Kendaraan</span><strong>${escapeHtml(c[4])}</strong></div><div><span>Nomor polisi</span><strong>${escapeHtml(c[5])}</strong></div><div><span>Terakhir servis</span><strong>${c[6]}</strong></div><div><span>Total transaksi</span><strong>${c[7]}</strong></div></div><div class="detail-note"><strong>Ringkasan hubungan</strong><p>Riwayat pelanggan, kendaraan, percakapan, booking, dan servis siap digunakan oleh CS sebagai konteks pelayanan.</p></div></div>`;
  document.querySelector('#modalBackdrop').hidden = false; document.body.style.overflow = 'hidden';
}
function closeModal() { document.querySelector('#modalBackdrop').hidden = true; document.body.style.overflow = ''; }
function showToast(title, copy) { const toast = document.querySelector('#toast'); toast.querySelector('strong').textContent = title; toast.querySelector('small').textContent = copy; toast.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => toast.classList.remove('show'), 3200); }
function escapeHtml(value) { const el = document.createElement('div'); el.textContent = value; return el.innerHTML; }

function renderAll() { renderDashboard(); renderConversationList(); renderChat(activeConversationId); renderPipeline(); renderBooking(); renderCustomers(); renderRetention(); renderSettings(); }
renderAll();

document.addEventListener('click', (event) => {
  const nav = event.target.closest('[data-view]'); if (nav) navigate(nav.dataset.view);
  const linked = event.target.closest('[data-nav]'); if (linked) navigate(linked.dataset.nav);
  const action = event.target.closest('[data-action]'); if (action) openModal(action.dataset.action);
  const attention = event.target.closest('[data-conversation]'); if (attention) { navigate('inbox'); renderChat(attention.dataset.conversation); }
  const conversation = event.target.closest('.conversation-card'); if (conversation) { renderChat(conversation.dataset.id); document.querySelector('.inbox-layout').classList.add('chat-open'); }
  const check = event.target.closest('.task-check'); if (check) { const index = Number(check.dataset.task); tasks[index][3] = !tasks[index][3]; persistState(); renderDashboard(); }
  const advance = event.target.closest('[data-advance-lead]'); if (advance) { const [columnIndex,cardIndex] = advance.dataset.advanceLead.split(':').map(Number); const [lead] = leadColumns[columnIndex].cards.splice(cardIndex,1); lead[4] = `Tindak lanjut · ${new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}`; leadColumns[columnIndex+1].cards.unshift(lead); persistState(); renderPipeline(); showToast('Tahap lead diperbarui', `${lead[0]} dipindahkan ke ${leadColumns[columnIndex+1].title}.`); }
  const customerRow = event.target.closest('[data-customer-index]'); if (customerRow) openCustomer(Number(customerRow.dataset.customerIndex));
  if (event.target.closest('[data-export-data]')) exportData();
  if (event.target.closest('[data-reset-data]') && confirm('Reset seluruh perubahan lokal dan kembali ke data demo awal?')) { resetDemoState(); showToast('Data demo dipulihkan', 'Semua perubahan lokal telah direset.'); }
});
document.querySelector('#mobileMenu').addEventListener('click', () => document.querySelector('#sidebar').classList.toggle('open'));
document.querySelector('#conversationSearch').addEventListener('input', (e) => renderConversationList(e.target.value));
document.querySelector('#customerSearch').addEventListener('input', (e) => renderCustomers(e.target.value));
document.querySelector('#closeModal').addEventListener('click', closeModal); document.querySelector('#cancelModal').addEventListener('click', closeModal);
document.querySelector('#modalBackdrop').addEventListener('click', (e) => { if (e.target.id === 'modalBackdrop') closeModal(); });
document.querySelector('#quickForm').addEventListener('submit', (e) => {
  e.preventDefault(); const data = new FormData(e.currentTarget); const action = e.currentTarget.dataset.action; const name = data.get('customer');
  if (action === 'new-lead') {
    leadColumns[0].cards.unshift([name, data.get('need'), data.get('vehicle'), 70, 'Respons · Hari ini']);
    tasks.unshift([`Respons lead ${name}`, `Lead baru · ${data.get('vehicle')}`, 'Hari ini', false]); renderPipeline();
    showToast('Lead berhasil ditambahkan', `${name} masuk ke tahap Baru.`);
  } else if (action === 'new-customer') {
    const initials = name.split(/\s+/).slice(0,2).map((part) => part[0]).join('').toUpperCase(); customers.unshift([name,initials,'avatar-green',data.get('phone'),data.get('vehicle'),data.get('plate'),'Belum servis','—','Aktif']); renderCustomers();
    showToast('Pelanggan berhasil ditambahkan', `${name} tersedia di Customer 360.`);
  } else {
    const vehicle = data.get('plate'); appointments.push({time:data.get('time'),name,job:`${data.get('need')} · ${vehicle}`,status:'Belum konfirmasi',bay:Number(data.get('bay')),date:data.get('date'),tone:'amber'});
    if (!customers.some((c) => c[0].toLowerCase() === name.toLowerCase())) { const initials = name.split(/\s+/).slice(0,2).map((part) => part[0]).join('').toUpperCase(); customers.unshift([name,initials,'avatar-green',data.get('phone'),'Kendaraan belum dilengkapi',vehicle,'Belum servis','—','Prospek']); }
    tasks.unshift([`Konfirmasi booking ${name}`, `${data.get('date')} · ${data.get('time')}`, 'Hari ini', false]); renderBooking(); renderDashboard();
    showToast('Booking berhasil dibuat', `${name} dijadwalkan pukul ${data.get('time')}.`);
  }
  persistState(); closeModal(); e.currentTarget.reset();
});
function exportData() { const blob = new Blob([JSON.stringify({ exportedAt:new Date().toISOString(), conversations, appointments, tasks, leadColumns, customers },null,2)],{type:'application/json'}); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `mbacs-export-${new Date().toISOString().slice(0,10)}.json`; link.click(); URL.revokeObjectURL(link.href); showToast('Data berhasil diekspor','File JSON telah diunduh.'); }
document.querySelector('#globalSearch').addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.value.trim()) { navigate('customers'); document.querySelector('#customerSearch').value = e.target.value; renderCustomers(e.target.value); } });
document.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); document.querySelector('#globalSearch').focus(); } if (e.key === 'Escape') closeModal(); });
