// frontend/lib/validators.ts
export const validators = {
    amount: (amount: number): boolean => {
      return (
        typeof amount === 'number' &&
        amount > 0 &&
        amount <= 1000000 && // Maximum amount limit
        Number.isFinite(amount)
      );
    },
    
    currency: (currency: string): boolean => {
      return ['INR', 'USD', 'EUR'].includes(currency);
    },
    
    email: (email: string): boolean => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    paymentLink: (url: string): boolean => {
      try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === 'https:';
      } catch {
        return false;
      }
    }
  };