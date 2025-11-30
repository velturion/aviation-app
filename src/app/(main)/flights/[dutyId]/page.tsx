'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plane,
  Clock,
  ExternalLink,
  FileCheck,
  CloudSun,
  AlertTriangle,
  Send,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, Tag } from '@/components/ui';
import { analyzeMetarCfitAlar } from '@/lib/ai/aiClient';
import type { DutyDay, MetarAnalysisResult } from '@/types';

// Mock duty data
const getMockDuty = (id: string): DutyDay => ({
  id,
  user_id: '1',
  airline_id: '1',
  date_local: new Date().toISOString().split('T')[0],
  base_airport_code: 'MEX',
  checkin_time_utc: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  checkout_time_utc: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
  timezone: 'America/Mexico_City',
  status: 'scheduled',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  airline: {
    id: '1',
    user_id: '1',
    name: 'Volaris',
    code: 'Y4',
    checkin_url: 'https://cms.volaris.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  legs: [
    {
      id: '1',
      duty_day_id: id,
      flight_number: 'Y4 901',
      departure_airport: 'MEX',
      arrival_airport: 'CUN',
      std_utc: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      sta_utc: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      duty_day_id: id,
      flight_number: 'Y4 902',
      departure_airport: 'CUN',
      arrival_airport: 'MEX',
      std_utc: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      sta_utc: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
});

export default function DutyDetailPage() {
  const params = useParams();
  const dutyId = params.dutyId as string;
  const duty = getMockDuty(dutyId);

  const [fromIata, setFromIata] = useState(duty.legs?.[0]?.departure_airport || '');
  const [toIata, setToIata] = useState(duty.legs?.[duty.legs.length - 1]?.arrival_airport || '');
  const [alternateIata, setAlternateIata] = useState('');
  const [metarTafText, setMetarTafText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MetarAnalysisResult | null>(null);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleAnalyze = async () => {
    if (!metarTafText.trim()) return;

    setAnalyzing(true);
    try {
      const result = await analyzeMetarCfitAlar(
        fromIata,
        toIata,
        alternateIata || undefined,
        metarTafText,
        {
          route: `${fromIata}-${toIata}`,
          checkin_time: duty.checkin_time_utc,
          checkout_time: duty.checkout_time_utc,
          aircraft_type: 'A320', // Would come from profile
        }
      );
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const openCheckin = () => {
    if (duty.airline?.checkin_url) {
      window.open(duty.airline.checkin_url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/flights">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Detalle de Duty</h1>
          <p className="text-[var(--color-textSecondary)]">{formatDate(duty.date_local)}</p>
        </div>
      </div>

      {/* Duty Info */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Tag variant="info">{duty.airline?.name}</Tag>
            <Tag variant="success">{duty.status}</Tag>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--color-textSecondary)]" />
              <div>
                <p className="text-xs text-[var(--color-textSecondary)]">Check-in</p>
                <p className="font-medium">{formatTime(duty.checkin_time_utc)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--color-textSecondary)]" />
              <div>
                <p className="text-xs text-[var(--color-textSecondary)]">Check-out</p>
                <p className="font-medium">{formatTime(duty.checkout_time_utc)}</p>
              </div>
            </div>
          </div>

          {/* Legs */}
          <div className="space-y-3 mb-4">
            <h3 className="font-medium text-sm text-[var(--color-textSecondary)]">Vuelos</h3>
            {duty.legs?.map((leg, index) => (
              <div
                key={leg.id}
                className="flex items-center gap-3 p-3 bg-[var(--color-surfaceAlt)] rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-[var(--color-primary)]">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{leg.flight_number}</p>
                  <p className="text-sm text-[var(--color-textSecondary)]">
                    {leg.departure_airport} → {leg.arrival_airport}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p>{formatTime(leg.std_utc)}</p>
                  <p className="text-[var(--color-textSecondary)]">{formatTime(leg.sta_utc)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              fullWidth
              leftIcon={<ExternalLink className="w-4 h-4" />}
              onClick={openCheckin}
            >
              Check-in Directo
            </Button>
            <Link href={`/flights/logbook/new?dutyId=${dutyId}`} className="flex-1">
              <Button variant="secondary" fullWidth leftIcon={<FileCheck className="w-4 h-4" />}>
                Abrir Bitácora
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* METAR/TAF Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-[var(--color-primary)]" />
            METAR/TAF & CFIT/ALAR
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Airport Inputs */}
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Origen"
              value={fromIata}
              onChange={(e) => setFromIata(e.target.value.toUpperCase())}
              placeholder="MEX"
              maxLength={4}
            />
            <Input
              label="Destino"
              value={toIata}
              onChange={(e) => setToIata(e.target.value.toUpperCase())}
              placeholder="CUN"
              maxLength={4}
            />
            <Input
              label="Alterno"
              value={alternateIata}
              onChange={(e) => setAlternateIata(e.target.value.toUpperCase())}
              placeholder="GDL"
              maxLength={4}
            />
          </div>

          {/* METAR/TAF Text */}
          <Textarea
            label="METAR/TAF"
            value={metarTafText}
            onChange={(e) => setMetarTafText(e.target.value)}
            placeholder="Pega aquí el METAR/TAF..."
            rows={4}
          />

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1">
              Obtener METAR/TAF
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAnalyze}
              disabled={analyzing || !metarTafText.trim()}
              leftIcon={analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            >
              Analizar con IA
            </Button>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
              <h4 className="font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />
                Análisis CFIT/ALAR
              </h4>

              {/* Origin */}
              <div className="p-3 bg-[var(--color-surfaceAlt)] rounded-lg">
                <p className="font-medium mb-1">Origen ({fromIata})</p>
                <p className="text-sm text-[var(--color-textSecondary)] mb-2">
                  {analysis.origin.summary}
                </p>
                <ul className="text-sm space-y-1">
                  {analysis.origin.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--color-primary)]">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Destination */}
              <div className="p-3 bg-[var(--color-surfaceAlt)] rounded-lg">
                <p className="font-medium mb-1">Destino ({toIata})</p>
                <p className="text-sm text-[var(--color-textSecondary)] mb-2">
                  {analysis.destination.summary}
                </p>
                <ul className="text-sm space-y-1">
                  {analysis.destination.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--color-primary)]">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Alternate */}
              {analysis.alternate && (
                <div className="p-3 bg-[var(--color-surfaceAlt)] rounded-lg">
                  <p className="font-medium mb-1">Alterno ({alternateIata})</p>
                  <p className="text-sm text-[var(--color-textSecondary)] mb-2">
                    {analysis.alternate.summary}
                  </p>
                  <ul className="text-sm space-y-1">
                    {analysis.alternate.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[var(--color-primary)]">•</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* General Recommendations */}
              <div className="p-3 bg-[var(--color-warning)]/10 rounded-lg border border-[var(--color-warning)]/20">
                <p className="font-medium mb-2 text-[var(--color-warning)]">
                  Recomendaciones Generales
                </p>
                <ul className="text-sm space-y-1">
                  {analysis.generalRecommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-[var(--color-warning)] shrink-0 mt-0.5" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-[var(--color-textSecondary)] text-center">
                Solo para consciencia y entrenamiento. No reemplaza fuentes oficiales ni decisiones operacionales.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
