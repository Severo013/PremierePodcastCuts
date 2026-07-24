# Prompt 04 — Implementar Fase 3

As Fases 0 a 2 já foram testadas no Premiere.

Implemente somente a Fase 3: integração mínima com o projeto e importação/localização do vídeo.

Antes de escrever código:

1. inspecione as declarações TypeScript ou SDK da API `premierepro` disponível;
2. confirme na documentação oficial como:
   - obter o projeto ativo;
   - acessar o root item ou bin;
   - importar arquivo;
   - localizar um item por media path ou identificar o item importado;
3. registre em `docs/ADOBE_API_NOTES.md` as assinaturas confirmadas;
4. apresente a estratégia que será usada.

Requisitos:

- encapsular integração em `premiere-adapter`;
- falhar claramente sem projeto ativo;
- reutilizar o item se o mesmo media path já estiver presente, quando a API permitir;
- importar o MP4 quando ausente;
- não criar master;
- não criar cortes;
- não salvar automaticamente o projeto;
- não excluir ou renomear itens existentes;
- retornar informações simples para a UI;
- escrever log da operação.

Implemente primeiro a menor prova funcional possível.

Ao terminar, forneça o roteiro para testar T06, T07 e T08 e indique qualquer comportamento da API que ainda esteja incerto.
