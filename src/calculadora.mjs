/**
 * Calculadora de Rendimento e Custo Real de Açougue
 * Módulo de Lógica de Domínio
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
  if (typeof tempoStr !== 'string' || !tempoStr.trim()) {
    return 0;
  }
  const partes = tempoStr.trim().split(':').map((p) => Number.parseInt(p, 10));
  if (partes.some((p) => Number.isNaN(p) || p < 0)) {
    throw new Error(`Formato de tempo inválido: '${tempoStr}'. Use HH:MM:SS ou MM:SS.`);
  }
  if (partes.length === 3) {
    return (partes[0] * 3600) + (partes[1] * 60) + partes[2];
  }
  if (partes.length === 2) {
    return (partes[0] * 60) + partes[1];
  }
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
  if (pesoTotalEntrada === 0) {
    return { quebraKg: 0, quebraPerc: 0 };
  }
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
  const horas = tempoTotalSegundos / 3600;
  return arredondar(pesoTotalKg / horas, 2);
}

/**
 * Agrega e calcula o rendimento percentual ponderado de múltiplas amostras.
 * @param {Array<{ id: string|number, nome?: string, pesoTotal: number, tempo?: string, cortes: Record<string, number> }>} amostras 
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

  const cortesConsolidados = montarConsolidadoCortes(
    nomesCortes,
    totaisCortes,
    somaPesoTotalEntrada,
    amostras.length
  );

  return consolidarResultadoFinal(
    amostrasProcessadas,
    cortesConsolidados,
    somaPesoTotalEntrada,
    somaTempoSegundos,
    amostras.length
  );
}

/**
 * Extrai a lista ordenada de nomes únicos de cortes presentes em todas as amostras.
 * @param {Array<{ cortes: Record<string, number> }>} amostras 
 * @returns {string[]}
 */
function extrairNomesCortesUnicos(amostras) {
  const setNomes = new Set();
  for (const amostra of amostras) {
    if (amostra.cortes && typeof amostra.cortes === 'object') {
      Object.keys(amostra.cortes).forEach((nome) => setNomes.add(nome));
    }
  }
  return Array.from(setNomes);
}

/**
 * Inicializa um mapa com valores zerados para cada chave informada.
 * @param {string[]} chaves 
 * @returns {Record<string, number>}
 */
function inicializarMapa(chaves) {
  const mapa = {};
  for (const chave of chaves) {
    mapa[chave] = 0;
  }
  return mapa;
}

/**
 * Processa as amostras individualmente acumulando métricas.
 */
function processarCadaAmostra(amostras, totaisCortes, onPeso, onTempo) {
  return amostras.map((amostra, idx) => {
    const pesoTotal = validarNumeroNaoNegativo(amostra.pesoTotal, `pesoTotal Amostra ${idx + 1}`);
    onPeso(pesoTotal);
    const segundos = parseTempoEmSegundos(amostra.tempo || '00:00:00');
    onTempo(segundos);
    return montarDetalheAmostra(amostra, idx, pesoTotal, segundos, totaisCortes);
  });
}

/**
 * Monta o detalhe calculado de uma única amostra.
 */
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

/**
 * Consolida o peso total, peso médio e rendimento médio ponderado por corte.
 */
function montarConsolidadoCortes(nomesCortes, totaisCortes, somaPesoTotalEntrada, qtdAmostras) {
  return nomesCortes.map((nome) => {
    const pesoTotal = totaisCortes[nome] || 0;
    const pesoMedio = qtdAmostras > 0 ? arredondar(pesoTotal / qtdAmostras, 3) : 0;
    const rendimentoMedioPerc = somaPesoTotalEntrada > 0
      ? arredondar((pesoTotal / somaPesoTotalEntrada) * 100, 2)
      : 0;
    return {
      nome,
      pesoTotal: arredondar(pesoTotal, 3),
      pesoMedio,
      rendimentoMedioPerc
    };
  });
}

/**
 * Retorna o objeto consolidado com métricas globais e médias.
 */
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
 * Calcula a apropriação de Custo Real por corte e margem de lucro de açougue.
 * Usa o método padrão da indústria cárnea: Custo Ponderado por Valor Comercial.
 * @param {object} resultadoRendimento 
 * @param {number} custoKgEntrada 
 * @param {Record<string, number>} precosVendaKg 
 * @returns {object}
 */
