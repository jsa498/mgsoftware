import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Initialize Supabase with service role key (only available server-side)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  // 1. Verify authentication using cookies/session
  const cookieStore = cookies();
  // @ts-expect-error - In App Router Route Handlers, cookies() returns the store directly, not a Promise.
  const authCookie = cookieStore.get('auth_session');
  // @ts-expect-error - In App Router Route Handlers, cookies() returns the store directly, not a Promise.
  const userIdCookie = cookieStore.get('user_id');

  if (!authCookie || !authCookie.value || !userIdCookie || !userIdCookie.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Get student ID from user ID
    const userId = parseInt(userIdCookie.value);
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('student_id')
      .eq('id', userId)
      .single();

    if (userError || !userData || !userData.student_id) {
      console.error('User lookup error:', userError);
      return NextResponse.json({ error: 'User not found or not associated with a student' }, { status: 404 });
    }

    const studentId = userData.student_id;

    // 3. Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 4. Validate file (type, size, etc.)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // 5. Upload file to Supabase storage using service role
    const fileExt = file.name.split('.').pop();
    const fileName = `${studentId}-profile-${Date.now()}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    const { error: uploadError } = await supabaseAdmin
      .storage
      .from('student-profiles')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading profile image to storage:', uploadError);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    // 6. Get the public URL
    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('student-profiles')
      .getPublicUrl(filePath);

    if (!publicUrlData.publicUrl) {
        console.error('Failed to get public URL for uploaded image:', filePath);
      return NextResponse.json({ error: 'Failed to get image URL' }, { status: 500 });
    }

    // 7. Update student record with new image URL
    const { error: updateError } = await supabaseAdmin
      .from('students')
      .update({ profile_image_url: publicUrlData.publicUrl })
      .eq('id', studentId);

    if (updateError) {
      console.error('Error updating student profile with image URL:', updateError);
      // Attempt to delete the orphaned image from storage if the database update fails
      await supabaseAdmin.storage.from('student-profiles').remove([filePath]);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    // 8. Return success with image URL
    return NextResponse.json({
      success: true,
      imageUrl: publicUrlData.publicUrl
    });

  } catch (error) {
    console.error('Server error handling profile image:', error);
    // Check if it's a specific type of error, e.g., form parsing error
    if (error instanceof Error && error.message.includes('invalid format')) {
        return NextResponse.json({ error: 'Invalid form data format' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server error' }, { status: 500 });
  }
} 