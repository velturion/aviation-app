'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Feedback, FeedbackModule, FeedbackType } from '@/types';

// Mock feedback history
const mockFeedback: Feedback[] = [
  {
    id: '1',
    user_id: 'user1',
    module: 'flights',
    type: 'bug',
    message: 'El calendario no muestra correctamente los vuelos del mes siguiente',
    status: 'answered',
    ai_response: 'Gracias por reportar este problema. Lo hemos identificado como un bug en el manejo de timezone. Ya está corregido en la versión 1.0.1.',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-16T14:30:00Z',
  },
  {
    id: '2',
    user_id: 'user1',
    module: 'study',
    type: 'idea',
    message: 'Sería útil tener un modo de estudio con timer tipo pomodoro',
    status: 'in_review',
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-10T08:00:00Z',
  },
  {
    id: '3',
    user_id: 'user1',
    module: 'layover',
    type: 'question',
    message: '¿Los lugares recomendados son verificados?',
    status: 'answered',
    ai_response: 'Los lugares son agregados por otros pilotos de la comunidad. Usamos un sistema de reseñas y ratings para mantener la calidad. Siempre verifica la información antes de visitar.',
    created_at: '2024-01-05T15:00:00Z',
    updated_at: '2024-01-06T09:00:00Z',
  },
];

const moduleOptions: { value: FeedbackModule; label: string; icon: string }[] = [
  { value: 'home', label: 'Inicio', icon: '🏠' },
  { value: 'flights', label: 'Vuelos', icon: '✈️' },
  { value: 'study', label: 'Estudio', icon: '📚' },
  { value: 'layover', label: 'Layover', icon: '🗺️' },
  { value: 'profile', label: 'Perfil', icon: '👤' },
  { value: 'other', label: 'Otro', icon: '💬' },
];

const typeOptions: { value: FeedbackType; label: string; icon: string }[] = [
  { value: 'bug', label: 'Bug', icon: '🐛' },
  { value: 'idea', label: 'Idea', icon: '💡' },
  { value: 'question', label: 'Pregunta', icon: '❓' },
  { value: 'other', label: 'Otro', icon: '📝' },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  new: { label: 'Nuevo', color: 'bg-blue-900/50 text-blue-400' },
  in_review: { label: 'En revisión', color: 'bg-yellow-900/50 text-yellow-400' },
  answered: { label: 'Respondido', color: 'bg-green-900/50 text-green-400' },
};

export default function FeedbackPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedModule, setSelectedModule] = useState<FeedbackModule>('other');
  const [selectedType, setSelectedType] = useState<FeedbackType>('idea');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      // In real app, save to Supabase
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Feedback submitted:', {
        module: selectedModule,
        type: selectedType,
        message,
      });
      setMessage('');
      setShowForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              ← Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Feedback</h1>
            <p className="text-gray-400 text-sm">
              Ayúdanos a mejorar la app
            </p>
          </div>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>+ Nuevo</Button>
        )}
      </div>

      {/* New Feedback Form */}
      {showForm && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Enviar Feedback</h2>

          {/* Module Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              ¿Sobre qué módulo?
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {moduleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedModule(option.value)}
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    selectedModule === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="text-lg block">{option.icon}</span>
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Tipo de feedback
            </label>
            <div className="grid grid-cols-4 gap-2">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedType(option.value)}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    selectedType === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="text-xl block mb-1">{option.icon}</span>
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Tu mensaje
            </label>
            <textarea
              className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-3 min-h-[120px] resize-none"
              placeholder={
                selectedType === 'bug'
                  ? 'Describe el problema que encontraste...'
                  : selectedType === 'idea'
                  ? 'Cuéntanos tu idea para mejorar la app...'
                  : selectedType === 'question'
                  ? '¿Cuál es tu pregunta?'
                  : 'Escribe tu mensaje...'
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowForm(false);
                setMessage('');
              }}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={!message.trim() || isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card className="p-4 bg-blue-500/10 border-blue-500/30">
        <div className="flex items-start gap-3">
          <span className="text-xl">💬</span>
          <div>
            <p className="font-medium text-blue-400">¿Cómo funciona?</p>
            <p className="text-gray-400 text-sm">
              Tu feedback es revisado por nuestro equipo y por IA. Recibirás
              una respuesta usualmente en menos de 24 horas.
            </p>
          </div>
        </div>
      </Card>

      {/* Feedback History */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Tu historial</h2>
        <div className="space-y-3">
          {mockFeedback.map((feedback) => (
            <Card key={feedback.id} className="overflow-hidden">
              <button
                className="w-full p-4 text-left"
                onClick={() =>
                  setExpandedId(expandedId === feedback.id ? null : feedback.id)
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">
                      {typeOptions.find((t) => t.value === feedback.type)?.icon}
                    </span>
                    <div>
                      <p className="font-medium line-clamp-1">
                        {feedback.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {moduleOptions.find((m) => m.value === feedback.module)?.label}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-xs text-gray-400">
                          {new Date(feedback.created_at).toLocaleDateString('es-MX')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      statusLabels[feedback.status].color
                    }`}
                  >
                    {statusLabels[feedback.status].label}
                  </span>
                </div>
              </button>

              {expandedId === feedback.id && (
                <div className="px-4 pb-4 border-t border-gray-800 pt-4">
                  <p className="text-gray-300 mb-4">{feedback.message}</p>
                  {feedback.ai_response && (
                    <div className="bg-surface p-4 rounded-lg">
                      <p className="text-xs text-primary mb-2">🤖 Respuesta</p>
                      <p className="text-gray-300 text-sm">
                        {feedback.ai_response}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>

        {mockFeedback.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-400">
              No has enviado feedback todavía
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
