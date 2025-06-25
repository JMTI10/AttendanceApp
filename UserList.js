import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { theme } from './theme';
import CustomButton from './components/CustomButton';

export default function UserList({ onEdit, refreshFlag, navigation }) {
  const db = useSQLiteContext();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadClasses = async () => {
    setLoading(true);
    const rows = await db.getAllAsync(
      `SELECT id, name, times_per_week, start_date, end_date
         FROM classes
      ORDER BY id DESC;`
    );
    setClasses(rows);
    setLoading(false);
  };

  useEffect(() => {
    loadClasses();
  }, [refreshFlag]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  const confirmDelete = (id) => {
    Alert.alert(
      'Delete Class?',
      'This will remove the class and all its records.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await db.runAsync(`DELETE FROM classes WHERE id = ?;`, [id]);
            loadClasses();
          },
        },
      ]
    );
  };

  return (
    <FlatList
      data={classes}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No classes yet.</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Details', {
                classId: item.id,
                className: item.name,
                timesPerWeek: item.times_per_week,
                startDate: item.start_date,
                endDate: item.end_date,
              })
            }
          >
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
          <Text style={styles.sub}>
            {item.times_per_week}×/week • {item.start_date} → {item.end_date}
          </Text>
          <View style={styles.buttonsRow}>
            <CustomButton title="Edit" onPress={() => onEdit(item)} />
            <CustomButton
              title="Delete"
              onPress={() => confirmDelete(item.id)}
            />
          </View>
        </View>
      )}
      contentContainerStyle={
        classes.length === 0 && { flex: 1, justifyContent: 'center' }
      }
    />
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: theme.colors.card,
    margin: theme.spacing(1),
    padding: theme.spacing(1.5),
    borderRadius: theme.borderRadius,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  name: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '500',
  },
  sub: {
    color: theme.colors.muted,
    marginBottom: theme.spacing(1),
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.muted,
  },
});
