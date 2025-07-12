// Environment configuration
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'SkillSwap',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const;

// Validate required environment variables
if (!ENV.API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}

export default ENV;