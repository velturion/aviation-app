'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Plane, BookOpen, MapPin, User } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/flights', label: 'Vuelos', icon: Plane },
  { href: '/study', label: 'Estudio', icon: BookOpen },
  { href: '/layover', label: 'Layover', icon: MapPin },
  { href: '/profile', label: 'Perfil', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-12 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1 px-3 py-2
                transition-colors duration-200
                ${active
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-textSecondary)] hover:text-[var(--color-text)]'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function SideNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
          <Plane className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1 w-16 py-3 rounded-xl
                transition-all duration-200
                ${active
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'text-[var(--color-textSecondary)] hover:bg-[var(--color-surfaceAlt)] hover:text-[var(--color-text)]'
                }
              `}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
