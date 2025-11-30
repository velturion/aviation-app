'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { UserSettings, NotificationPreferences } from '@/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    language: 'es',
    units: {
      altitude: 'ft',
      weight: 'kg',
      temperature: 'C',
    },
    theme: 'dark',
    notifications: {
      checkin_checkout: true,
      daily_study: true,
      documents: true,
      news: false,
      quiet_hours_start: '22:00',
      quiet_hours_end: '07:00',
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const updateSettings = (path: string, value: unknown) => {
    setSettings((prev) => {
      const newSettings = { ...prev };
      const parts = path.split('.');
      let current: Record<string, unknown> = newSettings;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]] as Record<string, unknown>;
      }
      current[parts[parts.length - 1]] = value;
      return newSettings;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In real app, save to Supabase
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Settings saved:', settings);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/profile">
          <Button variant="ghost" size="sm">
            ← Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Configuración</h1>
      </div>

      {/* Appearance */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Apariencia</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tema</label>
            <div className="grid grid-cols-3 gap-2">
              {(['dark', 'light', 'auto'] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => updateSettings('theme', theme)}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    settings.theme === theme
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="text-xl block mb-1">
                    {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🔄'}
                  </span>
                  <span className="text-sm capitalize">{theme === 'auto' ? 'Auto' : theme === 'dark' ? 'Oscuro' : 'Claro'}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Idioma</label>
            <select
              className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2"
              value={settings.language}
              onChange={(e) => updateSettings('language', e.target.value)}
            >
              <option value="es">🇲🇽 Español</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Units */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Unidades</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Altitud</label>
            <select
              className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2"
              value={settings.units.altitude}
              onChange={(e) => updateSettings('units.altitude', e.target.value)}
            >
              <option value="ft">Pies (ft)</option>
              <option value="m">Metros (m)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Peso</label>
            <select
              className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2"
              value={settings.units.weight}
              onChange={(e) => updateSettings('units.weight', e.target.value)}
            >
              <option value="kg">Kilogramos (kg)</option>
              <option value="lb">Libras (lb)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Temperatura</label>
            <select
              className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2"
              value={settings.units.temperature}
              onChange={(e) => updateSettings('units.temperature', e.target.value)}
            >
              <option value="C">Celsius (°C)</option>
              <option value="F">Fahrenheit (°F)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Notificaciones</h2>
        <div className="space-y-4">
          <NotificationToggle
            label="Check-in / Check-out"
            description="Recordatorios de inicio y fin de jornada"
            checked={settings.notifications.checkin_checkout}
            onChange={(v) => updateSettings('notifications.checkin_checkout', v)}
          />
          <NotificationToggle
            label="Estudio diario"
            description="Recordatorio para sesión de estudio"
            checked={settings.notifications.daily_study}
            onChange={(v) => updateSettings('notifications.daily_study', v)}
          />
          <NotificationToggle
            label="Documentos"
            description="Alertas de vencimiento de documentos"
            checked={settings.notifications.documents}
            onChange={(v) => updateSettings('notifications.documents', v)}
          />
          <NotificationToggle
            label="Noticias"
            description="Alertas de noticias relevantes"
            checked={settings.notifications.news}
            onChange={(v) => updateSettings('notifications.news', v)}
          />

          <div className="pt-4 border-t border-gray-800">
            <label className="block text-sm font-medium mb-3">
              Horas de silencio
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-400">Inicio</label>
                <input
                  type="time"
                  className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 mt-1"
                  value={settings.notifications.quiet_hours_start || ''}
                  onChange={(e) =>
                    updateSettings('notifications.quiet_hours_start', e.target.value)
                  }
                />
              </div>
              <span className="text-gray-500 mt-5">→</span>
              <div className="flex-1">
                <label className="text-xs text-gray-400">Fin</label>
                <input
                  type="time"
                  className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 mt-1"
                  value={settings.notifications.quiet_hours_end || ''}
                  onChange={(e) =>
                    updateSettings('notifications.quiet_hours_end', e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Data & Privacy */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Datos y Privacidad</h2>
        <div className="space-y-3">
          <button className="w-full p-3 text-left rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
            <p className="font-medium">Exportar mis datos</p>
            <p className="text-gray-400 text-sm">
              Descarga toda tu información en formato JSON
            </p>
          </button>
          <button className="w-full p-3 text-left rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
            <p className="font-medium">Sincronización</p>
            <p className="text-gray-400 text-sm">
              Última sync: hace 5 minutos
            </p>
          </button>
          <button className="w-full p-3 text-left rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors">
            <p className="font-medium text-red-400">Eliminar cuenta</p>
            <p className="text-gray-400 text-sm">
              Esta acción es permanente e irreversible
            </p>
          </button>
        </div>
      </Card>

      {/* Cache & Storage */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Almacenamiento</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Datos offline</p>
              <p className="text-gray-400 text-sm">15.3 MB utilizados</p>
            </div>
            <Button variant="secondary" size="sm">
              Limpiar
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Manuales descargados</p>
              <p className="text-gray-400 text-sm">3 archivos (45.2 MB)</p>
            </div>
            <Button variant="secondary" size="sm">
              Administrar
            </Button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex gap-4">
        <Link href="/profile" className="flex-1">
          <Button variant="secondary" className="w-full">
            Cancelar
          </Button>
        </Link>
        <Button className="flex-1" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      {/* Version Info */}
      <div className="text-center text-gray-500 text-xs">
        <p>APP AVIATION v1.0.0</p>
        <p>© 2024 - Todos los derechos reservados</p>
      </div>
    </div>
  );
}

function NotificationToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-gray-700'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
