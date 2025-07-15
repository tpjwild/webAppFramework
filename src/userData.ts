import { supabase } from './supabaseClient';

// Save user data (upsert by user_id)
export async function saveUserData<T extends object>(user_id: string, data: T) {
  return supabase.from('user_data').upsert([
    { user_id, data }
  ], { onConflict: 'user_id' });
}

// Load user data by user_id
export async function loadUserData<T = unknown>(user_id: string): Promise<T | null> {
  const { data, error } = await supabase
    .from('user_data')
    .select('data')
    .eq('user_id', user_id)
    .single();
  if (error) throw error;
  return data?.data ?? null;
}
