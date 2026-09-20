// Composer tab screen - for managing puzzle channels

import { View, FlatList, StyleSheet, Text, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useComposer } from '@/hooks/useComposer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import WebContentContainer from '@/components/ui/WebContentContainer';
import { CreateChannelDialog } from '@/components/composer';
import { CreateChannelData, ChannelFrequency } from '@/types/composer.types';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';

const frequencyLabels: Record<ChannelFrequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  fortnightly: 'Fortnightly',
  monthly: 'Monthly',
  ad_hoc: 'No fixed frequency',
  other: 'Other',
};

export default function ComposerScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { channels, loading, createChannel } = useComposer(user!.id);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateChannel = async (data: CreateChannelData) => {
    try {
      await createChannel(data);
      Alert.alert('Success', 'Channel created successfully');
    } catch (error) {
      throw error;
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
            title="Create Channel"
            onPress={() => setShowCreateDialog(true)}
            variant="secondary"
          />
        </View>

        <FlatList
          data={channels}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card onPress={() => router.push(`/composer-channel/${item.id}`)}>
              <Text style={styles.channelName}>{item.name}</Text>
              <Text style={styles.channelDescription}>{item.description}</Text>
              <View style={styles.channelMeta}>
                <Text style={styles.channelFrequency}>
                  {item.frequency === 'other' && item.frequencyOther
                    ? item.frequencyOther
                    : frequencyLabels[item.frequency]}
                </Text>
              </View>
              <View style={styles.channelStats}>
                <Text style={styles.channelStat}>
                  {item.subscriberCount} subscribers
                </Text>
                <Text style={styles.channelStatDivider}>•</Text>
                <Text style={styles.channelStat}>
                  {item.puzzleCount} puzzles
                </Text>
                <Text style={styles.channelStatDivider}>•</Text>
                <Text style={styles.channelStat}>
                  {item.solutionCount} solutions
                </Text>
              </View>
            </Card>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              title="No channels yet"
              message="Create your first channel to start publishing puzzles"
            />
          }
        />

        <CreateChannelDialog
          visible={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSubmit={handleCreateChannel}
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
  list: {
    padding: SPACING.md,
  },
  channelName: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  channelDescription: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  channelMeta: {
    marginBottom: SPACING.xs,
  },
  channelFrequency: {
    fontSize: TYPOGRAPHY.tiny,
    fontFamily: FONTS.semiBold,
    color: COLORS.primaryDark,
  },
  channelStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelStat: {
    fontSize: TYPOGRAPHY.tiny,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  channelStatDivider: {
    fontSize: TYPOGRAPHY.tiny,
    color: COLORS.textLight,
    marginHorizontal: SPACING.xs,
  },
});
