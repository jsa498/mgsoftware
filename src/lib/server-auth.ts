import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with cookies for server components
export async function getServerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      fetch: fetch.bind(globalThis)
    },
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
      autoRefreshToken: false,
      storageKey: 'custom-key'
    }
  });
}

// Get the current user's ID from session
export async function getCurrentUserId() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth_session');
  const userIdCookie = cookieStore.get('user_id');
  
  if (!authCookie || !userIdCookie) {
    console.error('Auth session missing or user_id cookie not found');
    return null;
  }
  
  return userIdCookie.value;
}

// Get the student ID for the current logged in user
export async function getStudentId() {
  const userId = await getCurrentUserId();
  
  console.log("getCurrentUserId returned:", userId);
  
  if (!userId) {
    console.log("No user ID found, returning null");
    return null;
  }
  
  const supabase = await getServerSupabase();
  
  // Get student_id from users table
  const { data, error } = await supabase
    .from('users')
    .select('student_id')
    .eq('id', userId)
    .single();
  
  console.log("Query result:", { data, error });
  
  if (error || !data?.student_id) {
    console.error('Error getting student ID:', error);
    return null;
  }
  
  console.log("Returning student_id:", data.student_id);
  return data.student_id;
} 