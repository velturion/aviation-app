'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { PlaceCategory } from '@/types';

const categoryOptions: { value: PlaceCategory; label: string; icon: string }[] = [
  { value: 'restaurant', label: 'Restaurante', icon: '🍽️' },
  { value: 'cafe', label: 'Café', icon: '☕' },
  { value: 'bar', label: 'Bar', icon: '🍺' },
  { value: 'gym', label: 'Gimnasio', icon: '💪' },
  { value: 'pharmacy', label: 'Farmacia', icon: '💊' },
  { value: 'supermarket', label: 'Supermercado', icon: '🛒' },
  { value: 'attraction', label: 'Atracción', icon: '🎡' },
  { value: 'transport', label: 'Transporte', icon: '🚕' },
  { value: 'other', label: 'Otro', icon: '📍' },
];

const priceRanges = ['$', '$$', '$$$', '$$$$'] as const;

export default function NewPlacePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'restaurant' as PlaceCategory,
    address: '',
    latitude: 0,
    longitude: 0,
    phone: '',
    website: '',
    price_range: '$$' as '$' | '$$' | '$$$' | '$$$$',
    notes: '',
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('No se pudo obtener tu ubicación');
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.address) return;

    setIsSubmitting(true);
    try {
      // In real app, save to Supabase
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Place created:', formData);
      router.push('/layover');
    } catch (error) {
      console.error('Error creating place:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/layover">
          <Button variant="ghost" size="sm">
            ← Cancelar
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Agregar Lugar</h1>
          <p className="text-gray-400 text-sm">
            Comparte un lugar útil con otros pilotos
          </p>
        </div>
      </div>

      {/* Basic Info */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Información Básica</h2>
        <div className="space-y-4">
          <Input
            label="Nombre del lugar"
            placeholder="Ej: La Habichuela Sunset"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium mb-2">Categoría</label>
            <div className="grid grid-cols-3 gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange('category', option.value)}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    formData.category === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="text-xl block mb-1">{option.icon}</span>
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rango de precios</label>
            <div className="flex gap-2">
              {priceRanges.map((price) => (
                <button
                  key={price}
                  onClick={() => handleInputChange('price_range', price)}
                  className={`flex-1 py-2 rounded-lg border transition-colors ${
                    formData.price_range === price
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Location */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Ubicación</h2>
        <div className="space-y-4">
          <Input
            label="Dirección"
            placeholder="Calle, número, colonia, ciudad..."
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium mb-2">Coordenadas</label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Latitud"
                type="number"
                step="any"
                value={formData.latitude || ''}
                onChange={(e) =>
                  handleInputChange('latitude', parseFloat(e.target.value) || 0)
                }
              />
              <Input
                placeholder="Longitud"
                type="number"
                step="any"
                value={formData.longitude || ''}
                onChange={(e) =>
                  handleInputChange('longitude', parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={handleGetLocation}
              disabled={isLocating}
            >
              {isLocating ? 'Obteniendo...' : '📍 Usar mi ubicación actual'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Contact */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Contacto (opcional)</h2>
        <div className="space-y-4">
          <Input
            label="Teléfono"
            placeholder="+52 998 123 4567"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
          <Input
            label="Sitio web"
            placeholder="https://..."
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
          />
        </div>
      </Card>

      {/* Notes */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Notas para crew</h2>
        <textarea
          className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-3 min-h-[100px] resize-none"
          placeholder="Tips, horarios especiales, qué pedir, cómo llegar..."
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
        />
      </Card>

      {/* Submit */}
      <div className="flex gap-4">
        <Link href="/layover" className="flex-1">
          <Button variant="secondary" className="w-full">
            Cancelar
          </Button>
        </Link>
        <Button
          className="flex-1"
          onClick={handleSubmit}
          disabled={!formData.name || !formData.address || isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : 'Agregar Lugar'}
        </Button>
      </div>

      {/* Guidelines */}
      <Card className="p-4 bg-surface/50">
        <h3 className="font-semibold mb-2">📝 Guía para agregar lugares</h3>
        <ul className="space-y-1 text-sm text-gray-400">
          <li>• Solo agrega lugares que hayas visitado personalmente</li>
          <li>• Verifica que la dirección sea correcta</li>
          <li>• Incluye tips útiles para otros pilotos</li>
          <li>• Evita duplicados - busca antes de agregar</li>
        </ul>
      </Card>
    </div>
  );
}
