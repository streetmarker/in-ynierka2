/* eslint-disable no-console */

import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "App is being served from cache by a service worker.\n" +
        "For more details, visit https://goo.gl/AFskqB"
      );
    },
    registered(registration) {
      console.log("Service worker has been registered.");
      registration.pushManager.getSubscription()
        .then(function (subscription) {
          console.log('Service worker pushManager: ', subscription);
          if (subscription === null) {
            subscribeUser(registration);
          }
        });
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    updated(registration) {
      console.log("New content is available; please refresh.");

      // Wyświetl powiadomienie dla użytkownika o dostępności aktualizacji
      if (confirm("Dostępna jest aktualizacja. Pobrać nową wersję?")) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    },
    offline() {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    },
  });
  let refreshing;
  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });

  self.addEventListener('pushsubscriptionchange', e => { 
    e.waitUntil(registration.pushManager.subscribe(e.oldSubscription.options) 
  .then(subscription => { 
    // TODO: Send new subscription to application server
    console.log('pushsubscriptionchange: ', subscription);
  })); 
});
}

