/**
 * Calculadora de Rendimento e Custo Real de Açougue
 * Módulo de Lógica de Domínio
 * Padrão de Engenharia: Tipagem JSDoc, defensividade e funções <= 30 linhas
 */

/**
 * Valida se um número é válido e não-negativo.
 * @param {number} valor 
 * @param {string} nomeCampo 
 * @returns {number}
 */
export function validarNumeroNaoNegativo(valor, nomeCampo) {
  if (typeof valor !== 'number' || Number.isNaN(valor) || valor < 0) {
    throw new TypeError(`O campo '${nomeCampo}' deve ser um número não-negativo válido.`);
  }
  return valor;
}

/**
 * Converte string de tempo HH:MM:SS ou MM:SS em segundos.
 * @param {string} tempoStr 
 * @returns {number}
 */
export function parseTempoEmSegundos(tempoStr) {
  if (typeof tempoStr !== 'string' || !tempoStr.trim()) return 0;
  const partes = tempoStr.trim().split(':').map((p) => Number.parseInt(p, 10));
  if (partes.some((p) => Number.isNaN(p) || p < 0)) {
    throw new Error(`Formato de tempo inválido: '${tempoStr}'. Use HH:MM:SS ou MM:SS.`);
  }
  if (partes.length === 3) return (partes[0] * 3600) + (partes[1] * 60) + partes[2];
  if (partes.length === 2) return (partes[0] * 60) + partes[1];
  return partes[0];
}

/**
 * Converte segundos para string formatada HH:MM:SS.
 * @param {number} totalSegundos 
 * @returns {string}
 */
