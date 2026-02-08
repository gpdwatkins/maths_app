// Home feed screen

import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useFeed } from '@/hooks/useFeed';
import FeedItem from '@/components/feed/FeedItem';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import WebContentContainer from '@/components/ui/WebContentContainer';
import { COLORS, SPACING } from '@/utils/constants';

export default function HomeScreen() {
  const { user } = useAuth();
  const { posts, loading, refreshing, refresh, toggleRoot, deletePost } = useFeed(user!.id);

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  return (
    <WebContentContainer>
      <View style={styles.container}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FeedItem
              post={item}
              onRoot={() => toggleRoot(item.id, item.isRooted)}
              onDelete={item.canDelete ? () => deletePost(item.id) : undefined}
              canRoot={!user?.isGuest && item.userId !== user?.id}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={COLORS.primaryDark}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No posts yet"
              message="Follow puzzle channels and users to see their posts here"
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
});