// Custom tab bar component with centered content on web

import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { COLORS, FONTS, TYPOGRAPHY } from '@/utils/constants';

const MAX_TABBAR_WIDTH = 900;

export default function WebTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

          const isFocused = state.index === index;

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

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const color = isFocused ? COLORS.accent : COLORS.textLight;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              {options.tabBarIcon && options.tabBarIcon({ focused: isFocused, color, size: 24 })}
              <Text style={[styles.label, { color }]}>
                {typeof label === 'string' ? label : route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    borderTopWidth: Platform.OS === 'web' ? 1 : 0,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  innerContainer: {
    flexDirection: 'row',
    maxWidth: Platform.OS === 'web' ? MAX_TABBAR_WIDTH : undefined,
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
  label: {
    fontSize: TYPOGRAPHY.tiny,
    fontFamily: FONTS.medium,
    marginTop: 2,
    marginBottom: 8,
  },
});
