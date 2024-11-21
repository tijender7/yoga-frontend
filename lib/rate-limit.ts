// frontend/lib/rate-limit.ts
interface RateLimitConfig {
    windowMs: number;  // Time window in milliseconds
    max: number;      // Maximum requests in window
  }
  
  const RATE_LIMITS: Record<string, RateLimitConfig> = {
    'payment': { windowMs: 3600000, max: 10 },     // 10 requests per hour
    'email-check': { windowMs: 60000, max: 5 },    // 5 requests per minute
    'password-reset': { windowMs: 300000, max: 3 }  // 3 requests per 5 minutes
  };
  
  interface RateLimitStore {
    count: number;
    resetTime: number;
  }
  
  const rateLimitStore = new Map<string, RateLimitStore>();
  
  export const rateLimit = async (
    action: keyof typeof RATE_LIMITS,
    identifier: string
  ): Promise<{ success: boolean; remaining: number; resetIn: number }> => {
    const key = `${action}:${identifier}`;
    const config = RATE_LIMITS[action];
    const now = Date.now();
  
    // Get or create limit data
    const limitData = rateLimitStore.get(key) || {
      count: 0,
      resetTime: now + config.windowMs
    };
  
    // Reset if window has passed
    if (now > limitData.resetTime) {
      limitData.count = 0;
      limitData.resetTime = now + config.windowMs;
    }
  
    limitData.count++;
    rateLimitStore.set(key, limitData);
  
    return {
      success: limitData.count <= config.max,
      remaining: Math.max(0, config.max - limitData.count),
      resetIn: limitData.resetTime - now
    };
  };