// Root button component with square root icon

import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONTS } from '@/utils/constants';

interface RootButtonProps {
  isRooted: boolean;
  rootCount: number;
  onPress: () => void;
  disabled?: boolean;
}

export default function RootButton({ isRooted, rootCount, onPress, disabled }: RootButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, isRooted && styles.rooted]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.icon, isRooted && styles.rootedIcon]}>√</Text>
      {rootCount > 0 && (
        <Text style={[styles.count, isRooted && styles.rootedCount]}>{rootCount}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  rooted: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  icon: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  rootedIcon: {
    color: COLORS.white,
  },
  count: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  rootedCount: {
    color: COLORS.white,
  },
});