'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Place } from '@/types';

// Mock favorites
const mockFavorites: Place[] = [
  {
    id: '1',
    user_id: 'user1',
    name: 'La Habichuela Sunset',
    category: 'restaurant',
    latitude: 21.1619,
    longitude: -86.8515,
    address: 'Blvd. Kukulcan Km 12.6, Zona Hotelera, Cancún',
    price_range: '$$$',
    recommended_by: 'Capitán García',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    average_rating: 4.5,
  },
  {
    id: '2',
    user_id: 'user1',
    name: 'Gold\'s Gym Cancún',
    category: 'gym',
    latitude: 21.1332,
    longitude: -86.7631,
    address: 'Av. Tulum 260, Centro, Cancún',
    price_range: '$$',
    recommended_by: 'F/O Martínez',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    average_rating: 4.2,
  },
  {
    id: '5',
    user_id: 'user1',
    name: 'Starbucks Aeropuerto GDL',
    category: 'cafe',
    latitude: 20.5218,
    longitude: -103.3114,
    address: 'Terminal 1, Aeropuerto Internacional de Guadalajara',
    price_range: '$$',
    recommended_by: 'Sistema',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
    average_rating: 3.8,
  },
];

const categoryLabels: Record<string, { label: string; icon: string }> = {
  restaurant: { label: 'Restaurante', icon: '🍽️' },
  cafe: { label: 'Café', icon: '☕' },
  bar: { label: 'Bar', icon: '🍺' },
  gym: { label: 'Gimnasio', icon: '💪' },
  pharmacy: { label: 'Farmacia', icon: '💊' },
  supermarket: { label: 'Supermercado', icon: '🛒' },
  attraction: { label: 'Atracción', icon: '🎡' },
  transport: { label: 'Transporte', icon: '🚕' },
  other: { label: 'Otro', icon: '📍' },
};

export default function FavoritesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState(mockFavorites);

  const categories = [...new Set(mockFavorites.map((p) => p.category))];

  const filteredFavorites = favorites.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRemoveFavorite = (placeId: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== placeId));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className="text-xs">
            {n <= rating ? '⭐' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/layover">
            <Button variant="ghost" size="sm">
              ← Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Mis Favoritos</h1>
            <p className="text-gray-400 text-sm">
              {favorites.length} lugares guardados
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Buscar en favoritos..."
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
                {categoryLabels[cat]?.icon} {categoryLabels[cat]?.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Favorites List */}
      <div className="space-y-3">
        {filteredFavorites.map((place) => {
          const category = categoryLabels[place.category];
          return (
            <Card key={place.id} className="p-4">
              <div className="flex items-start justify-between">
                <Link
                  href={`/layover/${place.id}`}
                  className="flex items-start gap-3 flex-1"
                >
                  <span className="text-2xl">{category?.icon}</span>
                  <div>
                    <h3 className="font-semibold">{place.name}</h3>
                    <p className="text-gray-400 text-sm">{place.address}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {place.average_rating && renderStars(place.average_rating)}
                      <span className="text-gray-500 text-sm">
                        {place.price_range}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRemoveFavorite(place.id)}
                    className="text-red-400 hover:text-red-300 p-2"
                    title="Quitar de favoritos"
                  >
                    ❤️
                  </button>
                  <Link href={`/layover/${place.id}`}>
                    <Button variant="ghost" size="sm">
                      Ver →
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredFavorites.length === 0 && (
        <Card className="p-8 text-center">
          {favorites.length === 0 ? (
            <>
              <span className="text-4xl block mb-4">🤍</span>
              <p className="text-gray-400 mb-4">
                No tienes lugares favoritos aún
              </p>
              <Link href="/layover">
                <Button>Explorar lugares</Button>
              </Link>
            </>
          ) : (
            <p className="text-gray-400">
              No se encontraron favoritos con "{searchTerm}"
            </p>
          )}
        </Card>
      )}

      {/* Quick Access */}
      {favorites.length > 0 && (
        <Card className="p-4 bg-primary/10 border-primary/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Acceso rápido</p>
              <p className="text-gray-400 text-sm">
                Tus favoritos también aparecen destacados en el mapa
              </p>
            </div>
            <Link href="/layover">
              <Button variant="secondary" size="sm">
                Ver mapa
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
