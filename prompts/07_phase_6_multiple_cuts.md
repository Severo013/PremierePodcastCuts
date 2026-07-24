# Prompt 07 — Implementar Fase 6

A criação de um único corte já foi validada manualmente no Premiere.

Generalize a implementação para todos os itens do JSON.

Requisitos:

- processar na ordem do array;
- gerar prefixos numéricos com zero à esquerda;
- detectar todos os conflitos de nomes antes de modificar o projeto;
- usar comportamento fail-fast;
- atualizar progresso `atual/total`;
- manter a interface bloqueada durante execução;
- restaurar a interface em `finally`;
- gerar relatório com solicitados, criados e falhas;
- não salvar automaticamente;
- não aplicar fades, áudio ou exportação;
- preservar a estratégia já validada na Fase 5;
- não refatorar áreas não relacionadas.

Teste com `samples/cuts.example.json`.

Ao terminar, explique como executar T11, T12, T13 e T14.
