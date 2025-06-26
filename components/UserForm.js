import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Text,
  Alert,
  View,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import styles from './UserForm.styles';
import { theme } from '../theme';
import CustomButton from './CustomButton';

export default function UserForm({
  selectedClass,
  clearSelection,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const db = useSQLiteContext();
  const [name, setName] = useState('');
  const [timesPerWeek, setTimesPerWeek] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // when you switch into “edit” mode, prefill; otherwise clear
  useEffect(() => {
    if (selectedClass) {
      setName(selectedClass.name);
      setTimesPerWeek(String(selectedClass.times_per_week ?? ''));
      setStartDate(selectedClass.start_date ?? '');
      setEndDate(selectedClass.end_date ?? '');
    } else {
      clearAll();
    }
  }, [selectedClass]);

  const clearAll = () => {
    setName('');
    setTimesPerWeek('');
    setStartDate('');
    setEndDate('');
  };

  const euDateRegex = /^([0-2]\d|3[0-1])-(0\d|1[0-2])-\d{4}$/;
  const validate = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Class name required');
      return false;
    }
    if (!timesPerWeek || isNaN(timesPerWeek)) {
      Alert.alert('Error', 'Times/week must be a number');
      return false;
    }
    if (!euDateRegex.test(startDate) || !euDateRegex.test(endDate)) {
      Alert.alert('Error', 'Dates must be DD-MM-YYYY');
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    try {
      await db.runAsync(
        `INSERT INTO classes (name, times_per_week, start_date, end_date)
           VALUES (?, ?, ?, ?);`,
        [name.trim(), +timesPerWeek, startDate, endDate]
      );
      Alert.alert('Success', 'Class added');
      clearAll();
      onAdd();             // bump HomeScreen’s refreshFlag
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not save class');
    }
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    try {
      await db.runAsync(
        `UPDATE classes
           SET name = ?, times_per_week = ?, start_date = ?, end_date = ?
         WHERE id = ?;`,
        [name.trim(), +timesPerWeek, startDate, endDate, selectedClass.id]
      );
      Alert.alert('Success','Class updated');
      clearSelection();
      clearAll();
      onUpdate();
    } catch (e) {
      console.error(e);
      Alert.alert('Error','Could not update class');
    }
  };

  const handleDelete = async () => {
    try {
      await db.runAsync(
        `DELETE FROM classes WHERE id = ?;`,
        [selectedClass.id]
      );
      Alert.alert('Deleted','Class removed');
      clearSelection(); clearAll(); onDelete();
    } catch (e) {
      console.error(e);
      Alert.alert('Error','Could not delete class');
    }
  };

  return (
    <View style={styles.card}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={styles.title}>
          {selectedClass ? 'Edit Class' : 'Create Class'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Class Name"
          placeholderTextColor={theme.colors.primary}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Times per week"
          placeholderTextColor={theme.colors.primary}
          keyboardType="numeric"
          value={timesPerWeek}
          onChangeText={setTimesPerWeek}
        />
        <TextInput
          style={styles.input}
          placeholder="Start Date (DD-MM-YYYY)"
          placeholderTextColor={theme.colors.primary}
          value={startDate}
          onChangeText={setStartDate}
        />
        <TextInput
          style={styles.input}
          placeholder="End Date (DD-MM-YYYY)"
          placeholderTextColor={theme.colors.primary}
          value={endDate}
          onChangeText={setEndDate}
        />

        {!selectedClass ? (
          <CustomButton title="Add Class" onPress={handleAdd} />
        ) : (
          <>
            <CustomButton title="Update Class" onPress={handleUpdate} />
            <CustomButton
              title="Delete Class"
              onPress={handleDelete}
              style={styles.deleteButton}
            />
            <CustomButton
              title="Cancel"
              onPress={() => { clearSelection(); clearAll(); }}
            />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
