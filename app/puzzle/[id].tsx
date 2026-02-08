// Individual puzzle screen

import { View, ScrollView, StyleSheet, Text, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { puzzleService } from '@/services/puzzle.service';
import { feedService } from '@/services/feed.service';
import PuzzleImage from '@/components/puzzle/PuzzleImage';
import MultipleChoiceInput from '@/components/puzzle/MultipleChoiceInput';
import NumericalInput from '@/components/puzzle/NumericalInput';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SubPageLayout from '@/components/ui/SubPageLayout';
import { Puzzle } from '@/types/puzzle.types';
import { COLORS, SPACING, TYPOGRAPHY, FONTS } from '@/utils/constants';
import { formatDate } from '@/utils/helpers';

export default function PuzzleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  useEffect(() => {
    loadPuzzle();
  }, [id]);

  const loadPuzzle = async () => {
    try {
      const puzzleData = await puzzleService.getPuzzle(id, user!.id);
      setPuzzle(puzzleData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load puzzle');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!answer) return;

    setSubmitting(true);
    try {
      const isCorrect = await puzzleService.submitAnswer(id, user!.id, answer);
      setResult(isCorrect);
      
      if (isCorrect) {
        Alert.alert(
          'Correct!',
          'Would you like to share your completion?',
          [
            { text: 'No', style: 'cancel' },
            {
              text: 'Share',
              onPress: async () => {
                await feedService.shareCompletion(id, user!.id);
                Alert.alert('Shared!', 'Your completion has been shared');
              },
            },
          ]
        );
      } else {
        Alert.alert('Incorrect', 'That\'s not the right answer. You can view the puzzle again, but cannot submit another answer.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SubPageLayout>
        <LoadingSpinner />
      </SubPageLayout>
    );
  }

  if (!puzzle) {
    return null;
  }

  const canSubmit = !user?.isGuest && !puzzle.isSolved;

  return (
    <SubPageLayout>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{puzzle.title}</Text>
          <View style={styles.header}>
            <Text style={styles.channelName}>{puzzle.channelName}</Text>
            <Text style={styles.date}>{formatDate(puzzle.publishDate)}</Text>
          </View>

          <PuzzleImage imageUrl={puzzle.imageUrl} />

          {puzzle.isSolved ? (
            <View style={styles.solvedBanner}>
              <Text style={styles.solvedText}>
                You've already solved this puzzle
                {puzzle.isShared && ' and shared it'}
              </Text>
            </View>
          ) : user?.isGuest ? (
            <View style={styles.guestBanner}>
              <Text style={styles.guestText}>
                Sign in to submit answers
              </Text>
            </View>
          ) : (
            <View style={styles.answerSection}>
              <Text style={styles.answerTitle}>Your Answer</Text>

              {puzzle.answerType === 'mcq' && puzzle.options ? (
                <MultipleChoiceInput
                  options={puzzle.options}
                  selectedOption={answer}
                  onSelect={setAnswer}
                  disabled={!canSubmit}
                />
              ) : (
                <NumericalInput
                  value={answer}
                  onChange={setAnswer}
                  disabled={!canSubmit}
                />
              )}

              <Button
                title="Submit Answer"
                onPress={handleSubmit}
                disabled={!answer || !canSubmit}
                loading={submitting}
                fullWidth
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SubPageLayout>
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
  title: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  header: {
    marginBottom: SPACING.md,
  },
  channelName: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.semiBold,
    color: COLORS.primaryDark,
  },
  date: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  solvedBanner: {
    backgroundColor: COLORS.success,
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
  },
  solvedText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.semiBold,
    color: COLORS.white,
    textAlign: 'center',
  },
  guestBanner: {
    backgroundColor: COLORS.textLight,
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
  },
  guestText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: FONTS.semiBold,
    color: COLORS.white,
    textAlign: 'center',
  },
  answerSection: {
    marginTop: SPACING.lg,
  },
  answerTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
});