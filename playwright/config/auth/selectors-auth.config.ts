

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

  PAGE_LOGIN_VISIBLE: {
    v1: '',
    v2: '[data-testid="login-page"]'
  } as SelectorMap,

  PAGE_LOGIN_TEXT: {
    v1: 'Sign in with your email address',
    v2: ''
  } as SelectorMap,

  INPUT_EMAIL: {
    v1: 'input[id=signInName]',
    v2: '[data-testid="email-input"]'
  } as SelectorMap,

  INPUT_PASSWORD: {
    v1: 'input[id=password]',
    v2: '[data-testid="password-input"]'
  } as SelectorMap,

  BTN_CONNEXION: {
    v1: 'button[id=next]',
    v2: '[data-testid="login-button"]'
  } as SelectorMap,

  MENU_UTILISATEUR: {
    v1: 'mat-icon:contains("keyboard_arrow_down")',
    v2: '[data-testid="user-menu"]'
  } as SelectorMap,

  BTN_DECONNEXION: {
    v1: '',
    v2: '[data-testid="logout-button"]'
  } as SelectorMap,

  DECONNEXION_TEXT: {
    v1: 'Déconnexion',
    v2: ''
  } as SelectorMap,

  APP_LOADED: {
    v1: '',
    v2: '[data-testid="dashboard"]'
  } as SelectorMap,

  APP_LOADED_TEXT: {
    v1: 'ReDsume',
    v2: ''
  } as SelectorMap,

  ESPACE_PERSONNEL: {
    v1: '',
    v2: '[data-testid="personal-space"]'
  } as SelectorMap,

  ESPACE_PERSONNEL_TEXT: {
    v1: 'Mon Dashboard',
    v2: ''
  } as SelectorMap,

  ERROR_IDENTIFIANTS: {
    v1: '',
    v2: '[data-testid="error-message"]'
  } as SelectorMap,

  ERROR_IDENTIFIANTS_TEXT: {
    v1: 'Your password is incorrect',
    v2: 'incorrect'
  } as SelectorMap,

  ERROR_COMPTE_INEXISTANT: {
    v1: '',
    v2: '[data-testid="error-message"]'
  } as SelectorMap,

  ERROR_COMPTE_INEXISTANT_TEXT: {
    v1: "We can't seem to find your account",
    v2: 'account'
  } as SelectorMap,
};

// Identifiants — lus depuis process.env (équivalent de Cypress.env())

export const AUTH_CREDENTIALS = {
  VALID: {
    get email(): string { return process.env.USER_LOGIN || ''; },
    get password(): string { return process.env.USER_PASSWORD || ''; },
  },
  INVALID: {
    get email(): string { return process.env.USER_LOGIN || ''; },
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

export function getSelector(selectorMap: SelectorMap, version: Version): string {
  return selectorMap[version];
}
