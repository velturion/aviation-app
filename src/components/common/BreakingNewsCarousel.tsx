'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

interface BreakingNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium';
  imageUrl?: string;
}

// Mock breaking news - in production, this comes from AI/API
const mockBreakingNews: BreakingNewsItem[] = [
  {
    id: '1',
    title: 'NOTAM: Restricción de espacio aéreo sobre zona norte de México',
    summary: 'Nueva restricción temporal de espacio aéreo entre FL200 y FL350 en sector MMTY-MMCS. Vigente hasta nuevo aviso.',
    source: 'DGAC México',
    timestamp: '2024-01-20T14:30:00Z',
    severity: 'high',
  },
  {
    id: '2',
    title: 'Boeing 737 MAX: Nueva directiva de aeronavegabilidad',
    summary: 'FAA emite AD urgente para inspección de sistema de combustible en B737 MAX 8/9. Afecta operadores mundiales.',
    source: 'FAA',
    timestamp: '2024-01-20T12:00:00Z',
    severity: 'critical',
  },
  {
    id: '3',
    title: 'Alerta meteorológica: Ceniza volcánica en ruta Pacífico',
    summary: 'Actividad del volcán Popocatépetl genera nube de ceniza. Rutas MEX-GDL-TIJ afectadas.',
    source: 'SMN / VAAC',
    timestamp: '2024-01-20T10:15:00Z',
    severity: 'high',
  },
  {
    id: '4',
    title: 'ICAO actualiza procedimientos RVSM para región CAR/SAM',
    summary: 'Nuevos puntos de transición y procedimientos de contingencia entran en vigor el 1 de marzo.',
    source: 'ICAO',
    timestamp: '2024-01-19T16:00:00Z',
    severity: 'medium',
  },
];

const severityColors = {
  critical: 'border-red-500 bg-red-500/10',
  high: 'border-orange-500 bg-orange-500/10',
  medium: 'border-yellow-500 bg-yellow-500/10',
};

const severityBadge = {
  critical: 'bg-red-500 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-black',
};

export function BreakingNewsCarousel() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % mockBreakingNews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + mockBreakingNews.length) % mockBreakingNews.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % mockBreakingNews.length);
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + mockBreakingNews.length) % mockBreakingNews.length);

    // Calculate position for 3D effect
    let translateX = 0;
    let translateZ = 0;
    let rotateY = 0;
    let opacity = 1;
    let zIndex = 10;

    if (normalizedDiff === 0) {
      // Active card - center
      translateX = 0;
      translateZ = 0;
      rotateY = 0;
      opacity = 1;
      zIndex = 30;
    } else if (normalizedDiff === 1 || normalizedDiff === -mockBreakingNews.length + 1) {
      // Next card - right
      translateX = 60;
      translateZ = -100;
      rotateY = -15;
      opacity = 0.7;
      zIndex = 20;
    } else if (normalizedDiff === mockBreakingNews.length - 1 || normalizedDiff === -1) {
      // Previous card - left
      translateX = -60;
      translateZ = -100;
      rotateY = 15;
      opacity = 0.7;
      zIndex = 20;
    } else {
      // Hidden cards
      translateX = normalizedDiff > mockBreakingNews.length / 2 ? -120 : 120;
      translateZ = -200;
      opacity = 0;
      zIndex = 10;
    }

    return {
      transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
      opacity,
      zIndex,
    };
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <h2 className="text-xl font-bold">{t('breakingNews')}</h2>
        </div>
        <Link href="/breaking-news">
          <button className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            {t('seeMore')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Link>
      </div>

      {/* 3D Carousel */}
      <div
        ref={containerRef}
        className="relative h-64 md:h-72 perspective-1000"
        style={{ perspective: '1000px' }}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {mockBreakingNews.map((news, index) => (
            <div
              key={news.id}
              className={`absolute inset-0 mx-auto w-[90%] md:w-[80%] transition-all duration-500 ease-out cursor-pointer`}
              style={{
                ...getCardStyle(index),
                transformStyle: 'preserve-3d',
              }}
              onClick={() => {
                if (index === activeIndex) {
                  // Navigate to detail
                  window.location.href = `/breaking-news/${news.id}`;
                } else {
                  setActiveIndex(index);
                  setIsAutoPlaying(false);
                }
              }}
            >
              <div
                className={`h-full rounded-xl border-2 ${severityColors[news.severity]} p-5 flex flex-col backdrop-blur-sm`}
              >
                {/* Badge & Time */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${severityBadge[news.severity]}`}>
                    {news.severity === 'critical' ? '🚨 CRÍTICO' : news.severity === 'high' ? '⚠️ ALTO' : 'ℹ️ MEDIO'}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {formatTime(news.timestamp)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-2 line-clamp-2">{news.title}</h3>

                {/* Summary */}
                <p className="text-gray-400 text-sm flex-1 line-clamp-3">{news.summary}</p>

                {/* Source */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                  <span className="text-xs text-gray-500">Fuente: {news.source}</span>
                  <span className="text-primary text-sm">Ver detalles →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-40 p-2 bg-surface/80 hover:bg-surface rounded-full shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 p-2 bg-surface/80 hover:bg-surface rounded-full shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {mockBreakingNews.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              setIsAutoPlaying(false);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex ? 'bg-primary w-6' : 'bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
