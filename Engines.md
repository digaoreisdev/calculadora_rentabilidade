# Engines.md - Governança, Matriz de Regressão e Especificação Técnica

## 1. Visão Geral do Projeto
- **Nome:** Calculadora de Rendimento e Custo Real de Açougue (Web)
- **Objetivo:** Análise de rendimento de cortes cárneos a partir de amostragem dinâmica (1 a N peças), apuração de quebras de desossa e perdas líquidas (sangue/líquidos), custeio baseado na peça-chave ou ponderado, controle de margens por corte/peça, simulador de compras e histórico auditável de recebimentos.
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
2. **Rendimento Médio Ponderado (\% de 1 a N Amostras):**
   $$\text{Rendimento do Corte } i\text{ (\%)} = \left(\frac{\sum_{k=1}^N \text{Peso do Corte } i \text{ na amostra } k}{\sum_{k=1}^N \text{Peso Total de Entrada na amostra } k}\right) \times 100$$
3. **Custeio Baseado na Peça-Chave (Regra do Açougueiro):**
   - Todos os cortes e perdas herdam o custo de compra da peça inteira:
     $$\text{Custo do Corte } i \text{ (R\$/kg)} = \text{Custo da Peça-Chave (R\$/kg)}$$
   - Resultado unitário:
     $$\text{Lucro/Prejuízo do Corte } i \text{ (R\$/kg)} = \text{Preço de Venda } i - \text{Custo } i$$
   - Em subprodutos (sebo/osso a R$ 1,48 e custo R$ 21,45) e perdas líquidas (sangue a R$ 0,00 e custo R$ 21,45), o resultado é negativo (prejuízo explícito).
4. **Margem e Preço de Venda:**
   $$\text{Margem Real (\%)} = \left(\frac{\text{Preço de Venda} - \text{Custo}}{\text{Preço de Venda}}\right) \times 100$$
   $$\text{Preço Sugerido com Base na Margem Desejada} = \frac{\text{Custo}}{1 - (\text{Margem Desejada} / 100)}$$
5. **Produtividade de Desossa:**
   $$\text{Velocidade (kg/h)} = \frac{\text{Peso Total Desossado (kg)}}{\text{Tempo Total em Horas}}$$
6. **Projeção de Compra de Estoque:**
   $$\text{Estoque Projetado do Corte } i \text{ (kg)} = \text{Volume de Compra (kg)} \times \text{Rendimento do Corte } i \text{ (\%)} / 100$$

---

## 4. Matriz de Regressão e Registro de Testes (Lei do Bug Registrado)

| ID | Data | Descrição / Caso de Teste | Causa Raiz | Solução / Implementação | Arquivo de Teste | Status |
|---|---|---|---|---|---|---|
| REG-001 | 2026-11-12 | Cálculo de quebra e rendimento ponderado da amostragem do Dianteiro | Baseline inicial do Dianteiro fornecido pelo usuário | Implementação da função `calcularRendimentoAmostras` com validação de quebra | `test/calculadora.test.mjs` | PASS |
| REG-002 | 2026-11-12 | Apropriação de Custo Real por Corte e Margem Global de Açougue | Custo do quilo de osso/sebo é residual e a carne limpa absorve valor | Implementação de `calcularCustosERentabilidade` ponderada por preço de venda | `test/calculadora.test.mjs` | PASS |
| REG-003 | 2026-11-12 | Conversão de tempos de desossa e cálculo de produtividade (kg/h) | Entrada no formato HH:MM:SS ou MM:SS | Implementação de `parseTempoEmSegundos` e `formatarTempo` defensivos | `test/calculadora.test.mjs` | PASS |
| REG-004 | 2026-11-12 | Projeção de Compras e Estoque com base no rendimento percentual | Necessidade de estimar cortes gerados por volume bruto | Implementação de `projetarCompraEstoque` | `test/calculadora.test.mjs` | PASS |
| REG-005 | 2026-11-12 | Suporte dinâmico a 1, 2 ou N amostras para média geral de desossa | Anteriormente restrito a 3 amostras fixas | Generalização do processador de amostras para array de tamanho arbitrário $\ge 1$ | `test/calculadora.test.mjs` | PASS |
| REG-006 | 2026-11-12 | Custeio por Peça-Chave e apuração de prejuízo contábil em osso, sebo e líquidos | Custo de cada corte igual ao da peça inteira (ex: R$ 21,45), gerando prejuízo em sebo/sangue | Implementação de `calcularCustosPecaChave` com cálculo de margens individuais e perdas líquidas | `test/calculadora.test.mjs` | PASS |
| REG-007 | 2026-11-12 | Alternância entre Custo da Peça-Chave, Custo Livre e Margem Geral vs Individual | Necessidade de flexibilidade de gestão | Suporte aos modos `peca_chave`, `livre`, `margem_global` e `margem_individual` | `test/calculadora.test.mjs` | PASS |

---

## 5. Histórico de Versões e Entregas
- **v1.0.0 (2026-11-12):** Versão inicial da Calculadora Web de Desossa, Rendimento, Custo Real e Simulador de Compras.
- **v1.1.0 (2026-11-12):** Multi-peças com templates cadastrais (Dianteiro, Patinho, Traseiro), amostragem dinâmica (1 a N peças), custeio por Peça-Chave com prejuízo contábil explícito, perdas líquidas e histórico de recebimentos.
