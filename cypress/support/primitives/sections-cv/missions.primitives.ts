import {
  Version,
  getSelector,
  SECTION_MISSIONS
} from '../../config/section/selectors-missions.config';
import { ExperiencesPrimitives } from './experiences.primitives';

interface MissionData {
  role: string;
  societe: string;
  lieu?: string;
  debut?: string;
  fin?: string;
  contexte?: string;
  taches?: string;
  actions?: string;
  resultats?: string;
  technologies?: string;
}

const FIXTURE_MISSION: MissionData = {
  role: 'Consultant Senior',
  societe: 'Redsen Consulting',
  lieu: 'Lausanne, Suisse',
  debut: '01/2024',
  fin: '06/2024'
};

const FIXTURE_MISSION_MODIFIEE: MissionData = {
  role: 'Lead Consultant',
  societe: 'Anthropic',
  lieu: 'Paris, France',
  debut: '07/2024',
  fin: '12/2024'
};

export class MissionsPrimitives {

  // ─── Utilitaires privés ─────────────────────────────────────────

  private static attendreAutoSave(): void {
    cy.log('Attente sauvegarde automatique...');
    cy.wait(2500);
  }

  private static remplirChamp(selector: string, valeur: string): void {
    cy.get(selector, { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .click()
      .clear()
      .type(valeur, { delay: 50 })
      .blur();
  }

  // Trouve un input par le texte de son mat-label parent
  // Ex: le champ "Rôle" → cherche mat-label contenant "Rôle", puis l'input dans le même mat-form-field
  private static remplirChampParLabel(labelTexte: string, valeur: string): void {
    cy.contains('mat-label', labelTexte, { timeout: 10000 })
      .closest('mat-form-field')
      .find('input')
      .should('be.visible')
      .click()
      .clear()
      .type(valeur, { delay: 50 })
      .blur();
  }

  // CKEditor5 : ni .type(), ni .blur(), ni execCommand ne fonctionnent.
  // - .type() : envoie des key events → crash "root is null"
  // - execCommand('insertText') : ignoré par CKEditor5 (API dépréciée)
  // Solution : simuler un collage (paste) via le pipeline clipboard de CKEditor5.
  // CKEditor5 intercepte les événements paste et les traite correctement.
  private static remplirEditeurCKEditor(selector: string, valeur: string): void {
    // Étape 1 : cliquer pour focus
    cy.get(selector, { timeout: 10000 })
      .scrollIntoView()
      .should('exist')
      .click({ force: true });

    // Étape 2 : attendre que CKEditor soit VRAIMENT focalisé
    cy.get(selector, { timeout: 10000 })
      .should('have.class', 'ck-focused');

    // Étape 3 : simuler un paste via le clipboard de l'app
    cy.get(selector).then($editor => {
      const el = $editor[0];
      const win = el.ownerDocument.defaultView!;

      // créer un DataTransfer avec le texte
      const dataTransfer = new win.DataTransfer();
      dataTransfer.setData('text/plain', valeur);
      dataTransfer.setData('text/html', `<p>${valeur}</p>`);

      // créer l'événement paste avec le clipboardData
      const pasteEvent = new win.ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: dataTransfer
      });

      // dispatcher l'événement sur l'éditeur focalisé
      el.dispatchEvent(pasteEvent);
    });

    // Étape 4 : attendre que CKEditor traite le paste
    cy.wait(500);

    // Étape 5 : vérifier que le texte est bien inséré
    cy.get(selector).should('contain.text', valeur.substring(0, 20));

    // Étape 6 : défocaliser en cliquant ailleurs
    cy.get('body').click(0, 0);
    cy.wait(500);
  }

