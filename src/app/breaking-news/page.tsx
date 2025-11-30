'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { ThemeToggle, LanguageToggle, AdBanner } from '@/components/common';

interface BreakingNewsDetail {
  id: string;
  title: string;
  // Core facts
  whatHappened: string;
  where: string;
  when: string;
  currentStatus: string;
  // Operational context
  affectsRoutes: string[];
  procedureChanges: string[];
  restrictions: string[];
  // Certainty
  certaintyLevel: 'confirmed' | 'preliminary' | 'hypothesis';
  source: string;
  sourceAuthority: string;
  officialVsHypothesis: {
    official: string[];
    hypothesis: string[];
  };
  // Meta
  severity: 'critical' | 'high' | 'medium';
  publishedAt: string;
  updatedAt: string;
  category: string;
}

// Mock breaking news with AI analysis
const mockBreakingNews: BreakingNewsDetail[] = [
  {
    id: '1',
    title: 'NOTAM: Restricción de espacio aéreo sobre zona norte de México',
    whatHappened: 'La DGAC ha emitido un NOTAM estableciendo una restricción temporal de espacio aéreo (TRA) entre FL200 y FL350 en el sector entre MMTY y MMCS debido a ejercicios militares.',
    where: 'Sector aéreo entre Monterrey (MMTY) y Ciudad del Carmen (MMCS), norte de México. Coordenadas: N25°00\' W100°00\' a N20°00\' W92°00\'.',
    when: 'Efectivo desde 20 ENE 2024 0600Z hasta 25 ENE 2024 1800Z (5 días).',
    currentStatus: 'ACTIVO. La restricción está en vigor. Todos los vuelos comerciales deben solicitar autorización especial o utilizar rutas alternativas.',
    affectsRoutes: [
      'Rutas MEX-MID, MEX-CUN con segmento norte',
      'Rutas GDL-CUN que cruzan el sector',
      'Tráfico internacional USA-Centro América',
    ],
    procedureChanges: [
      'Solicitar autorización ATC con 2 horas de anticipación',
      'Plan de vuelo debe incluir nota "TRA NORTE MEX"',
      'Altitud máxima FL190 sin autorización especial',
    ],
    restrictions: [
      'No se permite tráfico VFR en el sector',
      'Comunicación obligatoria con México Control',
      'Transpondedor modo C/S requerido',
    ],
    certaintyLevel: 'confirmed',
    source: 'NOTAM A0234/24',
    sourceAuthority: 'DGAC México',
    officialVsHypothesis: {
      official: [
        'Restricción temporal por ejercicios militares',
        'Duración de 5 días confirmada',
        'Rutas alternativas disponibles',
      ],
      hypothesis: [],
    },
    severity: 'high',
    publishedAt: '2024-01-20T06:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    category: 'NOTAM',
  },
  {
    id: '2',
    title: 'Boeing 737 MAX: Nueva directiva de aeronavegabilidad',
    whatHappened: 'La FAA ha emitido una Airworthiness Directive (AD) de emergencia requiriendo inspección del sistema de combustible en todos los B737 MAX 8 y MAX 9. Se detectó potencial fuga en la unión del tanque central.',
    where: 'Afecta a todos los operadores de B737 MAX 8/9 a nivel mundial. Aproximadamente 1,200 aeronaves.',
    when: 'AD emitida: 20 ENE 2024. Plazo para cumplimiento: 30 días para inspección inicial, 90 días para corrección si aplica.',
    currentStatus: 'La AD está en vigor. Aerolíneas comenzando inspecciones. No hay grounding general, pero vuelos pueden verse afectados por disponibilidad de aeronaves.',
    affectsRoutes: [
      'Operadores de B737 MAX pueden tener reducción de flota temporal',
      'Posibles cancelaciones en rutas de alta frecuencia',
      'Afecta principalmente operadores de bajo costo',
    ],
    procedureChanges: [
      'Inspección visual antes de cada día de operación',
      'Verificación de niveles de combustible cada 4 horas de vuelo',
      'Reporte inmediato de olores a combustible',
    ],
    restrictions: [
      'ETOPS suspendido hasta completar inspección',
      'Vuelos sobre agua limitados a 60 minutos de costa',
    ],
    certaintyLevel: 'confirmed',
    source: 'AD 2024-01-15',
    sourceAuthority: 'FAA / EASA',
    officialVsHypothesis: {
      official: [
        'Defecto identificado en juntas de tanque central',
        'No hay reportes de incidentes relacionados',
        'Inspección es preventiva',
      ],
      hypothesis: [
        'Posible extensión del plazo de cumplimiento',
        'Se evalúa si aplica a B737 NG también',
      ],
    },
    severity: 'critical',
    publishedAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
    category: 'AD',
  },
  {
    id: '3',
    title: 'Alerta meteorológica: Ceniza volcánica en ruta Pacífico',
    whatHappened: 'El volcán Popocatépetl presenta actividad eruptiva con emisión de ceniza volcánica alcanzando FL280. El VAAC Ciudad de México ha emitido SIGMET para la zona.',
    where: 'Área de afectación: Radio de 150nm desde el volcán (19°01\'N 098°37\'W). Incluye aproximaciones a MMMX, MMTC y corredores hacia el oeste.',
    when: 'Actividad iniciada: 20 ENE 2024 0800Z. Pronóstico de continuidad: 24-48 horas.',
    currentStatus: 'ACTIVO. Nube de ceniza moviéndose hacia el oeste. Concentración moderada. Visibilidad reducida en zona.',
    affectsRoutes: [
      'MEX-GDL corredor sur',
      'MEX-TIJ vía Pacífico',
      'Aproximaciones ILS 05L/R MMMX afectadas',
    ],
    procedureChanges: [
      'Evitar vuelo en nube visible de ceniza',
      'Altitud mínima FL300 en zona de precaución',
      'Monitoreo continuo de SIGMET',
    ],
    restrictions: [
      'Prohibido vuelo visual en área de 50nm del volcán',
      'Restricción de aproximación visual MMMX',
    ],
    certaintyLevel: 'confirmed',
    source: 'SIGMET 3 MMMX',
    sourceAuthority: 'VAAC Ciudad de México / SMN',
    officialVsHypothesis: {
      official: [
        'Actividad volcánica confirmada por CENAPRED',
        'Nube de ceniza detectada por satélite',
        'Pronóstico de 24-48 horas de actividad',
      ],
      hypothesis: [
        'Posible incremento de actividad según patrones históricos',
        'Evaluación de cierre temporal de MMMX si incrementa',
      ],
    },
    severity: 'high',
    publishedAt: '2024-01-20T08:30:00Z',
    updatedAt: '2024-01-20T10:15:00Z',
    category: 'METEOROLOGÍA',
  },
];

