// Notification service for browser notifications
import type { DutyDay, Document } from '@/types';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function showNotification(title: string, options?: NotificationOptions): void {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      ...options,
    });
  }
}

export function scheduleDutyNotifications(duty: DutyDay): void {
  // Calculate notification times
  const checkinTime = new Date(duty.checkin_time_utc);
  const checkoutTime = new Date(duty.checkout_time_utc);

  // 2 hours before check-in
  const twoHoursBefore = new Date(checkinTime.getTime() - 2 * 60 * 60 * 1000);
  const now = new Date();

  if (twoHoursBefore > now) {
    const delay = twoHoursBefore.getTime() - now.getTime();
    setTimeout(() => {
      showNotification('Recordatorio de Check-in', {
        body: `Tu check-in es en 2 horas (${checkinTime.toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit',
        })})`,
        tag: `duty-${duty.id}-2h`,
      });
    }, delay);
  }

  // 30 minutes before check-in
  const thirtyMinBefore = new Date(checkinTime.getTime() - 30 * 60 * 1000);
  if (thirtyMinBefore > now) {
    const delay = thirtyMinBefore.getTime() - now.getTime();
    setTimeout(() => {
      showNotification('¡Check-in pronto!', {
        body: `Tu check-in es en 30 minutos`,
        tag: `duty-${duty.id}-30m`,
      });
    }, delay);
  }

  console.log(`Notifications scheduled for duty ${duty.id}`);
}

export function scheduleDocumentNotifications(document: Document): void {
  const expiryDate = new Date(document.expiry_date);
  const now = new Date();

  const notificationDays = [
    { enabled: document.notify_90, days: 90 },
    { enabled: document.notify_60, days: 60 },
    { enabled: document.notify_30, days: 30 },
    { enabled: document.notify_7, days: 7 },
    { enabled: document.notify_day, days: 0 },
  ];

  for (const { enabled, days } of notificationDays) {
    if (!enabled) continue;

    const notifyDate = new Date(expiryDate.getTime() - days * 24 * 60 * 60 * 1000);

    if (notifyDate > now) {
      const delay = notifyDate.getTime() - now.getTime();
      setTimeout(() => {
        const message =
          days === 0
            ? `¡${document.name} vence hoy!`
            : `${document.name} vence en ${days} días`;

        showNotification('Documento por vencer', {
          body: message,
          tag: `doc-${document.id}-${days}`,
        });
      }, delay);
    }
  }

  console.log(`Notifications scheduled for document ${document.id}`);
}

// Check if current time is within quiet hours
export function isQuietHours(startHour?: string, endHour?: string): boolean {
  if (!startHour || !endHour) return false;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinutes;

  const [startH, startM] = startHour.split(':').map(Number);
  const [endH, endM] = endHour.split(':').map(Number);
  const startTime = startH * 60 + startM;
  const endTime = endH * 60 + endM;

  if (startTime < endTime) {
    return currentTime >= startTime && currentTime < endTime;
  } else {
    // Quiet hours span midnight
    return currentTime >= startTime || currentTime < endTime;
  }
}
