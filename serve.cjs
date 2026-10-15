// Zero-dependency local static server, including byte ranges required by CheerpJ.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const port = Number(process.env.PORT || 8080);
const types = {'.html':'text/html;charset=utf-8','.css':'text/css;charset=utf-8','.js':'text/javascript;charset=utf-8','.json':'application/json;charset=utf-8','.svg':'image/svg+xml','.jar':'application/java-archive','.pdf':'application/pdf'};
http.createServer((request,response) => {
  try {
    let file = path.resolve(root, '.' + decodeURIComponent(new URL(request.url,'http://localhost').pathname));
    if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(403); return response.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
    if (!fs.existsSync(file)) { response.writeHead(404); return response.end('Not found'); }
    const size=fs.statSync(file).size;
    const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache'};
    const range=request.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if(range) {
      const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),size-1):size-1;
      if(start>=size||end<start){response.writeHead(416,{'Content-Range':`bytes */${size}`});return response.end();}
      response.writeHead(206,{...headers,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${size}`});
      if(request.method==='HEAD')return response.end();
      fs.createReadStream(file,{start,end}).pipe(response);
    } else {
      response.writeHead(200,{...headers,'Content-Length':size});
      if(request.method==='HEAD')return response.end();
      fs.createReadStream(file).pipe(response);
    }
  } catch(error) { response.writeHead(500); response.end(error.message); }
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}/`));
