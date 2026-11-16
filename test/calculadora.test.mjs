import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validarNumeroNaoNegativo,
  parseTempoEmSegundos,
  formatarSegundosEmTempo,
  parseValorMonetario,
  parseValorPercentual,
  formatarKgValor,
  calcularSobraCorte,
  calcularPerdaTecnicaAuto,
  arredondar,
  calcularAuditoriaCorte,
  removerCorteDePeca,
  calcularQuebraAmostra,
  calcularProdutividadeKgHora,
  calcularRendimentoAmostras,
  calcularCustosPecaChave,
  calcularAnaliseIndividualAmostra,
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
  assert.equal(resultado.somaPesoTotalEntrada, 5.658);
  assert.equal(resultado.pesoMedioPeca, 5.658);

  assert.equal(resultado.quebraGlobalKg, 0);
  const patinhoLimpo = resultado.cortes.find((c) => c.nome === 'Patinho Limpo');
  assert.ok(patinhoLimpo);
  assert.equal(patinhoLimpo.pesoTotal, 5.052);
  assert.equal(patinhoLimpo.rendimentoMedioPerc, 89.29);
});

test('REG-010: Análise individual da peça (Ficha Técnica individual com quebra e lucro)', () => {
  const analisePeca1 = calcularAnaliseIndividualAmostra(
    dianteiro.amostras[0],
    dianteiro.custoKgEntrada,
    dianteiro.precosVendaSugeridos,
    true
  );

  assert.equal(analisePeca1.pesoTotal, 43.396);
  assert.equal(analisePeca1.somaCortes, 43.391);
  assert.equal(analisePeca1.quebraKg, 0.005);
  assert.equal(analisePeca1.quebraPerc, 0.01);

  assert.equal(analisePeca1.custoTotal, 930.84);
  assert.ok(analisePeca1.faturamentoTotal > analisePeca1.custoTotal);
  assert.ok(analisePeca1.lucroLiquido > 0);

  const itemCebo = analisePeca1.itens.find((i) => i.nome === 'Cebo e Osso');
  assert.ok(itemCebo);
  assert.equal(itemCebo.pesoKg, 8.318);
  assert.equal(itemCebo.lucroKg, -19.97);
});

test('REG-011: Parser flexível de valores monetários e percentuais (vírgula e ponto)', () => {
  assert.equal(parseValorMonetario('21,45'), 21.45);
  assert.equal(parseValorMonetario('21.45'), 21.45);
  assert.equal(parseValorMonetario('R$ 21,45'), 21.45);
  assert.equal(parseValorMonetario('1.250,50'), 1250.50);
  assert.equal(parseValorMonetario(''), 0);
  assert.equal(parseValorMonetario(28.5), 28.5);

  assert.equal(parseValorPercentual('30%'), 30);
  assert.equal(parseValorPercentual('30,5%'), 30.5);
  assert.equal(parseValorPercentual('30.5'), 30.5);
  assert.equal(parseValorPercentual(''), 0);
  assert.equal(parseValorPercentual(35), 35);
});

test('REG-012: Exclusão em cascata de corte de rendimento da peça', () => {
  const copiaPeca = JSON.parse(JSON.stringify(patinho));
  assert.ok(copiaPeca.cortesCatalogo.some((c) => c.nome === 'Sangue e Líquidos'));
  assert.ok(copiaPeca.amostras[0].cortes['Sangue e Líquidos'] !== undefined);

  removerCorteDePeca(copiaPeca, 'Sangue e Líquidos');

  assert.ok(!copiaPeca.cortesCatalogo.some((c) => c.nome === 'Sangue e Líquidos'));
  assert.equal(copiaPeca.amostras[0].cortes['Sangue e Líquidos'], undefined);
  assert.equal(copiaPeca.precosVendaSugeridos['Sangue e Líquidos'], undefined);
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

  assert.equal(dist.percSubprodutos, 18.39);
  assert.equal(dist.percQuebra, 0.01);
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
  assert.equal(projecao.pesoDesossaLoteKg, 1000);
  assert.equal(projecao.pesoEstoquePecaInteiraKg, 0);

  // Simulação de estoque duplo (ex: 200 kg mantidos inteiros para venda direta e 800 kg para desossa)
  const projecaoDupla = projetarCompraEstoque(1000, 21.45, rendimento, dianteiro.precosVendaSugeridos, 0.8, 26.90);
  assert.equal(projecaoDupla.pesoDesossaLoteKg, 800);
  assert.equal(projecaoDupla.pesoEstoquePecaInteiraKg, 200);
  assert.equal(projecaoDupla.faturamentoPecaInteira, 5380.00);
});

test('REG-013: Suporte a sistema zerado (0 amostras com retorno limpo sem NaN)', () => {
  const zerado = calcularRendimentoAmostras([]);
  assert.equal(zerado.quantidadeAmostras, 0);
  assert.equal(zerado.somaPesoTotalEntrada, 0);
  assert.equal(zerado.pesoMedioPeca, 0);
  assert.equal(zerado.quebraGlobalKg, 0);
  assert.equal(zerado.quebraGlobalPerc, 0);
  assert.equal(zerado.produtividadeKgHora, 0);
  assert.deepEqual(zerado.amostras, []);
  assert.deepEqual(zerado.cortes, []);
});

