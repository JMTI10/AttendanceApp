// HomeScreen.js
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { theme } from './theme';
import UserForm from './UserForm';
import UserList from './UserList';

export default function HomeScreen({ navigation }) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const reload = () => setRefreshFlag(f => f + 1);

  return (
    <SafeAreaView style={styles.container}>
      <UserForm
        selectedClass={selectedClass}
        clearSelection={() => setSelectedClass(null)}
        onAdd={reload}
        onUpdate={reload}
        onDelete={reload}
      />
      <UserList
        onEdit={cls => setSelectedClass(cls)}
        refreshFlag={refreshFlag}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing(1),
  },
});
