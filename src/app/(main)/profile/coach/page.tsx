'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { askCoachAi } from '@/lib/ai/aiClient';
import type { CoachModule } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const coachModules: { id: CoachModule; title: string; description: string; icon: string }[] = [
  {
    id: 'interview_es',
    title: 'Entrevista (Español)',
    description: 'Practica preguntas típicas de entrevista de aerolínea',
    icon: '🎙️',
  },
  {
    id: 'interview_en',
    title: 'Interview (English)',
    description: 'Practice airline interview questions in English',
    icon: '🇺🇸',
  },
  {
    id: 'type_rating',
    title: 'Type Rating',
    description: 'Preparación para examen de tipo de aeronave',
    icon: '✈️',
  },
  {
    id: 'recurrent',
    title: 'Recurrent Training',
    description: 'Repaso para evaluación periódica',
    icon: '🔄',
  },
  {
    id: 'stress',
    title: 'Manejo de Estrés',
    description: 'Técnicas de CRM y gestión de estrés en vuelo',
    icon: '🧘',
  },
];

export default function CoachPage() {
  const [selectedModule, setSelectedModule] = useState<CoachModule | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startSession = (module: CoachModule) => {
    setSelectedModule(module);
    const selectedModuleInfo = coachModules.find((m) => m.id === module);

    // Initial system message based on module
    const systemMessages: Record<CoachModule, string> = {
      interview_es:
        '¡Hola! Soy tu coach de entrevistas. Vamos a practicar preguntas típicas de entrevista de aerolínea. ¿Estás listo para comenzar con la primera pregunta?',
      interview_en:
        "Hello! I'm your interview coach. Let's practice typical airline interview questions. Are you ready to start with the first question?",
      type_rating:
        '¡Bienvenido! Vamos a repasar conceptos importantes para tu examen de type rating. ¿Sobre qué sistema o procedimiento te gustaría practicar?',
      recurrent:
        '¡Hola piloto! Es momento de repasar para tu evaluación recurrente. Puedo ayudarte con limitaciones, procedimientos anormales o emergencias. ¿Por dónde empezamos?',
      stress:
        'Bienvenido a la sesión de manejo de estrés. Vamos a trabajar en técnicas de CRM y gestión de situaciones de alta presión. ¿Hay alguna situación específica que te genere ansiedad?',
    };

    setMessages([
      {
        id: Date.now().toString(),
        role: 'system',
        content: systemMessages[module],
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading || !selectedModule) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askCoachAi(selectedModule, content, {
        previousContext: messages.slice(-8).map((m) => ({
          role: m.role === 'system' ? 'assistant' : m.role,
          content: m.content,
        })),
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting coach response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error. Por favor intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const endSession = () => {
    setSelectedModule(null);
    setMessages([]);
  };

  if (!selectedModule) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              ← Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">AI Coach</h1>
            <p className="text-gray-400 text-sm">
              Entrenamiento personalizado con inteligencia artificial
            </p>
          </div>
        </div>

        {/* Module Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coachModules.map((module) => (
            <Card
              key={module.id}
              className="p-6 cursor-pointer hover:border-primary transition-colors"
              onClick={() => startSession(module.id)}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{module.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg">{module.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {module.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info */}
        <Card className="p-4 bg-primary/10 border-primary/30">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="font-medium">¿Cómo funciona?</p>
              <p className="text-gray-400 text-sm mt-1">
                El AI Coach simula escenarios reales y te da retroalimentación
                inmediata. Selecciona un módulo para comenzar tu sesión de
                práctica.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const currentModule = coachModules.find((m) => m.id === selectedModule);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentModule?.icon}</span>
          <div>
            <h1 className="text-lg font-bold">{currentModule?.title}</h1>
            <p className="text-gray-400 text-xs">Sesión de coaching activa</p>
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={endSession}>
          Terminar
        </Button>
      </div>

      {/* Messages Area */}
      <Card className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : message.role === 'system'
                  ? 'bg-blue-500/20 border border-blue-500/30'
                  : 'bg-surface border border-gray-700'
              }`}
            >
              {message.role === 'system' && (
                <p className="text-xs text-blue-400 mb-1">🤖 Coach</p>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-2 ${
                  message.role === 'user'
                    ? 'text-primary-100'
                    : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString('es-MX', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface border border-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
                <span className="text-gray-400 text-sm">Pensando...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </Card>

      {/* Quick Responses (for interview mode) */}
      {(selectedModule === 'interview_es' || selectedModule === 'interview_en') && (
        <div className="flex gap-2 overflow-x-auto py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSendMessage('Siguiente pregunta')}
          >
            Siguiente →
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSendMessage('Dame feedback de mi respuesta')}
          >
            Feedback
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSendMessage('Pregunta más difícil')}
          >
            Más difícil
          </Button>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="mt-2">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              selectedModule?.includes('interview')
                ? 'Escribe tu respuesta...'
                : 'Escribe tu pregunta o respuesta...'
            }
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={!inputValue.trim() || isLoading}>
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
}
