// Layout wrapper for sub-pages (pages not in footer navigation)
// Provides consistent header with back button, centered content, and footer navigation

import { View, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import { ReactNode, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import WebHeader from './WebHeader';
import WebContentContainer from './WebContentContainer';
import { COLORS, FONTS, TYPOGRAPHY } from '@/utils/constants';

interface SubPageLayoutProps {
  children: ReactNode;
}

// Base tab configuration for sub-pages
const BASE_TABS = [
  { name: 'index', label: 'Home', icon: 'home', route: '/(tabs)/' },
  { name: 'puzzles', label: 'Puzzles', icon: 'puzzle-piece', route: '/(tabs)/puzzles' },
  { name: 'clusters', label: 'Clusters', icon: 'users', route: '/(tabs)/clusters' },
];

const COMPOSER_TAB = { name: 'composer', label: 'Composer', icon: 'pen-fancy', route: '/(tabs)/composer' };
const PROFILE_TAB = { name: 'profile', label: 'Profile', icon: 'user-alt', route: '/(tabs)/profile' };

export default function SubPageLayout({ children }: SubPageLayoutProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const { user } = useAuth();

  // Build tabs array based on user's composer status
  const tabs = useMemo(() => {
    const result = [...BASE_TABS];
    if (user?.isComposer) {
      result.push(COMPOSER_TAB);
    }
    result.push(PROFILE_TAB);
    return result;
  }, [user?.isComposer]);

  return (
    <View style={styles.container}>
      <WebHeader showBackButton includeSafeArea={!isWeb} />
      <View style={styles.content}>
        {isWeb ? (
          <WebContentContainer>
            {children}
          </WebContentContainer>
        ) : (
          children
        )}
      </View>
      <View style={[styles.tabBar, !isWeb && { paddingBottom: insets.bottom }]}>
        <View style={styles.tabBarInner}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => router.push(tab.route as any)}
            >
              <FontAwesome5 name={tab.icon} size={24} color={COLORS.textLight} />
              <Text style={styles.tabLabel}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
  tabBar: {
    backgroundColor: COLORS.primary,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  tabBarInner: {
    flexDirection: 'row',
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
    height: 64,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: TYPOGRAPHY.tiny,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    marginTop: 2,
    marginBottom: 8,
  },
});
