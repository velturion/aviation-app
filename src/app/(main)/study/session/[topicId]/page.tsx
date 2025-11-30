'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { StudyQuestion, StudySession } from '@/types';

// Mock questions
const mockQuestions: StudyQuestion[] = [
  {
    id: '1',
    topic_id: 'general',
    text: '¿Cuál es la velocidad mínima de control en tierra (VMCG) del A320 con motores CFM56?',
    options: ['95 kts', '102 kts', '108 kts', '115 kts'],
    correct_index: 1,
    explanation_base: 'VMCG del A320 con CFM56 es 102 kts según el FCOM.',
    difficulty: 'medium',
    source_type: 'FCOM',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    topic_id: 'general',
    text: '¿Cuál es la altitud máxima de operación del A320?',
    options: ['FL390', 'FL400', 'FL410', 'FL430'],
    correct_index: 2,
    explanation_base: 'La altitud máxima certificada del A320 es FL410 (41,000 ft).',
    difficulty: 'easy',
    source_type: 'FCOM',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    topic_id: 'general',
    text: 'En el A320, ¿qué sucede si ambos motores fallan?',
    options: [
      'El APU arranca automáticamente',
      'El RAT se despliega automáticamente',
      'Los generadores de respaldo se activan',
      'El avión entra en modo de emergencia'
    ],
    correct_index: 1,
    explanation_base: 'El RAT (Ram Air Turbine) se despliega automáticamente cuando se pierde toda la generación eléctrica de los motores para proveer energía hidráulica y eléctrica de emergencia.',
    difficulty: 'hard',
    source_type: 'FCOM',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    topic_id: 'general',
    text: '¿Cuál es el peso máximo de despegue (MTOW) del A320-200?',
    options: ['73,500 kg', '77,000 kg', '78,000 kg', '79,000 kg'],
    correct_index: 2,
    explanation_base: 'El MTOW estándar del A320-200 es 78,000 kg (172,000 lb).',
    difficulty: 'easy',
    source_type: 'FCOM',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    topic_id: 'general',
    text: 'En aproximación, ¿cuál es la altura mínima para tener una aproximación estabilizada en VMC?',
    options: ['500 ft AGL', '1000 ft AGL', '1500 ft AGL', '2000 ft AGL'],
    correct_index: 0,
    explanation_base: 'En VMC, la aproximación debe estar estabilizada a más tardar a 500 ft AGL. En IMC es 1000 ft AGL.',
    difficulty: 'medium',
    source_type: 'SOP',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

type SessionMode = 'test' | 'flash';

export default function StudySessionPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;

  const [mode, setMode] = useState<SessionMode>('test');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; selectedIndex: number; correct: boolean }[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showFlashAnswer, setShowFlashAnswer] = useState(false);

  const questions = mockQuestions;
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correct_index;
    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedIndex: selectedAnswer,
        correct: isCorrect,
      },
    ]);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowFlashAnswer(false);
    } else {
      setSessionComplete(true);
    }
  };

  const handleFlashReveal = () => {
    setShowFlashAnswer(true);
  };

  const handleFlashResponse = (knew: boolean) => {
    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedIndex: knew ? currentQuestion.correct_index : -1,
        correct: knew,
      },
    ]);
    handleNextQuestion();
  };

  const correctAnswers = answers.filter((a) => a.correct).length;
  const scorePercentage = Math.round((correctAnswers / answers.length) * 100);

  if (sessionComplete) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">
            {scorePercentage >= 80 ? '🎉' : scorePercentage >= 60 ? '👍' : '📚'}
          </div>
          <h1 className="text-2xl font-bold mb-2">¡Sesión Completada!</h1>
          <p className="text-gray-400 mb-6">
            {mode === 'test' ? 'Resultados del examen' : 'Resultados del repaso'}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-background p-4 rounded-lg">
              <p className="text-3xl font-bold text-primary">{scorePercentage}%</p>
              <p className="text-gray-400 text-sm">Puntuación</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-3xl font-bold text-green-400">{correctAnswers}</p>
              <p className="text-gray-400 text-sm">Correctas</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-3xl font-bold text-red-400">
                {answers.length - correctAnswers}
              </p>
              <p className="text-gray-400 text-sm">Incorrectas</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => {
                setCurrentIndex(0);
                setAnswers([]);
                setSelectedAnswer(null);
                setShowResult(false);
                setSessionComplete(false);
              }}
            >
              Repetir Sesión
            </Button>
            <Link href="/study">
              <Button variant="secondary" className="w-full">
                Volver al Hub
              </Button>
            </Link>
          </div>
        </Card>

        {/* Review Incorrect */}
        {answers.filter((a) => !a.correct).length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Preguntas a Repasar</h2>
            <div className="space-y-3">
              {answers
                .filter((a) => !a.correct)
                .map((answer) => {
                  const q = questions.find((q) => q.id === answer.questionId);
                  if (!q) return null;
                  return (
                    <div key={q.id} className="bg-background p-4 rounded-lg">
                      <p className="text-sm mb-2">{q.text}</p>
                      <p className="text-green-400 text-sm">
                        ✓ {q.options[q.correct_index]}
                      </p>
                    </div>
                  );
                })}
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/study">
          <Button variant="ghost" size="sm">
            ← Salir
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('test')}
            className={`px-3 py-1 rounded-lg text-sm ${
              mode === 'test'
                ? 'bg-primary text-white'
                : 'bg-surface text-gray-400'
            }`}
          >
            Examen
          </button>
          <button
            onClick={() => setMode('flash')}
            className={`px-3 py-1 rounded-lg text-sm ${
              mode === 'flash'
                ? 'bg-primary text-white'
                : 'bg-surface text-gray-400'
            }`}
          >
            Flashcards
          </button>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>
            Pregunta {currentIndex + 1} de {questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`px-2 py-1 rounded text-xs ${
              currentQuestion.difficulty === 'easy'
                ? 'bg-green-900/50 text-green-400'
                : currentQuestion.difficulty === 'medium'
                ? 'bg-yellow-900/50 text-yellow-400'
                : 'bg-red-900/50 text-red-400'
            }`}
          >
            {currentQuestion.difficulty === 'easy'
              ? 'Fácil'
              : currentQuestion.difficulty === 'medium'
              ? 'Media'
              : 'Difícil'}
          </span>
          <span className="text-gray-500 text-xs">
            {currentQuestion.source_type}
          </span>
        </div>

        <h2 className="text-lg font-medium mb-6">{currentQuestion.text}</h2>

        {mode === 'test' ? (
          /* Test Mode */
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = 'border-gray-700 hover:border-primary';
              if (showResult) {
                if (index === currentQuestion.correct_index) {
                  buttonClass = 'border-green-500 bg-green-500/10';
                } else if (index === selectedAnswer) {
                  buttonClass = 'border-red-500 bg-red-500/10';
                }
              } else if (index === selectedAnswer) {
                buttonClass = 'border-primary bg-primary/10';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${buttonClass}`}
                >
                  <span className="font-medium mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        ) : (
          /* Flash Mode */
          <div>
            {!showFlashAnswer ? (
              <Button className="w-full" onClick={handleFlashReveal}>
                Mostrar Respuesta
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 font-medium">
                    {currentQuestion.options[currentQuestion.correct_index]}
                  </p>
                </div>
                <p className="text-gray-400 text-sm">
                  {currentQuestion.explanation_base}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Result Explanation */}
        {showResult && mode === 'test' && (
          <div className="mt-6 p-4 bg-surface rounded-lg">
            <p className="text-sm text-gray-300">
              {currentQuestion.explanation_base}
            </p>
          </div>
        )}
      </Card>

      {/* Actions */}
      {mode === 'test' ? (
        <div className="flex gap-4">
          {!showResult ? (
            <Button
              className="flex-1"
              onClick={handleConfirmAnswer}
              disabled={selectedAnswer === null}
            >
              Confirmar
            </Button>
          ) : (
            <Button className="flex-1" onClick={handleNextQuestion}>
              {currentIndex < questions.length - 1 ? 'Siguiente' : 'Ver Resultados'}
            </Button>
          )}
        </div>
      ) : showFlashAnswer ? (
        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => handleFlashResponse(false)}
          >
            No lo sabía
          </Button>
          <Button className="flex-1" onClick={() => handleFlashResponse(true)}>
            Lo sabía
          </Button>
        </div>
      ) : null}

      {/* Current Score */}
      {answers.length > 0 && (
        <div className="flex justify-center gap-4 text-sm">
          <span className="text-green-400">
            ✓ {answers.filter((a) => a.correct).length}
          </span>
          <span className="text-red-400">
            ✕ {answers.filter((a) => !a.correct).length}
          </span>
        </div>
      )}
    </div>
  );
}
