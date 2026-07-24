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

- método: `Project.createSequenceFromMedia`;
- assinatura da declaração oficial: `createSequenceFromMedia(name: string, clipProjectItems?: ClipProjectItem[], targetBin?: ProjectItem): Promise<Sequence>`;
- uso na Fase 4: `await project.createSequenceFromMedia(name, [clip], rootItem)`;
- destino: o `FolderItem` retornado por `Project.getRootItem()` é aceito como `ProjectItem` de destino;
- retorno: `Promise<Sequence>`;
- conflito: `Project.getSequences(): Promise<Sequence[]>`, com leitura de `Sequence.name`;
- versão mínima: 25.6;
- fontes: `https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/project` e `https://github.com/adobe/premierepro-types/blob/main/src/premierepro.d.ts`;
- a API é assíncrona direta e não possui Action equivalente documentada;
- comportamento de cópia de resolução, frame rate, duração, vídeo e áudio: pendente de T09 no Premiere.

### Pontos In/Out

- tempo: `TickTime.createWithSeconds(seconds: number): TickTime`;
- alinhamento: `TickTime.alignToNearestFrame(frameRate: FrameRate): TickTime`;
- frame rate: `Sequence.getSettings(): Promise<SequenceSettings>` e `SequenceSettings.getVideoFrameRate(): FrameRate` (26.2+);
- compatibilidade: o manifest exige Premiere 26.3, portanto essa assinatura está dentro da versão mínima carregável do plugin;
- In: `Sequence.createSetInPointAction(tickTime: TickTime): Action`;
- Out: `Sequence.createSetOutPointAction(tickTime: TickTime): Action`;
- transação: `Project.executeTransaction(callback: (compoundAction: CompoundAction) => void, undoString?: string): boolean`;
- nas versões atuais, toda Action deve ser criada dentro de
  `Project.lockedAccess(callback: () => void): void`; a Action é criada e usada
  por `executeTransaction` no mesmo callback síncrono;
- precisão: início e fim são alinhados individualmente ao frame mais próximo;
- inclusão/exclusão do frame no Out: pendente de prova manual com intervalo de dez segundos.

### Criação de subsequência

- assinatura: `Sequence.createSubsequence(ignoreTrackTargeting?: boolean): Promise<Sequence>`;
- uso: `await masterSequence.createSubsequence(true)` para ignorar track targeting;
- rename: `Sequence.getProjectItem(): Promise<ProjectItem>` e `ProjectItem.createSetNameAction(name: string): Action`;
- zero: `Sequence.createSetZeroPointAction(tickTime: TickTime): Action` está
  documentado, mas foi considerado indisponível para esta prova após falhar no
  runtime 26.3 com uma referência relocalizada;
- medição: `Sequence.getEndTime(): Promise<TickTime>` e `Sequence.getZeroPoint(): Promise<TickTime>`;
- inclusão sincronizada de vídeo/áudio e início efetivo do conteúdo em zero: pendentes de prova manual.

### Recorte dos track items da subsequência

- tracks: `Sequence.getVideoTrack(index): Promise<VideoTrack>` e
  `Sequence.getAudioTrack(index): Promise<AudioTrack>`;
- itens: `track.getTrackItems(Constants.TrackItemType.CLIP, false)`;
- recorte de timeline: `createSetStartAction(tickTime: TickTime): Action` e
  `createSetEndAction(tickTime: TickTime): Action`, disponíveis nos track items
  de vídeo e áudio;
- deslocamento: `createMoveAction(tickTime: TickTime): Action`, cujo argumento é
  o deslocamento temporal; a prova usa `-startSeconds`;
- cada item é relocalizado entre recorte e movimento para evitar reutilizar um
  objeto do DOM invalidado pela transação anterior;
- fonte oficial: classes `VideoClipTrackItem`, `AudioClipTrackItem` e o sample
  oficial `premiere-api/src/sequence.ts`.

### Renomear sequência ou project item

