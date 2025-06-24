import { Stack, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';

export default function RootLayout() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('./tabs'); // user is logged in
      } else {
        router.replace('./login'); // not logged in
      }
      setCheckingAuth(false); // allow rendering after redirect
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) return null; // or a loading spinner

  return <Stack screenOptions={{ headerShown: false }} />;
}
