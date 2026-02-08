// Completion post component for feed

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Card from '@/components/ui/Card';
import RootButton from '@/components/RootButton';
import { CompletionPost as CompletionPostType } from '@/types/feed.types';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';
import { formatDate } from '@/utils/helpers';

interface CompletionPostProps {
  post: CompletionPostType;
  onRoot: () => void;
  onDelete?: () => void;
  canRoot: boolean;
}

export default function CompletionPost({ post, onRoot, onDelete, canRoot }: CompletionPostProps) {
  const router = useRouter();

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {post.userProfilePicture && (
            <Image 
              source={{ uri: post.userProfilePicture }} 
              style={styles.avatar}
            />
          )}
          <View>
            <Text style={styles.username}>{post.username}</Text>
            <Text style={styles.subtitle}>
              completed a puzzle · {formatDate(post.completedAt)}
            </Text>
          </View>
        </View>
        {post.canDelete && onDelete && (
          <TouchableOpacity onPress={onDelete}>
            <Text style={styles.deleteButton}>×</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity onPress={() => router.push(`/puzzle/${post.puzzleId}`)}>
        <Text style={styles.puzzleTitle}>{post.puzzleTitle}</Text>
        <Image 
          source={{ uri: post.puzzleImageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
      
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
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  username: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginTop: 2,
  },
  deleteButton: {
    fontSize: 28,
    color: COLORS.textLight,
    padding: SPACING.xs,
  },
  puzzleTitle: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
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