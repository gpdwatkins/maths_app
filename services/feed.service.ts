// Feed service - manages feed posts and rooting

import { supabase } from './supabase';
import { FeedPost } from '@/types/feed.types';

export const feedService = {
  // Fetch user's feed
  async getFeed(userId: string, limit: number = 20, offset: number = 0): Promise<FeedPost[]> {
    // TODO: Implement actual query
    // Should fetch:
    // 1. Puzzle posts from subscribed channels
    // 2. Completion posts from followed users
    // Ordered by created_at DESC
    
    // Mock data for now
    return [];
  },

  // Root a post
  async rootPost(postId: string, userId: string): Promise<void> {
    // TODO: Insert into roots table
    // TODO: Trigger notification to post owner
    const { error } = await supabase
      .from('roots')
      .insert({ post_id: postId, user_id: userId });
    
    if (error) throw error;
  },

  // Unroot a post
  async unrootPost(postId: string, userId: string): Promise<void> {
    // TODO: Delete from roots table
    const { error } = await supabase
      .from('roots')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  // Delete completion post
  async deletePost(postId: string, userId: string): Promise<void> {
    // TODO: Verify ownership and delete
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  // Share puzzle completion
  async shareCompletion(puzzleId: string, userId: string): Promise<void> {
    // TODO: Create completion post
    const { error } = await supabase
      .from('posts')
      .insert({
        type: 'completion',
        user_id: userId,
        puzzle_id: puzzleId,
      });
    
    if (error) throw error;
  },
};