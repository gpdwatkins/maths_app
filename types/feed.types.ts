// Feed-related type definitions

export type PostType = 'puzzle' | 'completion';

export interface BasePost {
  id: string;
  type: PostType;
  userId: string;
  username: string;
  userProfilePicture?: string;
  createdAt: string;
  rootCount: number;
  isRooted: boolean;
  canDelete: boolean;
}

export interface PuzzlePost extends BasePost {
  type: 'puzzle';
  puzzleId: string;
  puzzleImageUrl: string;
  channelName: string;
  publishDate: string;
}

export interface CompletionPost extends BasePost {
  type: 'completion';
  puzzleId: string;
  puzzleTitle: string;
  puzzleImageUrl: string;
  completedAt: string;
}

export type FeedPost = PuzzlePost | CompletionPost;