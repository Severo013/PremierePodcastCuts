# Contrato do arquivo JSON

## 1. Estrutura recomendada

```json
{
  "schemaVersion": 1,
  "projectName": "Podcast 23-07-2026",
  "cuts": [
    {
      "id": 1,
      "name": "Discussão sobre inteligência artificial",
      "start": "00:12:34.500",
      "end": "00:22:10.000"
    }
  ]
}
```

## 2. Campos da raiz

### `schemaVersion`

- tipo: inteiro;
- obrigatório;
- valor suportado no MVP: `1`.

### `projectName`

- tipo: string;
- obrigatório;
- usado no nome da sequência master;
- não precisa corresponder ao nome do arquivo.

### `cuts`

- tipo: array;
- obrigatório;
- deve conter pelo menos um item.

## 3. Campos de cada corte

### `id`

- tipo: inteiro ou string curta;
- obrigatório;
- deve ser único dentro do arquivo;
- não define necessariamente a ordem: a ordem do array é a ordem de criação.

### `name`

- tipo: string;
- obrigatório;
- não pode ficar vazio após `trim`;
- será higienizado para formar o nome da sequência.

### `start`

- tipo: string;
- obrigatório;
- timestamp relativo ao início do MP4.

### `end`

- tipo: string;
- obrigatório;
- deve ser posterior ao início.

## 4. Timestamp

Formato canônico:

```text
HH:MM:SS.mmm
```

Exemplos válidos:

```text
00:00:10.000
00:45:12.500
01:20:04.000
12:03:09.125
```

O parser pode aceitar, por conveniência:

```text
HH:MM:SS
H:MM:SS
MM:SS
MM:SS.mmm
```

Todos os valores devem ser normalizados internamente para segundos.

Regras:

- minutos de `00` a `59` quando houver horas;
- segundos de `00` a menor que `60`;
- milissegundos opcionais;
- não aceitar valores negativos;
- não aceitar `NaN`, infinito ou texto extra;
- `end > start`.

## 5. Exemplo completo

```json
{
  "schemaVersion": 1,
  "projectName": "Episódio 42",
  "cuts": [
    {
      "id": 1,
      "name": "Por que empresas falham ao adotar IA",
      "start": "00:08:14.250",
      "end": "00:17:38.900"
    },
    {
      "id": 2,
      "name": "O impacto da automação nos empregos",
      "start": "00:31:02",
      "end": "00:41:45.500"
    },
    {
      "id": 3,
      "name": "Conselho para jovens empreendedores",
      "start": "01:05:20.000",
      "end": "01:13:10.000"
    }
  ]
}
```

## 6. Exemplo inválido

```json
{
  "schemaVersion": 1,
  "projectName": "",
  "cuts": [
    {
      "id": 1,
      "name": "",
      "start": "00:20:00",
      "end": "00:10:00"
    }
  ]
}
```

Problemas:

- `projectName` vazio;
- `name` vazio;
- fim anterior ao início.

## 7. Limites operacionais do MVP

- arquivo com até 5 milhões de caracteres;
- no máximo 1000 cortes;
- nomes higienizados para até 100 caracteres antes do prefixo numérico;
- o painel mostra os primeiros 200 cortes, mas processa todos os validados;
- timestamps que resultem em valores não finitos são rejeitados.

## 8. Evolução futura

Novos campos poderão ser adicionados sem quebrar a versão 1, desde que opcionais:

```json
{
  "title": "Título para YouTube",
  "thumbnailText": "Texto da thumbnail",
  "notes": "Revisar o gancho inicial",
  "fadeDurationSeconds": 0.5,
  "audioPreset": "Podcast Horizontal"
}
```

Esses campos devem ser ignorados pelo MVP.
