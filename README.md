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

- Adobe Premiere 25.6 ou superior;
- UXP Developer Tool 2.2 ou superior;
- Visual Studio Code;
- Developer Mode habilitado no Premiere;
- Projeto inicial criado com o template `premierepro-quick-starter`.

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
