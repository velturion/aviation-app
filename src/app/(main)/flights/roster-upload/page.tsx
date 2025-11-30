'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ParsedDuty {
  date: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  checkIn: string;
  checkOut: string;
  status: 'parsed' | 'error';
  errorMessage?: string;
}

export default function RosterUploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedDuties, setParsedDuties] = useState<ParsedDuty[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setIsProcessing(true);

    try {
      // Validate file type
      const validTypes = [
        'text/csv',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'image/png',
        'image/jpeg',
      ];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      const isValidType = validTypes.includes(selectedFile.type) ||
        ['csv', 'pdf', 'xlsx', 'xls', 'png', 'jpg', 'jpeg'].includes(fileExtension || '');

      if (!isValidType) {
        throw new Error('Formato de archivo no soportado. Usa CSV, PDF, Excel o imagen.');
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock parsed data - in real app, this would call backend/AI
      const mockParsed: ParsedDuty[] = [
        {
          date: '2024-01-20',
          flightNumber: 'AM101',
          departure: 'MEX',
          arrival: 'CUN',
          checkIn: '05:30',
          checkOut: '10:15',
          status: 'parsed',
        },
        {
          date: '2024-01-20',
          flightNumber: 'AM102',
          departure: 'CUN',
          arrival: 'GDL',
          checkIn: '11:00',
          checkOut: '14:30',
          status: 'parsed',
        },
        {
          date: '2024-01-21',
          flightNumber: 'AM205',
          departure: 'GDL',
          arrival: 'TIJ',
          checkIn: '06:00',
          checkOut: '09:45',
          status: 'parsed',
        },
        {
          date: '2024-01-22',
          flightNumber: 'AM310',
          departure: 'TIJ',
          arrival: 'MEX',
          checkIn: '14:00',
          checkOut: '18:30',
          status: 'parsed',
        },
      ];

      setParsedDuties(mockParsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error procesando archivo');
      setParsedDuties([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = async () => {
    setIsProcessing(true);
    try {
      // In real app, save duties to Supabase/Dexie
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Importing duties:', parsedDuties);
      router.push('/flights');
    } catch (err) {
      setError('Error al importar. Intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setParsedDuties([]);
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/flights">
          <Button variant="ghost" size="sm">
            ← Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Importar Roster</h1>
          <p className="text-gray-400 text-sm">
            Sube tu roster para importar tus vuelos automáticamente
          </p>
        </div>
      </div>

      {/* Upload Area */}
      {!file && (
        <Card
          className={`p-8 border-2 border-dashed transition-colors ${
            isDragging ? 'border-primary bg-primary/10' : 'border-gray-700'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-lg font-medium mb-2">
              Arrastra tu archivo aquí
            </p>
            <p className="text-gray-400 text-sm mb-4">
              o haz clic para seleccionar
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".csv,.pdf,.xlsx,.xls,.png,.jpg,.jpeg"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload">
              <Button as="span" variant="secondary">
                Seleccionar Archivo
              </Button>
            </label>
            <p className="text-gray-500 text-xs mt-4">
              Formatos soportados: CSV, PDF, Excel, Imagen
            </p>
          </div>
        </Card>
      )}

      {/* File Info & Processing */}
      {file && !parsedDuties.length && !error && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-gray-400 text-sm">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFile}>
              ✕
            </Button>
          </div>

          {isProcessing && (
            <div className="text-center py-4">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-400">Procesando archivo con IA...</p>
            </div>
          )}
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="p-6 border-red-500/50 bg-red-500/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="font-medium text-red-400">Error de procesamiento</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={clearFile}>
              Reintentar
            </Button>
          </div>
        </Card>
      )}

      {/* Parsed Results */}
      {parsedDuties.length > 0 && (
        <>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-medium">{file?.name}</p>
                  <p className="text-green-400 text-sm">
                    {parsedDuties.length} vuelos detectados
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFile}>
                Cambiar archivo
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Vista Previa</h2>
            <div className="space-y-3">
              {parsedDuties.map((duty, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    duty.status === 'parsed'
                      ? 'border-gray-700 bg-background'
                      : 'border-red-500/50 bg-red-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-400">
                          {new Date(duty.date).toLocaleDateString('es-MX', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </p>
                        <p className="font-bold">{duty.flightNumber}</p>
                      </div>
                      <div>
                        <p className="font-medium">
                          {duty.departure} → {duty.arrival}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {duty.checkIn} - {duty.checkOut}
                        </p>
                      </div>
                    </div>
                    {duty.status === 'error' ? (
                      <span className="text-red-400 text-sm">
                        {duty.errorMessage}
                      </span>
                    ) : (
                      <span className="text-green-400 text-sm">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Import Actions */}
          <div className="flex gap-4">
            <Button variant="secondary" className="flex-1" onClick={clearFile}>
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirmImport}
              disabled={isProcessing}
            >
              {isProcessing ? 'Importando...' : `Importar ${parsedDuties.length} vuelos`}
            </Button>
          </div>
        </>
      )}

      {/* Instructions */}
      <Card className="p-6 bg-surface/50">
        <h3 className="font-semibold mb-3">💡 Consejos para importar</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>• <strong>CSV:</strong> Asegúrate que tenga encabezados claros</li>
          <li>• <strong>PDF:</strong> Funciona mejor con PDFs de texto, no escaneados</li>
          <li>• <strong>Excel:</strong> Primera hoja debe contener el roster</li>
          <li>• <strong>Imagen:</strong> Captura clara del roster en pantalla</li>
          <li>• La IA detectará automáticamente fechas, vuelos y tiempos</li>
        </ul>
      </Card>
    </div>
  );
}
