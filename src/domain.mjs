export const stages = ["Baru","Dihubungi","Terkualifikasi","Penawaran","Menang","Kalah"];
export const ticketStages = ["Terbuka","Ditangani","Menunggu","Selesai"];
export const templates = {
  "Kuliner": {tone:"Hangat dan santai", greeting:"Halo, Kak!", flow:"Boleh tahu jumlah pesanan dan jam pengirimannya?"},
  "Toko online": {tone:"Ramah dan ringkas", greeting:"Halo, Kak!", flow:"Boleh tahu produk, varian, dan kode pos tujuannya?"},
  "Jasa": {tone:"Sopan dan profesional", greeting:"Halo, Bapak/Ibu.", flow:"Boleh informasikan lokasi serta jam kunjungan yang diinginkan?"}
};
export const clean = (value, max=2000) => String(value ?? "").trim().slice(0,max);
const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const need = (v,m) => { if (!v) throw new Error(m); return v; };
export function phone(input) {
  const value=clean(input);
  if (!value) return "";
  need(/^\+?[0-9() .-]+$/.test(value),"Format telepon tidak valid.");
  let digits=value.replace(/\D/g,"");
  if (value.startsWith("0")) digits="62"+digits.slice(1);
  need((value.startsWith("+") || value.startsWith("0") || digits.startsWith("62")) && /^[1-9]\d{7,14}$/.test(digits),"Gunakan nomor lokal Indonesia atau awalan internasional +.");
  return "+"+digits;
}
const email = v => clean(v,254).toLowerCase();
const money = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const fields = ["name","region","hours","catalog","price","availability","faq","policy","brand","language","tone","greeting","handoff","flow","opener","testimonials","autoCategories"];
export function profile(input={}, previous={}) {
  const type=need(Object.hasOwn(templates,input.type ?? previous.type ?? "Kuliner")&&templates[input.type ?? previous.type ?? "Kuliner"],"Template bisnis tidak dikenal.");
  const result={language:"Indonesia", ...type, ...previous};
  for(const k of fields) if(k in input) result[k]=clean(input[k], k==="name"?100:3000);
  result.name=need(result.name,"Nama bisnis wajib diisi.");
  result.type=input.type ?? previous.type ?? "Kuliner";
  if("phone" in input) result.phone=phone(input.phone);
  result.mode=input.mode==="connected"?"connected":input.mode==="link"?"link":previous.mode??"link";
  result.connection=input.connection==="offline"?"offline":input.connection==="simulation"?"simulation":previous.connection??"offline";
  if(input.role==="agent"||input.role==="admin") result.replyRole=input.role;
  return result;
}
export function business(input) {
  return {profile:profile(input), members:{}, campaigns:[], contacts:[], tickets:[], examples:[], models:[], active:null, integrations:{}, inbox:[], events:{}};
}
export function whatsapp(p, message) {
  return p.phone ? "https://wa.me/"+p.phone.slice(1)+"?text="+encodeURIComponent(clean(message || p.opener || "Halo, saya ingin bertanya.")) : null;
}
const market = {
  population:"Open Data Kota Bandung mencatat 2.605.916 penduduk pada 2025. Ini ukuran populasi, bukan permintaan kopi.",
  competitors:"Kopi Sudut Jingga, Hotel Cabin: Lembayung 250 ml Rp32.000. Mabibili Coffee, Karangsari: Kopi Susu Botol 250 ml Rp35.000. Sampel daftar menu Rp32.000–Rp35.000, cek harga final dan ongkir di kanal aslinya.",
  sources:[
    ["Open Data Kota Bandung · data 2025","https://opendata.bandung.go.id/dataset/jumlah-penduduk-kota-bandung"],
    ["MenuKuliner · Kopi Sudut Jingga, Bandung","https://menukuliner.net/menu/98922/kopi-sudut-jingga-hotel-cabin"],
    ["MenuKuliner · Mabibili Coffee, Bandung","https://menukuliner.net/menu/101924/mabibili-coffee-karangsari"]
  ],
  accessed:"25 November 2026"
};
const numeric = (v,label) => {
  if(v===undefined||v===null||clean(v)==="") return null;
  const n=Number(v);
  need(Number.isFinite(n)&&n>=0&&n<=1e12,label+" harus berupa angka nonnegatif.");
  return n;
};
export function campaign(p,a) {
  const product=need(clean(a.product,150),"Nama produk wajib diisi.");
  const region=need(clean(a.region,120),"Wilayah target wajib diisi.");
  const coffee=/kopi.*susu/i.test(product)&&/bandung/i.test(region);
  const hpp=numeric(a.hpp,"HPP"), current=numeric(a.current,"Harga saat ini"), budget=numeric(a.budget,"Anggaran");
  const pack=numeric(a.pack,"Kemasan"), discount=numeric(a.discount,"Diskon"), fee=numeric(a.fee,"Biaya kanal");
  const known=[hpp,pack,discount,fee].reduce((sum,n)=>sum+(n??0),0);
  const base=current|| (coffee?18000:hpp ? Math.ceil((known/0.65)/1000)*1000 : null);
  const prices=base?[base,base+Math.max(1000,Math.round(base*.15/1000)*1000)].map(price=>({price,margin:hpp===null?null:price-known,percent:hpp===null||price<=(discount??0)?null:Math.round(100*(price-known)/(price-(discount??0)))})):[];
  const segment=coffee?"Admin kantor dan pengelola ruang kerja di Kota Bandung yang memesan konsumsi rapat. Hipotesisnya, mereka punya anggaran per orang, biasa memesan dalam satu transaksi, dan dapat dijangkau lewat komunitas kantor serta iklan lokal.":"Pembeli di "+region+" yang sedang mencari "+product+" dan bisa dijangkau melalui pencarian lokal. Kebutuhan, daya beli dan kebiasaan belanja masih perlu divalidasi dengan wawancara singkat dan data konversi awal.";
  const concept=coffee?"Jeda kopi buat satu tim":"Kenali "+product+" di "+region;
  const offer=coffee?"Ajukan paket coba kopi susu botolan 250 ml untuk kantor. Tim kami akan mengonfirmasi jumlah, harga, dan jadwal pengiriman.":"Ajukan minat untuk mengetahui pilihan "+product+" yang sesuai kebutuhan Anda.";
  const visual=[
    ["Foto produk","Kemasan atau hasil layanan sebagai fokus di latar warna merek.",concept,offer],
    ["Situasi pelanggan",coffee?"Foto suasana rapat dengan botol kopi di meja dan cahaya natural.":"Foto produk atau layanan saat digunakan dalam situasi pelanggan.","Siap untuk kebutuhan tim",offer],
    ["Sorotan penawaran","Foto detail produk, ruang kosong untuk teks dan CTA pada bagian bawah.","Coba dulu, pilih yang cocok",offer]
  ].map(([title,direction,headline,caption])=>({title,direction,headline,caption,copy:headline+". "+offer,prompt:"Foto editorial realistis untuk "+product+". "+direction+" Panduan merek: "+(p.brand||"aset dan warna akan diisi admin")+". Tanpa teks bawaan; tambahkan judul saat desain."}));
  const assumptions=coffee?"Uji apakah admin kantor menghargai pengiriman pada jam rapat dan satu pemesanan untuk tim. Bagi trafik 50/50, pertahankan ukuran paket, kanal dan wilayah, lalu bandingkan prospek memenuhi syarat, pesanan dan margin.":"Bandingkan dua harga pada segmen dan CTA yang sama. Catat biaya, minat, permintaan penawaran, dan pesanan.";
  return {id:uid(),product,region,hpp,current,budget,pack,discount,fee,capacity:clean(a.capacity),spend:null,prices,segment,concept,offer,visual,
    missing:[["HPP",hpp],["kemasan",pack],["diskon",discount],["biaya kanal",fee],["anggaran",budget],["kapasitas",clean(a.capacity)||null]].filter(([,v])=>v===null).map(([k])=>k),
    evidence:coffee?market:{population:"Data permintaan, pesaing dan harga setempat belum diverifikasi. Tambahkan temuan dari riset di ChatGPT.",sources:[]},
    research:clean(a.research,5000),assumptions,
    promotion: coffee?"Instagram geotarget Kota Bandung dan komunitas kantor/coworking. Pesan: ajukan paket coba untuk konsumsi rapat. Bandingkan CPL, porsi permintaan yang memenuhi syarat, dan pesanan.":"Mulai dengan pencarian lokal dan kanal sosial yang dipakai segmen. Bandingkan CPL, kualitas prospek, dan pesanan.",
    allocation:budget===null?null:[Math.round(budget*.7),budget-Math.round(budget*.7)],
    cta:clean(a.cta,140)||(coffee?"Klaim Paket Coba untuk Kantor":"Minta Penawaran"),mode:a.mode==="whatsapp"?"whatsapp":"form",opener:clean(a.opener),approved:false,created:now()};
}
export function intake(b,a,kind="form") {
  const key=kind+":"+need(clean(a.eventId,180),"ID kiriman wajib diisi untuk deduplikasi.");
  if(Object.hasOwn(b.events,key)) return {...b.events[key],duplicate:true};
  const number=phone(a.phone), mail=email(a.email);
  need(number||mail,"Masukkan nomor telepon atau email.");
  if(mail) need(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail),"Email tidak valid.");
  const matches=b.contacts.filter(c=>(number&&c.phone===number)||(mail&&c.email===mail));
  need(matches.length<=1,"Telepon dan email cocok dengan dua kontak. Tinjau kontak sebelum melanjutkan.");
  const c=matches[0]??{id:uid(),name:clean(a.name,120),stage:"Baru",consent:"Belum tercatat",owner:"",next:"",created:now(),interactions:[]};
  if(!matches.length) b.contacts.push(c);
  if(number) c.phone=number;
  if(mail) c.email=mail;
  if(!c.name) c.name=clean(a.name,120);
  const camp=kind==="form"?b.campaigns.find(x=>x.id===a.campaign):null;
  if(kind==="form"&&a.campaign) need(camp,"Kampanye tidak ditemukan.");
  const source=kind==="whatsapp"?"Tidak diketahui":clean(a.source,120)||(camp?"Formulir kampanye":"Tidak diketahui");
  const utm=Object.fromEntries(["source","medium","campaign","term","content"].map(k=>[k,clean(a.utm?.[k],150)]).filter(([,v])=>v));
  if(a.consent===true&&c.consent!=="Berhenti") c.consent="Setuju";
  const interaction={id:uid(),kind,source,campaign:camp?.id??null,utm:kind==="form"?utm:{},text:clean(a.message),at:now()};
  c.interactions.push(interaction);
  c.source=source;
  if(camp) c.product=camp.product;
  return b.events[key]={contact:c.id,interaction:interaction.id};
}
const redact = v => clean(v).replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g,"[email]").replace(/(?:\+?62|0)\d(?:[ .-]?\d){7,13}/g,"[telepon]");
const normalize = v => clean(v).toLowerCase().replace(/dianter|diantar|antar|kirim|delivery/g,"pengiriman").replace(/esok|tomorrow/g,"besok").replace(/refund|pengembalian dana/g,"retur").replace(/cost|biaya|price/g,"harga").replace(/keluhan|komplain/g,"keluhan");
const tokens = v => new Set(normalize(v).split(/[^\p{L}\d]+/u).filter(t=>t.length>2&&!["bisa","kalau","apa","mau","ingin","untuk","saya","yang"].includes(t)));
function similarity(a,b) {
  const x=tokens(a),y=tokens(b), overlap=[...x].filter(t=>y.has(t)).length;
  return overlap/Math.sqrt(x.size*y.size||1);
}
function intent(msg) {
  const t=normalize(msg);
  if(/keluhan|retur|sengketa|terpotong|ditagih dua|dobel bayar|penipuan|rusak|kecewa/.test(t)) return "Keluhan";
  if(/harga|berapa rupiah/.test(t)) return "Cek harga";
  if(/stok|tersedia|ready/.test(t)) return "Cek stok";
  if(/status|resi|pesanan saya/.test(t)) return "Cek pesanan";
  if(/besok|jadwal|pengiriman|kunjung|booking|jam/.test(t)) return "Cek jadwal";
  if(/pesan|order|penawaran/.test(t)) return "Pesan produk";
  return "Lainnya";
}
function predict(rows,msg) {
  const scores=new Map();
  for(const row of rows) {
    const score=similarity(msg,row.question);
    if(score>(scores.get(row.intent)?.score??0)) scores.set(row.intent,{score,label:row.intent,route:row.label==="Alihkan ke petugas"});
  }
  return [...scores.values()].sort((a,b)=>b.score-a.score)[0];
}
export function reply(b,msg) {
  const p=b.profile,t=normalize(msg);
  const entries=b.examples.filter(x=>x.label!=="Perlu diperbaiki"&&x.approved);
  const example=entries.map(x=>[x,similarity(msg,x.question)]).sort((x,y)=>y[1]-x[1])[0];
  const active=b.models.find(x=>x.id===b.active);
  const prediction=predict(entries.filter(x=>active?.examples.includes(x.id)),msg);
  const defaultIntent=intent(msg);
  const label=defaultIntent==="Keluhan"?"Keluhan":prediction?.score>=.6?prediction.label:defaultIntent;
  const route=label==="Keluhan"||Boolean(prediction?.score>=.6&&prediction.route)||Boolean(p.handoff?.split(",").map(s=>s.trim().toLowerCase()).some(s=>s&&t.includes(s)))||Boolean(example?.[1]>=.62&&example[0].label==="Alihkan ke petugas");
  const en=/^(english|inggris|en)$/i.test(p.language);
  let response;
  if(/stop promo|berhenti.*promosi|unsubscribe/.test(t)) response=en?"Your marketing opt-out has been recorded.":"Permintaan berhenti menerima promosi sudah dicatat.";
  else if(route) response=en?"I’ll pass this to our team. Could you share your order reference, if available?":"Saya teruskan ke petugas. Boleh kirim nomor pesanan jika ada?";
  else if(["Cek harga","Cek stok","Cek pesanan"].includes(label)) response=en?"Could you share the product or order reference so our team can check the latest information?":"Boleh sebutkan produk atau nomor pesanan agar petugas bisa mengecek informasi terkini?";
  else if(example?.[1]>=.62&&example[0].answer) response=example[0].answer;
  else if(label==="Cek jadwal"||label==="Pesan produk") response=p.flow||(en?"What date and time would you prefer?":"Boleh informasikan tanggal dan waktu yang diinginkan?");
  else response=en?"What product or service can I help you with?":"Produk atau layanan apa yang bisa saya bantu?";
  return {label,route,response:[p.greeting,response].filter(Boolean).join(" "),status:"Draf",connection:p.mode==="connected"?(p.connection==="offline"?"Terputus":"Simulasi"):"Tautan",style:p.tone,language:p.language};
}
export function learn(b,a) {
  const label=need(["Sesuai","Perlu diperbaiki","Alihkan ke petugas"].includes(a.label)&&a.label,"Label tidak valid.");
  const row={id:uid(),question:need(redact(a.question),"Pertanyaan wajib diisi."),intent:need(clean(a.intent,100),"Maksud wajib diisi."),answer:redact(a.answer),label,approved:a.approved===true,group:redact(a.group).slice(0,120)||normalize(redact(a.question)),at:now()};
  b.examples.push(row);
  return row;
}
function evaluate(rows,predictor) {
  let correct=0,routes=0;
  for(const row of rows) {
    const predicted=predictor(row.question);
    if(predicted.label===row.intent) correct++;
    if(Boolean(predicted.route)===(row.label==="Alihkan ke petugas")) routes++;
  }
  return {size:rows.length,intent:correct/rows.length,route:routes/rows.length};
}
function train(b) {
  const rows=b.examples.filter(x=>x.approved&&x.label!=="Perlu diperbaiki");
  const eligible=rows.filter(row=>new Set(rows.filter(x=>x.intent===row.intent).map(x=>x.group)).size>=4);
  need(eligible.length>=8&&new Set(eligible.map(x=>x.intent)).size>=2,"Butuh minimal dua maksud dengan empat percakapan berbeda per maksud.");
  const active=b.models.find(x=>x.id===b.active);
  const held=new Set();
  for(const label of new Set(eligible.map(x=>x.intent))) {
    const candidate=[...eligible].reverse().find(x=>x.intent===label&&!eligible.some(y=>y.group===x.group&&active?.examples.includes(y.id)));
    need(candidate,"Tambahkan percakapan baru yang belum pernah dilatih untuk "+label+".");
    held.add(candidate.group);
  }
  const test=eligible.filter(x=>held.has(x.group)),training=eligible.filter(x=>!held.has(x.group));
  const base = query => ({label:intent(query),route:intent(query)==="Keluhan"});
  const classify=(set,query)=>predict(set,query)??base(query);
  const scores=evaluate(test,q=>classify(training,q));
  const baseline=evaluate(test,q=>active?classify(rows.filter(x=>active.examples.includes(x.id)),q):base(q));
  const model={id:uid(),created:now(),examples:training.map(x=>x.id),scores,baseline,eligible:scores.intent>=baseline.intent&&scores.route>=baseline.route};
  b.models.push(model);
  return model;
}
export function report(b,a) {
  const start=clean(a.start,10),end=clean(a.end,10);
  const inRange=t=>{const d=new Date(new Date(t).getTime()+7*3600000).toISOString().slice(0,10);return (!start||d>=start)&&(!end||d<=end);};
  const campaigns=b.campaigns.filter(c=>(!a.campaign||c.id===a.campaign)&&(!a.region||c.region.toLowerCase()===clean(a.region).toLowerCase()));
  return campaigns.map(c=>{
    const leads=b.contacts.filter(x=>x.interactions.some(i=>i.campaign===c.id && inRange(i.at)));
    const wins=leads.filter(x=>x.stage==="Menang"&&x.wonAt&&inRange(x.wonAt));
    const spend=!start&&!end?c.spend:null;
    return {campaign:c.product,region:c.region,start:start||"Sejak kampanye dibuat",end:end||"Hari ini",visits:null,clicks:null,leads:leads.length,spend,cpl:leads.length&&spend!==null?Math.round(spend/leads.length):null,firstResponse:null,sales:wins.length,conversion:leads.length?100*wins.length/leads.length:null};
  });
}
export const writeActions=new Set(["save_profile","grant","campaign","approve","intake","receive","contact","ticket","learn","review","remove_example","train","activate","integration","spend"]);
export const adminActions=new Set(["save_profile","grant","learn","review","remove_example","train","activate","integration"]);
export function action(b,key,a) {
  switch(key) {
    case "state": return b;
    case "save_profile": {
      const previous=b.profile;
      const next=profile(a,previous);
      need(!a.confirmRequired||a.confirm,"Konfirmasikan perubahan nomor.");
      if(previous.phone&&previous.phone!==next.phone&&!a.confirm) return {confirmation:true,campaigns:b.campaigns.filter(c=>c.mode==="whatsapp").map(c=>c.product),profile:previous.name,old:previous.phone,next:next.phone};
      b.profile=next;
      return next;
    }
    case "grant": {
      const address=email(a.email);
      need(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address),"Email anggota tidak valid.");
      if(a.role==="remove") delete b.members[address];
      else b.members[address]=a.role==="admin"?"admin":"agent";
      return b.members;
    }
    case "campaign": { const c=campaign(b.profile,a); b.campaigns.push(c);return c; }
    case "approve": { const c=need(b.campaigns.find(x=>x.id===a.id),"Kampanye tidak ditemukan."); need(a.tested===true,"Uji CTA terlebih dahulu."); if(c.mode==="whatsapp") need(b.profile.phone,"Nomor WhatsApp belum tersedia."); c.approved=true;return {approved:true,published:false,status:"Disetujui untuk publikasi · penerbit belum terhubung"}; }
    case "intake": return intake(b,a);
    case "wa_link": return {url:whatsapp(b.profile,a.message),mode:b.profile.mode};
    case "simulate": return reply(b,need(clean(a.message),"Pesan wajib diisi."));
    case "receive": {
      need(b.profile.phone&&phone(a.recipient)===b.profile.phone,"Nomor penerima tidak cocok dengan profil bisnis.");
      const message=need(clean(a.message),"Pesan wajib diisi.");
      const record=intake(b,a,"whatsapp");
      if(record.duplicate) return record;
      const r=reply(b,message);
      const contact=b.contacts.find(x=>x.id===record.contact);
      if(/stop promo|berhenti.*promosi|unsubscribe/i.test(message)) contact.consent="Berhenti";
      const entry={id:uid(),contact:contact.id,body:message,at:now(),...r};
      if(r.route) {
        const ticket={id:uid(),contact:contact.id,order:clean(a.order,160),summary:"Keluhan pelanggan: "+message,context:"Pesan WhatsApp masuk untuk "+b.profile.name,task:"Verifikasi pesanan dan tindak lanjuti keluhan bersama pelanggan.",stage:"Terbuka",at:now()};
        b.tickets.push(ticket);
        entry.ticket=ticket.id;
      }
      b.inbox.push(entry);
      return {...record,...entry};
    }
    case "contact": {
      const c=need(b.contacts.find(x=>x.id===a.id),"Kontak tidak ditemukan.");
      if(stages.includes(a.stage)) {
        if(a.stage==="Menang"&&c.stage!=="Menang") c.wonAt=now();
        c.stage=a.stage;
      }
      for(const k of ["owner","next","product"]) if(k in a)c[k]=clean(a[k]);
      if(a.consent==="Berhenti") c.consent="Berhenti";
      return c;
    }
    case "followup": {
      const c=need(b.contacts.find(x=>x.id===a.id),"Kontak tidak ditemukan.");
      need(!a.promotional||c.consent==="Setuju","Persetujuan komunikasi promosi diperlukan.");
      return {status:"Draf",text:[b.profile.greeting,"Kami ingin menindaklanjuti "+(c.product||"permintaan Anda")+".",c.next].filter(Boolean).join(" ")};
    }
    case "ticket": {const t=need(b.tickets.find(x=>x.id===a.id),"Tiket tidak ditemukan.");need(ticketStages.includes(a.stage),"Status tidak valid.");t.stage=a.stage;return t;}
    case "learn": return learn(b,a);
    case "review": {
      const x=need(b.examples.find(x=>x.id===a.id),"Contoh tidak ditemukan.");
      x.approved=a.approved===true;
      if(!x.approved&&b.models.find(m=>m.id===b.active)?.examples.includes(x.id))b.active=null;
      return x;
    }
    case "remove_example": {
      b.examples=b.examples.filter(x=>x.id!==a.id);
      b.models=b.models.filter(x=>!x.examples.includes(a.id));
      if(!b.models.some(x=>x.id===b.active)) b.active=null;
      return {removed:true};
    }
    case "train": return train(b);
    case "activate": {
      if(!a.id){b.active=null;return {active:null};}
      const m=need(b.models.find(x=>x.id===a.id&&x.eligible&&x.examples.every(id=>b.examples.some(e=>e.id===id&&e.approved))),"Versi tidak tersedia atau belum lulus evaluasi.");
      b.active=m.id;
      return {active:m.id,scores:m.scores};
    }
    case "integration": {
      need(["Desain","Penerbit","WhatsApp Business","CRM","Analitik"].includes(a.service),"Layanan tidak valid.");
      return b.integrations[a.service]={provider:clean(a.provider,100),status:"Belum terhubung"};
    }
    case "spend": {const c=need(b.campaigns.find(x=>x.id===a.id),"Kampanye tidak ditemukan.");c.spend=numeric(a.spend,"Pengeluaran");return c;}
    case "report": return report(b,a);
    default:throw new Error("Tindakan tidak dikenal.");
  }
}
export {money};
