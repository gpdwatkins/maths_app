// Puzzle-related type definitions

export type AnswerType = 'mcq' | 'numerical';

export interface PuzzleChannel {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  subscriberCount: number;
  puzzleCount: number;
}

export interface Puzzle {
  id: string;
  channelId: string;
  channelName: string;
  title: string;
  imageUrl: string;
  publishDate: string;
  answerType: AnswerType;
  correctAnswer: string;
  options?: string[]; // For MCQ only
  isSolved?: boolean;
  isShared?: boolean;
}

export interface PuzzleSubmission {
  puzzleId: string;
  userId: string;
  answer: string;
  isCorrect: boolean;
  submittedAt: string;
}

export interface CreatePuzzleData {
  channelId: string;
  title: string;
  imageUri: string;
  publishDate: string;
  answerType: AnswerType;
  correctAnswer: string;
  options?: string[];
}