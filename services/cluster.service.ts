// Cluster service - manages private groups

import { supabase } from './supabase';
import { Cluster, ClusterMember } from '@/types/cluster.types';

export const clusterService = {
  // Get user's clusters
  async getUserClusters(userId: string): Promise<Cluster[]> {
    // Get cluster IDs the user is a member of
    const { data: memberships, error: memberError } = await supabase
      .from('cluster_members')
      .select('cluster_id')
      .eq('user_id', userId);

    if (memberError) throw memberError;
    if (!memberships || memberships.length === 0) return [];

    const clusterIds = memberships.map((m) => m.cluster_id);

    // Fetch cluster details
    const { data: clusters, error: clusterError } = await supabase
      .from('clusters')
      .select('id, name, description, invite_code, created_at')
      .in('id', clusterIds);

    if (clusterError) throw clusterError;
    if (!clusters) return [];

    // Get member counts for each cluster
    const clustersWithCounts = await Promise.all(
      clusters.map(async (cluster) => {
        const { count } = await supabase
          .from('cluster_members')
          .select('*', { count: 'exact', head: true })
          .eq('cluster_id', cluster.id);

        return {
          id: cluster.id,
          name: cluster.name,
          description: cluster.description || '',
          inviteCode: cluster.invite_code,
          createdAt: cluster.created_at,
          memberCount: count || 0,
          isMember: true,
        };
      })
    );

    return clustersWithCounts;
  },

  // Get cluster details
  async getCluster(clusterId: string, userId?: string): Promise<Cluster> {
    const { data: cluster, error } = await supabase
      .from('clusters')
      .select('id, name, description, invite_code, created_at')
      .eq('id', clusterId)
      .single();

    if (error || !cluster) throw new Error('Cluster not found');

    // Get member count
    const { count } = await supabase
      .from('cluster_members')
      .select('*', { count: 'exact', head: true })
      .eq('cluster_id', clusterId);

    // Check if user is a member
    let isMember = false;
    if (userId) {
      const { data: membership } = await supabase
        .from('cluster_members')
        .select('id')
        .eq('cluster_id', clusterId)
        .eq('user_id', userId)
        .single();
      isMember = !!membership;
    }

    return {
      id: cluster.id,
      name: cluster.name,
      description: cluster.description || '',
      inviteCode: cluster.invite_code,
      createdAt: cluster.created_at,
      memberCount: count || 0,
      isMember,
    };
  },

  // Get cluster members
  async getClusterMembers(clusterId: string): Promise<ClusterMember[]> {
    const { data: members, error } = await supabase
      .from('cluster_members')
      .select(`
        user_id,
        joined_at,
        users:user_id (
          username,
          profile_picture_url
        )
      `)
      .eq('cluster_id', clusterId);

    if (error) throw error;
    if (!members) return [];

    return members.map((member: any) => ({
      userId: member.user_id,
      username: member.users?.username || 'Unknown',
      profilePictureUrl: member.users?.profile_picture_url,
      joinedAt: member.joined_at,
    }));
  },

  // Join cluster by invite code
  async joinClusterByCode(inviteCode: string, userId: string): Promise<Cluster> {
    const { data: cluster, error: findError } = await supabase
      .from('clusters')
      .select('id, name, description, invite_code, created_at')
      .eq('invite_code', inviteCode)
      .single();

    if (findError || !cluster) throw new Error('Invalid invite code');

    const { error: joinError } = await supabase.from('cluster_members').insert({
      cluster_id: cluster.id,
      user_id: userId,
    });

    if (joinError) {
      if (joinError.code === '23505') {
        throw new Error('Already a member of this cluster');
      }
      throw joinError;
    }

    // Get member count
    const { count } = await supabase
      .from('cluster_members')
      .select('*', { count: 'exact', head: true })
      .eq('cluster_id', cluster.id);

    return {
      id: cluster.id,
      name: cluster.name,
      description: cluster.description || '',
      inviteCode: cluster.invite_code,
      createdAt: cluster.created_at,
      memberCount: count || 0,
      isMember: true,
    };
  },

  // Leave cluster
  async leaveCluster(clusterId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('cluster_members')
      .delete()
      .eq('cluster_id', clusterId)
      .eq('user_id', userId);
    
    if (error) throw error;
  },
};