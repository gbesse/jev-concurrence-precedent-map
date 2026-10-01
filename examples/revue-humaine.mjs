// Objectif : montrer qu’une décision incertaine est explicitement envoyée en revue humaine.
import assert from "node:assert/strict";
import { mapCompetitionPrecedent } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
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
const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "partial_precedent", probabilities: {
  "strong_precedent": 0.16,
  "partial_precedent": 0.52,
  "weak_precedent": 0.16,
  "unrelated": 0.16
}, confidence: 0.62 } }, usage: { input_tokens: 140, output_tokens: 0 } }));
const résultat = await mapCompetitionPrecedent(dossier, provider);
assert.equal(résultat.decision, "partial_precedent");
assert.equal(résultat.review, true);
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · revue humaine : ${résultat.review} · confiance : ${résultat.confidence}`);
