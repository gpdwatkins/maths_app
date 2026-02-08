// Clusters tab screen

import { View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useClusters } from '@/hooks/useClusters';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import WebContentContainer from '@/components/ui/WebContentContainer';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';

export default function ClustersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { clusters, loading, joinCluster } = useClusters(user!.id);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const handleJoinCluster = async () => {
    try {
      await joinCluster(inviteCode);
      setInviteCode('');
      setShowJoinInput(false);
      Alert.alert('Success', 'Joined cluster successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to join cluster. Check the invite code.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <WebContentContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <Button
            title={showJoinInput ? 'Cancel' : 'Join Cluster'}
            onPress={() => setShowJoinInput(!showJoinInput)}
            variant="secondary"
          />
        </View>

        {showJoinInput && (
          <View style={styles.joinContainer}>
            <Input
              value={inviteCode}
              onChangeText={setInviteCode}
              placeholder="Enter invite code"
              label="Invite Code"
            />
            <Button
              title="Join"
              onPress={handleJoinCluster}
              disabled={!inviteCode}
              fullWidth
            />
          </View>
        )}

        <FlatList
          data={clusters}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card onPress={() => router.push(`/cluster/${item.id}`)}>
              <Text style={styles.clusterName}>{item.name}</Text>
              <Text style={styles.clusterDescription}>{item.description}</Text>
              <Text style={styles.clusterMembers}>
                {item.memberCount} members
              </Text>
            </Card>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            !showJoinInput ? (
              <EmptyState
                title="No clusters"
                message="Join a cluster to connect with your school or maths club"
              />
            ) : null
          }
        />
      </View>
    </WebContentContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  joinContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  list: {
    padding: SPACING.md,
  },
  clusterName: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  clusterDescription: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  clusterMembers: {
    fontSize: TYPOGRAPHY.tiny,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
});