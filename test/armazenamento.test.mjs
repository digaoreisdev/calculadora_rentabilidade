import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  obterCaminhoBanco,
  validarDadosBanco,
  obterEstruturaPadrao,
  lerBancoDisco,
  gravarBancoDisco
} from '../src/armazenamentoDisco.mjs';

test('REG-018: Persistência física em arquivo no disco com validação e backup rotativo automático', async (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'acougue-test-'));
  const caminhoBanco = path.join(tempDir, 'dados_desossa.json');
  const caminhoBackup = path.join(tempDir, 'dados_desossa.backup.json');

  await t.test('1. Retorna estrutura padrão quando o arquivo não existe', () => {
    const dados = lerBancoDisco(caminhoBanco);
    assert.ok(dados.pecas.length >= 1, 'Deve conter peças padrões');
    assert.equal(dados.versao, '1.8.1');
  });

  await t.test('2. Grava dados com sucesso de forma atômica', () => {
    const dados = {
      versao: '1.8.1',
      pecaAtivaId: 99,
      pecas: [{ id: 99, nome: 'Picanha Bovina', amostras: [] }]
    };
    const res = gravarBancoDisco(caminhoBanco, dados);
    assert.equal(res.sucesso, true);
    assert.ok(fs.existsSync(caminhoBanco));

    const lido = lerBancoDisco(caminhoBanco);
    assert.equal(lido.pecaAtivaId, 99);
    assert.equal(lido.pecas[0].nome, 'Picanha Bovina');
  });

  await t.test('3. Cria backup rotativo automático na segunda gravação', () => {
    const dadosAtualizados = {
      versao: '1.8.1',
      pecaAtivaId: 99,
      pecas: [{ id: 99, nome: 'Picanha Bovina Atualizada', amostras: [] }]
    };
    gravarBancoDisco(caminhoBanco, dadosAtualizados);
    assert.ok(fs.existsSync(caminhoBackup), 'Arquivo de backup deve existir');

    const backupConteudo = JSON.parse(fs.readFileSync(caminhoBackup, 'utf8'));
    assert.equal(backupConteudo.pecas[0].nome, 'Picanha Bovina');

    const atual = lerBancoDisco(caminhoBanco);
    assert.equal(atual.pecas[0].nome, 'Picanha Bovina Atualizada');
  });

  await t.test('4. Bloqueia dados inválidos ou corrompidos defensivamente', () => {
    assert.throws(() => gravarBancoDisco(caminhoBanco, null), /objeto/);
    assert.throws(() => gravarBancoDisco(caminhoBanco, { pecas: 'invalido' }), /lista/);
  });

  // Limpeza
  fs.rmSync(tempDir, { recursive: true, force: true });
});

