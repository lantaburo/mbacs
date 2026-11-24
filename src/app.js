const $=id=>document.getElementById(id);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const money=n=>n==null?"Belum tersedia":new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const date=v=>new Intl.DateTimeFormat("id-ID",{dateStyle:"short",timeStyle:"short",timeZone:"Asia/Jakarta"}).format(new Date(v));
const buttons=(text,cls="")=>'<button class="'+cls+'">'+esc(text)+'</button>';
const fields=(key,label,val="",opts={})=>'<label class="'+(opts.full?"full":"")+'">'+esc(label)+(opts.area?'<textarea name="'+key+'" '+(opts.required?"required":"")+'>'+esc(val)+'</textarea>':'<input name="'+key+'" type="'+(opts.type||"text")+'" value="'+esc(val)+'" '+(opts.required?"required":"")+' '+(opts.type==="number"?'min="0" step="1"':"")+'>')+'</label>';
const select=(key,label,values,value)=>'<label>'+esc(label)+'<select name="'+key+'">'+values.map(v=>{const [k,t]=Array.isArray(v)?v:[v,v];return '<option value="'+esc(k)+'"'+(k===value?" selected":"")+'>'+esc(t)+'</option>';}).join("")+'</select></label>';
const form=(name,content,submit,extra="")=>'<form class="panel" data-action="'+name+'" '+extra+'><div class="row">'+content+'</div><div class="actions">'+buttons(submit)+'</div></form>';
const panel=html=>'<section class="panel">'+html+'</section>';
const hidden=(name,value)=>'<input type="hidden" name="'+name+'" value="'+esc(value)+'">';
const block=(title,text)=>text?'<h3>'+esc(title)+'</h3><p>'+esc(text)+'</p>':"";
const nav=[["campaign","Kampanye Baru"],["inbox","Inbox Customer Service"],["contacts","Prospek dan Penjualan"],["tickets","Tiket Pelanggan"],["report","Performa"],["settings","Pengaturan Bisnis dan WhatsApp"],["learn","Pembelajaran CS"]];
const types=["Kuliner","Toko online","Jasa"];
const stages=["Baru","Dihubungi","Terkualifikasi","Penawaran","Menang","Kalah"];
const ticketStages=["Terbuka","Ditangani","Menunggu","Selesai"];
const labels=["Sesuai","Perlu diperbaiki","Alihkan ke petugas"];
const services=["Desain","Penerbit","WhatsApp Business","CRM","Analitik"];
let businesses=[],id="",state=null,view="campaign",detail="",tested=new Set(),landing=false,lastReport=null,creating=false,busy=false;
function notice(message,error=false){$("notice").hidden=!message;$("notice").textContent=message;$("notice").classList.toggle("error",error);}
async function call(action,args={}) {
  const res=await fetch("/api",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action,args:{business:id,...args}})});
  const payload=await res.json();
  if(!res.ok)throw Error(payload.error||"Permintaan gagal.");
  return payload.result;
}
async function load(preferred=id){
  businesses=await call("list");
  id=businesses.some(x=>x.id===preferred)?preferred:businesses[0]?.id||"";
  $("business").innerHTML=businesses.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name)+'</option>').join("")||'<option value="">Belum ada profil</option>';
  $("business").value=id;
  state=id?await call("state"):null;
}
function heading(title,desc){return '<div class="hero"><h1>'+esc(title)+'</h1><p class="muted">'+esc(desc)+'</p></div>';}
const waLink=(p,message)=>p.phone?"https://wa.me/"+p.phone.slice(1)+"?text="+encodeURIComponent(message||p.opener||"Halo, saya ingin bertanya."):"";
function campaignPage(){
  const p=state.profile,c=state.campaigns.find(x=>x.id===detail);
  if(c)return campaignDetail(c,p);
  return heading("Kampanye Baru","Susun rencana, uji penawaran, dan siapkan landing page.")+
    form("campaign",[
      fields("product","Nama produk","",{required:true}),fields("region","Wilayah target",p.region,{required:true}),
      ...[["hpp","HPP per unit"],["current","Harga saat ini"],["budget","Anggaran promosi"],["pack","Kemasan per unit"],["discount","Diskon per unit"],["fee","Biaya kanal per unit"]].map(([k,t])=>fields(k,t,"",{type:"number"})),
      fields("capacity","Kapasitas"),fields("cta","Teks CTA"),select("mode","Jenis CTA",[["form","Formulir"],["whatsapp","WhatsApp"]],"form"),fields("opener","Pesan pembuka WhatsApp"),
      fields("research","Temuan riset, sumber, tanggal, dan cakupan","",{area:true,full:true})
    ].join(""),"Buat draf kampanye")+
    '<div class="actions"><button class="secondary" data-click="fill-demo">Isi contoh kopi Bandung</button></div>'+
    '<h2 class="section">Draf kampanye</h2>'+ (state.campaigns.map(c=>panel('<span class="pill">'+esc(c.approved?"Disetujui":"Draf")+'</span><h3>'+esc(c.product)+'</h3><p class="muted">'+esc(c.region)+'</p><button data-click="open-campaign" data-id="'+esc(c.id)+'">Buka kampanye</button>')).join("")||'<p>Belum ada kampanye.</p>');
}
function campaignDetail(c,p){
  const url=waLink(p,c.opener);
  const preview=landing?'<div class="land"><span class="pill">Pratinjau · '+esc(c.region)+'</span><h2>'+esc(c.concept)+'</h2><p>'+esc(c.offer)+'</p>'+block("Manfaat",/kopi.*susu/i.test(c.product)?"Kemasan 250 ml per orang, praktis untuk konsumsi rapat dan mudah dibagikan ke tim.":"Ajukan kebutuhan Anda untuk mengetahui pilihan produk dan penawaran yang tersedia.")+
    '<details><summary>Bagaimana cara memesan?</summary><p>Ajukan permintaan. Tim akan mengonfirmasi detail, harga, dan ketersediaan.</p></details>'+
    (p.faq?'<details><summary>Pertanyaan lain</summary><p>'+esc(p.faq)+'</p></details>':"")+(p.testimonials?block("Testimoni yang disetujui",p.testimonials):"")+
    (c.mode==="whatsapp"?(url?'<a class="button" href="'+esc(url)+'" target="_blank" rel="noopener" data-click="test-link">'+esc(c.cta)+'</a><p class="muted">'+esc(p.phone)+'</p>':'<p>Tambahkan nomor di pengaturan bisnis.</p>'):
      form("intake",hidden("campaign",c.id)+fields("phone","Nomor WhatsApp","",{type:"tel",required:true})+'<label><input type="checkbox" name="consent">Saya setuju menerima promosi (opsional)</label>',c.cta))+'</div>':"";
  return '<button class="secondary" data-click="back-campaign">Kembali ke kampanye</button><div class="section">'+heading(c.product,c.region+" · "+(c.approved?"Disetujui, penerbit belum terhubung":"Draf"))+'</div>'+
    panel('<h2>Riset dan strategi</h2>'+block("Temuan",c.evidence.population)+block("Pesaing dan kisaran harga",c.evidence.competitors)+
      (c.evidence.sources?.length?'<p class="muted">Cakupan Kota Bandung · Diakses '+esc(c.evidence.accessed)+'</p><ul>'+c.evidence.sources.map(([label,url])=>'<li><a href="'+esc(url)+'" target="_blank" rel="noopener">'+esc(label)+'</a></li>').join("")+'</ul>':"")+
      block("Temuan tambahan pengguna",c.research)+block("Segmen prioritas",c.segment)+block("Asumsi dan cara menguji",c.assumptions)+
      block("Promosi",c.promotion)+(c.allocation?'<p>Uji kanal utama '+money(c.allocation[0])+' · kanal pendamping '+money(c.allocation[1])+'</p>':"")+
      '<h3>Harga uji dan margin kontribusi</h3>'+ (c.prices.length?'<ul>'+c.prices.map(x=>'<li>'+money(x.price)+' · '+(x.margin==null?"Margin menunggu HPP":money(x.margin)+(x.percent==null?"":" ("+x.percent+"%)")+" sebelum biaya yang belum diketahui")+'</li>').join("")+'</ul>':'<p>Masukkan HPP atau harga saat ini untuk menghitung titik awal harga.</p>')+
      (c.missing.length?'<p class="muted">Data belum tersedia: '+esc(c.missing.join(", "))+'. Biaya yang belum diisi dapat menurunkan margin. Kapasitas membatasi volume paket dan anggaran menentukan jangkauan uji.</p>':""))+
    '<h2 class="section">Materi kampanye</h2><p>'+esc(c.concept)+' · Brief siap produksi</p><div class="cards">'+c.visual.map(v=>panel('<h3>'+esc(v.title)+'</h3>'+block("Visual",v.direction)+block("Teks desain",v.headline)+block("Caption",v.caption)+block("Copy iklan",v.copy)+'<details><summary>Prompt gambar</summary><p>'+esc(v.prompt)+'</p></details>')).join("")+'</div>'+
    '<h2 class="section">Landing page</h2><div class="actions"><button data-click="preview">'+(landing?"Tutup pratinjau":"Pratinjau & uji CTA")+'</button>'+
    (tested.has(c.id)&&!c.approved?'<button data-click="approve">Setujui untuk publikasi</button>':"")+'</div>'+preview;
}
function settings(){
  const p=state.profile, me=businesses.find(x=>x.id===id);
  return heading("Pengaturan Bisnis dan WhatsApp","Profil, gaya balasan, akses, dan koneksi untuk "+p.name+".")+
    (me.role==="agent"?panel('<p>Akses petugas untuk profil ini.</p>'):form("save_profile",
    fields("name","Nama usaha",p.name,{required:true})+select("type","Jenis bisnis",types,p.type)+
    [["region","Wilayah layanan"],["hours","Jam operasional"],["phone","Nomor WhatsApp"],["language","Bahasa balasan"],["tone","Gaya bahasa"],["greeting","Sapaan"]].map(([k,t])=>fields(k,t,p[k])).join("")+
    select("mode","Mode WhatsApp",[["link","Tautan WhatsApp"],["connected","WhatsApp Business · simulasi"]],p.mode)+
    select("connection","Status untuk simulasi",[["offline","Terputus"],["simulation","Simulasi"]],p.connection)+
    [["catalog","Katalog"],["price","Daftar harga"],["availability","Ketersediaan"],["faq","FAQ"],["policy","Kebijakan"],["brand","Aset dan warna merek"],["handoff","Kata pemicu pengalihan, pisahkan koma"],["flow","Pertanyaan lanjutan"],["opener","Pesan pembuka WhatsApp"],["testimonials","Testimoni terverifikasi"],["autoCategories","Kategori otomatis yang diinginkan"]].map(([k,t])=>fields(k,t,p[k],{area:true})).join(""),"Simpan profil"))+
    (p.phone?panel('<h2>Uji nomor WhatsApp</h2><a href="'+esc(waLink(p))+'" target="_blank" rel="noopener">Buka chat untuk '+esc(p.phone)+'</a>'):"")+
    form("simulate",fields("message","Pesan untuk simulasi","",{required:true}),"Simulasikan tanpa menyimpan")+
    '<h2 class="section">Integrasi</h2>'+services.map(service=>panel('<h3>'+esc(service)+'</h3><p>'+esc(state.integrations[service]?.provider||"Penyedia belum dipilih")+' · Belum terhubung</p>')).join("")+
    (me.role==="agent"?"":form("integration",select("service","Jenis layanan",services,services[0])+fields("provider","Nama penyedia","",{required:true}),"Simpan preferensi"))+
    (me.role==="owner"?'<h2 class="section">Akses profil bisnis</h2>'+
      Object.entries(state.members).map(([email,role])=>panel('<p>'+esc(email)+" · "+esc(role)+'</p>')).join("")+
      form("grant",fields("email","Email akun","",{type:"email",required:true})+select("role","Peran",[["agent","Petugas"],["admin","Admin"],["remove","Cabut akses"]],"agent"),"Simpan akses"):"");
}
function inbox(){
  const p=state.profile;
  return heading("Inbox Customer Service","Simulasikan pesan masuk dan tinjau draf balasan.")+
    form("receive",fields("recipient","Nomor penerima",p.phone,{required:true})+fields("phone","Nomor pengirim","",{required:true})+fields("message","Pesan pelanggan","",{area:true,required:true,full:true})+fields("order","Nomor pesanan (opsional)"),"Simulasikan pesan masuk")+
    state.inbox.slice().reverse().map(x=>panel('<span class="pill">'+esc(x.status+" · "+x.connection)+'</span> <small>'+date(x.at)+'</small>'+block("Pesan pelanggan",x.body)+block("Draf balasan",x.response)+ (x.ticket?'<p>Tiket dibuat untuk petugas.</p>':"")+'<button class="secondary" data-click="propose" data-id="'+esc(x.id)+'">Ajukan sebagai contoh</button>')).join("");
}
function contacts(){
  return heading("Prospek dan Penjualan","Kelola tahap penjualan, tindak lanjut, dan riwayat sumber.")+
    (state.contacts.length?state.contacts.map(c=>'<details class="panel"><summary>'+esc(c.name||c.phone||c.email)+' · '+esc(c.stage)+'</summary><p>'+esc(c.phone||c.email)+' · '+esc(c.consent)+'</p>'+
      form("contact",hidden("id",c.id)+select("stage","Tahap",stages,c.stage)+fields("owner","Penanggung jawab",c.owner)+fields("product","Produk",c.product)+fields("next","Langkah berikutnya",c.next),"Perbarui prospek")+
      '<button class="secondary" data-click="followup" data-id="'+esc(c.id)+'">Siapkan draf tindak lanjut</button><h3 class="section">Riwayat interaksi</h3><ul>'+
      c.interactions.map(i=>'<li>'+date(i.at)+' · '+esc(i.source)+' · '+esc(state.campaigns.find(x=>x.id===i.campaign)?.product||i.kind)+' '+esc(Object.entries(i.utm).map(([k,v])=>"utm_"+k+"="+v).join(", "))+' '+esc(i.text)+'</li>').join("")+'</ul></details>').join(""):"<p>Belum ada prospek. Uji formulir landing page atau simulasi pesan masuk.</p>");
}
function tickets(){
  return heading("Tiket Pelanggan","Tinjau keluhan dan tindak lanjut petugas.")+
    (state.tickets.map(t=>panel('<span class="pill">'+esc(t.stage)+'</span><p>'+esc(state.contacts.find(x=>x.id===t.contact)?.phone||t.contact)+'</p>'+block("Ringkasan",t.summary)+block("Konteks",t.context)+block("Pesanan",t.order)+block("Tindakan",t.task)+form("ticket",hidden("id",t.id)+select("stage","Status",ticketStages,t.stage),"Ubah status"))).join("")||"<p>Belum ada tiket.</p>");
}
function learnPage(){
  return heading("Pembelajaran CS","Kelola contoh dan versi pembelajaran untuk "+state.profile.name+".")+
    form("learn",fields("question","Pertanyaan pelanggan","",{required:true})+fields("intent","Maksud pelanggan","",{required:true})+
      fields("group","ID percakapan sumber")+select("label","Label",labels,labels[0])+fields("answer","Jawaban yang disetujui","",{area:true,full:true})+
      '<label class="full"><input type="checkbox" name="approved">Contoh diizinkan, ditinjau, dan disetujui untuk pembelajaran</label>',"Simpan contoh")+
    '<h2>Contoh</h2>'+ (state.examples.map(x=>panel('<span class="pill">'+esc(x.label+' · '+(x.approved?"Disetujui":"Menunggu tinjauan"))+'</span>'+block(x.intent,x.question)+(x.answer?block("Jawaban",x.answer):"")+
      '<div class="actions"><button class="secondary" data-click="review" data-id="'+esc(x.id)+'" data-approved="'+(!x.approved)+'">'+(x.approved?"Cabut persetujuan":"Setujui contoh")+'</button><button class="quiet" data-click="remove" data-id="'+esc(x.id)+'">Hapus</button></div>')).join("")||"<p>Belum ada contoh.</p>")+
    '<h2 class="section">Versi dan evaluasi</h2><p>Versi aktif: '+esc(state.active||"Profil bisnis dan contoh yang disetujui")+'</p>'+
    '<div class="actions"><button data-click="train">Latih dan evaluasi</button><button class="secondary" data-click="activate" data-id="">Pakai versi awal</button></div>'+
    state.models.slice().reverse().map(x=>panel('<h3>'+date(x.created)+(state.active===x.id?" · Aktif":"")+'</h3><p>'+x.scores.size+' contoh uji · Maksud '+Math.round(x.scores.intent*100)+'% (acuan '+Math.round(x.baseline.intent*100)+'%) · Pengalihan '+Math.round(x.scores.route*100)+'% (acuan '+Math.round(x.baseline.route*100)+'%)</p>'+(x.eligible?'<button data-click="activate" data-id="'+esc(x.id)+'">Aktifkan versi</button>':'<p>Belum lulus evaluasi.</p>'))).join("");
}
function perf(){
  return heading("Performa","Filter hasil per kampanye, wilayah, dan periode WIB.")+
    form("report",select("campaign","Kampanye",[["","Semua kampanye"],...state.campaigns.map(c=>[c.id,c.product])],"")+
    fields("region","Wilayah")+fields("start","Mulai","",{type:"date"})+fields("end","Sampai","",{type:"date"}),"Tampilkan performa")+
    state.campaigns.map(c=>form("spend",hidden("id",c.id)+fields("spend","Biaya aktual · "+c.product,c.spend,{type:"number",required:true}),"Simpan biaya")).join("")+
    (lastReport||[]).map(r=>panel('<h2>'+esc(r.campaign)+'</h2><p>'+esc(r.region+" · "+r.start+" – "+r.end)+'</p><div class="table"><table><tbody>'+
       [["Kunjungan landing page",r.visits],["Klik CTA",r.clicks],["Prospek unik",r.leads],["Biaya per prospek",r.cpl==null?null:money(r.cpl)],["Respons pertama",r.firstResponse],["Penjualan",r.sales],["Konversi",r.conversion==null?null:r.conversion.toFixed(1)+"%"]].map(([label,value])=>'<tr><th scope="row">'+esc(label)+'</th><td>'+esc(value??"Belum tersedia")+'</td></tr>').join("")+'</tbody></table></div>')).join("");
}
function render(){
  $("nav").innerHTML=nav.map(([k,n])=>'<button data-click="nav" data-id="'+k+'" '+(view===k&&!creating?'aria-current="page"':"")+'>'+n+'</button>').join("");
  if(creating||!state){
    $("page").innerHTML=heading("Tambah profil bisnis","Pilih template awal dan atur bahasa balasan untuk cabang atau bisnis ini.")+
      form("create",fields("name","Nama bisnis","",{required:true})+select("type","Template",types,"Kuliner")+fields("region","Wilayah layanan")+fields("phone","WhatsApp bisnis")+fields("language","Bahasa balasan","Indonesia"),"Buat profil");
    return;
  }
  $("page").innerHTML=({campaign:campaignPage,settings,inbox,contacts,tickets,learn:learnPage,report:perf}[view])();
}
async function run(fn){
  if(busy)return;
  busy=true;
  notice("");
  try {await fn();} catch(e) {notice(e.message,true);}
  finally {busy=false;}
}
$("business").addEventListener("change",()=>run(async()=>{await load($("business").value);detail="";landing=false;lastReport=null;creating=false;render();}));
$("new").addEventListener("click",()=>{creating=true;render();});
document.addEventListener("submit",e=>{
  const f=e.target;
  const name=f.dataset.action;
  if(!name)return;
  e.preventDefault();
  run(async()=>{
    const a=Object.fromEntries(new FormData(f));
    for(const field of f.querySelectorAll('input[type="checkbox"]'))a[field.name]=field.checked;
    if(name==="intake"||name==="receive"){
      f.dataset.eventId ||= crypto.randomUUID();
      a.eventId=f.dataset.eventId;
    }
    if(name==="intake"){
      const params=new URLSearchParams(location.search);
      a.utm=Object.fromEntries(["source","medium","campaign","term","content"].map(k=>[k,params.get("utm_"+k)||""]));
    }
    let r=await call(name,a);
    if(r?.confirmation){
      if(!confirm("Ubah nomor "+r.old+" menjadi "+r.next+"?\nProfil CS: "+r.profile+"\nKampanye WhatsApp: "+(r.campaigns.join(", ")||"Tidak ada")))return;
      r=await call(name,{...a,confirm:true});
    }
    if(name==="create"){await load(r.id);creating=false;view="settings";detail="";}
    else if(name==="simulate"){notice(r.response+"\nStatus: "+r.status);return;}
    else if(name==="report"){lastReport=r;}
    else {
      if(name==="campaign"){detail=r.id;landing=false;}
      if(name==="intake")tested.add(detail);
      await load();
    }
    render();
    notice(name==="intake"?"CTA formulir berhasil diuji. Kontak dicatat di CRM.":name==="receive"?"Simulasi dicatat. Balasan berstatus draf.":"Tersimpan.");
  });
});
document.addEventListener("click",e=>{
  const el=e.target.closest("[data-click]");
  if(!el)return;
  const k=el.dataset.click,key=el.dataset.id;
  if(k==="test-link"){tested.add(detail);setTimeout(render,0);return;}
  run(async()=>{
    if(k==="nav"){view=key;detail="";landing=false;creating=false;render();return;}
    if(k==="open-campaign"){detail=key;landing=false;render();return;}
    if(k==="back-campaign"){detail="";landing=false;render();return;}
    if(k==="preview"){landing=!landing;render();return;}
    if(k==="fill-demo"){
      const f=document.querySelector('[data-action="campaign"]');
      for(const [k,v] of Object.entries({product:"Kopi susu botolan 250 ml",region:"Kota Bandung",hpp:9000,budget:2000000,cta:"Klaim Paket Coba untuk Kantor"}))f.elements[k].value=v;
      return;
    }
    if(k==="followup"){notice((await call("followup",{id:key})).text);return;}
    if(k==="approve"){if(!confirm("Setujui draf landing page ini untuk publikasi?"))return;notice((await call("approve",{id:detail,tested:tested.has(detail)})).status);}
    if(k==="train"){const r=await call("train");notice(r.eligible?"Versi lulus evaluasi dan siap diaktifkan.":"Versi belum lulus evaluasi.");}
    if(k==="activate")await call("activate",{id:key});
    if(k==="review")await call("review",{id:key,approved:el.dataset.approved==="true"});
    if(k==="remove"){if(!confirm("Hapus contoh ini? Versi yang memakainya akan dihapus."))return;await call("remove_example",{id:key});}
    if(k==="propose"){
      const item=state.inbox.find(x=>x.id===key);
      await call("learn",{question:item.body,intent:item.label,label:item.route?"Alihkan ke petugas":"Sesuai",group:item.id,answer:item.response,approved:false});
      notice("Contoh diajukan untuk ditinjau admin.");
    }
    await load();
    render();
  });
});
run(async()=>{await load();render();});
