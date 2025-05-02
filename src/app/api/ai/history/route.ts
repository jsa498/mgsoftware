import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getStudentId } from '@/lib/server-auth';

// Initialize Supabase Admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(req: NextRequest) {
  // Determine user role from request cookies
  const userRole = req.cookies.get('user_role')?.value;
  if (!userRole) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // For students, get their studentId and enforce ownership
  let studentId: string | null = null;
  if (userRole === 'student') {
    studentId = await getStudentId();
    if (!studentId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else if (userRole !== 'admin') {
    // Unknown role
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse query params for potential override (admins only)
  const url = new URL(req.url);
  const overrideId = url.searchParams.get('studentId');

  // Build query: admin (all or override), student (own only)
  let query = supabaseAdmin.from('ai_messages').select('*');
  if (userRole === 'student') {
    query = query.eq('student_id', studentId as string);
  } else {
    // admin
    if (overrideId) {
      query = query.eq('student_id', overrideId);
    }
    // else fetch all
  }

  // Fetch history messages with ordering by timestamp
  const { data, error } = await query.order('inserted_at', { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ messages: data });
} 