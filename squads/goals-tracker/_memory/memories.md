# Goals Tracker — memória persistente

## Metas do semestre (automático em todo run)

As **definições canônicas** de metas (pesos, Jira, planilha, épico, time) estão em:

**`squads/goals-tracker/pipeline/data/squad-goals.md`**

**Visão única para acompanhar todas as metas** (tabelas, links Jira/Sheets, checklist): abra no navegador  
**`squads/goals-tracker/pipeline/data/goals-overview.html`**

**SLA alertas (Urgente/Alta &lt; 2d):** a cada run, usar Jira com a JQL em **`pipeline/data/jira-queries.md`** (`search_jira`); não deixar a linha como “não medido” sem executar a busca.

**N3 — SLA tickets &lt; 48h:** usar **`project IN (N3)`** + **`assignee IN (...)` exclusivo** (oito colaboradores) em **`pipeline/data/jira-queries.md`**; medir **created → `resolutiondate`** ≤ **48h** (usar proxy só se `resolutiondate` não vier no MCP). **Tickets/integração &lt; 1,6** é outra métrica (razão com denominador fluxos integrados + escopo integração) — **não** amarrar ao filtro assignee do SLA.

O Pipeline Runner já carrega `memories.md`; os **passos 01–03** também devem carregar `squad-goals.md` antes de pesquisar, analisar ou redigir. **Não** substituir esse escopo por um recorte genérico de épicos sem relacionar com as linhas de meta desse arquivo.

### Pendência da criação do squad

- **Edição de integração (20% da Eficiência máxima):** chave de épico Jira não foi informada na mensagem original — ao definir, atualize `pipeline/data/squad-goals.md` (linha do épico) para o snapshot passar a rastrear.

## Aprendizados de runs (preencher após aprovações)

_(Espaço para notas pós-checkpoint: o que aprovou, ajustes de escopo, URLs de abas da planilha, etc.)_
