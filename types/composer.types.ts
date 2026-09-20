// Composer-related type definitions

import { AnswerType } from './puzzle.types';

export type ChannelFrequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'ad_hoc' | 'other';

export interface ComposerChannel {
  id: string;
  composerId: string;
  name: string;
  description: string;
  imageUrl?: string;
  frequency: ChannelFrequency;
  frequencyOther?: string; // Custom frequency description when frequency is 'other'
  subscriberCount: number;
  puzzleCount: number;
  solutionCount: number;
  createdAt: string;
}

export interface ComposerChannelStats {
  subscriberCount: number;
  puzzleCount: number;
  solutionCount: number;
}

export interface ComposerStats {
  totalSubscribers: number;
  totalPuzzles: number;
  totalSolutions: number;
  channelCount: number;
}

export interface ComposerPuzzle {
  id: string;
  channelId: string;
  title: string;
  imageUrl: string;
  publishDate: string;
  answerType: AnswerType;
  correctAnswer: string;
  options?: string[]; // For MCQ only
  isPublished: boolean;
  solutionCount: number;
  createdAt: string;
}

export interface CreateChannelData {
  name: string;
  description: string;
  imageUri?: string;
  frequency: ChannelFrequency;
  frequencyOther?: string;
}

export interface CreateComposerPuzzleData {
  channelId: string;
  title: string;
  imageUri: string;
  publishDate: string; // ISO string, if in future it's scheduled
  answerType: AnswerType;
  correctAnswer: string;
  options?: string[];
}
