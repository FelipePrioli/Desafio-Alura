import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Custom fetch implementation with retries and timeout
const customFetch = async (url: string, options: RequestInit = {}) => {
  const MAX_RETRIES = 3;
  const INITIAL_BACKOFF = 1000; // 1 second
  const TIMEOUT = 20000; // 20 seconds

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      const isLastAttempt = attempt === MAX_RETRIES - 1;
      if (isLastAttempt) throw error;

      // Exponential backoff
      const backoff = INITIAL_BACKOFF * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, backoff));
    }
  }

  throw new Error('Max retries reached');
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-client-info': 'motorista-show@1.0.0'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 1
    }
  },
  fetch: customFetch
});

// Helper function to check database connection
export const checkConnection = async () => {
  try {
    const { error } = await supabase.from('drivers').select('id').limit(1);
    return !error;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  }
};

// Helper function for retrying operations
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};