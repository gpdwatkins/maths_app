// Profile tab screen

import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services/profile.service';
import ProfileHeader from '@/components/profile/ProfileHeader';
import StatsCard from '@/components/profile/StatsCard';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import WebContentContainer from '@/components/ui/WebContentContainer';
import { Profile } from '@/types/profile.types';
import { COLORS, SPACING } from '@/utils/constants';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const profileData = await profileService.getProfile(user!.id, user!.id);
      setProfile(profileData);
    } catch (error) {
      console.error('Load profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicturePress = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant camera roll permissions to upload a profile picture.');
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadProfilePicture(result.assets[0].uri);
    }
  };

  const uploadProfilePicture = async (uri: string) => {
    try {
      setUploading(true);
      console.log('Starting upload with URI:', uri);

      // Upload to Supabase and update profile
      const newUrl = await profileService.updateProfilePicture(user!.id, uri);
      console.log('Upload successful, new URL:', newUrl);

      // Reload profile to get new picture URL
      await loadProfile();

      Alert.alert('Success', 'Profile picture updated successfully');
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload profile picture';
      Alert.alert('Error', errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <WebContentContainer>
        <LoadingSpinner />
      </WebContentContainer>
    );
  }

  if (!profile) {
    return (
      <WebContentContainer>
        <View style={styles.container} />
      </WebContentContainer>
    );
  }

  return (
    <WebContentContainer>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <ProfileHeader
            profilePictureUrl={profile.profilePictureUrl}
            username={profile.username}
            bio={profile.bio}
            isOwnProfile={true}
            onEditPress={() => {/* TODO: Navigate to edit profile */}}
            onProfilePicturePress={handleProfilePicturePress}
          />

          <View style={styles.content}>
            <StatsCard stats={profile.stats} />

            {!user?.isGuest && (
              <View style={styles.actions}>
                <Button
                  title="Sign Out"
                  onPress={handleSignOut}
                  variant="outline"
                  fullWidth
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </WebContentContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: SPACING.md,
  },
  actions: {
    marginTop: SPACING.lg,
  },
});