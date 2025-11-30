'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Mock detailed MEL data
const mockMelDetail = {
  id: '7',
  aircraft_type: 'A320',
  ata_chapter: '29',
  title: 'Hydraulic Power',
  description: 'Sistema hidráulico verde, azul y amarillo del A320.',
  items: [
    {
      code: '29-10-01',
      title: 'Green Hydraulic System',
      category: 'C',
      repair_interval: '10 días',
      conditions: [
        'El sistema azul y amarillo deben estar operativos',
        'RAT debe estar disponible',
        'No se permite operación ETOPS',
      ],
      operational_procedures: [
        'Verificar presión de backup antes de cada vuelo',
        'PTU debe funcionar normalmente',
        'Revisar nivel de fluido antes de cada sector',
      ],
      maintenance_procedures: [
        'Verificar ausencia de fugas',
        'Comprobar estado de indicadores',
      ],
    },
    {
      code: '29-10-02',
      title: 'Blue Hydraulic System',
      category: 'C',
      repair_interval: '10 días',
      conditions: [
        'El sistema verde y amarillo deben estar operativos',
        'PTU debe estar operativa',
        'Autopilot limitado a un canal',
      ],
      operational_procedures: [
        'Usar slats y flaps con sistema amarillo backup',
        'Revisar procedimientos de emergencia pre-vuelo',
      ],
      maintenance_procedures: [
        'Inspección visual del sistema',
        'Verificar funcionamiento de bombas backup',
      ],
    },
    {
      code: '29-10-03',
      title: 'Yellow Hydraulic System',
      category: 'C',
      repair_interval: '10 días',
      conditions: [
        'El sistema verde y azul deben estar operativos',
        'PTU debe estar operativa',
        'Cargo doors inoperativas',
      ],
      operational_procedures: [
        'No se permite operación del sistema de carga',
        'Freno de parqueo limitado',
        'Reversa funcional con limitaciones',
      ],
      maintenance_procedures: [
        'Comprobar acumuladores',
        'Verificar bomba eléctrica backup',
      ],
    },
  ],
};

const categoryColors: Record<string, string> = {
  A: 'bg-red-900/50 text-red-400',
  B: 'bg-orange-900/50 text-orange-400',
  C: 'bg-yellow-900/50 text-yellow-400',
  D: 'bg-green-900/50 text-green-400',
};

const categoryDescriptions: Record<string, string> = {
  A: 'Debe repararse antes del vuelo',
  B: 'Debe repararse en 3 días',
  C: 'Debe repararse en 10 días',
  D: 'Debe repararse en 120 días',
};

export default function MelDetailPage() {
  const params = useParams();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // In real app, fetch by params.melId
  const mel = mockMelDetail;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/study/mel">
            <Button variant="ghost" size="sm">
              ← Volver
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-primary/20 text-primary rounded text-sm font-mono">
                ATA {mel.ata_chapter}
              </span>
              <h1 className="text-2xl font-bold">{mel.title}</h1>
            </div>
            <p className="text-gray-400 text-sm mt-1">{mel.aircraft_type}</p>
          </div>
        </div>
        <Link href={`/study/session/mel-${mel.ata_chapter}`}>
          <Button>Practicar</Button>
        </Link>
      </div>

      {/* Description */}
      <Card className="p-4">
        <p className="text-gray-300">{mel.description}</p>
      </Card>

      {/* Category Legend */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Categorías MEL</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(categoryDescriptions).map(([cat, desc]) => (
            <div key={cat} className="flex items-center gap-2 text-sm">
              <span className={`px-2 py-0.5 rounded ${categoryColors[cat]}`}>
                Cat {cat}
              </span>
              <span className="text-gray-400">{desc}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* MEL Items */}
      <div className="space-y-4">
        {mel.items.map((item) => (
          <Card key={item.code} className="overflow-hidden">
            <button
              className="w-full p-4 flex items-center justify-between text-left"
              onClick={() =>
                setExpandedItem(expandedItem === item.code ? null : item.code)
              }
            >
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded ${categoryColors[item.category]}`}>
                  Cat {item.category}
                </span>
                <div>
                  <p className="font-mono text-sm text-gray-400">{item.code}</p>
                  <p className="font-medium">{item.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm hidden md:block">
                  {item.repair_interval}
                </span>
                <span
                  className={`transform transition-transform ${
                    expandedItem === item.code ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </div>
            </button>

            {expandedItem === item.code && (
              <div className="px-4 pb-4 border-t border-gray-800 pt-4">
                <div className="grid gap-6">
                  {/* Conditions */}
                  <div>
                    <h4 className="font-semibold text-sm text-yellow-400 mb-2">
                      ⚠️ Condiciones para Despacho
                    </h4>
                    <ul className="space-y-1">
                      {item.conditions.map((condition, idx) => (
                        <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-gray-500">•</span>
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Operational Procedures */}
                  <div>
                    <h4 className="font-semibold text-sm text-blue-400 mb-2">
                      ✈️ Procedimientos Operacionales
                    </h4>
                    <ul className="space-y-1">
                      {item.operational_procedures.map((proc, idx) => (
                        <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-gray-500">{idx + 1}.</span>
                          {proc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Maintenance Procedures */}
                  <div>
                    <h4 className="font-semibold text-sm text-green-400 mb-2">
                      🔧 Procedimientos de Mantenimiento
                    </h4>
                    <ul className="space-y-1">
                      {item.maintenance_procedures.map((proc, idx) => (
                        <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-gray-500">{idx + 1}.</span>
                          {proc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Repair Interval */}
                  <div className="bg-surface p-3 rounded-lg">
                    <p className="text-sm">
                      <span className="text-gray-400">Intervalo de reparación: </span>
                      <span className="font-medium">{item.repair_interval}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Related Study */}
      <Card className="p-4 bg-primary/10 border-primary/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">¿Quieres profundizar?</p>
            <p className="text-gray-400 text-sm">
              Pregunta al AI sobre este sistema
            </p>
          </div>
          <Link href="/study/chat">
            <Button variant="secondary">Abrir Chat AI</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
