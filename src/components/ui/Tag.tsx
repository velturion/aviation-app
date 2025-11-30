'use client';

import { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

function Tag({ children, variant = 'default', size = 'sm', className = '' }: TagProps) {
  const variants = {
    default: 'bg-[var(--color-surface)] text-[var(--color-textSecondary)]',
    success: 'bg-[var(--color-success)]/20 text-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]/20 text-[var(--color-warning)]',
    error: 'bg-[var(--color-error)]/20 text-[var(--color-error)]',
    info: 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Specific document status tag
interface StatusTagProps {
  status: 'ok' | 'expiring' | 'expired';
  daysRemaining?: number;
  className?: string;
}

function StatusTag({ status, daysRemaining, className = '' }: StatusTagProps) {
  const getVariant = () => {
    switch (status) {
      case 'ok':
        return 'success';
      case 'expiring':
        return 'warning';
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const getText = () => {
    switch (status) {
      case 'ok':
        return 'Vigente';
      case 'expiring':
        return daysRemaining !== undefined ? `${daysRemaining} días` : 'Por vencer';
      case 'expired':
        return 'Vencido';
      default:
        return '';
    }
  };

  return (
    <Tag variant={getVariant()} className={className}>
      {getText()}
    </Tag>
  );
}

export { Tag, StatusTag };
export type { TagProps, StatusTagProps };
