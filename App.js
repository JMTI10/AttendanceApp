import React from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from './theme';
import HomeScreen from './screens/HomeScreen';
import ClassDetailsScreen from './screens/ClassDetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SQLiteProvider
      databaseName="classDatabase.db"
      onInit={async (db) => {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            times_per_week INTEGER,
            start_date TEXT,
            end_date TEXT
          );
        `);
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL
          );
        `);
        await db.execAsync('PRAGMA journal_mode=WAL;');
      }}
      options={{ useNewConnection: false }}
    >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.background, elevation:0, shadowOpacity:0 },
            headerTintColor: theme.colors.text,
            headerTitleStyle: { fontWeight:'600' },
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen name="Home"    component={HomeScreen}        options={{ title:'Your Classes' }} />
          <Stack.Screen
            name="Details"
            component={ClassDetailsScreen}
            options={({ route }) => ({ title: route.params.className })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}
