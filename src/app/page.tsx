'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { AdBanner, BreakingNewsCarousel, ThemeToggle, LanguageToggle } from '@/components/common';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Top Bar - Theme & Language */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-background)]/90 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">✈️</span>
            <span className="font-bold text-base sm:text-lg">APP AVIATION</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-14 sm:pt-16 px-3 sm:px-4 lg:px-6 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Ad Space - Top */}
          <section className="mt-2 sm:mt-4">
            <AdBanner position="top" />
          </section>

          {/* Breaking News Carousel */}
          <section className="py-2 sm:py-4">
            <BreakingNewsCarousel />
          </section>

          {/* Login / Sign Up Buttons */}
          <section className="py-4 sm:py-6 md:py-8">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-8">
              Bienvenido a <span className="text-blue-500">APP AVIATION</span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-lg mx-auto px-4">
              <Link href="/auth/login" className="w-full sm:w-auto">
                <button className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl text-white font-semibold text-base sm:text-lg transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 sm:gap-3">
                  {/* Airplane icon */}
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                  {t('login')}
                </button>
              </Link>

              <Link href="/auth/signup" className="w-full sm:w-auto">
                <button className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl text-white font-semibold text-base sm:text-lg transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 sm:gap-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <p className="text-center text-gray-500 mt-4 sm:mt-6 text-xs sm:text-sm">
              Tu copiloto digital - La app diseñada por pilotos, para pilotos
            </p>
          </section>

          {/* Features Preview */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 py-2 sm:py-4">
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
      <footer className="border-t border-gray-800/50 py-4 sm:py-6 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-xs sm:text-sm">
          <p>© 2025 APP AVIATION - Todos los derechos reservados</p>
          <p className="mt-1">Diseñado para Tripulaciones Profesionales</p>
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
    <div className="bg-surface border border-gray-800 rounded-xl p-3 sm:p-4 text-center hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
      <span className="text-2xl sm:text-3xl md:text-4xl block mb-2">{icon}</span>
      <h3 className="font-semibold text-xs sm:text-sm md:text-base">{title}</h3>
      <p className="text-gray-500 text-xs mt-1 hidden sm:block">{description}</p>
    </div>
  );
}
