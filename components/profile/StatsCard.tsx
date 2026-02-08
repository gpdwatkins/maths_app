// Profile statistics card

import { View, Text, StyleSheet } from 'react-native';
import Card from '@/components/ui/Card';
import { ProfileStats } from '@/types/profile.types';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';

interface StatsCardProps {
  stats: ProfileStats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  const statItems = [
    { label: 'Puzzles Solved', value: stats.puzzlesSolved },
    { label: 'Channels Subscribed', value: stats.channelsSubscribed },
    { label: 'Completions Shared', value: stats.completionsShared },
    { label: 'Roots Received', value: stats.rootsReceived },
    { label: 'Current Streak', value: stats.currentStreak },
    { label: 'Followers', value: stats.followers },
  ];

  return (
    <Card>
      <Text style={styles.title}>Statistics</Text>
      <View style={styles.grid}>
        {statItems.map((item, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.sm,
  },
  statItem: {
    width: '50%',
    padding: SPACING.sm,
    alignItems: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.h2,
    fontFamily: FONTS.bold,
    color: COLORS.primaryDark,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});