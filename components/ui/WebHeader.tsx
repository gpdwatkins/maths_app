// Custom header component for web with profile menu

import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';
import { COLORS, FONTS, TYPOGRAPHY, SPACING } from '@/utils/constants';

const MAX_HEADER_WIDTH = 900;
const LOGO_HEIGHT = 48;

interface WebHeaderProps {
  showBackButton?: boolean;
}

// Get the public URL for the logo from Supabase storage
const getLogoUrl = () => {
  const { data } = supabase.storage.from('branding').getPublicUrl('logos/top_banner_logo_light.png');
  return data.publicUrl;
};

export default function WebHeader({ showBackButton = false }: WebHeaderProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<View>(null);
  const logoUrl = getLogoUrl();

  const handleSignOut = async () => {
    setMenuVisible(false);
    await signOut();
  };

  const handleViewProfile = () => {
    setMenuVisible(false);
    router.push('/(tabs)/profile');
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (Platform.OS !== 'web' || !menuVisible) return;

    const handleClickOutside = () => {
      setMenuVisible(false);
    };

    // Add listener with a small delay to avoid immediate close
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuVisible]);

  const handleBack = () => {
    router.back();
  };

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.nativeInnerContainer}>
          <View style={styles.sideSection}>
            {showBackButton && (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <FontAwesome5 name="arrow-left" size={20} color={COLORS.text} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: logoUrl }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.sideSection} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.sideSection}>
          {showBackButton && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <FontAwesome5 name="arrow-left" size={20} color={COLORS.text} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.logoContainer}>
          <Image
            source={{ uri: logoUrl }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.sideSection, styles.profileWrapper]}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => setMenuVisible(!menuVisible)}
          >
            {user?.profilePictureUrl ? (
              <Image
                source={{ uri: user.profilePictureUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <FontAwesome5 name="user" size={18} color="#9CA3AF" />
              </View>
            )}
            <FontAwesome5 name="chevron-down" size={10} color={COLORS.text} style={styles.chevron} />
          </TouchableOpacity>

          {menuVisible && (
            <View ref={menuRef} style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={handleViewProfile}>
                <FontAwesome5 name="user" size={16} color={COLORS.text} />
                <Text style={styles.menuItemText}>View Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
                <FontAwesome5 name="sign-out-alt" size={16} color={COLORS.text} />
                <Text style={styles.menuItemText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    borderBottomWidth: Platform.OS === 'web' ? 1 : 0,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    maxWidth: MAX_HEADER_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },
  nativeInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  sideSection: {
    width: 80,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    padding: SPACING.sm,
  },
  logo: {
    height: LOGO_HEIGHT,
    width: 270,
  },
  profileWrapper: {
    position: 'relative',
    alignItems: 'flex-end',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.border,
  },
  profilePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: SPACING.xs,
  },
  menuContainer: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: SPACING.md + SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: SPACING.xs,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  menuItemText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
});
