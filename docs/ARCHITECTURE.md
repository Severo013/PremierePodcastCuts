# Arquitetura

## 1. Plataforma

- Tipo: plugin com painel UXP;
- host: Adobe Premiere;
- linguagem inicial: JavaScript;
- interface: HTML/CSS com componentes suportados pelo UXP;
- entrada de arquivos: UXP Storage API;
- integração de edição: Premiere UXP DOM API.

O UXP não é um navegador completo. Não assumir disponibilidade de APIs web ou Node.js sem confirmar suporte.

## 2. Visão geral

```text
UI
 ├─ seleciona JSON
 ├─ seleciona MP4
 └─ inicia execução
        ↓
Input service
 ├─ lê JSON
 └─ obtém referência/caminho da mídia
        ↓
Parser e validator
 ├─ normaliza timestamps
 ├─ valida contrato
 └─ produz CutDefinition[]
        ↓
Premiere adapter
 ├─ obtém projeto ativo
 ├─ localiza/importa mídia
 ├─ cria master
 └─ cria sequências de corte
        ↓
Execution report
 ├─ progresso
 ├─ itens criados
 └─ erros
```

## 3. Estrutura sugerida

A estrutura pode ser adaptada ao template real do UXP Developer Tool, mas deve preservar as responsabilidades.

```text
src/
├── index.js
├── ui/
│   ├── panel.js
│   └── status-view.js
├── domain/
│   ├── timestamp.js
│   ├── cuts-parser.js
│   ├── cuts-validator.js
│   └── sequence-name.js
├── infrastructure/
│   ├── file-picker.js
│   └── premiere-adapter.js
└── application/
    └── create-cuts.js
```

No primeiro scaffold, é aceitável começar com menos arquivos. Separar módulos quando cada responsabilidade estiver validada.

## 4. Modelos internos

### CutDefinition

```js
{
  id: 1,
  name: "Tema do corte",
  startText: "00:12:34.500",
  endText: "00:22:10.000",
  startSeconds: 754.5,
  endSeconds: 1330,
  durationSeconds: 575.5
}
```

### InputState

```js
{
  jsonFile: null,
  videoFile: null,
  projectName: "",
  cuts: [],
  validationErrors: []
}
```

### ExecutionReport

```js
{
  requested: 3,
  created: [],
  failed: [],
  masterSequenceName: null,
  startedAt: null,
  finishedAt: null
}
```

## 5. Separação de responsabilidades

### `timestamp.js`

Funções puras:

- `parseTimestamp(value)`;
- `formatTimestamp(seconds)`;
- validação de horas, minutos, segundos e milissegundos.

Não deve importar APIs do Premiere.

### `cuts-parser.js`

- executa `JSON.parse`;
- verifica estrutura de alto nível;
- normaliza campos opcionais;
- converte itens em modelo interno.

### `cuts-validator.js`

- valida cada corte;
- detecta IDs duplicados;
- detecta nomes vazios;
- valida ordem temporal;
- opcionalmente compara com duração da mídia quando essa informação estiver disponível.

### `sequence-name.js`

- gera prefixo numérico;
- remove caracteres inválidos;
- reduz espaços;
- aplica nome padrão;
- limita tamanho se necessário.

### `file-picker.js`

- abre file picker de JSON;
- abre file picker de MP4;
- lê texto do JSON;
- retorna referências de arquivo compatíveis com UXP;
- não contém lógica de edição.

### `premiere-adapter.js`

Único módulo que deve conhecer detalhes da API do Premiere.

Responsabilidades:

- obter projeto ativo;
- localizar ou importar mídia;
- obter item de projeto correspondente;
- criar master;
- criar sequências de corte;
- renomear itens;
- retornar objetos simples para o restante da aplicação.

### `create-cuts.js`

Orquestração:

1. validar estado;
2. preparar relatório;
3. obter projeto;
4. importar/localizar mídia;
5. criar master;
6. criar cortes em ordem;
7. atualizar progresso;
8. produzir relatório final.

Não deve conter detalhes de DOM ou manipulação HTML.

## 6. Estratégia de criação das sequências

A implementação exata deve ser escolhida após validar a API disponível na versão instalada.

Ordem de preferência:

### Estratégia A — Subsequências da master

1. criar sequência master com mídia;
2. definir In/Out;
3. criar subsequência;
4. renomear a sequência.

Vantagens:

- aproxima-se do fluxo manual;
- tende a preservar propriedades e sincronismo;
- gera sequências editáveis.

Riscos:

- comportamento de track targeting;
- efeitos de alterações repetidas de In/Out;
- necessidade de confirmar se a subsequência inicia em zero;
- assinaturas e Actions específicas da versão.

### Estratégia B — Sequência por corte com inserção da mídia

1. criar uma nova sequência;
2. inserir a mídia usando source in/out ou operações equivalentes;
3. garantir posição inicial zero;
4. renomear.

Vantagens:

- controle explícito de cada sequência.

Riscos:

- criação de sequence settings;
- inserção correta de vídeo e áudio;
- diferenças de API por versão.

O agente deve implementar uma prova com um único corte antes de generalizar. A estratégia escolhida deve ser documentada em `docs/ADOBE_API_NOTES.md`.

## 7. Estado da interface

Estados possíveis:

```text
idle
json-selected
ready
validating
creating-master
creating-cuts
success
error
```

Durante execução:

- desabilitar seletores e botão;
- mostrar progresso;
- restaurar controles no `finally`.

## 8. Transações e Actions

As APIs modernas do Premiere podem exigir criação de Actions e execução em transação para alterações no projeto.

O agente deve:

- confirmar quais operações exigem Action;
- criar Actions imediatamente antes da transação;
- não reutilizar Actions;
- agrupar apenas operações logicamente relacionadas;
- manter chamadas assíncronas fora de callbacks que exijam comportamento síncrono, conforme documentação da versão.

## 9. Idempotência e duplicatas

No MVP, antes da execução:

- detectar sequência master com o nome pretendido;
- detectar sequências com os nomes pretendidos.

Comportamento inicial recomendado:

- abortar e explicar os conflitos;
- não sobrescrever;
- não criar sufixos automaticamente sem decisão explícita.

## 10. Testabilidade

Priorizar testes unitários ou pequenos scripts para:

- parsing de timestamp;
- validação de JSON;
- geração de nomes;
- cálculo de duração.

A integração com Premiere será validada manualmente por fases.
