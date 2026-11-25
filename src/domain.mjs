export const clean = (value, max = 2000) => String(value ?? "").trim().slice(0, max);
const now = () => new Date().toISOString();
const uid = () => crypto.randomUUID();
const need = (value, message) => { if (!value) throw new Error(message); return value; };

const emptyCRM = () => ({ conversations: [], appointments: [], tasks: [], leadColumns: [], customers: [] });

export function phone(value) {
  const raw = clean(value, 32);
  if (!raw) return "";
  need(/^\+?[0-9() .-]+$/.test(raw), "Format nomor telepon tidak valid.");
  let digits = raw.replace(/\D/g, "");
  if (raw.startsWith("0")) digits = "62" + digits.slice(1);
  need(/^[1-9]\d{7,14}$/.test(digits), "Nomor telepon harus berisi 8–15 digit.");
  return "+" + digits;
}

function initials(name) {
  return clean(name, 120).split(/\s+/).slice(0, 2).map(part => part[0] || "").join("").toUpperCase();
}

function boundedArray(value, max) { return Array.isArray(value) ? value.slice(0, max) : []; }

export function sanitizeCRM(input = {}) {
  const text = JSON.stringify(input ?? {});
  need(text.length <= 400000, "Data CRM melebihi batas sinkronisasi 400 KB.");
  return {
    conversations: boundedArray(input.conversations, 500),
    appointments: boundedArray(input.appointments, 1000),
    tasks: boundedArray(input.tasks, 1000),
    leadColumns: boundedArray(input.leadColumns, 20),
    customers: boundedArray(input.customers, 5000)
  };
}

export function workshop(input = {}) {
  return {
    profile: {
      name: need(clean(input.name, 120), "Nama workshop wajib diisi."),
      timezone: "Asia/Jakarta",
      phone: input.phone ? phone(input.phone) : "",
      address: clean(input.address, 500),
      aiPolicy: "AI membantu merangkum, mengekstrak kebutuhan, dan membuat draf. Diagnosis final, harga, diskon, dan janji hasil wajib dikonfirmasi manusia."
    },
    members: {},
    crm: sanitizeCRM(input.seed || emptyCRM()),
    audit: [{ id: uid(), action: "workshop.created", at: now(), actor: clean(input.actor, 160) }]
  };
}

function audit(record, actionName, actor, detail = "") {
  record.audit.push({ id: uid(), action: actionName, actor: clean(actor, 160), detail: clean(detail, 500), at: now() });
  record.audit = record.audit.slice(-500);
}

export const readOnlyActions = new Set(["list", "state"]);
export const ownerActions = new Set(["grant"]);

