/**
 * Açougue Pro - Controlador de Interface e Gestão Multi-Peças
 * Regra de Engenharia: Funções focadas com no máximo 30 linhas e código defensivo
 */

// Catálogo padrão caso o LocalStorage esteja vazio
const PECAS_INICIAIS = [
  {
    id: 'dianteiro-bovino',
    nome: 'Dianteiro Bovino',
    custoKgEntrada: 21.45,
    margemPadraoPerc: 30.0,
    modoCusto: 'peca_chave',
    modoMargem: 'individual',
    cortesCatalogo: [
      { nome: 'Cebo e Osso', tipo: 'subproduto', precoVendaPadrao: 1.48 },
      { nome: 'Agulha C/ Osso', tipo: 'com_osso', precoVendaPadrao: 24.90 },
      { nome: 'Agulha S/ Osso', tipo: 'nobre', precoVendaPadrao: 32.90 },
      { nome: 'Agulha Especial', tipo: 'nobre', precoVendaPadrao: 36.90 },
      { nome: 'Costela Dianteiro', tipo: 'com_osso', precoVendaPadrao: 23.90 },
      { nome: 'Paleta C/ Sete', tipo: 'com_osso', precoVendaPadrao: 27.90 },
      { nome: 'Paleta Osso Redondo', tipo: 'com_osso', precoVendaPadrao: 26.90 },
      { nome: 'Paleta S/ Osso', tipo: 'nobre', precoVendaPadrao: 34.90 },
      { nome: 'Peito Costela', tipo: 'com_osso', precoVendaPadrao: 25.90 },
      { nome: 'Músculo', tipo: 'nobre', precoVendaPadrao: 33.90 },
      { nome: 'Moída de Primeira', tipo: 'nobre', precoVendaPadrao: 35.90 },
      { nome: 'Moída de Segunda', tipo: 'comum', precoVendaPadrao: 26.90 }
    ],
    amostras: [
      {
        id: 'amostra-1',
        nome: 'Amostra 1 (Média)',
        pesoTotal: 43.396,
        tempo: '00:27:02',
        cortes: {
          'Cebo e Osso': 8.318,
          'Agulha C/ Osso': 6.045,
          'Agulha S/ Osso': 3.984,
          'Agulha Especial': 1.768,
          'Costela Dianteiro': 1.782,
          'Paleta C/ Sete': 1.682,
          'Paleta Osso Redondo': 3.932,
          'Paleta S/ Osso': 4.784,
          'Peito Costela': 4.104,
          'Músculo': 1.480,
          'Moída de Primeira': 1.182,
          'Moída de Segunda': 4.330
        }
      },
      {
        id: 'amostra-2',
        nome: 'Amostra 2 (Grande)',
        pesoTotal: 44.338,
        tempo: '00:25:35',
        cortes: {
          'Cebo e Osso': 8.862,
          'Agulha C/ Osso': 5.592,
          'Agulha S/ Osso': 3.812,
          'Agulha Especial': 1.696,
          'Costela Dianteiro': 1.628,
          'Paleta C/ Sete': 1.886,
          'Paleta Osso Redondo': 3.924,
          'Paleta S/ Osso': 4.680,
          'Peito Costela': 5.174,
          'Músculo': 1.010,
          'Moída de Primeira': 0.892,
          'Moída de Segunda': 5.178
        }
      },
      {
        id: 'amostra-3',
        nome: 'Amostra 3 (Pequena)',
        pesoTotal: 32.178,
        tempo: '00:23:15',
        cortes: {
          'Cebo e Osso': 4.874,
          'Agulha C/ Osso': 4.828,
          'Agulha S/ Osso': 3.344,
          'Agulha Especial': 1.582,
          'Costela Dianteiro': 0.970,
          'Paleta C/ Sete': 1.192,
          'Paleta Osso Redondo': 2.890,
          'Paleta S/ Osso': 3.680,
          'Peito Costela': 3.680,
          'Músculo': 0.998,
          'Moída de Primeira': 0.720,
          'Moída de Segunda': 3.416
        }
      }
    ],
    precosVendaSugeridos: {
      'Cebo e Osso': 1.48,
      'Agulha C/ Osso': 24.90,
      'Agulha S/ Osso': 32.90,
      'Agulha Especial': 36.90,
      'Costela Dianteiro': 23.90,
      'Paleta C/ Sete': 27.90,
      'Paleta Osso Redondo': 26.90,
      'Paleta S/ Osso': 34.90,
      'Peito Costela': 25.90,
      'Músculo': 33.90,
      'Moída de Primeira': 35.90,
      'Moída de Segunda': 26.90
    },
    historicoDesossas: []
  },
  {
    id: 'patinho-bovino',
    nome: 'Patinho Bovino (Peça Bruta)',
    custoKgEntrada: 28.50,
    margemPadraoPerc: 30.0,
    modoCusto: 'peca_chave',
    modoMargem: 'individual',
    cortesCatalogo: [
      { nome: 'Sangue e Líquidos', tipo: 'perda_liquida', precoVendaPadrao: 0.00 },
      { nome: 'Cebo e Osso', tipo: 'subproduto', precoVendaPadrao: 1.48 },
      { nome: 'Moída de Segunda', tipo: 'comum', precoVendaPadrao: 26.90 },
      { nome: 'Moída de Primeira', tipo: 'nobre', precoVendaPadrao: 37.90 },
      { nome: 'Patinho Limpo', tipo: 'nobre', precoVendaPadrao: 42.90 }
    ],
    amostras: [
      {
        id: 'amostra-patinho-1',
        nome: 'Amostra 1 (Peça 11,5 kg)',
        pesoTotal: 11.500,
        tempo: '00:08:45',
        cortes: {
          'Sangue e Líquidos': 0.180,
          'Cebo e Osso': 1.450,
          'Moída de Segunda': 0.950,
          'Moída de Primeira': 1.320,
          'Patinho Limpo': 7.590
        }
      }
    ],
    precosVendaSugeridos: {
      'Sangue e Líquidos': 0.00,
      'Cebo e Osso': 1.48,
      'Moída de Segunda': 26.90,
      'Moída de Primeira': 37.90,
      'Patinho Limpo': 42.90
    },
    historicoDesossas: []
  }
];

