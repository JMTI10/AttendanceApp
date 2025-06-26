import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export default StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    borderRadius: theme.borderRadius,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  container: {
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing(1.5),
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.background,
    color: theme.colors.primary,
    borderRadius: 25,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1),
    fontSize: 16,
    marginBottom: theme.spacing(1.5),
  },
  deleteButton: {
    borderColor: '#ff3b30',
  },
});
