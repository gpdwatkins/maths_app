// Multiple choice answer input

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';

interface MultipleChoiceInputProps {
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  disabled?: boolean;
}

export default function MultipleChoiceInput({ 
  options, 
  selectedOption, 
  onSelect,
  disabled = false 
}: MultipleChoiceInputProps) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selectedOption === option && styles.selectedOption,
          ]}
          onPress={() => onSelect(option)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <View style={[
            styles.radio,
            selectedOption === option && styles.selectedRadio,
          ]}>
            {selectedOption === option && <View style={styles.radioDot} />}
          </View>
          <Text style={[
            styles.optionText,
            selectedOption === option && styles.selectedOptionText,
          ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  selectedOption: {
    borderColor: COLORS.primaryDark,
    backgroundColor: COLORS.secondary,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  selectedRadio: {
    borderColor: COLORS.primaryDark,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primaryDark,
  },
  optionText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    flex: 1,
  },
  selectedOptionText: {
    fontFamily: FONTS.semiBold,
  },
});