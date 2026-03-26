# Anti-Patterns: Análise de Produtividade

## Never Do (O que nunca fazer)
1. **Usar Story Points como medida de produtividade:** Story points são para estimativa, não para medir output. Usá-los para produtividade incentiva a inflação de pontos (gaming).
2. **Comparar times diferentes:** Cada time tem seu contexto, arquitetura e complexidade. Comparar Cycle Time do Time A com o Time B gera competição tóxica. Compare o time apenas com seu próprio histórico.
3. **Apresentar números sem contexto:** Dizer "Entregamos 40 itens" não significa nada. Sempre diga "Entregamos 40 itens (vs 35 no período passado)".
4. **Focar apenas em velocidade (Throughput) ignorando qualidade:** Acelerar entregas gerando mais bugs em produção é um falso ganho. Sempre apresente métricas de fluxo junto com métricas de qualidade.

## Always Do (O que sempre fazer)
1. **Usar percentis (p85, p90) em vez de médias simples:** Médias escondem outliers. O p90 mostra a previsibilidade real do time (ex: "90% das nossas tarefas levam até 5 dias").
2. **Traduzir jargões para a diretoria:** Executivos não precisam saber o que é "WIP Limit". Eles precisam saber que "limitar o trabalho paralelo reduz o tempo de entrega ao cliente".
3. **Propor ações concretas:** Todo relatório deve terminar com "O que faremos a respeito disso?".