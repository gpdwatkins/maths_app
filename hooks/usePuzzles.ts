// Puzzles hook - manages puzzle data

import { useState, useEffect } from 'react';
import { puzzleService } from '@/services/puzzle.service';
import { PuzzleChannel, Puzzle } from '@/types/puzzle.types';

export const usePuzzles = (userId: string) => {
  const [channels, setChannels] = useState<PuzzleChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChannels();
  }, [userId]);

  const loadChannels = async () => {
    try {
      setLoading(true);
      const data = await puzzleService.getSubscribedChannels(userId);
      setChannels(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load channels');
    } finally {
      setLoading(false);
    }
  };

  return { channels, loading, error, refresh: loadChannels };
};

export const useChannelPuzzles = (channelId: string, userId: string) => {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [channel, setChannel] = useState<PuzzleChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [channelId, userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [puzzlesData, channelData] = await Promise.all([
        puzzleService.getChannelPuzzles(channelId, userId),
        puzzleService.getChannel(channelId),
      ]);
      setPuzzles(puzzlesData);
      setChannel(channelData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load puzzles');
    } finally {
      setLoading(false);
    }
  };

  return { puzzles, channel, loading, error, refresh: loadData };
};