# Roadmap incremental

Não avançar para uma fase sem testar e registrar o resultado da anterior.

## Fase 0 — Preparação do ambiente

### Objetivo

Confirmar ambiente UXP funcional.

### Entregas

- plugin criado pelo template oficial;
- painel carregando no Premiere;
- botão simples respondendo;
- documentação do comando de execução/debug.

### Critério de aceite

O painel abre sem erro e uma ação de teste atualiza um texto no painel.

---

## Fase 1 — Domínio e leitura do JSON

### Objetivo

Selecionar, ler, converter e validar JSON sem alterar o projeto do Premiere.

### Entregas

- file picker de `.json`;
- parser;
- conversor de timestamps;
- validator;
- resumo de cortes no painel;
- mensagens de erro.

### Testes

- JSON válido;
- JSON malformado;
- `cuts` ausente;
- fim anterior ao início;
- timestamp acima de uma hora;
- IDs duplicados.

### Critério de aceite

O painel exibe corretamente os itens válidos e bloqueia execução diante de erros.

---

## Fase 2 — Seleção do vídeo e estado da UI

### Objetivo

Selecionar um MP4 e habilitar a execução somente quando os dois inputs forem válidos.

### Entregas

- file picker de `.mp4`;
- exibição do nome do vídeo;
- estado `ready`;
- botão `Criar cortes`;
- bloqueio durante execução;
- área de log.

### Critério de aceite

O botão só fica habilitado quando JSON e MP4 estão selecionados e válidos.

---

## Fase 3 — Integração mínima com o projeto

### Objetivo

Obter projeto ativo e importar ou localizar a mídia.

### Entregas

- `premiere-adapter`;
- detecção de projeto ativo;
- localização por media path quando possível;
- importação quando necessário;
- retorno do item de projeto;
- prova manual com um MP4 curto.

### Critério de aceite

O MP4 aparece uma única vez no projeto e o adapter retorna o item correto.

---

## Fase 4 — Sequência master

### Objetivo

Criar uma master baseada na mídia.

### Entregas

- criação da sequência;
- nome higienizado;
- validação de conflitos;
- confirmação de vídeo e áudio;
- registro das APIs utilizadas.

### Critério de aceite

A master possui resolução, frame rate, duração, vídeo e áudio corretos.

---

## Fase 5 — Prova de um único corte

### Objetivo

Criar uma sequência editável para apenas o primeiro intervalo.

### Entregas

- implementação isolada da estratégia A ou B;
- sequência iniciando em zero quando possível;
- vídeo e áudio sincronizados;
- duração correta;
- relatório.

### Critério de aceite

Um intervalo de teste de dez segundos gera uma sequência de dez segundos, com tolerância máxima de um frame.

### Regra

Não implementar loop de múltiplos cortes antes desta fase ser validada dentro do Premiere.

---

## Fase 6 — Múltiplos cortes

### Objetivo

Generalizar a prova para todos os itens.

### Entregas

- processamento em ordem;
- progresso;
- nomes numerados;
- relatório final;
- tratamento fail-fast;
- detecção de conflitos antes da execução.

### Critério de aceite

Um JSON de três cortes cria três sequências corretas e uma master.

---

## Fase 7 — Robustez do MVP

### Objetivo

Preparar uso real.

### Entregas

- timestamps maiores que uma hora;
- nomes longos e caracteres inválidos;
- projeto sem sequência ativa;
- MP4 já importado;
- cancelamento do file picker;
- mensagens de erro;
- documentação de uso;
- limpeza de código.

### Critério de aceite

Todos os testes de `docs/ACCEPTANCE_TESTS.md` passam.

---

## Backlog pós-MVP

Somente após aceite do MVP:

1. criar bins organizacionais;
2. aplicar handles antes/depois dos intervalos;
3. fades automáticos;
4. preset de áudio;
5. exportação em lote;
6. integração com Media Encoder;
7. CSV/TXT além de JSON;
8. presets de nomenclatura;
9. salvar preferências;
10. integração com indexador por IA.
