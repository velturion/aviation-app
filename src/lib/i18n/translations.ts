// Translations for the app
export const translations = {
  es: {
    // Home
    breakingNews: 'Noticias de Última Hora',
    seeMore: 'Ver Más',
    login: 'Iniciar Sesión',
    signup: 'Registrarse',
    // Auth
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    name: 'Nombre completo',
    forgotPassword: '¿Olvidaste tu contraseña?',
    noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?',
    createAccount: 'Crear cuenta',
    // Breaking News
    breakingNewsTitle: 'Noticias de Última Hora - Aviación',
    whatHappened: '¿Qué pasó?',
    where: '¿Dónde?',
    when: '¿Cuándo?',
    currentStatus: 'Estado actual',
    operationalContext: 'Contexto operacional',
    affectsRoutes: '¿Afecta mis rutas/flota/región?',
    procedureChanges: 'Cambios en procedimientos',
    certaintlyLevel: 'Nivel de certeza',
    confirmed: 'Confirmado por',
    preliminary: 'Preliminar - puede cambiar',
    official: 'Oficial',
    hypothesis: 'Hipótesis',
    // Common
    loading: 'Cargando...',
    offline: 'Sin conexión',
    darkMode: 'Modo oscuro',
    lightMode: 'Modo claro',
    language: 'Idioma',
  },
  en: {
    // Home
    breakingNews: 'Breaking News',
    seeMore: 'See More',
    login: 'Log In',
    signup: 'Sign Up',
    // Auth
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    name: 'Full name',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    createAccount: 'Create account',
    // Breaking News
    breakingNewsTitle: 'Breaking News - Aviation',
    whatHappened: 'What happened?',
    where: 'Where?',
    when: 'When?',
    currentStatus: 'Current status',
    operationalContext: 'Operational context',
    affectsRoutes: 'Does it affect my routes/fleet/region?',
    procedureChanges: 'Procedure changes',
    certaintlyLevel: 'Certainty level',
    confirmed: 'Confirmed by',
    preliminary: 'Preliminary - may change',
    official: 'Official',
    hypothesis: 'Hypothesis',
    // Common
    loading: 'Loading...',
    offline: 'Offline',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    language: 'Language',
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.es;

// Detect browser language
export function detectLanguage(): Language {
  if (typeof window === 'undefined') return 'es';

  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'en' ? 'en' : 'es';
}

// Get translation
export function t(key: TranslationKey, lang: Language): string {
  return translations[lang][key] || translations.es[key] || key;
}
