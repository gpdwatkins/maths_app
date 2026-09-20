// Custom tab bar component for native platforms
// Matches the styling of SubPageLayout's tab bar for consistency

import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { COLORS, FONTS, TYPOGRAPHY } from '@/utils/constants';

const TAB_ICON_SIZE = 24;

// Tab configuration matching SubPageLayout
const TAB_CONFIG: Record<string, { label: string; icon: string }> = {
  index: { label: 'Home', icon: 'home' },
  puzzles: { label: 'Puzzles', icon: 'puzzle-piece' },
  clusters: { label: 'Clusters', icon: 'users' },
  composer: { label: 'Composer', icon: 'pen-fancy' },
  profile: { label: 'Profile', icon: 'user-alt' },
};

export default function NativeTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // Filter out routes that should be hidden
  const visibleRoutes = state.routes.filter((route) => {
    // Hide composer tab if user is not a composer
    if (route.name === 'composer' && !user?.isComposer) {
      return false;
    }
    return true;
  });

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBarInner}>
        {visibleRoutes.map((route) => {
          const config = TAB_CONFIG[route.name] || { label: route.name, icon: 'circle' };
          const originalIndex = state.routes.findIndex(r => r.key === route.key);
          const isFocused = state.index === originalIndex;
          const color = isFocused ? COLORS.accent : COLORS.textLight;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              <FontAwesome5 name={config.icon} size={TAB_ICON_SIZE} color={color} />
              <Text style={[styles.tabLabel, { color }]}>{config.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.primary,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  tabBarInner: {
    flexDirection: 'row',
    width: '100%',
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
    marginTop: 2,
    marginBottom: 8,
  },
});
