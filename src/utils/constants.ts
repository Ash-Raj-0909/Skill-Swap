// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',

  // Users
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  USER_SEARCH: '/users/search',
  USER_STATS: '/users/stats',

  // Swap Requests
  SWAP_REQUESTS: '/swap-requests',
  SWAP_REQUEST_STATUS: '/swap-requests/:id/status',

  // Reviews
  REVIEWS: '/reviews',
  REVIEW_STATS: '/reviews/stats',

  // Admin
  ADMIN_STATS: '/admin/stats',
  ADMIN_USERS: '/admin/users',
  ADMIN_SWAP_REQUESTS: '/admin/swap-requests',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_REPORTS: '/admin/reports',

  // Notifications
  NOTIFICATIONS: '/notifications',
  MARK_NOTIFICATION_READ: '/notifications/:id/read',
  MARK_ALL_NOTIFICATIONS_READ: '/notifications/read-all',

  // File Upload
  UPLOAD_PROFILE_PHOTO: '/upload/profile-photo',
  UPLOAD_DOCUMENT: '/upload/document',

  // WebSocket
  WEBSOCKET: '/ws'
};

// Application Constants
export const APP_CONFIG = {
  APP_NAME: 'SkillSwap',
  APP_VERSION: '1.0.0',
  API_TIMEOUT: 30000, // 30 seconds
  PAGINATION_LIMIT: 20,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  SUPPORTED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Skill Categories
export const SKILL_CATEGORIES = {
  TECHNOLOGY: [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java',
    'C++', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter',
    'Vue.js', 'Angular', 'Django', 'Flask', 'Express.js', 'Spring Boot',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'DevOps', 'CI/CD',
    'Machine Learning', 'Data Science', 'AI', 'Blockchain', 'Cybersecurity'
  ],
  DESIGN: [
    'UI/UX Design', 'Graphic Design', 'Web Design', 'Logo Design',
    'Branding', 'Illustration', 'Animation', 'Video Editing',
    'Photoshop', 'Illustrator', 'Figma', 'Sketch', 'InDesign',
    'After Effects', 'Premiere Pro', 'Blender', '3D Modeling'
  ],
  BUSINESS: [
    'Marketing', 'Digital Marketing', 'SEO', 'SEM', 'Social Media Marketing',
    'Content Marketing', 'Email Marketing', 'Sales', 'Business Development',
    'Project Management', 'Product Management', 'Data Analysis',
    'Financial Analysis', 'Accounting', 'Entrepreneurship', 'Leadership'
  ],
  LANGUAGES: [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Chinese (Mandarin)', 'Japanese', 'Korean', 'Arabic', 'Russian',
    'Hindi', 'Dutch', 'Swedish', 'Norwegian', 'Danish'
  ],
  CREATIVE: [
    'Writing', 'Creative Writing', 'Copywriting', 'Technical Writing',
    'Photography', 'Videography', 'Music Production', 'Guitar',
    'Piano', 'Singing', 'Drawing', 'Painting', 'Crafts', 'Cooking',
    'Baking', 'Fashion Design'
  ],
  LIFESTYLE: [
    'Fitness', 'Yoga', 'Meditation', 'Nutrition', 'Personal Training',
    'Life Coaching', 'Public Speaking', 'Communication Skills',
    'Time Management', 'Productivity', 'Mindfulness', 'Stress Management'
  ]
};

// User Availability Options
export const AVAILABILITY_OPTIONS = [
  'Weekdays',
  'Weekends',
  'Mornings',
  'Afternoons',
  'Evenings',
  'Flexible'
];

// Notification Types
export const NOTIFICATION_TYPES = {
  SWAP_REQUEST: 'swap_request',
  SWAP_ACCEPTED: 'swap_accepted',
  SWAP_REJECTED: 'swap_rejected',
  SWAP_COMPLETED: 'swap_completed',
  REVIEW_RECEIVED: 'review_received',
  SYSTEM: 'system',
  REMINDER: 'reminder'
};

// Swap Request Status
export const SWAP_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  SWAP_REQUEST_SENT: 'Swap request sent successfully!',
  SWAP_REQUEST_ACCEPTED: 'Swap request accepted!',
  SWAP_REQUEST_REJECTED: 'Swap request rejected.',
  REVIEW_SUBMITTED: 'Review submitted successfully!',
  PASSWORD_RESET: 'Password reset email sent!',
  EMAIL_VERIFIED: 'Email verified successfully!'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// Theme Configuration
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 500,
  SKILLS_MAX_COUNT: 10
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy at h:mm a',
  ISO: 'yyyy-MM-dd',
  TIME: 'h:mm a'
};

// File Upload Limits
export const UPLOAD_LIMITS = {
  PROFILE_PHOTO: {
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp']
  },
  DOCUMENT: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  }
};