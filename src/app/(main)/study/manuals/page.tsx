'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Manual } from '@/types';

// Mock manuals data
const mockManuals: Manual[] = [
  {
    id: '1',
    user_id: 'user1',
    name: 'FCOM Vol 1 - Systems Description',
    category: 'FCOM',
    aircraft_type: 'A320',
    airline: 'Volaris',
    storage_path: '/manuals/fcom-vol1.pdf',
    available_offline: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    user_id: 'user1',
    name: 'FCOM Vol 2 - Operating Procedures',
    category: 'FCOM',
    aircraft_type: 'A320',
    airline: 'Volaris',
    storage_path: '/manuals/fcom-vol2.pdf',
    available_offline: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    user_id: 'user1',
    name: 'QRH - Quick Reference Handbook',
    category: 'QRH',
    aircraft_type: 'A320',
    airline: 'Volaris',
    storage_path: '/manuals/qrh.pdf',
    available_offline: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    user_id: 'user1',
    name: 'MEL - Minimum Equipment List',
    category: 'MEL',
    aircraft_type: 'A320',
    airline: 'Volaris',
    storage_path: '/manuals/mel.pdf',
    available_offline: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    user_id: 'user1',
    name: 'Performance Manual',
    category: 'PERFORMANCE',
    aircraft_type: 'A320',
    airline: 'Volaris',
    storage_path: '/manuals/performance.pdf',
    available_offline: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    user_id: 'user1',
    name: 'OM-A General',
    category: 'OM',
    aircraft_type: 'A320',
    airline: 'Volaris',
    storage_path: '/manuals/om-a.pdf',
    available_offline: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '7',
    user_id: 'user1',
    name: 'Route Manual - México',
    category: 'ROUTE',
    aircraft_type: 'A320',
    airline: 'Volaris',
    storage_path: '/manuals/route-mex.pdf',
    available_offline: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

const categoryIcons: Record<string, string> = {
  FCOM: '📘',
  QRH: '⚡',
  MEL: '📋',
  PERFORMANCE: '📊',
  OM: '📖',
  ROUTE: '🗺️',
};

const categoryNames: Record<string, string> = {
  FCOM: 'Flight Crew Operating Manual',
  QRH: 'Quick Reference Handbook',
  MEL: 'Minimum Equipment List',
  PERFORMANCE: 'Performance Manual',
  OM: 'Operations Manual',
  ROUTE: 'Route Manual',
};

export default function ManualsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOfflineOnly, setShowOfflineOnly] = useState(false);

  const categories = [...new Set(mockManuals.map((m) => m.category))];

  const filteredManuals = mockManuals.filter((manual) => {
    const matchesSearch =
      manual.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manual.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || manual.category === selectedCategory;
    const matchesOffline = !showOfflineOnly || manual.available_offline;
    return matchesSearch && matchesCategory && matchesOffline;
  });

  const offlineCount = mockManuals.filter((m) => m.available_offline).length;

  const handleToggleOffline = async (manualId: string, currentState: boolean) => {
    // In real app, download/remove from local storage
    console.log(`Toggle offline for ${manualId}: ${!currentState}`);
  };

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
            <h1 className="text-2xl font-bold">Manuales</h1>
            <p className="text-gray-400 text-sm">
              {offlineCount} de {mockManuals.length} disponibles offline
            </p>
          </div>
        </div>
        <Button variant="secondary">+ Subir Manual</Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar manual..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="bg-surface border border-gray-700 rounded-lg px-4 py-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {categoryIcons[cat]} {cat}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOfflineOnly}
              onChange={(e) => setShowOfflineOnly(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Solo disponibles offline</span>
          </label>
        </div>
      </Card>

      {/* Offline Status */}
      <Card className="p-4 bg-green-500/10 border-green-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">📥</span>
            <div>
              <p className="font-medium text-green-400">Modo Offline</p>
              <p className="text-gray-400 text-sm">
                {offlineCount} manuales descargados
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm">
            Administrar
          </Button>
        </div>
      </Card>

      {/* Manuals by Category */}
      {selectedCategory === 'all' ? (
        categories.map((category) => {
          const categoryManuals = filteredManuals.filter(
            (m) => m.category === category
          );
          if (categoryManuals.length === 0) return null;

          return (
            <div key={category}>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span>{categoryIcons[category]}</span>
                {categoryNames[category] || category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryManuals.map((manual) => (
                  <ManualCard
                    key={manual.id}
                    manual={manual}
                    onToggleOffline={handleToggleOffline}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredManuals.map((manual) => (
            <ManualCard
              key={manual.id}
              manual={manual}
              onToggleOffline={handleToggleOffline}
            />
          ))}
        </div>
      )}

      {filteredManuals.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-400">No se encontraron manuales</p>
        </Card>
      )}
    </div>
  );
}

function ManualCard({
  manual,
  onToggleOffline,
}: {
  manual: Manual;
  onToggleOffline: (id: string, current: boolean) => void;
}) {
  return (
    <Card className="p-4 hover:border-primary transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{categoryIcons[manual.category]}</span>
          <div>
            <h3 className="font-medium">{manual.name}</h3>
            <p className="text-gray-400 text-sm">
              {manual.aircraft_type} • {manual.airline}
            </p>
          </div>
        </div>
        <button
          onClick={() => onToggleOffline(manual.id, manual.available_offline)}
          className={`p-2 rounded-lg transition-colors ${
            manual.available_offline
              ? 'bg-green-500/20 text-green-400'
              : 'bg-gray-700 text-gray-400'
          }`}
          title={manual.available_offline ? 'Disponible offline' : 'Descargar'}
        >
          {manual.available_offline ? '✓' : '↓'}
        </button>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
        <span
          className={`text-xs ${
            manual.available_offline ? 'text-green-400' : 'text-gray-500'
          }`}
        >
          {manual.available_offline ? '● Offline' : '○ Solo online'}
        </span>
        <Link href={`/study/manuals/${manual.id}`}>
          <Button variant="ghost" size="sm">
            Abrir →
          </Button>
        </Link>
      </div>
    </Card>
  );
}
