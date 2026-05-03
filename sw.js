// Service Worker - VIPLive Admin Notifications
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('message', event => {
  const data = event.data;
  if (!data || !data.type) return;

  let title = '';
  let body = '';
  let icon = '';
  let tag = '';

  if (data.type === 'new_message') {
    title = '💬 New Message!';
    body = `${data.username || 'User'}: ${data.text || '...'}`;
    icon = '💬';
    tag = 'msg-' + data.uid;
  } else if (data.type === 'new_visitor') {
    title = '👤 New Visitor!';
    body = `${data.name || 'Someone'} just visited your site`;
    icon = '👤';
    tag = 'visitor-' + data.uid;
  } else if (data.type === 'new_schedule') {
    title = '📅 New Schedule Booking!';
    body = `${data.name || 'User'} booked: ${data.datetime || ''}`;
    icon = '📅';
    tag = 'sched-' + data.key;
  }

  if (!title) return;

  self.registration.showNotification(title, {
    body: body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: tag,
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: { url: self.location.origin }
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
