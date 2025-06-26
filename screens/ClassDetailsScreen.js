// screens/ClassDetailsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { theme } from '../theme';
import LoadingOverlay from '../components/LoadingOverlay';
import CustomButton from '../components/CustomButton';

export default function ClassDetailsScreen({ route }) {
  const { classId, className, timesPerWeek, startDate, endDate } = route.params;
  const db = useSQLiteContext();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatToday = () => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
  };

  const loadRecords = async () => {
    setLoading(true);
    try {
      const rows = await db.getAllAsync(
        `SELECT id, date, status FROM attendance WHERE class_id = ? ORDER BY id ASC;`,
        [classId]
      );
      setRecords(rows);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async status => {
    setLoading(true);
    try {
      await db.runAsync(
        `INSERT INTO attendance (class_id, date, status) VALUES (?,?,?);`,
        [classId, formatToday(), status]
      );
      await loadRecords();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to add record');
      setLoading(false);
    }
  };

  const updateRecord = async (id, status) => {
    setLoading(true);
    try {
      await db.runAsync(
        `UPDATE attendance SET status = ? WHERE id = ?;`,
        [status, id]
      );
      await loadRecords();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to update record');
      setLoading(false);
    }
  };

  const deleteRecord = async id => {
    setLoading(true);
    try {
      await db.runAsync(`DELETE FROM attendance WHERE id = ?;`, [id]);
      await loadRecords();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to delete record');
      setLoading(false);
    }
  };

  const onPressRecord = item => {
    Alert.alert(
      `Record: ${item.date}`,
      `Current status: ${item.status}`,
      [
        { text: 'Attended', onPress: () => updateRecord(item.id, 'Attended') },
        { text: 'Missed',   onPress: () => updateRecord(item.id, 'Missed') },
        { text: 'Canceled', onPress: () => updateRecord(item.id, 'Canceled') },
        { text: 'Delete',   style: 'destructive', onPress: () => deleteRecord(item.id) },
        { text: 'Cancel',   style: 'cancel' },
      ]
    );
  };

  useEffect(() => { loadRecords(); }, []);

  // compute summary
  const attendedCount = records.filter(r => r.status === 'Attended').length;
  const missedCount   = records.filter(r => r.status === 'Missed').length;
  const canceledCount = records.filter(r => r.status === 'Canceled').length;
  const validCount    = attendedCount + missedCount;
  const attendancePct = validCount ? Math.round(attendedCount / validCount * 100) : 0;

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} />

      <Text style={styles.title}>{className}</Text>
      <Text style={styles.sub}>
        📆 {timesPerWeek}×/week • {startDate} → {endDate}
      </Text>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Attended: {attendedCount}</Text>
        <Text style={styles.summaryText}>Missed:   {missedCount}</Text>
        <Text style={styles.summaryText}>Canceled: {canceledCount}</Text>
        <Text style={styles.summaryText}>Attendance: {attendancePct}%</Text>
      </View>

      {/* Action buttons */}
      <View style={styles.buttonsRow}>
        <CustomButton title="Attended" onPress={() => addRecord('Attended')} />
        <CustomButton title="Missed"   onPress={() => addRecord('Missed')}   />
        <CustomButton title="Canceled" onPress={() => addRecord('Canceled')} />
      </View>

      {/* Undo last as a button too */}
      <View style={styles.undoRow}>
        <CustomButton
          title="Undo Last"
          onPress={() => deleteRecord(records.slice(-1)[0]?.id)}
          style={styles.undoButton}
        />
      </View>

      {/* Records list */}
      <View style={styles.header}>
        <Text style={styles.cellHeader}>Date</Text>
        <Text style={styles.cellHeader}>Status</Text>
      </View>
      <FlatList
        data={records}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPressRecord(item)}>
            <View style={styles.row}>
              <Text style={styles.cell}>{item.date}</Text>
              <Text style={styles.cell}>{item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No attendance records</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: theme.colors.background, padding: 10 },
  title:       { fontSize: 20, fontWeight: '600', color: theme.colors.primary, marginBottom: 4 },
  sub:         { color: '#eee', marginBottom: 12 },
  summary:     { marginBottom: 12 },
  summaryText: { color: theme.colors.primary, fontSize: 16, marginBottom: 2 },
  buttonsRow:  {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  undoRow:     {
    alignItems: 'center',
    marginBottom: 12,
  },
  undoButton:  {
    width: 140,
  },
  header:      {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    paddingBottom: 6,
  },
  cellHeader:  { flex: 1, fontWeight: 'bold', color: theme.colors.primary },
  row:         { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#333' },
  cell:        { flex: 1, color: '#fff' },
  empty:       { textAlign: 'center', color: '#888', marginTop: 20 },
});
