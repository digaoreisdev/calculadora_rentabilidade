const { app, BrowserWindow, Menu } = require('electron');
const path = require('node:path');
const http = require('node:http');
const fs = require('node:fs');

let mainWindow = null;
let serverInstance = null;
const PORT = 3033;

function iniciarServidorEmbutido() {
  const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png'
  };

  const pastaDados = app.getPath('userData');
  const arquivoBanco = path.join(pastaDados, 'dados_desossa.json');
  const arquivoBackup = path.join(pastaDados, 'dados_desossa.backup.json');

  serverInstance = http.createServer((req, res) => {
    const parsed = new URL(req.url, 'http://localhost');

    if (parsed.pathname === '/api/banco' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      if (fs.existsSync(arquivoBanco)) {
        res.end(fs.readFileSync(arquivoBanco, 'utf8'));
      } else {
        const template = path.join(__dirname, 'dados_desossa.json');
        const dadosPadrao = fs.existsSync(template) ? fs.readFileSync(template, 'utf8') : JSON.stringify({ pecas: [] });
        res.end(dadosPadrao);
      }
      return;
    }

    if (parsed.pathname === '/api/banco' && req.method === 'POST') {
      let body = '';
      req.on('data', (c) => { body += c; });
      req.on('end', () => {
        try {
          if (fs.existsSync(arquivoBanco)) fs.copyFileSync(arquivoBanco, arquivoBackup);
          fs.writeFileSync(arquivoBanco, body, 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ status: 'ok', caminho: arquivoBanco }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ status: 'erro', mensagem: err.message }));
        }
      });
      return;
    }

    // Servir arquivos estáticos da aplicação
    const nome = parsed.pathname === '/' ? 'index.html' : parsed.pathname;
    const filePath = path.join(__dirname, nome);
    if (!filePath.startsWith(__dirname) || !fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('404');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });

  serverInstance.listen(PORT);
}

function criarJanela() {
  iniciarServidorEmbutido();

  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    title: 'Açougue Pro - Rendimento & Custo Real da Desossa',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (serverInstance) serverInstance.close();
  });
}

app.whenReady().then(criarJanela);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (serverInstance) serverInstance.close();
    app.quit();
  }
});

