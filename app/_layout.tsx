// Root layout with auth provider

import { Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import {
  useFonts,
  InterTight_400Regular,
  InterTight_500Medium,
  InterTight_600SemiBold,
  InterTight_700Bold,
} from '@expo-google-fonts/inter-tight';
import { AuthProvider } from '@/hooks/useAuth';
import { COLORS } from '@/utils/constants';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    InterTight_400Regular,
    InterTight_500Medium,
    InterTight_600SemiBold,
    InterTight_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="puzzle-channel/[id]" />
        <Stack.Screen name="puzzle/[id]" />
        <Stack.Screen name="cluster/[id]" />
        <Stack.Screen name="admin/create-puzzle" />
      </Stack>
    </AuthProvider>
  );
}