export function calcularCustosERentabilidade(resultadoRendimento, custoKgEntrada, precosVendaKg) {
  validarNumeroNaoNegativo(custoKgEntrada, 'custoKgEntrada');
  const pesoBase = resultadoRendimento.pesoMedioPeca || resultadoRendimento.somaPesoTotalEntrada;
  const custoTotalPeca = arredondar(pesoBase * custoKgEntrada, 2);

  const cortesComPreco = calcularFaturamentoECustosCortes(
    resultadoRendimento.cortes,
    pesoBase,
    resultadoRendimento.somaPesoTotalEntrada,
    precosVendaKg
  );

  const faturamentoTotalPeca = arredondar(
    cortesComPreco.reduce((acc, c) => acc + c.faturamentoProjetado, 0),
    2
  );

  const lucroBrutoPeca = arredondar(faturamentoTotalPeca - custoTotalPeca, 2);
  const margemGlobalPerc = faturamentoTotalPeca > 0
    ? arredondar((lucroBrutoPeca / faturamentoTotalPeca) * 100, 2)
    : 0;

  const cortesFinalizados = atribuirCustoRealPorCorte(cortesComPreco, margemGlobalPerc);

  return {
    custoKgEntrada,
    pesoBaseKg: pesoBase,
    custoTotalPeca,
    faturamentoTotalPeca,
    lucroBrutoPeca,
    margemGlobalPerc,
    cortes: cortesFinalizados
  };
}

/**
 * Calcula o faturamento previsto de cada corte com base no rendimento percentual médio.
 */
function calcularFaturamentoECustosCortes(cortes, pesoBase, somaPesoTotal, precosVenda) {
  return cortes.map((corte) => {
    const precoVenda = validarNumeroNaoNegativo(precosVenda[corte.nome] || 0, `Preço Venda ${corte.nome}`);
    const pesoEstimado = arredondar((pesoBase * corte.rendimentoMedioPerc) / 100, 3);
    const faturamentoProjetado = arredondar(pesoEstimado * precoVenda, 2);
    return {
      nome: corte.nome,
      rendimentoMedioPerc: corte.rendimentoMedioPerc,
      pesoEstimadoKg: pesoEstimado,
      precoVendaKg: precoVenda,
      faturamentoProjetado
    };
  });
}

/**
 * Aplica o fator de custo ponderado ao preço de venda para determinar o custo real de cada corte.
 */
function atribuirCustoRealPorCorte(cortes, margemGlobalPerc) {
  const fatorCusto = 1 - (margemGlobalPerc / 100);
  return cortes.map((corte) => {
    const custoRealKg = arredondar(corte.precoVendaKg * fatorCusto, 2);
    const lucroKg = arredondar(corte.precoVendaKg - custoRealKg, 2);
    const margemCortePerc = corte.precoVendaKg > 0
      ? arredondar((lucroKg / corte.precoVendaKg) * 100, 2)
      : 0;
    return {
      ...corte,
      custoRealKg,
      lucroKg,
      margemCortePerc
    };
  });
}

/**
 * Simula uma compra de lote em atacado, projetando entrada no estoque e rentabilidade total.
 * @param {number} pesoLoteKg 
 * @param {number} custoKg 
 * @param {object} resultadoRendimento 
 * @param {Record<string, number>} precosVendaKg 
 * @returns {object}
 */
export function projetarCompraEstoque(pesoLoteKg, custoKg, resultadoRendimento, precosVendaKg) {
  validarNumeroNaoNegativo(pesoLoteKg, 'pesoLoteKg');
  validarNumeroNaoNegativo(custoKg, 'custoKg');
  const custoTotalLote = arredondar(pesoLoteKg * custoKg, 2);

  const projecaoCortes = resultadoRendimento.cortes.map((corte) => {
    const precoVenda = validarNumeroNaoNegativo(precosVendaKg[corte.nome] || 0, `Preço ${corte.nome}`);
    const pesoEstoqueKg = arredondar((pesoLoteKg * corte.rendimentoMedioPerc) / 100, 3);
    const faturamentoProjetado = arredondar(pesoEstoqueKg * precoVenda, 2);
    return {
      nome: corte.nome,
      rendimentoMedioPerc: corte.rendimentoMedioPerc,
      pesoEstoqueKg,
      precoVendaKg: precoVenda,
      faturamentoProjetado
    };
  });

  const faturamentoTotalLote = arredondar(
    projecaoCortes.reduce((acc, c) => acc + c.faturamentoProjetado, 0),
    2
  );
  const lucroBrutoLote = arredondar(faturamentoTotalLote - custoTotalLote, 2);
  const margemLotePerc = faturamentoTotalLote > 0
    ? arredondar((lucroBrutoLote / faturamentoTotalLote) * 100, 2)
    : 0;

  return {
    pesoLoteKg,
    custoKg,
    custoTotalLote,
    faturamentoTotalLote,
    lucroBrutoLote,
    margemLotePerc,
    cortes: projecaoCortes
  };
}
