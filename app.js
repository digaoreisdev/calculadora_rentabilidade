/**
 * Açougue Pro - Controlador de Interface e Gestão Multi-Peças
 * Padrão de Engenharia: Funções <= 30 linhas, código defensivo e modal próprio de confirmação
 */

const PECAS_INICIAIS = [
  {
    id: 'dianteiro-bovino',
    nome: 'Dianteiro Bovino',
    custoKgEntrada: 21.45,
    margemPadraoPerc: 30.0,
    modoCusto: 'peca_chave',
    modoMargem: 'individual',
    cortesCatalogo: [
      { nome: 'Dianteiro Bovino (Corte Principal / Balcão)', tipo: 'nobre', precoVendaPadrao: 32.90 },
      { nome: 'Cebo e Osso', tipo: 'subproduto', precoVendaPadrao: 1.48 },
      { nome: 'Sangue e Líquidos', tipo: 'perda_liquida', precoVendaPadrao: 0.00 },
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
        nome: 'Transformação/Limpeza 1 (43,4 kg)',
        pesoTotal: 43.396,
        tempo: '00:27:02',
        cortes: {
          'Dianteiro Bovino (Corte Principal / Balcão)': 0.000,
          'Cebo e Osso': 8.318,
          'Sangue e Líquidos': 0.000,
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
        nome: 'Transformação/Limpeza 2 (44,3 kg)',
        pesoTotal: 44.338,
        tempo: '00:25:35',
        cortes: {
          'Dianteiro Bovino (Corte Principal / Balcão)': 0.000,
          'Cebo e Osso': 8.862,
          'Sangue e Líquidos': 0.000,
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
        nome: 'Transformação/Limpeza 3 (32,2 kg)',
        pesoTotal: 32.178,
        tempo: '00:23:15',
        cortes: {
          'Dianteiro Bovino (Corte Principal / Balcão)': 0.000,
          'Cebo e Osso': 4.874,
          'Sangue e Líquidos': 0.000,
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
      'Dianteiro Bovino (Corte Principal / Balcão)': 32.90,
      'Cebo e Osso': 1.48,
      'Sangue e Líquidos': 0.00,
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
    custosSistema: {
      'Dianteiro Bovino (Corte Principal / Balcão)': 21.45,
      'Cebo e Osso': 1.48,
      'Sangue e Líquidos': 0.00,
      'Agulha C/ Osso': 18.50,
      'Agulha S/ Osso': 24.00,
      'Agulha Especial': 27.00,
      'Costela Dianteiro': 17.50,
      'Paleta C/ Sete': 20.00,
      'Paleta Osso Redondo': 19.50,
      'Paleta S/ Osso': 25.00,
      'Peito Costela': 18.50,
      'Músculo': 24.50,
      'Moída de Primeira': 26.00,
      'Moída de Segunda': 19.50
    },
    historicoDesossas: []
  },
  {
    id: 'patinho-bovino',
    nome: 'Patinho Bovino',
    custoKgEntrada: 28.50,
    margemPadraoPerc: 30.0,
    modoCusto: 'peca_chave',
    modoMargem: 'individual',
    cortesCatalogo: [
      { nome: '1285 - Patinho Bovino (Corte Principal / Balcão)', tipo: 'nobre', precoVendaPadrao: 42.90 },
      { nome: 'Cebo e Osso', tipo: 'subproduto', precoVendaPadrao: 1.48 },
      { nome: 'Sangue e Líquidos', tipo: 'perda_liquida', precoVendaPadrao: 0.00 },
      { nome: '1274 - Moida Bovina de Primeira', tipo: 'nobre', precoVendaPadrao: 37.90 },
      { nome: '12745 - Moida Bovina de Segunda', tipo: 'comum', precoVendaPadrao: 26.90 }
    ],
    amostras: [
      {
        id: 'amostra-patinho-1',
        nome: 'Transformação/Limpeza 1 (5,658 kg)',
        pesoTotal: 5.658,
        tempo: '00:03:46',
        cortes: {
          '1285 - Patinho Bovino (Corte Principal / Balcão)': 5.040,
          'Cebo e Osso': 0.146,
          'Sangue e Líquidos': 0.116,
          '1274 - Moida Bovina de Primeira': 0.140,
          '12745 - Moida Bovina de Segunda': 0.204
        }
      },
      {
        id: 'amostra-patinho-2',
        nome: 'Transformação/Limpeza 2 (4,334 kg)',
        pesoTotal: 4.334,
        tempo: '00:03:32',
        cortes: {
          '1285 - Patinho Bovino (Corte Principal / Balcão)': 3.614,
          'Cebo e Osso': 0.094,
          'Sangue e Líquidos': 0.150,
          '1274 - Moida Bovina de Primeira': 0.222,
          '12745 - Moida Bovina de Segunda': 0.232
        }
      },
      {
        id: 'amostra-patinho-3',
        nome: 'Transformação/Limpeza 3 (5,472 kg)',
        pesoTotal: 5.472,
        tempo: '00:03:54',
        cortes: {
          '1285 - Patinho Bovino (Corte Principal / Balcão)': 4.502,
          'Cebo e Osso': 0.124,
          'Sangue e Líquidos': 0.180,
          '1274 - Moida Bovina de Primeira': 0.380,
          '12745 - Moida Bovina de Segunda': 0.264
        }
      }
    ],
    precosVendaSugeridos: {
      '1285 - Patinho Bovino (Corte Principal / Balcão)': 42.90,
      'Cebo e Osso': 1.48,
      'Sangue e Líquidos': 0.00,
      '1274 - Moida Bovina de Primeira': 37.90,
      '12745 - Moida Bovina de Segunda': 26.90
    },
    custosSistema: {
      '1285 - Patinho Bovino (Corte Principal / Balcão)': 28.50,
      'Cebo e Osso': 1.48,
      'Sangue e Líquidos': 0.00,
      '1274 - Moida Bovina de Primeira': 27.23,
      '12745 - Moida Bovina de Segunda': 20.00
    },
    historicoDesossas: []
  },
  {
    id: 'alcatra-inteira',
    nome: '1241 - Alcatra Bovina Completa',
    custoKgEntrada: 37.78,
    margemPadraoPerc: 23.88,
    modoCusto: 'peca_chave',
    modoMargem: 'individual',
    cortesCatalogo: [
      { nome: '1241 - Alcatra Bovina (Corte Principal / Balcão)', tipo: 'nobre', precoVendaPadrao: 49.90 },
      { nome: 'Cebo de Perda', tipo: 'subproduto', precoVendaPadrao: 1.48 },
      { nome: 'Sangue e Líquidos de Perda', tipo: 'perda_liquida', precoVendaPadrao: 0.00 },
      { nome: '1274 - Moida Bovina de Primeira', tipo: 'nobre', precoVendaPadrao: 47.99 },
      { nome: '1275 - Moida Bovina de Segunda', tipo: 'comum', precoVendaPadrao: 27.49 }
    ],
    amostras: [
      {
        id: 'amostra-alcatra-1',
        nome: 'Transformação/Limpeza 1 (4,316 kg)',
        pesoTotal: 4.316,
        tempo: '00:03:58',
        cortes: {
          '1241 - Alcatra Bovina (Corte Principal / Balcão)': 3.450,
          'Cebo de Perda': 0.250,
          'Sangue e Líquidos de Perda': 0.136,
          '1274 - Moida Bovina de Primeira': 0.192,
          '1275 - Moida Bovina de Segunda': 0.288
        }
      },
      {
        id: 'amostra-alcatra-2',
        nome: 'Transformação/Limpeza 2 (3,762 kg)',
        pesoTotal: 3.762,
        tempo: '00:03:31',
        cortes: {
          '1241 - Alcatra Bovina (Corte Principal / Balcão)': 2.980,
          'Cebo de Perda': 0.114,
          'Sangue e Líquidos de Perda': 0.206,
          '1274 - Moida Bovina de Primeira': 0.228,
          '1275 - Moida Bovina de Segunda': 0.234
        }
      },
      {
        id: 'amostra-alcatra-3',
        nome: 'Transformação/Limpeza 3 (3,564 kg)',
        pesoTotal: 3.564,
        tempo: '00:03:16',
        cortes: {
          '1241 - Alcatra Bovina (Corte Principal / Balcão)': 3.068,
          'Cebo de Perda': 0.072,
          'Sangue e Líquidos de Perda': 0.176,
          '1274 - Moida Bovina de Primeira': 0.114,
          '1275 - Moida Bovina de Segunda': 0.134
        }
      }
    ],
    precosVendaSugeridos: {
      '1241 - Alcatra Bovina (Corte Principal / Balcão)': 49.90,
      'Cebo de Perda': 1.48,
      'Sangue e Líquidos de Perda': 0.00,
      '1274 - Moida Bovina de Primeira': 47.99,
      '1275 - Moida Bovina de Segunda': 27.49
    },
    custosSistema: {
      '1241 - Alcatra Bovina (Corte Principal / Balcão)': 37.78,
      'Cebo de Perda': 1.04,
      'Sangue e Líquidos de Perda': 0.00,
      '1274 - Moida Bovina de Primeira': 27.23,
      '1275 - Moida Bovina de Segunda': 24.51
    },
    historicoDesossas: []
  }
];

const banco = {
  pecas: JSON.parse(JSON.stringify(PECAS_INICIAIS)),
  idPecaAtiva: 'patinho-bovino',
  amostraSelecionadaId: null,
  volumeSimuladoKg: 1000,
  custoSimuladoKg: 21.45
};

let callbackConfirmacao = null;

function solicitarConfirmacao(msg, onConfirm, titulo = 'Confirmar Exclusão') {
  const modal = document.getElementById('modal-confirmacao');
  if (!modal) {
    if (confirm(msg)) onConfirm();
    return;
  }
  document.getElementById('modal-confirma-titulo').innerText = titulo;
  document.getElementById('modal-confirma-mensagem').innerText = msg;
  callbackConfirmacao = onConfirm;
  modal.classList.add('active');
}

function exibirToast(mensagem, tipo = 'info', duracao = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  const icones = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const icon = icones[tipo] || 'ℹ️';
  toast.innerHTML = `<span style="font-size:1.15rem;">${icon}</span><span style="flex:1;">${mensagem}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-closing');
    setTimeout(() => toast.remove(), 300);
  }, duracao);
}

function parseValorMonetario(v) {
  if (typeof v === 'number') return Math.max(0, v);
  if (!v || typeof v !== 'string') return 0;
  const limpa = v.replace(/[^\d.,]/g, '').trim();
  if (!limpa) return 0;
  if (limpa.includes('.') && limpa.includes(',')) return Number.parseFloat(limpa.replace(/\./g, '').replace(',', '.')) || 0;
  if (limpa.includes(',')) return Number.parseFloat(limpa.replace(',', '.')) || 0;
  return Number.parseFloat(limpa) || 0;
}

function parseValorPercentual(v) {
  if (typeof v === 'number') return Math.max(0, v);
  if (!v || typeof v !== 'string') return 0;
  const limpa = v.replace(/[^\d.,]/g, '').trim();
  if (!limpa) return 0;
  return Number.parseFloat(limpa.replace(',', '.')) || 0;
}

function formatarNumeroBR(v, casas = 2) {
  return Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
}

function formatarKgValor(v) {
  if (v === undefined || v === null || v === '') return '0,000';
  const num = typeof v === 'number' ? v : (Number.parseFloat(String(v).replace(',', '.')) || 0);
  return arredondar(Math.max(0, num), 3).toLocaleString('pt-BR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  });
}

function obterPecaAtiva() {
  if (!banco.pecas || banco.pecas.length === 0) return null;
  return banco.pecas.find((item) => item.id === banco.idPecaAtiva) || banco.pecas[0] || null;
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

function garantirCortesEssenciais(peca) {
  const nomePrincipal = `${peca.nome} (Corte Principal / Balcão)`;
  const temPrincipal = peca.cortesCatalogo.some((c) => c.nome.toLowerCase().includes('corte principal') || c.nome.toLowerCase().includes('balcão') || c.nome.toLowerCase().includes('limpo'));
  if (!temPrincipal) {
    peca.cortesCatalogo.unshift({ nome: nomePrincipal, tipo: 'nobre', precoVendaPadrao: arredondar(peca.custoKgEntrada * 1.4, 2), custoAtualSistema: peca.custoKgEntrada, margemAtualSistema: peca.margemPadraoPerc });
  }
  const temCebo = peca.cortesCatalogo.some((c) => c.nome.toLowerCase().includes('cebo') || c.nome.toLowerCase().includes('sebo'));
  if (!temCebo) {
    peca.cortesCatalogo.push({ nome: 'Cebo e Osso', tipo: 'subproduto', precoVendaPadrao: 1.48, custoAtualSistema: 1.48, margemAtualSistema: 0 });
  }
  const temLiquidos = peca.cortesCatalogo.some((c) => c.nome.toLowerCase().includes('sangue') || c.nome.toLowerCase().includes('líquido') || c.nome.toLowerCase().includes('liquido'));
  if (!temLiquidos) {
    peca.cortesCatalogo.push({ nome: 'Sangue e Líquidos', tipo: 'perda_liquida', precoVendaPadrao: 0.00, custoAtualSistema: 0, margemAtualSistema: -100 });
  }
}

function sincronizarCortesPeca(peca) {
  if (!peca) return [];
  if (!peca.cortesCatalogo) peca.cortesCatalogo = [];
  if (!peca.amostras) peca.amostras = [];
  garantirCortesEssenciais(peca);

  peca.amostras.forEach((a) => {
    Object.keys(a.cortes || {}).forEach((k) => {
      if (!peca.cortesCatalogo.some((c) => c.nome.toLowerCase() === k.toLowerCase())) {
        peca.cortesCatalogo.push({ nome: k, tipo: 'comum', precoVendaPadrao: 25.00, custoAtualSistema: peca.custoKgEntrada, margemAtualSistema: peca.margemPadraoPerc });
      }
    });
    if (!a.cortes) a.cortes = {};
    peca.cortesCatalogo.forEach((c) => {
      if (a.cortes[c.nome] === undefined) a.cortes[c.nome] = 0;
    });
  });

  return peca.cortesCatalogo.map((c) => c.nome);
}

function obterListaCortesPeca(peca) {
  return sincronizarCortesPeca(peca);
}

function calcularMetricasPeca(peca) {
  const cortes = sincronizarCortesPeca(peca);
  const totaisCortes = {};
  cortes.forEach((c) => { totaisCortes[c] = 0; });
  let somaPesoTotal = 0, somaTempoSegundos = 0;

  const detalhesAmostras = (peca.amostras || []).map((a, idx) => {
    const pesoTotal = Number(a.pesoTotal) || 0;
    somaPesoTotal += pesoTotal;
    const seg = parseTempoEmSegundos(a.tempo);
    somaTempoSegundos += seg;
    let somaCortes = 0;
    cortes.forEach((nome) => {
      const p = Number(a.cortes?.[nome]) || 0;
      somaCortes += p;
      totaisCortes[nome] += p;
    });
    somaCortes = arredondar(somaCortes, 3);
    const quebraKg = pesoTotal >= somaCortes ? arredondar(pesoTotal - somaCortes, 3) : 0;
    const quebraPerc = pesoTotal > 0 ? arredondar((quebraKg / pesoTotal) * 100, 2) : 0;
    const excessoKg = somaCortes > pesoTotal ? arredondar(somaCortes - pesoTotal, 3) : 0;
    return { ...a, idx, pesoTotal, somaCortes, quebraKg, quebraPerc, excessoKg, tempoSegundos: seg };
  });

  return consolidarMetricasFinais(peca, cortes, totaisCortes, detalhesAmostras, somaPesoTotal, somaTempoSegundos);
}

function consolidarMetricasFinais(peca, cortes, totaisCortes, detalhesAmostras, somaPeso, somaTempo) {
  const qtd = peca.amostras.length || 1;
  const pesoMedioPeca = arredondar(somaPeso / qtd, 3);
  const tempoMedioSeg = Math.round(somaTempo / qtd);
  const produtividadeKgHora = somaTempo > 0 ? arredondar(somaPeso / (somaTempo / 3600), 2) : 0;

  const cortesConsolidados = cortes.map((nome) => ({
    nome,
    pesoTotal: arredondar(totaisCortes[nome] || 0, 3),
    pesoMedio: arredondar((totaisCortes[nome] || 0) / qtd, 3),
    rendimentoPerc: somaPeso > 0 ? arredondar(((totaisCortes[nome] || 0) / somaPeso) * 100, 2) : 0,
    tipo: peca.cortesCatalogo?.find((c) => c.nome === nome)?.tipo || 'comum',
    isAuto: false
  }));

  const somaPerdaTecnicaKg = arredondar(detalhesAmostras.reduce((acc, d) => acc + d.quebraKg, 0), 3);
  const rendPerdaTecnicaPerc = somaPeso > 0 ? arredondar((somaPerdaTecnicaKg / somaPeso) * 100, 2) : 0;

  cortesConsolidados.push({
    nome: 'Perda Técnica (Manejo / Serra)',
    pesoTotal: somaPerdaTecnicaKg,
    pesoMedio: arredondar(somaPerdaTecnicaKg / qtd, 3),
    rendimentoPerc: rendPerdaTecnicaPerc,
    tipo: 'perda_tecnica',
    isAuto: true
  });

  return { somaPesoTotal: somaPeso, pesoMedioPeca, tempoMedioSeg, produtividadeKgHora, quebraGlobalKg: somaPerdaTecnicaKg, quebraGlobalPerc: rendPerdaTecnicaPerc, detalhesAmostras, cortesConsolidados };
}

function calcularCusteioPecaChave(peca, metricas) {
  const pesoBase = metricas.pesoMedioPeca;
  const custoBaseKg = peca.custoKgEntrada;
  const custoTotalPeca = arredondar(pesoBase * custoBaseKg, 2);
  const usarPecaChave = peca.modoCusto !== 'livre';

  const cortesProcessados = metricas.cortesConsolidados.map((c) => {
    return processarItemCusteio(c, peca, pesoBase, custoBaseKg, usarPecaChave);
  });

  const faturamentoTotal = arredondar(cortesProcessados.reduce((a, b) => a + b.fat, 0), 2);
  const lucroLiquidoPeca = arredondar(faturamentoTotal - custoTotalPeca, 2);
  const margemGlobalPerc = faturamentoTotal > 0 ? arredondar((lucroLiquidoPeca / faturamentoTotal) * 100, 2) : 0;
  return { custoTotalPeca, faturamentoTotal, lucroLiquidoPeca, margemGlobalPerc, cortes: cortesProcessados };
}

function determinarDiagnosticoCusteio(precoVenda, custoItemKg, isAuto, margemReal, meta) {
  if ((precoVenda === 0 && custoItemKg > 0) || isAuto) return 'perda';
  if (precoVenda < custoItemKg) return 'prejuizo_oculto';
  if (margemReal < meta) return 'abaixo_meta';
  return 'saudavel';
}

function processarItemCusteio(c, peca, pesoBase, custoBaseKg, usarPecaChave) {
  const isAuto = c.isAuto || c.tipo === 'perda_tecnica';
  const precoVenda = isAuto ? 0 : (peca.precosVendaSugeridos?.[c.nome] ?? 0);
  const custoAtualERP = isAuto ? 0 : (peca.custosSistema?.[c.nome] ?? (precoVenda > 0 ? arredondar(precoVenda * 0.7, 2) : 0));
  const custoItemKg = usarPecaChave ? custoBaseKg : (peca.custosIndividuais?.[c.nome] ?? custoBaseKg);
  const pesoEst = arredondar((pesoBase * c.rendimentoPerc) / 100, 3);
  const fat = arredondar(pesoEst * precoVenda, 2);
  const custoEst = arredondar(pesoEst * custoItemKg, 2);
  const lucroKg = arredondar(precoVenda - custoItemKg, 2);
  const margemRealPerc = precoVenda > 0 ? arredondar((lucroKg / precoVenda) * 100, 2) : (custoItemKg > 0 ? -100 : 0);
  const margemERPPerc = precoVenda > 0 ? arredondar(((precoVenda - custoAtualERP) / precoVenda) * 100, 2) : 0;
  const fatorMeta = peca.margemPadraoPerc < 100 ? (1 - (peca.margemPadraoPerc / 100)) : 0.01;
  const precoSugerido = arredondar(custoItemKg / (fatorMeta > 0 ? fatorMeta : 0.01), 2);
  const diag = determinarDiagnosticoCusteio(precoVenda, custoItemKg, isAuto, margemRealPerc, peca.margemPadraoPerc);

  return {
    ...c, pesoEst, precoVenda, custoAtualERP, custoItemKg, fat, custoEst, lucroKg,
    lucroEst: arredondar(fat - custoEst, 2), margemPerc: margemRealPerc, margemERPPerc, precoSugerido, diagnostico: diag
  };
}

function gerarBadgeQuebra(quebraKg, quebraPerc, somaCortes = null, pesoTotal = null) {
  if (somaCortes !== null && somaCortes === 0) {
    return '<span class="badge badge-neutral" style="font-size:0.75rem;">Aguardando cortes</span>';
  }
  if (pesoTotal && somaCortes !== null && quebraPerc > 30) {
    return `<span class="badge badge-warning" title="Peça em preenchimento">⚠️ ${formatarKg(quebraKg)} (${quebraPerc}%)<small style="display:block;font-size:0.68rem;opacity:0.85;">Em digitação...</small></span>`;
  }
  if (quebraKg < 0) return `<span class="badge badge-danger">⚠️ +${formatarKg(Math.abs(quebraKg))} (${quebraPerc}%)</span>`;
  if (quebraPerc <= 0.5) return `<span class="badge badge-success">✓ ${formatarKg(quebraKg)} (${quebraPerc}%)</span>`;
  if (quebraPerc <= 1.5) return `<span class="badge badge-warning">! ${formatarKg(quebraKg)} (${quebraPerc}%)</span>`;
  return `<span class="badge badge-danger">⚠️ ${formatarKg(quebraKg)} (${quebraPerc}%)</span>`;
}

function gerarBadgeQuebraPerc(quebraPerc) {
  if (quebraPerc <= 0.5) return `<span class="badge badge-success">✓ ${formatarPerc(quebraPerc)}</span>`;
  if (quebraPerc <= 1.5) return `<span class="badge badge-warning">! ${formatarPerc(quebraPerc)}</span>`;
  return `<span class="badge badge-danger">⚠️ ${formatarPerc(quebraPerc)}</span>`;
}

function renderizarSeletorPecas() {
  const select = document.getElementById('select-peca');
  if (!select) return;
  select.innerHTML = '';
  if (!banco.pecas || banco.pecas.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.innerText = '(Nenhuma peça cadastrada)';
    select.appendChild(opt);
    return;
  }
  banco.pecas.forEach((p) => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.innerText = p.nome;
    if (p.id === banco.idPecaAtiva) opt.selected = true;
    select.appendChild(opt);
  });
}

function renderizarTabelaDesossa(peca, metricas) {
  renderizarSubtabsPecas(peca);
  renderizarPainelAnaliseIndividual(peca);
  renderizarCabecalhoDesossa(peca);
  renderizarCorpoDesossa(peca, metricas);
  renderizarRodapeDesossa(peca, metricas);
}

function criarBotaoPillAmostra(a, i) {
  const pill = document.createElement('button');
  pill.className = `piece-pill ${banco.amostraSelecionadaId === a.id ? 'active' : ''}`;
  pill.innerHTML = `🥩 ${a.nome || `Limpeza ${i + 1}`} (${formatarKg(a.pesoTotal)})`;
  pill.addEventListener('click', () => { banco.amostraSelecionadaId = a.id; atualizarTela(); });
  return pill;
}

function renderizarSubtabsPecas(peca) {
  const container = document.getElementById('container-subtabs-pecas');
  if (!container) return;
  container.innerHTML = '';
  const btnAdd = document.createElement('button');
  btnAdd.className = 'piece-pill piece-pill-btn-add';
  btnAdd.innerHTML = '+ Nova Transformação/Limpeza';
  btnAdd.addEventListener('click', adicionarNovaAmostra);

  if (!peca.amostras || peca.amostras.length === 0) {
    btnAdd.classList.add('active');
    container.appendChild(btnAdd);
    return;
  }
  const pillMedia = document.createElement('button');
  pillMedia.className = `piece-pill ${!banco.amostraSelecionadaId ? 'active' : ''}`;
  pillMedia.innerHTML = `📊 Média Geral (${peca.amostras.length} transformações)`;
  pillMedia.addEventListener('click', () => { banco.amostraSelecionadaId = null; atualizarTela(); });
  container.appendChild(pillMedia);

  peca.amostras.forEach((a, i) => container.appendChild(criarBotaoPillAmostra(a, i)));
  container.appendChild(btnAdd);
}

function renderizarPainelAnaliseIndividual(peca) {
  const painel = document.getElementById('painel-analise-individual-peca');
  if (!painel) return;
  if (!banco.amostraSelecionadaId) {
    painel.style.display = 'none';
    return;
  }
  const amostra = peca.amostras.find((a) => a.id === banco.amostraSelecionadaId);
  if (!amostra) {
    painel.style.display = 'none';
    banco.amostraSelecionadaId = null;
    return;
  }
  const analise = calcularAnaliseIndividualAmostra(amostra, peca.custoKgEntrada, peca.precosVendaSugeridos, peca.modoCusto !== 'livre');
  preencherDadosPainelIndividual(amostra, analise);
  painel.style.display = 'flex';
}

function preencherDadosPainelIndividual(amostra, analise) {
  document.getElementById('ind-titulo-peca').innerText = `Análise Individual: ${amostra.nome || 'Limpeza'}`;
  document.getElementById('ind-sub-peca').innerText = `Tempo: ${amostra.tempo || '00:00:00'} | Cortes: ${formatarKg(analise.somaCortes)}`;
  document.getElementById('ind-badge-quebra').innerHTML = gerarBadgeQuebra(analise.quebraKg, analise.quebraPerc);
  document.getElementById('ind-peso-bruto').innerText = formatarKg(analise.pesoTotal);
  document.getElementById('ind-tempo-desossa').innerText = `Tempo: ${amostra.tempo || '00:00:00'}`;
  document.getElementById('ind-quebra-kg').innerText = formatarKg(analise.quebraKg);
  document.getElementById('ind-quebra-perc').innerText = `${formatarPerc(analise.quebraPerc)} de quebra`;
  document.getElementById('ind-custo-total').innerText = formatarMoeda(analise.custoTotal);
  document.getElementById('ind-lucro-liquido').innerText = formatarMoeda(analise.lucroLiquido);
  document.getElementById('ind-margem-peca').innerText = `Margem Real: ${formatarPerc(analise.margemPerc)}`;
}

function calcularAnaliseIndividualAmostra(amostra, custoKg, precosVenda, usarPecaChave) {
  const pesoTotal = Number(amostra.pesoTotal) || 0;
  let somaCortes = 0, fatTotal = 0;
  Object.entries(amostra.cortes || {}).forEach(([n, p]) => {
    const pesoNum = Number(p) || 0;
    somaCortes += pesoNum;
    fatTotal += pesoNum * (precosVenda[n] ?? 0);
  });
  const quebra = calcularQuebraAmostra(pesoTotal, somaCortes);
  const custoTotal = arredondar(pesoTotal * custoKg, 2);
  const lucroLiquido = arredondar(fatTotal - custoTotal, 2);
  const margemPerc = fatTotal > 0 ? arredondar((lucroLiquido / fatTotal) * 100, 2) : 0;
  return { pesoTotal, somaCortes, quebraKg: quebra.quebraKg, quebraPerc: quebra.quebraPerc, custoTotal, faturamentoTotal: arredondar(fatTotal, 2), lucroLiquido, margemPerc };
}

function renderizarCabecalhoDesossa(peca) {
  const thead = document.getElementById('cabecalho-tabela-desossa');
  let html = `<tr><th style="min-width: 170px;">Corte / Rendimento / Perda</th>`;
  peca.amostras.forEach((a, i) => {
    const isFocused = banco.amostraSelecionadaId === a.id;
    const nomePadrao = a.nome || `Transformação/Limpeza ${i + 1}`;
    html += `
      <th class="text-center" style="background:${obterCorColuna(i)}; min-width: 185px; ${isFocused ? 'outline: 3px solid var(--primary);' : ''}">
        <div class="col-header-actions">
          <input type="text" class="form-input input-amostra-nome" data-idx="${i}" value="${nomePadrao}"
                 style="font-size:0.8rem; font-weight:700; width:125px; padding:2px 4px; display:inline;" title="Nome da transformação/limpeza">
          <button class="btn-del-col btn-excluir-coluna-amostra" data-idx="${i}" title="Excluir esta transformação">✕ Excluir</button>
        </div>
        <div style="font-size:0.75rem; font-weight:normal; margin-top:4px;">
          Total: <input type="text" class="form-input form-input-calc input-amostra-peso" data-idx="${i}"
                        value="${formatarKgValor(a.pesoTotal)}" style="width: 80px; padding:2px 4px; display:inline;"> kg<br>
          Tempo: <input type="text" class="form-input input-amostra-tempo" data-idx="${i}"
                        value="${a.tempo || '00:05:00'}" style="width: 75px; padding:2px 4px; display:inline; margin-top:2px;">
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
  if (!peca.amostras || peca.amostras.length === 0) {
    tbody.innerHTML = renderizarAvisoAmostrasVazias();
    tbody.querySelector('.btn-add-amostra-empty')?.addEventListener('click', adicionarNovaAmostra);
    return;
  }
  metricas.cortesConsolidados.forEach((corte) => {
    const tr = document.createElement('tr');
    tr.innerHTML = montarHtmlLinhaCorte(peca, corte, metricas);
    tbody.appendChild(tr);
  });
}

function renderizarAvisoAmostrasVazias() {
  return `<tr><td colspan="4" class="text-center" style="padding: 2.5rem 1rem; color: var(--text-muted);"><div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 0.35rem;">⚖️ Nenhuma transformação/limpeza lançada</div><div style="font-size: 0.85rem; margin-bottom: 0.85rem;">O sistema está zerado. Clique abaixo para lançar uma limpeza.</div><button class="btn btn-primary btn-sm btn-add-amostra-empty">+ Adicionar Primeira Limpeza</button></td></tr>`;
}

function montarCelulaCorteAmostra(a, i, corte, metricas, isAuto, corteCod) {
  if (isAuto) {
    const det = metricas.detalhesAmostras?.[i];
    const pesoAuto = Math.max(0, det?.quebraKg || 0);
    return `<td class="text-center" style="white-space: nowrap;"><span class="badge" style="background:#fee2e2; color:#991b1b; font-weight:700; font-size:0.75rem; padding:3px 6px;" title="Perda técnica automática de manejo e serra">⚡ ${formatarKgValor(pesoAuto)}</span></td>`;
  }
  const v = a.cortes ? a.cortes[corte.nome] : 0;
  const vTexto = (v !== undefined && v !== null && v !== '') ? formatarKgValor(v) : '';
  return `<td class="text-center" style="white-space: nowrap;"><input type="text" class="form-input form-input-calc input-corte-peso" data-idx="${i}" data-corte="${corteCod}" value="${vTexto}" style="width: 80px; text-align:right; display:inline-block;" placeholder="0,000"><button class="btn-calc-sobra" data-idx="${i}" data-corte="${corteCod}" title="Preencher sobra" style="border:none; background:#e0f2fe; color:#0369a1; border-radius:4px; padding:2px 5px; font-size:0.68rem; font-weight:700; cursor:pointer; margin-left:2px;">⚡Sobra</button></td>`;
}

function montarHtmlLinhaCorte(peca, corte, metricas) {
  const isAuto = corte.isAuto || corte.tipo === 'perda_tecnica';
  const corteCod = encodeURIComponent(corte.nome);
  let tds = `<td><strong>${corte.nome}</strong> ${isAuto ? '<span class="badge" style="background:#fee2e2; color:#991b1b; font-size:0.65rem; margin-left:4px;">⚡ AUTO</span>' : ''}</td>`;
  peca.amostras.forEach((a, i) => {
    tds += montarCelulaCorteAmostra(a, i, corte, metricas, isAuto, corteCod);
  });
  tds += `
    <td class="text-right font-bold">${formatarKg(corte.pesoMedio)}</td>
    <td class="text-right"><span class="badge ${isAuto ? 'badge-danger' : 'badge-neutral'} font-bold">${formatarPerc(corte.rendimentoPerc)}</span></td>
    <td class="text-center">
      ${isAuto ? '' : `<button class="btn btn-sm btn-secondary btn-remover-corte" data-corte="${corteCod}" style="padding:2px 6px; color:#b91c1c;">✕</button>`}
    </td>
  `;
  return tds;
}

function renderizarRodapeDesossa(peca, metricas) {
  const tfoot = document.getElementById('rodape-tabela-desossa');
  if (!peca.amostras || peca.amostras.length === 0) {
    tfoot.innerHTML = `
      <tr style="background:#f1f5f9; font-weight:700;"><td>Total Alocado + Perdas (kg)</td><td class="text-right">0,000 kg</td><td class="text-right">0,00%</td><td></td></tr>
      <tr style="background:#fff; font-weight:700;"><td>Rendimento Fechado</td><td class="text-right">-</td><td class="text-right"><span class="badge badge-success">✓ 0,00%</span></td><td></td></tr>
    `;
    return;
  }
  let trSoma = '<tr style="background:#f1f5f9; font-weight:700;"><td>Total Alocado + Perdas (kg)</td>';
  let trQuebra = '<tr style="background:#fff; font-weight:700;"><td>Rendimento Fechado</td>';
  metricas.detalhesAmostras.forEach((det) => {
    if (det.excessoKg > 0) {
      trSoma += `<td class="text-center font-bold text-danger" title="Soma dos cortes excedeu o peso inicial da peça em +${formatarKg(det.excessoKg)}">${formatarKg(det.somaCortes)}</td>`;
      trQuebra += `<td class="text-center"><span class="badge badge-danger">⚠️ +${formatarKg(det.excessoKg)}</span></td>`;
    } else {
      trSoma += `<td class="text-center font-bold" style="color:var(--primary);">${formatarKg(det.pesoTotal)}</td>`;
      trQuebra += `<td class="text-center"><span class="badge badge-success" title="Rendimento 100% fechado (cortes + perdas técnicas)">✓ 100,00%</span></td>`;
    }
  });
  const somaMedia = arredondar(metricas.cortesConsolidados.reduce((acc, c) => acc + c.pesoMedio, 0), 3);
  const somaRend = arredondar(metricas.cortesConsolidados.reduce((acc, c) => acc + c.rendimentoPerc, 0), 2);
  trSoma += `<td class="text-right font-bold" style="color:var(--primary);">${formatarKg(somaMedia)}</td><td class="text-right font-bold">${formatarPerc(somaRend)}</td><td></td></tr>`;
  trQuebra += `<td class="text-right text-muted">-</td><td class="text-right"><span class="badge badge-success">✓ 100,00%</span></td><td></td></tr>`;
  tfoot.innerHTML = trSoma + trQuebra;
}

function renderizarGraficosVisuais(peca, metricas, custeio) {
  const dist = calcularDistribuicao(custeio.cortes, metricas.quebraGlobalPerc);
  atualizarBarraComposicao(dist);
  atualizarBoxesFinanceiros(custeio);
}

function calcularDistribuicao(cortes, quebraPerc) {
  let com = 0, sub = 0, liq = 0, perTec = 0;
  cortes.forEach((c) => {
    const n = (c.nome || '').toLowerCase().trim();
    if (c.tipo === 'perda_tecnica' || n.includes('perda técnica') || n.includes('manejo e serra')) {
      perTec += c.rendimentoPerc;
    } else if (n.includes('sangue') || n.includes('liquido') || n.includes('líquido') || n.includes('gotejamento')) {
      liq += c.rendimentoPerc;
    } else if (n === 'cebo e osso' || n === 'sebo e osso' || n === 'sebo' || n === 'cebo' || n === 'descarte') {
      sub += c.rendimentoPerc;
    } else {
      com += c.rendimentoPerc;
    }
  });
  return { com: arredondar(com, 2), sub: arredondar(sub, 2), liq: arredondar(liq, 2), q: arredondar(Math.max(0, quebraPerc + perTec), 2) };
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
    const tr = document.createElement('tr');
    tr.innerHTML = montarHtmlLinhaCusteio(c, peca);
    tbody.appendChild(tr);
  });
  atualizarTotaisCusteio(custeio);
}

function gerarBadgeDiagnostico(diag) {
  if (diag === 'prejuizo_oculto') {
    return '<span class="badge badge-danger" title="O custo real da desossa é maior que o preço de venda!">🔴 Prejuízo Oculto</span>';
  }
  if (diag === 'perda') {
    return '<span class="badge" style="background:#f3e8ff; color:#7e22ce;" title="Perda líquida ou subproduto sem receita">Perda</span>';
  }
  if (diag === 'abaixo_meta') {
    return '<span class="badge badge-warning" title="Margem real positiva, porém abaixo da meta configurada">🟡 Abaixo da Meta</span>';
  }
  return '<span class="badge badge-success" title="Margem real igual ou superior à meta">🟢 Saudável</span>';
}

function montarBadgeNomeCusteio(c, isAuto) {
  if (isAuto) return '<span class="badge" style="background:#fee2e2; color:#991b1b; margin-left:4px; font-size:0.65rem;">PERDA TÉCNICA</span>';
  if (c.diagnostico === 'perda') return '<span class="badge" style="background:#f3e8ff; color:#7e22ce; margin-left:4px; font-size:0.65rem;">PERDA</span>';
  return '';
}

function montarHtmlLinhaCusteio(c, peca) {
  const isPrej = c.lucroKg < 0;
  const isAuto = c.isAuto || c.tipo === 'perda_tecnica';
  const badgeNome = montarBadgeNomeCusteio(c, isAuto);
  const inputCusto = isAuto ? '<span class="text-muted">-</span>' : `<input type="text" class="form-input form-input-moeda input-custo-erp-custeio" data-corte="${c.nome}" value="${formatarNumeroBR(c.custoAtualERP, 2)}" style="width: 70px; text-align:right; font-size:0.8rem;">`;
  const inputPreco = isAuto ? '<span class="text-muted">R$ 0,00</span>' : `<input type="text" class="form-input form-input-moeda input-preco-venda-custeio" data-corte="${c.nome}" value="${formatarNumeroBR(c.precoVenda, 2)}" style="width: 70px; text-align:right; font-weight:700; font-size:0.8rem;">`;
  const badgeMargem = `<span class="badge ${isPrej ? 'badge-danger' : (c.margemPerc < peca.margemPadraoPerc ? 'badge-warning' : 'badge-success')} font-bold">${formatarPerc(c.margemPerc)}</span>`;

  return `
    <td><strong>${c.nome}</strong> ${badgeNome}</td>
    <td class="text-right font-bold">${formatarPerc(c.rendimentoPerc)}</td>
    <td class="text-right text-muted">${formatarKg(c.pesoEst)}</td>
    <td class="text-right">${inputCusto}</td>
    <td class="text-right font-bold" style="background:#fef3c7; color:var(--primary); font-size:0.85rem;">${formatarMoeda(c.custoItemKg)}</td>
    <td class="text-right">${inputPreco}</td>
    <td class="text-right text-muted" style="font-size:0.8rem;">${isAuto ? '-' : formatarPerc(c.margemERPPerc)}</td>
    <td class="text-right">${badgeMargem}</td>
    <td class="text-right font-bold" style="color:#0369a1; font-size:0.85rem;">${isAuto ? '-' : formatarMoeda(c.precoSugerido)}</td>
    <td class="text-center">${gerarBadgeDiagnostico(c.diagnostico)}</td>
    <td class="text-right font-bold ${c.lucroEst >= 0 ? 'text-success' : 'text-danger'}">${formatarMoeda(c.lucroEst)}</td>
  `;
}

function atualizarTotaisCusteio(custeio) {
  const somaRend = arredondar(custeio.cortes.reduce((a, b) => a + b.rendimentoPerc, 0), 2);
  const somaPeso = arredondar(custeio.cortes.reduce((a, b) => a + b.pesoEst, 0), 3);
  document.getElementById('custo-total-rend').innerText = formatarPerc(somaRend);
  document.getElementById('custo-total-peso').innerText = formatarKg(somaPeso);
  document.getElementById('custo-total-margem-perc').innerHTML = `<span class="badge badge-success font-bold">${formatarPerc(custeio.margemGlobalPerc)}</span>`;
  const elStatus = document.getElementById('custo-total-status-audit');
  if (elStatus) elStatus.innerHTML = custeio.lucroLiquidoPeca >= 0 ? '<span class="badge badge-success">✓ Lucrativo</span>' : '<span class="badge badge-danger">⚠️ Prejuízo</span>';
  document.getElementById('custo-total-lucro-liquido').innerText = formatarMoeda(custeio.lucroLiquidoPeca);
}

function renderizarLinhasEstoqueSimulador(peca, metricas, volDesossa, tbody) {
  let fatCortes = 0;
  metricas.cortesConsolidados.forEach((c) => {
    const preco = peca.precosVendaSugeridos[c.nome] || 0;
    const pesoEstoque = arredondar((volDesossa * c.rendimentoPerc) / 100, 3);
    const fat = arredondar(pesoEstoque * preco, 2);
    fatCortes += fat;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><strong>${c.nome}</strong></td><td class="text-right">${formatarPerc(c.rendimentoPerc)}</td><td class="text-right font-bold">${formatarKg(pesoEstoque)}</td><td class="text-right text-muted">${formatarMoeda(preco)}</td><td class="text-right font-bold">${formatarMoeda(fat)}</td>`;
    tbody.appendChild(tr);
  });
  return fatCortes;
}

function renderizarSimulador(peca, metricas) {
  const volCompra = Number.parseFloat(document.getElementById('input-volume-compra')?.value) || banco.volumeSimuladoKg;
  const custoKg = Number.parseFloat(document.getElementById('input-custo-simulado')?.value) || peca.custoKgEntrada;
  const propDesossa = (Number.parseFloat(document.getElementById('select-destino-lote')?.value) || 100) / 100;
  const precoInteira = parseValorMonetario(document.getElementById('input-preco-venda-inteira')?.value || (peca.custoKgEntrada * 1.3));
  const volDesossa = arredondar(volCompra * propDesossa, 3);
  const volInteiro = arredondar(volCompra * (1 - propDesossa), 3);
  const fatInteiro = arredondar(volInteiro * precoInteira, 2);
  const custoTotalLote = arredondar(volCompra * custoKg, 2);
  const tbody = document.getElementById('corpo-tabela-estoque');
  tbody.innerHTML = '';

  if (volInteiro > 0) {
    const trInteiro = document.createElement('tr');
    trInteiro.style.background = '#f0fdf4';
    trInteiro.innerHTML = `<td><strong>🥩 ${peca.nome} (Peça Inteira Fechada)</strong> <span class="badge badge-success" style="font-size:0.65rem;">ESTOQUE BRUTO</span></td><td class="text-right">${formatarPerc((1 - propDesossa) * 100)}</td><td class="text-right font-bold text-success">${formatarKg(volInteiro)}</td><td class="text-right text-muted">${formatarMoeda(precoInteira)}</td><td class="text-right font-bold text-success">${formatarMoeda(fatInteiro)}</td>`;
    tbody.appendChild(trInteiro);
  }
  const fatCortes = renderizarLinhasEstoqueSimulador(peca, metricas, volDesossa, tbody);
  atualizarCardsSimulacao(volCompra, custoTotalLote, arredondar(fatCortes + fatInteiro, 2), volInteiro, volDesossa);
}

function atualizarCardsSimulacao(vol, custo, fat, volInteiro = 0, volDesossa = 0) {
  const lucro = arredondar(fat - custo, 2);
  const margem = fat > 0 ? arredondar((lucro / fat) * 100, 2) : 0;
  document.getElementById('sim-custo-total').innerText = formatarMoeda(custo);
  document.getElementById('sim-volume-kg').innerText = `Lote de ${formatarKg(vol)}`;
  document.getElementById('sim-faturamento-total').innerText = formatarMoeda(fat);
  document.getElementById('sim-lucro-total').innerText = formatarMoeda(lucro);
  document.getElementById('sim-margem-perc').innerText = `Margem Projetada: ${formatarPerc(margem)}`;
  const elDivisao = document.getElementById('sim-divisao-estoque');
  if (elDivisao) {
    elDivisao.innerText = `${formatarKg(volInteiro)} / ${formatarKg(volDesossa)}`;
  }
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
  renderizarSeletorPecas();
  if (!peca) {
    renderizarCatalogoZerado();
    salvarNoLocalStorage();
    return;
  }
  sincronizarCamposPecaAtiva(peca);
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

function renderizarCatalogoZerado() {
  const tbody = document.getElementById('corpo-tabela-desossa');
  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center" style="padding: 2.5rem; color: var(--text-muted);"><div style="font-weight: 700; font-size: 1.15rem; margin-bottom: 0.5rem;">🥩 Catálogo Zerado</div><p style="font-size: 0.9rem; margin-bottom: 1rem;">Nenhuma peça cadastrada. Clique no botão abaixo para cadastrar.</p><button class="btn btn-primary btn-sm" id="btn-criar-primeira-peca">+ Cadastrar Nova Peça</button></td></tr>';
    document.getElementById('btn-criar-primeira-peca')?.addEventListener('click', abrirModalPeca);
  }
  const tfoot = document.getElementById('rodape-tabela-desossa');
  if (tfoot) tfoot.innerHTML = '';
  const containerSub = document.getElementById('container-subtabs-pecas');
  if (containerSub) containerSub.innerHTML = '';
}

function sincronizarCamposPecaAtiva(peca) {
  const inputCusto = document.getElementById('input-custo-compra-kg');
  if (document.activeElement !== inputCusto) {
    inputCusto.value = formatarNumeroBR(peca.custoKgEntrada, 2);
  }
  const inputMargem = document.getElementById('input-margem-padrao-peca');
  if (document.activeElement !== inputMargem) {
    inputMargem.value = formatarNumeroBR(peca.margemPadraoPerc, 2);
  }
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
      atualizarTela();
    });
  });
}

function vincularInputsCustoMargem() {
  const inputCusto = document.getElementById('input-custo-compra-kg');
  inputCusto.addEventListener('input', (e) => {
    const peca = obterPecaAtiva();
    peca.custoKgEntrada = parseValorMonetario(e.target.value);
    document.getElementById('input-custo-simulado').value = peca.custoKgEntrada;
  });
  inputCusto.addEventListener('blur', (e) => {
    e.target.value = formatarNumeroBR(obterPecaAtiva().custoKgEntrada, 2);
    atualizarTela();
  });
  const inputMargem = document.getElementById('input-margem-padrao-peca');
  inputMargem.addEventListener('input', (e) => {
    obterPecaAtiva().margemPadraoPerc = parseValorPercentual(e.target.value);
  });
  inputMargem.addEventListener('blur', (e) => {
    e.target.value = formatarNumeroBR(obterPecaAtiva().margemPadraoPerc, 2);
    atualizarTela();
  });
}

function vincularEventosPeca() {
  document.getElementById('select-peca').addEventListener('change', (e) => {
    banco.idPecaAtiva = e.target.value;
    banco.amostraSelecionadaId = null;
    atualizarTela();
  });
  vincularInputsCustoMargem();
  document.getElementById('check-custo-peca-chave').addEventListener('change', (e) => {
    obterPecaAtiva().modoCusto = e.target.checked ? 'peca_chave' : 'livre';
    atualizarTela();
  });
}

function adicionarNovaAmostra() {
  const peca = obterPecaAtiva();
  if (!peca) return;
  if (!peca.amostras) peca.amostras = [];
  const cortes = sincronizarCortesPeca(peca);
  const num = peca.amostras.length + 1;
  const novaId = `amostra-${Date.now()}`;
  const cortesZerados = {};
  cortes.forEach((nome) => { cortesZerados[nome] = 0; });
  peca.amostras.push({
    id: novaId,
    nome: `Transformação/Limpeza ${num}`,
    pesoTotal: 0,
    tempo: '00:05:00',
    cortes: cortesZerados
  });
  banco.amostraSelecionadaId = novaId;
  salvarNoLocalStorage();
  atualizarTela();
}

function excluirAmostraPorIndice(idx) {
  const peca = obterPecaAtiva();
  if (!peca || !peca.amostras || peca.amostras.length === 0) return;
  const nome = peca.amostras[idx]?.nome || `Transformação/Limpeza ${idx + 1}`;
  solicitarConfirmacao(`Deseja realmente excluir a ${nome}?`, () => {
    const removida = peca.amostras.splice(idx, 1)[0];
    if (banco.amostraSelecionadaId === removida?.id) {
      banco.amostraSelecionadaId = null;
    }
    salvarNoLocalStorage();
    atualizarTela();
  });
}

function calcularSobraParaCorte(amostraIdx, corteNomeCodificado) {
  const peca = obterPecaAtiva();
  if (!peca || !peca.amostras || !peca.amostras[amostraIdx]) return;
  const corteNome = decodeURIComponent(corteNomeCodificado);
  const amostra = peca.amostras[amostraIdx];
  const pesoTotal = Number(amostra.pesoTotal) || 0;
  let somaOutros = 0;
  Object.entries(amostra.cortes || {}).forEach(([n, p]) => {
    if (n.toLowerCase().trim() !== corteNome.toLowerCase().trim()) {
      somaOutros += (Number(p) || 0);
    }
  });
  const sobra = Math.max(0, arredondar(pesoTotal - somaOutros, 3));
  amostra.cortes[corteNome] = sobra;
  salvarNoLocalStorage();
  atualizarTela();
}

function vincularEventosAmostras() {
  document.getElementById('btn-add-amostra').addEventListener('click', adicionarNovaAmostra);
  document.getElementById('btn-remover-amostra').addEventListener('click', () => {
    const peca = obterPecaAtiva();
    if (peca && peca.amostras) excluirAmostraPorIndice(peca.amostras.length - 1);
  });
  document.getElementById('btn-fechar-analise-individual')?.addEventListener('click', () => {
    banco.amostraSelecionadaId = null;
    atualizarTela();
  });
}

function vincularEventosTabelaDesossa() {
  const tbl = document.getElementById('tabela-desossa-dinamica');
  tbl.addEventListener('focusin', (e) => {
    if (e.target.classList.contains('form-input-calc')) e.target.select();
  });
  tbl.addEventListener('input', tratarInputTabelaDesossa);
  tbl.addEventListener('change', tratarChangeTabelaDesossa);
  tbl.addEventListener('click', tratarCliqueTabelaDesossa);
}

function tratarInputTabelaDesossa(e) {
  const peca = obterPecaAtiva();
  if (!peca) return;
  const idx = Number.parseInt(e.target.dataset.idx, 10);
  if (e.target.classList.contains('input-amostra-peso')) {
    peca.amostras[idx].pesoTotal = avaliarExpressaoNumerica(e.target.value);
    atualizarApenasCalculosTabela(peca);
  }
  if (e.target.classList.contains('input-corte-peso')) {
    const corteNome = decodeURIComponent(e.target.dataset.corte);
    peca.amostras[idx].cortes[corteNome] = avaliarExpressaoNumerica(e.target.value);
    atualizarApenasCalculosTabela(peca);
  }
}

function atualizarApenasCalculosTabela(peca) {
  const metricas = calcularMetricasPeca(peca);
  const custeio = calcularCusteioPecaChave(peca, metricas);
  atualizarMetricasTopGeral(peca, metricas, custeio);
  renderizarRodapeDesossa(peca, metricas);
}

function tratarChangeTabelaDesossa(e) {
  const peca = obterPecaAtiva();
  if (!peca) return;
  const idx = Number.parseInt(e.target.dataset.idx, 10);
  if (e.target.classList.contains('input-amostra-peso')) {
    peca.amostras[idx].pesoTotal = avaliarExpressaoNumerica(e.target.value);
    e.target.value = formatarKgValor(peca.amostras[idx].pesoTotal);
    salvarNoLocalStorage();
    atualizarTela();
  }
  if (e.target.classList.contains('input-amostra-tempo')) {
    peca.amostras[idx].tempo = e.target.value;
    salvarNoLocalStorage();
    atualizarTela();
  }
  if (e.target.classList.contains('input-amostra-nome')) {
    peca.amostras[idx].nome = e.target.value.trim() || `Transformação/Limpeza ${idx + 1}`;
    salvarNoLocalStorage();
    atualizarTela();
  }
  if (e.target.classList.contains('input-corte-peso')) {
    const corteNome = decodeURIComponent(e.target.dataset.corte);
    peca.amostras[idx].cortes[corteNome] = avaliarExpressaoNumerica(e.target.value);
    e.target.value = formatarKgValor(peca.amostras[idx].cortes[corteNome]);
    salvarNoLocalStorage();
    atualizarTela();
  }
}

function tratarCliqueTabelaDesossa(e) {
  if (e.target.classList.contains('btn-remover-corte')) {
    removerCortePeca(decodeURIComponent(e.target.dataset.corte));
  }
  if (e.target.classList.contains('btn-excluir-coluna-amostra')) {
    excluirAmostraPorIndice(Number.parseInt(e.target.dataset.idx, 10));
  }
  if (e.target.classList.contains('btn-calc-sobra')) {
    calcularSobraParaCorte(Number.parseInt(e.target.dataset.idx, 10), e.target.dataset.corte);
  }
}

function removerCortePeca(corteNome) {
  const peca = obterPecaAtiva();
  solicitarConfirmacao(`Deseja realmente remover o corte/perda '${corteNome}' desta peça?`, () => {
    const nomeAlvo = corteNome.trim().toLowerCase();
    peca.cortesCatalogo = (peca.cortesCatalogo || []).filter((c) => c.nome.trim().toLowerCase() !== nomeAlvo);
    peca.amostras.forEach((a) => {
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
    salvarNoLocalStorage();
    atualizarTela();
  });
}

function vincularEventosCusteio() {
  document.getElementById('corpo-tabela-custeio').addEventListener('change', (e) => {
    const peca = obterPecaAtiva();
    if (!peca) return;
    const corte = e.target.dataset.corte;
    if (e.target.classList.contains('input-preco-venda-custeio')) {
      if (!peca.precosVendaSugeridos) peca.precosVendaSugeridos = {};
      peca.precosVendaSugeridos[corte] = parseValorMonetario(e.target.value);
      salvarNoLocalStorage();
      atualizarTela();
    }
    if (e.target.classList.contains('input-custo-erp-custeio')) {
      if (!peca.custosSistema) peca.custosSistema = {};
      peca.custosSistema[corte] = parseValorMonetario(e.target.value);
      salvarNoLocalStorage();
      atualizarTela();
    }
  });
  document.getElementById('btn-aplicar-margem-geral').addEventListener('click', aplicarMargemGeralCortes);
}

function aplicarMargemGeralCortes() {
  const peca = obterPecaAtiva();
  if (!peca) return;
  const margem = peca.margemPadraoPerc / 100;
  if (margem >= 1) return exibirToast('A margem deve ser menor que 100%.', 'warning');
  obterListaCortesPeca(peca).forEach((nome) => {
    const isSub = nome.toLowerCase().includes('osso') || nome.toLowerCase().includes('cebo') || nome.toLowerCase().includes('sangue');
    if (!isSub) {
      peca.precosVendaSugeridos[nome] = arredondar(peca.custoKgEntrada / (1 - margem), 2);
    }
  });
  salvarNoLocalStorage();
  atualizarTela();
  exibirToast('Preços de venda atualizados com base na margem padrão!', 'success');
}

function vincularEventosModalCorteAux() {
  document.getElementById('modal-input-custo-atual-corte')?.addEventListener('input', sincronizarMargemModalCorte);
  document.getElementById('modal-input-preco-venda-corte')?.addEventListener('input', sincronizarMargemModalCorte);
  document.getElementById('modal-select-tipo-corte')?.addEventListener('change', (e) => {
    if (e.target.value === 'perda_liquida') {
      document.getElementById('modal-input-custo-atual-corte').value = '0,00';
      document.getElementById('modal-input-preco-venda-corte').value = '0,00';
      document.getElementById('modal-input-margem-atual-corte').value = '-100,00';
    }
  });
  document.getElementById('btn-novo-corte-tab2')?.addEventListener('click', abrirModalCorte);
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
  document.getElementById('btn-confirmar-acao-modal').addEventListener('click', () => {
    document.getElementById('modal-confirmacao').classList.remove('active');
    if (typeof callbackConfirmacao === 'function') {
      const cb = callbackConfirmacao;
      callbackConfirmacao = null;
      cb();
    }
  });
  document.querySelectorAll('.btn-fechar-modal').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach((m) => m.classList.remove('active'));
    });
  });
  vincularEventosModalCorteAux();
}

function abrirModalPeca(isEdicao) {
  const modal = document.getElementById('modal-peca');
  const titulo = document.getElementById('modal-peca-titulo');
  const inputNome = document.getElementById('modal-input-nome-peca');
  const inputCusto = document.getElementById('modal-input-custo-peca');
  const inputMargem = document.getElementById('modal-input-margem-peca');
  if (isEdicao) {
    const peca = obterPecaAtiva();
    titulo.innerText = 'Editar Peça Principal';
    inputNome.value = peca.nome;
    inputCusto.value = formatarNumeroBR(peca.custoKgEntrada, 2);
    inputMargem.value = formatarNumeroBR(peca.margemPadraoPerc, 2);
    modal.dataset.edicao = 'true';
  } else {
    titulo.innerText = 'Cadastrar Nova Peça Principal';
    inputNome.value = '';
    inputCusto.value = '25,00';
    inputMargem.value = '30,00';
    modal.dataset.edicao = 'false';
  }
  modal.classList.add('active');
}

function cadastrarNovaPecaBanco(nome, custo, margem) {
  const id = `peca-${Date.now()}`;
  const nomePrincipal = `${nome} (Corte Principal / Balcão)`;
  const precoEstimado = margem < 100 ? arredondar(custo / (1 - (margem / 100)), 2) : custo * 1.4;
  const novosCortes = { [nomePrincipal]: 0, 'Cebo e Osso': 0, 'Sangue e Líquidos': 0 };

  banco.pecas.push({
    id, nome, custoKgEntrada: custo, margemPadraoPerc: margem, modoCusto: 'peca_chave',
    cortesCatalogo: [
      { nome: nomePrincipal, tipo: 'nobre', precoVendaPadrao: precoEstimado, custoAtualSistema: custo, margemAtualSistema: margem },
      { nome: 'Cebo e Osso', tipo: 'subproduto', precoVendaPadrao: 1.48, custoAtualSistema: 1.48, margemAtualSistema: 0 },
      { nome: 'Sangue e Líquidos', tipo: 'perda_liquida', precoVendaPadrao: 0.00, custoAtualSistema: 0, margemAtualSistema: -100 }
    ],
    amostras: [{ id: `amostra-${Date.now()}`, nome: 'Transformação/Limpeza 1', pesoTotal: 0, tempo: '00:05:00', cortes: novosCortes }],
    precosVendaSugeridos: { [nomePrincipal]: precoEstimado, 'Cebo e Osso': 1.48, 'Sangue e Líquidos': 0.00 },
    custosSistema: { [nomePrincipal]: custo, 'Cebo e Osso': 1.48, 'Sangue e Líquidos': 0.00 },
    historicoDesossas: []
  });
  banco.idPecaAtiva = id;
  banco.amostraSelecionadaId = null;
}

function salvarModalPeca() {
  const modal = document.getElementById('modal-peca');
  const nome = document.getElementById('modal-input-nome-peca').value.trim();
  const custo = parseValorMonetario(document.getElementById('modal-input-custo-peca').value);
  const margem = parseValorPercentual(document.getElementById('modal-input-margem-peca').value);
  if (!nome) return exibirToast('Informe o nome da peça principal.', 'warning');

  if (modal.dataset.edicao === 'true') {
    const peca = obterPecaAtiva();
    peca.nome = nome;
    peca.custoKgEntrada = custo;
    peca.margemPadraoPerc = margem;
    exibirToast(`Peça Principal '${nome}' atualizada com sucesso!`, 'success');
  } else {
    cadastrarNovaPecaBanco(nome, custo, margem);
    exibirToast(`Peça Principal '${nome}' cadastrada com sucesso!`, 'success');
  }
  salvarNoLocalStorage();
  modal.classList.remove('active');
  atualizarTela();
}

function excluirPecaAtiva() {
  const peca = obterPecaAtiva();
  if (!peca) return;
  solicitarConfirmacao(`Deseja realmente excluir a peça principal '${peca.nome}' e todas as suas análises?`, () => {
    banco.pecas = banco.pecas.filter((p) => p.id !== peca.id);
    banco.idPecaAtiva = banco.pecas[0]?.id || null;
    banco.amostraSelecionadaId = null;
    salvarNoLocalStorage();
    atualizarTela();
  });
}

function abrirModalCorte() {
  document.getElementById('modal-input-nome-corte').value = '';
  document.getElementById('modal-input-custo-atual-corte').value = '20,00';
  document.getElementById('modal-input-preco-venda-corte').value = '25,00';
  document.getElementById('modal-input-margem-atual-corte').value = '20,00';
  document.getElementById('modal-corte').classList.add('active');
}

function sincronizarMargemModalCorte() {
  const c = parseValorMonetario(document.getElementById('modal-input-custo-atual-corte').value);
  const p = parseValorMonetario(document.getElementById('modal-input-preco-venda-corte').value);
  const m = p > 0 ? arredondar(((p - c) / p) * 100, 2) : 0;
  document.getElementById('modal-input-margem-atual-corte').value = formatarNumeroBR(m, 2);
}

function salvarModalCorte() {
  const nome = document.getElementById('modal-input-nome-corte').value.trim();
  const tipo = document.getElementById('modal-select-tipo-corte').value;
  const isPerda = tipo === 'perda_liquida';
  const custo = isPerda ? 0 : parseValorMonetario(document.getElementById('modal-input-custo-atual-corte').value);
  const preco = isPerda ? 0 : parseValorMonetario(document.getElementById('modal-input-preco-venda-corte').value);
  const margem = isPerda ? -100 : parseValorPercentual(document.getElementById('modal-input-margem-atual-corte').value);
  if (!nome) return exibirToast('Informe o nome do corte.', 'warning');

  const peca = obterPecaAtiva();
  if (!peca.cortesCatalogo.some((c) => c.nome.toLowerCase() === nome.toLowerCase())) {
    peca.cortesCatalogo.push({ nome, tipo, precoVendaPadrao: preco, custoAtualSistema: custo, margemAtualSistema: margem });
  }
  if (!peca.precosVendaSugeridos) peca.precosVendaSugeridos = {};
  if (!peca.custosSistema) peca.custosSistema = {};
  peca.precosVendaSugeridos[nome] = preco;
  peca.custosSistema[nome] = custo;

  (peca.amostras || []).forEach((a) => {
    if (!a.cortes) a.cortes = {};
    if (a.cortes[nome] === undefined) {
      a.cortes[nome] = 0;
    }
  });

  salvarNoLocalStorage();
  document.getElementById('modal-corte').classList.remove('active');
  atualizarTela();
  exibirToast(`Corte '${nome}' adicionado com sucesso a todas as limpezas!`, 'success');
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
  salvarNoLocalStorage();
  document.getElementById('modal-historico').classList.remove('active');
  atualizarTela();
  exibirToast('Desossa gravada com sucesso no histórico auditável!', 'success');
}

function executarAcaoLinhaHistorico(e) {
  const peca = obterPecaAtiva();
  if (e.target.classList.contains('btn-carregar-hist')) {
    const idx = Number.parseInt(e.target.dataset.idx, 10);
    const reg = peca.historicoDesossas[idx];
    solicitarConfirmacao(`Carregar os dados desta pesagem realizada em ${reg.data}?`, () => {
      peca.amostras = JSON.parse(JSON.stringify(reg.amostrasSnapshot));
      banco.amostraSelecionadaId = null;
      salvarNoLocalStorage();
      atualizarTela();
      document.querySelector('.tab-btn[data-tab="tab-desossa"]').click();
      exibirToast(`Pesagem de ${reg.data} carregada com sucesso!`, 'info');
    }, 'Carregar Histórico');
  }
  if (e.target.classList.contains('btn-excluir-hist')) {
    const idx = Number.parseInt(e.target.dataset.idx, 10);
    solicitarConfirmacao('Excluir este registro do histórico?', () => {
      peca.historicoDesossas.splice(idx, 1);
      salvarNoLocalStorage();
      atualizarTela();
      exibirToast('Registro excluído do histórico.', 'info');
    });
  }
}

function vincularAcoesHistorico() {
  document.getElementById('corpo-tabela-historico').addEventListener('click', executarAcaoLinhaHistorico);
  document.getElementById('btn-limpar-historico').addEventListener('click', () => {
    const peca = obterPecaAtiva();
    solicitarConfirmacao(`Limpar todo o histórico de recebimentos de ${peca.nome}?`, () => {
      peca.historicoDesossas = [];
      salvarNoLocalStorage();
      atualizarTela();
      exibirToast('Histórico limpo com sucesso.', 'info');
    });
  });
}

function vincularAcoesGlobais() {
  document.getElementById('btn-atualizar-simulacao').addEventListener('click', () => {
    const peca = obterPecaAtiva();
    const metricas = calcularMetricasPeca(peca);
    renderizarSimulador(peca, metricas);
    exibirToast('Simulação e estoque recalculados!', 'info');
  });
  document.getElementById('btn-salvar-local').addEventListener('click', () => {
    salvarNoLocalStorage();
    exibirToast('Dados salvos no seu navegador com sucesso!', 'success');
  });
  document.getElementById('btn-restaurar-exemplo').addEventListener('click', () => {
    solicitarConfirmacao('Restaurar o catálogo e dados padrão iniciais?', () => {
      banco.pecas = JSON.parse(JSON.stringify(PECAS_INICIAIS));
      banco.idPecaAtiva = 'dianteiro-bovino';
      banco.amostraSelecionadaId = null;
      salvarNoLocalStorage();
      atualizarTela();
      exibirToast('Catálogo padrão restaurado com sucesso!', 'info');
    }, 'Restaurar Dados');
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
  exibirToast('Arquivo JSON exportado com sucesso!', 'success');
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
        salvarNoLocalStorage();
        atualizarTela();
        exibirToast('Catálogo e histórico importados com sucesso!', 'success');
      }
    } catch (err) {
      exibirToast('Erro ao importar arquivo JSON: formato inválido.', 'error');
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
