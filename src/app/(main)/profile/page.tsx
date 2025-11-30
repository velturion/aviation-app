'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  FileText,
  Brain,
  Settings,
  MessageSquare,
  ChevronRight,
  Plane,
  MapPin,
  Edit2,
  LogOut,
} from 'lucide-react';
import { Card, CardContent, Button, Tag, Modal, Input } from '@/components/ui';
import type { Profile } from '@/types';

// Mock profile
const mockProfile: Profile = {
  id: '1',
  name: 'Juan Pérez',
  alias: 'Capitán Pérez',
  airline: 'Volaris',
  base: 'MEX',
  aircraft_types: ['A320', 'A321'],
  role: 'Capitán',
  regulation: 'FAA/DGAC',
  goal: 'Mantenerme actualizado y preparado para chequeos',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const menuItems = [
  {
    id: 'documents',
    name: 'Documentos',
    description: 'Licencias, médico, pasaporte...',
    icon: FileText,
    href: '/profile/documents',
    badge: 2,
  },
  {
    id: 'coach',
    name: 'IA Coach',
    description: 'Entrevistas, estrés, preparación',
    icon: Brain,
    href: '/profile/coach',
  },
  {
    id: 'settings',
    name: 'Configuración',
    description: 'Idioma, tema, notificaciones',
    icon: Settings,
    href: '/profile/settings',
  },
  {
    id: 'feedback',
    name: 'Mis Sugerencias',
    description: 'Historial de feedback enviado',
    icon: MessageSquare,
    href: '/profile/feedback',
  },
];

export default function ProfilePage() {
  const [profile] = useState<Profile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    // Save to Supabase
    console.log('Saving profile:', editedProfile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Perfil</h1>
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
          <Edit2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-[var(--color-textSecondary)]">{profile.alias}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-[var(--color-textSecondary)]" />
              <div>
                <p className="text-xs text-[var(--color-textSecondary)]">Aerolínea</p>
                <p className="font-medium">{profile.airline}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--color-textSecondary)]" />
              <div>
                <p className="text-xs text-[var(--color-textSecondary)]">Base</p>
                <p className="font-medium">{profile.base}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <div className="flex flex-wrap gap-2 mb-2">
              {profile.aircraft_types.map((type) => (
                <Tag key={type} variant="info" size="sm">
                  {type}
                </Tag>
              ))}
            </div>
            <div className="flex gap-2">
              <Tag variant="success" size="sm">
                {profile.role}
              </Tag>
              <Tag variant="default" size="sm">
                {profile.regulation}
              </Tag>
            </div>
          </div>

          {profile.goal && (
            <div className="mt-4 p-3 bg-[var(--color-surfaceAlt)] rounded-lg">
              <p className="text-xs text-[var(--color-textSecondary)] mb-1">Mi objetivo</p>
              <p className="text-sm">{profile.goal}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.id} href={item.href}>
              <Card hoverable>
                <CardContent className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.badge && (
                        <span className="w-5 h-5 rounded-full bg-[var(--color-warning)] text-white text-xs flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-textSecondary)]">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--color-textSecondary)]" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <Button variant="ghost" fullWidth className="text-[var(--color-error)]">
        <LogOut className="w-4 h-4 mr-2" />
        Cerrar sesión
      </Button>

      {/* Edit Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Editar Perfil">
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={editedProfile.name}
            onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
          />
          <Input
            label="Alias"
            value={editedProfile.alias}
            onChange={(e) => setEditedProfile({ ...editedProfile, alias: e.target.value })}
          />
          <Input
            label="Aerolínea"
            value={editedProfile.airline}
            onChange={(e) => setEditedProfile({ ...editedProfile, airline: e.target.value })}
          />
          <Input
            label="Base"
            value={editedProfile.base}
            onChange={(e) => setEditedProfile({ ...editedProfile, base: e.target.value })}
          />
          <Input
            label="Aeronaves (separadas por coma)"
            value={editedProfile.aircraft_types.join(', ')}
            onChange={(e) =>
              setEditedProfile({
                ...editedProfile,
                aircraft_types: e.target.value.split(',').map((s) => s.trim()),
              })
            }
          />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button variant="primary" fullWidth onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
