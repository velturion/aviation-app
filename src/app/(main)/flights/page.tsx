'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plane,
  Calendar,
  List,
  Plus,
  Upload,
  Clock,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, Button, Tag } from '@/components/ui';
import type { DutyDay } from '@/types';

// Mock data
const mockDuties: DutyDay[] = [
  {
    id: '1',
    user_id: '1',
    airline_id: '1',
    date_local: new Date().toISOString().split('T')[0],
    base_airport_code: 'MEX',
    checkin_time_utc: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    checkout_time_utc: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
    timezone: 'America/Mexico_City',
    status: 'scheduled',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    airline: {
      id: '1',
      user_id: '1',
      name: 'Volaris',
      code: 'Y4',
      checkin_url: 'https://www.volaris.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    legs: [
      {
        id: '1',
        duty_day_id: '1',
        flight_number: 'Y4 901',
        departure_airport: 'MEX',
        arrival_airport: 'CUN',
        std_utc: new Date().toISOString(),
        sta_utc: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: '2',
    user_id: '1',
    airline_id: '1',
    date_local: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    base_airport_code: 'MEX',
    checkin_time_utc: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    checkout_time_utc: new Date(Date.now() + 34 * 60 * 60 * 1000).toISOString(),
    timezone: 'America/Mexico_City',
    status: 'scheduled',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    airline: {
      id: '1',
      user_id: '1',
      name: 'Volaris',
      code: 'Y4',
      checkin_url: 'https://www.volaris.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    legs: [
      {
        id: '3',
        duty_day_id: '2',
        flight_number: 'Y4 501',
        departure_airport: 'MEX',
        arrival_airport: 'GDL',
        std_utc: new Date().toISOString(),
        sta_utc: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '4',
        duty_day_id: '2',
        flight_number: 'Y4 502',
        departure_airport: 'GDL',
        arrival_airport: 'TIJ',
        std_utc: new Date().toISOString(),
        sta_utc: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
];

type ViewMode = 'list' | 'calendar';

export default function FlightsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [duties] = useState<DutyDay[]>(mockDuties);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-MX', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoute = (duty: DutyDay) => {
    if (!duty.legs || duty.legs.length === 0) return 'Sin vuelos';
    const first = duty.legs[0];
    const last = duty.legs[duty.legs.length - 1];
    return `${first.departure_airport} → ${last.arrival_airport}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vuelos</h1>
        <div className="flex gap-2">
          <Link href="/flights/roster-upload">
            <Button variant="secondary" size="sm" leftIcon={<Upload className="w-4 h-4" />}>
              Subir Roster
            </Button>
          </Link>
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Agregar
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 p-1 bg-[var(--color-surface)] rounded-xl w-fit">
        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            viewMode === 'list'
              ? 'bg-[var(--color-primary)] text-white'
              : 'text-[var(--color-textSecondary)] hover:text-[var(--color-text)]'
          }`}
        >
          <List className="w-4 h-4" />
          Lista
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            viewMode === 'calendar'
              ? 'bg-[var(--color-primary)] text-white'
              : 'text-[var(--color-textSecondary)] hover:text-[var(--color-text)]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Calendario
        </button>
      </div>

      {/* Duty List */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {duties.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Plane className="w-12 h-12 mx-auto mb-4 text-[var(--color-textSecondary)]" />
                <p className="text-[var(--color-textSecondary)] mb-4">
                  No tienes vuelos programados
                </p>
                <Link href="/flights/roster-upload">
                  <Button variant="primary">Subir Roster</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            duties.map((duty) => (
              <Link key={duty.id} href={`/flights/${duty.id}`}>
                <Card hoverable>
                  <CardContent>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag variant="info" size="sm">
                            {duty.airline?.name}
                          </Tag>
                          <span className="text-sm text-[var(--color-textSecondary)]">
                            {formatDate(duty.date_local)}
                          </span>
                          {duty.legs && duty.legs.length > 1 && (
                            <Tag variant="default" size="sm">
                              {duty.legs.length} legs
                            </Tag>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold mb-2">{getRoute(duty)}</h3>

                        <div className="flex items-center gap-4 text-sm text-[var(--color-textSecondary)]">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {formatTime(duty.checkin_time_utc)} - {formatTime(duty.checkout_time_utc)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-[var(--color-primary)]" />
                        <ChevronRight className="w-5 h-5 text-[var(--color-textSecondary)]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Calendar View Placeholder */}
      {viewMode === 'calendar' && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-[var(--color-textSecondary)]" />
            <p className="text-[var(--color-textSecondary)]">
              Vista de calendario próximamente
            </p>
          </CardContent>
        </Card>
      )}

      {/* Logbook Link */}
      <Link href="/flights/logbook">
        <Card hoverable className="mt-6">
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                <Plane className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="font-medium">Bitácora de vuelo</h3>
                <p className="text-sm text-[var(--color-textSecondary)]">
                  Ver y editar entradas
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--color-textSecondary)]" />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
