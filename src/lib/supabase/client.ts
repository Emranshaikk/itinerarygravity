import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // In Next.js, browser-side env vars must be prefixed with NEXT_PUBLIC_
  // and accessed directly, not through process.env in production
  const supabaseUrl = (typeof window !== 'undefined'
    ? (window as any).ENV?.NEXT_PUBLIC_SUPABASE_URL
    : process.env.NEXT_PUBLIC_SUPABASE_URL) || process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey = (typeof window !== 'undefined'
    ? (window as any).ENV?.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('Supabase Client Init:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
    keyPreview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
    envKeys: typeof process !== 'undefined' ? Object.keys(process.env).filter(k => k.includes('SUPABASE')) : []
  });

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase configuration is incomplete!', {
      urlExists: !!supabaseUrl,
      keyExists: !!supabaseAnonKey,
      url: supabaseUrl,
      processEnvUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
    });
    throw new Error('Supabase URL or Anon Key is missing! Check your .env.local file.');
  }

  const cleanUrl = supabaseUrl.trim().replace(/\/$/, '');
  const cleanKey = supabaseAnonKey.trim();

  return createBrowserClient(cleanUrl, cleanKey);
}
