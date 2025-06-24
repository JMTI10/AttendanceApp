import { Stack, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { getAuthInstance } from '../firebaseConfig';

export default function RootLayout() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const auth = getAuthInstance(); // ✅ safely inside useEffect

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (checking) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
