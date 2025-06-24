import { ref, set } from 'firebase/database';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { db } from '../../firebaseConfig';

export default function TabHome() {
  useEffect(() => {
    const writeTestData = async () => {
      try {
        await set(ref(db, 'test'), {
          status: 'Connected from index tab screen'
        });
        console.log('Data written to Realtime DB ✅');
      } catch (err) {
        console.error('Firebase error:', (err as Error).message);
      }
    };

    writeTestData();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Tab Home – Firebase ✅</Text>
    </View>
  );
}
