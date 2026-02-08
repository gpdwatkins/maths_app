// Loading spinner component

import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '@/utils/constants';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
}

export default function LoadingSpinner({ size = 'large' }: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={COLORS.primaryDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});