const severityColors = {
  critical: 'border-red-500 bg-red-500/10 text-red-400',
  high: 'border-orange-500 bg-orange-500/10 text-orange-400',
  medium: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
};

const severityBadge = {
  critical: 'bg-red-500 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-black',
};

const certaintyColors = {
  confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
  preliminary: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hypothesis: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function BreakingNewsPage() {
  const { t, language } = useLanguage();
  const [selectedNews, setSelectedNews] = useState<BreakingNewsDetail | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredNews = filter === 'all'
    ? mockBreakingNews
    : mockBreakingNews.filter(n => n.severity === filter);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(language === 'es' ? 'es-MX' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">✈️</span>
              <span className="font-bold text-lg hidden sm:block">APP AVIATION</span>
            </Link>
            <span className="text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="font-semibold text-sm">{t('breakingNews')}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Ad Banner */}
          <AdBanner position="top" className="mb-6" />

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {t('breakingNewsTitle')}
            </h1>
            <p className="text-gray-400">
              Información crítica analizada por IA para pilotos profesionales
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { value: 'all', label: 'Todas' },
              { value: 'critical', label: '🚨 Críticas' },
              { value: 'high', label: '⚠️ Altas' },
              { value: 'medium', label: 'ℹ️ Medias' },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  filter === f.value
                    ? 'bg-primary text-white'
                    : 'bg-surface text-gray-400 hover:bg-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* News Grid / Detail View */}
          {selectedNews ? (
            <NewsDetail news={selectedNews} onBack={() => setSelectedNews(null)} formatDate={formatDate} />
          ) : (
            <div className="space-y-4">
              {filteredNews.map(news => (
                <article
                  key={news.id}
                  onClick={() => setSelectedNews(news)}
                  className={`bg-surface border-l-4 ${severityColors[news.severity]} rounded-lg p-5 cursor-pointer hover:bg-gray-800/50 transition-colors`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${severityBadge[news.severity]}`}>
                        {news.severity === 'critical' ? '🚨 CRÍTICO' : news.severity === 'high' ? '⚠️ ALTO' : 'ℹ️ MEDIO'}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                        {news.category}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(news.publishedAt)}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold mb-2">{news.title}</h2>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">{news.whatHappened}</p>

                  <div className="flex items-center justify-between">
                    <div className={`px-2 py-1 rounded text-xs border ${certaintyColors[news.certaintyLevel]}`}>
                      {news.certaintyLevel === 'confirmed' ? '✓ Confirmado' : news.certaintyLevel === 'preliminary' ? '⏳ Preliminar' : '? Hipótesis'}
                      <span className="text-gray-500 ml-1">por {news.sourceAuthority}</span>
                    </div>
                    <span className="text-primary text-sm">Ver análisis completo →</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function NewsDetail({
  news,
  onBack,
  formatDate,
}: {
  news: BreakingNewsDetail;
  onBack: () => void;
  formatDate: (d: string) => string;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a noticias
      </button>

      {/* Header */}
      <div className={`bg-surface border-l-4 ${severityColors[news.severity]} rounded-lg p-6`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded text-sm font-bold ${severityBadge[news.severity]}`}>
            {news.severity === 'critical' ? '🚨 CRÍTICO' : news.severity === 'high' ? '⚠️ ALTO' : 'ℹ️ MEDIO'}
          </span>
          <span className="text-sm text-gray-500 bg-gray-800 px-2 py-1 rounded">
            {news.category}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-4">{news.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>Publicado: {formatDate(news.publishedAt)}</span>
          <span>•</span>
          <span>Actualizado: {formatDate(news.updatedAt)}</span>
        </div>
      </div>

      {/* Core Facts */}
      <div className="grid md:grid-cols-2 gap-4">
        <InfoCard icon="❓" title={t('whatHappened')} content={news.whatHappened} />
        <InfoCard icon="📍" title={t('where')} content={news.where} />
        <InfoCard icon="🕐" title={t('when')} content={news.when} />
        <InfoCard icon="📊" title={t('currentStatus')} content={news.currentStatus} highlight />
      </div>

      {/* Operational Context */}
      <div className="bg-surface border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          ✈️ {t('operationalContext')}
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-yellow-400 mb-2">{t('affectsRoutes')}</h3>
            <ul className="space-y-1">
              {news.affectsRoutes.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300">
                  <span className="text-yellow-400">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-blue-400 mb-2">{t('procedureChanges')}</h3>
            <ul className="space-y-1">
              {news.procedureChanges.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300">
                  <span className="text-blue-400">{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {news.restrictions.length > 0 && (
            <div>
              <h3 className="font-medium text-red-400 mb-2">Restricciones</h3>
              <ul className="space-y-1">
                {news.restrictions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-red-400">⛔</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Certainty Level */}
      <div className="bg-surface border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          🎯 {t('certaintlyLevel')}
        </h2>

        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${certaintyColors[news.certaintyLevel]} mb-4`}>
          {news.certaintyLevel === 'confirmed' ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{t('confirmed')} {news.sourceAuthority}</span>
            </>
          ) : news.certaintyLevel === 'preliminary' ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{t('preliminary')}</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{t('hypothesis')}</span>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h3 className="font-medium text-green-400 mb-2 flex items-center gap-2">
              ✓ {t('official')}
            </h3>
            <ul className="space-y-1 text-sm">
              {news.officialVsHypothesis.official.map((item, i) => (
                <li key={i} className="text-gray-300">• {item}</li>
              ))}
            </ul>
          </div>

          {news.officialVsHypothesis.hypothesis.length > 0 && (
            <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4">
              <h3 className="font-medium text-gray-400 mb-2 flex items-center gap-2">
                ? {t('hypothesis')}
              </h3>
              <ul className="space-y-1 text-sm">
                {news.officialVsHypothesis.hypothesis.map((item, i) => (
                  <li key={i} className="text-gray-400">• {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Fuente: {news.source} - {news.sourceAuthority}
        </p>
      </div>

      {/* AI Disclaimer */}
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-400">
          🤖 Este análisis fue generado por IA basándose en fuentes oficiales.
          Siempre verifica la información con los documentos originales antes de tomar decisiones operacionales.
        </p>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  content,
  highlight = false,
}: {
  icon: string;
  title: string;
  content: string;
  highlight?: boolean;
}) {
  return (
    <div className={`bg-surface border rounded-lg p-4 ${highlight ? 'border-primary/50 bg-primary/5' : 'border-gray-800'}`}>
      <h3 className="font-medium text-sm text-gray-400 mb-2 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      <p className={highlight ? 'text-white' : 'text-gray-300'}>{content}</p>
    </div>
  );
}
