# Premiere Horizontal Cut Automation

Plugin UXP para Adobe Premiere que cria sequências editáveis a partir de um vídeo MP4 e de uma lista de intervalos anotados em JSON.

## Objetivo do MVP

O usuário seleciona:

1. Um arquivo de vídeo `.mp4`;
2. Um arquivo `.json` com início, fim e nome de cada momento.

O plugin:

1. Valida o JSON;
2. Importa ou localiza o vídeo no projeto;
3. Cria uma sequência master baseada na mídia;
4. Cria uma sequência editável para cada intervalo;
5. Preserva áudio e vídeo;
6. Exibe um relatório final.

O MVP não aplica fades, tratamento de áudio nem exportação automática.

## Requisitos de desenvolvimento

- Adobe Premiere 26.3 ou superior, conforme `manifest.json`;
- UXP Developer Tool 2.2 ou superior;
- Visual Studio Code;
- Developer Mode habilitado no Premiere;
- Projeto inicial criado com o template `premierepro-quick-starter`.

## Carregar o plugin no Premiere

1. No Premiere, abra as configurações de plugins e habilite `Developer Mode`.
2. Reinicie o Premiere e mantenha-o aberto.
3. Abra o UXP Developer Tool 2.2 ou superior.
4. Clique em `Add Plugin`.
5. Selecione o arquivo `manifest.json` na raiz deste repositório.
6. Na linha do plugin `PremierePodcastCuts`, clique em `Load`.
7. No Premiere, abra `Window > UXP Plugins > Premiere Podcast Cuts`.

Depois de alterar HTML, CSS ou JavaScript, clique em `Reload` no UXP
Developer Tool para recarregar o painel.
Alterações no `manifest.json` exigem `Unload` seguido de `Load`.

## Uso completo

1. Abra ou crie um projeto no Premiere.
2. Abra o painel `Premiere Podcast Cuts`.
3. Clique em `Selecionar JSON`; para a prova, use
   `samples/cuts.example.json`.
4. Clique em `Selecionar MP4` e escolha o vídeo ao qual os timestamps se
   referem.
5. Confira arquivo, projeto, quantidade e resumo dos cortes.
6. Clique em `Criar cortes` e acompanhe o progresso `atual/total`.
7. Confira no relatório a master, a mídia reutilizada/importada, os nomes
   criados, as durações e eventuais falhas.

Se `00_MASTER - <projectName>` não existir, o plugin localiza ou importa o MP4 e
cria a master. Se existir, ela somente é reutilizada quando um item de vídeo da
sequência referencia exatamente o caminho nativo do MP4 selecionado. Uma master
com o mesmo nome e outra mídia causa aborto sem alteração.

Os cortes são processados na ordem do JSON como `01 - ...`, `02 - ...`,
`03 - ...`. Todos os conflitos são verificados antes de importar mídia ou criar
sequências. Um erro durante os cortes interrompe os seguintes; os já concluídos
permanecem e aparecem no relatório.

## Contrato e limites

- JSON conforme `docs/JSON_FORMAT.md`, com `schemaVersion: 1`;
- um único `.json` e um único `.mp4` por execução;
- timestamps `HH:MM:SS.mmm`, `H:MM:SS`, `MM:SS` ou `MM:SS.mmm`;
- horas podem ultrapassar `01`, desde que o intervalo exista na mídia;
- até 5 milhões de caracteres e 1000 cortes por JSON;
- o painel exibe os primeiros 200 cortes e processa todos os cortes validados;
- nomes são higienizados e limitados a 100 caracteres antes do prefixo;
- cancelar qualquer seletor preserva a seleção anterior.

## Segurança e comportamento de erro

- sequências existentes nunca são sobrescritas;
- a reutilização de mídia compara o caminho nativo completo;
- o MP4 original não é alterado;
- nenhum item é excluído ou renomeado fora das novas sequências;
- o projeto não é salvo automaticamente;
- não são aplicados efeitos, fades, presets ou exportação;
- falhas mostram contexto no painel e detalhes no Console do UXP Developer Tool.

## Executar os testes de domínio

Com Node.js disponível no terminal, execute:

```text
npm test
```

Os testes usam apenas o módulo `assert` nativo e não exigem instalação de
dependências.

Neste ambiente, que possui Deno mas não Node.js, a mesma suíte pode ser executada
com:

```text
deno run --allow-read --unstable-detect-cjs tests/domain.test.js
```

## Depurar

1. No UXP Developer Tool, localize o plugin carregado.
2. Clique em `Debug` para abrir o Developer Tools do painel.
3. Selecione a aba `Console` para consultar erros e mensagens.
4. Repita a seleção e validação do JSON com o console aberto.

Para um JSON válido, o resultado esperado é nenhum erro no console.

## Como usar estes documentos com o Codex

1. Coloque todos os arquivos deste pacote na raiz do repositório.
2. Abra a raiz do projeto no VS Code.
3. Peça ao Codex para ler `AGENTS.md`, `docs/PRODUCT_SPEC.md`, `docs/ARCHITECTURE.md` e `docs/ROADMAP.md`.
4. Execute os prompts de `prompts/` em ordem.
5. Teste cada fase dentro do Premiere antes de avançar.

## Documentos

- `AGENTS.md`: regras permanentes para o agente;
- `docs/PRODUCT_SPEC.md`: comportamento esperado;
- `docs/ARCHITECTURE.md`: módulos e fluxo técnico;
- `docs/JSON_FORMAT.md`: contrato do arquivo de entrada;
- `docs/ROADMAP.md`: fases incrementais;
- `docs/ACCEPTANCE_TESTS.md`: testes manuais e critérios de aceite;
- `docs/ADOBE_API_NOTES.md`: cuidados com UXP e API do Premiere;
- `prompts/`: comandos prontos para o Codex;
- `samples/cuts.example.json`: exemplo de entrada.

## Princípio do projeto

Cada fase deve terminar com uma versão pequena, executável e testável. Não avançar enquanto a fase atual não funcionar no Premiere.
