import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const firebaseConfig = {
    // Your Firebase config object from Firebase console
    apiKey: 'YOUR_API_KEY',
    apiKey: "AIzaSyCEaylFdChEU-idKJjo5hF1L027hFIsdXk",
    authDomain: "internetshop-8bc07.firebaseapp.com",
    databaseURL: "https://internetshop-8bc07.firebaseio.com",
    projectId: "internetshop-8bc07",
    storageBucket: "internetshop-8bc07.firebasestorage.app",
    messagingSenderId: "39838192060",
    appId: "1:39838192060:web:63fe6d61fa881474625bb9",
    measurementId: "G-PVRM21E6EV"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firestore, storage };