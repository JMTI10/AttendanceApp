import { format } from 'date-fns';
import { ref, set } from 'firebase/database';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../../firebaseConfig';

export default function AttendanceTab() {
  const today = format(new Date(), 'yyyy-MM-dd');

  const markAttendance = async (status: string) => {
    const user = auth.currentUser;
    if (!user) return;

    await set(ref(db, `users/${user.uid}/attendance/${today}`), status);
    console.log(`Marked ${status} for ${today}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance for {today}</Text>
      <View style={styles.buttonGroup}>
        <Button title="Present" onPress={() => markAttendance('present')} />
        <Button title="Absent" onPress={() => markAttendance('absent')} />
        <Button title="Canceled" onPress={() => markAttendance('canceled')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  buttonGroup: { gap: 12 }
});
