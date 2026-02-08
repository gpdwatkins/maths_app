// Numerical answer input

import { View, StyleSheet } from 'react-native';
import Input from '@/components/ui/Input';

interface NumericalInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function NumericalInput({ value, onChange, disabled = false }: NumericalInputProps) {
  return (
    <View style={styles.container}>
      <Input
        value={value}
        onChangeText={onChange}
        placeholder="Enter your answer"
        keyboardType="numeric"
        label="Your Answer"
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});