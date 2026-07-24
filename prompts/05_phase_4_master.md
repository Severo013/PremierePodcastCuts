# Prompt 05 — Implementar Fase 4

As Fases 0 a 3 já foram testadas.

Implemente somente a criação da sequência master.

Antes de editar:

1. confirme a assinatura atual de `Project.createSequenceFromMedia` ou da alternativa oficial apropriada;
2. confirme como escolher o item/bin de destino;
3. confirme o tipo retornado;
4. registre as conclusões em `docs/ADOBE_API_NOTES.md`.

Requisitos:

- criar uma sequência baseada no vídeo selecionado;
- nomear como `00_MASTER - <projectName higienizado>`;
- validar previamente se o nome conflita com uma sequência existente;
- diante de conflito, abortar sem sobrescrever;
- manter vídeo e áudio completos;
- não criar cortes;
- não alterar mídia original;
- não salvar automaticamente;
- exibir sucesso ou erro no painel.

Não implemente efeitos, In/Out ou subsequências nesta fase.

Ao terminar, descreva como verificar resolução, frame rate, duração, vídeo e áudio da master.
