// Cluster-related type definitions

export interface Cluster {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
  inviteCode: string;
  isMember: boolean;
}

export interface ClusterMember {
  userId: string;
  username: string;
  profilePictureUrl?: string;
  joinedAt: string;
}