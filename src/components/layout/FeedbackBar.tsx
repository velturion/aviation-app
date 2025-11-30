'use client';

import { useState } from 'react';
import { MessageSquarePlus, Send, X } from 'lucide-react';
import { Button, Modal, Textarea, useToast } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import type { FeedbackModule, FeedbackType } from '@/types';

export function FeedbackBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [module, setModule] = useState<FeedbackModule>('other');
  const [type, setType] = useState<FeedbackType>('idea');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async () => {
    if (!message.trim()) {
      addToast('warning', 'Por favor escribe tu mensaje');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        addToast('error', 'Debes iniciar sesión para enviar feedback');
        return;
      }

      const { error } = await supabase.from('feedback').insert({
        user_id: user.id,
        module,
        type,
        message: message.trim(),
        status: 'new',
      });

      if (error) throw error;

      addToast('success', '¡Gracias por tu feedback!');
      setMessage('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      addToast('error', 'No se pudo enviar el feedback. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const modules: { value: FeedbackModule; label: string }[] = [
    { value: 'home', label: 'Inicio' },
    { value: 'flights', label: 'Vuelos' },
    { value: 'study', label: 'Estudio' },
    { value: 'layover', label: 'Layover' },
    { value: 'profile', label: 'Perfil' },
    { value: 'other', label: 'Otro' },
  ];

  const types: { value: FeedbackType; label: string }[] = [
    { value: 'bug', label: '🐛 Bug / Error' },
    { value: 'idea', label: '💡 Idea / Sugerencia' },
    { value: 'question', label: '❓ Pregunta' },
    { value: 'other', label: '📝 Otro' },
  ];

  return (
    <>
      {/* Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] px-4 py-3 flex items-center justify-between z-40 md:left-20">
        <p className="text-sm text-[var(--color-textSecondary)]">
          ¿Idea o problema? Envíanos tu sugerencia
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          leftIcon={<MessageSquarePlus className="w-4 h-4" />}
        >
          Enviar
        </Button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Enviar Feedback"
        size="md"
      >
        <div className="space-y-4">
          {/* Module Select */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
              Módulo
            </label>
            <select
              value={module}
              onChange={(e) => setModule(e.target.value as FeedbackModule)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-inputBackground)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              {modules.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Type Select */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
              Tipo
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as FeedbackType)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-inputBackground)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              {types.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <Textarea
            label="Mensaje"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe tu idea, problema o pregunta..."
            rows={4}
          />

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              loading={loading}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Enviar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
