// Register screen

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import EmailAuthForm from '@/components/auth/EmailAuthForm';
import OAuthButtons from '@/components/auth/OAuthButtons';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';
import { authService } from '@/services/auth.service';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const handleEmailRegister = async (email: string, password: string, username?: string) => {
    await signUp(email, password, username!);
  };

  const handleOAuthGoogle = async () => {
    await authService.signInWithOAuth('google');
  };

  const handleOAuthApple = async () => {
    await authService.signInWithOAuth('apple');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the puzzle community</Text>

        <EmailAuthForm mode="register" onSubmit={handleEmailRegister} />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <OAuthButtons 
          onGooglePress={handleOAuthGoogle}
          onApplePress={handleOAuthApple}
        />

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.link}>
            Already have an account? <Text style={styles.linkBold}>Sign in</Text>
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