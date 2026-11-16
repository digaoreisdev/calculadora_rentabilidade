import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { obterCaminhoBanco, lerBancoDisco, gravarBancoDisco } from './src/armazenamentoDisco.mjs';

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

function responderJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

function processarApiBancoPost(req, res, caminhoBanco) {
  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    try {
      const dados = JSON.parse(body);
      gravarBancoDisco(caminhoBanco, dados);
      responderJson(res, 200, { status: 'ok', gravadoEm: new Date().toISOString() });
    } catch (err) {
      responderJson(res, 400, { status: 'error', mensagem: err.message });
    }
  });
}

function rotearApi(req, res, parsedUrl) {
  const caminhoBanco = obterCaminhoBanco(__dirname);
  if (parsedUrl.pathname === '/api/banco' && req.method === 'GET') {
    responderJson(res, 200, lerBancoDisco(caminhoBanco));
    return true;
  }
  if (parsedUrl.pathname === '/api/banco' && req.method === 'POST') {
    processarApiBancoPost(req, res, caminhoBanco);
    return true;
  }
  if (parsedUrl.pathname === '/api/status' && req.method === 'GET') {
    responderJson(res, 200, { status: 'online', arquivo: caminhoBanco });
    return true;
  }
  return false;
}

function servirArquivoEstatico(req, res, parsed) {
  const nome = parsed.pathname === '/' ? 'index.html' : parsed.pathname;
  const filePath = path.join(__dirname, nome);
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
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
}

function processarRequisicao(req, res) {
  const parsed = new URL(req.url, 'http://localhost');
  if (parsed.pathname.startsWith('/api/')) {
    if (rotearApi(req, res, parsed)) return;
    responderJson(res, 404, { erro: 'Endpoint não encontrado' });
    return;
  }
  servirArquivoEstatico(req, res, parsed);
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
    console.log(`  Banco Físico: ${obterCaminhoBanco(__dirname)}`);
    console.log(`======================================================\n`);
  });
}

iniciarServidor(DEFAULT_PORT);