export function formatarSegundosEmTempo(totalSegundos) {
  validarNumeroNaoNegativo(totalSegundos, 'totalSegundos');
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = Math.floor(totalSegundos % 60);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`;
}

/**
 * Arredonda um número para N casas decimais com segurança.
 * @param {number} valor 
 * @param {number} casas 
 * @returns {number}
 */
export function arredondar(valor, casas = 3) {
  const fator = 10 ** casas;
  return Math.round((valor + Number.EPSILON) * fator) / fator;
}

/**
 * Calcula a quebra de desossa de uma única amostra.
 * @param {number} pesoTotalEntrada 
 * @param {number} somaCortesESubprodutos 
 * @returns {{ quebraKg: number, quebraPerc: number }}
 */
export function calcularQuebraAmostra(pesoTotalEntrada, somaCortesESubprodutos) {
  validarNumeroNaoNegativo(pesoTotalEntrada, 'pesoTotalEntrada');
  validarNumeroNaoNegativo(somaCortesESubprodutos, 'somaCortesESubprodutos');
  if (pesoTotalEntrada === 0) return { quebraKg: 0, quebraPerc: 0 };
  const quebraKg = arredondar(pesoTotalEntrada - somaCortesESubprodutos, 3);
  const quebraPerc = arredondar((quebraKg / pesoTotalEntrada) * 100, 2);
  return { quebraKg, quebraPerc };
}

/**
 * Calcula a produtividade de desossa em kg/hora.
 * @param {number} pesoTotalKg 
 * @param {number} tempoTotalSegundos 
 * @returns {number}
 */
export function calcularProdutividadeKgHora(pesoTotalKg, tempoTotalSegundos) {
  validarNumeroNaoNegativo(pesoTotalKg, 'pesoTotalKg');
  validarNumeroNaoNegativo(tempoTotalSegundos, 'tempoTotalSegundos');
  if (tempoTotalSegundos === 0) return 0;
  return arredondar(pesoTotalKg / (tempoTotalSegundos / 3600), 2);
}

/**
 * Agrega e calcula o rendimento percentual ponderado de 1 a N amostras.
 * @param {Array<{ id?: string|number, nome?: string, pesoTotal: number, tempo?: string, cortes: Record<string, number> }>} amostras 
 * @returns {object}
 */
export function calcularRendimentoAmostras(amostras) {
  if (!Array.isArray(amostras) || amostras.length === 0) {
    throw new Error('É necessário fornecer pelo menos uma amostra.');
  }
  const nomesCortes = extrairNomesCortesUnicos(amostras);
  const totaisCortes = inicializarMapa(nomesCortes);
  let somaPesoTotalEntrada = 0;
  let somaTempoSegundos = 0;

  const amostrasProcessadas = processarCadaAmostra(
    amostras,
    totaisCortes,
    (peso) => { somaPesoTotalEntrada += peso; },
    (tempo) => { somaTempoSegundos += tempo; }
  );

  const cortesConsolidados = montarConsolidadoCortes(nomesCortes, totaisCortes, somaPesoTotalEntrada, amostras.length);
  return consolidarResultadoFinal(amostrasProcessadas, cortesConsolidados, somaPesoTotalEntrada, somaTempoSegundos, amostras.length);
}

function extrairNomesCortesUnicos(amostras) {
  const setNomes = new Set();
  for (const amostra of amostras) {
    if (amostra.cortes && typeof amostra.cortes === 'object') {
      Object.keys(amostra.cortes).forEach((nome) => setNomes.add(nome));
    }
  }
  return Array.from(setNomes);
}

function inicializarMapa(chaves) {
  const mapa = {};
  for (const chave of chaves) mapa[chave] = 0;
  return mapa;
}

function processarCadaAmostra(amostras, totaisCortes, onPeso, onTempo) {
  return amostras.map((amostra, idx) => {
    const pesoTotal = validarNumeroNaoNegativo(amostra.pesoTotal, `pesoTotal Amostra ${idx + 1}`);
    onPeso(pesoTotal);
    const segundos = parseTempoEmSegundos(amostra.tempo || '00:00:00');
    onTempo(segundos);
    return montarDetalheAmostra(amostra, idx, pesoTotal, segundos, totaisCortes);
  });
}

function montarDetalheAmostra(amostra, idx, pesoTotal, segundos, totaisCortes) {
  let somaCortes = 0;
  const cortesDetalhe = {};
  for (const [nome, peso] of Object.entries(amostra.cortes || {})) {
    const pesoValido = validarNumeroNaoNegativo(peso, `${nome} Amostra ${idx + 1}`);
    somaCortes += pesoValido;
    totaisCortes[nome] = (totaisCortes[nome] || 0) + pesoValido;
    const perc = pesoTotal > 0 ? arredondar((pesoValido / pesoTotal) * 100, 2) : 0;
    cortesDetalhe[nome] = { peso: pesoValido, rendimentoPerc: perc };
  }
  const quebra = calcularQuebraAmostra(pesoTotal, somaCortes);
  return {
    id: amostra.id || `amostra-${idx + 1}`,
    nome: amostra.nome || `Amostra ${idx + 1}`,
    pesoTotal,
    tempoFormatado: formatarSegundosEmTempo(segundos),
    tempoSegundos: segundos,
    somaCortes: arredondar(somaCortes, 3),
    quebraKg: quebra.quebraKg,
    quebraPerc: quebra.quebraPerc,
    cortes: cortesDetalhe
  };
}

function montarConsolidadoCortes(nomesCortes, totaisCortes, somaPesoTotalEntrada, qtdAmostras) {
  return nomesCortes.map((nome) => {
    const pesoTotal = totaisCortes[nome] || 0;
    const pesoMedio = qtdAmostras > 0 ? arredondar(pesoTotal / qtdAmostras, 3) : 0;
    const rendimentoMedioPerc = somaPesoTotalEntrada > 0 ? arredondar((pesoTotal / somaPesoTotalEntrada) * 100, 2) : 0;
    return { nome, pesoTotal: arredondar(pesoTotal, 3), pesoMedio, rendimentoMedioPerc };
  });
}

function consolidarResultadoFinal(amostras, cortes, somaPeso, somaTempo, qtd) {
  const pesoMedioPeca = qtd > 0 ? arredondar(somaPeso / qtd, 3) : 0;
  const tempoMedioSegundos = qtd > 0 ? Math.round(somaTempo / qtd) : 0;
  const somaCortesTotal = cortes.reduce((acc, c) => acc + c.pesoTotal, 0);
  const quebraGlobal = calcularQuebraAmostra(somaPeso, somaCortesTotal);
  const produtividade = calcularProdutividadeKgHora(somaPeso, somaTempo);
  return {
    quantidadeAmostras: qtd,
    somaPesoTotalEntrada: arredondar(somaPeso, 3),
    pesoMedioPeca,
    tempoTotalSegundos: somaTempo,
    tempoTotalFormatado: formatarSegundosEmTempo(somaTempo),
    tempoMedioFormatado: formatarSegundosEmTempo(tempoMedioSegundos),
    produtividadeKgHora: produtividade,
    quebraGlobalKg: quebraGlobal.quebraKg,
    quebraGlobalPerc: quebraGlobal.quebraPerc,
    amostras,
    cortes
  };
}

/**
 * Calcula o custo e resultado baseado na regra da Peça-Chave.
 * Onde todos os cortes herdam o custo da peça inteira, gerando prejuízo em sebo/osso/líquidos e lucro nos nobres.
 */
export function calcularCustosPecaChave(resultadoRendimento, custoKgEntrada, config = {}) {
  validarNumeroNaoNegativo(custoKgEntrada, 'custoKgEntrada');
  const pesoBase = resultadoRendimento.pesoMedioPeca || resultadoRendimento.somaPesoTotalEntrada;
  const custoTotalPeca = arredondar(pesoBase * custoKgEntrada, 2);
  const precosVenda = config.precosVenda || {};
  const custosIndividuais = config.custosIndividuais || {};
  const usarCustoPecaChave = config.modoCusto !== 'livre';

  const cortesProcessados = resultadoRendimento.cortes.map((corte) => {
    return processarItemCustoPecaChave(corte, pesoBase, custoKgEntrada, precosVenda, custosIndividuais, usarCustoPecaChave);
  });

  const faturamentoTotalPeca = arredondar(cortesProcessados.reduce((a, b) => a + b.faturamentoProjetado, 0), 2);
  const lucroTotalPeca = arredondar(faturamentoTotalPeca - custoTotalPeca, 2);
  const margemGlobalPerc = faturamentoTotalPeca > 0 ? arredondar((lucroTotalPeca / faturamentoTotalPeca) * 100, 2) : 0;

  return { custoKgEntrada, pesoBaseKg: pesoBase, custoTotalPeca, faturamentoTotalPeca, lucroTotalPeca, margemGlobalPerc, cortes: cortesProcessados };
}

function processarItemCustoPecaChave(corte, pesoBase, custoKgEntrada, precosVenda, custosIndividuais, usarCustoPecaChave) {
  const precoVendaKg = precosVenda[corte.nome] !== undefined ? Number(precosVenda[corte.nome]) : 0;
  const custoRealKg = usarCustoPecaChave ? custoKgEntrada : (custosIndividuais[corte.nome] ?? custoKgEntrada);
  const pesoEstimadoKg = arredondar((pesoBase * corte.rendimentoMedioPerc) / 100, 3);
  const faturamentoProjetado = arredondar(pesoEstimadoKg * precoVendaKg, 2);
  const custoProjetado = arredondar(pesoEstimadoKg * custoRealKg, 2);
  const lucroKg = arredondar(precoVendaKg - custoRealKg, 2);
  const margemPerc = precoVendaKg > 0 ? arredondar((lucroKg / precoVendaKg) * 100, 2) : (custoRealKg > 0 ? -100 : 0);

  return {
    nome: corte.nome,
    rendimentoMedioPerc: corte.rendimentoMedioPerc,
    pesoEstimadoKg,
    precoVendaKg,
    custoRealKg,
    custoProjetado,
    faturamentoProjetado,
    lucroKg,
    lucroProjetado: arredondar(faturamentoProjetado - custoProjetado, 2),
    margemPerc
  };
}

/**
 * Método alternativo de Custo Ponderado por Valor Comercial
 */
export function calcularCustosERentabilidade(resultadoRendimento, custoKgEntrada, precosVendaKg) {
  validarNumeroNaoNegativo(custoKgEntrada, 'custoKgEntrada');
  const pesoBase = resultadoRendimento.pesoMedioPeca || resultadoRendimento.somaPesoTotalEntrada;
  const custoTotalPeca = arredondar(pesoBase * custoKgEntrada, 2);

  const cortesComPreco = resultadoRendimento.cortes.map((c) => {
    const precoVenda = validarNumeroNaoNegativo(precosVendaKg[c.nome] || 0, `Preço Venda ${c.nome}`);
    const pesoEstimado = arredondar((pesoBase * c.rendimentoMedioPerc) / 100, 3);
    const faturamentoProjetado = arredondar(pesoEstimado * precoVenda, 2);
    return { nome: c.nome, rendimentoMedioPerc: c.rendimentoMedioPerc, pesoEstimadoKg: pesoEstimado, precoVendaKg: precoVenda, faturamentoProjetado };
  });

  const faturamentoTotalPeca = arredondar(cortesComPreco.reduce((acc, c) => acc + c.faturamentoProjetado, 0), 2);
  const lucroBrutoPeca = arredondar(faturamentoTotalPeca - custoTotalPeca, 2);
  const margemGlobalPerc = faturamentoTotalPeca > 0 ? arredondar((lucroBrutoPeca / faturamentoTotalPeca) * 100, 2) : 0;
  const fatorCusto = 1 - (margemGlobalPerc / 100);

  const cortesFinalizados = cortesComPreco.map((c) => {
    const custoRealKg = arredondar(c.precoVendaKg * fatorCusto, 2);
    const lucroKg = arredondar(c.precoVendaKg - custoRealKg, 2);
    const margemCortePerc = c.precoVendaKg > 0 ? arredondar((lucroKg / c.precoVendaKg) * 100, 2) : 0;
    return { ...c, custoRealKg, lucroKg, margemCortePerc };
  });

  return { custoKgEntrada, pesoBaseKg: pesoBase, custoTotalPeca, faturamentoTotalPeca, lucroBrutoPeca, margemGlobalPerc, cortes: cortesFinalizados };
}

/**
 * Simula uma compra de lote em atacado, projetando entrada no estoque e rentabilidade total.
 */
export function projetarCompraEstoque(pesoLoteKg, custoKg, resultadoRendimento, precosVendaKg) {
  validarNumeroNaoNegativo(pesoLoteKg, 'pesoLoteKg');
  validarNumeroNaoNegativo(custoKg, 'custoKg');
  const custoTotalLote = arredondar(pesoLoteKg * custoKg, 2);

  const projecaoCortes = resultadoRendimento.cortes.map((corte) => {
    const precoVenda = validarNumeroNaoNegativo(precosVendaKg[corte.nome] || 0, `Preço ${corte.nome}`);
    const pesoEstoqueKg = arredondar((pesoLoteKg * corte.rendimentoMedioPerc) / 100, 3);
    const faturamentoProjetado = arredondar(pesoEstoqueKg * precoVenda, 2);
    return { nome: corte.nome, rendimentoMedioPerc: corte.rendimentoMedioPerc, pesoEstoqueKg, precoVendaKg: precoVenda, faturamentoProjetado };
  });

  const faturamentoTotalLote = arredondar(projecaoCortes.reduce((acc, c) => acc + c.faturamentoProjetado, 0), 2);
  const lucroBrutoLote = arredondar(faturamentoTotalLote - custoTotalLote, 2);
  const margemLotePerc = faturamentoTotalLote > 0 ? arredondar((lucroBrutoLote / faturamentoTotalLote) * 100, 2) : 0;
  return { pesoLoteKg, custoKg, custoTotalLote, faturamentoTotalLote, lucroBrutoLote, margemLotePerc, cortes: projecaoCortes };
}
