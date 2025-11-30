'use client';

import { useLanguage } from '@/lib/i18n';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
      className="px-3 py-1.5 rounded-full bg-surface hover:bg-gray-700 transition-colors text-sm font-medium"
      title="Cambiar idioma / Change language"
    >
      {language === 'es' ? '🇲🇽 ES' : '🇺🇸 EN'}
    </button>
  );
}
