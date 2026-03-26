# Output Examples: Relatórios de Produtividade

## Exemplo: Visão Diretoria
**Resumo Executivo:**
Neste ciclo, o time aumentou as entregas em 15% (Throughput), mas observamos um aumento de 20% no tempo de resolução de bugs críticos. Isso significa um risco moderado para a estabilidade da plataforma no próximo lançamento. Recomendamos alocar 20% da capacidade da próxima semana exclusivamente para redução de dívida técnica.

**Principais Indicadores:**
- Entregas de Valor: 45 itens (+15% vs ciclo anterior)
- Previsibilidade (Cycle Time p90): 5.2 dias (Estável)
- Qualidade (Bugs Críticos): 12 novos, 8 resolvidos (Atenção necessária)

## Exemplo: Visão Gestão
**Análise de Fluxo e Gargalos:**
- **Cycle Time Mediano:** 3.1 dias.
- **Gargalo Identificado:** O status "Aguardando Code Review" acumulou um WIP médio de 8 itens (o dobro do limite recomendado). Isso significa que o time está codificando mais rápido do que consegue revisar.
- **Qualidade:** A taxa de escape de bugs subiu para 15%. A maioria originou-se de integrações legadas.
- **Ação Recomendada:** Implementar política de "WIP Limit" na coluna de Review e pareamento obrigatório para integrações legadas.

## Exemplo: Visão Time
**Retrospectiva Baseada em Dados:**
Fala time! Nesta sprint mandamos muito bem no volume de entregas (45 itens!), mas nosso fluxo travou na etapa de Code Review.
- **O que foi bem:** Reduzimos o tempo de teste em 30%.
- **Onde doeu:** A issue PROJ-1024 ficou 6 dias parada em Review.
- **Para a próxima sprint:** Vamos combinar de ninguém puxar um card novo para "In Progress" se houver mais de 5 cards em "Review". Topam?