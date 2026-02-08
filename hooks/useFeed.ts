// Feed hook - manages feed data

import { useState, useEffect } from 'react';
import { feedService } from '@/services/feed.service';
import { FeedPost } from '@/types/feed.types';

export const useFeed = (userId: string) => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const feedPosts = await feedService.getFeed(userId);
      setPosts(feedPosts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feed');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [userId]);

  const refresh = () => loadFeed(true);

  const toggleRoot = async (postId: string, isRooted: boolean) => {
    try {
      if (isRooted) {
        await feedService.unrootPost(postId, userId);
      } else {
        await feedService.rootPost(postId, userId);
      }
      // Update local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, isRooted: !isRooted, rootCount: post.rootCount + (isRooted ? -1 : 1) }
          : post
      ));
    } catch (err) {
      console.error('Toggle root error:', err);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      await feedService.deletePost(postId, userId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Delete post error:', err);
    }
  };

  return { posts, loading, error, refreshing, refresh, toggleRoot, deletePost };
};