test('REG-014: Cálculo de sobra do corte principal e formatação de 3 casas decimais (0,000 kg e 0,140 kg)', () => {
  // Exemplo real do usuário: Patinho 5,658 kg com perdas e moídas
  const pesoTotal = 5.658;
  const aparasEPerdas = {
    'Sangue e Líquidos': 0.116,
    'Cebo e Osso': 0.146,
    'Moída de Primeira': 0.140,
    'Moída de Segunda': 0.204
  };
  const sobraLimpa = calcularSobraCorte(pesoTotal, aparasEPerdas);
  assert.equal(sobraLimpa, 5.052);

  // Formatação estrita com 3 casas decimais
  assert.equal(formatarKgValor(0.14), '0,140');
  assert.equal(formatarKgValor('0.14'), '0,140');
  assert.equal(formatarKgValor('0,14'), '0,140');
  assert.equal(formatarKgValor(0), '0,000');
  assert.equal(formatarKgValor(''), '0,000');
  assert.equal(formatarKgValor(5.658), '5,658');
});

test('REG-015: Auditoria comparativa entre Cadastro Atual de ERP e Custo/Margem Real da Desossa', () => {
  // Caso 1: Moída de 1ª vendida a R$ 25 com custo de R$ 20 no ERP, mas custando R$ 28.50 na desossa
  const audit1 = calcularAuditoriaCorte(20.00, 25.00, 28.50, 30.0);
  assert.equal(audit1.custoAtualSistema, 20.00);
  assert.equal(audit1.precoVendaAtual, 25.00);
  assert.equal(audit1.custoRealDesossa, 28.50);
  assert.equal(audit1.margemAtualSistemaPerc, 20.00);
  assert.equal(audit1.margemRealDesossaPerc, -14.00);
  assert.equal(audit1.difCustoKg, 8.50);
  assert.equal(audit1.diagnostico, 'prejuizo_oculto');
  assert.equal(audit1.precoSugeridoMeta, 40.71);

  // Caso 2: Corte nobre com margem saudável (custo real R$ 21.45, venda R$ 35.00)
  const audit2 = calcularAuditoriaCorte(21.45, 35.00, 21.45, 30.0);
  assert.equal(audit2.margemRealDesossaPerc, 38.71);
  assert.equal(audit2.diagnostico, 'saudavel');

  // Caso 3: Sangue / Perda líquida (venda R$ 0.00, custo real R$ 21.45)
  const audit3 = calcularAuditoriaCorte(0, 0, 21.45, 30.0);
  assert.equal(audit3.diagnostico, 'perda');
  assert.equal(audit3.margemRealDesossaPerc, -100);
});

test('REG-016: Fechamento de rendimento em 100% com Perda Técnica Automática (Manejo e Serra)', () => {
  // Exemplo da Alcatra ou Dianteiro com sobra técnica (corte de serra / evaporação / manejo)
  // Peça de entrada de 10,000 kg, com cortes e perdas informadas somando 9,700 kg
  const pesoEntrada = 10.000;
  const somaCortesInformados = 9.700;

  const resultadoPerda = calcularPerdaTecnicaAuto(pesoEntrada, somaCortesInformados);
  assert.equal(resultadoPerda.perdaTecnicaKg, 0.300);
  assert.equal(resultadoPerda.perdaTecnicaPerc, 3.00);
  assert.equal(resultadoPerda.rendimentoFechadoPerc, 100.00);

  // Amostra real com cortes parciais
  const amostraTeste = {
    id: 'amostra-teste-1',
    nome: 'Peça Teste',
    pesoTotal: 5.658,
    tempo: '00:03:46',
    cortes: {
      'Sangue e Líquidos': 0.116,
      'Cebo e Osso': 0.146,
      'Moída de Primeira': 0.140,
      'Moída de Segunda': 0.204,
      'Patinho Limpo': 4.800
    }
  };
  // Soma cortes = 0.116 + 0.146 + 0.140 + 0.204 + 4.800 = 5.406 kg
  // Diferença até 5.658 kg = 0.252 kg (4.45%)
  const resultadoRend = calcularRendimentoAmostras([amostraTeste], { incluirPerdaTecnica: true });
  assert.equal(resultadoRend.quantidadeAmostras, 1);
  const itemPerdaTecnica = resultadoRend.cortes.find((c) => c.nome === 'Perda Técnica (Manejo / Serra)');
  assert.ok(itemPerdaTecnica, 'O corte de Perda Técnica deve estar presente');
  assert.equal(itemPerdaTecnica.pesoTotal, 0.252);
  assert.equal(itemPerdaTecnica.rendimentoMedioPerc, 4.45);

  const somaTodosRendimentos = resultadoRend.cortes.reduce((acc, c) => acc + c.rendimentoMedioPerc, 0);
  assert.equal(arredondar(somaTodosRendimentos, 1), 100.0);
});

