# Domain Framework: Análise de Produtividade do Time

## Passo 1: Coleta e Limpeza de Dados
1. Extrair issues concluídas no período selecionado via Jira (JQL).
2. Extrair histórico de transições de status para cálculo de tempos.
3. Identificar bugs e alertas associados ao período/versão.
4. **Filtro de Time:** Filtrar SEMPRE pelos seguintes responsáveis: "Adriel Henrique Borges Cochito", "Antonio Balardino", "Bruna Elis Vogel", "Daniel Cruz", "Wellington Casas", "Pedro Bittencourt", "Jonas Elan", "Maria Eduarda da Silva Joaquim".

## Passo 2: Cálculo de Métricas (Analista)
1. Calcular Cycle Time (mediana e p90) por tipo de issue.
2. Calcular Throughput total e por tipo de issue.
3. Avaliar WIP médio no período.
4. Calcular taxa de bugs criados vs resolvidos.

## Passo 3: Identificação de Padrões
1. Comparar métricas atuais com o período anterior (baseline).
2. Identificar gargalos (status onde as issues passam mais tempo).
3. Sinalizar anomalias (issues que estouraram o p90).

## Passo 4: Tradução e Storytelling (Escritor)
1. **Visão Diretoria:** Focar em throughput de valor, SLAs, riscos e previsibilidade.
2. **Visão Gestão:** Focar em gargalos, WIP, eficiência do fluxo e qualidade.
3. **Visão Time:** Focar em melhoria contínua, itens problemáticos da sprint e ações práticas.