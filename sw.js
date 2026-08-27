self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "NOWYE",
      body: event.data ? event.data.text() : "Yeni bildirimin var."
    };
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || "NOWYE",
      {
        body: data.body || "Yeni bildirimin var.",
        icon: data.icon,
        badge: data.badge,
        data: data.url ? { url: data.url } : {}
      }
    )
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url;

  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});