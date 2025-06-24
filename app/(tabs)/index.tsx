import { format } from 'date-fns';
import { onValue, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { db, getAuthInstance } from '../../firebaseConfig';


export default function AttendanceTab() {
  const [history, setHistory] = useState<{ [date: string]: string } | null>(null);
  const today = format(new Date(), 'yyyy-MM-dd');
  const auth = getAuthInstance();

  const markAttendance = async (status: string) => {
    const user = auth.currentUser;
    if (!user) return;
    await set(ref(db, `users/${user.uid}/attendance/${today}`), status);
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const attendanceRef = ref(db, `users/${user.uid}/attendance`);
    const unsubscribe = onValue(attendanceRef, (snapshot) => {
      setHistory(snapshot.val());
    });
    return () => unsubscribe();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Attendance for {today}</Text>
      <View style={styles.buttonGroup}>
        <Button title="Present" onPress={() => markAttendance('present')} />
        <Button title="Absent" onPress={() => markAttendance('absent')} />
        <Button title="Canceled" onPress={() => markAttendance('canceled')} />
      </View>

      {history && (
        <View style={styles.history}>
          <Text style={styles.subtitle}>Attendance History:</Text>
          {Object.entries(history)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([date, status]) => (
              <Text key={date} style={styles.historyItem}>{date}: {status}</Text>
            ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#fff' },
  buttonGroup: { gap: 10, marginBottom: 24 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#fff' },
  history: { marginTop: 16 },
  historyItem: { color: '#ccc', marginBottom: 4 },
});
