// Profile service - manages user profiles and stats

import { Platform } from 'react-native';
import { supabase } from './supabase';
import { Profile, ProfileStats, UpdateProfileData } from '@/types/profile.types';

export const profileService = {
  // Get user profile
  async getProfile(userId: string, currentUserId: string): Promise<Profile> {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, profile_picture_url, bio, is_private')
      .eq('id', userId)
      .single();

    if (error || !user) throw new Error('Profile not found or private');

    // For now, return basic stats - can be enhanced later
    const stats = await this.getProfileStats(userId);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      profilePictureUrl: user.profile_picture_url,
      bio: user.bio,
      isPrivate: user.is_private || false,
      stats,
      canView: true,
    };
  },

  // Get profile stats
  async getProfileStats(userId: string): Promise<ProfileStats> {
    // TODO: Aggregate stats from various tables
    // For now return zeros, can be implemented later
    return {
      puzzlesSolved: 0,
      channelsSubscribed: 0,
      completionsShared: 0,
      rootsReceived: 0,
      currentStreak: 0,
      followers: 0,
      following: 0,
    };
  },

  // Update profile picture
  async updateProfilePicture(userId: string, imageUri: string): Promise<string> {
    // Create a unique filename
    const timestamp = Date.now();

    let fileExt = 'jpg';
    let uploadData;
    let contentType = 'image/jpeg';

    if (Platform.OS === 'web') {
      // On web, handle data URI
      if (imageUri.startsWith('data:')) {
        // Extract MIME type from data URI (e.g., "data:image/jpeg;base64,...")
        const mimeMatch = imageUri.match(/data:([^;]+);/);
        if (mimeMatch) {
          contentType = mimeMatch[1];
          // Extract extension from MIME type (e.g., "image/jpeg" -> "jpeg")
          fileExt = contentType.split('/')[1] || 'jpg';
        }
      }

      // Fetch the image as a blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      uploadData = blob;
    } else {
      // On mobile, extract extension from file path
      fileExt = imageUri.split('.').pop() || 'jpg';
      contentType = `image/${fileExt}`;

      // Create FormData
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: contentType,
        name: `${userId}-${timestamp}.${fileExt}`,
      } as any);
      uploadData = formData;
    }

    const fileName = `${userId}-${timestamp}.${fileExt}`;
    const filePath = fileName;

    // Upload to Supabase storage
    const { data, error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, uploadData, {
        contentType: contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath);

    // Update user record with new profile picture URL
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_picture_url: publicUrl })
      .eq('id', userId);

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    return publicUrl;
  },

  // Update profile
  async updateProfile(userId: string, data: UpdateProfileData): Promise<Profile> {
    // TODO: Update profile fields
    // Handle profile picture upload if provided
    
    if (data.profilePictureUri) {
      const fileName = `profiles/${userId}.jpg`;
      await supabase.storage
        .from('profile-pictures')
        .upload(fileName, { uri: data.profilePictureUri } as any, {
          upsert: true,
        });
    }
    
    const { error } = await supabase
      .from('users')
      .update({
        username: data.username,
        bio: data.bio,
        is_private: data.isPrivate,
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    return this.getProfile(userId, userId);
  },

  // Follow user
  async followUser(targetUserId: string, currentUserId: string): Promise<void> {
    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: currentUserId, following_id: targetUserId });
    
    if (error) throw error;
  },

  // Unfollow user
  async unfollowUser(targetUserId: string, currentUserId: string): Promise<void> {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', currentUserId)
      .eq('following_id', targetUserId);
    
    if (error) throw error;
  },
};