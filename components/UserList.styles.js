// components/UserList.styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export default StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
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
  statText: {
    color: theme.colors.primary,
    fontSize: 14,
    marginBottom: 6,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
  },
  empty: {
    flex: 1,
    textAlign: 'center',
    color: theme.colors.muted,
    marginTop: theme.spacing(2),
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
});
