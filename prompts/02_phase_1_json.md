# Prompt 02 — Implementar Fase 1

A Fase 0 já foi testada no Premiere.

Leia `AGENTS.md`, `docs/JSON_FORMAT.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md` e `docs/ACCEPTANCE_TESTS.md`.

Implemente somente a Fase 1: seleção, leitura, parsing e validação do JSON.

Requisitos:

- usar a UXP Storage API suportada pela versão instalada;
- garantir no manifest apenas a permissão mínima necessária para file picker;
- permitir selecionar um único `.json`;
- lidar com cancelamento sem erro;
- ler o conteúdo como texto;
- executar `JSON.parse`;
- validar `schemaVersion`, `projectName` e `cuts`;
- implementar parsing de timestamps;
- aceitar o formato canônico e as formas opcionais descritas no contrato;
- produzir internamente `startSeconds`, `endSeconds` e `durationSeconds`;
- detectar IDs duplicados;
- detectar fim menor ou igual ao início;
- mostrar no painel o arquivo, número de cortes e uma lista/resumo;
- mostrar erros compreensíveis;
- ainda não selecionar vídeo;
- não acessar o projeto do Premiere;
- manter lógica pura separada da UI;
- criar testes simples para funções puras caso a base permita sem introduzir framework pesado.

Antes de usar qualquer API UXP, confirme sua assinatura na documentação ou SDK local.

Ao terminar, informe:

1. arquivos alterados;
2. contrato efetivamente aceito;
3. como executar os testes;
4. como validar manualmente T02 a T05;
5. limitações encontradas.
