// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.onBackgroundMessage` handler.
import { getMessaging, onMessage } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";

const messaging = getMessaging();
onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  // ...
});

onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
