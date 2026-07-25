
importScripts("https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js");

// Paste the SAME Firebase config from firebase.js
firebase.initializeApp({
  apiKey: "AIzaSyDO6OY3fjDgVi2MPUtPEtMuz32sWBihnbE",
  authDomain: "safealert267.firebaseapp.com",
  projectId: "safealert267",
  storageBucket: "safealert267.firebasestorage.app",
  messagingSenderId: "52708124598",
  appId: "1:52708124598:web:4cef0b845b7f1ca8f94317",
  measurementId: "G-SBDQWMY16M"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

  if (!payload.notification) return;
  
  self.registration.showNotification(
    payload.notification?.title || "🚨 SafeAlert",
    {
        body: payload.notification?.body || "Emergency Alert Received",
        icon: "/icon-192.png",
        badge: "/badge.png",
        vibrate: [500, 300, 500, 300, 500],
        requireInteraction: true,
        data: payload.data
    }
);

});
self.addEventListener("notificationclick", (event) => {

    event.notification.close();

    const data = event.notification.data || {};

    event.waitUntil(

        clients.openWindow(

`/emergency.html?uid=${data.uid}&lat=${data.latitude}&lng=${data.longitude}&name=${encodeURIComponent(data.name)}&phone=${data.phone ||""}`

        )

    );

});