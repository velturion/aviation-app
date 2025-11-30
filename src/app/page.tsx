'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { AdBanner, BreakingNewsCarousel, ThemeToggle, LanguageToggle } from '@/components/common';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Top Bar - Theme & Language */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="font-bold text-lg">APP AVIATION</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 px-4 pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Ad Space - Top */}
          <section className="mt-4">
            <AdBanner position="top" />
          </section>

          {/* Breaking News Carousel */}
          <section className="py-4">
            <BreakingNewsCarousel />
          </section>

          {/* Login / Sign Up Buttons */}
          <section className="py-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Link href="/auth/login" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold text-lg transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                    <polyline points="7.5 19.79 7.5 14.6 3 12" />
                    <polyline points="21 12 16.5 14.6 16.5 19.79" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  {t('login')}
                </button>
              </Link>

              <Link href="/auth/signup" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 bg-surface hover:bg-gray-700 border-2 border-gray-600 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                    <line x1="12" y1="11" x2="12" y2="17" />
                    <line x1="9" y1="14" x2="15" y2="14" />
                  </svg>
                  {t('signup')}
                </button>
              </Link>
            </div>

            {/* Tagline */}
            <p className="text-center text-gray-500 mt-6 text-sm">
              Tu copiloto digital - La app diseñada por pilotos, para pilotos
            </p>
          </section>

          {/* Features Preview */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
            <FeatureCard
              icon="📅"
              title="Roster & Vuelos"
              description="Gestiona tu programación"
            />
            <FeatureCard
              icon="📚"
              title="Estudio"
              description="MEL, CFIT/ALAR, Exámenes"
            />
            <FeatureCard
              icon="🗺️"
              title="Layover"
              description="Lugares recomendados"
            />
            <FeatureCard
              icon="🤖"
              title="AI Coach"
              description="Entrenamiento con IA"
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 APP AVIATION - Todos los derechos reservados</p>
          <p className="mt-1">Diseñado para pilotos profesionales</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-surface border border-gray-800 rounded-xl p-4 text-center hover:border-primary/50 transition-colors">
      <span className="text-3xl block mb-2">{icon}</span>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-gray-500 text-xs mt-1">{description}</p>
    </div>
  );
}
