'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { ThemeToggle, LanguageToggle } from '@/components/common';

export default function NewsDetailPage() {
  const params = useParams();
  const { t } = useLanguage();

  // In production, fetch news by params.newsId
  // For now, redirect to the main breaking news page with the item pre-selected
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📰</div>
        <h1 className="text-2xl font-bold mb-2">Cargando noticia...</h1>
        <p className="text-gray-400 mb-6">ID: {params.newsId}</p>
        <Link href="/breaking-news">
          <button className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors">
            Ver todas las noticias
          </button>
        </Link>
      </div>
    </div>
  );
}
