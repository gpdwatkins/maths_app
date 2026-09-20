// Comprehensive tests for auth components

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import EmailAuthForm from '@/components/auth/EmailAuthForm';

describe('Comprehensive: EmailAuthForm Component', () => {
  describe('Login mode', () => {
    it('renders email and password fields', () => {
      const { getByText, getByPlaceholderText } = render(
        <EmailAuthForm mode="login" onSubmit={async () => {}} />
      );
      expect(getByText('Email')).toBeTruthy();
      expect(getByText('Password')).toBeTruthy();
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
      expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    });

    it('does not show username field', () => {
      const { queryByText } = render(
        <EmailAuthForm mode="login" onSubmit={async () => {}} />
      );
      expect(queryByText('Username')).toBeNull();
    });

    it('shows Sign In button', () => {
      const { getByText } = render(
        <EmailAuthForm mode="login" onSubmit={async () => {}} />
      );
      expect(getByText('Sign In')).toBeTruthy();
    });
  });

  describe('Register mode', () => {
    it('renders username, email and password fields', () => {
      const { getByText } = render(
        <EmailAuthForm mode="register" onSubmit={async () => {}} />
      );
      expect(getByText('Username')).toBeTruthy();
      expect(getByText('Email')).toBeTruthy();
      expect(getByText('Password')).toBeTruthy();
    });

    it('shows Create Account button', () => {
      const { getByText } = render(
        <EmailAuthForm mode="register" onSubmit={async () => {}} />
      );
      expect(getByText('Create Account')).toBeTruthy();
    });
  });

  describe('Validation', () => {
    it('shows error for empty email', async () => {
      const onSubmitMock = jest.fn();
      const { getByText } = render(
        <EmailAuthForm mode="login" onSubmit={onSubmitMock} />
      );

      fireEvent.press(getByText('Sign In'));

      await waitFor(() => {
        expect(getByText('Email is required')).toBeTruthy();
      });
      expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it('shows error for invalid email format', async () => {
      const onSubmitMock = jest.fn();
      const { getByText, getByPlaceholderText } = render(
        <EmailAuthForm mode="login" onSubmit={onSubmitMock} />
      );

      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'invalid');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
      fireEvent.press(getByText('Sign In'));

      await waitFor(() => {
        expect(getByText('Invalid email format')).toBeTruthy();
      });
      expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it('shows error for empty password', async () => {
      const onSubmitMock = jest.fn();
      const { getByText, getByPlaceholderText } = render(
        <EmailAuthForm mode="login" onSubmit={onSubmitMock} />
      );

      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
      fireEvent.press(getByText('Sign In'));

      await waitFor(() => {
        expect(getByText('Password is required')).toBeTruthy();
      });
      expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it('shows error for short password', async () => {
      const onSubmitMock = jest.fn();
      const { getByText, getByPlaceholderText } = render(
        <EmailAuthForm mode="login" onSubmit={onSubmitMock} />
      );

      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), '12345');
      fireEvent.press(getByText('Sign In'));

      await waitFor(() => {
        expect(getByText('Password must be at least 6 characters')).toBeTruthy();
      });
      expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it('shows error for empty username in register mode', async () => {
      const onSubmitMock = jest.fn();
      const { getByText, getByPlaceholderText } = render(
        <EmailAuthForm mode="register" onSubmit={onSubmitMock} />
      );

      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
      fireEvent.press(getByText('Create Account'));

      await waitFor(() => {
        expect(getByText('Username is required')).toBeTruthy();
      });
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });

  describe('Successful submission', () => {
    it('calls onSubmit with credentials for login', async () => {
      const onSubmitMock = jest.fn().mockResolvedValue(undefined);
      const { getByText, getByPlaceholderText } = render(
        <EmailAuthForm mode="login" onSubmit={onSubmitMock} />
      );

      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
      fireEvent.press(getByText('Sign In'));

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledWith('test@example.com', 'password123', '');
      });
    });

    it('calls onSubmit with credentials and username for register', async () => {
      const onSubmitMock = jest.fn().mockResolvedValue(undefined);
      const { getByText, getByPlaceholderText } = render(
        <EmailAuthForm mode="register" onSubmit={onSubmitMock} />
      );

      fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
      fireEvent.press(getByText('Create Account'));

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledWith('test@example.com', 'password123', 'testuser');
      });
    });
  });

  describe('Error handling', () => {
    it('displays error message when submission fails', async () => {
      const onSubmitMock = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
      const { getByText, getByPlaceholderText } = render(
        <EmailAuthForm mode="login" onSubmit={onSubmitMock} />
      );

      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
      fireEvent.press(getByText('Sign In'));

      await waitFor(() => {
        expect(getByText('Invalid credentials')).toBeTruthy();
      });
    });
  });
});
