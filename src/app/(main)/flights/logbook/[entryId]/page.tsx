'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { LogbookEntry, ApproachDetail } from '@/types';

// Mock data
const mockEntry: LogbookEntry = {
  id: '1',
  user_id: 'user1',
  date: '2024-01-15',
  aircraft_type: 'A320',
  registration: 'XA-VLM',
  from_airport: 'MEX',
  to_airport: 'CUN',
  block_time_minutes: 150,
  role: 'PIC',
  ifr_minutes: 150,
  night_minutes: 0,
  notes: 'Vuelo sin novedad. Condiciones VMC durante todo el vuelo.',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
  approach_details: [
    {
      id: 'ap1',
      logbook_entry_id: '1',
      approach_type: 'ILS_CAT_I',
      conditions: 'VMC',
      time_of_day: 'day',
      outcome: 'landing',
      stabilized: true,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
  ],
};

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins.toString().padStart(2, '0')}`;
}

const approachTypeLabels: Record<string, string> = {
  ILS_CAT_I: 'ILS CAT I',
  ILS_CAT_II: 'ILS CAT II',
  ILS_CAT_III: 'ILS CAT III',
  RNAV_AR: 'RNAV AR',
  RNP_AR: 'RNP AR',
  RNAV_GNSS: 'RNAV GNSS',
  VOR: 'VOR',
  NDB: 'NDB',
  LOC: 'LOC',
  VISUAL: 'Visual',
  CIRCLING: 'Circling',
  OTHER: 'Otro',
};

export default function LogbookEntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // In real app, fetch entry by params.entryId
  const entry = mockEntry;

  const handleDelete = () => {
    // In real app, delete entry
    console.log('Deleting entry:', params.entryId);
    router.push('/flights/logbook');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/flights/logbook">
            <Button variant="ghost" size="sm">
              ← Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {entry.from_airport} → {entry.to_airport}
            </h1>
            <p className="text-gray-400 text-sm">
              {new Date(entry.date).toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsEditing(!isEditing)}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
            Eliminar
          </Button>
        </div>
      </div>

      {/* Flight Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Información del Vuelo</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Aeronave</span>
              <span className="font-medium">{entry.aircraft_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Matrícula</span>
              <span className="font-medium">{entry.registration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Origen</span>
              <span className="font-medium">{entry.from_airport}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Destino</span>
              <span className="font-medium">{entry.to_airport}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Rol</span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  entry.role === 'PIC'
                    ? 'bg-green-900/50 text-green-400'
                    : 'bg-blue-900/50 text-blue-400'
                }`}
              >
                {entry.role}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Tiempos</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Tiempo de Bloque</span>
              <span className="font-bold text-primary text-lg">
                {formatTime(entry.block_time_minutes)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tiempo IFR</span>
              <span className="font-medium">
                {formatTime(entry.ifr_minutes)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tiempo Nocturno</span>
              <span className="font-medium">
                {formatTime(entry.night_minutes)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Approaches */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Aproximaciones</h2>
          <Button variant="secondary" size="sm">
            + Agregar
          </Button>
        </div>
        {entry.approach_details && entry.approach_details.length > 0 ? (
          <div className="space-y-3">
            {entry.approach_details.map((approach) => (
              <div
                key={approach.id}
                className="bg-background p-4 rounded-lg border border-gray-800"
              >
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Tipo</p>
                    <p className="font-medium">
                      {approachTypeLabels[approach.approach_type]}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Condiciones</p>
                    <p className="font-medium">{approach.conditions}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Hora</p>
                    <p className="font-medium capitalize">
                      {approach.time_of_day === 'day' ? 'Día' : 'Noche'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Resultado</p>
                    <p className="font-medium capitalize">
                      {approach.outcome === 'landing'
                        ? 'Aterrizaje'
                        : approach.outcome === 'go_around'
                        ? 'Go Around'
                        : 'Diversión'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Estabilizada</p>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        approach.stabilized
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-red-900/50 text-red-400'
                      }`}
                    >
                      {approach.stabilized ? 'Sí' : 'No'}
                    </span>
                  </div>
                </div>
                {approach.cfit_notes && (
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <p className="text-gray-400 text-xs">Notas CFIT/ALAR</p>
                    <p className="text-sm mt-1">{approach.cfit_notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">
            No hay aproximaciones registradas
          </p>
        )}
      </Card>

      {/* Notes */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Notas</h2>
        {entry.notes ? (
          <p className="text-gray-300">{entry.notes}</p>
        ) : (
          <p className="text-gray-400 italic">Sin notas</p>
        )}
      </Card>

      {/* CFIT/ALAR Analysis */}
      <Card className="p-6 border-warning/30 bg-warning/5">
        <div className="flex items-start gap-4">
          <span className="text-2xl">⚠️</span>
          <div>
            <h2 className="text-lg font-semibold text-warning mb-2">
              Análisis CFIT/ALAR
            </h2>
            <p className="text-gray-300 text-sm">
              Basado en tu aproximación ILS CAT I en condiciones VMC de día:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-gray-400">
              <li>✓ Aproximación estabilizada - excelente</li>
              <li>
                ✓ Condiciones VMC favorables para referencias visuales
                tempranas
              </li>
              <li>
                ℹ️ Recuerda mantener awareness de terrain incluso en VMC
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Metadata */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>
          Creado:{' '}
          {new Date(entry.created_at).toLocaleDateString('es-MX', {
            dateStyle: 'medium',
          })}
        </span>
        <span>
          Actualizado:{' '}
          {new Date(entry.updated_at).toLocaleDateString('es-MX', {
            dateStyle: 'medium',
          })}
        </span>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">
              ¿Eliminar esta entrada?
            </h3>
            <p className="text-gray-400 mb-4">
              Esta acción no se puede deshacer. Se eliminará permanentemente
              esta entrada de tu bitácora.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Eliminar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
