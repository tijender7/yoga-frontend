// frontend/config.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
}

export const API_ROUTES = {
  SIGNUP: `${API_URL}/auth/signup`,
  FREE_CLASS: `${API_URL}/auth/free-class`,
}