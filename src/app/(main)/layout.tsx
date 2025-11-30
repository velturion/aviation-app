'use client';

import { ReactNode } from 'react';
import { BottomNav, SideNav, FeedbackBar } from '@/components/layout';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Side Navigation (Desktop) */}
      <SideNav />

      {/* Main Content */}
      <main className="pb-32 md:pb-16 md:pl-20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />

      {/* Feedback Bar */}
      <FeedbackBar />
    </div>
  );
}