- objeto: `ProjectItem` associado à sequência;
- Action: `ProjectItem.createSetNameAction(name: string): Action`;
- transação: `Project.executeTransaction(...)`;
- retorno da Action: `Action`; retorno da transação: `boolean`.
- o rename é criado dentro de `Project.lockedAccess`; a alteração do zero
  point foi retirada após a limitação confirmada no runtime.

## Registro de decisão

### Estratégia escolhida

- [x] Estratégia A revisada: subsequência da master + recorte dos track items
- [ ] Estratégia B: sequência por corte + inserção da mídia

### Motivo

A prova inicial com In/Out temporários mostrou no runtime 26.3 que
`createSubsequence(true)` cria a duração integral da master. A estratégia foi
revisada: a subsequência ainda preserva as configurações da master, mas seus
`VideoClipTrackItem` e `AudioClipTrackItem` são aparados com
`createSetStartAction`/`createSetEndAction` e deslocados juntos para zero com
`createMoveAction`. A master deixa de ter seu In/Out modificado.

### Limitações conhecidas

- a inclusão do frame no ponto Out precisa ser medida no Premiere;
- o recorte e deslocamento sincronizado dos track items de áudio e vídeo foi
  validado manualmente na Fase 5;
- se a subsequência for criada e a transação de rename falhar, a API não oferece atomicidade entre as duas operações assíncronas.

### Correção confirmada em teste da Fase 5

O primeiro teste retornou `The script object is no longer valid` ao criar a
Action de In/Out fora de `Project.lockedAccess`. Um segundo teste chegou a criar
uma subsequência integral e invalidou a referência da nova `Sequence` antes da
Action de zero point. O adapter passou a:

- criar cada Action dentro do callback de `executeTransaction`, que por sua vez
  permanece dentro de `lockedAccess`, seguindo o sample oficial `premiere-api`;
- relocalizar `Sequence` por GUID depois de operações assíncronas;
- criar os objetos `TickTime` dentro da transação;
- reler e validar In/Out antes de chamar `createSubsequence`, abortando antes da
  criação caso o Premiere não tenha aplicado o intervalo.

O teste seguinte confirmou que, no runtime 26.3 instalado,
`Project.getSequence(guid)` retorna uma Promise. Embora a página de referência
não apresente o retorno de forma consistente, o sample oficial também usa
`await project.getSequence(sequenceGuid)`. Todas as relocalizações por GUID no
adapter são, portanto, aguardadas antes do acesso ao objeto retornado.

O teste posterior confirmou que `Sequence.createSetZeroPointAction` lança
`The script object is no longer valid` mesmo com a subsequência relocalizada por
GUID imediatamente antes de `lockedAccess`. Como zerar a timeline é condicional
à disponibilidade da API nesta fase, a prova deixou de modificar o zero point.
O valor real continua sendo lido por `getZeroPoint()` e mostrado no relatório; a
duração medida passou a ser `getEndTime() - getZeroPoint()`.

### Generalização da Fase 6

- os nomes de todos os cortes são calculados e comparados, sem distinção de
  maiúsculas, com `Project.getSequences()` antes da primeira modificação;
- os cortes são processados sequencialmente na ordem do array;
- cada iteração reutiliza a estratégia validada na Fase 5 e relocaliza os
  objetos do DOM necessários;
- uma falha registra o corte atual no relatório e interrompe imediatamente os
  cortes restantes; sequências concluídas anteriormente não são removidas;
- o callback de progresso recebe `current`, `total` e o nome criado, sem acessar
  diretamente elementos da interface a partir do adapter.

Fontes oficiais:

- `https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/sequence`;
- `https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/sequenceeditor`;
- `https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/ticktime`;
- `https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/project`;
- `https://github.com/adobe/premierepro-types/blob/main/src/premierepro.d.ts`.

## Fontes oficiais

- Documentação principal do Premiere UXP;
- referência de classes do Premiere;
- documentação de UXP Storage;
- recipes oficiais;
- declarações TypeScript distribuídas para a API.

Não usar snippets de fóruns como única fonte para uma assinatura.
