import { supabase } from './supabase'
import { API_ROUTES } from '@/config';
import { errorHandler } from '@/lib/errorHandler';
import { validators } from '@/lib/validators';
import { rateLimit } from '@/lib/rate-limit';

export async function fetchYogaPricing(region: string) {
    const { data, error } = await supabase
      .from('yoga_pricing')
      .select('id, region, plan_type, monthly_price, total_price, savings, currency, strike_price, discounted_monthly_price, discount_percentage')
      .eq('region', region)
  
    if (error) {
      console.error('Error fetching yoga pricing:', error)
      return []
    }
  
    return data
  }

const formatAmountForCurrency = (amount: number, currency: string) => {
  // Amount should already be in the smallest currency unit (cents/paise)
  switch(currency) {
    case 'INR':
      return Math.round(amount * 100); // Convert to paise
    case 'USD':
    case 'EUR':
      // Convert dollars/euros to cents
      return Math.round(amount * 100);
    default:
      throw new Error(`Unsupported currency: ${currency}`);
  }
};



