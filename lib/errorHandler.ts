// lib/errorHandler.ts
// Error types
type ErrorCode = 
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'payment/insufficient-funds'
  | 'payment/creation-failed'
  | 'supabase/query-error'
  | 'network/connection-error';

interface ErrorMapping {
  code: ErrorCode;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

const errorMappings: Record<ErrorCode, ErrorMapping> = {
  'auth/invalid-email': {
    code: 'auth/invalid-email',
    message: 'Please check your email address',
    severity: 'error'
  },
  'auth/user-disabled': {
    code: 'auth/user-disabled',
    message: 'Account is temporarily disabled',
    severity: 'error'
  },
  'payment/insufficient-funds': {
    code: 'payment/insufficient-funds',
    message: 'Payment failed. Please try again',
    severity: 'error'
  },
  'payment/creation-failed': {
    code: 'payment/creation-failed',
    message: 'Unable to process payment. Please try again',
    severity: 'error'
  },
  'supabase/query-error': {
    code: 'supabase/query-error',
    message: 'Unable to fetch data. Please refresh',
    severity: 'warning'
  },
  'network/connection-error': {
    code: 'network/connection-error',
    message: 'Please check your internet connection',
    severity: 'warning'
  }
};

export const errorHandler = {
  // Development logging
  logError: (error: any, context: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${context}]:`, error);
    }
    
    // Optional: Error tracking service integration
    if (process.env.NODE_ENV === 'production') {
      // sendToErrorTracking(error, context);
    }
  },

  // Get user-friendly message
  getUserMessage: (error: any): string => {
    // Handle Supabase specific errors
    if (error?.code?.startsWith('PGRST')) {
      return errorMappings['supabase/query-error'].message;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return errorMappings['network/connection-error'].message;
    }

    // Handle known error codes
    const errorCode = error?.code as ErrorCode;
    if (errorCode && errorMappings[errorCode]) {
      return errorMappings[errorCode].message;
    }

    // Default fallback message
    return 'Something went wrong. Please try again.';
  },

  // Get error severity
  getSeverity: (error: any): 'error' | 'warning' | 'info' => {
    const errorCode = error?.code as ErrorCode;
    return errorMappings[errorCode]?.severity || 'error';
  }
};