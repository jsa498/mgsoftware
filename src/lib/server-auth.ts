import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with cookies for server components
export async function getServerSupabase() {
  const cookieStore = cookies();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  
  return createClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });
}

// Get the current user's ID from session
export async function getCurrentUserId() {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data?.user) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return data.user.id;
}

// Get the student ID for the current logged in user
export async function getStudentId() {
  const userId = await getCurrentUserId();
  
  if (!userId) return null;
  
  const supabase = await getServerSupabase();
  
  // Get student_id from users table
  const { data, error } = await supabase
    .from('users')
    .select('student_id')
    .eq('id', userId)
    .single();
  
  if (error || !data?.student_id) {
    console.error('Error getting student ID:', error);
    return null;
  }
  
  return data.student_id;
} 