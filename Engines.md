# Engines.md - Governança, Matriz de Regressão e Especificação Técnica

## 1. Visão Geral do Projeto
- **Nome:** Calculadora de Rendimento e Custo Real de Açougue (Web)
- **Objetivo:** Análise de rendimento de cortes cárneos a partir de amostragem dinâmica (1 a N peças), apuração de quebras de desossa e perdas líquidas (sangue/líquidos), custeio baseado na peça-chave ou ponderado, gráficos de distribuição visual da carcaça (Lucrativos vs Subprodutos vs Quebras), simulador de compras e histórico auditável de recebimentos.
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
   $$\text{Custo do Corte } i \text{ (R\$/kg)} = \text{Custo da Peça-Chave (R\$/kg)}$$
   $$\text{Lucro/Prejuízo do Corte } i \text{ (R\$/kg)} = \text{Preço de Venda } i - \text{Custo } i$$
4. **Análise Individual por Peça:**
   $$\text{Faturamento da Peça } k = \sum (\text{Peso do Corte } i \text{ na Peça } k \times \text{Preço de Venda } i)$$
   $$\text{Lucro da Peça } k = \text{Faturamento da Peça } k - (\text{Peso Total da Peça } k \times \text{Custo de Entrada})$$

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
| REG-009 | 2026-11-12 | Agrupamento e cálculo da distribuição da composição da peça (Lucrativos vs Subprodutos vs Quebras) | Necessidade de visualização gráfica clara da divisão da carcaça | Implementação de `calcularDistribuicaoComposicaoPeca` | `test/calculadora.test.mjs` | PASS |
| REG-010 | 2026-11-13 | Análise individual de cada peça de rendimento (Ficha Técnica individual com quebra e lucro) | Necessidade de analisar cada peça lançada separadamente além da média geral | Implementação de `calcularAnaliseIndividualAmostra` | `test/calculadora.test.mjs` | PASS |
| REG-011 | 2026-11-13 | Parser e formatação de valores monetários e percentuais aceitando vírgula e ponto | `input type="number"` bloqueava tecla ponto e rejeitava vírgula no Windows PT-BR | Implementação de `parseValorMonetario` e `parseValorPercentual` universais | `test/calculadora.test.mjs` | PASS |
| REG-012 | 2026-11-13 | Exclusão confiável de Peças Principais e Cortes sem depender de `window.confirm()` | `window.confirm()` bloqueado silenciosamente pelo navegador | Substituição por Modal de Confirmação customizado e exclusão em cascata | `test/calculadora.test.mjs` | PASS |
| REG-013 | 2026-11-13 | Suporte a sistema zerado (0 amostras e exclusão da última peça sem NaN) | Trava `peca.amostras.length <= 1` impedia o usuário de zerar a tela para novo lançamento | Remoção da trava com tratamento defensivo e estado vazio limpo | `test/calculadora.test.mjs` | PASS |
| REG-014 | 2026-11-13 | Cálculo de sobra do corte principal e formatação de 3 casas decimais (ex: 0,000 kg e 0,140 kg) | Herança indevida de dados antigos de outros templates e exibição de decimais incompletos | Função `calcularSobraCorte` (botão ⚡Sobra) e `formatarKgValor` estrito com 3 decimais | `test/calculadora.test.mjs` | PASS |
| REG-015 | 2026-11-13 | Auditoria comparativa entre Cadastro Atual de ERP e Custo/Margem Real da Desossa | Ausência de campos para registrar o custo/margem que o sistema ERP atual da loja utiliza | Módulo de auditoria `calcularAuditoriaCorte`, campos de Custo Atual ERP e diagnóstico de Prejuízo Oculto | `test/calculadora.test.mjs` | PASS |
| REG-016 | 2026-11-13 | Fechamento de rendimento em 100% com Perda Técnica Automática (Manejo/Serra), inclusão da Peça Principal no catálogo/estoque e eliminação de pane de tela via Toasts | Falta de balanceamento automático da quebra residual como perda técnica comercial, ausência da peça principal desossada no estoque/rendimento e congelamento gráfico por `alert()` nativo durante transição de modal | Função `calcularPerdaTecnicaAuto` para fechar 100% do rendimento, inclusão automática da peça principal no catálogo/amostras, simulador de estoque duplo (peça inteira vs desossa) e sistema de Toasts não-bloqueantes | `test/calculadora.test.mjs` | PASS |
| REG-017 | 2026-11-16 | Multi-amostragem de desossa/limpeza com médias ponderadas exatas, sincronização universal de cortes e fechamento de rendimento em 100% | Desconexão de chaves entre amostras na tabela de desossa, perda de foco ao digitar devido a re-renderização total síncrona no evento input, soma truncada de amostras e divergência matemática em cortes compartilhados | Sincronização estrita de cortes (`sincronizarCortesPeca`), cálculo e exibição de Perda Técnica por coluna de limpeza, recálculo atômico não-destrutivo na digitação (`tratarInputTabelaDesossa`), renomeação terminológica para Peça Principal e Transformação/Limpeza e garantia de fechamento exato das médias | `test/calculadora.test.mjs` | PASS |

---

## 5. Histórico de Versões e Entregas
- **v1.0.0 (2026-11-12):** Versão inicial da Calculadora Web de Desossa, Rendimento, Custo Real e Simulador de Compras.
- **v1.1.0 (2026-11-12):** Multi-peças com templates cadastrais (Dianteiro, Patinho, Traseiro), amostragem dinâmica (1 a N peças), custeio por Peça-Chave com prejuízo contábil explícito, perdas líquidas e histórico de recebimentos.
- **v1.2.0 (2026-11-12):** Painel visual de distribuição da composição da carcaça e balanço financeiro gráfico da desossa.
- **v1.3.0 (2026-11-13):** Fichas técnicas individuais por peça lançada com análise isolada (quebra, custo, lucro) e exclusão/edição individual de qualquer peça da amostragem.
- **v1.4.0 (2026-11-13):** Correção da digitação de decimais (vírgula/ponto), formatação com máscara automática em moeda (R$) e percentual (%), e modal próprio de confirmação de exclusão.
- **v1.5.0 (2026-11-13):** Suporte completo a sistema zerado (0 peças ou amostras), cálculo inteligente de sobra/saldo para corte principal (botão ⚡Sobra) e formatação estrita de pesos em Kg com 3 casas decimais (`0,000 kg`, `0,140 kg`).
- **v1.6.0 (2026-11-13):** Módulo de Auditoria Comparativa de Cadastro (ERP Atual vs Desossa Real), campos de Custo Atual ERP e Margem Atual do cadastro, diagnóstico visual de divergências (🔴 Prejuízo Oculto, 🟡 Abaixo da Meta, 🟢 Margem Saudável) e template pronto da Alcatra Completa.
- **v1.7.0 (2026-11-13):** Fechamento de Rendimento em 100,00% via Perda Técnica Automática (Manejo e Serra), Peça Principal como Corte Nobre de Balcão e Item de Estoque Duplo (Venda Fechada vs Desossa Fracionada), atualização reativa instantânea entre abas e substituição definitiva de alerts por Toasts modernos.
- **v1.8.0 (2026-11-16):** Refatoração da terminologia de negócio ("Peça Principal" e "Transformação/Limpeza 1 a N"), sincronização bidirecional de cortes em todas as amostras, correção do cálculo de médias e rendimentos (ex: Cebo e Osso 0,146 + 0,094 + 0,124 = 0,121 kg), fechamento estrito de 100% com Perda Técnica por coluna e digitação fluida não-destrutiva sem perda de foco.
