import fs from "node:fs";
fs.mkdirSync("dist/server",{recursive:true});
const defs=[
  ["/","src/index.html","text/html; charset=utf-8"],
  ["/app.js","src/app.js","text/javascript; charset=utf-8"],
  ["/style.css","src/style.css","text/css; charset=utf-8"]
];
const assets=Object.fromEntries(defs.map(([url,path,type])=>[url,[fs.readFileSync(path,"utf8"),type]]));
const domain = fs.readFileSync("src/domain.mjs", "utf8").replace(/^export \{money\};$/m, "").replace(/^export /gm, "");
const worker = fs.readFileSync("src/worker.mjs", "utf8").replace(/^import .*;\n/gm, "");
fs.writeFileSync("dist/server/index.js", "const assets = " + JSON.stringify(assets) + ";\n" + domain + "\n" + worker);
fs.mkdirSync("dist/.openai",{recursive:true});
fs.copyFileSync(".openai/hosting.json","dist/.openai/hosting.json");
