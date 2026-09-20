// Create channel dialog for composers

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { CreateChannelData, ChannelFrequency } from '@/types/composer.types';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';

interface CreateChannelDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateChannelData) => Promise<void>;
}

const FREQUENCY_OPTIONS: { value: ChannelFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'ad_hoc', label: 'No fixed frequency' },
  { value: 'other', label: 'Other' },
];

export default function CreateChannelDialog({
  visible,
  onClose,
  onSubmit,
}: CreateChannelDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [frequency, setFrequency] = useState<ChannelFrequency>('weekly');
  const [frequencyOther, setFrequencyOther] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setDescription('');
    setImageUri(undefined);
    setFrequency('weekly');
    setFrequencyOther('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access photos is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Channel name is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    if (frequency === 'other' && !frequencyOther.trim()) {
      setError('Please specify the frequency');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        imageUri,
        frequency,
        frequencyOther: frequency === 'other' ? frequencyOther.trim() : undefined,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create channel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Channel</Text>
          <View style={styles.closeButton} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Input
            label="Channel Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter channel name"
          />

          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your channel"
          />

          <Text style={styles.label}>Channel Image (optional)</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.imagePickerText}>Tap to select an image</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Puzzle Frequency</Text>
          <View style={styles.frequencyOptions}>
            {FREQUENCY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.frequencyOption,
                  frequency === option.value && styles.frequencyOptionSelected,
                ]}
                onPress={() => setFrequency(option.value)}
              >
                <Text
                  style={[
                    styles.frequencyOptionText,
                    frequency === option.value && styles.frequencyOptionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {frequency === 'other' && (
            <Input
              label="Specify Frequency"
              value={frequencyOther}
              onChangeText={setFrequencyOther}
              placeholder="e.g., Twice a week"
            />
          )}

          {error && <Text style={styles.error}>{error}</Text>}

          <Button
            title="Create Channel"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            fullWidth
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'ios' ? SPACING.xl : SPACING.md,
  },
  closeButton: {
    width: 60,
  },
  closeButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.regular,
    color: COLORS.primaryDark,
  },
  title: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderStyle: 'dashed',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  imagePickerText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  frequencyOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
    marginHorizontal: -SPACING.xs,
  },
  frequencyOption: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    margin: SPACING.xs,
  },
  frequencyOptionSelected: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  frequencyOptionText: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  frequencyOptionTextSelected: {
    color: COLORS.white,
  },
  error: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    marginBottom: SPACING.md,
  },
});
