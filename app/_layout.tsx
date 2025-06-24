import { Stack, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { getAuthInstance } from '../firebaseConfig';

export default function RootLayout() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const auth = getAuthInstance();

  useEffect(() => {
    const auth = getAuthInstance(); // ✅ call this INSIDE useEffect

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
      setChecking(false);
    });

    return unsubscribe;
  }, []);

  if (checking) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