// Estado global do app
const banco = {
  pecas: JSON.parse(JSON.stringify(PECAS_INICIAIS)),
  idPecaAtiva: 'dianteiro-bovino',
  volumeSimuladoKg: 1000,
  custoSimuladoKg: 21.45
};

function obterPecaAtiva() {
  const p = banco.pecas.find((item) => item.id === banco.idPecaAtiva);
  return p || banco.pecas[0];
}

function avaliarExpressaoNumerica(str) {
  if (typeof str !== 'string') return Number(str) || 0;
  const limpa = str.trim().replace(/,/g, '.');
  if (!limpa) return 0;
  if (limpa.includes('+')) {
    const termos = limpa.split('+').map((t) => Number.parseFloat(t.trim()) || 0);
    return arredondar(termos.reduce((acc, v) => acc + v, 0), 3);
  }
  return arredondar(Number.parseFloat(limpa) || 0, 3);
}

function arredondar(v, c = 3) {
  const f = 10 ** c;
  return Math.round((v + Number.EPSILON) * f) / f;
}

function formatarKg(v) {
  return `${arredondar(v, 3).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} kg`;
}

function formatarMoeda(v) {
  return `R$ ${arredondar(v, 2).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatarPerc(v) {
  return `${arredondar(v, 2).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

function parseTempoEmSegundos(str) {
  if (!str || typeof str !== 'string') return 0;
  const p = str.trim().split(':').map((v) => Number.parseInt(v, 10) || 0);
  if (p.length === 3) return (p[0] * 3600) + (p[1] * 60) + p[2];
  if (p.length === 2) return (p[0] * 60) + p[1];
  return p[0] || 0;
}

function formatarSegundosEmTempo(seg) {
  const h = Math.floor(seg / 3600);
  const m = Math.floor((seg % 3600) / 60);
  const s = Math.floor(seg % 60);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function obterListaCortesPeca(peca) {
  const setNomes = new Set();
  (peca.cortesCatalogo || []).forEach((c) => setNomes.add(c.nome));
  (peca.amostras || []).forEach((a) => {
    Object.keys(a.cortes || {}).forEach((n) => setNomes.add(n));
  });
  return Array.from(setNomes);
}

function calcularMetricasPeca(peca) {
  const cortes = obterListaCortesPeca(peca);
  const totaisCortes = {};
  cortes.forEach((c) => { totaisCortes[c] = 0; });
  let somaPesoTotal = 0;
  let somaTempoSegundos = 0;

  const detalhesAmostras = (peca.amostras || []).map((a) => {
    somaPesoTotal += a.pesoTotal;
    const seg = parseTempoEmSegundos(a.tempo);
    somaTempoSegundos += seg;
    let somaCortes = 0;
    cortes.forEach((nome) => {
      const p = a.cortes[nome] || 0;
      somaCortes += p;
      totaisCortes[nome] += p;
    });
    const quebraKg = arredondar(a.pesoTotal - somaCortes, 3);
    const quebraPerc = a.pesoTotal > 0 ? arredondar((quebraKg / a.pesoTotal) * 100, 2) : 0;
    return { ...a, somaCortes, quebraKg, quebraPerc, tempoSegundos: seg };
  });

  return consolidarMetricasFinais(peca, cortes, totaisCortes, detalhesAmostras, somaPesoTotal, somaTempoSegundos);
}

function consolidarMetricasFinais(peca, cortes, totaisCortes, detalhesAmostras, somaPeso, somaTempo) {
  const qtd = peca.amostras.length || 1;
  const pesoMedioPeca = arredondar(somaPeso / qtd, 3);
  const tempoMedioSeg = Math.round(somaTempo / qtd);
  const produtividadeKgHora = somaTempo > 0 ? arredondar(somaPeso / (somaTempo / 3600), 2) : 0;
  const somaCortesGeral = Object.values(totaisCortes).reduce((a, b) => a + b, 0);
  const quebraGlobalKg = arredondar(somaPeso - somaCortesGeral, 3);
  const quebraGlobalPerc = somaPeso > 0 ? arredondar((quebraGlobalKg / somaPeso) * 100, 2) : 0;

  const cortesConsolidados = cortes.map((nome) => ({
    nome,
    pesoTotal: totaisCortes[nome],
    pesoMedio: arredondar(totaisCortes[nome] / qtd, 3),
    rendimentoPerc: somaPeso > 0 ? arredondar((totaisCortes[nome] / somaPeso) * 100, 2) : 0
  }));

  return { somaPesoTotal: somaPeso, pesoMedioPeca, tempoMedioSeg, produtividadeKgHora, quebraGlobalKg, quebraGlobalPerc, detalhesAmostras, cortesConsolidados };
}

function calcularCusteioPecaChave(peca, metricas) {
  const pesoBase = metricas.pesoMedioPeca;
  const custoBaseKg = peca.custoKgEntrada;
  const custoTotalPeca = arredondar(pesoBase * custoBaseKg, 2);
  const usarPecaChave = peca.modoCusto !== 'livre';

  const cortesProcessados = metricas.cortesConsolidados.map((c) => {
    const precoVenda = peca.precosVendaSugeridos[c.nome] ?? 0;
    const custoItemKg = usarPecaChave ? custoBaseKg : (peca.custosIndividuais?.[c.nome] ?? custoBaseKg);
    const pesoEst = arredondar((pesoBase * c.rendimentoPerc) / 100, 3);
    const fat = arredondar(pesoEst * precoVenda, 2);
    const custoEst = arredondar(pesoEst * custoItemKg, 2);
    const lucroKg = arredondar(precoVenda - custoItemKg, 2);
    const margemPerc = precoVenda > 0 ? arredondar((lucroKg / precoVenda) * 100, 2) : (custoItemKg > 0 ? -100 : 0);
    return { ...c, pesoEst, precoVenda, custoItemKg, fat, custoEst, lucroKg, lucroEst: arredondar(fat - custoEst, 2), margemPerc };
  });

  const faturamentoTotal = arredondar(cortesProcessados.reduce((a, b) => a + b.fat, 0), 2);
  const lucroLiquidoPeca = arredondar(faturamentoTotal - custoTotalPeca, 2);
  const margemGlobalPerc = faturamentoTotal > 0 ? arredondar((lucroLiquidoPeca / faturamentoTotal) * 100, 2) : 0;
  return { custoTotalPeca, faturamentoTotal, lucroLiquidoPeca, margemGlobalPerc, cortes: cortesProcessados };
}

function gerarBadgeQuebra(quebraKg, quebraPerc) {
  if (quebraKg < 0) return `<span class="badge badge-danger">⚠️ +${formatarKg(Math.abs(quebraKg))} (${quebraPerc}%)</span>`;
  if (quebraPerc <= 0.5) return `<span class="badge badge-success">✓ ${formatarKg(quebraKg)} (${quebraPerc}%)</span>`;
  if (quebraPerc <= 1.5) return `<span class="badge badge-warning">! ${formatarKg(quebraKg)} (${quebraPerc}%)</span>`;
  return `<span class="badge badge-danger">⚠️ ${formatarKg(quebraKg)} (${quebraPerc}%)</span>`;
}

function renderizarSeletorPecas() {
  const select = document.getElementById('select-peca');
  select.innerHTML = '';
  banco.pecas.forEach((p) => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.innerText = p.nome;
    if (p.id === banco.idPecaAtiva) opt.selected = true;
    select.appendChild(opt);
  });
}

function renderizarTabelaDesossa(peca, metricas) {
  renderizarCabecalhoDesossa(peca);
  renderizarCorpoDesossa(peca, metricas);
  renderizarRodapeDesossa(peca, metricas);
}

function renderizarCabecalhoDesossa(peca) {
  const thead = document.getElementById('cabecalho-tabela-desossa');
  let html = `<tr><th style="min-width: 170px;">Corte / Rendimento / Perda</th>`;
  peca.amostras.forEach((a, i) => {
    html += `
      <th class="text-center" style="background:${obterCorColuna(i)}; min-width: 180px;">
        Peça ${i + 1}
        <div style="font-size:0.75rem; font-weight:normal; margin-top:4px;">
          Total: <input type="text" class="form-input form-input-calc input-amostra-peso" data-idx="${i}"
                        value="${a.pesoTotal}" style="width: 80px; padding:2px 4px; display:inline;"> kg<br>
          Tempo: <input type="text" class="form-input input-amostra-tempo" data-idx="${i}"
                        value="${a.tempo}" style="width: 75px; padding:2px 4px; display:inline; margin-top:2px;">
        </div>
      </th>
    `;
  });
  html += `
    <th class="text-right" style="background:#f8fafc; min-width: 100px;">Média (kg)</th>
    <th class="text-right" style="background:#f8fafc; min-width: 95px;">Rend. (%)</th>
    <th class="text-center" style="width: 35px;"></th>
  </tr>`;
  thead.innerHTML = html;
}

function obterCorColuna(i) {
  const cores = ['#e0f2fe', '#fef3c7', '#dcfce7', '#f3e8ff', '#ffe4e6'];
  return cores[i % cores.length];
}

function renderizarCorpoDesossa(peca, metricas) {
  const tbody = document.getElementById('corpo-tabela-desossa');
  tbody.innerHTML = '';
  metricas.cortesConsolidados.forEach((corte) => {
    const tr = document.createElement('tr');
    let tds = `<td><strong>${corte.nome}</strong></td>`;
    peca.amostras.forEach((a, i) => {
      const v = a.cortes[corte.nome] ?? '';
      tds += `
        <td class="text-center">
          <input type="text" class="form-input form-input-calc input-corte-peso" data-idx="${i}" data-corte="${corte.nome}"
                 value="${v}" style="width: 95px; text-align:right;">
        </td>
      `;
    });
    tds += `
      <td class="text-right font-bold">${formatarKg(corte.pesoMedio)}</td>
      <td class="text-right"><span class="badge badge-neutral font-bold">${formatarPerc(corte.rendimentoPerc)}</span></td>
      <td class="text-center">
        <button class="btn btn-sm btn-secondary btn-remover-corte" data-corte="${corte.nome}" style="padding:2px 6px; color:#b91c1c;">✕</button>
      </td>
    `;
    tr.innerHTML = tds;
    tbody.appendChild(tr);
  });
}

function renderizarRodapeDesossa(peca, metricas) {
  const tfoot = document.getElementById('rodape-tabela-desossa');
  let trSoma = `<tr style="background:#f1f5f9; font-weight:700;"><td>Soma dos Cortes (kg)</td>`;
  let trQuebra = `<tr style="background:#fff; font-weight:700;"><td>Quebra de Desossa</td>`;
  metricas.detalhesAmostras.forEach((det) => {
    trSoma += `<td class="text-center">${formatarKg(det.somaCortes)}</td>`;
    trQuebra += `<td class="text-center">${gerarBadgeQuebra(det.quebraKg, det.quebraPerc)}</td>`;
  });
  const somaMedia = arredondar(metricas.cortesConsolidados.reduce((acc, c) => acc + c.pesoMedio, 0), 3);
  const somaRend = arredondar(metricas.cortesConsolidados.reduce((acc, c) => acc + c.rendimentoPerc, 0), 2);
  trSoma += `<td class="text-right">${formatarKg(somaMedia)}</td><td class="text-right">${formatarPerc(somaRend)}</td><td></td></tr>`;
  trQuebra += `<td class="text-right">${formatarKg(metricas.quebraGlobalKg / (peca.amostras.length || 1))}</td><td class="text-right">${gerarBadgeQuebra(metricas.quebraGlobalKg, metricas.quebraGlobalPerc)}</td><td></td></tr>`;
  tfoot.innerHTML = trSoma + trQuebra;
}

function renderizarGraficosVisuais(peca, metricas, custeio) {
  const dist = calcularDistribuicao(custeio.cortes, metricas.quebraGlobalPerc);
  atualizarBarraComposicao(dist);
  atualizarBoxesFinanceiros(custeio);
}

function calcularDistribuicao(cortes, quebraPerc) {
  let com = 0, sub = 0, liq = 0;
  cortes.forEach((c) => {
    const n = (c.nome || '').toLowerCase();
    if (n.includes('sangue') || n.includes('liquido') || n.includes('líquido') || n.includes('gotejamento')) {
      liq += c.rendimentoPerc;
    } else if (n === 'cebo e osso' || n === 'sebo e osso' || n === 'sebo' || n === 'cebo' || n === 'descarte') {
      sub += c.rendimentoPerc;
    } else {
      com += c.rendimentoPerc;
    }
  });
  return { com: arredondar(com, 2), sub: arredondar(sub, 2), liq: arredondar(liq, 2), q: arredondar(Math.max(0, quebraPerc), 2) };
}

function atualizarBarraComposicao(d) {
  document.getElementById('seg-comerciais').style.width = `${d.com}%`;
  document.getElementById('seg-comerciais').innerText = d.com > 6 ? `${d.com}%` : '';
  document.getElementById('seg-subprodutos').style.width = `${d.sub}%`;
  document.getElementById('seg-subprodutos').innerText = d.sub > 6 ? `${d.sub}%` : '';
  document.getElementById('seg-liquidos').style.width = `${d.liq}%`;
  document.getElementById('seg-quebra').style.width = `${d.q}%`;

  document.getElementById('chart-sub-aproveitamento').innerText = `Aproveitamento Comercial: ${d.com}%`;
  document.getElementById('leg-comerciais').innerText = `${d.com}%`;
  document.getElementById('leg-subprodutos').innerText = `${d.sub}%`;
  document.getElementById('leg-liquidos').innerText = `${d.liq}%`;
  document.getElementById('leg-quebra').innerText = `${d.q}%`;
}

function atualizarBoxesFinanceiros(custeio) {
  document.getElementById('box-custo-peca').innerText = formatarMoeda(custeio.custoTotalPeca);
  document.getElementById('box-faturamento-peca').innerText = formatarMoeda(custeio.faturamentoTotal);
  document.getElementById('box-lucro-peca').innerText = formatarMoeda(custeio.lucroLiquidoPeca);

  const fatRatio = custeio.custoTotalPeca > 0 ? Math.min(100, Math.round((custeio.faturamentoTotal / custeio.custoTotalPeca) * 50)) : 100;
  const lucroRatio = custeio.faturamentoTotal > 0 ? Math.max(0, Math.min(100, Math.round((custeio.lucroLiquidoPeca / custeio.faturamentoTotal) * 100))) : 0;
  document.getElementById('bar-faturamento-fill').style.width = `${Math.min(100, fatRatio)}%`;
  document.getElementById('bar-lucro-fill').style.width = `${lucroRatio}%`;
}

function renderizarTabelaCusteio(peca, custeio) {
  const tbody = document.getElementById('corpo-tabela-custeio');
  tbody.innerHTML = '';
  custeio.cortes.forEach((c) => {
    const isPrej = c.lucroKg < 0;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <strong>${c.nome}</strong>
        ${isPrej ? '<span class="badge badge-prejuizo" style="margin-left:6px; font-size:0.7rem;">PREJUÍZO</span>' : ''}
      </td>
      <td class="text-right">${formatarPerc(c.rendimentoPerc)}</td>
      <td class="text-right text-muted">${formatarKg(c.pesoEst)}</td>
      <td class="text-right font-bold" style="background:#fef3c7; color:var(--primary);">${formatarMoeda(c.custoItemKg)}</td>
      <td class="text-right">
        <div style="display:inline-flex; align-items:center; gap:3px;">
          <span style="font-size:0.75rem; color:var(--text-muted);">R$</span>
          <input type="number" step="0.10" class="form-input input-preco-venda-custeio" data-corte="${c.nome}"
                 value="${c.precoVenda}" style="width: 80px; text-align:right; font-weight:700;">
        </div>
      </td>
      <td class="text-right font-bold ${isPrej ? 'text-danger' : 'text-success'}">${formatarMoeda(c.lucroKg)}</td>
      <td class="text-right"><span class="badge ${isPrej ? 'badge-danger' : 'badge-success'}">${formatarPerc(c.margemPerc)}</span></td>
      <td class="text-right font-bold">${formatarMoeda(c.fat)}</td>
      <td class="text-right font-bold ${c.lucroEst >= 0 ? 'text-success' : 'text-danger'}">${formatarMoeda(c.lucroEst)}</td>
    `;
    tbody.appendChild(tr);
  });
  atualizarTotaisCusteio(custeio);
}

function atualizarTotaisCusteio(custeio) {
  const somaRend = arredondar(custeio.cortes.reduce((a, b) => a + b.rendimentoPerc, 0), 2);
  const somaPeso = arredondar(custeio.cortes.reduce((a, b) => a + b.pesoEst, 0), 3);
  document.getElementById('custo-total-rend').innerText = formatarPerc(somaRend);
  document.getElementById('custo-total-peso').innerText = formatarKg(somaPeso);
  document.getElementById('custo-total-lucro-kg').innerText = formatarMoeda(custeio.lucroLiquidoPeca / (somaPeso || 1));
  document.getElementById('custo-total-margem-perc').innerHTML = `<span class="badge badge-success font-bold">${formatarPerc(custeio.margemGlobalPerc)}</span>`;
  document.getElementById('custo-total-faturamento').innerText = formatarMoeda(custeio.faturamentoTotal);
  document.getElementById('custo-total-lucro-liquido').innerText = formatarMoeda(custeio.lucroLiquidoPeca);
}

function renderizarSimulador(peca, metricas) {
  const volCompra = Number.parseFloat(document.getElementById('input-volume-compra')?.value) || banco.volumeSimuladoKg;
  const custoKg = Number.parseFloat(document.getElementById('input-custo-simulado')?.value) || peca.custoKgEntrada;
  const custoTotalLote = arredondar(volCompra * custoKg, 2);
  const tbody = document.getElementById('corpo-tabela-estoque');
  tbody.innerHTML = '';

  let faturamentoTotal = 0;
  metricas.cortesConsolidados.forEach((c) => {
    const preco = peca.precosVendaSugeridos[c.nome] || 0;
    const pesoEstoque = arredondar((volCompra * c.rendimentoPerc) / 100, 3);
    const fat = arredondar(pesoEstoque * preco, 2);
    faturamentoTotal += fat;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${c.nome}</strong></td>
      <td class="text-right">${formatarPerc(c.rendimentoPerc)}</td>
      <td class="text-right font-bold">${formatarKg(pesoEstoque)}</td>
      <td class="text-right text-muted">${formatarMoeda(preco)}</td>
      <td class="text-right font-bold">${formatarMoeda(fat)}</td>
    `;
    tbody.appendChild(tr);
  });
  atualizarCardsSimulacao(volCompra, custoTotalLote, faturamentoTotal);
}

function atualizarCardsSimulacao(vol, custo, fat) {
  const lucro = arredondar(fat - custo, 2);
  const margem = fat > 0 ? arredondar((lucro / fat) * 100, 2) : 0;
  document.getElementById('sim-custo-total').innerText = formatarMoeda(custo);
  document.getElementById('sim-volume-kg').innerText = `Lote de ${formatarKg(vol)}`;
  document.getElementById('sim-faturamento-total').innerText = formatarMoeda(fat);
  document.getElementById('sim-lucro-total').innerText = formatarMoeda(lucro);
  document.getElementById('sim-margem-perc').innerText = `Margem Projetada: ${formatarPerc(margem)}`;
}

function renderizarHistorico(peca) {
  const tbody = document.getElementById('corpo-tabela-historico');
  const count = peca.historicoDesossas?.length || 0;
  document.getElementById('badge-historico-count').innerText = count;
  tbody.innerHTML = '';
  if (count === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted" style="padding:1.5rem;">Nenhum recebimento arquivado para esta peça.</td></tr>`;
    return;
  }
  peca.historicoDesossas.forEach((h, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${h.data}</strong></td>
      <td>${h.fornecedor || 'Padrão'}</td>
      <td class="text-center font-bold">${h.qtdPecas}</td>
      <td class="text-right font-bold">${formatarKg(h.pesoTotal)}</td>
      <td class="text-right text-muted">${formatarKg(h.pesoMedio)}</td>
      <td class="text-right">${gerarBadgeQuebra(h.quebraKg, h.quebraPerc)}</td>
      <td class="text-right font-bold text-success">${formatarMoeda(h.faturamentoEstimado)}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-secondary btn-carregar-hist" data-idx="${idx}" title="Carregar no lançador">Abrir</button>
        <button class="btn btn-sm btn-danger btn-excluir-hist" data-idx="${idx}" title="Excluir">✕</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function atualizarMetricasTopGeral(peca, metricas, custeio) {
  document.getElementById('metrica-qtd-pecas').innerText = `${peca.amostras.length} peças`;
  document.getElementById('metrica-peso-total').innerText = `Total: ${formatarKg(metricas.somaPesoTotal)}`;
  document.getElementById('metrica-quebra-total').innerText = formatarKg(metricas.quebraGlobalKg);
  document.getElementById('metrica-quebra-perc').innerText = `${formatarPerc(metricas.quebraGlobalPerc)} de perda global`;
  document.getElementById('metrica-produtividade').innerText = `${metricas.produtividadeKgHora} kg/h`;
  document.getElementById('metrica-tempo-medio').innerText = `Tempo médio: ${formatarSegundosEmTempo(metricas.tempoMedioSeg)}`;
  document.getElementById('metrica-lucro-peca').innerText = formatarMoeda(custeio.lucroLiquidoPeca);
  document.getElementById('metrica-margem-global').innerText = `Margem Geral: ${formatarPerc(custeio.margemGlobalPerc)}`;
}

function salvarNoLocalStorage() {
  try {
    localStorage.setItem('acougue_pro_multibi_v2', JSON.stringify(banco));
  } catch (e) {
    console.error('Erro LocalStorage:', e);
  }
}

function carregarDoLocalStorage() {
  try {
    const salvo = localStorage.getItem('acougue_pro_multibi_v2');
    if (salvo) Object.assign(banco, JSON.parse(salvo));
  } catch (e) {
    console.warn('Erro ao carregar LocalStorage:', e);
  }
}

function atualizarTela() {
  const peca = obterPecaAtiva();
  sincronizarCamposPecaAtiva(peca);
  renderizarSeletorPecas();
  const metricas = calcularMetricasPeca(peca);
  const custeio = calcularCusteioPecaChave(peca, metricas);
  atualizarMetricasTopGeral(peca, metricas, custeio);
  renderizarTabelaDesossa(peca, metricas);
  renderizarTabelaCusteio(peca, custeio);
  renderizarGraficosVisuais(peca, metricas, custeio);
  renderizarSimulador(peca, metricas);
  renderizarHistorico(peca);
  salvarNoLocalStorage();
}

function sincronizarCamposPecaAtiva(peca) {
  document.getElementById('input-custo-compra-kg').value = peca.custoKgEntrada;
  document.getElementById('input-margem-padrao-peca').value = peca.margemPadraoPerc;
  document.getElementById('input-custo-simulado').value = peca.custoKgEntrada;
  document.getElementById('check-custo-peca-chave').checked = peca.modoCusto !== 'livre';
}

function vincularEventosAbas() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
}

function vincularEventosPeca() {
  document.getElementById('select-peca').addEventListener('change', (e) => {
    banco.idPecaAtiva = e.target.value;
    atualizarTela();
  });
  document.getElementById('input-custo-compra-kg').addEventListener('input', (e) => {
    const peca = obterPecaAtiva();
    peca.custoKgEntrada = Number.parseFloat(e.target.value) || 0;
    document.getElementById('input-custo-simulado').value = peca.custoKgEntrada;
    atualizarTela();
  });
  document.getElementById('input-margem-padrao-peca').addEventListener('input', (e) => {
    const peca = obterPecaAtiva();
    peca.margemPadraoPerc = Number.parseFloat(e.target.value) || 0;
    atualizarTela();
  });
  document.getElementById('check-custo-peca-chave').addEventListener('change', (e) => {
    const peca = obterPecaAtiva();
    peca.modoCusto = e.target.checked ? 'peca_chave' : 'livre';
    atualizarTela();
  });
}

function vincularEventosAmostras() {
  document.getElementById('btn-add-amostra').addEventListener('click', () => {
    const peca = obterPecaAtiva();
    const num = peca.amostras.length + 1;
    peca.amostras.push({
      id: `amostra-${Date.now()}`,
      nome: `Peça ${num}`,
      pesoTotal: 40.0,
      tempo: '00:25:00',
      cortes: {}
    });
    atualizarTela();
  });
  document.getElementById('btn-remover-amostra').addEventListener('click', () => {
    const peca = obterPecaAtiva();
    if (peca.amostras.length > 1) {
      peca.amostras.pop();
      atualizarTela();
    } else {
      alert('É necessário manter ao menos 1 peça na amostragem.');
    }
  });
}

function vincularEventosTabelaDesossa() {
  const tbl = document.getElementById('tabela-desossa-dinamica');
  tbl.addEventListener('change', (e) => {
    const peca = obterPecaAtiva();
    if (e.target.classList.contains('input-amostra-peso')) {
      const idx = Number.parseInt(e.target.dataset.idx, 10);
      peca.amostras[idx].pesoTotal = avaliarExpressaoNumerica(e.target.value);
      atualizarTela();
    }
    if (e.target.classList.contains('input-amostra-tempo')) {
      const idx = Number.parseInt(e.target.dataset.idx, 10);
      peca.amostras[idx].tempo = e.target.value;
      atualizarTela();
    }
    if (e.target.classList.contains('input-corte-peso')) {
      const idx = Number.parseInt(e.target.dataset.idx, 10);
      const corte = e.target.dataset.corte;
      peca.amostras[idx].cortes[corte] = avaliarExpressaoNumerica(e.target.value);
      atualizarTela();
    }
  });
  tbl.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-remover-corte')) {
      removerCortePeca(e.target.dataset.corte);
    }
  });
}

function removerCortePeca(corteNome) {
  const peca = obterPecaAtiva();
  if (confirm(`Remover o rendimento/perda '${corteNome}' desta peça?`)) {
    peca.cortesCatalogo = (peca.cortesCatalogo || []).filter((c) => c.nome !== corteNome);
    peca.amostras.forEach((a) => delete a.cortes[corteNome]);
    delete peca.precosVendaSugeridos[corteNome];
    atualizarTela();
  }
}

function vincularEventosCusteio() {
  document.getElementById('corpo-tabela-custeio').addEventListener('input', (e) => {
    if (e.target.classList.contains('input-preco-venda-custeio')) {
      const peca = obterPecaAtiva();
      peca.precosVendaSugeridos[e.target.dataset.corte] = Number.parseFloat(e.target.value) || 0;
      atualizarTela();
    }
  });
  document.getElementById('btn-aplicar-margem-geral').addEventListener('click', () => {
    const peca = obterPecaAtiva();
    const margem = peca.margemPadraoPerc / 100;
    if (margem >= 1) return alert('A margem deve ser menor que 100%.');
    obterListaCortesPeca(peca).forEach((nome) => {
      const isSub = nome.toLowerCase().includes('osso') || nome.toLowerCase().includes('cebo') || nome.toLowerCase().includes('sangue');
      if (!isSub) {
        peca.precosVendaSugeridos[nome] = arredondar(peca.custoKgEntrada / (1 - margem), 2);
      }
    });
    atualizarTela();
    alert('Preços de venda atualizados com base na margem padrão!');
  });
}

function vincularEventosModais() {
  document.getElementById('btn-abrir-nova-peca').addEventListener('click', () => abrirModalPeca(false));
  document.getElementById('btn-editar-peca').addEventListener('click', () => abrirModalPeca(true));
  document.getElementById('btn-salvar-modal-peca').addEventListener('click', salvarModalPeca);
  document.getElementById('btn-excluir-peca').addEventListener('click', excluirPecaAtiva);
  document.getElementById('btn-novo-corte').addEventListener('click', abrirModalCorte);
  document.getElementById('btn-salvar-modal-corte').addEventListener('click', salvarModalCorte);
  document.getElementById('btn-gravar-historico-modal').addEventListener('click', abrirModalHistorico);
  document.getElementById('btn-confirmar-gravar-historico').addEventListener('click', confirmarGravarHistorico);
  document.querySelectorAll('.btn-fechar-modal').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach((m) => m.classList.remove('active'));
    });
  });
}

