import { action,business,clean,writeActions,adminActions } from "./domain.mjs";
import { assets } from "./assets.mjs";

const methods={
  list:["Daftar profil bisnis yang dapat diakses",[]],
  create:["Buat profil bisnis dari template",["name","type"],["region","phone","language","tone","greeting","flow"]],
  state:["Baca kampanye, kontak, tiket, contoh, dan pengaturan bisnis",["business"]],
  save_profile:["Perbarui profil bisnis sebagai admin",["business"],["name","type","region","hours","catalog","price","availability","faq","policy","brand","language","tone","greeting","handoff","flow","phone","opener","mode","connection","testimonials","autoCategories"],["confirm"]],
  grant:["Kelola akses bisnis berdasarkan email akun. role: admin, agent, atau remove",["business","email","role"]],
  campaign:["Buat draf kampanye. Riset di web dahulu jika tersedia, masukkan temuan, URL, tanggal, wilayah, dan asumsi dalam research. Harga dan biaya satuan IDR.",["business","product","region"],["capacity","research","cta","mode","opener"],[],["hpp","current","budget","pack","discount","fee"]],
  approve:["Setujui landing page setelah CTA diuji. Gunakan hanya setelah persetujuan pengguna.",["business","id"],[],["tested"]],
  intake:["Catat formulir dengan ID kiriman tetap saat retry. UTM memiliki source, medium, campaign, term, content.",["business","eventId"],["campaign","name","phone","email","source","message"],["consent"],[],["utm"]],
  wa_link:["Buat tautan WhatsApp dengan pesan pembuka yang dapat diedit",["business"],["message"]],
  simulate:["Simulasikan respons CS tanpa menyimpan pesan atau menghubungi pelanggan",["business","message"]],
  receive:["Simulasikan pesan WhatsApp masuk, jalankan pencocokan kontak dan catat draf/tiket",["business","recipient","phone","eventId","message"],["order"]],
  contact:["Ubah tahap, produk, penanggung jawab, atau tindak lanjut kontak",["business","id"],["stage","owner","next","product","consent"]],
  followup:["Buat draf tindak lanjut. Draf promosi memerlukan persetujuan komunikasi.",["business","id"],[],["promotional"]],
  ticket:["Ubah status tiket CS",["business","id","stage"]],
  learn:["Simpan contoh layanan yang diizinkan dan sudah dikurangi data pribadinya. group adalah ID percakapan sumber.",["business","question","intent","label"],["answer","group"],["approved"]],
  review:["Setujui atau cabut kelayakan contoh pembelajaran",["business","id"],[],["approved"]],
  remove_example:["Hapus contoh yang keliru dan batalkan versi yang memakai contoh itu",["business","id"]],
  train:["Latih dan evaluasi pengklasifikasi maksud per bisnis",["business"]],
  activate:["Aktifkan versi yang lulus evaluasi atau pilih versi aturan awal dengan ID kosong",["business"],["id"]],
  integration:["Catat penyedia yang dipilih untuk Desain, Penerbit, WhatsApp Business, CRM, atau Analitik",["business","service","provider"]],
  spend:["Catat pengeluaran aktual kampanye dalam rupiah",["business","id"],[],[],["spend"]],
  report:["Baca performa per kampanye atau wilayah dengan tanggal WIB YYYY-MM-DD",["business"],["campaign","region","start","end"]]
};
const schemas=Object.entries(methods).map(([name,[description,required,strings=[],bools=[],numbers=[],objects=[]]])=>({
  name,description,inputSchema:{type:"object",properties:Object.fromEntries([
    ...[...required,...strings].map(k=>[k,{type:"string"}]),...bools.map(k=>[k,{type:"boolean"}]),...numbers.map(k=>[k,{type:"number"}]),...objects.map(k=>[k,{type:"object",properties:Object.fromEntries(["source","medium","campaign","term","content"].map(x=>[x,{type:"string"}])),additionalProperties:false}])
  ]),required,additionalProperties:false},
  annotations:{readOnlyHint:!writeActions.has(name)&&name!=="create",destructiveHint:name==="remove_example",openWorldHint:false}
}));
const json=(body,status=200)=>Response.json(body,{status,headers:{"cache-control":"no-store"}});
class RequestError extends Error {constructor(message,status){super(message);this.status=status;}}
const access=(row,b,user)=>row.owner===user.id?"owner":Object.hasOwn(b.members,user.email)?b.members[user.email]:null;
async function execute(db,user,name,a) {
  if(!Object.hasOwn(methods,name)) throw new RequestError("Tindakan tidak ditemukan.",404);
  if(name==="list") {
    const rows=await db.prepare("SELECT id, owner, data FROM businesses WHERE owner = ?1 OR EXISTS (SELECT 1 FROM json_each(json_extract(data, '$.members')) WHERE key = ?2) ORDER BY id").bind(user.id,user.email).all();
    return rows.results.map(row=>{const b=JSON.parse(row.data);return {id:row.id,name:b.profile.name,region:b.profile.region,phone:b.profile.phone,role:access(row,b,user)};}).filter(row=>row.role);
  }
  if(name==="create"){
    const id=crypto.randomUUID();
    const b=business(a);
    await db.prepare("INSERT INTO businesses (id,owner,data) VALUES (?,?,?)").bind(id,user.id,JSON.stringify(b)).run();
    return {id,...b.profile};
  }
  const id=clean(a.business,64);
  for(let attempt=0;attempt<5;attempt++){
    const row=await db.prepare("SELECT owner,revision,data FROM businesses WHERE id=?").bind(id).first();
    const b=row&&JSON.parse(row.data);
    const role=b&&access(row,b,user);
    if(!role) throw new RequestError("Profil bisnis tidak ditemukan atau akses belum diberikan.",404);
    if((adminActions.has(name)&&role==="agent"&&(name!=="learn"||a.approved===true))||(name==="grant"&&role!=="owner")) throw new RequestError("Tindakan ini memerlukan akses admin atau pemilik.",403);
    const result=action(b,name,a);
    if(!writeActions.has(name)||result?.duplicate||result?.confirmation) return result;
    const changed=await db.prepare("UPDATE businesses SET data=?, revision=revision+1 WHERE id=? AND revision=?").bind(JSON.stringify(b),id,row.revision).run();
    if(changed.meta.changes===1) return result;
  }
  throw new RequestError("Data sedang diperbarui. Coba lagi dengan ID kiriman yang sama.",409);
}
function rpc(id,data){return {jsonrpc:"2.0",id,result:data};}
async function handleMcp(db,user,body) {
  const id=body?.id??null;
  switch(body?.method) {
    case "server/discover": return json(rpc(id,{supportedVersions:["2026-07-28"],capabilities:{tools:{}}}));
    case "initialize": return json(rpc(id,{protocolVersion:body.params?.protocolVersion??"2026-07-28",capabilities:{tools:{}},serverInfo:{name:"MBACS",version:"1.0.0"}}));
    case "ping": return json(rpc(id,{}));
    case "notifications/initialized": return new Response(null,{status:202});
    case "tools/list": return json(rpc(id,{tools:schemas}));
    case "tools/call":
      try {
        const result=await execute(db,user,body.params?.name,body.params?.arguments??{});
        return json(rpc(id,{content:[{type:"text",text:JSON.stringify(result)}],isError:false}));
      } catch(e) { return json(rpc(id,{content:[{type:"text",text:e.message}],isError:true})); }
    default:return json({jsonrpc:"2.0",id,error:{code:-32601,message:"Method not found"}});
  }
}
const responseAsset=(asset,type)=>new Response(asset,{headers:{"content-type":type,"x-content-type-options":"nosniff"}});
export default {async fetch(request,env){
  const url=new URL(request.url);
  const path=url.pathname;
  if(request.method==="GET"){
    const file=assets[path];
    if(file)return responseAsset(file[0],file[1]);
    return new Response("Halaman tidak ditemukan",{status:404});
  }
  if(request.method!=="POST"||!["/mcp","/api"].includes(path))return new Response(null,{status:405});
  if(path==="/api"&&request.headers.get("origin")!==url.origin)return json({error:"Asal permintaan tidak valid."},403);
  const id=request.headers.get("oai-authenticated-user-id");
  if(!id)return json({error:"Masuk dengan ChatGPT untuk melanjutkan."},401);
  const user={id,email:clean(request.headers.get("oai-authenticated-user-email"),254).toLowerCase()};
  try {
    const payload=await request.text();
    if(payload.length>50000)return json({error:"Kiriman terlalu besar."},413);
    const body=JSON.parse(payload);
    if(path==="/mcp")return await handleMcp(env.DB,user,body);
    return json({result:await execute(env.DB,user,body?.action,body?.args??{})});
  } catch(e) {return json({error:e.message},e.status??400);}
}};
