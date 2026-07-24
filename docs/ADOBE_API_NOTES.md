# Notas da API Adobe Premiere UXP

## Objetivo

Registrar somente APIs confirmadas durante o desenvolvimento. Este documento deve ser atualizado pelo agente sempre que uma integração for implementada.

## Ambiente mínimo planejado

- Premiere 25.6 ou superior;
- UXP Developer Tool 2.2 ou superior;
- template `premierepro-quick-starter`;
- Manifest v5 ou versão gerada pelo template.

## Pontos confirmados na documentação oficial

### Entrada da API do Premiere

```js
const app = require("premierepro");
```

### Projeto ativo

A referência atual documenta acesso assíncrono por meio da classe `Project`.

A assinatura exata deve ser confirmada no SDK instalado antes da implementação.

### File picker

A UXP Storage API oferece `localFileSystem.getFileForOpening()`.

Assinatura confirmada e usada na Fase 1:

```js
const { localFileSystem } = require("uxp").storage;
const file = await localFileSystem.getFileForOpening({
  allowMultiple: false,
  types: ["json"]
});

if (file) {
  const text = await file.read();
}
```

- `allowMultiple: false` retorna um `File` ou valor vazio no cancelamento;
- `types` recebe extensões sem ponto;
- `File.read()` retorna uma `Promise<string|ArrayBuffer>` e usa UTF-8 por padrão;
- fonte: `https://developer.adobe.com/premiere-pro/uxp/uxp-api/reference-js/modules/uxp/persistent-file-storage/file`.

### Permissão

Para selecionar arquivos do usuário, declarar no `manifest.json`:

```json
{
  "requiredPermissions": {
    "localFileSystem": "request"
  }
}
```

A posição exata e demais propriedades dependem do manifest criado pelo template.

## APIs a confirmar antes do uso

Preencher durante as fases 3 a 6.

### Importação de mídia

- método:
- classe:
- assinatura:
- retorno:
- versão mínima:
- fonte oficial:
- comportamento testado:

### Localização por media path

- método:
- classe:
- assinatura:
- retorno:
- versão mínima:
- comportamento testado:

### Criação de sequência pela mídia

Candidato: `Project.createSequenceFromMedia`.

Confirmar:

- tipos dos argumentos;
- item/bin de destino;
- tipo de retorno;
- propriedades copiadas da mídia.

### Pontos In/Out

Confirmar:

- classe que representa tempo;
- criação a partir de segundos;
- Action necessária;
- unidade e precisão;
- inclusão/exclusão do frame no ponto final.

### Criação de subsequência

Candidato: método de `Sequence`.

Confirmar:

- assinatura;
- dependência de track targeting;
- inclusão de áudio;
- início da timeline;
- comportamento com In/Out.

### Renomear sequência ou project item

Confirmar:

- objeto a renomear;
- Action necessária;
- transação;
- retorno.

## Registro de decisão

### Estratégia escolhida

- [ ] Estratégia A: master + subsequências
- [ ] Estratégia B: sequência por corte + inserção da mídia

### Motivo

Preencher após a prova da Fase 5.

### Limitações conhecidas

Preencher após testes.

## Fontes oficiais

- Documentação principal do Premiere UXP;
- referência de classes do Premiere;
- documentação de UXP Storage;
- recipes oficiais;
- declarações TypeScript distribuídas para a API.

Não usar snippets de fóruns como única fonte para uma assinatura.
