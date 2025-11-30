'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function UpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const handleUpdate = (event: CustomEvent<ServiceWorkerRegistration>) => {
      setShowUpdate(true);
      setRegistration(event.detail);
    };

    window.addEventListener('swUpdate', handleUpdate as EventListener);
    return () => window.removeEventListener('swUpdate', handleUpdate as EventListener);
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="p-4 shadow-lg border-green-500/50 bg-green-500/10">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔄</span>
          <div className="flex-1">
            <h3 className="font-semibold">Nueva versión disponible</h3>
            <p className="text-gray-400 text-sm mt-1">
              Actualiza para obtener las últimas mejoras
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={handleUpdate}>
                Actualizar
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDismiss}>
                Después
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
