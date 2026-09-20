// Snapshot tests for UI components
// These tests capture the rendered output to detect unintended visual changes

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import RootButton from '@/components/RootButton';

describe('Snapshots: UI Components', () => {
  describe('Button', () => {
    it('matches snapshot for primary variant', () => {
      const { toJSON } = render(
        <Button title="Primary Button" onPress={() => {}} variant="primary" />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('matches snapshot for secondary variant', () => {
      const { toJSON } = render(
        <Button title="Secondary Button" onPress={() => {}} variant="secondary" />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('matches snapshot for outline variant', () => {
      const { toJSON } = render(
        <Button title="Outline Button" onPress={() => {}} variant="outline" />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('matches snapshot for danger variant', () => {
      const { toJSON } = render(
        <Button title="Danger Button" onPress={() => {}} variant="danger" />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('matches snapshot for disabled state', () => {
      const { toJSON } = render(
        <Button title="Disabled Button" onPress={() => {}} disabled />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('matches snapshot for loading state', () => {
      const { toJSON } = render(
        <Button title="Loading Button" onPress={() => {}} loading />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('matches snapshot for full width', () => {
      const { toJSON } = render(
        <Button title="Full Width Button" onPress={() => {}} fullWidth />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Card', () => {
    it('matches snapshot for basic card', () => {
      const { toJSON } = render(
        <Card>
          <Text>Card Content</Text>
        </Card>
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('matches snapshot for pressable card', () => {
      const { toJSON } = render(
        <Card onPress={() => {}}>
          <Text>Pressable Card</Text>
        </Card>
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Input', () => {
    it('matches snapshot for basic input', () => {
      const { toJSON } = render(
        <Input value="" onChangeText={() => {}} placeholder="Enter text" />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('matches snapshot with label', () => {
      const { toJSON } = render(
        <Input
          value=""
          onChangeText={() => {}}
          label="Email"
          placeholder="Enter email"
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('matches snapshot with error', () => {
      const { toJSON } = render(
        <Input
          value=""
          onChangeText={() => {}}
          label="Email"
          error="Invalid email"
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('matches snapshot with value', () => {
      const { toJSON } = render(
        <Input value="test@example.com" onChangeText={() => {}} label="Email" />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('LoadingSpinner', () => {
    it('matches snapshot for default size', () => {
      const { toJSON } = render(<LoadingSpinner />);
      expect(toJSON()).toMatchSnapshot();
    });

    it('matches snapshot for small size', () => {
      const { toJSON } = render(<LoadingSpinner size="small" />);
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('EmptyState', () => {
    it('matches snapshot', () => {
      const { toJSON } = render(
        <EmptyState title="No Items" message="There are no items to display" />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('RootButton', () => {
    it('matches snapshot for default state', () => {
      const { toJSON } = render(
        <RootButton isRooted={false} rootCount={0} onPress={() => {}} />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('matches snapshot for rooted state', () => {
      const { toJSON } = render(
        <RootButton isRooted={true} rootCount={5} onPress={() => {}} />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('matches snapshot with high count', () => {
      const { toJSON } = render(
        <RootButton isRooted={false} rootCount={999} onPress={() => {}} />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
