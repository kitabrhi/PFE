# Guide : Cypress vs Playwright

Ce projet supporte deux runners de tests BDD pour les mêmes features Gherkin.

## Structure

```
cypress/                    ← Implémentation Cypress (existante)
├── e2e/**/*.feature        ← Features Gherkin (PARTAGÉES)
└── support/
    ├── step_definitions/   ← Steps Cypress
    ├── primitives/         ← Primitives cy.get(), cy.click()…
    └── config/             ← Sélecteurs v1/v2

playwright/                 ← Implémentation Playwright (nouvelle)
├── cucumber.cjs            ← Config Cucumber
├── world.ts                ← World Playwright (page, context)
├── hooks.ts                ← Before/After (browser lifecycle)
├── steps/                  ← Steps Playwright (this.page)
├── primitives/             ← Primitives page.locator(), .click()…
└── config/                 ← Sélecteurs v1/v2 (dupliqués)
```

Les fichiers `.feature` sont partagés : ils restent dans `cypress/e2e/` et
la configuration Cucumber de Playwright pointe dessus (`playwright/cucumber.cjs`).

## Installation

```bash
npm install
npx playwright install chromium    # Télécharger le navigateur
```

## Lancer les tests

### Via la variable RUNNER

```bash
# Cypress (défaut)
RUNNER=cypress npm test

# Playwright
RUNNER=playwright npm test
```

### Via les scripts dédiés

```bash
npm run test:cypress       # Cypress
npm run test:playwright    # Playwright + Cucumber
```

### Filtrer par feature

```bash
RUNNER=playwright SPEC="cypress/e2e/04-section/07-competences.feature" npm test
```

## Variables d'environnement

| Variable        | Description                          | Défaut                                          |
|----------------|--------------------------------------|--------------------------------------------------|
| `RUNNER`       | Runner à utiliser                    | `cypress`                                        |
| `APP_VERSION`  | Version des sélecteurs               | `v1`                                             |
| `BASE_URL`     | URL de l'application                 | `https://redsumedev.z6.web.core.windows.net`     |
| `USER_LOGIN`   | Email de connexion                   | (requis)                                         |
| `USER_PASSWORD`| Mot de passe                         | (requis)                                         |
| `CI`           | Mode CI (headless, retries)          | `false`                                          |
| `HEADLESS`     | Forcer le mode headless              | `true` en CI                                     |
| `SPEC`         | Filtre de features                   | (toutes)                                         |

## Différences d'API

| Cypress                         | Playwright                              |
|---------------------------------|------------------------------------------|
| `cy.get(sel)`                   | `page.locator(sel)`                      |
| `cy.contains(text)`            | `page.getByText(text)`                   |
| `.click()`                      | `.click()`                               |
| `.type(text)`                   | `.fill(text)`                            |
| `.clear()`                      | `.clear()`                               |
| `.should('be.visible')`        | `await expect(loc).toBeVisible()`        |
| `.should('contain', text)`     | `await expect(loc).toContainText(text)`  |
| `cy.wait(ms)`                  | `await page.waitForTimeout(ms)`          |
| `cy.visit(url)`                | `await page.goto(url)`                   |
| `cy.url()`                     | `page.url()`                             |
| `Cypress.env('VAR')`           | `process.env.VAR`                        |

## Architecture en couches

Les deux runners suivent la même architecture 4 couches :

```
Feature (.feature)           → Gherkin partagé
    ↓
Step Definition (.steps.ts)  → Orchestration (Given/When/Then)
    ↓
Primitive (.primitives.ts)   → Action atomique (API framework)
    ↓
Sélecteur (.config.ts)       → CSS selectors v1/v2
```

Les steps et primitives sont les seules couches qui diffèrent entre les runners.
Les features et sélecteurs sont identiques.
