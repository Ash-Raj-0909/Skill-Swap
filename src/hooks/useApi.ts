import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '../services/api';

// Generic hook for API calls with loading, error, and data states
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'An error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Hook for API calls that don't auto-execute
export function useLazyApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      if (response.success && response.data) {
        setData(response.data);
        return response.data;
      } else {
        const errorMessage = response.error || 'An error occurred';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

// Hook for paginated API calls
export function usePaginatedApi<T>(
  apiCall: (page: number, limit: number) => Promise<ApiResponse<{ data: T[]; pagination: any }>>,
  limit: number = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchData = useCallback(async (page: number, append: boolean = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const response = await apiCall(page, limit);
      if (response.success && response.data) {
        const { data: newData, pagination: newPagination } = response.data;
        
        if (append) {
          setData(prev => [...prev, ...newData]);
        } else {
          setData(newData);
        }
        
        setPagination(newPagination);
      } else {
        setError(response.error || 'An error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [apiCall, limit]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const loadMore = useCallback(() => {
    if (pagination.page < pagination.totalPages && !loadingMore) {
      fetchData(pagination.page + 1, true);
    }
  }, [fetchData, pagination.page, pagination.totalPages, loadingMore]);

  const refresh = useCallback(() => {
    fetchData(1);
  }, [fetchData]);

  const hasMore = pagination.page < pagination.totalPages;

  return { 
    data, 
    pagination, 
    loading, 
    loadingMore, 
    error, 
    loadMore, 
    refresh, 
    hasMore 
  };
}

// Hook for optimistic updates
export function useOptimisticUpdate<T>() {
  const [optimisticData, setOptimisticData] = useState<T | null>(null);
  const [isOptimistic, setIsOptimistic] = useState(false);

  const performOptimisticUpdate = useCallback(
    async <R>(
      optimisticValue: T,
      apiCall: () => Promise<ApiResponse<R>>,
      onSuccess?: (result: R) => void,
      onError?: (error: string) => void
    ) => {
      // Set optimistic value
      setOptimisticData(optimisticValue);
      setIsOptimistic(true);

      try {
        const response = await apiCall();
        
        if (response.success && response.data) {
          // Success - keep optimistic data or update with server response
          if (onSuccess) {
            onSuccess(response.data);
          }
        } else {
          // Revert optimistic update
          setOptimisticData(null);
          if (onError) {
            onError(response.error || 'An error occurred');
          }
        }
      } catch (err) {
        // Revert optimistic update
        setOptimisticData(null);
        if (onError) {
          onError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        setIsOptimistic(false);
      }
    },
    []
  );

  const clearOptimistic = useCallback(() => {
    setOptimisticData(null);
    setIsOptimistic(false);
  }, []);

  return {
    optimisticData,
    isOptimistic,
    performOptimisticUpdate,
    clearOptimistic
  };
}

// Hook for debounced API calls (useful for search)
export function useDebouncedApi<T>(
  apiCall: (query: string) => Promise<ApiResponse<T>>,
  delay: number = 300
) {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setData(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiCall(query);
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.error || 'An error occurred');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, apiCall, delay]);

  return { query, setQuery, data, loading, error };
}