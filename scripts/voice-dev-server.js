'use strict';
// Local HTTP harness routes to the real project handlers; no alternate STT.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {args,safeError}=require('./voice-cli-common');
try{
 const options=args(),port=Number(options.port||8130);
 if(!Number.isInteger(port)||port<1024||port>65535)throw Object.assign(new Error(),{code:'INVALID_PORT'});
 const api=require('../www/api-config');
 process.env.VOICE_ALLOWED_ORIGINS=(process.env.VOICE_ALLOWED_ORIGINS||[api.productionOrigin,'https://budgetpro.app','null'].join(','))+`,http://127.0.0.1:${port},http://localhost:${port}`;
 const routes={'/api/voice/health':require('../api/voice/health'),'/api/voice/transcribe':require('../api/voice/transcribe'),'/api/auth/refresh-session':require('../api/auth/refresh-session'),'/api/auth/magic-link':require('../api/auth/magic-link')};
 const root=path.resolve('www'),types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.wav':'audio/wav'};
 const server=http.createServer(async(req,res)=>{
  try{const pathname=new URL(req.url,'http://localhost').pathname;
   if(routes[pathname]){await routes[pathname](req,res);return;}
   if(req.method!=='GET'){res.writeHead(405);res.end();return;}
   const file=path.resolve(root,'.'+decodeURIComponent(pathname==='/'?'/index.html':pathname));
   if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
   res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
  }catch{res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:false,error:'LOCAL_SERVER_ERROR'}));}
 });server.listen(port,'127.0.0.1',()=>console.log(`BudgetPRO local voice harness: http://127.0.0.1:${port}`));
}catch(e){console.error(JSON.stringify(safeError(e)));process.exitCode=1;}
