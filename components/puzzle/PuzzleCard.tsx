// Puzzle card for channel list

import { View, Text, Image, StyleSheet } from 'react-native';
import Card from '@/components/ui/Card';
import { Puzzle } from '@/types/puzzle.types';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';
import { formatDate } from '@/utils/helpers';

interface PuzzleCardProps {
  puzzle: Puzzle;
  onPress: () => void;
}

export default function PuzzleCard({ puzzle, onPress }: PuzzleCardProps) {
  return (
    <Card onPress={onPress}>
      <View style={styles.container}>
        <Image 
          source={{ uri: puzzle.imageUrl }} 
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.title}>{puzzle.title}</Text>
          <Text style={styles.date}>{formatDate(puzzle.publishDate)}</Text>
          <View style={styles.badges}>
            {puzzle.isSolved && (
              <View style={[styles.badge, styles.solvedBadge]}>
                <Text style={styles.badgeText}>✓ Solved</Text>
              </View>
            )}
            {puzzle.isShared && (
              <View style={[styles.badge, styles.sharedBadge]}>
                <Text style={styles.badgeText}>Shared</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  date: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  badges: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  solvedBadge: {
    backgroundColor: COLORS.success,
  },
  sharedBadge: {
    backgroundColor: COLORS.primary,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.tiny,
    fontFamily: FONTS.semiBold,
    color: COLORS.white,
  },
});