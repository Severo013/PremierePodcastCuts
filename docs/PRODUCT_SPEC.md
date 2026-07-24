# Especificação do produto

## 1. Problema

O usuário assiste a podcasts e anota momentos relevantes com timestamps de início e fim. Hoje ele precisa abrir o vídeo no Adobe Premiere e criar manualmente uma sequência para cada momento.

A automação deve converter essas anotações em sequências editáveis, reduzindo o trabalho mecânico sem retirar do usuário a revisão criativa.

## 2. Usuário principal

Editor de podcasts que:

- trabalha no Windows;
- usa Adobe Premiere;
- recebe ou baixa um MP4 completo;
- anota intervalos durante a curadoria;
- revisa manualmente início e fim;
- posteriormente aplica fades e trata o áudio;
- exporta os cortes depois da revisão.

## 3. Fluxo principal

1. O usuário abre um projeto no Premiere.
2. Abre o painel do plugin.
3. Seleciona um JSON de timestamps.
4. Seleciona um MP4.
5. O painel mostra um resumo dos cortes.
6. O usuário clica em `Criar cortes`.
7. O plugin valida todas as entradas.
8. O plugin importa ou localiza a mídia.
9. O plugin cria uma sequência master.
10. O plugin cria uma sequência por intervalo.
11. O painel informa quantos cortes foram criados e eventuais falhas.
12. O usuário abre cada sequência e faz ajustes manuais.

## 4. Entradas

### Arquivo JSON

Contrato definido em `docs/JSON_FORMAT.md`.

### Arquivo MP4

- selecionado por file picker;
- deve ser legível pelo Premiere;
- timestamps são relativos ao início do arquivo;
- o plugin não altera fisicamente o MP4.

## 5. Saídas

### Sequência master

Nome sugerido:

`00_MASTER - <projectName>`

Deve:

- usar as propriedades da mídia quando possível;
- conter vídeo e áudio completos;
- servir como fonte ou referência para criação dos cortes.

### Sequências de corte

Nome:

`NN - <nome higienizado>`

Exemplo:

`01 - Inteligência artificial no trabalho`

Cada sequência deve:

- começar no timestamp solicitado;
- terminar no timestamp solicitado;
- conter vídeo e áudio;
- ter a timeline iniciando em zero, se a estratégia escolhida pela API permitir;
- permanecer totalmente editável;
- referenciar a mídia original;
- não conter efeitos automáticos no MVP.

## 6. Requisitos funcionais

### RF-01 — Selecionar JSON

O painel deve permitir escolher um único arquivo `.json`.

### RF-02 — Ler e validar JSON

O plugin deve validar:

- estrutura raiz;
- lista `cuts`;
- existência de cortes;
- campos obrigatórios;
- formato de timestamps;
- `end > start`;
- nomes;
- identificadores;
- duração positiva.

### RF-03 — Selecionar MP4

O painel deve permitir escolher um único `.mp4`.

### RF-04 — Pré-visualizar resumo

Antes da execução, mostrar:

- nome do arquivo JSON;
- nome do vídeo;
- número de cortes;
- duração de cada corte ou duração total planejada;
- erros de validação.

### RF-05 — Projeto aberto

A execução deve falhar com mensagem clara caso não exista projeto ativo.

### RF-06 — Importar ou reutilizar mídia

Se a mídia selecionada já estiver no projeto, preferir reutilizá-la. Caso contrário, importá-la.

### RF-07 — Criar sequência master

Criar a sequência master apenas depois que todas as entradas básicas forem válidas.

### RF-08 — Criar sequências

Criar uma sequência por intervalo, mantendo áudio e vídeo sincronizados.

### RF-09 — Progresso

Durante a execução, mostrar pelo menos:

- etapa atual;
- corte atual;
- total de cortes.

### RF-10 — Relatório

Ao terminar, mostrar:

- quantidade solicitada;
- quantidade criada;
- nomes criados;
- falhas, se houver.

## 7. Requisitos não funcionais

- Não bloquear o painel sem feedback;
- não excluir dados;
- não alterar o arquivo de mídia;
- produzir nomes válidos no Windows e no Premiere;
- funcionar com episódios maiores que uma hora;
- aceitar milissegundos opcionais;
- manter comportamento determinístico;
- evitar dependências externas no MVP;
- registrar erros relevantes no console e no painel.

## 8. Comportamento diante de erros

### Erro antes da criação

Caso o JSON ou vídeo seja inválido, não criar nenhuma sequência.

### Erro durante a criação

Registrar:

- índice do corte;
- nome;
- intervalo;
- mensagem técnica.

A estratégia inicial deve ser `fail-fast` para evitar um projeto parcialmente criado sem entendimento claro. Uma futura versão pode oferecer modo de continuar após falhas.

## 9. Fora do escopo

- ajuste automático dos cortes;
- detecção de fala;
- fades;
- efeitos;
- presets de áudio;
- normalização;
- loudness;
- exportação;
- Media Encoder;
- criação de bins avançados;
- desfazer global personalizado;
- sincronização com outros sistemas.

## 10. Definição de pronto do MVP

O MVP está pronto quando, usando um MP4 de teste e um JSON com três intervalos:

- o painel carrega no Premiere;
- os dois arquivos podem ser selecionados;
- os três intervalos são validados;
- uma master é criada;
- três sequências editáveis são criadas;
- áudio e vídeo estão presentes e sincronizados;
- as durações correspondem aos intervalos com tolerância máxima de um frame;
- o projeto e o MP4 original permanecem íntegros.
