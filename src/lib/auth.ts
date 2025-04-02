import { supabase } from './supabase';
import Cookies from 'js-cookie';

export interface User {
  id: number;
  username: string;
  role: string;
}

// Authenticate user with username and PIN
export async function authenticateUser(username: string, pin: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, role')
      .eq('username', username.toLowerCase())
      .eq('pin', pin)
      .single();

    if (error || !data) {
      console.error('Authentication error:', error);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Store authenticated user in session storage and set cookie
export function setUserSession(user: User) {
  if (typeof window !== 'undefined') {
    try {
      // First clear any existing session to prevent inconsistencies
      clearUserSession();
      
      // Store in session storage
      sessionStorage.setItem('user', JSON.stringify(user));
      
      // Set auth cookie for server-side auth checks (middleware)
      Cookies.set('auth_session', 'true', { 
        expires: 1, // 1 day
        path: '/',
        sameSite: 'strict'
      });
      
      // Set user ID cookie for server-side identification
      Cookies.set('user_id', user.id.toString(), {
        expires: 1, // 1 day
        path: '/',
        sameSite: 'strict'
      });
      
      // Set user role cookie for middleware role-based routing
      Cookies.set('user_role', user.role, {
        expires: 1, // 1 day
        path: '/',
        sameSite: 'strict'
      });
    } catch (error) {
      console.error('Error setting user session:', error);
      // If there was an error, attempt to clean up any partial state
      clearUserSession();
    }
  }
}

// Get current user from session storage
export function getCurrentUser(): User | null {
  if (typeof window !== 'undefined') {
    try {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr) as User;
      }
      
      // If no user in session storage but cookies exist, clear the cookies
      // to maintain consistency
      if (Cookies.get('auth_session') || Cookies.get('user_role')) {
        clearUserSession();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      clearUserSession();
    }
  }
  return null;
}

// Remove user from session storage and cookies (logout)
export function clearUserSession() {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem('user');
      
      // Remove auth cookies
      Cookies.remove('auth_session', { path: '/' });
      Cookies.remove('user_id', { path: '/' });
      Cookies.remove('user_role', { path: '/' });
    } catch (error) {
      console.error('Error clearing user session:', error);
      // Last resort - attempt to clear everything
      try {
        sessionStorage.clear();
      } catch {
        // Silent fail
      }
    }
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Check if user has admin role
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user !== null && user.role === 'admin';
}

// Check if user has student role
export function isStudent(): boolean {
  const user = getCurrentUser();
  return user !== null && user.role === 'student';
} 