function abrirModalPeca(isEdicao) {
  const modal = document.getElementById('modal-peca');
  const titulo = document.getElementById('modal-peca-titulo');
  const inputNome = document.getElementById('modal-input-nome-peca');
  const inputCusto = document.getElementById('modal-input-custo-peca');
  const inputMargem = document.getElementById('modal-input-margem-peca');
  if (isEdicao) {
    const peca = obterPecaAtiva();
    titulo.innerText = 'Editar Peça Inteira';
    inputNome.value = peca.nome;
    inputCusto.value = peca.custoKgEntrada;
    inputMargem.value = peca.margemPadraoPerc;
    modal.dataset.edicao = 'true';
  } else {
    titulo.innerText = 'Cadastrar Nova Peça Inteira';
    inputNome.value = '';
    inputCusto.value = '25.00';
    inputMargem.value = '30.00';
    modal.dataset.edicao = 'false';
  }
  modal.classList.add('active');
}

function salvarModalPeca() {
  const modal = document.getElementById('modal-peca');
  const nome = document.getElementById('modal-input-nome-peca').value.trim();
  const custo = Number.parseFloat(document.getElementById('modal-input-custo-peca').value) || 0;
  const margem = Number.parseFloat(document.getElementById('modal-input-margem-peca').value) || 30;
  if (!nome) return alert('Informe o nome da peça.');

  if (modal.dataset.edicao === 'true') {
    const peca = obterPecaAtiva();
    peca.nome = nome;
    peca.custoKgEntrada = custo;
    peca.margemPadraoPerc = margem;
  } else {
    const id = `peca-${Date.now()}`;
    banco.pecas.push({
      id,
      nome,
      custoKgEntrada: custo,
      margemPadraoPerc: margem,
      modoCusto: 'peca_chave',
      cortesCatalogo: [{ nome: 'Cebo e Osso', tipo: 'subproduto', precoVendaPadrao: 1.48 }],
      amostras: [{ id: `amostra-${Date.now()}`, nome: 'Peça 1', pesoTotal: 40.0, tempo: '00:25:00', cortes: {} }],
      precosVendaSugeridos: { 'Cebo e Osso': 1.48 },
      historicoDesossas: []
    });
    banco.idPecaAtiva = id;
  }
  modal.classList.remove('active');
  atualizarTela();
}

