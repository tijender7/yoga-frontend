// frontend/config.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  console.warn('NEXT_PUBLIC_API_URL is not set, using fallback URL');
}

export const API_URL = BASE_URL || 'https://api.yogforever.com';

// Add logging
console.log('API_URL:', API_URL);

export const API_ROUTES = {
  SIGNUP: `${API_URL}/api/auth/signup`,
  FREE_CLASS: `${API_URL}/api/free-class`,
  CONTACT: `${API_URL}/api/contact`,
  PAYMENT: `${API_URL}/api/create-payment`,
  CHECK_EMAIL: `${API_URL}/api/auth/check-email`,
};