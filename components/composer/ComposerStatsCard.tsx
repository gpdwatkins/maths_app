// Composer statistics card for profile page

import { View, Text, StyleSheet } from 'react-native';
import Card from '@/components/ui/Card';
import { ComposerStats, ComposerChannel } from '@/types/composer.types';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';

interface ComposerStatsCardProps {
  stats: ComposerStats;
  channels: ComposerChannel[];
}

export default function ComposerStatsCard({ stats, channels }: ComposerStatsCardProps) {
  const aggregatedStats = [
    { label: 'Total Subscribers', value: stats.totalSubscribers },
    { label: 'Total Puzzles', value: stats.totalPuzzles },
    { label: 'Total Solutions', value: stats.totalSolutions },
    { label: 'Channels', value: stats.channelCount },
  ];

  return (
    <Card>
      <Text style={styles.title}>Composer Stats</Text>

      <View style={styles.grid}>
        {aggregatedStats.map((item, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {channels.length > 0 && (
        <>
          <Text style={styles.channelsTitle}>Your Channels</Text>
          {channels.map((channel) => (
            <View key={channel.id} style={styles.channelItem}>
              <Text style={styles.channelName}>{channel.name}</Text>
              <View style={styles.channelStats}>
                <Text style={styles.channelStat}>
                  {channel.subscriberCount} subscribers
                </Text>
                <Text style={styles.channelStatDivider}>•</Text>
                <Text style={styles.channelStat}>
                  {channel.puzzleCount} puzzles
                </Text>
                <Text style={styles.channelStatDivider}>•</Text>
                <Text style={styles.channelStat}>
                  {channel.solutionCount} solutions
                </Text>
              </View>
            </View>
          ))}
        </>
      )}
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
  channelsTitle: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  channelItem: {
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  channelName: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
  },
  channelStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  channelStat: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  channelStatDivider: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.textLight,
    marginHorizontal: SPACING.xs,
  },
});
