'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { LogbookEntry } from '@/types';

// Mock data
const mockEntries: LogbookEntry[] = [
  {
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
    notes: 'Vuelo sin novedad',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    user_id: 'user1',
    date: '2024-01-14',
    aircraft_type: 'A320',
    registration: 'XA-VLN',
    from_airport: 'CUN',
    to_airport: 'GDL',
    block_time_minutes: 180,
    role: 'SIC',
    ifr_minutes: 180,
    night_minutes: 60,
    notes: 'Turbulencia moderada en crucero',
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z',
  },
  {
    id: '3',
    user_id: 'user1',
    date: '2024-01-13',
    aircraft_type: 'A320',
    registration: 'XA-VLM',
    from_airport: 'GDL',
    to_airport: 'TIJ',
    block_time_minutes: 165,
    role: 'PIC',
    ifr_minutes: 165,
    night_minutes: 165,
    notes: 'Aproximación ILS CAT I',
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z',
  },
];

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins.toString().padStart(2, '0')}`;
}

function calculateTotals(entries: LogbookEntry[]) {
  return entries.reduce(
    (acc, entry) => ({
      blockTime: acc.blockTime + entry.block_time_minutes,
      ifrTime: acc.ifrTime + entry.ifr_minutes,
      nightTime: acc.nightTime + entry.night_minutes,
      flights: acc.flights + 1,
    }),
    { blockTime: 0, ifrTime: 0, nightTime: 0, flights: 0 }
  );
}

export default function LogbookPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAircraft, setFilterAircraft] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');

  const filteredEntries = mockEntries.filter((entry) => {
    const matchesSearch =
      entry.from_airport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.to_airport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.registration.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAircraft =
      filterAircraft === 'all' || entry.aircraft_type === filterAircraft;
    const matchesRole = filterRole === 'all' || entry.role === filterRole;
    return matchesSearch && matchesAircraft && matchesRole;
  });

  const totals = calculateTotals(filteredEntries);

  const aircraftTypes = [...new Set(mockEntries.map((e) => e.aircraft_type))];
  const roles = [...new Set(mockEntries.map((e) => e.role))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bitácora Digital</h1>
          <p className="text-gray-400 text-sm mt-1">
            Registro de vuelos y tiempos
          </p>
        </div>
        <Link href="/flights/logbook/new">
          <Button>+ Nueva Entrada</Button>
        </Link>
      </div>

      {/* Totals Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-gray-400 text-xs">Tiempo Total</p>
          <p className="text-xl font-bold text-primary">
            {formatTime(totals.blockTime)}
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-400 text-xs">Tiempo IFR</p>
          <p className="text-xl font-bold">{formatTime(totals.ifrTime)}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-400 text-xs">Tiempo Nocturno</p>
          <p className="text-xl font-bold">{formatTime(totals.nightTime)}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-400 text-xs">Vuelos</p>
          <p className="text-xl font-bold">{totals.flights}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar por aeropuerto o matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="bg-surface border border-gray-700 rounded-lg px-4 py-2 text-sm"
            value={filterAircraft}
            onChange={(e) => setFilterAircraft(e.target.value)}
          >
            <option value="all">Todos los aviones</option>
            {aircraftTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            className="bg-surface border border-gray-700 rounded-lg px-4 py-2 text-sm"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Todos los roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Entries List */}
      <div className="space-y-3">
        {filteredEntries.map((entry) => (
          <Link key={entry.id} href={`/flights/logbook/${entry.id}`}>
            <Card className="p-4 hover:border-primary transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">
                      {new Date(entry.date).toLocaleDateString('es-MX', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </p>
                    <p className="text-lg font-bold">
                      {entry.from_airport} → {entry.to_airport}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center hidden md:block">
                    <p className="text-gray-400 text-xs">Avión</p>
                    <p className="font-medium">{entry.aircraft_type}</p>
                  </div>
                  <div className="text-center hidden md:block">
                    <p className="text-gray-400 text-xs">Matrícula</p>
                    <p className="font-medium">{entry.registration}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs">Bloque</p>
                    <p className="font-bold text-primary">
                      {formatTime(entry.block_time_minutes)}
                    </p>
                  </div>
                  <div className="text-center">
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
              </div>

              {entry.notes && (
                <p className="text-gray-400 text-sm mt-2 truncate">
                  {entry.notes}
                </p>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-400">No se encontraron entradas</p>
        </Card>
      )}

      {/* Export Options */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">Exportar bitácora</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              CSV
            </Button>
            <Button variant="secondary" size="sm">
              PDF
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
