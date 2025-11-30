'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { MelConcept } from '@/types';

// Mock MEL concepts by ATA chapter
const mockMelConcepts: MelConcept[] = [
  {
    id: '1',
    aircraft_type: 'A320',
    ata_chapter: '21',
    title: 'Air Conditioning',
    description: 'Sistema de aire acondicionado y presurización de cabina.',
    has_questions: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    aircraft_type: 'A320',
    ata_chapter: '22',
    title: 'Auto Flight',
    description: 'Sistema de vuelo automático incluyendo autopilot y autothrust.',
    has_questions: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    aircraft_type: 'A320',
    ata_chapter: '24',
    title: 'Electrical Power',
    description: 'Sistemas de generación y distribución eléctrica.',
    has_questions: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    aircraft_type: 'A320',
    ata_chapter: '26',
    title: 'Fire Protection',
    description: 'Sistemas de detección y extinción de incendios.',
    has_questions: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    aircraft_type: 'A320',
    ata_chapter: '27',
    title: 'Flight Controls',
    description: 'Superficies de control primarias y secundarias.',
    has_questions: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    aircraft_type: 'A320',
    ata_chapter: '28',
    title: 'Fuel',
    description: 'Sistema de combustible incluyendo tanques y bombas.',
    has_questions: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '7',
    aircraft_type: 'A320',
    ata_chapter: '29',
    title: 'Hydraulic Power',
    description: 'Sistema hidráulico verde, azul y amarillo.',
    has_questions: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '8',
    aircraft_type: 'A320',
    ata_chapter: '30',
    title: 'Ice & Rain Protection',
    description: 'Protección contra hielo en alas, motores y sensores.',
    has_questions: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '9',
    aircraft_type: 'A320',
    ata_chapter: '31',
    title: 'Indicating/Recording',
    description: 'Sistemas de indicación y ECAM.',
    has_questions: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '10',
    aircraft_type: 'A320',
    ata_chapter: '32',
    title: 'Landing Gear',
    description: 'Tren de aterrizaje, frenos y dirección.',
    has_questions: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '11',
    aircraft_type: 'A320',
    ata_chapter: '34',
    title: 'Navigation',
    description: 'Sistemas de navegación IRS, GPS, VOR, DME.',
    has_questions: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '12',
    aircraft_type: 'A320',
    ata_chapter: '36',
    title: 'Pneumatic',
    description: 'Sistema neumático de bleed air.',
    has_questions: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export default function MelPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState('A320');

  const filteredConcepts = mockMelConcepts.filter((concept) => {
    const matchesSearch =
      concept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concept.ata_chapter.includes(searchTerm) ||
      concept.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAircraft = concept.aircraft_type === selectedAircraft;
    return matchesSearch && matchesAircraft;
  });

  const aircraftTypes = ['A320', 'A321', 'B737', 'B777'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/study">
            <Button variant="ghost" size="sm">
              ← Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">MEL Explorer</h1>
            <p className="text-gray-400 text-sm">
              Minimum Equipment List por ATA
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Buscar por ATA, sistema o palabra clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="bg-surface border border-gray-700 rounded-lg px-4 py-2"
            value={selectedAircraft}
            onChange={(e) => setSelectedAircraft(e.target.value)}
          >
            {aircraftTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-4 bg-blue-500/10 border-blue-500/30">
        <div className="flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div>
            <p className="font-medium text-blue-400">¿Qué es la MEL?</p>
            <p className="text-gray-400 text-sm">
              La Minimum Equipment List define qué equipos pueden estar
              inoperativos para despacho con condiciones específicas.
            </p>
          </div>
        </div>
      </Card>

      {/* Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConcepts.map((concept) => (
          <Link key={concept.id} href={`/study/mel/${concept.id}`}>
            <Card className="p-4 h-full hover:border-primary transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <span className="px-2 py-1 bg-primary/20 text-primary rounded text-sm font-mono">
                  ATA {concept.ata_chapter}
                </span>
                {concept.has_questions && (
                  <span className="text-xs text-gray-400">📝 Quiz</span>
                )}
              </div>
              <h3 className="font-semibold mb-2">{concept.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">
                {concept.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {filteredConcepts.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-400">
            No se encontraron conceptos MEL para &quot;{searchTerm}&quot;
          </p>
        </Card>
      )}

      {/* Quick Study */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Sesión de Estudio MEL</h3>
            <p className="text-gray-400 text-sm">
              Practica con preguntas de todos los capítulos ATA
            </p>
          </div>
          <Link href="/study/session/mel">
            <Button>Iniciar Quiz MEL</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
