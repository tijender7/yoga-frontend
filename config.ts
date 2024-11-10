// frontend/config.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.yogforever.com';

export const API_ROUTES = {
  SIGNUP: `${BASE_URL}/api/auth/signup`,
  FREE_CLASS: `${BASE_URL}/api/free-class`,
  CONTACT: `${BASE_URL}/api/contact`
};

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
}