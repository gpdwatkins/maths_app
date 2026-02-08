// Admin puzzle creation screen

import { View, ScrollView, StyleSheet, Text, Image, Alert } from 'react-native';
import { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/hooks/useAuth';
import { puzzleService } from '@/services/puzzle.service';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '@/utils/constants';

export default function CreatePuzzleScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [imageUri, setImageUri] = useState('');
  const [title, setTitle] = useState('');
  const [channelId, setChannelId] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [answerType, setAnswerType] = useState<'mcq' | 'numerical'>('numerical');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [submitting, setSubmitting] = useState(false);

  // TODO: Add proper auth check for admin users
  // For now, assume any authenticated user can access

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!imageUri || !title || !channelId || !publishDate || !correctAnswer) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (answerType === 'mcq' && options.some(opt => !opt)) {
      Alert.alert('Error', 'Please fill in all MCQ options');
      return;
    }

    setSubmitting(true);
    try {
      await puzzleService.createPuzzle({
        channelId,
        title,
        imageUri,
        publishDate,
        answerType,
        correctAnswer,
        options: answerType === 'mcq' ? options : undefined,
      }, user!.id);

      Alert.alert('Success', 'Puzzle created successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create puzzle');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Create Puzzle' }} />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Puzzle Image</Text>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}
          <Button title="Pick Image" onPress={pickImage} variant="outline" fullWidth />

          <Input
            label="Puzzle Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter puzzle title"
          />

          <Input
            label="Channel ID"
            value={channelId}
            onChangeText={setChannelId}
            placeholder="Enter channel ID"
          />

          <Input
            label="Publish Date (YYYY-MM-DD HH:MM)"
            value={publishDate}
            onChangeText={setPublishDate}
            placeholder="2024-01-01 12:00"
          />

          <Text style={styles.sectionTitle}>Answer Type</Text>
          <View style={styles.typeButtons}>
            <Button
              title="Numerical"
              onPress={() => setAnswerType('numerical')}
              variant={answerType === 'numerical' ? 'primary' : 'outline'}
            />
            <Button
              title="Multiple Choice"
              onPress={() => setAnswerType('mcq')}
              variant={answerType === 'mcq' ? 'primary' : 'outline'}
            />
          </View>

          {answerType === 'mcq' && (
            <>
              <Text style={styles.sectionTitle}>Options</Text>
              {options.map((option, index) => (
                <Input
                  key={index}
                  label={`Option ${index + 1}`}
                  value={option}
                  onChangeText={(text) => {
                    const newOptions = [...options];
                    newOptions[index] = text;
                    setOptions(newOptions);
                  }}
                  placeholder={`Enter option ${index + 1}`}
                />
              ))}
            </>
          )}

          <Input
            label="Correct Answer"
            value={correctAnswer}
            onChangeText={setCorrectAnswer}
            placeholder="Enter correct answer"
          />

          <Button
            title="Create Puzzle"
            onPress={handleSubmit}
            loading={submitting}
            fullWidth
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  placeholderText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textLight,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
});