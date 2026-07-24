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

## Carregar o plugin no Premiere

1. Abra o Adobe Premiere e mantenha-o em execução.
2. Abra o UXP Developer Tool.
3. Clique em `Add Plugin`.
4. Selecione o arquivo `manifest.json` na raiz deste repositório.
5. Na linha do plugin `PremierePodcastCuts`, clique em `Load`.
6. No Premiere, abra `Window > UXP Plugins > PremierePro Starter Panel Project`.

Depois de alterar HTML, CSS ou JavaScript, clique em `Reload` no UXP
Developer Tool para recarregar o painel.

## Testar o painel

1. Abra o painel no Premiere.
2. Clique em `Selecionar JSON` e selecione `samples/cuts.example.json`.
3. Clique em `Selecionar MP4` e escolha um vídeo de teste.
4. Confirme que o painel mostra os dois nomes e habilita `Criar cortes`.
5. Clique em `Criar cortes` e confira o log da simulação.

O teste apenas valida o estado da interface: não acessa nem modifica o projeto
aberto.

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
