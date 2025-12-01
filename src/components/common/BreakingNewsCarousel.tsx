'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  critical: 'border-red-500',
  high: 'border-orange-500',
  medium: 'border-yellow-500',
};

const severityBg = {
  critical: 'bg-gradient-to-br from-gray-900 via-gray-900 to-red-950',
  high: 'bg-gradient-to-br from-gray-900 via-gray-900 to-orange-950',
  medium: 'bg-gradient-to-br from-gray-900 via-gray-900 to-yellow-950',
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying || isDragging) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % mockBreakingNews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isDragging]);

  const handlePrev = useCallback(() => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + mockBreakingNews.length) % mockBreakingNews.length);
  }, []);

  const handleNext = useCallback(() => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % mockBreakingNews.length);
  }, []);

  // Touch/Mouse handlers for swipe
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragOffset(0);
    setIsAutoPlaying(false);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const offset = clientX - dragStartX;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Threshold for swipe (50px)
    if (dragOffset > 50) {
      handlePrev();
    } else if (dragOffset < -50) {
      handleNext();
    }

    setDragOffset(0);
  };

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const onMouseUp = () => {
    handleDragEnd();
  };

  const onMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
    setIsAutoPlaying(true);
  };

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + mockBreakingNews.length) % mockBreakingNews.length);

    // Calculate position for 3D effect
    let translateX = 0;
    let translateZ = 0;
    let rotateY = 0;
    let opacity = 1;
    let zIndex = 10;
    let scale = 1;

    if (normalizedDiff === 0) {
      // Active card - center, fully visible, no transparency
      translateX = 0;
      translateZ = 50;
      rotateY = 0;
      opacity = 1;
      zIndex = 30;
      scale = 1;
    } else if (normalizedDiff === 1 || normalizedDiff === -mockBreakingNews.length + 1) {
      // Next card - right
      translateX = 70;
      translateZ = -50;
      rotateY = -25;
      opacity = 0.5;
      zIndex = 20;
      scale = 0.85;
    } else if (normalizedDiff === mockBreakingNews.length - 1 || normalizedDiff === -1) {
      // Previous card - left
      translateX = -70;
      translateZ = -50;
      rotateY = 25;
      opacity = 0.5;
      zIndex = 20;
      scale = 0.85;
    } else {
      // Hidden cards
      translateX = normalizedDiff > mockBreakingNews.length / 2 ? -120 : 120;
      translateZ = -150;
      opacity = 0;
      zIndex = 10;
      scale = 0.7;
    }

    return {
      transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
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
        className={`relative h-72 sm:h-80 md:h-96 overflow-hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ perspective: '1200px' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Swipe indicator for mobile */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 text-gray-500 text-xs sm:hidden">
          <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m-12 6h12M8 17h12M4 7l4-4m0 0L4 7m4-4v8" />
          </svg>
          <span>Desliza</span>
        </div>

        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: isDragging ? `translateX(${dragOffset * 0.3}px)` : 'none',
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          {mockBreakingNews.map((news, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={news.id}
                className={`absolute w-[85%] sm:w-[75%] md:w-[60%] lg:w-[50%] transition-all duration-500 ease-out ${isActive ? 'cursor-pointer' : ''}`}
                style={{
                  ...getCardStyle(index),
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => {
                  if (isDragging) return; // Don't navigate while dragging
                  if (isActive) {
                    window.location.href = `/breaking-news/${news.id}`;
                  } else {
                    setActiveIndex(index);
                    setIsAutoPlaying(false);
                  }
                }}
              >
                <div
                  className={`h-full rounded-2xl border-2 ${severityColors[news.severity]} ${severityBg[news.severity]} p-4 sm:p-5 md:p-6 flex flex-col shadow-2xl transition-all duration-300 ${isActive ? 'shadow-black/50 ring-2 ring-white/20' : 'hover:ring-1 hover:ring-white/10'}`}
                >
                  {/* Badge & Time */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold uppercase ${severityBadge[news.severity]} ${isActive ? 'animate-pulse' : ''}`}>
                      {news.severity === 'critical' ? '🚨 CRÍTICO' : news.severity === 'high' ? '⚠️ ALTO' : 'ℹ️ MEDIO'}
                    </span>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      {formatTime(news.timestamp)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 line-clamp-2 text-white">{news.title}</h3>

                  {/* Summary */}
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base flex-1 line-clamp-2 sm:line-clamp-3">{news.summary}</p>

                  {/* Source */}
                  <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700/50">
                    <span className="text-xs sm:text-sm text-gray-400">Fuente: {news.source}</span>
                    {isActive && (
                      <span className="text-blue-400 text-xs sm:text-sm font-medium flex items-center gap-1">
                        Toca para ver
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 bg-black/60 hover:bg-black/80 active:scale-95 rounded-full shadow-lg border border-gray-700 transition-all"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 bg-black/60 hover:bg-black/80 active:scale-95 rounded-full shadow-lg border border-gray-700 transition-all"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
