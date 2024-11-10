// frontend/config.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  console.error('NEXT_PUBLIC_API_URL is not set');
}

export const API_URL = BASE_URL || 'https://api.yogforever.com';

export const API_ROUTES = {
  SIGNUP: `${API_URL}/api/auth/signup`,
  FREE_CLASS: `${API_URL}/api/free-class`,
  CONTACT: `${API_URL}/api/contact`,
  PAYMENT: `${API_URL}/api/create-payment`
};