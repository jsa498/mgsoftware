# Profile Image Upload - Issue Analysis and Solution

## Current Issue

Students are unable to upload profile pictures to their accounts. When attempting to upload a profile image, the following error occurs:

```
data-service.ts:1402 Error uploading profile image: 
{statusCode: '403', error: 'Unauthorized', message: 'new row violates row-level security policy'}
```

This indicates a Row Level Security (RLS) policy violation in Supabase storage.

## Analysis

After investigation, we identified the following key points:

1. **Authentication System:**
   - The application uses a custom authentication system (not Supabase Auth)
   - User authentication is verified through database queries
   - Session persistence is maintained via cookies and session storage

2. **Supabase Client:**
   - The Supabase client is initialized using only the anonymous key
   - No proper Supabase session token is created during authentication

3. **Storage Configuration:**
   - A storage bucket named `student-profiles` exists
   - RLS policies are properly configured to allow:
     - Anyone to read from the bucket
     - Authenticated users to upload/update in the bucket

4. **Current Implementation:**
   - In `updateProfileImage()` (data-service.ts), uploads are attempted directly from the client
   - Since the client is not authenticated with Supabase Auth, it appears as anonymous
   - This causes the RLS policy violation (403 error)

## Conclusion

The root cause is a mismatch between our custom authentication system and Supabase's RLS expectations. Since we're using our own authentication but not properly passing authentication tokens to Supabase, the storage operations fail due to RLS policy violations.

## Recommended Solution

Create a server-side API route that uses the Supabase service role key to perform storage operations, bypassing RLS policies.

### Implementation Plan

1. **Create a New API Route:**
   - Path: `src/app/api/profile-image/route.ts`
   - This will be a secure server-side endpoint that handles image uploads

2. **Server-Side Implementation Details:**
   - Verify user authentication using our existing auth system
   - Use multipart form parsing to handle the image file
   - Initialize a Supabase client with the service role key
   - Upload the image to the storage bucket
   - Update the student record with the new image URL
   - Return success/failure response

3. **Client-Side Changes:**
   - Modify `updateProfileImage()` in data-service.ts to use the new API endpoint
   - Use fetch/FormData to send the image to the server endpoint
   - Handle response accordingly

4. **Security Considerations:**
   - NEVER expose the service role key to the client
   - Always validate authentication server-side before operations
   - Implement proper CSRF protection
   - Add rate limiting to prevent abuse
   - Validate file types and sizes
   - Consider adding image optimization

### Detailed Implementation Guidelines

#### 1. API Route Implementation

```typescript
// src/app/api/profile-image/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseForm } from 'some-form-parser'; // Choose appropriate library

// Initialize Supabase with service role key (only available server-side)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  // 1. Verify authentication using cookies/session
  const cookieStore = cookies();
  const authCookie = cookieStore.get('auth_session');
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
      return NextResponse.json({ error: 'User not found or not a student' }, { status: 404 });
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
      console.error('Error uploading profile image:', uploadError);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
    
    // 6. Get the public URL
    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('student-profiles')
      .getPublicUrl(filePath);
      
    if (!publicUrlData.publicUrl) {
      return NextResponse.json({ error: 'Failed to get image URL' }, { status: 500 });
    }
    
    // 7. Update student record with new image URL
    const { error: updateError } = await supabaseAdmin
      .from('students')
      .update({ profile_image_url: publicUrlData.publicUrl })
      .eq('id', studentId);
      
    if (updateError) {
      console.error('Error updating profile with image URL:', updateError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
    
    // 8. Return success with image URL
    return NextResponse.json({ 
      success: true, 
      imageUrl: publicUrlData.publicUrl 
    });
    
  } catch (error) {
    console.error('Server error handling profile image:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
```

#### 2. Client-Side Data Service Update

```typescript
// Modify src/lib/data-service.ts
export async function updateProfileImage(studentId: string, file: File): Promise<string | null> {
  try {
    // Create form data to send to API
    const formData = new FormData();
    formData.append('file', file);
    
    // Send to our server-side API endpoint
    const response = await fetch('/api/profile-image', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error uploading profile image:', errorData);
      return null;
    }
    
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error updating profile image:', error);
    return null;
  }
}
```

## Benefits of This Approach

1. **Security:** Service role key remains secure on the server
2. **Simplified Auth:** Leverages existing authentication system
3. **Performance:** Server can handle image validation/processing
4. **Maintainability:** Clear separation of concerns between client and server
5. **Flexibility:** Easy to add additional functionality like image optimization

## Next Steps

1. Implement the server-side API route
2. Update the client-side implementation
3. Test thoroughly with different image types and sizes
4. Monitor for any errors and adjust as needed 