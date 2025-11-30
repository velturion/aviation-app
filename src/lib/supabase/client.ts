import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if we have valid Supabase credentials
const isSupabaseConfigured = supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  supabaseUrl.includes('supabase');

// Create a mock client for demo mode
const createMockClient = (): SupabaseClient => {
  const mockResponse = { data: null, error: null };
  const mockAuth = {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signIn: async () => mockResponse,
    signOut: async () => mockResponse,
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  };

  return {
    auth: mockAuth,
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => mockResponse,
      update: () => mockResponse,
      delete: () => mockResponse,
      eq: () => ({ data: [], error: null }),
    }),
    storage: {
      from: () => ({
        upload: async () => mockResponse,
        download: async () => mockResponse,
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  } as unknown as SupabaseClient;
};

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

export const isDemoMode = !isSupabaseConfigured;

// Helper to get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// Helper to get current session
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}
