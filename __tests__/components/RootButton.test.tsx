// Tests for RootButton component

import { render, fireEvent } from '@testing-library/react-native';
import RootButton from '@/components/RootButton';

describe('RootButton', () => {
  it('renders correctly when not rooted', () => {
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

  it('is disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <RootButton isRooted={false} rootCount={0} onPress={onPressMock} disabled />
    );
    
    const button = getByText('√').parent;
    expect(button?.props.accessibilityState?.disabled).toBe(true);
  });
});