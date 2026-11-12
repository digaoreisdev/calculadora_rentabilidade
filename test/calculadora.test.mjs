import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validarNumeroNaoNegativo,
  parseTempoEmSegundos,
  formatarSegundosEmTempo,
  arredondar,
  calcularQuebraAmostra,
  calcularProdutividadeKgHora,
  calcularRendimentoAmostras,
  calcularCustosERentabilidade,
  projetarCompraEstoque
} from '../src/calculadora.mjs';
import { DADOS_INICIAIS_DIANTEIRO } from '../src/dadosIniciais.mjs';

test('REG-003: Conversão e formatação de tempos de desossa', () => {
  assert.equal(parseTempoEmSegundos('00:27:02'), (27 * 60) + 2);
  assert.equal(parseTempoEmSegundos('25:35'), (25 * 60) + 35);
  assert.equal(parseTempoEmSegundos(''), 0);
  assert.equal(formatarSegundosEmTempo(1622), '00:27:02');

  const prod = calcularProdutividadeKgHora(120, 3600);
  assert.equal(prod, 120);
});

test('REG-001: Quebra de desossa e rendimento ponderado da amostragem do Dianteiro', () => {
  const resultado = calcularRendimentoAmostras(DADOS_INICIAIS_DIANTEIRO.amostras);

  assert.equal(resultado.quantidadeAmostras, 3);
  // Soma dos pesos: 43.396 + 44.338 + 32.178 = 119.912 kg
  assert.equal(resultado.somaPesoTotalEntrada, 119.912);
  assert.equal(resultado.pesoMedioPeca, 39.971);

  // Amostra 1: peso total 43.396 kg, soma cortes: 43.391 kg -> quebra = 0.005 kg (~0.01%)
  const a1 = resultado.amostras[0];
  assert.equal(a1.pesoTotal, 43.396);
  assert.equal(a1.somaCortes, 43.391);
  assert.equal(a1.quebraKg, 0.005);
  assert.equal(a1.quebraPerc, 0.01);

  // Amostra 2: peso total 44.338 kg, soma cortes: 44.334 kg -> quebra = 0.004 kg
  const a2 = resultado.amostras[1];
  assert.equal(a2.pesoTotal, 44.338);
  assert.equal(a2.somaCortes, 44.334);
  assert.equal(a2.quebraKg, 0.004);

  // Amostra 3: peso total 32.178 kg, soma cortes: 32.174 kg -> quebra = 0.004 kg
  const a3 = resultado.amostras[2];
  assert.equal(a3.pesoTotal, 32.178);
  assert.equal(a3.somaCortes, 32.174);
  assert.equal(a3.quebraKg, 0.004);

  // Quebra global: 0.005 + 0.004 + 0.004 = 0.013 kg em 119.912 kg (~0.01%)
  assert.equal(resultado.quebraGlobalKg, 0.013);
  assert.equal(resultado.quebraGlobalPerc, 0.01);

  // Validação do rendimento ponderado de Cebo e Osso:
  // Peso total Cebo/Osso: 8.318 + 8.862 + 4.874 = 22.054 kg
  // % ponderada: (22.054 / 119.912) * 100 = 18.39%
  const ceboOsso = resultado.cortes.find((c) => c.nome === 'Cebo e Osso');
  assert.ok(ceboOsso);
  assert.equal(ceboOsso.pesoTotal, 22.054);
  assert.equal(ceboOsso.rendimentoMedioPerc, 18.39);
});

test('REG-002: Cálculo de Custo Real Ponderado e Margem Global de Açougue', () => {
  const rendimento = calcularRendimentoAmostras(DADOS_INICIAIS_DIANTEIRO.amostras);
  const custos = calcularCustosERentabilidade(
    rendimento,
    DADOS_INICIAIS_DIANTEIRO.custoKgEntrada,
    DADOS_INICIAIS_DIANTEIRO.precosVendaSugeridos
  );

  assert.equal(custos.custoKgEntrada, 21.45);
  assert.ok(custos.faturamentoTotalPeca > custos.custoTotalPeca);
  assert.ok(custos.margemGlobalPerc > 0);

  // Verifica que o custo real do Cebo e Osso não é R$ 21,45 (seria absurdo cobrar 21.45 de osso que vende a 1.50)
  const ceboOsso = custos.cortes.find((c) => c.nome === 'Cebo e Osso');
  assert.ok(ceboOsso);
  assert.ok(ceboOsso.custoRealKg < 2.0); // Ponderado proporcionalmente ao valor de venda!

  // Cortes nobres devem ter custo real calculado proporcionalmente
  const agulhaEsp = custos.cortes.find((c) => c.nome === 'Agulha Especial');
  assert.ok(agulhaEsp);
  assert.ok(agulhaEsp.custoRealKg > 0);
  assert.ok(agulhaEsp.lucroKg > 0);
});

test('REG-004: Projeção de Compras e Estoque', () => {
  const rendimento = calcularRendimentoAmostras(DADOS_INICIAIS_DIANTEIRO.amostras);
  const projecao = projetarCompraEstoque(
    1000, // 1.000 kg de dianteiro
    21.45,
    rendimento,
    DADOS_INICIAIS_DIANTEIRO.precosVendaSugeridos
  );

  assert.equal(projecao.pesoLoteKg, 1000);
  assert.equal(projecao.custoTotalLote, 21450.00);
  assert.ok(projecao.faturamentoTotalLote > 21450.00);
  assert.ok(projecao.lucroBrutoLote > 0);

  // 18.39% de 1000 kg = ~183.9 kg de sebo e osso
  const ceboOsso = projecao.cortes.find((c) => c.nome === 'Cebo e Osso');
  assert.equal(ceboOsso.pesoEstoqueKg, 183.9);
});

test('Defensividade: Bloqueio de valores negativos e formatos inválidos', () => {
  assert.throws(() => validarNumeroNaoNegativo(-5, 'teste'), TypeError);
  assert.throws(() => parseTempoEmSegundos('invalido:abc'), Error);
  assert.throws(() => calcularRendimentoAmostras([]), Error);
});
