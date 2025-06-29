import { useState, useCallback } from 'react';

export interface AuthError {
  code: string;
  message: string;
  userFriendlyMessage: string;
  canRetry: boolean;
}

export function useAuthError() {
  const [error, setError] = useState<AuthError | null>(null);

  const handleAuthError = useCallback((authError: any): AuthError => {
    let authErrorObj: AuthError;

    // Handle different types of authentication errors
    if (authError?.code === 'auth/user-not-found') {
      authErrorObj = {
        code: authError.code,
        message: authError.message,
        userFriendlyMessage: 'No account found with this email address.',
        canRetry: true,
      };
    } else if (authError?.code === 'auth/wrong-password') {
      authErrorObj = {
        code: authError.code,
        message: authError.message,
        userFriendlyMessage: 'Incorrect password. Please try again.',
        canRetry: true,
      };
    } else if (authError?.code === 'auth/email-already-in-use') {
      authErrorObj = {
        code: authError.code,
        message: authError.message,
        userFriendlyMessage: 'An account with this email already exists.',
        canRetry: false,
      };
    } else if (authError?.code === 'auth/weak-password') {
      authErrorObj = {
        code: authError.code,
        message: authError.message,
        userFriendlyMessage: 'Password is too weak. Please choose a stronger password.',
        canRetry: true,
      };
    } else if (authError?.code === 'auth/invalid-email') {
      authErrorObj = {
        code: authError.code,
        message: authError.message,
        userFriendlyMessage: 'Please enter a valid email address.',
        canRetry: true,
      };
    } else if (authError?.code === 'auth/network-request-failed') {
      authErrorObj = {
        code: authError.code,
        message: authError.message,
        userFriendlyMessage: 'Network error. Please check your internet connection.',
        canRetry: true,
      };
    } else {
      // Generic error
      authErrorObj = {
        code: authError?.code || 'unknown',
        message: authError?.message || 'An unexpected error occurred',
        userFriendlyMessage: 'Something went wrong. Please try again.',
        canRetry: true,
      };
    }

    setError(authErrorObj);
    return authErrorObj;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleAuthError,
    clearError,
  };
}
