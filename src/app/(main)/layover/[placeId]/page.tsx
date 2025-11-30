'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Place, PlaceReview } from '@/types';

// Mock place data
const mockPlace: Place & { reviews: PlaceReview[] } = {
  id: '1',
  user_id: 'user1',
  name: 'La Habichuela Sunset',
  category: 'restaurant',
  latitude: 21.1619,
  longitude: -86.8515,
  address: 'Blvd. Kukulcan Km 12.6, Zona Hotelera, Cancún, Q.R.',
  phone: '+52 998 840 6280',
  website: 'https://lahabichuela.com',
  price_range: '$$$',
  recommended_by: 'Capitán García',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  average_rating: 4.5,
  reviews: [
    {
      id: 'r1',
      place_id: '1',
      user_id: 'user2',
      rating: 5,
      text: 'Excelente comida yucateca. El cochinita pibil es imperdible. Ambiente muy agradable para crew.',
      created_at: '2024-01-10T18:00:00Z',
    },
    {
      id: 'r2',
      place_id: '1',
      user_id: 'user3',
      rating: 4,
      text: 'Muy bueno pero un poco caro. Vale la pena para una ocasión especial.',
      created_at: '2024-01-05T20:00:00Z',
    },
    {
      id: 'r3',
      place_id: '1',
      user_id: 'user4',
      rating: 5,
      text: 'Siempre vengo cuando tengo layover en CUN. El servicio es excepcional.',
      created_at: '2023-12-20T19:00:00Z',
    },
  ],
};

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

export default function PlaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // In real app, fetch by params.placeId
  const place = mockPlace;
  const category = categoryLabels[place.category];

  const handleSubmitReview = async () => {
    if (!newReviewText.trim()) return;

    setIsSubmitting(true);
    try {
      // In real app, save to Supabase
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Review submitted:', { rating: newRating, text: newReviewText });
      setNewReviewText('');
      setShowReviewForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
    window.open(url, '_blank');
  };

  const handleOpenUber = () => {
    // Deep link to Uber with destination
    const url = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${place.latitude}&dropoff[longitude]=${place.longitude}&dropoff[nickname]=${encodeURIComponent(place.name)}`;
    window.open(url, '_blank');
  };

  const renderStars = (rating: number, interactive = false, onSelect?: (n: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => interactive && onSelect?.(n)}
            disabled={!interactive}
            className={`text-lg ${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
            }`}
          >
            {n <= rating ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/layover">
          <Button variant="ghost" size="sm">
            ← Volver al mapa
          </Button>
        </Link>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="text-2xl"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Place Info */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">{category.icon}</span>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">{place.name}</h1>
                <p className="text-gray-400">{category.label}</p>
              </div>
              <span className="text-lg font-medium">{place.price_range}</span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              {renderStars(place.average_rating || 0)}
              <span className="text-gray-400">
                ({place.reviews.length} reseñas)
              </span>
            </div>

            <p className="text-gray-300 mt-4">{place.address}</p>

            {place.phone && (
              <a
                href={`tel:${place.phone}`}
                className="text-primary hover:underline block mt-2"
              >
                {place.phone}
              </a>
            )}

            {place.website && (
              <a
                href={place.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline block mt-1"
              >
                Visitar sitio web
              </a>
            )}

            <p className="text-gray-500 text-sm mt-4">
              Recomendado por: {place.recommended_by}
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={handleOpenMaps} className="w-full">
          🗺️ Abrir en Maps
        </Button>
        <Button variant="secondary" onClick={handleOpenUber} className="w-full">
          🚗 Pedir Uber
        </Button>
      </div>

      {/* Reviews Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Reseñas</h2>
          {!showReviewForm && (
            <Button size="sm" onClick={() => setShowReviewForm(true)}>
              + Escribir reseña
            </Button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-surface p-4 rounded-lg mb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tu calificación</label>
              {renderStars(newRating, true, setNewRating)}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tu reseña</label>
              <textarea
                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 min-h-[100px] resize-none"
                placeholder="Comparte tu experiencia..."
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowReviewForm(false);
                  setNewReviewText('');
                  setNewRating(5);
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={!newReviewText.trim() || isSubmitting}
              >
                {isSubmitting ? 'Publicando...' : 'Publicar'}
              </Button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {place.reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-800 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                </div>
                <span className="text-gray-500 text-sm">
                  {new Date(review.created_at).toLocaleDateString('es-MX')}
                </span>
              </div>
              <p className="text-gray-300">{review.text}</p>
            </div>
          ))}
        </div>

        {place.reviews.length === 0 && !showReviewForm && (
          <p className="text-gray-400 text-center py-4">
            Sé el primero en dejar una reseña
          </p>
        )}
      </Card>

      {/* Nearby Places */}
      <Card className="p-4 bg-primary/10 border-primary/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">¿Conoces más lugares?</p>
            <p className="text-gray-400 text-sm">
              Ayuda a otros pilotos compartiendo recomendaciones
            </p>
          </div>
          <Link href="/layover/new">
            <Button variant="secondary" size="sm">
              Agregar lugar
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
