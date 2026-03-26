---
type: checkpoint
---

# Step 04: Aprovação de Conteúdo (antes da revisão)

## Context Loading

Antes de responder ao checkpoint, abra e leia:
- `squads/goals-tracker/output/leadership-report.md` — Relatório para liderança deste run.
- `squads/goals-tracker/output/team-report.md` — Relatório para o time deste run.
- `squads/goals-tracker/pipeline/data/quality-criteria.md` — Lista de verificação opcional para sua leitura.

## Instructions

### Process
1. Leia os dois relatórios na íntegra na ordem: primeiro liderança, depois time.
2. Verifique se o tom, os números e as keys de issue fazem sentido em conjunto; anote mentalmente qualquer inconsistência entre os dois textos.
3. Decida se o conteúdo pode seguir para a **Renata Revisão** (revisão leve unificada) ou se precisa de ajustes antes.
4. Responda ao Pipeline Runner usando o formato de saída abaixo (pode colar no chat).

## Output Format

O Pipeline Runner deve registrar sua resposta. Use exatamente esta estrutura:
```markdown
# Content Approval — Goals Tracker

## Decision
- [ ] APPROVE — seguir para revisão (step 05)
- [ ] REQUEST CHANGES — não seguir até correções

## Summary (1–3 frases)
[O que está bom e/ou o que falha]

## Required changes (if REQUEST CHANGES)
1. [Arquivo: leadership | team] — [mudança específica]
2. ...

## Notes for reviewer (optional)
- ...
```

## Output Example

# Content Approval — Goals Tracker

## Decision
- [x] APPROVE — seguir para revisão (step 05)
- [ ] REQUEST CHANGES — não seguir até correções

## Summary (1–3 frases)
Os relatórios estão alinhados entre si e com o snapshot desta semana. O ângulo de decisão na liderança está claro; o time tem transparência sobre o bloqueio de arquitetura.

## Required changes (if REQUEST CHANGES)
1. N/A

## Notes for reviewer (optional)
- Confirmar se o tom do team report está adequado ao canal interno habitual.

## Veto Conditions

Não avance para o próximo passo se ANY of these for true:
1. Você não leu ambos os arquivos `leadership-report.md` e `team-report.md` deste run.
2. Você aprova com **APPROVE** enquanto há divergência numérica óbvia entre os dois relatórios sem nota explicativa (deve ser **REQUEST CHANGES**).

## Quality Criteria

- [ ] A decisão (APPROVE vs REQUEST CHANGES) está explícita.
- [ ] Em REQUEST CHANGES, cada item cita qual arquivo deve ser alterado e o que mudar.
- [ ] O resumo reflete leitura real, não genérica.
