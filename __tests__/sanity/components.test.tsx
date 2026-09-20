// Sanity tests for core UI components
// These tests verify that key components render without crashing

import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import RootButton from '@/components/RootButton';

describe('Sanity: UI Components', () => {
  describe('Button', () => {
    it('renders with title', () => {
      const { getByText } = render(
        <Button title="Test Button" onPress={() => {}} />
      );
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Button title="Click Me" onPress={onPressMock} />
      );
      fireEvent.press(getByText('Click Me'));
      expect(onPressMock).toHaveBeenCalled();
    });

    it('renders all variants without crashing', () => {
      const variants = ['primary', 'secondary', 'outline', 'danger'] as const;
      variants.forEach((variant) => {
        const { getByText } = render(
          <Button title={variant} onPress={() => {}} variant={variant} />
        );
        expect(getByText(variant)).toBeTruthy();
      });
    });

    it('shows loading indicator when loading', () => {
      const { queryByText } = render(
        <Button title="Loading" onPress={() => {}} loading />
      );
      expect(queryByText('Loading')).toBeNull();
    });
  });

  describe('Card', () => {
    it('renders children', () => {
      const { getByText } = render(
        <Card>
          <Text>Card Content</Text>
        </Card>
      );
      expect(getByText('Card Content')).toBeTruthy();
    });

    it('is pressable when onPress is provided', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Card onPress={onPressMock}>
          <Text>Pressable Card</Text>
        </Card>
      );
      fireEvent.press(getByText('Pressable Card'));
      expect(onPressMock).toHaveBeenCalled();
    });
  });

  describe('Input', () => {
    it('renders with placeholder', () => {
      const { getByPlaceholderText } = render(
        <Input value="" onChangeText={() => {}} placeholder="Enter text" />
      );
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('displays label when provided', () => {
      const { getByText } = render(
        <Input value="" onChangeText={() => {}} label="Email" />
      );
      expect(getByText('Email')).toBeTruthy();
    });

    it('displays error message when provided', () => {
      const { getByText } = render(
        <Input value="" onChangeText={() => {}} error="Invalid input" />
      );
      expect(getByText('Invalid input')).toBeTruthy();
    });

    it('calls onChangeText when text changes', () => {
      const onChangeMock = jest.fn();
      const { getByPlaceholderText } = render(
        <Input value="" onChangeText={onChangeMock} placeholder="Type here" />
      );
      fireEvent.changeText(getByPlaceholderText('Type here'), 'new value');
      expect(onChangeMock).toHaveBeenCalledWith('new value');
    });
  });

  describe('LoadingSpinner', () => {
    it('renders without crashing', () => {
      const { UNSAFE_root } = render(<LoadingSpinner />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('accepts size prop', () => {
      const { UNSAFE_root: small } = render(<LoadingSpinner size="small" />);
      const { UNSAFE_root: large } = render(<LoadingSpinner size="large" />);
      expect(small).toBeTruthy();
      expect(large).toBeTruthy();
    });
  });

  describe('RootButton', () => {
    it('renders with root symbol', () => {
      const { getByText } = render(
        <RootButton isRooted={false} rootCount={0} onPress={() => {}} />
      );
      expect(getByText('√')).toBeTruthy();
    });

    it('displays root count when greater than 0', () => {
      const { getByText } = render(
        <RootButton isRooted={false} rootCount={5} onPress={() => {}} />
      );
      expect(getByText('5')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <RootButton isRooted={false} rootCount={0} onPress={onPressMock} />
      );
      fireEvent.press(getByText('√'));
      expect(onPressMock).toHaveBeenCalled();
    });
  });
});
