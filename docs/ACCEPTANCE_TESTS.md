# Testes de aceitação

## Ambiente de teste

- projeto novo no Premiere;
- MP4 curto com vídeo e áudio;
- frame rate conhecido;
- JSON de exemplo;
- console do UXP disponível.

Registrar para cada teste:

- data;
- versão do Premiere;
- versão do UXP Developer Tool;
- resultado;
- observações.

## T01 — Painel

### Passos

1. Carregar o plugin.
2. Abrir o painel.
3. Clicar no botão de teste ou selecionar arquivo.

### Esperado

- painel abre;
- nenhuma exceção no carregamento;
- controles respondem.

## T02 — JSON válido

Selecionar `samples/cuts.example.json`.

### Esperado

- três cortes reconhecidos;
- nomes exibidos;
- durações calculadas;
- nenhum erro.

## T03 — JSON malformado

Remover uma vírgula.

### Esperado

- mensagem clara;
- botão de execução bloqueado;
- nenhuma alteração no projeto.

## T04 — Intervalo inválido

Definir `end` menor que `start`.

### Esperado

- erro identifica corte e campo;
- nenhuma sequência criada.

## T05 — Seleção cancelada

Cancelar cada file picker.

### Esperado

- estado anterior preservado;
- nenhuma exceção;
- nenhuma seleção falsa.

## T06 — Projeto ausente

Fechar todos os projetos e executar.

### Esperado

- mensagem solicitando projeto aberto;
- nenhuma falha silenciosa.

## T07 — Importação

Selecionar MP4 ainda ausente no projeto.

### Esperado

- mídia importada;
- vídeo e áudio reconhecidos;
- apenas um item correspondente.

## T08 — Mídia já importada

Executar com o mesmo MP4 previamente importado.

### Esperado

- reutilizar o item quando possível;
- não criar duplicata desnecessária.

## T09 — Master

Criar a master.

### Esperado

- nome correto;
- resolução correta;
- frame rate correto;
- duração completa;
- vídeo e áudio presentes.

## T10 — Corte único

Usar um intervalo conhecido de dez segundos.

### Esperado

- sequência editável;
- duração dentro de um frame;
- vídeo e áudio sincronizados;
- conteúdo corresponde ao intervalo;
- timeline começa em zero quando suportado pela estratégia.

## T11 — Múltiplos cortes

Usar três intervalos.

### Esperado

- três sequências;
- ordem correta;
- prefixos `01`, `02`, `03`;
- intervalos corretos;
- relatório informa três sucessos.

## T12 — Timestamp acima de uma hora

Usar `01:05:20.000`.

### Esperado

- parsing correto;
- nenhuma interpretação como cinco minutos.

## T13 — Nomes problemáticos

Usar:

```text
Tema: IA / trabalho? "Futuro" <2026>
```

### Esperado

- nome higienizado;
- sequência criada;
- caracteres inválidos removidos ou substituídos.

## T14 — Conflitos

Executar novamente sem remover as sequências anteriores.

### Esperado

- conflito detectado antes da criação;
- nenhuma sobrescrita;
- comportamento claramente explicado.

## T15 — Integridade

Após execução:

### Esperado

- MP4 original inalterado;
- nenhum item existente excluído;
- projeto permanece utilizável;
- sequências podem ser editadas manualmente.