function excluirPecaAtiva() {
  if (banco.pecas.length <= 1) return alert('Você não pode excluir a única peça do catálogo.');
  const peca = obterPecaAtiva();
  if (confirm(`Deseja realmente excluir a peça '${peca.nome}' e todas as suas análises?`)) {
    banco.pecas = banco.pecas.filter((p) => p.id !== peca.id);
    banco.idPecaAtiva = banco.pecas[0].id;
    atualizarTela();
  }
}

function abrirModalCorte() {
  document.getElementById('modal-input-nome-corte').value = '';
  document.getElementById('modal-input-preco-venda-corte').value = '25.00';
  document.getElementById('modal-corte').classList.add('active');
}

function salvarModalCorte() {
  const nome = document.getElementById('modal-input-nome-corte').value.trim();
  const tipo = document.getElementById('modal-select-tipo-corte').value;
  const preco = tipo === 'perda_liquida' ? 0 : (Number.parseFloat(document.getElementById('modal-input-preco-venda-corte').value) || 0);
  if (!nome) return alert('Informe o nome do corte.');
  const peca = obterPecaAtiva();
  if (!peca.cortesCatalogo.some((c) => c.nome.toLowerCase() === nome.toLowerCase())) {
    peca.cortesCatalogo.push({ nome, tipo, precoVendaPadrao: preco });
  }
  peca.precosVendaSugeridos[nome] = preco;
  document.getElementById('modal-corte').classList.remove('active');
  atualizarTela();
}

