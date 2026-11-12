import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validarNumeroNaoNegativo,
  parseTempoEmSegundos,
  formatarSegundosEmTempo,
  calcularQuebraAmostra,
  calcularProdutividadeKgHora,
  calcularRendimentoAmostras,
  calcularCustosPecaChave,
  calcularDistribuicaoComposicaoPeca,
  calcularCustosERentabilidade,
  projetarCompraEstoque
} from '../src/calculadora.mjs';
import { PECAS_PADRAO } from '../src/dadosIniciais.mjs';

const dianteiro = PECAS_PADRAO[0];
const patinho = PECAS_PADRAO[1];

test('REG-003: Conversão e formatação de tempos de desossa', () => {
  assert.equal(parseTempoEmSegundos('00:27:02'), (27 * 60) + 2);
  assert.equal(parseTempoEmSegundos('25:35'), (25 * 60) + 35);
  assert.equal(parseTempoEmSegundos(''), 0);
  assert.equal(formatarSegundosEmTempo(1622), '00:27:02');

  const prod = calcularProdutividadeKgHora(120, 3600);
  assert.equal(prod, 120);
});

test('REG-001: Quebra de desossa e rendimento ponderado da amostragem do Dianteiro', () => {
  const resultado = calcularRendimentoAmostras(dianteiro.amostras);

  assert.equal(resultado.quantidadeAmostras, 3);
  assert.equal(resultado.somaPesoTotalEntrada, 119.912);
  assert.equal(resultado.pesoMedioPeca, 39.971);

  const a1 = resultado.amostras[0];
  assert.equal(a1.pesoTotal, 43.396);
  assert.equal(a1.somaCortes, 43.391);
  assert.equal(a1.quebraKg, 0.005);

  const a2 = resultado.amostras[1];
  assert.equal(a2.pesoTotal, 44.338);
  assert.equal(a2.somaCortes, 44.334);
  assert.equal(a2.quebraKg, 0.004);

  const a3 = resultado.amostras[2];
  assert.equal(a3.pesoTotal, 32.178);
  assert.equal(a3.somaCortes, 32.174);
  assert.equal(a3.quebraKg, 0.004);

  assert.equal(resultado.quebraGlobalKg, 0.013);
  assert.equal(resultado.quebraGlobalPerc, 0.01);

  const ceboOsso = resultado.cortes.find((c) => c.nome === 'Cebo e Osso');
  assert.ok(ceboOsso);
  assert.equal(ceboOsso.pesoTotal, 22.054);
  assert.equal(ceboOsso.rendimentoMedioPerc, 18.39);
});

test('REG-005: Suporte dinâmico a 1 amostra isolada (ex: Patinho)', () => {
  const resultado = calcularRendimentoAmostras(patinho.amostras);
  assert.equal(resultado.quantidadeAmostras, 1);
  assert.equal(resultado.somaPesoTotalEntrada, 11.5);
  assert.equal(resultado.pesoMedioPeca, 11.5);

  assert.equal(resultado.quebraGlobalKg, 0.01);
  const patinhoLimpo = resultado.cortes.find((c) => c.nome === 'Patinho Limpo');
  assert.ok(patinhoLimpo);
  assert.equal(patinhoLimpo.pesoTotal, 7.59);
  assert.equal(patinhoLimpo.rendimentoMedioPerc, 66.0);
});

test('REG-006: Custeio por Peça-Chave com prejuízo contábil em Osso/Sebo e Líquidos', () => {
  const rendimento = calcularRendimentoAmostras(dianteiro.amostras);
  const resultadoCusto = calcularCustosPecaChave(rendimento, 21.45, {
    modoCusto: 'peca_chave',
    precosVenda: dianteiro.precosVendaSugeridos
  });

  const ceboOsso = resultadoCusto.cortes.find((c) => c.nome === 'Cebo e Osso');
  assert.ok(ceboOsso);
  assert.equal(ceboOsso.custoRealKg, 21.45);
  assert.equal(ceboOsso.precoVendaKg, 1.48);
  assert.equal(ceboOsso.lucroKg, -19.97);
  assert.ok(ceboOsso.margemPerc < 0);

  const agulhaOsso = resultadoCusto.cortes.find((c) => c.nome === 'Agulha C/ Osso');
  assert.ok(agulhaOsso);
  assert.equal(agulhaOsso.custoRealKg, 21.45);
  assert.equal(agulhaOsso.lucroKg, 3.45);
  assert.ok(agulhaOsso.margemPerc > 0);
});

test('REG-007: Perda líquida (Sangue/Líquidos) tem prejuízo de 100%', () => {
  const rendimento = calcularRendimentoAmostras(patinho.amostras);
  const resultadoCusto = calcularCustosPecaChave(rendimento, 28.50, {
    modoCusto: 'peca_chave',
    precosVenda: patinho.precosVendaSugeridos
  });

  const sangue = resultadoCusto.cortes.find((c) => c.nome === 'Sangue e Líquidos');
  assert.ok(sangue);
  assert.equal(sangue.precoVendaKg, 0);
  assert.equal(sangue.custoRealKg, 28.50);
  assert.equal(sangue.lucroKg, -28.50);
  assert.equal(sangue.margemPerc, -100);
});

test('REG-009: Agrupamento da Composição da Carcaça (Lucrativos vs Subprodutos vs Quebras)', () => {
  const rendimento = calcularRendimentoAmostras(dianteiro.amostras);
  const dist = calcularDistribuicaoComposicaoPeca(rendimento.cortes, rendimento.quebraGlobalPerc);

  // Subproduto: Cebo e Osso = 18.39%
  assert.equal(dist.percSubprodutos, 18.39);
  // Quebra técnica = 0.01%
  assert.equal(dist.percQuebra, 0.01);
  // Carnes comerciais = 100% - 18.39% - 0.01% = 81.6%
  assert.equal(dist.percComerciais, 81.6);
  assert.equal(dist.percLiquidos, 0);
});

test('REG-002: Cálculo alternativo de Custo Ponderado por Valor Comercial', () => {
  const rendimento = calcularRendimentoAmostras(dianteiro.amostras);
  const custos = calcularCustosERentabilidade(rendimento, 21.45, dianteiro.precosVendaSugeridos);
  assert.equal(custos.custoKgEntrada, 21.45);
  assert.ok(custos.faturamentoTotalPeca > custos.custoTotalPeca);
});

test('REG-004: Projeção de Compras e Estoque', () => {
  const rendimento = calcularRendimentoAmostras(dianteiro.amostras);
  const projecao = projetarCompraEstoque(1000, 21.45, rendimento, dianteiro.precosVendaSugeridos);
  assert.equal(projecao.pesoLoteKg, 1000);
  assert.equal(projecao.custoTotalLote, 21450.00);
});

test('Defensividade: Bloqueio de valores negativos e formatos inválidos', () => {
  assert.throws(() => validarNumeroNaoNegativo(-5, 'teste'), TypeError);
  assert.throws(() => parseTempoEmSegundos('invalido:abc'), Error);
  assert.throws(() => calcularRendimentoAmostras([]), Error);
});
