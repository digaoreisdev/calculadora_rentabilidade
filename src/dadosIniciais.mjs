/**
 * Catálogo e dados padrão de referência multi-peças
 */

export const PECAS_PADRAO = [
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
        nome: 'Peça 1 (Média - 43,4 kg)',
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
        nome: 'Peça 2 (Grande - 44,3 kg)',
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
        nome: 'Peça 3 (Pequena - 32,2 kg)',
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
    custosSistema: {
      'Cebo e Osso': 1.48,
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
        nome: 'Peça 1 (5,658 kg)',
        pesoTotal: 5.658,
        tempo: '00:03:46',
        cortes: {
          'Sangue e Líquidos': 0.116,
          'Cebo e Osso': 0.146,
          'Moída de Segunda': 0.204,
          'Moída de Primeira': 0.140,
          'Patinho Limpo': 5.052
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
    custosSistema: {
      'Sangue e Líquidos': 0.00,
      'Cebo e Osso': 1.48,
      'Moída de Segunda': 20.00,
      'Moída de Primeira': 28.00,
      'Patinho Limpo': 32.00
    },
    historicoDesossas: []
  },
  {
    id: 'alcatra-inteira',
    nome: 'Alcatra Completa (Com Miolo e Aparas)',
    custoKgEntrada: 32.90,
    margemPadraoPerc: 30.0,
    modoCusto: 'peca_chave',
    modoMargem: 'individual',
    cortesCatalogo: [
      { nome: 'Sangue e Líquidos de Perda', tipo: 'perda_liquida', precoVendaPadrao: 0.00 },
      { nome: 'Cebo de Perda', tipo: 'subproduto', precoVendaPadrao: 1.48 },
      { nome: 'Moída de Segunda', tipo: 'comum', precoVendaPadrao: 26.90 },
      { nome: 'Moída de Primeira', tipo: 'nobre', precoVendaPadrao: 37.90 },
      { nome: 'Alcatra Limpa (Miolo)', tipo: 'nobre', precoVendaPadrao: 49.90 }
    ],
    amostras: [
      {
        id: 'amostra-alcatra-1',
        nome: 'Peça 1 (10,500 kg)',
        pesoTotal: 10.500,
        tempo: '00:07:30',
        cortes: {
          'Sangue e Líquidos de Perda': 0.180,
          'Cebo de Perda': 1.120,
          'Moída de Segunda': 0.850,
          'Moída de Primeira': 1.250,
          'Alcatra Limpa (Miolo)': 7.100
        }
      }
    ],
    precosVendaSugeridos: {
      'Sangue e Líquidos de Perda': 0.00,
      'Cebo de Perda': 1.48,
      'Moída de Segunda': 26.90,
      'Moída de Primeira': 37.90,
      'Alcatra Limpa (Miolo)': 49.90
    },
    custosSistema: {
      'Sangue e Líquidos de Perda': 0.00,
      'Cebo de Perda': 1.48,
      'Moída de Segunda': 21.00,
      'Moída de Primeira': 28.00,
      'Alcatra Limpa (Miolo)': 36.00
    },
    historicoDesossas: []
  }
];

export const DADOS_INICIAIS_DIANTEIRO = PECAS_PADRAO[0];
