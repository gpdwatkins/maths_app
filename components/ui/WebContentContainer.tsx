// Container that centers content with max-width on web only

import { View, StyleSheet, Platform } from 'react-native';
import { ReactNode } from 'react';
import { COLORS, SPACING } from '@/utils/constants';

interface WebContentContainerProps {
  children: ReactNode;
}

const MAX_CONTENT_WIDTH = 600;

export default function WebContentContainer({ children }: WebContentContainerProps) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F4F2EE',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
});
