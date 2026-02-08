// Puzzle image display component

import { Image, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@/utils/constants';

interface PuzzleImageProps {
  imageUrl: string;
}

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width - 32; // Account for padding

export default function PuzzleImage({ imageUrl }: PuzzleImageProps) {
  return (
    <Image 
      source={{ uri: imageUrl }} 
      style={styles.image}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
    backgroundColor: COLORS.border,
  },
});