function abrirModalHistorico() {
  document.getElementById('modal-hist-fornecedor').value = '';
  document.getElementById('modal-hist-observacoes').value = '';
  document.getElementById('modal-historico').classList.add('active');
}

function confirmarGravarHistorico() {
  const peca = obterPecaAtiva();
  const metricas = calcularMetricasPeca(peca);
  const custeio = calcularCusteioPecaChave(peca, metricas);
  const forn = document.getElementById('modal-hist-fornecedor').value.trim() || 'Recebimento Padrão';
  const obs = document.getElementById('modal-hist-observacoes').value.trim();
  if (!peca.historicoDesossas) peca.historicoDesossas = [];
  peca.historicoDesossas.unshift({
    id: `hist-${Date.now()}`,
    data: new Date().toLocaleString('pt-BR'),
    fornecedor: forn,
    observacoes: obs,
    qtdPecas: peca.amostras.length,
    pesoTotal: metricas.somaPesoTotal,
    pesoMedio: metricas.pesoMedioPeca,
    quebraKg: metricas.quebraGlobalKg,
    quebraPerc: metricas.quebraGlobalPerc,
    faturamentoEstimado: custeio.faturamentoTotal,
    amostrasSnapshot: JSON.parse(JSON.stringify(peca.amostras))
  });
  document.getElementById('modal-historico').classList.remove('active');
  atualizarTela();
  alert('Desossa gravada com sucesso no histórico auditável!');
}

