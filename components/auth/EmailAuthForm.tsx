// Email authentication form

import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { validateEmail } from '@/utils/helpers';
import { SPACING, COLORS, TYPOGRAPHY, FONTS } from '@/utils/constants';

interface EmailAuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (email: string, password: string, username?: string) => Promise<void>;
}

export default function EmailAuthForm({ mode, onSubmit }: EmailAuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (mode === 'register' && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'register' && !username) {
      newErrors.username = 'Username is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(email, password, username);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Authentication failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {mode === 'register' && (
        <Input
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          error={errors.username}
          autoCapitalize="none"
        />
      )}
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        error={errors.email}
        autoCapitalize="none"
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        error={errors.password}
        onSubmitEditing={handleSubmit}
        returnKeyType="go"
      />
      {errors.submit && <Text style={styles.submitError}>{errors.submit}</Text>}
      <Button
        title={mode === 'login' ? 'Sign In' : 'Create Account'}
        onPress={handleSubmit}
        loading={loading}
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
  },
  submitError: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
});