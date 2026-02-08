// 404 Not Found screen

import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/ui/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '@/utils/constants';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.message}>Page not found</Text>
      <Button title="Go Home" onPress={() => router.replace('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.h1 * 2,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: TYPOGRAPHY.h3,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
  },
});