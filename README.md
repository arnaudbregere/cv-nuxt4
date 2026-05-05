# Arnaud Brégère — Portfolio & AccessiCheck

> Portfolio front-end développé avec **Nuxt 3** — inclut **AccessiCheck**, un outil d'audit d'accessibilité RGAA piloté par IA agentique.

🔗 [arnaud-bregere.fr](https://arnaud-bregere.fr) · [GitHub](https://github.com/arnaudbregere)

---

## AccessiCheck — Auditeur RGAA multi-agent

AccessiCheck analyse l'accessibilité d'une page HTML selon le référentiel **RGAA 4.1 / WCAG 2.1**, corrige automatiquement les violations détectées, et génère un rapport PDF exportable.

### Fonctionnalités

- 🌐 **Récupération URL** — entre une URL, l'agent fetch et nettoie le HTML automatiquement
- 🔍 **Audit simple** — analyse en une passe, score + violations détaillées
- 🤖 **Mode Auto-Fix** — l'agent se corrige lui-même jusqu'à atteindre un score ≥ 80/100 (max 3 passes)
- ✅ **Validation critic** — un second LLM filtre les faux positifs de l'audit
- 📄 **Export PDF** — rapport complet avec score, violations et HTML corrigé

---

## Architecture agentique

```
┌─────────────────────────────────────────────────────────────┐
│                        UTILISATEUR                          │
│              URL  ──ou──  HTML collé manuellement           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENT 1 — URL Fetcher          server/api/fetch-url.post   │
│  • fetch() de la page distante                              │
│  • nettoyage HTML (suppression scripts, styles, svg)        │
│  • troncature à 8 000 caractères                            │
└─────────────────────┬───────────────────────────────────────┘
                      │  HTML propre
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENT 2 — Auditeur             server/utils/runAudit       │
│  • prompt Mistral : analyse RGAA/WCAG                       │
│  • retourne score + violations brutes + HTML corrigé        │
└────────────┬────────────────────────┬───────────────────────┘
             │  violations brutes     │  HTML corrigé
             ▼                        │
┌────────────────────────────┐        │
│  AGENT 3 — Critic          │        │
│  server/agents/runCritic   │        │
│  • second LLM indépendant  │        │
│  • supprime les faux positifs        │
│  • corrige les imprécisions│        │
└────────────┬───────────────┘        │
             │  violations validées   │
             ▼                        ▼
┌─────────────────────────────────────────────────────────────┐
│  ORCHESTRATEUR — Boucle agentique                           │
│  server/api/audit-iteratif.post                             │
│                                                             │
│   while (score < 80 && passes < 3)                         │
│     htmlCourant = htmlCorrigé  ← sortie = entrée suivante  │
│     runAudit(htmlCourant)                                   │
│     runCritic(violations)                                   │
│     historique.push(étape)                                  │
│   end                                                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  FRONT — AccessiCheck.vue + useAccessiCheck.ts              │
│  • progression des passes (Passe 1 → 50, Passe 2 → 90…)   │
│  • score coloré, violations détaillées                      │
│  • export PDF via jsPDF                                     │
└─────────────────────────────────────────────────────────────┘
```

### Pourquoi c'est agentique ?

| Critère | Implémentation |
|---|---|
| **Autonomie** | la boucle s'arrête seule (score ≥ 80 ou 3 passes max) |
| **Objectif mesurable** | score RGAA sur 100 |
| **Multi-agent** | Auditeur + Critic = deux LLMs aux rôles distincts |
| **Auto-correction** | `htmlCourant = resultat.htmlCorrige` — la sortie devient l'entrée |
| **Mémoire de session** | `historique[]` trace chaque passe |
| **Outil externe** | Mistral AI via `@mistralai/mistralai` |

---

## Stack technique

| Couche | Techno |
|---|---|
| Framework | Nuxt 3 / Vue 3 |
| Langage | TypeScript |
| Style | SCSS (mobile first) |
| LLM | Mistral AI (`mistral-small-latest`, `temperature: 0`) |
| PDF | jsPDF (côté client, import dynamique) |
| HTML parsing | node-html-parser |

---

## Variables d'environnement

Créer un fichier `.env` à la racine :

```env
MISTRAL_API_KEY=your_api_key_here
```

---

## Installation & développement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement sur http://localhost:3000
npm run dev
```

## Production

```bash
# Build
npm run build

# Prévisualiser le build
npm run preview
```

---

## Structure du projet (AccessiCheck)

```
server/
├── agents/
│   └── runCritic.ts        # Agent Critic — valide les violations
├── api/
│   ├── audit.post.ts       # Endpoint audit simple
│   ├── audit-iteratif.post.ts  # Endpoint boucle agentique
│   └── fetch-url.post.ts   # Endpoint fetch + nettoyage HTML
└── utils/
    ├── mistral.ts           # Client LLM (createClient, callLLM, cleanJSON)
    └── runAudit.ts          # Agent Auditeur — cœur de l'analyse RGAA

composables/
└── useAccessiCheck.ts       # Logique métier Vue (état, appels API, PDF)

pages/
└── AccessiCheck.vue         # Interface utilisateur
```