// Composer hook - manages composer data

import { useState, useEffect, useCallback } from 'react';
import { composerService } from '@/services/composer.service';
import {
  ComposerChannel,
  ComposerStats,
  ComposerPuzzle,
  CreateChannelData,
  CreateComposerPuzzleData,
} from '@/types/composer.types';

export const useComposer = (composerId: string) => {
  const [channels, setChannels] = useState<ComposerChannel[]>([]);
  const [stats, setStats] = useState<ComposerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [channelsData, statsData] = await Promise.all([
        composerService.getComposerChannels(composerId),
        composerService.getComposerStats(composerId),
      ]);
      setChannels(channelsData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load composer data');
    } finally {
      setLoading(false);
    }
  }, [composerId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createChannel = async (data: CreateChannelData): Promise<ComposerChannel> => {
    const channel = await composerService.createChannel(composerId, data);
    setChannels([channel, ...channels]);
    if (stats) {
      setStats({ ...stats, channelCount: stats.channelCount + 1 });
    }
    return channel;
  };

  return {
    channels,
    stats,
    loading,
    error,
    refresh: loadData,
    createChannel,
  };
};

export const useComposerChannel = (channelId: string) => {
  const [channel, setChannel] = useState<ComposerChannel | null>(null);
  const [puzzles, setPuzzles] = useState<ComposerPuzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [channelData, puzzlesData] = await Promise.all([
        composerService.getComposerChannel(channelId),
        composerService.getChannelPuzzles(channelId),
      ]);
      setChannel(channelData);
      setPuzzles(puzzlesData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load channel data');
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createPuzzle = async (data: CreateComposerPuzzleData): Promise<ComposerPuzzle> => {
    const puzzle = await composerService.createPuzzle(data);
    setPuzzles([puzzle, ...puzzles]);
    if (channel) {
      setChannel({ ...channel, puzzleCount: channel.puzzleCount + 1 });
    }
    return puzzle;
  };

  return {
    channel,
    puzzles,
    loading,
    error,
    refresh: loadData,
    createPuzzle,
  };
};
