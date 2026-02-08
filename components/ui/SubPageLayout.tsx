// Layout wrapper for sub-pages (pages not in footer navigation)
// Provides consistent header with back button, centered content, and footer navigation

import { View, StyleSheet, Platform } from 'react-native';
import { ReactNode } from 'react';
import WebHeader from './WebHeader';
import WebTabBar from './WebTabBar';
import WebContentContainer from './WebContentContainer';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@/utils/constants';

interface SubPageLayoutProps {
  children: ReactNode;
}

export default function SubPageLayout({ children }: SubPageLayoutProps) {
  const navigation = useNavigation();

  // Get tab bar props for WebTabBar
  const state = navigation.getState();
  const parentState = navigation.getParent()?.getState();

  if (Platform.OS !== 'web') {
    // On native, just render children - native navigation handles the rest
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <WebHeader showBackButton />
      <View style={styles.content}>
        <WebContentContainer>
          {children}
        </WebContentContainer>
      </View>
      {parentState && (
        <WebTabBar
          state={parentState as any}
          descriptors={{} as any}
          navigation={navigation.getParent() as any}
          insets={{ top: 0, bottom: 0, left: 0, right: 0 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
});
