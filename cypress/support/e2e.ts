/// <reference types="cypress" />

import './commands';
import './types';

// Dans cypress/support/e2e.ts
Cypress.on('uncaught:exception', (err) => {
    // CKEditor lance parfois des exceptions internes lors des interactions Cypress
    if (err.message.includes('CKEditorError') || err.message.includes('Cannot read properties of null')) {
      return false; // empêche Cypress de faire échouer le test
    }
    return true;
  });