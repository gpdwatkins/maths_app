// Tab layout with bottom navigation

import { Tabs, Redirect } from 'expo-router';
import { Platform, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import WebHeader from '@/components/ui/WebHeader';
import WebTabBar from '@/components/ui/WebTabBar';
import { supabase } from '@/services/supabase';
import { COLORS, FONTS } from '@/utils/constants';

// Get the public URL for the logo from Supabase storage
const getLogoUrl = () => {
  const { data } = supabase.storage.from('branding').getPublicUrl('logos/top_banner_logo_light.png');
  return data.publicUrl;
};

// Header logo component for native platforms (approximately 2/3 of header height)
function HeaderLogo() {
  const logoUrl = getLogoUrl();
  return (
    <Image
      source={{ uri: logoUrl }}
      style={{ height: 54, width: 216 }}
      resizeMode="contain"
    />
  );
}

const isWeb = Platform.OS === 'web';

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
      tabBar={isWeb ? (props) => <WebTabBar {...props} /> : undefined}
      screenOptions={{
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarLabelPosition: 'below-icon',
        tabBarIconStyle: {
          marginBottom: -4,
        },
        tabBarLabelStyle: {
          marginBottom: 8,
          fontFamily: FONTS.medium,
        },
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: 8,
          height: 64,
        },
        header: isWeb ? () => <WebHeader /> : undefined,
        headerTitle: () => <HeaderLogo />,
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontFamily: FONTS.bold,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="puzzles"
        options={{
          title: 'Puzzles',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="puzzle-piece" size={size} color={color} />
          ),
          tabBarLabel: 'Puzzles',
        }}
      />
      <Tabs.Screen
        name="clusters"
        options={{
          title: 'Clusters',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="users" size={size} color={color} />
          ),
          tabBarLabel: 'Clusters',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-alt" size={size} color={color} />
          ),
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}