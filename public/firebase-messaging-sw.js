// Give the service worker access to Firebase Messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyCLQ5JXymA2SecVKqd8NWtGs4qkXuo7-MA",
  projectId: "flames-73da0",
  messagingSenderId: "501814942400",
  appId: "1:501814942400:web:a0ecd356e2d59bebe02b25",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/flame1.png',
    badge: '/flame1.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});