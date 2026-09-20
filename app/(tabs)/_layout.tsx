// Tab layout with bottom navigation

import { Tabs, Redirect } from 'expo-router';
import { Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import WebHeader from '@/components/ui/WebHeader';
import WebTabBar from '@/components/ui/WebTabBar';
import NativeTabBar from '@/components/ui/NativeTabBar';
import { COLORS } from '@/utils/constants';

const isWeb = Platform.OS === 'web';

// Fixed icon size for tab bar (consistent with SubPageLayout)
const TAB_ICON_SIZE = 24;

export default function TabsLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      tabBar={(props) => isWeb ? <WebTabBar {...props} /> : <NativeTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textLight,
        header: () => <WebHeader includeSafeArea />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={TAB_ICON_SIZE} color={color} />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="puzzles"
        options={{
          title: 'Puzzles',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="puzzle-piece" size={TAB_ICON_SIZE} color={color} />
          ),
          tabBarLabel: 'Puzzles',
        }}
      />
      <Tabs.Screen
        name="clusters"
        options={{
          title: 'Clusters',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="users" size={TAB_ICON_SIZE} color={color} />
          ),
          tabBarLabel: 'Clusters',
        }}
      />
      <Tabs.Screen
        name="composer"
        options={{
          title: 'Composer',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="pen-fancy" size={TAB_ICON_SIZE} color={color} />
          ),
          tabBarLabel: 'Composer',
          // Hide tab if user is not a composer
          href: user?.isComposer ? '/(tabs)/composer' : null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-alt" size={TAB_ICON_SIZE} color={color} />
          ),
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}

