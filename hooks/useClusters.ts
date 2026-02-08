// Clusters hook - manages cluster data

import { useState, useEffect } from 'react';
import { clusterService } from '@/services/cluster.service';
import { Cluster } from '@/types/cluster.types';

export const useClusters = (userId: string) => {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClusters();
  }, [userId]);

  const loadClusters = async () => {
    try {
      setLoading(true);
      const data = await clusterService.getUserClusters(userId);
      setClusters(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load clusters');
    } finally {
      setLoading(false);
    }
  };

  const joinCluster = async (inviteCode: string) => {
    try {
      const cluster = await clusterService.joinClusterByCode(inviteCode, userId);
      setClusters([...clusters, cluster]);
    } catch (err) {
      throw err;
    }
  };

  return { clusters, loading, error, refresh: loadClusters, joinCluster };
};