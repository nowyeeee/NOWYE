const CACHE_NAME = "nowye-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {
    data = {
      title: "NOWYE",
      body: event.data ? event.data.text() : "Yeni bildirimin var."
    };
  }

  const title = data.title || "NOWYE DİYET";

  const options = {
    body: data.body || "Yeni bildirimin var.",
    icon: data.icon || "./assets/icon.svg",
    badge: data.badge || "./assets/icon.svg",
    tag: data.tag || "nowye-notification",
    renotify: true,
    data: {
      url: data.url || "./"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url =
    event.notification?.data?.url || "./";

  event.waitUntil(
    (async () => {
      const windows = await clients.matchAll({
        type: "window",
        includeUncontrolled: true
      });

      for (const client of windows) {
        try {
          await client.focus();
          await client.navigate(url);
          return;
        } catch (_) {}
      }

      await clients.openWindow(url);
    })()
  );
});
