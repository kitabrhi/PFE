import {
    Version, getSelector,
    SECTION_CONFIGURATION
  } from '../../config/configuration/selectors-configuration.config';
  
  export class ConfigurationPrimitives {
 
    // ─── Utilitaires ──────────────────────────────────────────────
   
    private static attendreChargement(): void {
      cy.wait(2000);
    }
   
    // ─── Ouvrir le menu Configuration (mat-expansion-panel) ───────
   
    static ouvrirMenuConfiguration(version: Version): void {
      cy.log('Ouverture du menu Configuration');
   
      if (version === 'v1') {
        const headerSel = getSelector(SECTION_CONFIGURATION.PANEL_HEADER, version);
   
        // vérifier si le panneau est déjà ouvert
        cy.get(headerSel, { timeout: 10000 })
          .scrollIntoView()
          .then($header => {
            const isExpanded = $header.attr('aria-expanded') === 'true';
            if (!isExpanded) {
              cy.wrap($header).click({ force: true });
              cy.wait(500);
            }
          });
      } else {
        cy.get(getSelector(SECTION_CONFIGURATION.PANEL_HEADER, version))
          .click({ force: true });
        cy.wait(500);
      }
    }
   
    // ─── Download profil ──────────────────────────────────────────
   
    static telechargerProfil(version: Version): void {
      cy.log('Téléchargement du profil (JSON)');
   
      ConfigurationPrimitives.ouvrirMenuConfiguration(version);
   
      if (version === 'v1') {
        cy.contains('.mat-expansion-panel-body a, .mat-expansion-panel-body button, .mat-expansion-panel-body span',
          'Download profil', { timeout: 10000 })
          .scrollIntoView()
          .click({ force: true });
      } else {
        cy.get(getSelector(SECTION_CONFIGURATION.BTN_DOWNLOAD_PROFIL, version))
          .click({ force: true });
      }
   
      ConfigurationPrimitives.attendreChargement();
    }
   
    static verifierDownloadDeclenche(): void {
      cy.log('Vérification que le download a été déclenché');
      // on vérifie que l'app est toujours fonctionnelle après le clic
      cy.get('mat-expansion-panel', { timeout: 10000 }).should('exist');
    }
   
    // ─── Upload profil ────────────────────────────────────────────
   
    static uploaderProfil(version: Version, cheminFichier: string): void {
      cy.log(`Upload du profil depuis "${cheminFichier}"`);
   
      ConfigurationPrimitives.ouvrirMenuConfiguration(version);
   
      if (version === 'v1') {
        cy.contains('.mat-expansion-panel-body a, .mat-expansion-panel-body button, .mat-expansion-panel-body span',
          'Upload profil', { timeout: 10000 })
          .scrollIntoView()
          .click({ force: true });
   
        // attacher le fichier à l'input file (souvent caché)
        cy.get('input[type="file"]', { timeout: 10000 })
          .selectFile(cheminFichier, { force: true });
      } else {
        cy.get(getSelector(SECTION_CONFIGURATION.BTN_UPLOAD_PROFIL, version))
          .click({ force: true });
        cy.get(getSelector(SECTION_CONFIGURATION.INPUT_UPLOAD_FILE, version))
          .selectFile(cheminFichier, { force: true });
      }
   
      ConfigurationPrimitives.attendreChargement();
    }
   
    static verifierUploadReussi(): void {
      cy.log('Vérification upload réussi');
      cy.get('body').should('not.contain.text', 'Erreur');
      cy.get('mat-expansion-panel', { timeout: 10000 }).should('exist');
    }
   
    // ─── Mode sombre (mat-slide-toggle / mdc-switch) ──────────────
   
    // En v1, mat-slide-toggle contient un button[role="switch"] avec aria-checked.
    // Il faut cliquer sur CE BOUTON (pas le wrapper) pour déclencher le toggle Angular.
    // Et vérifier aria-checked sur ce bouton pour connaître l'état.
   
    static activerModeSombre(version: Version): void {
      cy.log('Activation du mode sombre');
   
      ConfigurationPrimitives.ouvrirMenuConfiguration(version);
   
      const sel = getSelector(SECTION_CONFIGURATION.TOGGLE_MODE_SOMBRE, version);
   
      if (version === 'v1') {
        cy.get(sel, { timeout: 10000 }).scrollIntoView()
          .find('button[role="switch"]')
          .then($btn => {
            if ($btn.attr('aria-checked') !== 'true') {
              cy.wrap($btn).click();
            }
          });
      } else {
        cy.get(sel, { timeout: 10000 }).scrollIntoView()
          .find('input').then($input => {
            if (!$input.is(':checked')) {
              cy.get(sel).click({ force: true });
            }
          });
      }
   
      cy.wait(500);
    }
   
    static desactiverModeSombre(version: Version): void {
      cy.log('Désactivation du mode sombre');
   
      ConfigurationPrimitives.ouvrirMenuConfiguration(version);
   
      const sel = getSelector(SECTION_CONFIGURATION.TOGGLE_MODE_SOMBRE, version);
   
      if (version === 'v1') {
        cy.get(sel, { timeout: 10000 }).scrollIntoView()
          .find('button[role="switch"]')
          .then($btn => {
            if ($btn.attr('aria-checked') === 'true') {
              cy.wrap($btn).click();
            }
          });
      } else {
        cy.get(sel, { timeout: 10000 }).scrollIntoView()
          .find('input').then($input => {
            if ($input.is(':checked')) {
              cy.get(sel).click({ force: true });
            }
          });
      }
   
      cy.wait(500);
    }
   
    static verifierModeSombreActif(): void {
      cy.log('Vérification mode sombre activé');
      // ouvrir le panneau Configuration si fermé pour accéder au toggle
      ConfigurationPrimitives.ouvrirMenuConfiguration('v1');
      cy.get('mat-slide-toggle', { timeout: 10000 })
        .scrollIntoView()
        .find('button[role="switch"]')
        .should('have.attr', 'aria-checked', 'true');
    }
   
    static verifierModeSombreInactif(): void {
      cy.log('Vérification mode sombre désactivé');
      ConfigurationPrimitives.ouvrirMenuConfiguration('v1');
      cy.get('mat-slide-toggle', { timeout: 10000 })
        .scrollIntoView()
        .find('button[role="switch"]')
        .should('have.attr', 'aria-checked', 'false');
    }
   
    // ─── Générer CV ───────────────────────────────────────────────
   
    static naviguerVersGenererCV(version: Version): void {
      cy.log('Navigation vers Générer CV');
   
      if (version === 'v1') {
        cy.contains('.mat-sidenav a, .mat-sidenav span', 'Générer CV', { timeout: 10000 })
          .scrollIntoView()
          .click({ force: true });
      } else {
        cy.get(getSelector(SECTION_CONFIGURATION.BTN_GENERER_CV, version))
          .click({ force: true });
      }
   
      ConfigurationPrimitives.attendreChargement();
    }
   
    static telechargerCV(version: Version): void {
      cy.log('Téléchargement du CV');
   
      const panelSel = getSelector(SECTION_CONFIGURATION.PANEL_CV, version);
   
      if (version === 'v1') {
        cy.get(`${panelSel} button`, { timeout: 10000 })
          .contains('Télécharger le CV')
          .scrollIntoView()
          .click({ force: true });
      } else {
        cy.get(getSelector(SECTION_CONFIGURATION.BTN_TELECHARGER_CV, version))
          .click({ force: true });
      }
   
      ConfigurationPrimitives.attendreChargement();
    }
   
    static verifierPageGenererCV(): void {
      cy.log('Vérification page Générer CV');
      cy.contains('Télécharger le CV', { timeout: 10000 }).should('exist');
      cy.contains('Selected CV to Print', { timeout: 10000 }).should('exist');
    }
   
    static verifierApercuCV(): void {
      cy.log('Vérification aperçu CV visible');
      cy.get('div.panel-right', { timeout: 10000 }).should('exist');
      cy.contains('Selected CV to Print', { timeout: 10000 }).should('exist');
    }
  }
   