/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONFIGURATION SÉLECTEURS - AUTHENTIFICATION
 * ═══════════════════════════════════════════════════════════════════════════
 * Centralisation des sélecteurs v1/v2 avec résolution dynamique
 * via getSelector() — même pattern que selectors-carte-cv.config.ts
 */

export type Version = 'v1' | 'v2';

interface SelectorMap {
  v1: string;
  v2: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// URLs
// ═══════════════════════════════════════════════════════════════════════════════

export const AUTH_URLS = {
  BASE: {
    v1: 'https://redsumedev.z6.web.core.windows.net',
    v2: 'https://redsume-v2.example.com'
  } as SelectorMap,

  PAGE_PROTEGEE: {
    v1: 'https://redsumedev.z6.web.core.windows.net/boards/me',
    v2: 'https://redsume-v2.example.com/dashboard'
  } as SelectorMap,

  // Fragments d'URL pour vérifications
  URL_LOGIN: {
    v1: 'b2clogin.com',
    v2: '/login'
  } as SelectorMap,

  URL_DASHBOARD: {
    v1: '/boards/me',
    v2: '/dashboard'
  } as SelectorMap,
};

// ═══════════════════════════════════════════════════════════════════════════════
// SÉLECTEURS - PAGE DE CONNEXION
// ═══════════════════════════════════════════════════════════════════════════════

export const AUTH_SELECTORS = {

  // ─── Page de connexion ─────────────────────────────────────────────────────
  PAGE_LOGIN_VISIBLE: {
    v1: '',  // Vérification par texte (cy.contains)
    v2: '[data-testid="login-page"]'
  } as SelectorMap,

  PAGE_LOGIN_TEXT: {
    v1: 'Sign in with your email address',
    v2: ''  // Vérification par sélecteur
  } as SelectorMap,

  // ─── Champs de saisie ─────────────────────────────────────────────────────
  INPUT_EMAIL: {
    v1: 'input[id=signInName]',
    v2: '[data-testid="email-input"]'
  } as SelectorMap,

  INPUT_PASSWORD: {
    v1: 'input[id=password]',
    v2: '[data-testid="password-input"]'
  } as SelectorMap,

  // ─── Boutons ──────────────────────────────────────────────────────────────
  BTN_CONNEXION: {
    v1: 'button[id=next]',
    v2: '[data-testid="login-button"]'
  } as SelectorMap,

  // ─── Menu utilisateur / Déconnexion ────────────────────────────────────────
  MENU_UTILISATEUR: {
    v1: 'mat-icon:contains("keyboard_arrow_down")',
    v2: '[data-testid="user-menu"]'
  } as SelectorMap,

  BTN_DECONNEXION: {
    v1: '',  // Vérification par texte (cy.contains('Déconnexion'))
    v2: '[data-testid="logout-button"]'
  } as SelectorMap,

  DECONNEXION_TEXT: {
    v1: 'Déconnexion',
    v2: ''  // Vérification par sélecteur
  } as SelectorMap,

  // ─── Vérifications post-connexion ──────────────────────────────────────────
  APP_LOADED: {
    v1: '',  // Vérification par texte (cy.contains('ReDsume'))
    v2: '[data-testid="dashboard"]'
  } as SelectorMap,

  APP_LOADED_TEXT: {
    v1: 'ReDsume',
    v2: ''  // Vérification par sélecteur
  } as SelectorMap,

  ESPACE_PERSONNEL: {
    v1: '',  // Vérification par texte (cy.contains('Mon Dashboard'))
    v2: '[data-testid="personal-space"]'
  } as SelectorMap,

  ESPACE_PERSONNEL_TEXT: {
    v1: 'Mon Dashboard',
    v2: ''  // Vérification par sélecteur
  } as SelectorMap,

  // ─── Messages d'erreur ─────────────────────────────────────────────────────
  ERROR_IDENTIFIANTS: {
    v1: '',  // Vérification par texte
    v2: '[data-testid="error-message"]'
  } as SelectorMap,

  ERROR_IDENTIFIANTS_TEXT: {
    v1: 'Your password is incorrect',
    v2: 'incorrect'
  } as SelectorMap,

  ERROR_COMPTE_INEXISTANT: {
    v1: '',  // Vérification par texte
    v2: '[data-testid="error-message"]'
  } as SelectorMap,

  ERROR_COMPTE_INEXISTANT_TEXT: {
    v1: "We can't seem to find your account",
    v2: 'account'
  } as SelectorMap,
};

// ═══════════════════════════════════════════════════════════════════════════════
// CREDENTIALS DE TEST
// ═══════════════════════════════════════════════════════════════════════════════

export const AUTH_CREDENTIALS = {
  VALID: {
    email: 'kitabrhi.youssef.1@gmail.com',
    password: 'Winners@2003'
  },
  INVALID: {
    email: 'kitabrhi.youssef.1@gmail.com',
    password: 'MauvaisMotDePasse123!'
  },
  EMAIL_INVALIDE: {
    email: 'email-inexistant-xyz@fake.com',
    password: 'nimportequoi'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// FONCTION UTILITAIRE - Résolution dynamique v1/v2
// ═══════════════════════════════════════════════════════════════════════════════

export function getSelector(selectorMap: SelectorMap, version: Version): string {
  return selectorMap[version];
}