'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Plus,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, Button, Tag, StatusTag } from '@/components/ui';
import type { Document, DocumentSection, DocumentType } from '@/types';

// Mock documents
const mockDocuments: Document[] = [
  {
    id: '1',
    user_id: '1',
    type: 'license',
    name: 'Licencia de Piloto ATP',
    issuer: 'DGAC',
    number: 'ATP-123456',
    country: 'México',
    issue_date: '2020-01-15',
    expiry_date: '2025-01-15',
    notify_90: true,
    notify_60: true,
    notify_30: true,
    notify_7: true,
    notify_day: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: '1',
    type: 'medical',
    name: 'Certificado Médico Clase 1',
    issuer: 'DGAC',
    number: 'MED-789012',
    country: 'México',
    issue_date: '2024-01-01',
    expiry_date: '2024-06-30',
    notify_90: true,
    notify_60: true,
    notify_30: true,
    notify_7: true,
    notify_day: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: '1',
    type: 'passport',
    name: 'Pasaporte',
    issuer: 'SRE',
    number: 'PASS-345678',
    country: 'México',
    issue_date: '2019-05-01',
    expiry_date: '2029-05-01',
    notify_90: true,
    notify_60: false,
    notify_30: true,
    notify_7: true,
    notify_day: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    user_id: '1',
    type: 'visa',
    name: 'Visa USA B1/B2',
    issuer: 'US Embassy',
    number: 'VISA-901234',
    country: 'USA',
    issue_date: '2022-03-15',
    expiry_date: '2032-03-15',
    notify_90: true,
    notify_60: false,
    notify_30: true,
    notify_7: true,
    notify_day: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    user_id: '1',
    type: 'airline_id',
    name: 'Credencial Volaris',
    issuer: 'Volaris',
    number: 'VOL-567890',
    country: 'México',
    issue_date: '2023-06-01',
    expiry_date: '2024-06-01',
    notify_90: false,
    notify_60: true,
    notify_30: true,
    notify_7: true,
    notify_day: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const sections: { id: DocumentSection; label: string; types: DocumentType[] }[] = [
  { id: 'regulatory', label: 'Regulatorios', types: ['license', 'medical'] },
  { id: 'airline', label: 'Aerolínea', types: ['airline_id', 'training'] },
  { id: 'travel', label: 'Viaje', types: ['passport', 'visa'] },
  { id: 'other', label: 'Otros', types: ['other'] },
];

function getDocumentStatus(expiryDate: string): { status: 'ok' | 'expiring' | 'expired'; days: number } {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { status: 'expired', days: Math.abs(diffDays) };
  if (diffDays <= 30) return { status: 'expiring', days: diffDays };
  return { status: 'ok', days: diffDays };
}

export default function DocumentsPage() {
  const [documents] = useState<Document[]>(mockDocuments);

  const getDocumentsForSection = (types: DocumentType[]) => {
    return documents.filter((doc) => types.includes(doc.type));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Documentos</h1>
        </div>
        <Link href="/profile/documents/new">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Agregar
          </Button>
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center py-3">
          <div className="flex items-center justify-center gap-1 text-[var(--color-success)]">
            <CheckCircle className="w-4 h-4" />
            <span className="text-lg font-bold">
              {documents.filter((d) => getDocumentStatus(d.expiry_date).status === 'ok').length}
            </span>
          </div>
          <p className="text-xs text-[var(--color-textSecondary)]">Vigentes</p>
        </Card>
        <Card className="text-center py-3">
          <div className="flex items-center justify-center gap-1 text-[var(--color-warning)]">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-lg font-bold">
              {documents.filter((d) => getDocumentStatus(d.expiry_date).status === 'expiring').length}
            </span>
          </div>
          <p className="text-xs text-[var(--color-textSecondary)]">Por vencer</p>
        </Card>
        <Card className="text-center py-3">
          <div className="flex items-center justify-center gap-1 text-[var(--color-error)]">
            <XCircle className="w-4 h-4" />
            <span className="text-lg font-bold">
              {documents.filter((d) => getDocumentStatus(d.expiry_date).status === 'expired').length}
            </span>
          </div>
          <p className="text-xs text-[var(--color-textSecondary)]">Vencidos</p>
        </Card>
      </div>

      {/* Sections */}
      {sections.map((section) => {
        const sectionDocs = getDocumentsForSection(section.types);
        if (sectionDocs.length === 0) return null;

        return (
          <div key={section.id}>
            <h2 className="text-lg font-semibold mb-3">{section.label}</h2>
            <div className="space-y-2">
              {sectionDocs.map((doc) => {
                const { status, days } = getDocumentStatus(doc.expiry_date);

                return (
                  <Link key={doc.id} href={`/profile/documents/${doc.id}`}>
                    <Card hoverable>
                      <CardContent className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[var(--color-primary)]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{doc.name}</h3>
                          <p className="text-sm text-[var(--color-textSecondary)]">
                            Vence: {new Date(doc.expiry_date).toLocaleDateString('es-MX')}
                          </p>
                        </div>
                        <StatusTag status={status} daysRemaining={days} />
                        <ChevronRight className="w-5 h-5 text-[var(--color-textSecondary)]" />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
