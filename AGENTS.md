# Instruções para agentes de código

## Contexto

Este repositório contém um plugin UXP para Adobe Premiere. Sua função é criar cortes horizontais editáveis a partir de um vídeo MP4 e de intervalos descritos em JSON.

Leia antes de alterar código:

1. `docs/PRODUCT_SPEC.md`
2. `docs/ARCHITECTURE.md`
3. `docs/JSON_FORMAT.md`
4. `docs/ROADMAP.md`
5. `docs/ACCEPTANCE_TESTS.md`
6. `docs/ADOBE_API_NOTES.md`

## Regras obrigatórias

1. Trabalhe somente na fase solicitada pelo usuário.
2. Não implemente antecipadamente fases posteriores.
3. Preserve o funcionamento já validado.
4. Prefira JavaScript simples, modular e legível.
5. Não adicione dependências externas sem necessidade comprovada e autorização.
6. Não introduza React, TypeScript, bundler ou framework no MVP, salvo se o template inicial já depender deles e removê-los for mais arriscado.
7. Não invente métodos da API do Premiere.
8. Antes de usar uma API do Premiere:
   - confira as declarações TypeScript instaladas, exemplos oficiais ou documentação oficial;
   - registre a assinatura usada em `docs/ADOBE_API_NOTES.md`;
   - trate diferenças de versão de forma explícita.
9. Toda operação assíncrona deve ser aguardada quando a API assim exigir.
10. Toda ação que modifica o projeto deve seguir o mecanismo de transação/action recomendado pela API da versão instalada, quando aplicável.
11. Capture erros e mostre mensagens compreensíveis no painel.
12. Nunca silencie exceções sem registrar contexto.
13. Evite estado global desnecessário.
14. Não sobrescreva nem remova mídia, sequências ou arquivos do usuário.
15. Não salve automaticamente o projeto no MVP sem uma decisão explícita do usuário.
16. Não aplique efeitos, fades, normalização ou exportação no MVP.
17. Use nomes determinísticos e higienizados para sequências.
18. Mantenha o vídeo original intacto.
19. Um erro de um corte não deve gerar resultados silenciosamente incorretos.
20. Ao concluir uma tarefa, informe:
   - arquivos alterados;
   - decisões tomadas;
   - como testar;
   - limitações ou APIs ainda não confirmadas.

## Restrições funcionais do MVP

O MVP deve somente:

- selecionar um JSON;
- selecionar um MP4;
- validar os dados;
- importar ou localizar a mídia;
- criar uma sequência master;
- criar uma sequência editável para cada intervalo;
- apresentar progresso e resultado.

Fora do escopo:

- fades;
- presets;
- efeitos;
- tratamento de áudio;
- legendas;
- cortes verticais;
- transcrição;
- LLM;
- exportação automática;
- upload;
- criação de thumbnails.

## Qualidade

- Funções pequenas e com responsabilidade única;
- nomes em inglês no código;
- textos da interface em português do Brasil;
- comentários somente quando explicarem uma decisão não óbvia;
- constantes para valores reutilizados;
- validação separada da integração com Premiere;
- lógica pura testável sem o Premiere sempre que possível.

## Política para incerteza

Quando uma assinatura da API estiver incerta, não adivinhe. Primeiro procure no SDK, nas declarações TypeScript ou na documentação oficial. Caso não seja possível confirmar, implemente uma pequena prova isolada ou deixe um bloqueio claramente documentado.
