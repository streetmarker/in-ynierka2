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
    registered() {
      console.log("Service worker has been registered.");
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
        // navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING'});
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });

        // navigator.serviceWorker.getRegistration(`${process.env.BASE_URL}service-worker.js`).then(function(registration) {
        //   if (registration && registration.active) {
        //     registration.active.skipWaiting();
            //.postMessage({ action: "skipWaiting" });
            // Sprawdź, czy mamy dostęp do kontrolera serwisowego worker-a
// if (navigator.serviceWorker.controller) {
//   // Wyślij wiadomość do kontrolera
//   navigator.serviceWorker.controller.postMessage({ action: "skipWaiting" });
// }

          }
        // });
        
        // Jeśli użytkownik zaakceptuje aktualizację, wykonaj poniższe operacje
        // registration.waiting.postMessage({ action: "skipWaiting" });
      // if (confirm("New version available. Load new version?")) {
      //   localStorage.setItem('newVersionAvailable', 'true');
      //   window.location.reload();
      // }
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

//   navigator.serviceWorker.addEventListener('fetch', function(event) {
//     event.respondWith(
//         caches.match(event.request).then(function(response) {
//             if (localStorage.getItem('newVersionAvailable') === 'true') {
//                 localStorage.removeItem('newVersionAvailable');
//                 return fetch(event.request);
//             }
//             return response || fetch(event.request);
//         })
//     );
// });

}
