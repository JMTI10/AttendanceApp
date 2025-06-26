import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import UserForm from '../components/UserForm';
import UserList from '../components/UserList';
import LoadingOverlay from '../components/LoadingOverlay';
import { theme } from '../theme';

export default function HomeScreen({ navigation }) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [refreshFlag, setRefreshFlag]     = useState(0);
  const [loading, setLoading]             = useState(false);
  const reload = () => setRefreshFlag((f) => f + 1);

  return (
    <LinearGradient
      colors={['#000000','#3A0052']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <LoadingOverlay visible={loading} />

        <UserForm
          selectedClass={selectedClass}
          clearSelection={() => setSelectedClass(null)}
          onAdd={reload}
          onUpdate={reload}
          onDelete={reload}
        />

        <UserList
          onEdit={setSelectedClass}
          refreshFlag={refreshFlag}
          navigation={navigation}
          setLoading={setLoading}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container:{ flex: 1, padding: theme.spacing(1) },
});
