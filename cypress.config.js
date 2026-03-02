const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://redsumedev.z6.web.core.windows.net",
    chromeWebSecurity: false,
    experimentalSessionAndOrigin: true,
    pageLoadTimeout: 120000,
    defaultCommandTimeout: 15000,

    // ✅ AJOUT : Reconnaitre les fichiers .feature ET .cy.js
    specPattern: [
      "cypress/e2e/**/*.cy.js",
      "cypress/e2e/**/*.feature"
    ],

    async setupNodeEvents(on, config) {
      // ✅ AJOUT : Plugin Cucumber pour les fichiers .feature
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      return config;
    },
  },
});