'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Plus,
  Heart,
  Filter,
  Car,
  UtensilsCrossed,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, Button, Tag } from '@/components/ui';
import type { Place, PlaceCategory } from '@/types';

// Dynamically import the map to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/layout/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[50vh] bg-[var(--color-surface)] rounded-xl flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
    </div>
  ),
});

const categories: { value: PlaceCategory; label: string; icon: typeof MapPin }[] = [
  { value: 'restaurant', label: 'Restaurantes', icon: UtensilsCrossed },
  { value: 'cafe', label: 'Cafés', icon: UtensilsCrossed },
  { value: 'gym', label: 'Gimnasios', icon: MapPin },
  { value: 'pharmacy', label: 'Farmacias', icon: MapPin },
  { value: 'supermarket', label: 'Supermercados', icon: MapPin },
  { value: 'attraction', label: 'Atracciones', icon: MapPin },
];

// Mock places
const mockPlaces: Place[] = [
  {
    id: '1',
    user_id: '1',
    name: 'Restaurante La Casa',
    category: 'restaurant',
    latitude: 19.4326,
    longitude: -99.1332,
    address: 'Av. Insurgentes 123',
    phone: '+52 55 1234 5678',
    price_range: '$$',
    recommended_by: 'Capitán García',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    average_rating: 4.5,
  },
  {
    id: '2',
    user_id: '1',
    name: 'Gym Fitness Pro',
    category: 'gym',
    latitude: 19.4336,
    longitude: -99.1342,
    address: 'Calle Reforma 456',
    price_range: '$',
    recommended_by: 'F/O Martínez',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    average_rating: 4.2,
  },
];

export default function LayoverMapPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [places] = useState<Place[]>(mockPlaces);
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        () => {
          // Default to Mexico City if location denied
          setUserLocation({ lat: 19.4326, lng: -99.1332 });
          setLoading(false);
        }
      );
    } else {
      setUserLocation({ lat: 19.4326, lng: -99.1332 });
      setLoading(false);
    }
  }, []);

  const toggleCategory = (category: PlaceCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredPlaces =
    selectedCategories.length === 0
      ? places
      : places.filter((p) => selectedCategories.includes(p.category));

  const openUber = () => {
    window.open('https://m.uber.com', '_blank');
  };

  const openUberEats = () => {
    window.open('https://www.ubereats.com', '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="w-6 h-6 text-[var(--color-primary)]" />
          Layover
        </h1>
        <div className="flex gap-2">
          <Link href="/layover/favorites">
            <Button variant="ghost" size="sm">
              <Heart className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/layover/add">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Agregar
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Car className="w-4 h-4" />}
          onClick={openUber}
        >
          Uber
        </Button>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<UtensilsCrossed className="w-4 h-4" />}
          onClick={openUberEats}
        >
          Uber Eats
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => toggleCategory(cat.value)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedCategories.includes(cat.value)
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-textSecondary)]'
            }`}
          >
            <Filter className="w-3 h-3" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden">
        {!loading && userLocation && (
          <MapComponent
            center={userLocation}
            places={filteredPlaces}
            userLocation={userLocation}
          />
        )}
      </div>

      {/* Places List */}
      <div className="space-y-2">
        <h2 className="font-semibold">Lugares cercanos</h2>
        {filteredPlaces.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-[var(--color-textSecondary)]" />
              <p className="text-[var(--color-textSecondary)]">
                No hay lugares en esta categoría
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPlaces.map((place) => (
            <Link key={place.id} href={`/layover/place/${place.id}`}>
              <Card hoverable>
                <CardContent className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{place.name}</h3>
                      <Tag variant="default" size="sm">
                        {place.price_range}
                      </Tag>
                    </div>
                    <p className="text-sm text-[var(--color-textSecondary)]">
                      {place.address}
                    </p>
                    <p className="text-xs text-[var(--color-textSecondary)]">
                      Recomendado por {place.recommended_by}
                    </p>
                  </div>
                  {place.average_rating && (
                    <Tag variant="success" size="sm">
                      ⭐ {place.average_rating}
                    </Tag>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
