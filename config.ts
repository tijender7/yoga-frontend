// frontend/config.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.yogforever.com';
const AUTH_REDIRECT_URL = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || 'https://yogforever.com/auth';

// Add validation and logging
if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL) {
  console.warn('[CONFIG] Using production URLs as fallback');
}

export const API_URL = BASE_URL;
export const REDIRECT_URL = AUTH_REDIRECT_URL;

// Log current configuration
console.log('[CONFIG] API_URL:', API_URL);
console.log('[CONFIG] REDIRECT_URL:', REDIRECT_URL);

export const API_ROUTES = {
  SIGNUP: `${API_URL}/api/auth/signup`,
  FREE_CLASS: `${API_URL}/api/free-class`,
  CONTACT: `${API_URL}/api/contact`,
  PAYMENT: `${API_URL}/api/create-payment`,
  CHECK_EMAIL: `${API_URL}/api/auth/check-email`,
};