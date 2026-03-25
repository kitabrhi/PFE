import { defineConfig } from 'cypress';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import path from 'path';

/**
 * ═══════════════════════════════════════════════════════════════════
 * CONFIGURATION CYPRESS - ReDsume
 * ═══════════════════════════════════════════════════════════════════
 *
 * @description Configuration Cypress avec support BDD et Azure B2C
 * @version 2.0.0 (TypeScript)
 * @author Youssef - PFE REDSEN
 * @date 02/03/2026
 */

export default defineConfig({
  e2e: {
    /**
     * URL de base de l'application
     */
    baseUrl: "https://redsumedev.z6.web.core.windows.net",

    /**
     * Désactiver la sécurité Web Chrome
     * Nécessaire pour Azure B2C (cross-origin)
     */
    chromeWebSecurity: false,

    /**
     * Timeouts
     */
    pageLoadTimeout: 120000,
    defaultCommandTimeout: 15000,

    /**
     * Retries automatiques pour les tests flaky en CI
     * - runMode  : 2 tentatives en CI (headless) avant de déclarer un échec
     * - openMode : 0 en local (pas de retry pour voir le vrai comportement)
     */
    retries: {
      runMode: 2,
      openMode: 0
    },

    viewportWidth: 1400,
    viewportHeight: 900,

    /**
     * Patterns de fichiers de tests
     * Support des fichiers .feature (BDD)
     */
    specPattern: [
      "cypress/e2e/**/*.feature"
    ],

    /**
     * Configuration des événements Node
     */
    async setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions
    ): Promise<Cypress.PluginConfigOptions> {

      // Ajouter le plugin Cucumber pour les fichiers .feature
      await addCucumberPreprocessorPlugin(on, config);

      // Configurer le preprocessor avec esbuild + alias de chemin @support
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
          alias: {
            '@support': path.resolve(process.cwd(), 'cypress/support'),
          },
        })
      );

      return config;
    },
  },
});