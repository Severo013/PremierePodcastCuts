const assert = require("node:assert");
const { readFileSync } = require("node:fs");
const { parseTimestamp } = require("../src/domain/timestamp");
const { parseCutsJson } = require("../src/domain/cuts-parser");

function createDocument(cuts) {
  return JSON.stringify({
    schemaVersion: 1,
    projectName: "Episódio de teste",
    cuts,
  });
}

function createCut(overrides = {}) {
  return {
    id: 1,
    name: "Primeiro corte",
    start: "00:00:10.000",
    end: "00:00:20.000",
    ...overrides,
  };
}

assert.strictEqual(parseTimestamp("00:00:10.000"), 10);
assert.strictEqual(parseTimestamp("1:05:20"), 3920);
assert.strictEqual(parseTimestamp("45:12.500"), 2712.5);
assert.strictEqual(parseTimestamp("01:05:20.000"), 3920);
assert.strictEqual(parseTimestamp("00:60:00"), null);
assert.strictEqual(parseTimestamp("1:02"), null);
assert.strictEqual(parseTimestamp("00:00:10.00"), null);
assert.strictEqual(parseTimestamp(" 00:00:10.000"), null);

const valid = parseCutsJson(createDocument([createCut()]));
assert.deepStrictEqual(valid.errors, []);
assert.strictEqual(valid.cuts[0].startSeconds, 10);
assert.strictEqual(valid.cuts[0].endSeconds, 20);
assert.strictEqual(valid.cuts[0].durationSeconds, 10);

const sample = parseCutsJson(
  readFileSync("samples/cuts.example.json", { encoding: "utf8" }),
);
assert.deepStrictEqual(sample.errors, []);
assert.strictEqual(sample.cuts.length, 3);
assert.deepStrictEqual(
  sample.cuts.map((cut) => cut.durationSeconds),
  [10, 11.5, 13.25],
);

assert.ok(parseCutsJson("{").errors.length > 0);
assert.ok(parseCutsJson(JSON.stringify({ schemaVersion: 1 })).errors.length > 0);
assert.ok(
  parseCutsJson(createDocument([createCut({ end: "00:00:10.000" })])).errors
    .length > 0,
);
assert.ok(
  parseCutsJson(
    createDocument([createCut(), createCut({ id: "1", name: "Duplicado" })]),
  ).errors.some((error) => error.includes("id duplicado")),
);

console.log("Todos os testes de domínio passaram.");