export function action(record, name, args = {}, actor = "") {
  const crm = record.crm;
  switch (name) {
    case "state": return record;
    case "sync":
      record.crm = sanitizeCRM(args.data);
      audit(record, "crm.synced", actor);
      return { synced: true, counts: Object.fromEntries(Object.entries(record.crm).map(([key, value]) => [key, value.length])) };
    case "customer": {
      const customerName = need(clean(args.name, 120), "Nama pelanggan wajib diisi.");
      const row = [customerName, initials(customerName), "avatar-green", phone(args.phone), clean(args.vehicle, 120) || "Kendaraan belum dilengkapi", clean(args.plate, 24).toUpperCase(), "Belum servis", "—", "Aktif"];
      crm.customers.unshift(row);
      audit(record, "customer.created", actor, customerName);
      return row;
    }
    case "lead": {
      const leadName = need(clean(args.name, 120), "Nama prospek wajib diisi.");
      need(crm.leadColumns[0], "Pipeline belum dikonfigurasi.");
      const row = [leadName, need(clean(args.need, 500), "Kebutuhan wajib diisi."), clean(args.vehicle, 120), Math.max(0, Math.min(100, Number(args.score) || 70)), clean(args.next, 160) || "Respons · Hari ini"];
      crm.leadColumns[0].cards.unshift(row);
      audit(record, "lead.created", actor, leadName);
      return row;
    }
    case "appointment": {
      const row = { id: uid(), name: need(clean(args.name, 120), "Nama pelanggan wajib diisi."), time: need(clean(args.time, 5), "Jam wajib diisi."), date: need(clean(args.date, 10), "Tanggal wajib diisi."), bay: Math.max(1, Math.min(3, Number(args.bay) || 1)), job: need(clean(args.job, 500), "Kebutuhan servis wajib diisi."), status: "Belum konfirmasi", tone: "amber" };
      crm.appointments.push(row);
      audit(record, "appointment.created", actor, row.name);
      return row;
    }
    case "message": {
      const conversation = need(crm.conversations.find(item => String(item.id) === clean(args.conversation, 80)), "Percakapan tidak ditemukan.");
      const body = need(clean(args.body, 4000), "Isi pesan wajib diisi.");
      conversation.messages.push(["agent", body, "Baru saja"]);
      conversation.preview = body;
      conversation.time = "Baru saja";
      conversation.unread = 0;
      audit(record, "message.drafted", actor, conversation.name);
      return { conversation: conversation.id, saved: true };
    }
    case "receive_message": {
      const senderPhone = phone(args.from);
      const body = need(clean(args.body, 4000), "Isi pesan wajib diisi.");
      const externalThreadId = clean(args.externalThreadId, 160) || senderPhone;
      let conversation = crm.conversations.find((item) => item.phone === senderPhone || item.externalThreadId === externalThreadId);
      const created = !conversation;
      if (!conversation) {
        const nextId = crm.conversations.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
        const senderName = clean(args.name, 120) || senderPhone;
        conversation = {
          id: nextId,
          name: senderName,
          initials: initials(senderName),
          tone: "avatar-green",
          time: "Baru saja",
          unread: 0,
          preview: "",
          status: "Perlu respons",
          vehicle: clean(args.vehicle, 120) || "Kendaraan belum diketahui",
          plate: clean(args.plate, 24).toUpperCase() || "—",
          source: "WhatsApp",
          score: 60,
          phone: senderPhone,
          externalThreadId,
          messages: []
        };
        crm.conversations.unshift(conversation);
        crm.conversations = crm.conversations.slice(0, 500);
      }
      conversation.messages = Array.isArray(conversation.messages) ? conversation.messages.slice(-1999) : [];
      conversation.messages.push(["customer", body, clean(args.receivedLabel, 40) || "Baru saja"]);
      conversation.preview = body;
      conversation.time = "Baru saja";
      conversation.unread = Math.max(0, Number(conversation.unread) || 0) + 1;
      conversation.status = "Perlu respons";

      if (created && crm.leadColumns[0]?.cards) {
        const needText = clean(args.need, 500) || body;
        conversation.score = Math.max(0, Math.min(100, Number(args.score) || 60));
        crm.leadColumns[0].cards.unshift([conversation.name, needText, conversation.vehicle, conversation.score, "Respons · Hari ini"]);
        crm.leadColumns[0].cards = crm.leadColumns[0].cards.slice(0, 1000);
        crm.tasks = boundedArray(crm.tasks, 999);
        crm.tasks.unshift([`Respons WhatsApp ${conversation.name}`, `Lead baru · ${conversation.vehicle}`, "Hari ini", false]);
      }
      audit(record, "message.received", actor, senderPhone);
      return { conversation: conversation.id, created, unread: conversation.unread };
    }
    case "advance_lead": {
      const from = Number(args.from), index = Number(args.index);
      need(Number.isInteger(from) && from >= 0 && from < crm.leadColumns.length - 1, "Tahap asal tidak valid.");
      const [lead] = crm.leadColumns[from].cards.splice(index, 1);
      need(lead, "Lead tidak ditemukan.");
      lead[4] = clean(args.next, 160) || "Tindak lanjut · Hari ini";
      crm.leadColumns[from + 1].cards.unshift(lead);
      audit(record, "lead.advanced", actor, lead[0]);
      return { lead: lead[0], stage: crm.leadColumns[from + 1].title };
    }
    case "grant": {
      const email = clean(args.email, 254).toLowerCase();
      need(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Email anggota tidak valid.");
      if (args.role === "remove") delete record.members[email];
      else record.members[email] = args.role === "admin" ? "admin" : "agent";
      audit(record, "access.updated", actor, email);
      return record.members;
    }
    default: throw new Error("Tindakan CRM tidak dikenal.");
  }
}
