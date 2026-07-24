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

Acesso confirmado na referência oficial 25.6+:

```js
const app = require("premierepro");
const project = await app.Project.getActiveProject();
```

- assinatura: `Project.getActiveProject(): Promise<Project>`;
- a implementação deve tratar retorno vazio quando não houver projeto ativo;
- fonte: `https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/project`.

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

Na Fase 2, o mesmo picker é usado para vídeo com `types: ["mp4"]`. A
referência `File` retornada é mantida em memória, e o caminho nativo é obtido
por `localFileSystem.getNativePath(file)`. Não é usado acesso direto por caminho
nem permissão `fullAccess`.

Fonte oficial:
`https://developer.adobe.com/premiere-pro/uxp/resources/recipes/filesystem-operations/`.

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

- método: `importFiles`;
- classe: `Project`;
- assinatura: `importFiles(filePaths: string[], suppressUI: boolean, targetBin: ProjectItem, asNumberedStills: boolean): Promise<boolean>`;
- retorno: `true` quando a importação é aceita/concluída com sucesso;
- bin raiz: `Project.getRootItem(): Promise<FolderItem>`;
- filhos do bin: `FolderItem.getItems(): Promise<ProjectItem[]>`;
- versão mínima: 25.6;
- fonte oficial: `https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/project` e `https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/folderitem`;
- comportamento testado: pendente de teste manual no Premiere.

`Project.importFiles` é documentado como operação assíncrona direta. A
referência não apresenta uma Action equivalente para importação; a Fase 3 usa o
método diretamente e aguarda sua `Promise`, sem chamar `Project.save()`.

### Localização por media path

- descoberta corrigida após teste no Premiere: `findItemsMatchingMediaPath` não é um método estático de `ClipProjectItem` no runtime testado;
- a declaração TypeScript oficial define o método em uma instância `ClipProjectItem`, embora a página web o apresente na seção de métodos estáticos;
- busca adotada: percorrer `FolderItem.getItems(): Promise<ProjectItem[]>` recursivamente a partir de `Project.getRootItem()`;
- identificação: `ProjectItem.TYPE_BIN` e os tipos de item com potencial de mídia `TYPE_CLIP`, `TYPE_FILE` e `TYPE_COMPOUND`;
- conversão de bin: `FolderItem.cast(projectItem: ProjectItem): FolderItem`;
- conversão: `ClipProjectItem.cast(projectItem: ProjectItem): ClipProjectItem`;
- caminho exato: `ClipProjectItem.getMediaFilePath(): Promise<string>`;
- versão mínima: 25.6;
- fonte oficial prioritária: `https://github.com/adobe/premierepro-types/blob/main/src/premierepro.d.ts`;
- observação: o adapter confirma igualdade normalizada do caminho retornado antes de reutilizar;
- comportamento testado: pendente de teste manual no Premiere.

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
