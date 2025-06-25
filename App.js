import React from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from './theme';
import HomeScreen from './HomeScreen';
import ClassDetailsScreen from './ClassDetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SQLiteProvider
      databaseName="classDatabase.db"
      onInit={async (db) => {
        // Create or update classes table
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            times_per_week INTEGER,
            start_date TEXT,
            end_date TEXT
          );
        `);
        // Create attendance table
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL
          );
        `);
        // Enable write-ahead logging
        await db.execAsync('PRAGMA journal_mode=WAL;');
      }}
      options={{ useNewConnection: false }}
    >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.background,
              elevation: 0,      // Android shadow off
              shadowOpacity: 0,  // iOS shadow off
            },
            headerTintColor: theme.colors.text,
            headerTitleStyle: { fontWeight: '600' },
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Your Classes' }}
          />
          <Stack.Screen
            name="Details"
            component={ClassDetailsScreen}
            options={({ route }) => ({
              title: route.params.className,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}
