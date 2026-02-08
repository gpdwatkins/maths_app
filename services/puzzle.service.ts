// Puzzle service - manages puzzles, channels, and submissions

import { supabase } from './supabase';
import { Puzzle, PuzzleChannel, PuzzleSubmission, CreatePuzzleData } from '@/types/puzzle.types';

export const puzzleService = {
  // Get user's subscribed channels
  async getSubscribedChannels(userId: string): Promise<PuzzleChannel[]> {
    // TODO: Fetch from subscriptions join with channels
    // Mock data
    return [];
  },

  // Get channel details
  async getChannel(channelId: string): Promise<PuzzleChannel> {
    const { data: channel, error } = await supabase
      .from('puzzle_channels')
      .select('id, name, description, image_url, created_at')
      .eq('id', channelId)
      .single();

    if (error || !channel) throw new Error('Channel not found');

    // Get subscriber and puzzle counts
    const [{ count: subscriberCount }, { count: puzzleCount }] = await Promise.all([
      supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('channel_id', channelId),
      supabase
        .from('puzzles')
        .select('*', { count: 'exact', head: true })
        .eq('channel_id', channelId),
    ]);

    return {
      id: channel.id,
      name: channel.name,
      description: channel.description || '',
      imageUrl: channel.image_url,
      subscriberCount: subscriberCount || 0,
      puzzleCount: puzzleCount || 0,
    };
  },

  // Get puzzles for a channel
  async getChannelPuzzles(channelId: string, userId: string): Promise<Puzzle[]> {
    // TODO: Fetch puzzles with solved/shared status for user
    // Order by publish_date DESC
    return [];
  },

  // Get single puzzle
  async getPuzzle(puzzleId: string, userId: string): Promise<Puzzle> {
    // TODO: Fetch puzzle with user's solve status
    throw new Error('Puzzle not found');
  },

  // Submit puzzle answer
  async submitAnswer(puzzleId: string, userId: string, answer: string): Promise<boolean> {
    // TODO: Check if already submitted
    // TODO: Validate answer against correct_answer
    // TODO: Insert submission record
    
    const { data: puzzle } = await supabase
      .from('puzzles')
      .select('correct_answer')
      .eq('id', puzzleId)
      .single();
    
    const isCorrect = puzzle?.correct_answer === answer;
    
    await supabase.from('submissions').insert({
      puzzle_id: puzzleId,
      user_id: userId,
      answer,
      is_correct: isCorrect,
    });
    
    return isCorrect;
  },

  // Subscribe to channel
  async subscribeToChannel(channelId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('subscriptions')
      .insert({ channel_id: channelId, user_id: userId });
    
    if (error) throw error;
  },

  // Unsubscribe from channel
  async unsubscribeFromChannel(channelId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('channel_id', channelId)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  // Create puzzle (admin only)
  async createPuzzle(data: CreatePuzzleData, userId: string): Promise<Puzzle> {
    // TODO: Upload image to storage
    // TODO: Insert puzzle record
    
    // Upload image
    const fileName = `puzzles/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('puzzle-images')
      .upload(fileName, { uri: data.imageUri } as any);
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('puzzle-images')
      .getPublicUrl(fileName);
    
    // Insert puzzle
    const { data: puzzle, error } = await supabase
      .from('puzzles')
      .insert({
        channel_id: data.channelId,
        title: data.title,
        image_url: publicUrl,
        publish_date: data.publishDate,
        answer_type: data.answerType,
        correct_answer: data.correctAnswer,
        options: data.options,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return puzzle as Puzzle;
  },
};