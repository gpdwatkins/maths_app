// Login screen

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import EmailAuthForm from '@/components/auth/EmailAuthForm';
import OAuthButtons from '@/components/auth/OAuthButtons';
import Button from '@/components/ui/Button';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';
import { authService } from '@/services/auth.service';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, continueAsGuest } = useAuth();

  const handleEmailLogin = async (email: string, password: string) => {
    await signIn(email, password);
  };

  const handleOAuthGoogle = async () => {
    await authService.signInWithOAuth('google');
  };

  const handleOAuthApple = async () => {
    await authService.signInWithOAuth('apple');
  };

  const handleGuest = async () => {
    await continueAsGuest();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <EmailAuthForm mode="login" onSubmit={handleEmailLogin} />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <OAuthButtons 
          onGooglePress={handleOAuthGoogle}
          onApplePress={handleOAuthApple}
        />

        <Button
          title="Continue as Guest"
          onPress={handleGuest}
          variant="secondary"
          fullWidth
        />

        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.link}>
            Don't have an account? <Text style={styles.linkBold}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.h1,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    paddingHorizontal: SPACING.md,
  },
  link: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginTop: SPACING.lg,
  },
  linkBold: {
    fontFamily: FONTS.bold,
    color: COLORS.primaryDark,
  },
});