importScripts('https://www.gstatic.com/firebasejs/5.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.2.0/firebase-messaging.js');
var config = {
    apiKey: "AIzaSyDv_39o3DviSPMAzqDYnICFQ1xwKkk0Ops",
    authDomain: "olx-pakistan-clone.firebaseapp.com",
    databaseURL: "https://olx-pakistan-clone.firebaseio.com",
    projectId: "olx-pakistan-clone",
    storageBucket: "olx-pakistan-clone.appspot.com",
    messagingSenderId: "733959825424"
};
firebase.initializeApp(config);

firebase.messaging();