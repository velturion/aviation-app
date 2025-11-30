'use client';

interface AdBannerProps {
  position: 'top' | 'bottom';
  className?: string;
}

export function AdBanner({ position, className = '' }: AdBannerProps) {
  // This is a placeholder for ads
  // In production, integrate with ad network (Google AdSense, etc.)
  return (
    <div
      className={`w-full bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg overflow-hidden ${className}`}
    >
      <div className="h-20 md:h-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-xs uppercase tracking-wider">
            Advertisement
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Ad Space - {position === 'top' ? 'Header' : 'Footer'}
          </p>
        </div>
      </div>
    </div>
  );
}
