---
type: checkpoint
---

# Step 06: Aprovação Final

## Context Loading

Antes de decidir, tenha em mãos:
- `squads/goals-tracker/output/leadership-report.md` — Versão final para liderança.
- `squads/goals-tracker/output/team-report.md` — Versão final para o time.
- `squads/goals-tracker/output/review-notes.md` — Veredito e notas da Renata Revisão.
- `squads/goals-tracker/output/research-snapshot.md` — Referência se quiser validar um número em última instância.

## Instructions

### Process
1. Confirme que leu o veredito em `review-notes.md`. Se for **REJECT**, não use este checkpoint para “forçar” aprovação — volte ao escritor conforme o fluxo do Opensquad.
2. Faça uma leitura final dos dois relatórios; confira se refletem a intenção de comunicação para cada audiência.
3. Escolha encerrar o pipeline e liberar distribuição, ou registrar follow-up (ex.: revisão legal interna) sem bloquear o encerramento técnico.
4. Responda usando o formato abaixo para que o Pipeline Runner possa arquivar a decisão e atualizar memória do squad.

## Output Format

Use esta estrutura na sua resposta ao Pipeline Runner:
```markdown
# Final Approval — Goals Tracker

## Decision
- [ ] COMPLETE — distribuição autorizada
- [ ] COMPLETE WITH NOTES — distribuição autorizada com ressalvas documentadas
- [ ] HOLD — não distribuir (explicar)

## Distribution intent
- Leadership report: [canal/público previsto]
- Team report: [canal/público previsto]

## Ressalvas ou próximos passos (optional)
- ...
```

## Output Example

# Final Approval — Goals Tracker

## Decision
- [x] COMPLETE — distribuição autorizada
- [ ] COMPLETE WITH NOTES — distribuição autorizada com ressalvas documentadas
- [ ] HOLD — não distribuir (explicar)

## Distribution intent
- Leadership report: reunião de staff + e-mail para diretoria de produto e engenharia.
- Team report: canal interno do squad + retrospectiva semanal.

## Ressalvas ou próximos passos (optional)
- Atualizar o deck de roadmap quando a decisão de arquitetura sair.

## Veto Conditions

Não marque o pipeline como concluído para distribuição se ANY of these for true:
1. `review-notes.md` indica **REJECT** e must-fix bloqueante ainda não foi endereçado no texto dos relatórios.
2. Você não confirmou leitura de ambos `leadership-report.md` e `team-report.md`.

## Quality Criteria

- [ ] Decisão explícita entre COMPLETE, COMPLETE WITH NOTES e HOLD.
- [ ] Canais ou públicos de distribuição indicados para cada relatório.
- [ ] Ressalvas documentadas quando COMPLETE WITH NOTES ou HOLD.
