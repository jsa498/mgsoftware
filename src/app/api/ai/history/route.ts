import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getStudentId } from '@/lib/server-auth';

// Initialize Supabase Admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(req: NextRequest) {
  // Determine current user's student_id
  const currentStudentId = await getStudentId();
  if (!currentStudentId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Determine user role from request cookies
  const userRole = req.cookies.get('user_role')?.value;

  // Parse query params for potential override
  const url = new URL(req.url);
  const overrideId = url.searchParams.get('studentId');

  // Build query: admins fetch all when no override; override when provided; non-admin fetch only own
  let query = supabaseAdmin.from('ai_messages').select('*');
  if (userRole === 'admin') {
    if (overrideId) {
      query = query.eq('student_id', overrideId);
    }
    // else: no filter, fetch all
  } else {
    query = query.eq('student_id', currentStudentId);
  }

  // Fetch history messages with ordering
  const { data, error } = await query.order('inserted_at', { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ messages: data });
} 