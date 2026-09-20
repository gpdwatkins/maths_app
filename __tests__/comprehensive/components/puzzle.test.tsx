// Comprehensive tests for puzzle components

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import PuzzleCard from '@/components/puzzle/PuzzleCard';
import RootButton from '@/components/RootButton';
import { Puzzle } from '@/types/puzzle.types';

const mockPuzzle: Puzzle = {
  id: '1',
  channelId: 'channel-1',
  channelName: 'Math Puzzles',
  title: 'Test Puzzle',
  imageUrl: 'https://example.com/puzzle.jpg',
  publishDate: new Date().toISOString(),
  answerType: 'mcq',
  correctAnswer: 'A',
  options: ['A', 'B', 'C', 'D'],
  isSolved: false,
  isShared: false,
};

describe('Comprehensive: PuzzleCard Component', () => {
  it('renders puzzle title', () => {
    const { getByText } = render(
      <PuzzleCard puzzle={mockPuzzle} onPress={() => {}} />
    );
    expect(getByText('Test Puzzle')).toBeTruthy();
  });

  it('renders puzzle date', () => {
    const { getByText } = render(
      <PuzzleCard puzzle={mockPuzzle} onPress={() => {}} />
    );
    // formatDate returns "Just now" for recent dates
    expect(getByText('Just now')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <PuzzleCard puzzle={mockPuzzle} onPress={onPressMock} />
    );
    fireEvent.press(getByText('Test Puzzle'));
    expect(onPressMock).toHaveBeenCalled();
  });

  describe('Solved badge', () => {
    it('shows solved badge when puzzle is solved', () => {
      const solvedPuzzle = { ...mockPuzzle, isSolved: true };
      const { getByText } = render(
        <PuzzleCard puzzle={solvedPuzzle} onPress={() => {}} />
      );
      expect(getByText('✓ Solved')).toBeTruthy();
    });

    it('does not show solved badge when puzzle is not solved', () => {
      const { queryByText } = render(
        <PuzzleCard puzzle={mockPuzzle} onPress={() => {}} />
      );
      expect(queryByText('✓ Solved')).toBeNull();
    });
  });

  describe('Shared badge', () => {
    it('shows shared badge when puzzle is shared', () => {
      const sharedPuzzle = { ...mockPuzzle, isShared: true };
      const { getByText } = render(
        <PuzzleCard puzzle={sharedPuzzle} onPress={() => {}} />
      );
      expect(getByText('Shared')).toBeTruthy();
    });

    it('does not show shared badge when puzzle is not shared', () => {
      const { queryByText } = render(
        <PuzzleCard puzzle={mockPuzzle} onPress={() => {}} />
      );
      expect(queryByText('Shared')).toBeNull();
    });
  });

  it('shows both badges when puzzle is solved and shared', () => {
    const solvedAndShared = { ...mockPuzzle, isSolved: true, isShared: true };
    const { getByText } = render(
      <PuzzleCard puzzle={solvedAndShared} onPress={() => {}} />
    );
    expect(getByText('✓ Solved')).toBeTruthy();
    expect(getByText('Shared')).toBeTruthy();
  });
});

describe('Comprehensive: RootButton Component', () => {
  describe('Basic rendering', () => {
    it('renders root symbol', () => {
      const { getByText } = render(
        <RootButton isRooted={false} rootCount={0} onPress={() => {}} />
      );
      expect(getByText('√')).toBeTruthy();
    });
  });

  describe('Root count', () => {
    it('shows count when greater than 0', () => {
      const { getByText } = render(
        <RootButton isRooted={false} rootCount={10} onPress={() => {}} />
      );
      expect(getByText('10')).toBeTruthy();
    });

    it('does not show count when 0', () => {
      const { queryByText } = render(
        <RootButton isRooted={false} rootCount={0} onPress={() => {}} />
      );
      // Should only have the √ symbol, not "0"
      expect(queryByText('0')).toBeNull();
    });

    it('shows large count correctly', () => {
      const { getByText } = render(
        <RootButton isRooted={false} rootCount={999} onPress={() => {}} />
      );
      expect(getByText('999')).toBeTruthy();
    });
  });

  describe('Rooted state', () => {
    it('renders differently when rooted', () => {
      const { getByText } = render(
        <RootButton isRooted={true} rootCount={5} onPress={() => {}} />
      );
      expect(getByText('√')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
    });
  });

  describe('Disabled state', () => {
    it('does not call onPress when disabled', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <RootButton isRooted={false} rootCount={0} onPress={onPressMock} disabled />
      );
      fireEvent.press(getByText('√'));
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Press handling', () => {
    it('calls onPress when pressed', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <RootButton isRooted={false} rootCount={0} onPress={onPressMock} />
      );
      fireEvent.press(getByText('√'));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('can be pressed multiple times', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <RootButton isRooted={false} rootCount={0} onPress={onPressMock} />
      );
      fireEvent.press(getByText('√'));
      fireEvent.press(getByText('√'));
      fireEvent.press(getByText('√'));
      expect(onPressMock).toHaveBeenCalledTimes(3);
    });
  });
});
