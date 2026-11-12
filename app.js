/**
 * Açougue Pro - Interface do Usuário e Controladores de Tela
 * Padrão de Engenharia: Funções com no máximo 30 linhas e código defensivo
 */

const estado = {
  nomePeca: 'Dianteiro Bovino',
  custoKgEntrada: 21.45,
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
  precosVenda: {
    'Cebo e Osso': 1.50,
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
  volumeSimuladoKg: 1000,
  custoSimuladoKg: 21.45
};

const ESTADO_PADRAO = JSON.parse(JSON.stringify(estado));

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

function obterListaCortes() {
  const nomes = new Set();
  estado.amostras.forEach((a) => {
    Object.keys(a.cortes).forEach((nome) => nomes.add(nome));
  });
  return Array.from(nomes);
}

function processarAmostraIndividual(amostra, cortes, totaisCortes) {
  let somaCortes = 0;
  cortes.forEach((nome) => {
    const peso = amostra.cortes[nome] || 0;
    somaCortes += peso;
    totaisCortes[nome] = (totaisCortes[nome] || 0) + peso;
  });
  const quebraKg = arredondar(amostra.pesoTotal - somaCortes, 3);
  const quebraPerc = amostra.pesoTotal > 0 ? arredondar((quebraKg / amostra.pesoTotal) * 100, 2) : 0;
  const seg = parseTempoEmSegundos(amostra.tempo);
  return { ...amostra, somaCortes, quebraKg, quebraPerc, tempoSegundos: seg };
}

function calcularMetricasGlobais() {
  const cortes = obterListaCortes();
  const totaisCortes = {};
  cortes.forEach((c) => { totaisCortes[c] = 0; });

  let somaPesoTotal = 0;
  let somaTempoSegundos = 0;

  const detalhesAmostras = estado.amostras.map((a) => {
    somaPesoTotal += a.pesoTotal;
    const processada = processarAmostraIndividual(a, cortes, totaisCortes);
    somaTempoSegundos += processada.tempoSegundos;
    return processada;
  });

  return consolidarMetricasAmostras(cortes, totaisCortes, detalhesAmostras, somaPesoTotal, somaTempoSegundos);
}

function consolidarMetricasAmostras(cortes, totaisCortes, detalhesAmostras, somaPeso, somaTempo) {
  const qtd = estado.amostras.length || 1;
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

function calcularCustosERentabilidade(metricas) {
  const pesoBase = metricas.pesoMedioPeca;
  const custoTotalPeca = arredondar(pesoBase * estado.custoKgEntrada, 2);

  const cortesComPreco = metricas.cortesConsolidados.map((c) => {
    const precoVenda = estado.precosVenda[c.nome] || 0;
    const pesoEstimado = arredondar((pesoBase * c.rendimentoPerc) / 100, 3);
    const faturamento = arredondar(pesoEstimado * precoVenda, 2);
    return { ...c, pesoEstimado, precoVenda, faturamento };
  });

  const faturamentoTotalPeca = arredondar(cortesComPreco.reduce((acc, c) => acc + c.faturamento, 0), 2);
  const lucroBrutoPeca = arredondar(faturamentoTotalPeca - custoTotalPeca, 2);
  const margemGlobalPerc = faturamentoTotalPeca > 0 ? arredondar((lucroBrutoPeca / faturamentoTotalPeca) * 100, 2) : 0;
  const fatorCusto = 1 - (margemGlobalPerc / 100);

  const cortesFinalizados = cortesComPreco.map((c) => ({
    ...c,
    custoRealKg: arredondar(c.precoVenda * fatorCusto, 2),
    lucroKg: arredondar(c.precoVenda - (c.precoVenda * fatorCusto), 2),
    margemPerc: c.precoVenda > 0 ? arredondar(((c.precoVenda - (c.precoVenda * fatorCusto)) / c.precoVenda) * 100, 2) : 0
  }));

  return { custoTotalPeca, faturamentoTotalPeca, lucroBrutoPeca, margemGlobalPerc, cortes: cortesFinalizados };
}

function gerarBadgeQuebra(quebraKg, quebraPerc) {
  if (quebraKg < 0) {
    return `<span class="badge badge-danger">⚠️ +${formatarKg(Math.abs(quebraKg))} (${quebraPerc}%)</span>`;
  }
  if (quebraPerc <= 0.5) {
    return `<span class="badge badge-success">✓ ${formatarKg(quebraKg)} (${quebraPerc}%)</span>`;
  }
  if (quebraPerc <= 1.5) {
    return `<span class="badge badge-warning">! ${formatarKg(quebraKg)} (${quebraPerc}%)</span>`;
  }
  return `<span class="badge badge-danger">⚠️ ${formatarKg(quebraKg)} (${quebraPerc}%)</span>`;
}

function criarLinhaLancamento(corte) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><strong>${corte.nome}</strong></td>
    <td class="text-center">
      <input type="text" class="form-input form-input-calc input-corte-peso" data-amostra="0" data-corte="${corte.nome}"
             value="${estado.amostras[0]?.cortes[corte.nome] ?? ''}" style="width: 100px; text-align:right;">
    </td>
    <td class="text-center">
      <input type="text" class="form-input form-input-calc input-corte-peso" data-amostra="1" data-corte="${corte.nome}"
             value="${estado.amostras[1]?.cortes[corte.nome] ?? ''}" style="width: 100px; text-align:right;">
    </td>
    <td class="text-center">
      <input type="text" class="form-input form-input-calc input-corte-peso" data-amostra="2" data-corte="${corte.nome}"
             value="${estado.amostras[2]?.cortes[corte.nome] ?? ''}" style="width: 100px; text-align:right;">
    </td>
    <td class="text-right font-bold">${formatarKg(corte.pesoMedio)}</td>
    <td class="text-right"><span class="badge badge-neutral font-bold">${formatarPerc(corte.rendimentoPerc)}</span></td>
    <td class="text-center">
      <button class="btn btn-sm btn-secondary btn-remover-corte" data-corte="${corte.nome}" title="Excluir" style="padding:2px 6px; color:#b91c1c;">✕</button>
    </td>
  `;
  return tr;
}

function renderizarTabelaLancamento(metricas) {
  const tbody = document.getElementById('corpo-tabela-cortes');
  tbody.innerHTML = '';
  metricas.cortesConsolidados.forEach((c) => tbody.appendChild(criarLinhaLancamento(c)));
  atualizarRodapeLancamento(metricas);
}

function atualizarRodapeLancamento(metricas) {
  metricas.detalhesAmostras.forEach((det, i) => {
    document.getElementById(`soma-cortes-amostra-${i}`).innerText = formatarKg(det.somaCortes);
    document.getElementById(`quebra-amostra-${i}`).innerHTML = gerarBadgeQuebra(det.quebraKg, det.quebraPerc);
  });
  const somaCortesMedia = arredondar(metricas.cortesConsolidados.reduce((acc, c) => acc + c.pesoMedio, 0), 3);
  const somaRendimentoPerc = arredondar(metricas.cortesConsolidados.reduce((acc, c) => acc + c.rendimentoPerc, 0), 2);
  document.getElementById('soma-cortes-media').innerText = formatarKg(somaCortesMedia);
  document.getElementById('soma-cortes-rend-perc').innerText = formatarPerc(somaRendimentoPerc);
  document.getElementById('quebra-media-kg').innerText = formatarKg(metricas.quebraGlobalKg / (estado.amostras.length || 1));
  document.getElementById('quebra-media-perc').innerHTML = gerarBadgeQuebra(metricas.quebraGlobalKg, metricas.quebraGlobalPerc);
}

function criarLinhaPrecificacao(corte) {
  const tr = document.createElement('tr');
  const isSub = corte.nome.toLowerCase().includes('osso') || corte.nome.toLowerCase().includes('cebo') || corte.nome.toLowerCase().includes('sebo');
  tr.innerHTML = `
    <td><strong>${corte.nome}</strong>${isSub ? '<span class="badge badge-neutral" style="margin-left:6px; font-size:0.7rem;">Subproduto</span>' : ''}</td>
    <td class="text-right">${formatarPerc(corte.rendimentoPerc)}</td>
    <td class="text-right text-muted">${formatarKg(corte.pesoEstimado)}</td>
    <td class="text-right">
      <div style="display:inline-flex; align-items:center; gap:4px;">
        <span style="font-size:0.8rem; color:var(--text-muted);">R$</span>
        <input type="number" step="0.10" class="form-input input-preco-venda" data-corte="${corte.nome}"
               value="${corte.precoVenda}" style="width: 85px; text-align:right; font-weight:700;">
      </div>
    </td>
    <td class="text-right font-bold" style="background:#fef3c7; color:var(--primary);">${formatarMoeda(corte.custoRealKg)}</td>
    <td class="text-right font-bold ${corte.lucroKg >= 0 ? 'text-success' : 'text-danger'}">${formatarMoeda(corte.lucroKg)}</td>
    <td class="text-right">
      <span class="badge ${corte.margemPerc >= 20 ? 'badge-success' : (corte.margemPerc > 0 ? 'badge-warning' : 'badge-danger')}">
        ${formatarPerc(corte.margemPerc)}
      </span>
    </td>
    <td class="text-right font-bold">${formatarMoeda(corte.faturamento)}</td>
  `;
  return tr;
}

function renderizarTabelaPrecificacao(custos) {
  const tbody = document.getElementById('corpo-tabela-precificacao');
  tbody.innerHTML = '';
  custos.cortes.forEach((c) => tbody.appendChild(criarLinhaPrecificacao(c)));
  atualizarTotaisPrecificacao(custos);
}

function atualizarTotaisPrecificacao(custos) {
  const somaRend = arredondar(custos.cortes.reduce((acc, c) => acc + c.rendimentoPerc, 0), 2);
  const somaPeso = arredondar(custos.cortes.reduce((acc, c) => acc + c.pesoEstimado, 0), 3);
  document.getElementById('total-rend-prec').innerText = formatarPerc(somaRend);
  document.getElementById('total-peso-prec').innerText = formatarKg(somaPeso);
  document.getElementById('total-custo-peca').innerText = formatarMoeda(custos.custoTotalPeca);
  document.getElementById('total-lucro-peca').innerText = formatarMoeda(custos.lucroBrutoPeca);
  document.getElementById('total-margem-peca').innerHTML = `<span class="badge badge-success font-bold">${formatarPerc(custos.margemGlobalPerc)}</span>`;
  document.getElementById('total-faturamento-peca').innerText = formatarMoeda(custos.faturamentoTotalPeca);
}

function renderizarSimuladorEstoque(metricas, custos) {
  const volCompra = Number.parseFloat(document.getElementById('input-volume-compra')?.value) || estado.volumeSimuladoKg;
  const custoKg = Number.parseFloat(document.getElementById('input-custo-simulado')?.value) || estado.custoSimuladoKg;
  const custoTotalLote = arredondar(volCompra * custoKg, 2);
  const tbody = document.getElementById('corpo-tabela-estoque');
  tbody.innerHTML = '';

  let faturamentoTotalLote = 0;
  metricas.cortesConsolidados.forEach((corte) => {
    const precoVenda = estado.precosVenda[corte.nome] || 0;
    const pesoEstoqueKg = arredondar((volCompra * corte.rendimentoPerc) / 100, 3);
    const faturamento = arredondar(pesoEstoqueKg * precoVenda, 2);
    faturamentoTotalLote += faturamento;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${corte.nome}</strong></td>
      <td class="text-right">${formatarPerc(corte.rendimentoPerc)}</td>
      <td class="text-right font-bold" style="color:var(--secondary);">${formatarKg(pesoEstoqueKg)}</td>
      <td class="text-right text-muted">${formatarMoeda(precoVenda)}</td>
      <td class="text-right font-bold">${formatarMoeda(faturamento)}</td>
    `;
    tbody.appendChild(tr);
  });
  atualizarCardsSimulacao(volCompra, custoTotalLote, faturamentoTotalLote);
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

