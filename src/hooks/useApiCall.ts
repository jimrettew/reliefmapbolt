import { useState, useCallback } from 'react';

interface ApiCallState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiCallReturn<T> extends ApiCallState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApiCall<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  initialData: T | null = null
): UseApiCallReturn<T> {
  const [state, setState] = useState<ApiCallState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
      } catch (error) {
        console.error('API call failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}
