// UserForm.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { theme } from './theme';
import CustomButton from './components/CustomButton';

export default function UserForm({
  selectedClass, clearSelection, onAdd, onUpdate, onDelete,
}) {
  const db = useSQLiteContext();
  const [name, setName] = useState('');
  const [timesPerWeek, setTimesPerWeek] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const euDateRegex = /^([0-2]\d|3[0-1])-(0\d|1[0-2])-\d{4}$/;

  useEffect(() => {
    if (selectedClass) {
      setName(selectedClass.name);
      setTimesPerWeek(String(selectedClass.times_per_week ?? ''));
      setStartDate(selectedClass.start_date ?? '');
      setEndDate(selectedClass.end_date ?? '');
    } else {
      setName(''); setTimesPerWeek(''); setStartDate(''); setEndDate('');
    }
  }, [selectedClass]);

  const validate = () => {
    if (!name.trim())      { Alert.alert('Error','Name required'); return false; }
    if (isNaN(timesPerWeek)) { Alert.alert('Error','Times/week number'); return false; }
    if (!euDateRegex.test(startDate)) { Alert.alert('Error','Start Date DD-MM-YYYY'); return false; }
    if (!euDateRegex.test(endDate))   { Alert.alert('Error','End Date DD-MM-YYYY');   return false; }
    return true;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    await db.runAsync(
      `INSERT INTO classes (name, times_per_week, start_date, end_date)
       VALUES (?, ?, ?, ?);`,
      [name.trim(), Number(timesPerWeek), startDate, endDate]
    );
    Alert.alert('Added','Class saved');
    onAdd(); clearSelection();
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    await db.runAsync(
      `UPDATE classes
         SET name=?, times_per_week=?, start_date=?, end_date=?
       WHERE id=?;`,
      [name.trim(), Number(timesPerWeek), startDate, endDate, selectedClass.id]
    );
    Alert.alert('Updated','Class updated');
    onUpdate(); clearSelection();
  };

  const handleDelete = async () => {
    await db.runAsync(`DELETE FROM classes WHERE id=?;`, [selectedClass.id]);
    Alert.alert('Deleted','Class removed');
    onDelete(); clearSelection();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Class Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Calculus"
        placeholderTextColor={theme.colors.muted}
        value={name} onChangeText={setName}
      />

      <Text style={styles.label}>Times/week</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 3"
        placeholderTextColor={theme.colors.muted}
        keyboardType="numeric"
        value={timesPerWeek} onChangeText={setTimesPerWeek}
      />

      <Text style={styles.label}>Start Date (DD-MM-YYYY)</Text>
      <TextInput
        style={styles.input}
        placeholder="DD-MM-YYYY"
        placeholderTextColor={theme.colors.muted}
        value={startDate} onChangeText={setStartDate}
      />

      <Text style={styles.label}>End Date (DD-MM-YYYY)</Text>
      <TextInput
        style={styles.input}
        placeholder="DD-MM-YYYY"
        placeholderTextColor={theme.colors.muted}
        value={endDate} onChangeText={setEndDate}
      />

      {!selectedClass ? (
        <CustomButton title="Add Class" onPress={handleAdd} />
      ) : (
        <>
          <CustomButton title="Update Class" onPress={handleUpdate} />
          <CustomButton title="Delete Class" onPress={handleDelete} />
          <CustomButton title="Cancel"       onPress={clearSelection} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing(2),
    marginVertical: theme.spacing(1),
    borderRadius: theme.borderRadius,
    // optional shadow
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  label: {
    color: theme.colors.text,
    marginBottom: theme.spacing(0.5),
    fontWeight: '600',
  },
  input: {
    backgroundColor: theme.colors.inputBg,
    color: theme.colors.text,
    borderRadius: 4,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
  },
});