function atualizarMetricasTop(metricas, custos) {
  document.getElementById('metrica-peso-total').innerText = formatarKg(metricas.somaPesoTotal);
  document.getElementById('metrica-peso-medio').innerText = `Média: ${formatarKg(metricas.pesoMedioPeca)} / peça`;
  document.getElementById('metrica-quebra-total').innerText = formatarKg(metricas.quebraGlobalKg);
  document.getElementById('metrica-quebra-perc').innerText = `${formatarPerc(metricas.quebraGlobalPerc)} de perda global`;
  document.getElementById('metrica-produtividade').innerText = `${metricas.produtividadeKgHora} kg/h`;
  document.getElementById('metrica-tempo-medio').innerText = `Tempo médio: ${formatarSegundosEmTempo(metricas.tempoMedioSeg)}`;
  document.getElementById('metrica-margem-global').innerText = formatarPerc(custos.margemGlobalPerc);
  document.getElementById('metrica-faturamento-medio').innerText = `Faturamento: ${formatarMoeda(custos.faturamentoTotalPeca)} / peça`;
}

function salvarNoLocalStorageSilencioso() {
  try {
    localStorage.setItem('acougue_pro_estado_v1', JSON.stringify(estado));
  } catch (e) {
    console.error('Erro ao salvar LocalStorage:', e);
  }
}

