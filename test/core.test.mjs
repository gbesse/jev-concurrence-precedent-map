// Objectif : vérifier la normalisation, la règle déterministe et les décisions sémantiques.
import test from "node:test";
import assert from "node:assert/strict";
import { competitionCase, mapCompetitionPrecedent } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const casLimite = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-09-27"
  },
  "candidateDecisionIds": []
};
const casPrincipal = {
  "id": "exemple-1",
  "text": "Un fournisseur impose aux distributeurs un prix de revente minimal et surveille les promotions en ligne.",
  "source": {
    "url": "https://example.test/source-publique",
    "date": "2026-09-25"
  },
  "details": {
    "territoire": "Commune Exemple",
    "origine": "donnée synthétique"
  }
};
const casÀRevoir = {
  "id": "revue-1",
  "text": "Une plateforme modifie ses conditions tarifaires pour certains vendeurs, sans information sur le marché ni la position des acteurs.",
  "source": {
    "url": "https://example.test/dossier-ambigu",
    "date": "2026-09-26"
  },
  "details": {
    "origine": "donnée synthétique",
    "signal": "informations incomplètes"
  }
};
test("exige une source", () => assert.throws(() => competitionCase({ id: "x", text: "y" }), /source/));
test("applique le cas limite sans appel Jev", async () => {
  const provider = createFakeProvider(() => { throw new Error("appel interdit"); });
  assert.equal((await mapCompetitionPrecedent(casLimite, provider)).decision, "unrelated");
  assert.equal(provider.calls, 0);
});
test("classe un dossier sourcé avec une confiance suffisante", async () => {
  const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "strong_precedent", probabilities: {
  "strong_precedent": 0.82,
  "partial_precedent": 0.06,
  "weak_precedent": 0.06,
  "unrelated": 0.06
}, confidence: 0.82 } }, usage: { input_tokens: 10, output_tokens: 0 } }));
  const résultat = await mapCompetitionPrecedent(casPrincipal, provider);
  assert.equal(résultat.decision, "strong_precedent");
  assert.equal(résultat.review, false);
  assert.equal(provider.calls, 1);
});
test("marque une décision incertaine pour revue humaine", async () => {
  const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "partial_precedent", probabilities: {
  "strong_precedent": 0.16,
  "partial_precedent": 0.52,
  "weak_precedent": 0.16,
  "unrelated": 0.16
}, confidence: 0.62 } }, usage: { input_tokens: 10, output_tokens: 0 } }));
  const résultat = await mapCompetitionPrecedent(casÀRevoir, provider);
  assert.equal(résultat.decision, "partial_precedent");
  assert.equal(résultat.review, true);
  assert.equal(résultat.confidence, 0.62);
  assert.equal(provider.calls, 1);
});
