import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function CustomButton({ title, onPress, disabled, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled, style]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing(1),
    paddingHorizontal: theme.spacing(2),
    borderRadius: theme.borderRadius,
    alignItems: 'center',
    marginVertical: theme.spacing(0.5),
  },
  text: {
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  disabled: {
    backgroundColor: theme.colors.muted,
  },
});
