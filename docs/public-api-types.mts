// Objectif : vérifier que les types publics sont importables.
import { competitionCase, mapCompetitionPrecedent } from "../src/index.mjs";
const dossier = competitionCase({
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
});
void mapCompetitionPrecedent(dossier, { decide: async () => ({}) });
