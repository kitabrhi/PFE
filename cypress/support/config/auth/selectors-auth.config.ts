

export type Version = 'v1' | 'v2';

interface SelectorMap {
  v1: string;
  v2: string;
}

// URLs utiles pour les tests d'authentification

export const AUTH_URLS = {
  BASE: {
    v1: 'https://redsumedev.z6.web.core.windows.net',
    v2: 'https://redsume-v2.example.com'
  } as SelectorMap,

  PAGE_PROTEGEE: {
    v1: 'https://redsumedev.z6.web.core.windows.net/boards/me',
    v2: 'https://redsume-v2.example.com/dashboard'
  } as SelectorMap,

  // Morceaux d'URL utilisés dans les assertions
  URL_LOGIN: {
    v1: 'b2clogin.com',
    v2: '/login'
  } as SelectorMap,

  URL_DASHBOARD: {
    v1: '/boards/me',
    v2: '/dashboard'
  } as SelectorMap,
};

// Sélecteurs de la page de connexion

export const AUTH_SELECTORS = {

  // Éléments qui permettent de valider qu'on est bien sur la page de connexion
  PAGE_LOGIN_VISIBLE: {
    v1: '',  // En v1, la présence de la page est vérifiée via le texte affiché
    v2: '[data-testid="login-page"]'
  } as SelectorMap,

  PAGE_LOGIN_TEXT: {
    v1: 'Sign in with your email address',
    v2: ''  // En v2, la vérification passe par le sélecteur dédié
  } as SelectorMap,

  // Champs du formulaire
  INPUT_EMAIL: {
    v1: 'input[id=signInName]',
    v2: '[data-testid="email-input"]'
  } as SelectorMap,

  INPUT_PASSWORD: {
    v1: 'input[id=password]',
    v2: '[data-testid="password-input"]'
  } as SelectorMap,

  // Actions principales
  BTN_CONNEXION: {
    v1: 'button[id=next]',
    v2: '[data-testid="login-button"]'
  } as SelectorMap,

  // Menu utilisateur et déconnexion
  MENU_UTILISATEUR: {
    v1: 'mat-icon:contains("keyboard_arrow_down")',
    v2: '[data-testid="user-menu"]'
  } as SelectorMap,

  BTN_DECONNEXION: {
    v1: '',  // En v1, on cible le libellé visible dans le menu
    v2: '[data-testid="logout-button"]'
  } as SelectorMap,

  DECONNEXION_TEXT: {
    v1: 'Déconnexion',
    v2: ''  // En v2, la vérification se fait directement avec le sélecteur
  } as SelectorMap,

  // Éléments attendus après une connexion réussie
  APP_LOADED: {
    v1: '',  // En v1, on confirme le chargement avec le texte visible
    v2: '[data-testid="dashboard"]'
  } as SelectorMap,

  APP_LOADED_TEXT: {
    v1: 'ReDsume',
    v2: ''  // En v2, le sélecteur suffit
  } as SelectorMap,

  ESPACE_PERSONNEL: {
    v1: '',  // En v1, on s'appuie sur le texte affiché
    v2: '[data-testid="personal-space"]'
  } as SelectorMap,

  ESPACE_PERSONNEL_TEXT: {
    v1: 'Mon Dashboard',
    v2: ''  // En v2, on utilise le sélecteur dédié
  } as SelectorMap,

  // Messages affichés en cas d'erreur
  ERROR_IDENTIFIANTS: {
    v1: '',  // En v1, l'erreur est validée à partir du texte
    v2: '[data-testid="error-message"]'
  } as SelectorMap,

  ERROR_IDENTIFIANTS_TEXT: {
    v1: 'Your password is incorrect',
    v2: 'incorrect'
  } as SelectorMap,

  ERROR_COMPTE_INEXISTANT: {
    v1: '',  // En v1, l'erreur est validée à partir du texte
    v2: '[data-testid="error-message"]'
  } as SelectorMap,

  ERROR_COMPTE_INEXISTANT_TEXT: {
    v1: "We can't seem to find your account",
    v2: 'account'
  } as SelectorMap,
};

// Identifiants utilisés dans les scénarios de test

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
  },
  COLLEGUE: {
    email: 'ykitabrhi@redsen.ch'
  }
};

// Retourne le sélecteur correspondant à la version testée

export function getSelector(selectorMap: SelectorMap, version: Version): string {
  return selectorMap[version];
}
