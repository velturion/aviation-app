'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { ApproachType } from '@/types';

interface ApproachForm {
  approach_type: ApproachType;
  other_description?: string;
  conditions: 'VMC' | 'IMC';
  time_of_day: 'day' | 'night';
  outcome: 'landing' | 'go_around' | 'diversion';
  stabilized: boolean;
  cfit_notes?: string;
}

export default function NewLogbookEntryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    aircraft_type: '',
    registration: '',
    from_airport: '',
    to_airport: '',
    block_off: '',
    block_on: '',
    role: 'PIC' as 'PIC' | 'SIC',
    ifr_minutes: 0,
    night_minutes: 0,
    notes: '',
  });

  const [approaches, setApproaches] = useState<ApproachForm[]>([]);
  const [showApproachForm, setShowApproachForm] = useState(false);
  const [currentApproach, setCurrentApproach] = useState<ApproachForm>({
    approach_type: 'ILS_CAT_I',
    conditions: 'VMC',
    time_of_day: 'day',
    outcome: 'landing',
    stabilized: true,
  });

  const calculateBlockTime = (): number => {
    if (!formData.block_off || !formData.block_on) return 0;
    const [offH, offM] = formData.block_off.split(':').map(Number);
    const [onH, onM] = formData.block_on.split(':').map(Number);
    let minutes = (onH * 60 + onM) - (offH * 60 + offM);
    if (minutes < 0) minutes += 24 * 60; // Next day
    return minutes;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addApproach = () => {
    setApproaches((prev) => [...prev, currentApproach]);
    setCurrentApproach({
      approach_type: 'ILS_CAT_I',
      conditions: 'VMC',
      time_of_day: 'day',
      outcome: 'landing',
      stabilized: true,
    });
    setShowApproachForm(false);
  };

  const removeApproach = (index: number) => {
    setApproaches((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // In real app, save to Supabase/Dexie
      const entry = {
        ...formData,
        block_time_minutes: calculateBlockTime(),
        approach_details: approaches,
      };
      console.log('Saving entry:', entry);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.push('/flights/logbook');
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const blockTime = calculateBlockTime();
  const approachTypes = [
    { value: 'ILS_CAT_I', label: 'ILS CAT I' },
    { value: 'ILS_CAT_II', label: 'ILS CAT II' },
    { value: 'ILS_CAT_III', label: 'ILS CAT III' },
    { value: 'RNAV_AR', label: 'RNAV AR' },
    { value: 'RNP_AR', label: 'RNP AR' },
    { value: 'RNAV_GNSS', label: 'RNAV GNSS' },
    { value: 'VOR', label: 'VOR' },
    { value: 'NDB', label: 'NDB' },
    { value: 'LOC', label: 'LOC' },
    { value: 'VISUAL', label: 'Visual' },
    { value: 'CIRCLING', label: 'Circling' },
    { value: 'OTHER', label: 'Otro' },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/flights/logbook">
          <Button variant="ghost" size="sm">
            ← Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Nueva Entrada de Bitácora</h1>
      </div>

      {/* Flight Info */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Información del Vuelo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium mb-2">Rol</label>
            <select
              className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
            >
              <option value="PIC">PIC (Piloto al Mando)</option>
              <option value="SIC">SIC (Copiloto)</option>
            </select>
          </div>
          <Input
            label="Tipo de Aeronave"
            placeholder="A320"
            value={formData.aircraft_type}
            onChange={(e) => handleInputChange('aircraft_type', e.target.value.toUpperCase())}
          />
          <Input
            label="Matrícula"
            placeholder="XA-VLM"
            value={formData.registration}
            onChange={(e) => handleInputChange('registration', e.target.value.toUpperCase())}
          />
          <Input
            label="Origen (ICAO)"
            placeholder="MEX"
            maxLength={4}
            value={formData.from_airport}
            onChange={(e) => handleInputChange('from_airport', e.target.value.toUpperCase())}
          />
          <Input
            label="Destino (ICAO)"
            placeholder="CUN"
            maxLength={4}
            value={formData.to_airport}
            onChange={(e) => handleInputChange('to_airport', e.target.value.toUpperCase())}
          />
        </div>
      </Card>

      {/* Times */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Tiempos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Block Off (UTC)"
            type="time"
            value={formData.block_off}
            onChange={(e) => handleInputChange('block_off', e.target.value)}
          />
          <Input
            label="Block On (UTC)"
            type="time"
            value={formData.block_on}
            onChange={(e) => handleInputChange('block_on', e.target.value)}
          />
        </div>

        {blockTime > 0 && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg">
            <p className="text-center">
              <span className="text-gray-400">Tiempo de Bloque: </span>
              <span className="text-xl font-bold text-primary">
                {Math.floor(blockTime / 60)}:{(blockTime % 60).toString().padStart(2, '0')}
              </span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input
            label="Tiempo IFR (min)"
            type="number"
            min={0}
            value={formData.ifr_minutes}
            onChange={(e) => handleInputChange('ifr_minutes', parseInt(e.target.value) || 0)}
          />
          <Input
            label="Tiempo Nocturno (min)"
            type="number"
            min={0}
            value={formData.night_minutes}
            onChange={(e) => handleInputChange('night_minutes', parseInt(e.target.value) || 0)}
          />
        </div>
      </Card>

      {/* Approaches */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Aproximaciones</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowApproachForm(true)}
          >
            + Agregar
          </Button>
        </div>

        {approaches.length > 0 && (
          <div className="space-y-2 mb-4">
            {approaches.map((approach, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-background p-3 rounded-lg"
              >
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium">
                    {approachTypes.find((t) => t.value === approach.approach_type)?.label}
                  </span>
                  <span className="text-gray-400">{approach.conditions}</span>
                  <span className="text-gray-400">
                    {approach.time_of_day === 'day' ? 'Día' : 'Noche'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      approach.stabilized
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-red-900/50 text-red-400'
                    }`}
                  >
                    {approach.stabilized ? 'Estab.' : 'No Estab.'}
                  </span>
                </div>
                <button
                  onClick={() => removeApproach(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {showApproachForm && (
          <div className="bg-background p-4 rounded-lg border border-gray-700">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select
                  className="w-full bg-surface border border-gray-700 rounded-lg px-3 py-2 text-sm"
                  value={currentApproach.approach_type}
                  onChange={(e) =>
                    setCurrentApproach((prev) => ({
                      ...prev,
                      approach_type: e.target.value as ApproachType,
                    }))
                  }
                >
                  {approachTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Condiciones</label>
                <select
                  className="w-full bg-surface border border-gray-700 rounded-lg px-3 py-2 text-sm"
                  value={currentApproach.conditions}
                  onChange={(e) =>
                    setCurrentApproach((prev) => ({
                      ...prev,
                      conditions: e.target.value as 'VMC' | 'IMC',
                    }))
                  }
                >
                  <option value="VMC">VMC</option>
                  <option value="IMC">IMC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hora del día</label>
                <select
                  className="w-full bg-surface border border-gray-700 rounded-lg px-3 py-2 text-sm"
                  value={currentApproach.time_of_day}
                  onChange={(e) =>
                    setCurrentApproach((prev) => ({
                      ...prev,
                      time_of_day: e.target.value as 'day' | 'night',
                    }))
                  }
                >
                  <option value="day">Día</option>
                  <option value="night">Noche</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Resultado</label>
                <select
                  className="w-full bg-surface border border-gray-700 rounded-lg px-3 py-2 text-sm"
                  value={currentApproach.outcome}
                  onChange={(e) =>
                    setCurrentApproach((prev) => ({
                      ...prev,
                      outcome: e.target.value as 'landing' | 'go_around' | 'diversion',
                    }))
                  }
                >
                  <option value="landing">Aterrizaje</option>
                  <option value="go_around">Go Around</option>
                  <option value="diversion">Diversión</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="stabilized"
                checked={currentApproach.stabilized}
                onChange={(e) =>
                  setCurrentApproach((prev) => ({
                    ...prev,
                    stabilized: e.target.checked,
                  }))
                }
                className="w-4 h-4"
              />
              <label htmlFor="stabilized" className="text-sm">
                Aproximación Estabilizada
              </label>
            </div>

            <Input
              label="Notas CFIT/ALAR (opcional)"
              placeholder="Factores relevantes de seguridad..."
              value={currentApproach.cfit_notes || ''}
              onChange={(e) =>
                setCurrentApproach((prev) => ({
                  ...prev,
                  cfit_notes: e.target.value,
                }))
              }
            />

            <div className="flex gap-2 mt-4">
              <Button variant="secondary" onClick={() => setShowApproachForm(false)}>
                Cancelar
              </Button>
              <Button onClick={addApproach}>Agregar Aproximación</Button>
            </div>
          </div>
        )}

        {approaches.length === 0 && !showApproachForm && (
          <p className="text-gray-400 text-center py-2 text-sm">
            Sin aproximaciones registradas
          </p>
        )}
      </Card>

      {/* Notes */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Notas</h2>
        <textarea
          className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-3 min-h-[100px] resize-none"
          placeholder="Notas adicionales del vuelo..."
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
        />
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => router.push('/flights/logbook')}
        >
          Cancelar
        </Button>
        <Button
          className="flex-1"
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            !formData.date ||
            !formData.aircraft_type ||
            !formData.from_airport ||
            !formData.to_airport
          }
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Entrada'}
        </Button>
      </div>
    </div>
  );
}
