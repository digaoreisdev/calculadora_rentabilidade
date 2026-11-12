/**
 * Dados padrão de referência inicial fornecidos pelo usuário
 */

export const DADOS_INICIAIS_DIANTEIRO = {
  nomePeca: 'Dianteiro Bovino',
  custoKgEntrada: 21.45,
  amostras: [
    {
      id: 'amostra-1',
      nome: 'Amostra 1 (Média - 43,4 kg)',
      pesoTotal: 43.396,
      tempo: '00:27:02',
      cortes: {
        'Cebo e Osso': 8.318, // 3.966 + 4.352
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
      nome: 'Amostra 2 (Grande - 44,3 kg)',
      pesoTotal: 44.338,
      tempo: '00:25:35',
      cortes: {
        'Cebo e Osso': 8.862, // 4.268 + 4.594
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
      nome: 'Amostra 3 (Pequena - 32,2 kg)',
      pesoTotal: 32.178,
      tempo: '00:23:15',
      cortes: {
        'Cebo e Osso': 4.874, // 1.474 + 3.400
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
  }
};
