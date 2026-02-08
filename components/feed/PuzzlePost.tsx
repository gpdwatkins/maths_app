// Puzzle post component for feed

import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Card from '@/components/ui/Card';
import RootButton from '@/components/RootButton';
import { PuzzlePost as PuzzlePostType } from '@/types/feed.types';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';
import { formatDate } from '@/utils/helpers';

interface PuzzlePostProps {
  post: PuzzlePostType;
  onRoot: () => void;
  canRoot: boolean;
}

export default function PuzzlePost({ post, onRoot, canRoot }: PuzzlePostProps) {
  const router = useRouter();

  return (
    <Card onPress={() => router.push(`/puzzle/${post.puzzleId}`)}>
      <View style={styles.header}>
        <View style={styles.channelInfo}>
          <Text style={styles.channelName}>{post.channelName}</Text>
          <Text style={styles.date}>{formatDate(post.publishDate)}</Text>
        </View>
      </View>
      
      <Image 
        source={{ uri: post.puzzleImageUrl }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.footer}>
        <RootButton
          isRooted={post.isRooted}
          rootCount={post.rootCount}
          onPress={onRoot}
          disabled={!canRoot}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  date: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginTop: 2,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
});