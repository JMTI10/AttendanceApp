import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD-uBnjuP5CcKCLYrFkL3eo3V-ngeFZVzo",
  authDomain: "attendace-checker-101.firebaseapp.com",
  databaseURL: "https://attendace-checker-101-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "attendace-checker-101",
  storageBucket: "attendace-checker-101.firebasestorage.app",
  messagingSenderId: "948184339796",
  appId: "1:948184339796:web:482ca83a7a5983f423a4c1",
  measurementId: "G-SM7ELXG5NL"
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let firebaseAuth = null;

export const getAuthInstance = () => {
  if (!firebaseAuth) {
    firebaseAuth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
  return firebaseAuth;
};

export const db = getDatabase(app);