test('REG-017: Multi-amostragem de desossa/limpeza com médias ponderadas exatas e fechamento de rendimento em 100%', () => {
  // Cenário real do Patinho Bovino com 3 transformações/limpezas sucessivas
  const amostrasPatinho = [
    {
      id: 'limpeza-1',
      nome: 'Transformação/Limpeza 1',
      pesoTotal: 5.658,
      tempo: '00:03:46',
      cortes: {
        'Patinho Limpo': 5.040,
        'Cebo e Osso': 0.146,
        'Sangue e Líquidos': 0.116,
        'Moída de Primeira': 0.140,
        'Moída de Segunda': 0.204
      }
    },
    {
      id: 'limpeza-2',
      nome: 'Transformação/Limpeza 2',
      pesoTotal: 4.334,
      tempo: '00:03:32',
      cortes: {
        'Patinho Limpo': 3.614,
        'Cebo e Osso': 0.094,
        'Sangue e Líquidos': 0.150,
        'Moída de Primeira': 0.222,
        'Moída de Segunda': 0.232
      }
    },
    {
      id: 'limpeza-3',
      nome: 'Transformação/Limpeza 3',
      pesoTotal: 5.472,
      tempo: '00:03:54',
      cortes: {
        'Patinho Limpo': 4.502,
        'Cebo e Osso': 0.124,
        'Sangue e Líquidos': 0.180,
        'Moída de Primeira': 0.380,
        'Moída de Segunda': 0.264
      }
    }
  ];

  const resultado = calcularRendimentoAmostras(amostrasPatinho, { incluirPerdaTecnica: true });

  assert.equal(resultado.quantidadeAmostras, 3);
  assert.equal(resultado.somaPesoTotalEntrada, 15.464);
  assert.equal(resultado.pesoMedioPeca, 5.155);

  // Verificação exata da Média e Rendimento de Cebo e Osso
  // (0.146 + 0.094 + 0.124) = 0.364 / 3 = 0.121 kg (e não 0.080 kg do erro relatado)
  const cebo = resultado.cortes.find((c) => c.nome === 'Cebo e Osso');
  assert.ok(cebo);
  assert.equal(cebo.pesoTotal, 0.364);
  assert.equal(cebo.pesoMedio, 0.121);
  assert.equal(cebo.rendimentoMedioPerc, 2.35);

  // Verificação de Patinho Limpo
  const patinho = resultado.cortes.find((c) => c.nome === 'Patinho Limpo');
  assert.ok(patinho);
  assert.equal(patinho.pesoTotal, 13.156);
  assert.equal(patinho.pesoMedio, 4.385);
  assert.equal(patinho.rendimentoMedioPerc, 85.08);

  // Verificação de Sangue e Líquidos
  const sangue = resultado.cortes.find((c) => c.nome === 'Sangue e Líquidos');
  assert.ok(sangue);
  assert.equal(sangue.pesoTotal, 0.446);
  assert.equal(sangue.pesoMedio, 0.149);
  assert.equal(sangue.rendimentoMedioPerc, 2.88);

  // Verificação de Moída 1ª
  const moida1 = resultado.cortes.find((c) => c.nome === 'Moída de Primeira');
  assert.ok(moida1);
  assert.equal(moida1.pesoTotal, 0.742);
  assert.equal(moida1.pesoMedio, 0.247);
  assert.equal(moida1.rendimentoMedioPerc, 4.80);

  // Verificação de Moída 2ª
  const moida2 = resultado.cortes.find((c) => c.nome === 'Moída de Segunda');
  assert.ok(moida2);
  assert.equal(moida2.pesoTotal, 0.700);
  assert.equal(moida2.pesoMedio, 0.233);
  assert.equal(moida2.rendimentoMedioPerc, 4.53);

  // Verificação da Perda Técnica Automática (0.012 + 0.022 + 0.022 = 0.056 kg)
  const perdaTec = resultado.cortes.find((c) => c.nome === 'Perda Técnica (Manejo / Serra)');
  assert.ok(perdaTec);
  assert.equal(perdaTec.pesoTotal, 0.056);
  assert.equal(perdaTec.pesoMedio, 0.019);
  assert.equal(perdaTec.rendimentoMedioPerc, 0.36);

  // Fechamento exato de 100.00% no somatório de rendimentos
  const somaRendimentos = resultado.cortes.reduce((acc, c) => acc + c.rendimentoMedioPerc, 0);
  assert.equal(arredondar(somaRendimentos, 2), 100.00);
});

test('Defensividade: Bloqueio de valores negativos e formatos inválidos', () => {
  assert.throws(() => validarNumeroNaoNegativo(-5, 'teste'), TypeError);
  assert.throws(() => parseTempoEmSegundos('invalido:abc'), Error);
  assert.throws(() => calcularRendimentoAmostras('invalido'), TypeError);
});
