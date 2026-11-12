# Engines.md - Governança, Matriz de Regressão e Especificação Técnica

## 1. Visão Geral do Projeto
- **Nome:** Calculadora de Rendimento e Custo Real de Açougue (Web)
- **Objetivo:** Análise de rendimento de cortes cárneos a partir de amostragem tripla (pequena, média, grande), apuração de quebras de desossa, apropriação de custo real por corte, análise de lucratividade e projeção de compras/estoque.
- **Ambiente de Execução:** Navegador Web (HTML5/CSS3/JavaScript ES6+ moderno, modular, responsivo e sem dependências pesadas de build).
- **Testes Automatizados:** Suíte de testes unitários em Node.js (`node --test`).

---

## 2. Padrões de Engenharia e Boas Práticas
- **Tipagem e Defensividade:** Funções com validação de parâmetros, asserções (`assert`) e tratamento de valores nulos/inválidos.
- **Tamanho de Funções:** Funções focadas com no máximo 30 linhas (Princípio da Responsabilidade Única).
- **Precisão Numérica:** Arredondamento controlado para 3 casas decimais nos pesos (kg) e 2 casas decimais nos valores monetários (R$) e percentuais (%).
- **Persistência Segura:** LocalStorage no navegador para armazenamento local e opção de exportação/importação em JSON (conformidade com minimização de dados e LGPD).

---

## 3. Fórmulas de Negócio (Regras de Açougue)
1. **Quebra de Desossa (Perda Técnica):**
   $$\text{Quebra (kg)} = \text{Peso Total de Entrada} - \sum \text{Peso dos Cortes e Subprodutos}$$
   $$\text{Quebra (\%)} = \left(\frac{\text{Quebra (kg)}}{\text{Peso Total de Entrada}}\right) \times 100$$
2. **Rendimento Médio Ponderado (\%):**
   $$\text{Rendimento do Corte } i\text{ (\%)} = \left(\frac{\sum_{k=1}^3 \text{Peso do Corte } i \text{ na amostra } k}{\sum_{k=1}^3 \text{Peso Total de Entrada na amostra } k}\right) \times 100$$
3. **Produtividade de Desossa:**
   $$\text{Velocidade (kg/h)} = \frac{\text{Peso Total Desossado (kg)}}{\text{Tempo Total em Horas}}$$
4. **Custo Real Rateado por Corte (Método Ponderado por Valor Comercial):**
   $$\text{Faturamento Total da Peça} = \sum (\text{Peso Médio do Corte } i \times \text{Preço de Venda } i)$$
   $$\text{Margem Global da Peça} = \frac{\text{Faturamento Total} - \text{Custo Total}}{\text{Faturamento Total}}$$
   $$\text{Custo Real por kg do Corte } i = \text{Preço de Venda do Corte } i \times (1 - \text{Margem Global})$$
5. **Projeção de Compra de Estoque:**
   $$\text{Estoque Projetado do Corte } i \text{ (kg)} = \text{Volume de Compra (kg)} \times \text{Rendimento do Corte } i \text{ (\%)} / 100$$

---

## 4. Matriz de Regressão e Registro de Testes (Lei do Bug Registrado)

| ID | Data | Descrição / Caso de Teste | Causa Raiz | Solução / Implementação | Arquivo de Teste | Status |
|---|---|---|---|---|---|---|
| REG-001 | 2026-11-12 | Cálculo de quebra e rendimento ponderado da amostragem tripla do Dianteiro | Baseline inicial do Dianteiro fornecido pelo usuário | Implementação da função `calcularRendimentoAmostras` com validação de quebra | `test/calculadora.test.mjs` | PASS |
| REG-002 | 2026-11-12 | Apropriação de Custo Real por Corte e Margem Global de Açougue | Custo do quilo de osso/sebo é residual e a carne limpa absorve valor | Implementação de `calcularCustosERentabilidade` ponderada por preço de venda | `test/calculadora.test.mjs` | PASS |
| REG-003 | 2026-11-12 | Conversão de tempos de desossa e cálculo de produtividade (kg/h) | Entrada no formato HH:MM:SS ou MM:SS | Implementação de `parseTempoEmSegundos` e `formatarTempo` defensivos | `test/calculadora.test.mjs` | PASS |
| REG-004 | 2026-11-12 | Projeção de Compras e Estoque com base no rendimento percentual | Necessidade de estimar cortes gerados por volume bruto | Implementação de `projetarCompraEstoque` | `test/calculadora.test.mjs` | PASS |

---

## 5. Histórico de Versões e Entregas
- **v1.0.0 (2026-11-12):** Versão inicial da Calculadora Web de Desossa, Rendimento, Custo Real e Simulador de Compras.
