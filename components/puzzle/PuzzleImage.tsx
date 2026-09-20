// Puzzle image display component with dynamic height based on aspect ratio

import { Image, StyleSheet, Dimensions, View, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { COLORS } from '@/utils/constants';

interface PuzzleImageProps {
  imageUrl: string;
}

const { width: screenWidth } = Dimensions.get('window');
const MAX_CONTENT_WIDTH = 600;
const PADDING = 32; // 16px padding on each side

// Calculate image width based on platform
const getImageWidth = () => {
  if (Platform.OS === 'web') {
    // On web, constrain to max content width minus padding
    return Math.min(screenWidth, MAX_CONTENT_WIDTH) - PADDING;
  }
  // On mobile, use screen width minus padding
  return screenWidth - PADDING;
};

const IMAGE_WIDTH = getImageWidth();

export default function PuzzleImage({ imageUrl }: PuzzleImageProps) {
  const [imageHeight, setImageHeight] = useState<number>(IMAGE_WIDTH); // Default to square
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (imageUrl) {
      Image.getSize(
        imageUrl,
        (width, height) => {
          // Calculate height to maintain aspect ratio at fixed width
          const aspectRatio = height / width;
          setImageHeight(IMAGE_WIDTH * aspectRatio);
          setLoading(false);
        },
        (error) => {
          console.error('Failed to get image size:', error);
          setLoading(false);
        }
      );
    }
  }, [imageUrl]);

  return (
    <View style={[styles.container, { height: imageHeight }]}>
      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, { width: IMAGE_WIDTH, height: imageHeight }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: IMAGE_WIDTH,
    backgroundColor: COLORS.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 12,
  },
});