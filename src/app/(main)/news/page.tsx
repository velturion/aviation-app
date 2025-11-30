'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { NewsItem } from '@/types';

// Mock news data
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Nueva regulación de tiempos de vuelo entra en vigor',
    source: 'DGAC México',
    source_type: 'official',
    summary: 'La Dirección General de Aeronáutica Civil publicó nuevas regulaciones sobre límites de tiempo de vuelo y descanso para tripulaciones.',
    content: 'A partir del 1 de febrero de 2024, entran en vigor las nuevas regulaciones sobre Flight Time Limitations (FTL) para operadores aéreos mexicanos. Los cambios principales incluyen: aumento del descanso mínimo entre jornadas de 10 a 11 horas, nuevo límite de 100 horas de vuelo en 28 días consecutivos, y requisitos más estrictos para operaciones nocturnas.',
    impact: 'Afecta directamente a todos los pilotos comerciales en México. Las aerolíneas tienen 90 días para actualizar sus procedimientos.',
    simplified_explanation: 'En resumen: vas a tener más tiempo de descanso entre vuelos y un límite más bajo de horas que puedes volar al mes. Esto busca reducir la fatiga y mejorar la seguridad.',
    published_at: '2024-01-20T08:00:00Z',
  },
  {
    id: '2',
    title: 'Airbus lanza actualización de software para sistemas de vuelo del A320',
    source: 'Airbus Safety',
    source_type: 'specialized',
    summary: 'Nueva versión de software mejora la gestión de protecciones en condiciones de turbulencia severa.',
    content: 'Airbus ha liberado la actualización SB A320-27-1234 que modifica el comportamiento del sistema de protección de vuelo en condiciones de turbulencia severa. La actualización ajusta los umbrales de activación del Alpha Floor y mejora la transición entre modos de vuelo.',
    impact: 'Aplicable a todos los A320 familia. La instalación es mandatoria en los próximos 6 meses.',
    simplified_explanation: 'El avión ahora va a reaccionar mejor cuando hay turbulencia fuerte. No necesitas hacer nada diferente como piloto, pero es bueno saber que el sistema es más robusto.',
    published_at: '2024-01-18T14:00:00Z',
  },
  {
    id: '3',
    title: 'ICAO actualiza procedimientos RVSM para América Latina',
    source: 'ICAO',
    source_type: 'official',
    summary: 'Nuevos procedimientos de separación vertical reducida entran en vigor para la región CAR/SAM.',
    content: 'La Organización de Aviación Civil Internacional (ICAO) ha actualizado los procedimientos RVSM para la región de Centro América, Caribe y Sudamérica. Los cambios incluyen nuevos puntos de transición y procedimientos de contingencia.',
    impact: 'Todos los pilotos que operen en la región deben familiarizarse con los nuevos procedimientos antes del 1 de marzo.',
    simplified_explanation: 'Hay cambios en cómo se separan los aviones verticalmente en rutas internacionales de esta zona. Revisa los nuevos puntos donde cambias de nivel de vuelo.',
    published_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '4',
    title: 'Alerta meteorológica: Temporada de huracanes más activa de lo esperado',
    source: 'SMN México',
    source_type: 'official',
    summary: 'El Servicio Meteorológico Nacional advierte sobre condiciones adversas para la aviación en el Golfo y Caribe.',
    content: 'Los modelos meteorológicos indican una temporada de huracanes más activa que el promedio histórico para 2024. Se esperan entre 18 y 22 tormentas nombradas, de las cuales 8 a 10 podrían convertirse en huracanes.',
    impact: 'Afecta operaciones en el Golfo de México y Mar Caribe de junio a noviembre.',
    simplified_explanation: 'Prepárate para más disrupciones meteorológicas este año en rutas del Caribe y Golfo. Revisa bien los METAR/TAF antes de cada vuelo en esa zona.',
    published_at: '2024-01-12T16:00:00Z',
  },
];

const sourceTypeLabels: Record<string, { label: string; color: string }> = {
  official: { label: 'Oficial', color: 'bg-blue-900/50 text-blue-400' },
  specialized: { label: 'Especializado', color: 'bg-purple-900/50 text-purple-400' },
  general: { label: 'General', color: 'bg-gray-700 text-gray-300' },
};

export default function NewsPage() {
  const [selectedSourceType, setSelectedSourceType] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredNews = mockNews.filter(
    (item) =>
      selectedSourceType === 'all' || item.source_type === selectedSourceType
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Noticias de Aviación</h1>
          <p className="text-gray-400 text-sm">
            Actualizaciones relevantes para tu operación
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedSourceType('all')}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
            selectedSourceType === 'all'
              ? 'bg-primary text-white'
              : 'bg-surface text-gray-400'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setSelectedSourceType('official')}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
            selectedSourceType === 'official'
              ? 'bg-primary text-white'
              : 'bg-surface text-gray-400'
          }`}
        >
          🏛️ Oficiales
        </button>
        <button
          onClick={() => setSelectedSourceType('specialized')}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
            selectedSourceType === 'specialized'
              ? 'bg-primary text-white'
              : 'bg-surface text-gray-400'
          }`}
        >
          ✈️ Especializadas
        </button>
        <button
          onClick={() => setSelectedSourceType('general')}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
            selectedSourceType === 'general'
              ? 'bg-primary text-white'
              : 'bg-surface text-gray-400'
          }`}
        >
          📰 Generales
        </button>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.map((item) => {
          const isExpanded = expandedId === item.id;
          const sourceType = sourceTypeLabels[item.source_type];

          return (
            <Card key={item.id} className="overflow-hidden">
              <button
                className="w-full p-4 text-left"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${sourceType.color}`}
                      >
                        {sourceType.label}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {item.source}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.summary}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(item.published_at).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`transform transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-800 pt-4 space-y-4">
                  {/* Full Content */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">
                      📄 Contenido completo
                    </h4>
                    <p className="text-gray-300">{item.content}</p>
                  </div>

                  {/* Impact */}
                  <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                    <h4 className="font-semibold text-sm text-yellow-400 mb-2">
                      ⚠️ Impacto para ti
                    </h4>
                    <p className="text-gray-300 text-sm">{item.impact}</p>
                  </div>

                  {/* Simplified Explanation */}
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
                    <h4 className="font-semibold text-sm text-primary mb-2">
                      💡 En palabras simples
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {item.simplified_explanation}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">
                      📤 Compartir
                    </Button>
                    <Button variant="secondary" size="sm">
                      🔖 Guardar
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filteredNews.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-400">
            No hay noticias disponibles en esta categoría
          </p>
        </Card>
      )}

      {/* Subscribe Card */}
      <Card className="p-4 bg-primary/10 border-primary/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Mantente informado</p>
            <p className="text-gray-400 text-sm">
              Recibe alertas de noticias importantes
            </p>
          </div>
          <Link href="/profile/settings">
            <Button variant="secondary" size="sm">
              Configurar alertas
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
