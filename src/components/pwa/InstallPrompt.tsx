'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { promptInstall, isPWAInstalled } from '@/lib/pwa/serviceWorker';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed or dismissed
    if (isPWAInstalled()) return;
    if (localStorage.getItem('pwa-install-dismissed') === 'true') return;

    const handleCanInstall = () => {
      setShowPrompt(true);
    };

    window.addEventListener('canInstall', handleCanInstall);
    return () => window.removeEventListener('canInstall', handleCanInstall);
  }, []);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="p-4 shadow-lg border-primary/50">
        <div className="flex items-start gap-3">
          <span className="text-2xl">✈️</span>
          <div className="flex-1">
            <h3 className="font-semibold">Instalar APP AVIATION</h3>
            <p className="text-gray-400 text-sm mt-1">
              Accede más rápido y usa la app sin conexión
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={handleInstall}>
                Instalar
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDismiss}>
                Ahora no
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
