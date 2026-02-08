// OAuth authentication buttons

import { View, StyleSheet } from 'react-native';
import Button from '@/components/ui/Button';
import { SPACING } from '@/utils/constants';

interface OAuthButtonsProps {
  onGooglePress: () => void;
  onApplePress: () => void;
}

export default function OAuthButtons({ onGooglePress, onApplePress }: OAuthButtonsProps) {
  return (
    <View style={styles.container}>
      <Button
        title="Continue with Google"
        onPress={onGooglePress}
        variant="outline"
        fullWidth
      />
      <Button
        title="Continue with Apple"
        onPress={onApplePress}
        variant="outline"
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
});