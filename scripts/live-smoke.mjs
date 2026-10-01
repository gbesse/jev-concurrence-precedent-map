// Objectif : effectuer un appel Jev synthétique uniquement sur demande explicite.
import { createJevClient } from "../src/jev.mjs";
import { mapCompetitionPrecedent } from "../src/index.mjs";
const client = createJevClient();
const résultat = await mapCompetitionPrecedent({
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
}, client);
console.log(JSON.stringify({ décision: résultat.decision, confiance: résultat.confidence, usage: résultat.usage }, null, 2));