function carregarDoLocalStorage() {
  try {
    const salvo = localStorage.getItem('acougue_pro_estado_v1');
    if (salvo) Object.assign(estado, JSON.parse(salvo));
  } catch (e) {
    console.warn('Erro ao carregar LocalStorage:', e);
  }
}

function atualizarTela() {
  const metricas = calcularMetricasGlobais();
  const custos = calcularCustosERentabilidade(metricas);
  atualizarMetricasTop(metricas, custos);
  renderizarTabelaLancamento(metricas);
  renderizarTabelaPrecificacao(custos);
  renderizarSimuladorEstoque(metricas, custos);
  salvarNoLocalStorageSilencioso();
}

function vincularEventosConfiguracao() {
  document.getElementById('input-nome-peca').addEventListener('input', (e) => { estado.nomePeca = e.target.value; });
  document.getElementById('input-custo-compra-kg').addEventListener('input', (e) => {
    estado.custoKgEntrada = Number.parseFloat(e.target.value) || 0;
    document.getElementById('input-custo-simulado').value = estado.custoKgEntrada;
    atualizarTela();
  });
  for (let i = 0; i < 3; i++) {
    document.getElementById(`peso-total-amostra-${i}`)?.addEventListener('change', (e) => {
      estado.amostras[i].pesoTotal = avaliarExpressaoNumerica(e.target.value);
      e.target.value = estado.amostras[i].pesoTotal;
      atualizarTela();
    });
    document.getElementById(`tempo-amostra-${i}`)?.addEventListener('change', (e) => {
      estado.amostras[i].tempo = e.target.value;
      atualizarTela();
    });
  }
}

