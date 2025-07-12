// API Configuration and Service Layer
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-api.com/api' 
  : 'http://localhost:3001/api';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
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

// Authentication API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),
  
  signup: (userData: { 
    name: string; 
    email: string; 
    password: string; 
    location?: string 
  }) =>
    apiClient.post('/auth/signup', userData),
  
  logout: () =>
    apiClient.post('/auth/logout'),
  
  refreshToken: () =>
    apiClient.post('/auth/refresh'),
  
  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),
  
  verifyEmail: (token: string) =>
    apiClient.post('/auth/verify-email', { token }),
};

// Users API
export const usersAPI = {
  getProfile: (userId?: string) =>
    apiClient.get(`/users/profile${userId ? `/${userId}` : ''}`),
  
  updateProfile: (userData: Partial<any>) =>
    apiClient.put('/users/profile', userData),
  
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

// Swap Requests API
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

// Reviews API
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

// Admin API
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
  
  getSwapRequests: (status?: string) =>
    apiClient.get(`/admin/swap-requests${status ? `?status=${status}` : ''}`),
  
  moderateSwapRequest: (requestId: string, action: 'approve' | 'reject') =>
    apiClient.post(`/admin/swap-requests/${requestId}/${action}`),
  
  getReviews: (params: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    return apiClient.get(`/admin/reviews?${searchParams.toString()}`);
  },
  
  deleteReview: (reviewId: string) =>
    apiClient.delete(`/admin/reviews/${reviewId}`),
  
  getReports: (status?: string) =>
    apiClient.get(`/admin/reports${status ? `?status=${status}` : ''}`),
  
  resolveReport: (reportId: string, action: 'resolve' | 'dismiss') =>
    apiClient.post(`/admin/reports/${reportId}/${action}`),
};

// Notifications API
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

// File Upload API
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
  
  uploadDocument: (file: File, type: string) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    
    return apiClient.request('/upload/document', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
};

// WebSocket connection for real-time features
export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(userId: string) {
    const token = localStorage.getItem('authToken');
    const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/ws?token=${token}&userId=${userId}`;
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect(userId);
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleMessage(data: any) {
    // Handle different message types
    switch (data.type) {
      case 'notification':
        // Dispatch notification event
        window.dispatchEvent(new CustomEvent('notification', { detail: data.payload }));
        break;
      case 'swap_request':
        // Handle swap request updates
        window.dispatchEvent(new CustomEvent('swapRequestUpdate', { detail: data.payload }));
        break;
      case 'message':
        // Handle chat messages
        window.dispatchEvent(new CustomEvent('newMessage', { detail: data.payload }));
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  private attemptReconnect(userId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect(userId);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();