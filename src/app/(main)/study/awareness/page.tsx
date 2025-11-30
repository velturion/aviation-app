'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, CheckCircle, Brain } from 'lucide-react';
import { Card, CardContent, Button, Tag } from '@/components/ui';
import { getAllPhases, getPhaseLabel, getPhaseAwareness } from '@/utils/cfitAwareness';
import type { FlightPhase } from '@/types';

export default function FlightAwarenessPage() {
  const phases = getAllPhases();
  const [selectedPhase, setSelectedPhase] = useState<FlightPhase | null>(null);
  const awareness = selectedPhase ? getPhaseAwareness(selectedPhase) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/study">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-[var(--color-warning)]" />
            Consciencia CFIT/ALAR
          </h1>
          <p className="text-[var(--color-textSecondary)]">
            Riesgos y buenas prácticas por fase de vuelo
          </p>
        </div>
      </div>

      {/* Phase Selection */}
      {!selectedPhase && (
        <div className="grid grid-cols-2 gap-3">
          {phases.map((phase) => (
            <Card
              key={phase}
              hoverable
              onClick={() => setSelectedPhase(phase)}
              className="cursor-pointer"
            >
              <CardContent className="text-center py-4">
                <p className="font-medium">{getPhaseLabel(phase)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Phase Detail */}
      {selectedPhase && awareness && (
        <div className="space-y-4">
          {/* Phase Header */}
          <div className="flex items-center justify-between">
            <Tag variant="info" size="md">
              {getPhaseLabel(selectedPhase)}
            </Tag>
            <Button variant="ghost" size="sm" onClick={() => setSelectedPhase(null)}>
              Cambiar fase
            </Button>
          </div>

          {/* Risks */}
          <Card className="border-l-4 border-l-[var(--color-error)]">
            <CardContent>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-[var(--color-error)]">
                <AlertTriangle className="w-5 h-5" />
                Riesgos CFIT/ALAR
              </h3>
              <ul className="space-y-2">
                {awareness.risks.map((risk, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-[var(--color-error)] mt-1">•</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="border-l-4 border-l-[var(--color-success)]">
            <CardContent>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-[var(--color-success)]">
                <CheckCircle className="w-5 h-5" />
                Buenas Prácticas
              </h3>
              <ul className="space-y-2">
                {awareness.bestPractices.map((practice, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-[var(--color-success)] mt-1">✓</span>
                    {practice}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Train with AI */}
          <Link href={`/study/session/awareness-${selectedPhase}?mode=flash`}>
            <Button
              variant="primary"
              fullWidth
              leftIcon={<Brain className="w-4 h-4" />}
            >
              Entrenar con IA
            </Button>
          </Link>

          {/* Disclaimer */}
          <p className="text-xs text-[var(--color-textSecondary)] text-center">
            Material de estudio y consciencia. No reemplaza procedimientos operativos oficiales.
          </p>
        </div>
      )}
    </div>
  );
}
