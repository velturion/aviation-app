'use client';

import Link from 'next/link';
import {
  BookOpen,
  MessageSquare,
  Plane,
  AlertTriangle,
  FileText,
  Newspaper,
  ChevronRight,
  Zap,
  GraduationCap,
  Target,
} from 'lucide-react';
import { Card, CardContent, Tag } from '@/components/ui';

const studyModules = [
  {
    id: 'flash',
    name: 'Flashcards',
    description: '5 preguntas rápidas',
    icon: Zap,
    href: '/study/session/flash?mode=flash',
    color: 'primary',
  },
  {
    id: 'test',
    name: 'Test Completo',
    description: 'Sesión tipo examen',
    icon: Target,
    href: '/study/session/test?mode=test',
    color: 'success',
  },
  {
    id: 'checkride',
    name: 'Modo Chequeo',
    description: 'Simulación de evaluación',
    icon: GraduationCap,
    href: '/study/session/checkride?mode=checkride',
    color: 'warning',
  },
  {
    id: 'chat',
    name: 'Preguntar a IA',
    description: 'Resuelve dudas con IA',
    icon: MessageSquare,
    href: '/study/chat',
    color: 'info',
  },
];

const quickLinks = [
  {
    id: 'mel',
    name: 'MEL Trainer',
    description: 'Estudia ítems del MEL',
    icon: Plane,
    href: '/study/mel',
  },
  {
    id: 'awareness',
    name: 'CFIT/ALAR',
    description: 'Consciencia por fase de vuelo',
    icon: AlertTriangle,
    href: '/study/awareness',
  },
  {
    id: 'manuals',
    name: 'Manuales',
    description: 'Biblioteca de documentos',
    icon: FileText,
    href: '/study/manuals',
  },
  {
    id: 'news',
    name: 'Noticias',
    description: 'Actualidad de aviación',
    icon: Newspaper,
    href: '/study/news',
  },
];

const mockTopics = [
  { id: '1', name: 'Sistemas A320', category: 'Aeronave', accuracy: 85 },
  { id: '2', name: 'Procedimientos SOP', category: 'Operaciones', accuracy: 72 },
  { id: '3', name: 'Meteorología', category: 'General', accuracy: 90 },
  { id: '4', name: 'Regulaciones DGAC', category: 'Legal', accuracy: 65 },
];

export default function StudyHubPage() {
  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'text-[var(--color-primary)] bg-[var(--color-primary)]/10',
      success: 'text-[var(--color-success)] bg-[var(--color-success)]/10',
      warning: 'text-[var(--color-warning)] bg-[var(--color-warning)]/10',
      info: 'text-[var(--color-primary)] bg-[var(--color-primary)]/10',
    };
    return colors[color] || colors.primary;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'success';
    if (accuracy >= 60) return 'warning';
    return 'error';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[var(--color-primary)]" />
          Centro de Estudio
        </h1>
        <p className="text-[var(--color-textSecondary)]">
          Prepárate para tu próximo chequeo
        </p>
      </div>

      {/* Study Modules */}
      <div className="grid grid-cols-2 gap-3">
        {studyModules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.id} href={module.href}>
              <Card hoverable className="h-full">
                <CardContent className="text-center py-6">
                  <div
                    className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${getColorClass(
                      module.color
                    )}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium">{module.name}</h3>
                  <p className="text-sm text-[var(--color-textSecondary)]">
                    {module.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recursos</h2>
        <div className="space-y-2">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.id} href={link.href}>
                <Card hoverable>
                  <CardContent className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{link.name}</h3>
                      <p className="text-sm text-[var(--color-textSecondary)]">
                        {link.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--color-textSecondary)]" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Topics Progress */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Temas</h2>
        <Card>
          <CardContent className="divide-y divide-[var(--color-border)]">
            {mockTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/study/session/${topic.id}?mode=test`}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{topic.name}</p>
                  <p className="text-sm text-[var(--color-textSecondary)]">
                    {topic.category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Tag variant={getAccuracyColor(topic.accuracy)} size="sm">
                    {topic.accuracy}%
                  </Tag>
                  <ChevronRight className="w-4 h-4 text-[var(--color-textSecondary)]" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
