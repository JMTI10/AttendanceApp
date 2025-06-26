import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';         // ← import icon
import { useSQLiteContext } from 'expo-sqlite';
import { theme } from '../theme';
import CustomButton from './CustomButton';
import styles from './UserList.styles';

// parse DD-MM-YYYY → Date
function parseEU(str) {
  const [dd, mm, yyyy] = str.split('-').map(Number);
  return new Date(yyyy, mm - 1, dd);
}

export default function UserList({
  onEdit,
  refreshFlag,
  navigation,
  setLoading,
}) {
  const db = useSQLiteContext();
  const [classes, setClasses] = useState([]);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const rows = await db.getAllAsync(
        `SELECT id,name,times_per_week,start_date,end_date
           FROM classes ORDER BY id DESC;`
      );
      const withStats = await Promise.all(
        rows.map(async (cls) => {
          const att = await db.getAllAsync(
            `SELECT COUNT(*) AS cnt FROM attendance
               WHERE class_id = ? AND status = 'Attended';`,
            [cls.id]
          );
          const miss = await db.getAllAsync(
            `SELECT COUNT(*) AS cnt FROM attendance
               WHERE class_id = ? AND status = 'Missed';`,
            [cls.id]
          );
          return {
            ...cls,
            attendedCount: att[0]?.cnt || 0,
            missedCount:   miss[0]?.cnt || 0,
          };
        })
      );
      setClasses(withStats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, [refreshFlag]);

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
            setLoading(true);
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
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={loadClasses}
          colors={[theme.colors.primary]}
        />
      }
      contentContainerStyle={
        classes.length === 0 && styles.emptyContainer
      }
      ListEmptyComponent={
        <Text style={styles.empty}>No classes yet.</Text>
      }
      renderItem={({ item }) => {
        // total sessions logic…
        const start = parseEU(item.start_date);
        const end   = parseEU(item.end_date);
        const days  = Math.floor((end - start)/(1000*60*60*24)) + 1;
        const total = Math.ceil((days/7)*item.times_per_week);
        const target= Math.ceil(total/2);
        const need  = Math.max(0, target - item.attendedCount);

        return (
          <TouchableOpacity
            activeOpacity={0.7}
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
            <View style={styles.card}>
              {/* header row: title + chevron */}
              <View style={styles.titleRow}>
                <Text style={styles.name}>{item.name}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={theme.colors.primary}
                />
              </View>

              <Text style={styles.sub}>
                {item.times_per_week}×/week • {item.start_date} → {item.end_date}
              </Text>

              <Text style={styles.statText}>Attended: {item.attendedCount}</Text>
              <Text style={styles.statText}>Missing:  {item.missedCount}</Text>
              <Text style={styles.statText}>
                Need {need} more to reach 50% of {total} sessions
              </Text>

              <View style={styles.buttonsRow}>
                <CustomButton title="Edit" onPress={() => onEdit(item)} />
                <CustomButton
                  title="Delete"
                  onPress={() => confirmDelete(item.id)}
                />
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}
