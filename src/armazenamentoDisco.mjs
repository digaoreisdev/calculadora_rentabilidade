import fs from 'node:fs';
import path from 'node:path';
import { PECAS_PADRAO as PECAS_INICIAIS } from './dadosIniciais.mjs';

export const NOME_ARQUIVO_PADRAO = 'dados_desossa.json';
export const NOME_BACKUP_PADRAO = 'dados_desossa.backup.json';

export function obterCaminhoBanco(diretorioBase = process.cwd()) {
  return path.join(diretorioBase, NOME_ARQUIVO_PADRAO);
}

export function obterCaminhoBackup(diretorioBase = process.cwd()) {
  return path.join(diretorioBase, NOME_BACKUP_PADRAO);
}

export function validarDadosBanco(dados) {
  if (!dados || typeof dados !== 'object') {
    throw new Error('Dados do banco de dados inválidos: deve ser um objeto.');
  }
  if (!Array.isArray(dados.pecas)) {
    throw new Error('Estrutura corrompida: "pecas" deve ser uma lista.');
  }
  return true;
}

export function obterEstruturaPadrao() {
  return {
    versao: '1.8.1',
    pecaAtivaId: PECAS_INICIAIS[0]?.id ?? 1,
    amostraSelecionadaId: null,
    pecas: JSON.parse(JSON.stringify(PECAS_INICIAIS))
  };
}

export function lerBancoDisco(caminhoArquivo) {
  if (!fs.existsSync(caminhoArquivo)) {
    return obterEstruturaPadrao();
  }
  try {
    const conteudo = fs.readFileSync(caminhoArquivo, 'utf8');
    const parsed = JSON.parse(conteudo);
    validarDadosBanco(parsed);
    return parsed;
  } catch (err) {
    console.error(`[Aviso] Falha ao ler ${caminhoArquivo}. Usando padrão:`, err.message);
    return obterEstruturaPadrao();
  }
}

export function gravarBancoDisco(caminhoArquivo, dados) {
  validarDadosBanco(dados);
  const dir = path.dirname(caminhoArquivo);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(caminhoArquivo)) {
    const caminhoBackup = caminhoArquivo.replace(/\.json$/, '.backup.json');
    fs.copyFileSync(caminhoArquivo, caminhoBackup);
  }

  const jsonStr = JSON.stringify(dados, null, 2);
  const tempPath = `${caminhoArquivo}.tmp`;
  fs.writeFileSync(tempPath, jsonStr, 'utf8');
  fs.renameSync(tempPath, caminhoArquivo);
  return { sucesso: true, bytes: Buffer.byteLength(jsonStr) };
}
