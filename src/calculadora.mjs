/**
 * Calculadora de Rendimento e Custo Real de Açougue
 * Módulo de Lógica de Domínio
 * Padrão de Engenharia: Tipagem JSDoc, defensividade e funções <= 30 linhas
 */

export function validarNumeroNaoNegativo(valor, nomeCampo) {
  if (typeof valor !== 'number' || Number.isNaN(valor) || valor < 0) {
    throw new TypeError(`O campo '${nomeCampo}' deve ser um número não-negativo válido.`);
  }
  return valor;
}

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

export function formatarSegundosEmTempo(totalSegundos) {
  validarNumeroNaoNegativo(totalSegundos, 'totalSegundos');
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = Math.floor(totalSegundos % 60);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`;
}

export function arredondar(valor, casas = 3) {
  const fator = 10 ** casas;
  return Math.round((valor + Number.EPSILON) * fator) / fator;
}

export function parseValorMonetario(valor) {
  if (typeof valor === 'number') return Math.max(0, valor);
  if (!valor || typeof valor !== 'string') return 0;
  const limpa = valor.replace(/[^\d.,]/g, '').trim();
  if (!limpa) return 0;
  if (limpa.includes('.') && limpa.includes(',')) {
    return Number.parseFloat(limpa.replace(/\./g, '').replace(',', '.')) || 0;
  }
  if (limpa.includes(',')) {
    return Number.parseFloat(limpa.replace(',', '.')) || 0;
  }
  return Number.parseFloat(limpa) || 0;
}

export function formatarKgValor(valor) {
  if (valor === undefined || valor === null || valor === '') return '0,000';
  const num = typeof valor === 'number' ? valor : (Number.parseFloat(String(valor).replace(',', '.')) || 0);
  const seguro = Math.max(0, num);
  return arredondar(seguro, 3).toLocaleString('pt-BR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  });
}

export function calcularSobraCorte(pesoTotal, outrosCortes) {
  validarNumeroNaoNegativo(pesoTotal, 'pesoTotal');
  let somaOutros = 0;
  if (Array.isArray(outrosCortes)) {
    somaOutros = outrosCortes.reduce((acc, v) => acc + (Number(v) || 0), 0);
  } else if (outrosCortes && typeof outrosCortes === 'object') {
    somaOutros = Object.values(outrosCortes).reduce((acc, v) => acc + (Number(v) || 0), 0);
  }
  return Math.max(0, arredondar(pesoTotal - somaOutros, 3));
}

export function calcularPerdaTecnicaAuto(pesoTotalEntrada, somaCortesInformados) {
  validarNumeroNaoNegativo(pesoTotalEntrada, 'pesoTotalEntrada');
  validarNumeroNaoNegativo(somaCortesInformados, 'somaCortesInformados');
  if (pesoTotalEntrada === 0) {
    return { perdaTecnicaKg: 0, perdaTecnicaPerc: 0, rendimentoFechadoPerc: 100 };
  }
  const perdaKg = Math.max(0, arredondar(pesoTotalEntrada - somaCortesInformados, 3));
  const perdaPerc = arredondar((perdaKg / pesoTotalEntrada) * 100, 2);
  return {
    perdaTecnicaKg: perdaKg,
    perdaTecnicaPerc: perdaPerc,
    rendimentoFechadoPerc: 100.00
  };
}

export function parseValorPercentual(valor) {
  if (typeof valor === 'number') return Math.max(0, valor);
  if (!valor || typeof valor !== 'string') return 0;
  const limpa = valor.replace(/[^\d.,]/g, '').trim();
  if (!limpa) return 0;
  return Number.parseFloat(limpa.replace(',', '.')) || 0;
}

export function removerCorteDePeca(peca, corteNome) {
  if (!peca || !corteNome) return peca;
  const nomeAlvo = corteNome.trim().toLowerCase();
  peca.cortesCatalogo = (peca.cortesCatalogo || []).filter(
    (c) => c.nome.trim().toLowerCase() !== nomeAlvo
  );
  (peca.amostras || []).forEach((a) => {
    if (a.cortes) {
      Object.keys(a.cortes).forEach((k) => {
        if (k.trim().toLowerCase() === nomeAlvo) delete a.cortes[k];
      });
    }
  });
  if (peca.precosVendaSugeridos) {
    Object.keys(peca.precosVendaSugeridos).forEach((k) => {
      if (k.trim().toLowerCase() === nomeAlvo) delete peca.precosVendaSugeridos[k];
    });
  }
  return peca;
}

export function calcularQuebraAmostra(pesoTotalEntrada, somaCortesESubprodutos) {
  validarNumeroNaoNegativo(pesoTotalEntrada, 'pesoTotalEntrada');
  validarNumeroNaoNegativo(somaCortesESubprodutos, 'somaCortesESubprodutos');
  if (pesoTotalEntrada === 0) return { quebraKg: 0, quebraPerc: 0 };
  const quebraKg = arredondar(pesoTotalEntrada - somaCortesESubprodutos, 3);
  const quebraPerc = arredondar((quebraKg / pesoTotalEntrada) * 100, 2);
  return { quebraKg, quebraPerc };
}

export function calcularProdutividadeKgHora(pesoTotalKg, tempoTotalSegundos) {
  validarNumeroNaoNegativo(pesoTotalKg, 'pesoTotalKg');
  validarNumeroNaoNegativo(tempoTotalSegundos, 'tempoTotalSegundos');
  if (tempoTotalSegundos === 0) return 0;
  return arredondar(pesoTotalKg / (tempoTotalSegundos / 3600), 2);
}

export function calcularRendimentoAmostras(amostras = [], opcoes = {}) {
  if (!Array.isArray(amostras)) {
    throw new TypeError('O parâmetro amostras deve ser um array.');
  }
  if (amostras.length === 0) return montarRetornoAmostrasVazias();
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
  adicionarPerdaTecnicaAutoSeAtivo(cortesConsolidados, somaPesoTotalEntrada, amostras.length, opcoes);
  return consolidarResultadoFinal(amostrasProcessadas, cortesConsolidados, somaPesoTotalEntrada, somaTempoSegundos, amostras.length);
}

function montarRetornoAmostrasVazias() {
  return {
    quantidadeAmostras: 0,
    somaPesoTotalEntrada: 0,
    pesoMedioPeca: 0,
    tempoTotalSegundos: 0,
    tempoMedioSegundos: 0,
    produtividadeKgHora: 0,
    quebraGlobalKg: 0,
    quebraGlobalPerc: 0,
    amostras: [],
    cortes: []
  };
}

function adicionarPerdaTecnicaAutoSeAtivo(cortes, somaPeso, qtd, opcoes = {}) {
  if (!opcoes.incluirPerdaTecnica || somaPeso <= 0) return;
  const somaCortes = cortes.reduce((acc, c) => acc + c.pesoTotal, 0);
  const perdaTec = calcularPerdaTecnicaAuto(somaPeso, somaCortes);
  if (perdaTec.perdaTecnicaKg > 0) {
    cortes.push({
      nome: 'Perda Técnica (Manejo / Serra)',
      pesoTotal: perdaTec.perdaTecnicaKg,
      pesoMedio: arredondar(perdaTec.perdaTecnicaKg / qtd, 3),
      rendimentoMedioPerc: perdaTec.perdaTecnicaPerc,
      tipo: 'perda_tecnica'
    });
  }
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
    nome: amostra.nome || `Peça ${idx + 1}`,
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

export function calcularAnaliseIndividualAmostra(amostra, custoKgEntrada, precosVenda = {}, usarPecaChave = true) {
  validarNumeroNaoNegativo(custoKgEntrada, 'custoKgEntrada');
  const pesoTotal = validarNumeroNaoNegativo(amostra.pesoTotal, 'pesoTotal');
  const cortes = amostra.cortes || {};
  let somaCortes = 0;
  let faturamentoTotal = 0;

  const itens = Object.entries(cortes).map(([nome, peso]) => {
    const pesoValido = validarNumeroNaoNegativo(peso, nome);
    somaCortes += pesoValido;
    const rendPerc = pesoTotal > 0 ? arredondar((pesoValido / pesoTotal) * 100, 2) : 0;
    const preco = precosVenda[nome] ?? 0;
    const fat = arredondar(pesoValido * preco, 2);
    faturamentoTotal += fat;
    const custoKg = usarPecaChave ? custoKgEntrada : preco;
    const lucroKg = arredondar(preco - custoKg, 2);
    return { nome, pesoKg: pesoValido, rendPerc, precoVendaKg: preco, custoKg, fat, lucroKg };
  });

  const quebra = calcularQuebraAmostra(pesoTotal, somaCortes);
  const custoTotal = arredondar(pesoTotal * custoKgEntrada, 2);
  const lucroLiquido = arredondar(faturamentoTotal - custoTotal, 2);
  const margemPerc = faturamentoTotal > 0 ? arredondar((lucroLiquido / faturamentoTotal) * 100, 2) : 0;

  return {
    id: amostra.id,
    nome: amostra.nome,
    pesoTotal,
    tempo: amostra.tempo,
    somaCortes: arredondar(somaCortes, 3),
    quebraKg: quebra.quebraKg,
    quebraPerc: quebra.quebraPerc,
    custoTotal,
    faturamentoTotal: arredondar(faturamentoTotal, 2),
    lucroLiquido,
    margemPerc,
    itens
  };
}

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

export function calcularAuditoriaCorte(custoAtualSistema, precoVendaAtual, custoRealDesossa, margemMetaPerc = 30) {
  const cSistema = Math.max(0, Number(custoAtualSistema) || 0);
  const pVenda = Math.max(0, Number(precoVendaAtual) || 0);
  const cReal = Math.max(0, Number(custoRealDesossa) || 0);
  const margemAtualSistemaPerc = pVenda > 0 ? arredondar(((pVenda - cSistema) / pVenda) * 100, 2) : 0;
  const margemRealDesossaPerc = pVenda > 0 ? arredondar(((pVenda - cReal) / pVenda) * 100, 2) : (cReal > 0 ? -100 : 0);
  const difCustoKg = arredondar(cReal - cSistema, 2);
  const fatorMeta = margemMetaPerc < 100 ? (1 - (margemMetaPerc / 100)) : 0.01;
  const precoSugeridoMeta = arredondar(cReal / (fatorMeta > 0 ? fatorMeta : 0.01), 2);

  let diagnostico = 'saudavel';
  if (pVenda === 0 && cReal > 0) diagnostico = 'perda';
  else if (pVenda < cReal) diagnostico = 'prejuizo_oculto';
  else if (margemRealDesossaPerc < margemMetaPerc) diagnostico = 'abaixo_meta';

  return {
    custoAtualSistema: cSistema,
    precoVendaAtual: pVenda,
    custoRealDesossa: cReal,
    margemAtualSistemaPerc,
    margemRealDesossaPerc,
    difCustoKg,
    precoSugeridoMeta,
    diagnostico
  };
}

export function calcularDistribuicaoComposicaoPeca(cortesCusteio, quebraPerc = 0) {
  let percComerciais = 0;
  let percSubprodutos = 0;
  let percLiquidos = 0;
  let percPerdaTec = 0;

  cortesCusteio.forEach((c) => {
    const nome = (c.nome || '').toLowerCase().trim();
    const tipo = c.tipo || '';
    if (tipo === 'perda_tecnica' || nome.includes('perda técnica') || nome.includes('manejo e serra')) {
      percPerdaTec += c.rendimentoMedioPerc;
    } else if (tipo === 'perda_liquida' || ehPerdaLiquida(nome)) {
      percLiquidos += c.rendimentoMedioPerc;
    } else if (tipo === 'subproduto' || ehSubproduto(nome)) {
      percSubprodutos += c.rendimentoMedioPerc;
    } else {
      percComerciais += c.rendimentoMedioPerc;
    }
  });

  return {
    percComerciais: arredondar(percComerciais, 2),
    percSubprodutos: arredondar(percSubprodutos, 2),
    percLiquidos: arredondar(percLiquidos, 2),
    percQuebra: arredondar(Math.max(0, quebraPerc + percPerdaTec), 2)
  };
}

function ehPerdaLiquida(nome) {
  return nome.includes('sangue') || nome.includes('liquido') || nome.includes('líquido') || nome.includes('gotejamento');
}

function ehSubproduto(nome) {
  return nome === 'cebo e osso' || nome === 'sebo e osso' || nome === 'sebo' || nome === 'cebo' || nome === 'osso branco' || nome === 'descarte';
}

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

export function projetarCompraEstoque(pesoLoteKg, custoKg, resultadoRendimento, precosVendaKg, proporcaoDesossa = 1.0, precoVendaPecaInteira = 0) {
  validarNumeroNaoNegativo(pesoLoteKg, 'pesoLoteKg');
  validarNumeroNaoNegativo(custoKg, 'custoKg');
  const propDesossa = Math.min(1, Math.max(0, Number(proporcaoDesossa) || 0));
  const custoTotalLote = arredondar(pesoLoteKg * custoKg, 2);
  const pesoDesossaKg = arredondar(pesoLoteKg * propDesossa, 3);
  const pesoInteiroKg = arredondar(pesoLoteKg * (1 - propDesossa), 3);
  const fatInteiro = arredondar(pesoInteiroKg * (Number(precoVendaPecaInteira) || 0), 2);

  const projecaoCortes = resultadoRendimento.cortes.map((corte) => {
    const precoVenda = validarNumeroNaoNegativo(precosVendaKg[corte.nome] || 0, `Preço ${corte.nome}`);
    const pesoEstoqueKg = arredondar((pesoDesossaKg * corte.rendimentoMedioPerc) / 100, 3);
    const faturamentoProjetado = arredondar(pesoEstoqueKg * precoVenda, 2);
    return { nome: corte.nome, rendimentoMedioPerc: corte.rendimentoMedioPerc, pesoEstoqueKg, precoVendaKg: precoVenda, faturamentoProjetado };
  });

  const fatCortes = arredondar(projecaoCortes.reduce((acc, c) => acc + c.faturamentoProjetado, 0), 2);
  const faturamentoTotalLote = arredondar(fatCortes + fatInteiro, 2);
  const lucroBrutoLote = arredondar(faturamentoTotalLote - custoTotalLote, 2);
  const margemLotePerc = faturamentoTotalLote > 0 ? arredondar((lucroBrutoLote / faturamentoTotalLote) * 100, 2) : 0;
  return {
    pesoLoteKg,
    custoKg,
    custoTotalLote,
    pesoDesossaLoteKg: pesoDesossaKg,
    pesoEstoquePecaInteiraKg: pesoInteiroKg,
    faturamentoPecaInteira: fatInteiro,
    faturamentoTotalLote,
    lucroBrutoLote,
    margemLotePerc,
    cortes: projecaoCortes
  };
}
