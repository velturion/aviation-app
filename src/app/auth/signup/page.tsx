'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { ThemeToggle, LanguageToggle } from '@/components/common';
import { supabase } from '@/lib/supabase/client';

export default function SignupPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    airline: '',
    aircraftType: '',
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      setIsLoading(false);
      return;
    }

    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            airline: formData.airline,
            aircraft_type: formData.aircraftType,
          },
        },
      });

      if (authError) throw authError;

      // If successful, show success message
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">✈️</span>
              <span className="font-bold text-lg">APP AVIATION</span>
            </Link>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center pt-16 px-4">
          <div className="w-full max-w-md text-center">
            <div className="bg-surface border border-gray-800 rounded-2xl p-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">¡Cuenta creada!</h1>
              <p className="text-gray-400 mb-6">
                Hemos enviado un correo de confirmación a <strong>{formData.email}</strong>.
                Por favor revisa tu bandeja de entrada.
              </p>
              <Link href="/auth/login">
                <button className="w-full py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold transition-all">
                  Ir a iniciar sesión
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="font-bold text-lg">APP AVIATION</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center pt-20 pb-8 px-4">
        <div className="w-full max-w-md">
          <div className="bg-surface border border-gray-800 rounded-2xl p-8">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">{t('signup')}</h1>
              <p className="text-gray-400 text-sm">
                Crea tu cuenta de piloto profesional
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('email')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Aerolínea
                  </label>
                  <select
                    name="airline"
                    value={formData.airline}
                    onChange={handleChange}
                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="">Seleccionar</option>
                    <option value="volaris">Volaris</option>
                    <option value="aeromexico">Aeroméxico</option>
                    <option value="vivaaerobus">VivaAerobus</option>
                    <option value="other">Otra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Aeronave
                  </label>
                  <select
                    name="aircraftType"
                    value={formData.aircraftType}
                    onChange={handleChange}
                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="">Seleccionar</option>
                    <option value="A320">A320</option>
                    <option value="A321">A321</option>
                    <option value="B737">B737</option>
                    <option value="B787">B787</option>
                    <option value="E190">E190</option>
                    <option value="other">Otra</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('password')} *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('confirmPassword')} *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                  placeholder="Confirma tu contraseña"
                  required
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-1"
                  required
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-400">
                  Acepto los{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    términos y condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    política de privacidad
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('loading')}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    {t('createAccount')}
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-gray-400 mt-6">
              {t('hasAccount')}{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
