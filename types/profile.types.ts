// Profile-related type definitions

export interface ProfileStats {
  puzzlesSolved: number;
  channelsSubscribed: number;
  completionsShared: number;
  rootsReceived: number;
  currentStreak: number;
  followers: number;
  following: number;
}

export interface Profile {
  id: string;
  username: string;
  email?: string;
  profilePictureUrl?: string;
  bio?: string;
  isPrivate: boolean;
  stats: ProfileStats;
  isFollowing?: boolean;
  canView: boolean;
}

export interface UpdateProfileData {
  username?: string;
  bio?: string;
  profilePictureUri?: string;
  isPrivate?: boolean;
}