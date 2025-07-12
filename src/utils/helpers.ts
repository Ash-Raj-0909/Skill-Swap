import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';

// Validation Helpers
export const validateEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL.test(email);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`;
  }
  return null;
};

export const validateName = (name: string): string | null => {
  if (name.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters long`;
  }
  if (name.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    return `Name must be less than ${VALIDATION_RULES.NAME_MAX_LENGTH} characters`;
  }
  return null;
};

export const validateMessage = (message: string): string | null => {
  if (message.length < VALIDATION_RULES.MESSAGE_MIN_LENGTH) {
    return `Message must be at least ${VALIDATION_RULES.MESSAGE_MIN_LENGTH} characters long`;
  }
  if (message.length > VALIDATION_RULES.MESSAGE_MAX_LENGTH) {
    return `Message must be less than ${VALIDATION_RULES.MESSAGE_MAX_LENGTH} characters`;
  }
  return null;
};

// Date Helpers
export const formatDate = (date: string | Date, includeTime: boolean = false): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (includeTime) {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return formatDate(dateObj);
};

// String Helpers
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Array Helpers
export const removeDuplicates = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const groupBy = <T, K extends keyof any>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = key(item);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

// File Helpers
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

// URL Helpers
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  return searchParams.toString();
};

export const parseQueryString = (queryString: string): Record<string, string | string[]> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string | string[]> = {};
  
  for (const [key, value] of params.entries()) {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        (result[key] as string[]).push(value);
      } else {
        result[key] = [result[key] as string, value];
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
};

// Local Storage Helpers
export const setStorageItem = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Error Handling Helpers
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return ERROR_MESSAGES.UNKNOWN_ERROR;
};

export const isNetworkError = (error: any): boolean => {
  return !navigator.onLine || error?.code === 'NETWORK_ERROR';
};

// Debounce Helper
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle Helper
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Color Helpers
export const generateAvatarColor = (name: string): string => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

// Rating Helpers
export const calculateAverageRating = (ratings: number[]): number => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
};

export const getRatingStars = (rating: number): { full: number; half: boolean; empty: number } => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  
  return { full, half, empty };
};

// Search Helpers
export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

export const fuzzySearch = (items: any[], searchTerm: string, keys: string[]): any[] => {
  if (!searchTerm) return items;
  
  const searchLower = searchTerm.toLowerCase();
  
  return items.filter(item => {
    return keys.some(key => {
      const value = key.split('.').reduce((obj, k) => obj?.[k], item);
      return value?.toString().toLowerCase().includes(searchLower);
    });
  });
};