function vincularAcoesHistorico() {
  const tbody = document.getElementById('corpo-tabela-historico');
  tbody.addEventListener('click', (e) => {
    const peca = obterPecaAtiva();
    if (e.target.classList.contains('btn-carregar-hist')) {
      const idx = Number.parseInt(e.target.dataset.idx, 10);
      const reg = peca.historicoDesossas[idx];
      if (confirm(`Carregar os dados desta pesagem realizada em ${reg.data}?`)) {
        peca.amostras = JSON.parse(JSON.stringify(reg.amostrasSnapshot));
        atualizarTela();
        document.querySelector('.tab-btn[data-tab="tab-desossa"]').click();
      }
    }
    if (e.target.classList.contains('btn-excluir-hist')) {
      const idx = Number.parseInt(e.target.dataset.idx, 10);
      if (confirm('Excluir este registro do histórico?')) {
        peca.historicoDesossas.splice(idx, 1);
        atualizarTela();
      }
    }
  });
  document.getElementById('btn-limpar-historico').addEventListener('click', () => {
    const peca = obterPecaAtiva();
    if (confirm(`Limpar todo o histórico de recebimentos de ${peca.nome}?`)) {
      peca.historicoDesossas = [];
      atualizarTela();
    }
  });
}

function vincularAcoesGlobais() {
  document.getElementById('btn-atualizar-simulacao').addEventListener('click', () => {
    const peca = obterPecaAtiva();
    const metricas = calcularMetricasPeca(peca);
    renderizarSimulador(peca, metricas);
  });
  document.getElementById('btn-salvar-local').addEventListener('click', () => {
    salvarNoLocalStorage();
    alert('Dados salvos com sucesso!');
  });
  document.getElementById('btn-restaurar-exemplo').addEventListener('click', () => {
    if (confirm('Restaurar o catálogo e dados padrão iniciais?')) {
      banco.pecas = JSON.parse(JSON.stringify(PECAS_INICIAIS));
      banco.idPecaAtiva = 'dianteiro-bovino';
      atualizarTela();
    }
  });
  document.getElementById('btn-imprimir').addEventListener('click', () => window.print());
  document.getElementById('btn-exportar-json').addEventListener('click', exportarJSON);
  document.getElementById('input-importar-json').addEventListener('change', importarJSON);
}

function exportarJSON() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(banco, null, 2));
  const a = document.createElement('a');
  a.setAttribute('href', dataStr);
  a.setAttribute('download', `acougue_pro_catalogo_${Date.now()}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function importarJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const obj = JSON.parse(event.target.result);
      if (obj.pecas && Array.isArray(obj.pecas)) {
        Object.assign(banco, obj);
        atualizarTela();
        alert('Catálogo e histórico importados com sucesso!');
      }
    } catch (err) {
      alert('Erro ao importar arquivo JSON.');
    }
  };
  reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', () => {
  carregarDoLocalStorage();
  vincularEventosAbas();
  vincularEventosPeca();
  vincularEventosAmostras();
  vincularEventosTabelaDesossa();
  vincularEventosCusteio();
  vincularEventosModais();
  vincularAcoesHistorico();
  vincularAcoesGlobais();
  atualizarTela();
});
