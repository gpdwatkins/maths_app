// Puzzle channel detail screen showing all puzzles

import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useChannelPuzzles } from '@/hooks/usePuzzles';
import PuzzleCard from '@/components/puzzle/PuzzleCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import SubPageLayout from '@/components/ui/SubPageLayout';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';

export default function PuzzleChannelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { puzzles, channel, loading } = useChannelPuzzles(id, user!.id);

  if (loading) {
    return (
      <SubPageLayout>
        <LoadingSpinner />
      </SubPageLayout>
    );
  }

  return (
    <SubPageLayout>
      <View style={styles.container}>
        {channel && (
          <View style={styles.header}>
            <Text style={styles.channelName}>{channel.name}</Text>
            {channel.description && (
              <Text style={styles.description}>{channel.description}</Text>
            )}
          </View>
        )}
        <FlatList
          data={puzzles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PuzzleCard
              puzzle={item}
              onPress={() => router.push(`/puzzle/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              title="No puzzles yet"
              message="Check back later for new puzzles"
            />
          }
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
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  channelName: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  list: {
    padding: SPACING.md,
  },
});