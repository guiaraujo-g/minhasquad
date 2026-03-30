# Quality Criteria: Relatórios de Produtividade

## Critérios Globais
- [ ] Todo insight deve ser acompanhado de uma implicação de negócio ("Isso significa que...").
- [ ] Nenhuma métrica deve ser apresentada sem contexto (comparação com período anterior ou meta).
- [ ] O tom deve ser construtivo e focado no sistema/processo, não em culpar indivíduos.
- [ ] **`dashboard-final.html`** deve existir em todo run (mesmo diretório versionado que `final-reports.md`), com as cinco seções do layout de referência e dados alinhados ao período analisado.
- [ ] No HTML: Visão Diretoria com os **quatro cards** (SP sprint INTS+IOAM; N3 só do time; alertas criados; alertas resolvidos); Visão Gestão com **gráfico** meta 30 SP/pessoa; Visão Histórica com **≤7 colunas de mês** e **filtro** funcional.
- [ ] O HTML segue a **estrutura atual** de `pipeline/data/dashboard-layout-reference.html` (cada novo relatório deve refletir o reference do repositório, não um dashboard antigo).

## Visão Diretoria (Executiva)
- [ ] O resumo executivo tem no máximo 5 linhas.
- [ ] Jargões técnicos (como "JQL", "Story Points") foram traduzidos para impacto de negócio (risco, prazo, custo).
- [ ] Apresenta uma recomendação clara de decisão.

## Visão Gestão
- [ ] Identifica claramente o principal gargalo do fluxo atual.
- [ ] Apresenta dados de qualidade (bugs/alertas) em paralelo com dados de entrega (throughput).

## Visão Time (Retrospectiva)
- [ ] Traz exemplos específicos de issues que causaram problemas (outliers).
- [ ] Foca em melhorias acionáveis para a próxima sprint/ciclo.