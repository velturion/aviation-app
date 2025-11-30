'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="p-8 max-w-md text-center">
        <div className="text-6xl mb-4">✈️</div>
        <h1 className="text-2xl font-bold mb-2">Sin Conexión</h1>
        <p className="text-gray-400 mb-6">
          No hay conexión a internet. Algunas funciones pueden no estar
          disponibles.
        </p>

        <div className="space-y-4">
          <Button onClick={handleRetry} className="w-full">
            Reintentar conexión
          </Button>

          <div className="pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-500 mb-3">
              Mientras tanto, puedes acceder a:
            </p>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>📅 Tus vuelos guardados</li>
              <li>📚 Manuales descargados</li>
              <li>📝 Bitácora offline</li>
              <li>⭐ Lugares favoritos</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-gray-600 mt-6">
          Los datos se sincronizarán automáticamente cuando vuelvas a tener
          conexión.
        </p>
      </Card>
    </div>
  );
}
