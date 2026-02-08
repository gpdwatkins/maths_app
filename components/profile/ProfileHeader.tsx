// Profile header with avatar and username

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';

interface ProfileHeaderProps {
  profilePictureUrl?: string;
  username: string;
  bio?: string;
  isOwnProfile: boolean;
  onEditPress?: () => void;
  onProfilePicturePress?: () => void;
}

export default function ProfileHeader({
  profilePictureUrl,
  username,
  bio,
  isOwnProfile,
  onEditPress,
  onProfilePicturePress
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={isOwnProfile ? onProfilePicturePress : undefined}
          disabled={!isOwnProfile}
        >
          {profilePictureUrl ? (
            <Image source={{ uri: profilePictureUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <FontAwesome5 name="user" size={40} color="#9CA3AF" />
            </View>
          )}
          {isOwnProfile && (
            <View style={styles.cameraIcon}>
              <FontAwesome5 name="camera" size={14} color={COLORS.white} />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          {bio && <Text style={styles.bio}>{bio}</Text>}
        </View>
      </View>

      {isOwnProfile && onEditPress && (
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  username: {
    fontSize: TYPOGRAPHY.h2,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  bio: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  editButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.semiBold,
    color: COLORS.primaryDark,
  },
});