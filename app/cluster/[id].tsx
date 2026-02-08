// Cluster detail screen

import { View, FlatList, StyleSheet, Text, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { clusterService } from '@/services/cluster.service';
import { Cluster, ClusterMember } from '@/types/cluster.types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SubPageLayout from '@/components/ui/SubPageLayout';
import Card from '@/components/ui/Card';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';
import { formatDate } from '@/utils/helpers';

export default function ClusterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [cluster, setCluster] = useState<Cluster | null>(null);
  const [members, setMembers] = useState<ClusterMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClusterData();
  }, [id]);

  const loadClusterData = async () => {
    try {
      const [clusterData, membersData] = await Promise.all([
        clusterService.getCluster(id),
        clusterService.getClusterMembers(id),
      ]);
      setCluster(clusterData);
      setMembers(membersData);
    } catch (error) {
      console.error('Load cluster error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SubPageLayout>
        <LoadingSpinner />
      </SubPageLayout>
    );
  }

  if (!cluster) {
    return null;
  }

  return (
    <SubPageLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.clusterName}>{cluster.name}</Text>
          <Text style={styles.description}>{cluster.description}</Text>
          <Text style={styles.inviteCode}>Invite Code: {cluster.inviteCode}</Text>
        </View>

        <FlatList
          data={members}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.memberCard}>
                {item.profilePictureUrl ? (
                  <Image
                    source={{ uri: item.profilePictureUrl }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarText}>
                      {item.username[0].toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{item.username}</Text>
                  <Text style={styles.memberDetail}>
                    Joined {formatDate(item.joinedAt)}
                  </Text>
                </View>
              </View>
            </Card>
          )}
          contentContainerStyle={styles.list}
        />
      </View>
    </SubPageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  clusterName: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  inviteCode: {
    fontSize: TYPOGRAPHY.tiny,
    fontFamily: FONTS.semiBold,
    color: COLORS.primaryDark,
  },
  list: {
    padding: SPACING.md,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.border,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryDark,
  },
  avatarText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  memberInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  memberName: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  memberDetail: {
    fontSize: TYPOGRAPHY.tiny,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
});