function vincularEventosTabela() {
  document.getElementById('corpo-tabela-cortes').addEventListener('change', (e) => {
    if (e.target.classList.contains('input-corte-peso')) {
      const idx = Number.parseInt(e.target.dataset.amostra, 10);
      const corte = e.target.dataset.corte;
      const v = avaliarExpressaoNumerica(e.target.value);
      estado.amostras[idx].cortes[corte] = v;
      e.target.value = v;
      atualizarTela();
    }
  });
  document.getElementById('corpo-tabela-cortes').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-remover-corte')) {
      const corte = e.target.dataset.corte;
      if (confirm(`Remover corte '${corte}'?`)) {
        estado.amostras.forEach((a) => delete a.cortes[corte]);
        delete estado.precosVenda[corte];
        atualizarTela();
      }
    }
  });
  document.getElementById('corpo-tabela-precificacao').addEventListener('input', (e) => {
    if (e.target.classList.contains('input-preco-venda')) {
      estado.precosVenda[e.target.dataset.corte] = Number.parseFloat(e.target.value) || 0;
      atualizarTela();
    }
  });
}

function vincularEventosAcoes() {
  document.getElementById('btn-atualizar-simulacao').addEventListener('click', () => {
    const metricas = calcularMetricasGlobais();
    const custos = calcularCustosERentabilidade(metricas);
    renderizarSimuladorEstoque(metricas, custos);
  });
  document.getElementById('btn-novo-corte').addEventListener('click', () => {
    const nome = prompt('Nome do novo corte:');
    if (nome && nome.trim()) {
      const n = nome.trim();
      estado.amostras.forEach((a) => { if (a.cortes[n] === undefined) a.cortes[n] = 0; });
      if (estado.precosVenda[n] === undefined) estado.precosVenda[n] = 25.00;
      atualizarTela();
    }
  });
  document.getElementById('btn-restaurar-exemplo').addEventListener('click', () => {
    if (confirm('Restaurar dados originais do Dianteiro?')) {
      Object.assign(estado, JSON.parse(JSON.stringify(ESTADO_PADRAO)));
      sincronizarCamposIniciais();
      atualizarTela();
    }
  });
  document.getElementById('btn-salvar-local').addEventListener('click', () => {
    salvarNoLocalStorageSilencioso();
    alert('Análise salva com sucesso!');
  });
  document.getElementById('btn-imprimir').addEventListener('click', () => window.print());
  document.getElementById('btn-exportar-json').addEventListener('click', exportarJSON);
  document.getElementById('input-importar-json').addEventListener('change', importarJSON);
}

function exportarJSON() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(estado, null, 2));
  const a = document.createElement('a');
  a.setAttribute('href', dataStr);
  a.setAttribute('download', `desossa_${estado.nomePeca.toLowerCase().replace(/\s+/g, '_')}.json`);
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
      if (obj.amostras && obj.custoKgEntrada) {
        Object.assign(estado, obj);
        sincronizarCamposIniciais();
        atualizarTela();
      }
    } catch (err) {
      alert('Erro ao importar JSON.');
    }
  };
  reader.readAsText(file);
}

function sincronizarCamposIniciais() {
  document.getElementById('input-nome-peca').value = estado.nomePeca;
  document.getElementById('input-custo-compra-kg').value = estado.custoKgEntrada;
  document.getElementById('input-custo-simulado').value = estado.custoKgEntrada;
  estado.amostras.forEach((a, i) => {
    const inputPeso = document.getElementById(`peso-total-amostra-${i}`);
    const inputTempo = document.getElementById(`tempo-amostra-${i}`);
    if (inputPeso) inputPeso.value = a.pesoTotal;
    if (inputTempo) inputTempo.value = a.tempo;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  carregarDoLocalStorage();
  sincronizarCamposIniciais();
  vincularEventosConfiguracao();
  vincularEventosTabela();
  vincularEventosAcoes();
  atualizarTela();
});
