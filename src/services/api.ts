import ENV from '../config/env';

// API Configuration using environment variables
const API_BASE_URL = ENV.API_BASE_URL;

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface SignupResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ProfileResponse {
  id: string;
  email: string;
  name: string;
  location?: string;
  skillsOffered?: string[];
  skillsWanted?: string[];
  availability?: string[];
  isPublic?: boolean;
  rating?: number;
  totalSwaps?: number;
}

// HTTP Client with error handling
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.detail || data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data,
        message: data.message,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Authentication API - Updated with your backend endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post<LoginResponse>('/auth/user/login', credentials),
  
  signup: (userData: { 
    name: string; 
    email: string; 
    password: string; 
  }) =>
    apiClient.post<SignupResponse>('/auth/user/signup', userData),
  
  logout: () => {
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    return Promise.resolve({ success: true });
  },
  
  getProfile: () =>
    apiClient.get<ProfileResponse>('/profile'),
};

// Users API
export const usersAPI = {
  getProfile: (userId?: string) =>
    apiClient.get(`/profile${userId ? `/${userId}` : ''}`),
  
  updateProfile: (userData: Partial<any>) =>
    apiClient.put('/profile', userData),
  
  searchUsers: (params: {
    query?: string;
    skillsOffered?: string[];
    skillsWanted?: string[];
    location?: string;
    availability?: string[];
    minRating?: number;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    return apiClient.get(`/users/search?${searchParams.toString()}`);
  },
  
  getUserStats: (userId: string) =>
    apiClient.get(`/users/${userId}/stats`),
};

// Swap Requests API (placeholder - update when backend is ready)
export const swapRequestsAPI = {
  getRequests: (type: 'sent' | 'received', status?: string) =>
    apiClient.get(`/swap-requests?type=${type}${status ? `&status=${status}` : ''}`),
  
  createRequest: (requestData: {
    toUserId: string;
    skillOffered: string;
    skillWanted: string;
    message: string;
  }) =>
    apiClient.post('/swap-requests', requestData),
  
  updateRequestStatus: (requestId: string, status: 'accepted' | 'rejected') =>
    apiClient.patch(`/swap-requests/${requestId}/status`, { status }),
  
  getRequestDetails: (requestId: string) =>
    apiClient.get(`/swap-requests/${requestId}`),
  
  deleteRequest: (requestId: string) =>
    apiClient.delete(`/swap-requests/${requestId}`),
};

// Reviews API (placeholder - update when backend is ready)
export const reviewsAPI = {
  getReviews: (type: 'received' | 'given', userId?: string) =>
    apiClient.get(`/reviews?type=${type}${userId ? `&userId=${userId}` : ''}`),
  
  createReview: (reviewData: {
    swapId: string;
    revieweeId: string;
    rating: number;
    comment: string;
  }) =>
    apiClient.post('/reviews', reviewData),
  
  updateReview: (reviewId: string, reviewData: {
    rating: number;
    comment: string;
  }) =>
    apiClient.put(`/reviews/${reviewId}`, reviewData),
  
  deleteReview: (reviewId: string) =>
    apiClient.delete(`/reviews/${reviewId}`),
  
  getReviewStats: (userId: string) =>
    apiClient.get(`/reviews/stats/${userId}`),
};

// Admin API (placeholder - update when backend is ready)
export const adminAPI = {
  getStats: () =>
    apiClient.get('/admin/stats'),
  
  getUsers: (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    return apiClient.get(`/admin/users?${searchParams.toString()}`);
  },
  
  updateUserStatus: (userId: string, action: 'suspend' | 'activate' | 'delete') =>
    apiClient.post(`/admin/users/${userId}/${action}`),
};

// Notifications API (placeholder - update when backend is ready)
export const notificationsAPI = {
  getNotifications: (page?: number, limit?: number) =>
    apiClient.get(`/notifications?page=${page || 1}&limit=${limit || 20}`),
  
  markAsRead: (notificationId: string) =>
    apiClient.patch(`/notifications/${notificationId}/read`),
  
  markAllAsRead: () =>
    apiClient.patch('/notifications/read-all'),
  
  deleteNotification: (notificationId: string) =>
    apiClient.delete(`/notifications/${notificationId}`),
};

// File Upload API (placeholder - update when backend is ready)
export const uploadAPI = {
  uploadProfilePhoto: (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    
    return apiClient.request('/upload/profile-photo', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
};