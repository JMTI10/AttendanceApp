// ClassDetailsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  TouchableOpacity,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

export default function ClassDetailsScreen({ route }) {
  const {
    classId,
    className,
    timesPerWeek,
    startDate,
    endDate,
  } = route.params;
  const db = useSQLiteContext();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // format today’s date DD-MM-YYYY
  const formatToday = () => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const loadRecords = async () => {
    setLoading(true);
    try {
      const rows = await db.getAllAsync(
        `SELECT id, date, status 
           FROM attendance 
          WHERE class_id = ? 
          ORDER BY id ASC;`,
        [classId]
      );
      setRecords(rows);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Add a new attendance record
  const addRecord = async (status) => {
    const date = formatToday();
    try {
      await db.runAsync(
        `INSERT INTO attendance (class_id, date, status) VALUES (?, ?, ?);`,
        [classId, date, status]
      );
      loadRecords();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not add record');
    }
  };

  // Update a record’s status
  const updateRecord = async (id, status) => {
    try {
      await db.runAsync(
        `UPDATE attendance SET status = ? WHERE id = ?;`,
        [status, id]
      );
      loadRecords();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not update record');
    }
  };

  // Delete a record
  const deleteRecord = async (id) => {
    try {
      await db.runAsync(
        `DELETE FROM attendance WHERE id = ?;`,
        [id]
      );
      loadRecords();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not delete record');
    }
  };

  // Show edit/delete options for a row
  const onPressRecord = (item) => {
    Alert.alert(
      `Record: ${item.date}`,
      `Current status: ${item.status}`,
      [
        { text: 'Mark Attended', onPress: () => updateRecord(item.id, 'Attended') },
        { text: 'Mark Missed',   onPress: () => updateRecord(item.id, 'Missed') },
        { text: 'Mark Canceled', onPress: () => updateRecord(item.id, 'Canceled') },
        { text: 'Delete', style: 'destructive', onPress: () => deleteRecord(item.id) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => { loadRecords(); }, []);

  if (loading) {
    return <ActivityIndicator style={styles.loader} color="#9C27B0" />;
  }

  // Compute summary
  const attendedCount = records.filter(r => r.status === 'Attended').length;
  const missedCount   = records.filter(r => r.status === 'Missed').length;
  const canceledCount = records.filter(r => r.status === 'Canceled').length;
  const validCount    = attendedCount + missedCount;
  const attendancePct = validCount > 0
    ? Math.round((attendedCount / validCount) * 100)
    : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>{className}</Text>
      <Text style={styles.sub}>
        📆 {timesPerWeek}×/week • {startDate} → {endDate}
      </Text>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Attended: {attendedCount}</Text>
        <Text style={styles.summaryText}>Missed:   {missedCount}</Text>
        <Text style={styles.summaryText}>Canceled: {canceledCount}</Text>
        <Text style={styles.summaryText}>Attendance: {attendancePct}%</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsRow}>
        <Button title="Attended"   onPress={() => addRecord('Attended')} color="#9C27B0" />
        <Button title="Missed"     onPress={() => addRecord('Missed')}   color="#9C27B0" />
        <Button title="Canceled"   onPress={() => addRecord('Canceled')} color="#9C27B0" />
      </View>

      {/* Table Header */}
      <View style={styles.header}>
        <Text style={styles.cellHeader}>Date</Text>
        <Text style={styles.cellHeader}>Status</Text>
      </View>

      {/* Records List */}
      <FlatList
        data={records}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={records.length === 0 && styles.emptyContainer}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPressRecord(item)}>
            <View style={styles.row}>
              <Text style={styles.cell}>{item.date}</Text>
              <Text style={styles.cell}>{item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No attendance records yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#000', padding: 10 },
  loader:        { marginTop: 20 },
  title:         { fontSize: 24, fontWeight: '700', color: '#9C27B0', marginBottom: 4 },
  sub:           { color: '#EEE', marginBottom: 12 },
  summary:       { marginBottom: 12 },
  summaryText:   { color: '#9C27B0', fontSize: 16, marginBottom: 2 },
  buttonsRow:    {
                   flexDirection: 'row',
                   justifyContent: 'space-around',
                   marginBottom: 12,
                 },
  header:        {
                   flexDirection: 'row',
                   borderBottomWidth: 1,
                   borderBottomColor: '#9C27B0',
                   paddingBottom: 6,
                 },
  cellHeader:    { flex: 1, fontWeight: '600', color: '#9C27B0' },
  row:           {
                   flexDirection: 'row',
                   paddingVertical: 8,
                   borderBottomWidth: 1,
                   borderBottomColor: '#333',
                 },
  cell:          { flex: 1, color: '#EEE' },
  emptyContainer:{ flex: 1, justifyContent: 'center' },
  emptyText:     { textAlign: 'center', marginTop: 20, color: '#666' },
});
