# Prompt 06 — Implementar Fase 5: um corte

A master já foi validada dentro do Premiere.

Implemente uma prova com somente o primeiro item de `cuts`. Não crie loop.

Antes de escrever:

1. pesquise no SDK e documentação oficiais as opções para criar uma sequência editável contendo um intervalo da mídia;
2. compare:
   - master + In/Out + subsequência;
   - nova sequência + inserção do trecho;
3. confirme as assinaturas e requisitos de Actions/transações;
4. documente a decisão em `docs/ADOBE_API_NOTES.md`;
5. apresente a estratégia e os riscos.

Requisitos:

- criar apenas o primeiro corte;
- usar início e fim normalizados;
- preservar vídeo e áudio sincronizados;
- duração com tolerância máxima de um frame;
- nome `01 - <nome higienizado>`;
- detectar conflito antes de criar;
- deixar sequência editável;
- fazer a timeline começar em zero quando a API permitir;
- não aplicar efeitos;
- não salvar automaticamente;
- produzir relatório no painel.

Não generalize para múltiplos cortes.

Ao terminar, forneça um teste manual usando um intervalo de dez segundos e explique como medir eventual desvio de frame.
