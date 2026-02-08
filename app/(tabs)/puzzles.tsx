// Puzzles tab screen showing subscribed channels

import { View, FlatList, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { usePuzzles } from '@/hooks/usePuzzles';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import WebContentContainer from '@/components/ui/WebContentContainer';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';

export default function PuzzlesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { channels, loading } = usePuzzles(user!.id);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <WebContentContainer>
      <View style={styles.container}>
        <FlatList
          data={channels}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card onPress={() => router.push(`/puzzle-channel/${item.id}`)}>
              <View style={styles.channelCard}>
                {item.imageUrl && (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.channelImage}
                  />
                )}
                <View style={styles.channelInfo}>
                  <Text style={styles.channelName}>{item.name}</Text>
                  <Text style={styles.channelDescription}>{item.description}</Text>
                  <Text style={styles.channelStats}>
                    {item.puzzleCount} puzzles · {item.subscriberCount} subscribers
                  </Text>
                </View>
              </View>
            </Card>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              title="No puzzle channels"
              message="Subscribe to puzzle channels to see them here"
            />
          }
        />
      </View>
    </WebContentContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.md,
  },
  channelCard: {
    flexDirection: 'row',
  },
  channelImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  channelInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  channelName: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  channelDescription: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  channelStats: {
    fontSize: TYPOGRAPHY.tiny,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
});