// Composer channel detail page

import { View, FlatList, StyleSheet, Text, Alert } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useComposerChannel } from '@/hooks/useComposer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import SubPageLayout from '@/components/ui/SubPageLayout';
import { PostPuzzleDialog } from '@/components/composer';
import { CreateComposerPuzzleData } from '@/types/composer.types';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';
import { formatRelativeDate } from '@/utils/helpers';

export default function ComposerChannelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { channel, puzzles, loading, createPuzzle } = useComposerChannel(id);
  const [showPostDialog, setShowPostDialog] = useState(false);

  const handlePostPuzzle = async (data: CreateComposerPuzzleData) => {
    try {
      await createPuzzle(data);
      Alert.alert('Success', 'Puzzle posted successfully');
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <SubPageLayout>
        <LoadingSpinner />
      </SubPageLayout>
    );
  }

  if (!channel) {
    return (
      <SubPageLayout>
        <EmptyState title="Channel not found" message="This channel doesn't exist" />
      </SubPageLayout>
    );
  }

  return (
    <SubPageLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.channelInfo}>
            <Text style={styles.channelName}>{channel.name}</Text>
            <Text style={styles.channelDescription}>{channel.description}</Text>
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
          <Button
            title="Post a Puzzle"
            onPress={() => setShowPostDialog(true)}
            variant="secondary"
          />
        </View>

        <FlatList
          data={puzzles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.puzzleHeader}>
                <Text style={styles.puzzleTitle}>{item.title}</Text>
                {!item.isPublished && (
                  <View style={styles.scheduledBadge}>
                    <Text style={styles.scheduledBadgeText}>Scheduled</Text>
                  </View>
                )}
              </View>
              <Text style={styles.puzzleDate}>
                {item.isPublished
                  ? `Published ${formatRelativeDate(item.publishDate)}`
                  : `Scheduled for ${new Date(item.publishDate).toLocaleDateString()}`}
              </Text>
              <View style={styles.puzzleMeta}>
                <Text style={styles.puzzleAnswerType}>
                  {item.answerType === 'mcq' ? 'Multiple Choice' : 'Numerical'}
                </Text>
                <Text style={styles.puzzleStatDivider}>•</Text>
                <Text style={styles.puzzleSolutions}>
                  {item.solutionCount} solutions
                </Text>
              </View>
            </Card>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              title="No puzzles yet"
              message="Post your first puzzle to get started"
            />
          }
        />

        <PostPuzzleDialog
          visible={showPostDialog}
          channelId={channel.id}
          channelName={channel.name}
          onClose={() => setShowPostDialog(false)}
          onSubmit={handlePostPuzzle}
        />
      </View>
    </SubPageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  channelInfo: {
    marginBottom: SPACING.md,
  },
  channelName: {
    fontSize: TYPOGRAPHY.h2,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  channelDescription: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  channelStats: {
    flexDirection: 'row',
    alignItems: 'center',
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
  list: {
    padding: SPACING.md,
  },
  puzzleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  puzzleTitle: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    flex: 1,
  },
  scheduledBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
    marginLeft: SPACING.sm,
  },
  scheduledBadgeText: {
    fontSize: TYPOGRAPHY.tiny,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
  },
  puzzleDate: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  puzzleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puzzleAnswerType: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.semiBold,
    color: COLORS.primaryDark,
  },
  puzzleStatDivider: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.textLight,
    marginHorizontal: SPACING.xs,
  },
  puzzleSolutions: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
});
