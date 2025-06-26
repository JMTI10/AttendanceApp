// components/LoadingOverlay.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function LoadingOverlay({ visible }) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});
