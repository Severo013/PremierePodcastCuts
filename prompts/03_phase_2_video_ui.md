# Prompt 03 — Implementar Fase 2

As Fases 0 e 1 já foram testadas.

Implemente somente a Fase 2 de `docs/ROADMAP.md`.

Requisitos:

- adicionar seleção de um único arquivo `.mp4`;
- preservar referência de arquivo e caminho nativo apenas pelos meios suportados pelo UXP;
- mostrar nome do vídeo selecionado;
- lidar com cancelamento;
- criar um estado de interface explícito;
- habilitar `Criar cortes` somente quando JSON válido e vídeo selecionado existirem;
- ao clicar em `Criar cortes`, ainda não alterar o projeto;
- por enquanto, simular a execução validando o estado e escrevendo no log;
- bloquear os controles durante a simulação e restaurá-los em `finally`;
- mostrar área de log e mensagens de erro;
- não importar mídia;
- não criar sequências;
- não adicionar dependências.

Evite misturar manipulação da interface com parsing e validação.

Ao terminar, explique como validar manualmente a transição entre `idle`, seleção parcial, `ready`, execução e erro.
