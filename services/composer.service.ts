// Composer service - manages composer channels and puzzles

import { supabase } from './supabase';
import {
  ComposerChannel,
  ComposerStats,
  ComposerPuzzle,
  CreateChannelData,
  CreateComposerPuzzleData,
} from '@/types/composer.types';

export const composerService = {
  // Become a composer - updates user profile
  async becomeComposer(userId: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ is_composer: true })
      .eq('id', userId);

    if (error) throw error;
  },

  // Get composer stats (aggregated)
  async getComposerStats(composerId: string): Promise<ComposerStats> {
    // TODO: Implement with Supabase queries
    // For now, calculate from channels
    const channels = await this.getComposerChannels(composerId);

    return {
      totalSubscribers: channels.reduce((sum, c) => sum + c.subscriberCount, 0),
      totalPuzzles: channels.reduce((sum, c) => sum + c.puzzleCount, 0),
      totalSolutions: channels.reduce((sum, c) => sum + c.solutionCount, 0),
      channelCount: channels.length,
    };
  },

  // Get composer's channels
  async getComposerChannels(composerId: string): Promise<ComposerChannel[]> {
    const { data: channels, error } = await supabase
      .from('puzzle_channels')
      .select('*')
      .eq('composer_id', composerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!channels) return [];

    // Get stats for each channel
    const channelsWithStats = await Promise.all(
      channels.map(async (channel) => {
        // Get subscriber count
        const { count: subscriberCount } = await supabase
          .from('channel_subscriptions')
          .select('*', { count: 'exact', head: true })
          .eq('channel_id', channel.id);

        // Get puzzle count
        const { count: puzzleCount } = await supabase
          .from('puzzles')
          .select('*', { count: 'exact', head: true })
          .eq('channel_id', channel.id);

        // Get solution count (submissions for puzzles in this channel)
        const { data: puzzleIds } = await supabase
          .from('puzzles')
          .select('id')
          .eq('channel_id', channel.id);

        let solutionCount = 0;
        if (puzzleIds && puzzleIds.length > 0) {
          const { count } = await supabase
            .from('puzzle_submissions')
            .select('*', { count: 'exact', head: true })
            .in('puzzle_id', puzzleIds.map(p => p.id));
          solutionCount = count || 0;
        }

        return {
          id: channel.id,
          composerId: channel.composer_id,
          name: channel.name,
          description: channel.description || '',
          imageUrl: channel.image_url,
          frequency: channel.frequency || 'ad_hoc',
          frequencyOther: channel.frequency_other,
          subscriberCount: subscriberCount || 0,
          puzzleCount: puzzleCount || 0,
          solutionCount,
          createdAt: channel.created_at,
        };
      })
    );

    return channelsWithStats;
  },

  // Get single channel
  async getComposerChannel(channelId: string): Promise<ComposerChannel> {
    const { data: channel, error } = await supabase
      .from('puzzle_channels')
      .select('*')
      .eq('id', channelId)
      .single();

    if (error || !channel) throw new Error('Channel not found');

    // Get subscriber count
    const { count: subscriberCount } = await supabase
      .from('channel_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('channel_id', channel.id);

    // Get puzzle count
    const { count: puzzleCount } = await supabase
      .from('puzzles')
      .select('*', { count: 'exact', head: true })
      .eq('channel_id', channel.id);

    // Get solution count
    const { data: puzzleIds } = await supabase
      .from('puzzles')
      .select('id')
      .eq('channel_id', channel.id);

    let solutionCount = 0;
    if (puzzleIds && puzzleIds.length > 0) {
      const { count } = await supabase
        .from('puzzle_submissions')
        .select('*', { count: 'exact', head: true })
        .in('puzzle_id', puzzleIds.map(p => p.id));
      solutionCount = count || 0;
    }

    return {
      id: channel.id,
      composerId: channel.composer_id,
      name: channel.name,
      description: channel.description || '',
      imageUrl: channel.image_url,
      frequency: channel.frequency || 'ad_hoc',
      frequencyOther: channel.frequency_other,
      subscriberCount: subscriberCount || 0,
      puzzleCount: puzzleCount || 0,
      solutionCount,
      createdAt: channel.created_at,
    };
  },

  // Create a new channel
  async createChannel(composerId: string, data: CreateChannelData): Promise<ComposerChannel> {
    let imageUrl: string | undefined;

    // Upload image if provided
    if (data.imageUri) {
      imageUrl = await this.uploadChannelImage(data.imageUri);
    }

    const { data: channel, error } = await supabase
      .from('puzzle_channels')
      .insert({
        composer_id: composerId,
        name: data.name,
        description: data.description,
        image_url: imageUrl,
        frequency: data.frequency,
        frequency_other: data.frequencyOther,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: channel.id,
      composerId: channel.composer_id,
      name: channel.name,
      description: channel.description || '',
      imageUrl: channel.image_url,
      frequency: channel.frequency || 'ad_hoc',
      frequencyOther: channel.frequency_other,
      subscriberCount: 0,
      puzzleCount: 0,
      solutionCount: 0,
      createdAt: channel.created_at,
    };
  },

  // Upload channel image
  async uploadChannelImage(imageUri: string): Promise<string> {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const filename = `channel-${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('puzzle_publisher_logos')
      .upload(filename, blob, { contentType: 'image/jpeg' });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('puzzle_publisher_logos')
      .getPublicUrl(filename);

    return publicUrl;
  },

  // Get puzzles for a channel
  async getChannelPuzzles(channelId: string): Promise<ComposerPuzzle[]> {
    const { data: puzzles, error } = await supabase
      .from('puzzles')
      .select('*')
      .eq('channel_id', channelId)
      .order('publish_date', { ascending: false });

    if (error) throw error;
    if (!puzzles) return [];

    // Get solution counts for each puzzle
    const puzzlesWithStats = await Promise.all(
      puzzles.map(async (puzzle) => {
        const { count } = await supabase
          .from('puzzle_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('puzzle_id', puzzle.id);

        const now = new Date();
        const publishDate = new Date(puzzle.publish_date);

        return {
          id: puzzle.id,
          channelId: puzzle.channel_id,
          title: puzzle.title,
          imageUrl: puzzle.image_url,
          publishDate: puzzle.publish_date,
          answerType: puzzle.answer_type,
          correctAnswer: puzzle.correct_answer,
          options: puzzle.options,
          isPublished: publishDate <= now,
          solutionCount: count || 0,
          createdAt: puzzle.created_at,
        };
      })
    );

    return puzzlesWithStats;
  },

  // Create a new puzzle
  async createPuzzle(data: CreateComposerPuzzleData): Promise<ComposerPuzzle> {
    // Upload puzzle image
    const imageUrl = await this.uploadPuzzleImage(data.imageUri);

    const { data: puzzle, error } = await supabase
      .from('puzzles')
      .insert({
        channel_id: data.channelId,
        title: data.title,
        image_url: imageUrl,
        publish_date: data.publishDate,
        answer_type: data.answerType,
        correct_answer: data.correctAnswer,
        options: data.options,
      })
      .select()
      .single();

    if (error) throw error;

    const now = new Date();
    const publishDate = new Date(puzzle.publish_date);

    return {
      id: puzzle.id,
      channelId: puzzle.channel_id,
      title: puzzle.title,
      imageUrl: puzzle.image_url,
      publishDate: puzzle.publish_date,
      answerType: puzzle.answer_type,
      correctAnswer: puzzle.correct_answer,
      options: puzzle.options,
      isPublished: publishDate <= now,
      solutionCount: 0,
      createdAt: puzzle.created_at,
    };
  },

  // Upload puzzle image
  async uploadPuzzleImage(imageUri: string): Promise<string> {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const filename = `puzzle-${Date.now()}.jpg`;
    const path = `composer/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from('puzzle-images')
      .upload(path, blob, { contentType: 'image/jpeg' });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('puzzle-images')
      .getPublicUrl(path);

    return publicUrl;
  },
};
