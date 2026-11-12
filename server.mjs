import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_PORT = Number(process.env.PORT) || 3030;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

function resolverCaminhoArquivo(reqUrl) {
  const parsed = new URL(reqUrl, 'http://localhost');
  const nome = parsed.pathname === '/' ? 'index.html' : parsed.pathname;
  return path.join(__dirname, nome);
}

function processarRequisicao(req, res) {
  const filePath = resolverCaminhoArquivo(req.url);
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Acesso Negado');
    return;
  }
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 - Arquivo Não Encontrado');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
}

function iniciarServidor(porta) {
  const server = http.createServer(processarRequisicao);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Aviso] Porta ${porta} já está em uso. Tentando porta ${porta + 1}...`);
      iniciarServidor(porta + 1);
    } else {
      console.error('[Erro no servidor]:', err);
    }
  });

  server.listen(porta, () => {
    console.log(`\n======================================================`);
    console.log(`  Calculadora de Rendimento e Desossa de Açougue`);
    console.log(`  Servidor rodando em: http://localhost:${porta}`);
    console.log(`  Pressione Ctrl+C para encerrar.`);
    console.log(`======================================================\n`);
  });
}

iniciarServidor(DEFAULT_PORT);