  private static cliquerBoutonTexte(texte: string): void {
    cy.contains('button', texte, { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
  }

  // ─── Navigation vers la section Missions ───────────────────────

  private static naviguerVersSection(sectionNom: string): void {
    cy.get('mat-sidenav a, nav a, .sidebar a')
      .contains(sectionNom)
      .click({ force: true });
    cy.wait(1000);
  }

  // ─── Garantir qu'une expérience existe (dépendance) ────────────

  // La section Missions dépend de la section Expériences.
  // Si on veut associer une mission à une expérience,
  // il faut d'abord vérifier/créer cette expérience dans la section Expériences.
  static garantirExperienceExistePourMission(
    version: Version,
    titreExperience: string,
    societe: string = 'Redsen Consulting',
    lieu: string = 'Lausanne, Suisse',
    debut: string = '01/2024'
  ): void {
    cy.log(`PRÉPARATION: Garantir expérience "${titreExperience}" pour la mission`);

    // naviguer vers la section Expériences
    MissionsPrimitives.naviguerVersSection('Expériences');
    cy.wait(1000);

    // utiliser les primitives Expériences pour garantir l'existence
    ExperiencesPrimitives.garantirExperienceExiste(version, titreExperience, societe, lieu, debut);

    // revenir sur la section Missions
    MissionsPrimitives.naviguerVersSection('Missions');
    cy.wait(1000);
  }

  // ─── Recherche d'une mission dans la liste ─────────────────────

  static trouverMissionParRole(version: Version, role: string): void {
    cy.log(`Recherche mission "${role}"`);

    const itemSelector = getSelector(SECTION_MISSIONS.ITEM, version);

    if (version === 'v1') {
      cy.get(`${itemSelector}`, { timeout: 10000 })
        .filter((_i, el) => {
          const line2 = el.querySelector('.line-2');
          return line2?.textContent?.trim() === role;
        })
        .first()
        .scrollIntoView()
        .click()
        .as('missionItem');
    } else {
      cy.contains(itemSelector, role)
        .scrollIntoView()
        .click()
        .as('missionItem');
    }

    // attendre que le formulaire de détail se charge
    cy.wait(1000);
  }

  // ─── Vérification d'existence avant action ─────────────────────

  private static missionExiste(
    version: Version,
    role: string,
    callback: (existe: boolean) => void
  ): void {
    const itemSelector = getSelector(SECTION_MISSIONS.ITEM, version);

    if (version === 'v1') {
      cy.get('body').then($body => {
        const items = $body.find(itemSelector);
        const found = items.filter(
          (_i, el) => el.querySelector('.line-2')?.textContent?.trim() === role
        );
        callback(found.length > 0);
      });
    } else {
      cy.get('body').then($body => {
        callback($body.find(`${itemSelector}:contains("${role}")`).length > 0);
      });
    }
  }

  // ─── Préparation (garantir qu'une mission existe) ──────────────

  static garantirMissionExiste(
    version: Version,
    role: string,
    societe: string = FIXTURE_MISSION.societe,
    lieu: string = FIXTURE_MISSION.lieu ?? '',
    debut: string = FIXTURE_MISSION.debut ?? '',
    fin?: string
  ): void {
    cy.log(`PRÉPARATION: Garantir mission "${role}"`);

    MissionsPrimitives.missionExiste(version, role, (existe) => {
      if (!existe) {
        MissionsPrimitives.ajouterMission(version, { role, societe, lieu, debut, fin });
      } else {
        cy.log(`Mission "${role}" déjà présente`);
      }
    });
  }

  // ─── Ajout d'une mission ────────────────────────────────────────

  static ajouterMission(
    version: Version,
    data: MissionData = FIXTURE_MISSION
  ): void {
    cy.log(`Ajout mission "${data.role}" — ${data.societe}`);

    // Cliquer sur "Ajouter une mission"
    MissionsPrimitives.cliquerBoutonTexte('Ajouter une mission');
    cy.wait(1000);

    // Remplir les champs de base (inputs classiques)
    if (data.societe) {
      MissionsPrimitives.remplirChamp(
        getSelector(SECTION_MISSIONS.INPUT_SOCIETE, version),
        data.societe
      );
    }
    if (data.role) {
      MissionsPrimitives.remplirChamp(
        getSelector(SECTION_MISSIONS.INPUT_ROLE, version),
        data.role
      );
    }
    if (data.lieu) {
      MissionsPrimitives.remplirChamp(
        getSelector(SECTION_MISSIONS.INPUT_LIEU, version),
        data.lieu
      );
    }
    if (data.debut) {
      MissionsPrimitives.remplirChamp(
        getSelector(SECTION_MISSIONS.INPUT_DEBUT, version),
        data.debut
      );
    }
    if (data.fin) {
      MissionsPrimitives.remplirChamp(
        getSelector(SECTION_MISSIONS.INPUT_FIN, version),
        data.fin
      );
    }

    // Remplir les éditeurs CKEditor si fournis
    if (data.contexte) {
      MissionsPrimitives.remplirEditeurCKEditor(
        getSelector(SECTION_MISSIONS.EDITOR_CONTEXTE, version),
        data.contexte
      );
    }
    if (data.taches) {
      MissionsPrimitives.remplirEditeurCKEditor(
        getSelector(SECTION_MISSIONS.EDITOR_TACHES, version),
        data.taches
      );
    }
    if (data.actions) {
      MissionsPrimitives.remplirEditeurCKEditor(
        getSelector(SECTION_MISSIONS.EDITOR_ACTIONS, version),
        data.actions
      );
    }
    if (data.resultats) {
      MissionsPrimitives.remplirEditeurCKEditor(
        getSelector(SECTION_MISSIONS.EDITOR_RESULTATS, version),
        data.resultats
      );
    }
    if (data.technologies) {
      MissionsPrimitives.remplirEditeurCKEditor(
        getSelector(SECTION_MISSIONS.EDITOR_TECHNOLOGIES, version),
        data.technologies
      );
    }

    // Enregistrer
    MissionsPrimitives.cliquerBoutonTexte('Enregistrer');
    MissionsPrimitives.attendreAutoSave();
    cy.log(`Mission "${data.role}" ajoutée`);
  }

  // ─── Modification d'une mission ─────────────────────────────────

  static modifierMission(
    version: Version,
    ancienRole: string,
    nouvelleData: Partial<MissionData> = FIXTURE_MISSION_MODIFIEE
  ): void {
    cy.log(`Modification "${ancienRole}" → "${nouvelleData.role || ancienRole}"`);

    MissionsPrimitives.trouverMissionParRole(version, ancienRole);

    if (nouvelleData.role) {
      MissionsPrimitives.remplirChamp(
        getSelector(SECTION_MISSIONS.INPUT_ROLE, version),
        nouvelleData.role
      );
    }
    if (nouvelleData.societe) {
      MissionsPrimitives.remplirChamp(
        getSelector(SECTION_MISSIONS.INPUT_SOCIETE, version),
        nouvelleData.societe
      );
    }
    if (nouvelleData.lieu) {
      MissionsPrimitives.remplirChamp(
        getSelector(SECTION_MISSIONS.INPUT_LIEU, version),
        nouvelleData.lieu
      );
    }
    if (nouvelleData.debut) {
      MissionsPrimitives.remplirChamp(
        getSelector(SECTION_MISSIONS.INPUT_DEBUT, version),
        nouvelleData.debut
      );
    }
    if (nouvelleData.fin) {
      MissionsPrimitives.remplirChamp(
        getSelector(SECTION_MISSIONS.INPUT_FIN, version),
        nouvelleData.fin
      );
    }

    MissionsPrimitives.cliquerBoutonTexte('Enregistrer');
    MissionsPrimitives.attendreAutoSave();
    cy.log(`Mission modifiée`);
  }

  // ─── Copie d'une mission ───────────────────────────────────────

  static copierMission(version: Version, role: string): void {
    cy.log(`Copie de la mission "${role}"`);

    MissionsPrimitives.trouverMissionParRole(version, role);
    MissionsPrimitives.cliquerBoutonTexte('Copier la mission');
    MissionsPrimitives.attendreAutoSave();
    cy.log(`Mission "${role}" copiée`);
  }

  // ─── Suppression d'une mission ─────────────────────────────────

  static supprimerMission(version: Version, role: string): void {
    cy.log(`Suppression mission "${role}"`);

    const supprimerSiExiste = () => {
      MissionsPrimitives.missionExiste(version, role, (existe) => {
        if (existe) {
          MissionsPrimitives.trouverMissionParRole(version, role);

          if (version === 'v1') {
            cy.get(getSelector(SECTION_MISSIONS.BTN_MENU_CONTEXTUEL, version))
              .last()
              .click({ force: true });
            cy.get('.mat-mdc-menu-panel')
              .should('be.visible')
              .contains('button', 'Supprimer la mission')
              .click();
          } else {
            cy.get('@missionItem').within(() => {
              cy.get(getSelector(SECTION_MISSIONS.BTN_SUPPRIMER, version)).click();
            });
          }
          cy.wait(2500).then(() => supprimerSiExiste());
        } else {
          cy.log(`"${role}" supprimé`);
        }
      });
    };
    supprimerSiExiste();
  }

  // ─── Gestion de la confidentialité ────────────────────────────

  static toggleConfidentiel(version: Version, role: string, activer: boolean): void {
    cy.log(`${activer ? 'Marquer confidentielle' : 'Retirer confidentialité'} "${role}"`);

    MissionsPrimitives.trouverMissionParRole(version, role);

    const sel = getSelector(SECTION_MISSIONS.CHECKBOX_CONFIDENTIEL, version);
    cy.get(sel, { timeout: 10000 }).scrollIntoView().find('input[type="checkbox"]').then($input => {
      const isChecked = $input.is(':checked');
      if ((activer && !isChecked) || (!activer && isChecked)) {
        cy.get(sel).find('input[type="checkbox"]').click({ force: true });
      }
    });

    MissionsPrimitives.cliquerBoutonTexte('Enregistrer');
    MissionsPrimitives.attendreAutoSave();
  }

  // ─── Inclusion/exclusion du CV ─────────────────────────────────

  static toggleInclusionCV(version: Version, role: string, inclure: boolean): void {
    cy.log(`${inclure ? 'Inclure' : 'Exclure'} du CV "${role}"`);

    MissionsPrimitives.trouverMissionParRole(version, role);

    const sel = getSelector(SECTION_MISSIONS.CHECKBOX_INCLURE_CV, version);
    cy.get(sel, { timeout: 10000 }).scrollIntoView().find('input[type="checkbox"]').then($input => {
      const isChecked = $input.is(':checked');
      if ((inclure && !isChecked) || (!inclure && isChecked)) {
        cy.get(sel).find('input[type="checkbox"]').click({ force: true });
      }
    });

    MissionsPrimitives.cliquerBoutonTexte('Enregistrer');
    MissionsPrimitives.attendreAutoSave();
  }

  // ─── Association à une expérience ──────────────────────────────

  static associerExperience(version: Version, role: string, titreExperience: string): void {
    cy.log(`Associer "${role}" à l'expérience "${titreExperience}"`);

    MissionsPrimitives.trouverMissionParRole(version, role);

    const sel = getSelector(SECTION_MISSIONS.SELECT_EXPERIENCE, version);

    if (version === 'v1') {
      // mat-select overlay
      cy.get(sel, { timeout: 10000 }).should('exist').click({ force: true });
      cy.get('.cdk-overlay-container mat-option', { timeout: 10000 })
        .contains(titreExperience)
        .click({ force: true });
    } else {
      cy.get(sel).select(titreExperience);
    }

    MissionsPrimitives.cliquerBoutonTexte('Enregistrer');
    MissionsPrimitives.attendreAutoSave();
  }

  // ─── Renseigner les éditeurs CKEditor ──────────────────────────

  static renseignerContenu(
    version: Version,
    role: string,
    champ: 'contexte' | 'taches' | 'actions' | 'resultats' | 'technologies',
    contenu: string
  ): void {
    cy.log(`Renseigner ${champ} de "${role}"`);

    MissionsPrimitives.trouverMissionParRole(version, role);

    const selectorMap = {
      contexte: SECTION_MISSIONS.EDITOR_CONTEXTE,
      taches: SECTION_MISSIONS.EDITOR_TACHES,
      actions: SECTION_MISSIONS.EDITOR_ACTIONS,
      resultats: SECTION_MISSIONS.EDITOR_RESULTATS,
      technologies: SECTION_MISSIONS.EDITOR_TECHNOLOGIES
    };

    MissionsPrimitives.remplirEditeurCKEditor(
      getSelector(selectorMap[champ], version),
      contenu
    );

    MissionsPrimitives.cliquerBoutonTexte('Enregistrer');
    MissionsPrimitives.attendreAutoSave();
  }

  // ─── Vérifications ─────────────────────────────────────────────

  static verifierExiste(version: Version, role: string): void {
    cy.log(`Vérifier existence "${role}"`);

    const itemSelector = getSelector(SECTION_MISSIONS.ITEM, version);

    if (version === 'v1') {
      cy.get(itemSelector, { timeout: 10000 })
        .filter((_i, el) => el.querySelector('.line-2')?.textContent?.trim() === role)
        .should('have.length.greaterThan', 0);
    } else {
      cy.contains(itemSelector, role).scrollIntoView().should('exist');
    }
  }

  static verifierAbsente(version: Version, role: string): void {
    cy.log(`Vérifier absence "${role}"`);
    cy.wait(3000);

    const itemSelector = getSelector(SECTION_MISSIONS.ITEM, version);

    if (version === 'v1') {
      cy.get('body').then($body => {
        const found = $body
          .find(itemSelector)
          .filter((_i, el) => el.querySelector('.line-2')?.textContent?.trim() === role);
        expect(found.length).to.equal(0);
      });
    } else {
      cy.contains(itemSelector, role).should('not.exist');
    }
  }

  static verifierChamps(
    version: Version,
    role: string,
    societe: string,
    lieu: string
  ): void {
    cy.log(`Vérifier champs de "${role}" — ${societe} / ${lieu}`);

    MissionsPrimitives.trouverMissionParRole(version, role);

    const inputSociete = getSelector(SECTION_MISSIONS.INPUT_SOCIETE, version);
    const inputLieu = getSelector(SECTION_MISSIONS.INPUT_LIEU, version);

    if (version === 'v1') {
      cy.get(inputSociete, { timeout: 10000 }).should($el => {
        expect(($el[0] as HTMLInputElement).value).to.equal(societe);
      });
      cy.get(inputLieu).should($el => {
        expect(($el[0] as HTMLInputElement).value).to.equal(lieu);
      });
    } else {
      cy.get(inputSociete).should('have.value', societe);
      cy.get(inputLieu).should('have.value', lieu);
    }
  }

  static verifierConfidentiel(version: Version, role: string, attenduConfidentiel: boolean): void {
    cy.log(`Vérifier confidentialité "${role}" = ${attenduConfidentiel}`);

    MissionsPrimitives.trouverMissionParRole(version, role);

    cy.get(getSelector(SECTION_MISSIONS.CHECKBOX_CONFIDENTIEL, version), { timeout: 10000 })
      .find('input[type="checkbox"]')
      .then($input => expect($input.is(':checked')).to.equal(attenduConfidentiel));
  }

  static verifierInclusionCV(version: Version, role: string, attenduInclus: boolean): void {
    cy.log(`Vérifier inclusion CV "${role}" = ${attenduInclus}`);

    MissionsPrimitives.trouverMissionParRole(version, role);

    cy.get(getSelector(SECTION_MISSIONS.CHECKBOX_INCLURE_CV, version), { timeout: 10000 })
      .find('input[type="checkbox"]')
      .then($input => expect($input.is(':checked')).to.equal(attenduInclus));
  }

  static verifierCopie(version: Version, roleOriginal: string): void {
    cy.log(`Vérifier copie de "${roleOriginal}"`);

    const itemSelector = getSelector(SECTION_MISSIONS.ITEM, version);

    if (version === 'v1') {
      cy.get(itemSelector, { timeout: 10000 })
        .filter((_i, el) => {
          const text = el.querySelector('.line-2')?.textContent?.trim() ?? '';
          return text === roleOriginal || text === `${roleOriginal} (copie)`;
        })
        .should('have.length.greaterThan', 1);
    } else {
      cy.get(itemSelector)
        .filter(`:contains("${roleOriginal}")`)
        .should('have.length.greaterThan', 1);
    }
  }

  static verifierExperienceAssociee(version: Version, role: string, titreExperience: string): void {
    cy.log(`Vérifier expérience associée à "${role}"`);

    MissionsPrimitives.trouverMissionParRole(version, role);

    cy.get(getSelector(SECTION_MISSIONS.SELECT_EXPERIENCE, version), { timeout: 10000 })
      .should('contain.text', titreExperience);
  }

  static verifierContenu(
    version: Version,
    role: string,
    champ: 'contexte' | 'taches' | 'actions' | 'resultats' | 'technologies',
    contenuAttendu: string
  ): void {
    cy.log(`Vérifier ${champ} de "${role}"`);

    MissionsPrimitives.trouverMissionParRole(version, role);

    const selectorMap = {
      contexte: SECTION_MISSIONS.EDITOR_CONTEXTE,
      taches: SECTION_MISSIONS.EDITOR_TACHES,
      actions: SECTION_MISSIONS.EDITOR_ACTIONS,
      resultats: SECTION_MISSIONS.EDITOR_RESULTATS,
      technologies: SECTION_MISSIONS.EDITOR_TECHNOLOGIES
    };

    cy.get(getSelector(selectorMap[champ], version), { timeout: 10000 })
      .should('contain.text', contenuAttendu);
  }
}