# Instructions

Automatiza o processo de validação, commit e push de alterações para o repositório remoto com **detecção inteligente de contexto**.

## 🧠 Comportamento Inteligente

Este comando detecta automaticamente o estado atual:

- ✅ **Se não houver alterações**: Informa que não há nada para commitar
- ✅ **Se houver apenas commits não enviados**: Apenas faz push (pula validação e commit)
- ✅ **Se houver alterações não commitadas**: Executa fluxo completo (validação quando aplicável → commit → push)

## Fluxo Automatizado

Execute as seguintes etapas em ordem:

### 1. Verificar Status Git Primeiro
- Execute `git status --porcelain` para verificar mudanças
- **SE não houver mudanças E não houver commits para enviar:**
  * Reporte: "ℹ️ Não há alterações para commitar ou enviar"
  * **PARE** a execução
- **SE não houver mudanças MAS houver commits não enviados:**
  * Reporte: "ℹ️ Nenhuma alteração nova, apenas enviando commits existentes..."
  * **PULE** direto para a etapa **Push da branch** (sem validação npm, sem `git add`, sem commit)
- **SE houver mudanças:**
  * Continue para próxima etapa

### 2. Branch atual
- Execute `git branch --show-current` e use essa branch para o push.
- **Não** exija ticket INTS nem crie branch com padrão fixo; o fluxo deste repositório trabalha com o nome de branch que já estiver ativo (ex.: `main`, `agentes`, `feature/foo`).

### 3. Validações do projeto (condicionais)

Só execute npm na **raiz do repositório** quando o critério abaixo for atendido. Repositórios só com squads, markdown, YAML, etc. — sem `package.json` na raiz ou sem scripts — **não** precisam de `npm install` nem `package-lock.json` para este fluxo.

#### 3.1 TypeScript
- Leia `package.json` na raiz (se existir).
- **SE** existir `scripts.tsc` (ou equivalente usado pelo projeto, ex.: `"tsc": "tsc --noEmit"`):
  * Execute `npm run tsc -- --noEmit` (ou o comando definido no script, respeitando flags do projeto)
  * Se falhar, **PARE** e reporte os erros
- **SENÃO:**
  * Reporte: "ℹ️ Sem script `tsc` no `package.json` da raiz; validação TypeScript omitida."
  * Continue

#### 3.2 Testes
- **SE** na raiz existir `package.json` com `scripts.test` **E** existir ao menos um arquivo de teste em `tests/` com sufixo típico (`*.test.js`, `*.test.mjs`, `*.test.cjs`):
  * Execute `npm test -- --run` (ou o padrão do projeto para rodar testes uma vez)
  * Se falhar, **PARE** e reporte os erros
- **SENÃO:**
  * Reporte: "ℹ️ Sem suíte de testes na raiz (`tests/*.test.*` + script `test`); validação de testes omitida."
  * Continue

### 4. Listar Arquivos Modificados
- Liste os arquivos que serão commitados
- Mostre resumo: "X arquivo(s) modificado(s)"

### 5. Adicionar Arquivos ao Git
- Execute `git add .` para adicionar todos os arquivos modificados
- Respeite o `.gitignore` (não adicione arquivos ignorados)
- Confirme quais arquivos foram adicionados

### 6. Criar Commit
- Verifique se há mudanças staged com `git status --porcelain`
- Analise as mudanças e crie uma descrição breve e clara em português do Brasil
- Use **Conventional Commits** sem ticket obrigatório, por exemplo:
  * `feat: descrição` — nova funcionalidade ou conteúdo relevante
  * `fix: descrição` — correção
  * `chore: descrição` — manutenção, ajustes de tooling
  * `docs: descrição` — documentação
- **Não** use prefixo `feat(INTS-XXX):` neste repositório
- Reporte o hash do commit criado

### 7. Push da Branch
- Execute `git push origin <branch-name>` 
- Se a branch não existir no remoto, use `git push --set-upstream origin <branch-name>`
- Confirme que o push foi bem-sucedido

## Tratamento de Erros

Para cada etapa:
- ✅ Reporte claramente sucesso ou falha
- ✅ Se etapa crítica falhar, pare a execução
- ✅ Mostre mensagens em português
- ✅ Sugira próximos passos em caso de erro

## Output Final Esperado

Após execução bem-sucedida, exiba (adaptando as linhas ao que foi de fato executado):

```
✅ Branch: <nome-atual>
✅ TypeScript: <validado sem erros | omitido — sem script tsc>
✅ Testes: <executados com sucesso | omitidos — sem suíte na raiz>
✅ X arquivo(s) adicionado(s) ao git
✅ Commit criado: <hash> - <mensagem>
✅ Push realizado para origin/<branch>
```

## ⚠️ Validações

- **TypeScript e testes não são universais**: só são obrigatórios **quando** o repositório os define na raiz (critérios da etapa 3). Se omitidos, não bloqueiam commit/push.
- Quando **executados**, devem passar; se falharem, **PARE** e corrija antes de commitar.
- **Não** exigir `package-lock.json`; muitos clones usam só conteúdo de squads ou `package.json` mínimo.

## Segurança e Boas Práticas

- ❌ **NÃO** fazer force push
- ❌ **NÃO** commitar arquivos sensíveis ou temporários
- ❌ **NÃO** pular hooks do git (`--no-verify`)
- ✅ Respeitar `.gitignore`
- ✅ Rodar TypeScript/testes **quando o projeto os tiver** na raiz
- ✅ Mensagens de commit descritivas (Conventional Commits, em português quando fizer sentido)

## Comandos Relacionados

- Use `/create-pr` para criar uma nova Pull Request após fazer push
- Use `/update-pr` para atualizar uma PR existente com novos commits
- Fluxo completo: `/commit-push` → `/create-pr` (primeira vez) ou `/update-pr` (atualizações)
