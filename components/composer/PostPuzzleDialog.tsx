// Post puzzle dialog for composers

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
import { CreateComposerPuzzleData } from '@/types/composer.types';
import { AnswerType } from '@/types/puzzle.types';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';

interface PostPuzzleDialogProps {
  visible: boolean;
  channelId: string;
  channelName: string;
  onClose: () => void;
  onSubmit: (data: CreateComposerPuzzleData) => Promise<void>;
}

type PublishTiming = 'now' | 'future';

// Helper to get tomorrow's date in YYYY-MM-DD format
const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

// Helper to get current time in HH:MM format
const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

export default function PostPuzzleDialog({
  visible,
  channelId,
  channelName,
  onClose,
  onSubmit,
}: PostPuzzleDialogProps) {
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [publishTiming, setPublishTiming] = useState<PublishTiming>('now');
  const [publishDateStr, setPublishDateStr] = useState(getTomorrowDate());
  const [publishTimeStr, setPublishTimeStr] = useState('09:00');
  const [answerType, setAnswerType] = useState<AnswerType>('numerical');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const resetForm = () => {
    setTitle('');
    setImageUri(undefined);
    setPublishTiming('now');
    setPublishDateStr(getTomorrowDate());
    setPublishTimeStr('09:00');
    setAnswerType('numerical');
    setCorrectAnswer('');
    setOptions(['', '', '', '']);
    setError(null);
    setShowPreview(false);
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
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const parsePublishDate = (): Date | null => {
    // Parse date in YYYY-MM-DD format
    const dateMatch = publishDateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!dateMatch) return null;

    // Parse time in HH:MM format
    const timeMatch = publishTimeStr.match(/^(\d{2}):(\d{2})$/);
    if (!timeMatch) return null;

    const year = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10) - 1; // months are 0-indexed
    const day = parseInt(dateMatch[3], 10);
    const hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);

    const date = new Date(year, month, day, hours, minutes);

    // Validate the date is valid
    if (isNaN(date.getTime())) return null;

    return date;
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setError('Puzzle name is required');
      return false;
    }

    if (!imageUri) {
      setError('Puzzle image is required');
      return false;
    }

    if (!correctAnswer.trim()) {
      setError('Correct answer is required');
      return false;
    }

    if (answerType === 'mcq') {
      const filledOptions = options.filter((o) => o.trim());
      if (filledOptions.length < 2) {
        setError('At least 2 options are required for multiple choice');
        return false;
      }
      if (!filledOptions.includes(correctAnswer.trim())) {
        setError('Correct answer must be one of the options');
        return false;
      }
    }

    if (publishTiming === 'future') {
      const publishDate = parsePublishDate();
      if (!publishDate) {
        setError('Invalid date or time format. Use YYYY-MM-DD and HH:MM');
        return false;
      }
      if (publishDate <= new Date()) {
        setError('Publish date must be in the future');
        return false;
      }
    }

    return true;
  };

  const handlePreview = () => {
    if (!validateForm()) return;

    if (Platform.OS === 'web') {
      // On web, open preview in new tab
      window.open(imageUri, '_blank');
    } else {
      // On mobile, show preview in modal
      setShowPreview(true);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      let finalPublishDate: string;
      if (publishTiming === 'now') {
        finalPublishDate = new Date().toISOString();
      } else {
        const publishDate = parsePublishDate();
        finalPublishDate = publishDate!.toISOString();
      }

      const mcqOptions =
        answerType === 'mcq' ? options.filter((o) => o.trim()) : undefined;

      await onSubmit({
        channelId,
        title: title.trim(),
        imageUri: imageUri!,
        publishDate: finalPublishDate,
        answerType,
        correctAnswer: correctAnswer.trim(),
        options: mcqOptions,
      });

      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post puzzle');
    } finally {
      setLoading(false);
    }
  };

  // Preview Modal for mobile
  if (showPreview && Platform.OS !== 'web') {
    return (
      <Modal visible={true} animationType="fade" onRequestClose={() => setShowPreview(false)}>
        <View style={styles.previewContainer}>
          <TouchableOpacity
            style={styles.previewCloseButton}
            onPress={() => setShowPreview(false)}
          >
            <Text style={styles.previewCloseText}>Close Preview</Text>
          </TouchableOpacity>
          <View style={styles.previewCard}>
            <Text style={styles.previewChannelName}>{channelName}</Text>
            <Text style={styles.previewTitle}>{title}</Text>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            )}
            <Text style={styles.previewAnswerType}>
              {answerType === 'mcq' ? 'Multiple Choice' : 'Numerical Answer'}
            </Text>
            {answerType === 'mcq' && (
              <View style={styles.previewOptions}>
                {options.filter((o) => o.trim()).map((option, index) => (
                  <View key={index} style={styles.previewOption}>
                    <Text style={styles.previewOptionText}>{option}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  }

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
          <Text style={styles.title}>Post a Puzzle</Text>
          <View style={styles.closeButton} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Input
            label="Puzzle Name"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter puzzle name"
          />

          <Text style={styles.label}>Puzzle Image</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.imagePickerText}>Tap to upload puzzle image</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Publish Puzzle</Text>
          <View style={styles.timingOptions}>
            <TouchableOpacity
              style={[
                styles.timingOption,
                publishTiming === 'now' && styles.timingOptionSelected,
              ]}
              onPress={() => setPublishTiming('now')}
            >
              <Text
                style={[
                  styles.timingOptionText,
                  publishTiming === 'now' && styles.timingOptionTextSelected,
                ]}
              >
                Now
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timingOption,
                publishTiming === 'future' && styles.timingOptionSelected,
              ]}
              onPress={() => setPublishTiming('future')}
            >
              <Text
                style={[
                  styles.timingOptionText,
                  publishTiming === 'future' && styles.timingOptionTextSelected,
                ]}
              >
                In Future
              </Text>
            </TouchableOpacity>
          </View>

          {publishTiming === 'future' && (
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeField}>
                <Input
                  label="Date (YYYY-MM-DD)"
                  value={publishDateStr}
                  onChangeText={setPublishDateStr}
                  placeholder="2025-12-31"
                />
              </View>
              <View style={styles.dateTimeField}>
                <Input
                  label="Time (HH:MM)"
                  value={publishTimeStr}
                  onChangeText={setPublishTimeStr}
                  placeholder="09:00"
                />
              </View>
            </View>
          )}

          <Text style={styles.label}>Answer Type</Text>
          <View style={styles.answerTypeOptions}>
            <TouchableOpacity
              style={[
                styles.answerTypeOption,
                answerType === 'numerical' && styles.answerTypeOptionSelected,
              ]}
              onPress={() => setAnswerType('numerical')}
            >
              <Text
                style={[
                  styles.answerTypeOptionText,
                  answerType === 'numerical' && styles.answerTypeOptionTextSelected,
                ]}
              >
                Numerical
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.answerTypeOption,
                answerType === 'mcq' && styles.answerTypeOptionSelected,
              ]}
              onPress={() => setAnswerType('mcq')}
            >
              <Text
                style={[
                  styles.answerTypeOptionText,
                  answerType === 'mcq' && styles.answerTypeOptionTextSelected,
                ]}
              >
                Multiple Choice
              </Text>
            </TouchableOpacity>
          </View>

          <Input
            label="Correct Answer"
            value={correctAnswer}
            onChangeText={setCorrectAnswer}
            placeholder={
              answerType === 'mcq'
                ? 'Enter the correct option'
                : 'Enter the numerical answer'
            }
            keyboardType={answerType === 'numerical' ? 'numeric' : 'default'}
          />

          {answerType === 'mcq' && (
            <>
              <Text style={styles.label}>Options</Text>
              {options.map((option, index) => (
                <Input
                  key={index}
                  value={option}
                  onChangeText={(value) => updateOption(index, value)}
                  placeholder={`Option ${index + 1}`}
                />
              ))}
            </>
          )}

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.buttonRow}>
            <Button
              title="Preview"
              onPress={handlePreview}
              variant="outline"
            />
            <View style={styles.buttonSpacer} />
            <Button
              title="Post Puzzle"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
            />
          </View>
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
    height: 200,
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
    resizeMode: 'contain',
  },
  timingOptions: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  timingOption: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    borderRadius: 8,
  },
  timingOptionSelected: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  timingOptionText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  timingOptionTextSelected: {
    color: COLORS.white,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  dateTimeField: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  answerTypeOptions: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  answerTypeOption: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    borderRadius: 8,
  },
  answerTypeOptionSelected: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  answerTypeOptionText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  answerTypeOptionTextSelected: {
    color: COLORS.white,
  },
  error: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    marginBottom: SPACING.md,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
  buttonSpacer: {
    width: SPACING.md,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  previewCloseButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: SPACING.md,
    alignSelf: 'flex-start',
  },
  previewCloseText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.semiBold,
    color: COLORS.primaryDark,
  },
  previewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewChannelName: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  previewTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  previewImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: SPACING.md,
    borderRadius: 8,
  },
  previewAnswerType: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.semiBold,
    color: COLORS.primaryDark,
    marginBottom: SPACING.sm,
  },
  previewOptions: {
    marginTop: SPACING.sm,
  },
  previewOption: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  previewOptionText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
});
