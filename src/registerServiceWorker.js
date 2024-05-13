/* eslint-disable no-console */
import { fromBase64 } from 'base64url';
import { register } from "register-service-worker";

const applicationServerKey = process.env.VUE_APP_FCM_KEY;

const applicationServerKeyUint8 = fromBase64(applicationServerKey);

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
      // FCM ONLY
      // registration.pushManager.getSubscription()
      //   .then(function (subscription) {
      //     console.log('Service worker pushManager: ', subscription);
      //     // if (subscription === null) {
      //     //   subscribeUser(registration);
      //     // }
      //     if (subscription === null) {
      //       // Wyświetl okno dialogowe prośby o zezwolenie na subskrypcję push
      //       if (confirm("Czy chcesz zezwolić na otrzymywanie powiadomień push?")) {
      //         registration.pushManager.subscribe({
      //           userVisibleOnly: true,
      //           applicationServerKey: applicationServerKeyUint8
      //         })
      //         .then(function(newSubscription) {
      //           console.log('Nowa subskrypcja push:', newSubscription);
      //           // Przekazanie nowej subskrypcji do serwera aplikacji
      //         })
      //         .catch(function(error) {
      //           console.error('Błąd podczas subskrybowania push:', error);
      //         });
      //       }
      //     }
          
      //   });
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

