import { supabase } from './supabase';
import { DashboardStats, FeeAlert, RecentActivity, Student, Group, Quiz, QuizQuestion, QuizAttachment } from './types';

/**
 * Fetches dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get active students count
    const { data: activeStudentsData, error: activeStudentsError } = await supabase
      .from('active_students_count')
      .select('count')
      .single();
    
    if (activeStudentsError) throw activeStudentsError;
    
    // Get active groups count
    const { data: activeGroupsData, error: activeGroupsError } = await supabase
      .from('active_groups_count')
      .select('count')
      .single();
    
    if (activeGroupsError) throw activeGroupsError;
    
    // Get unread messages count
    const { data: unreadMessagesData, error: unreadMessagesError } = await supabase
      .from('unread_messages_count')
      .select('count')
      .single();
    
    if (unreadMessagesError) throw unreadMessagesError;
    
    // Get new practice materials count
    const { data: newPracticeMaterialsData, error: newPracticeMaterialsError } = await supabase
      .from('new_practice_materials_count')
      .select('count')
      .single();
    
    if (newPracticeMaterialsError) throw newPracticeMaterialsError;
    
    return {
      activeStudentsCount: activeStudentsData.count || 0,
      activeGroupsCount: activeGroupsData.count || 0,
      unreadMessagesCount: unreadMessagesData.count || 0,
      newPracticeMaterialsCount: newPracticeMaterialsData.count || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default values if there's an error
    return {
      activeStudentsCount: 0,
      activeGroupsCount: 0,
      unreadMessagesCount: 0,
      newPracticeMaterialsCount: 0,
    };
  }
}

/**
 * Fetches recent activity data
 */
export async function getRecentActivity(): Promise<RecentActivity[]> {
  try {
    const { data, error } = await supabase
      .from('recent_activity')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

/**
 * Fetches fee alerts
 */
export async function getFeeAlerts(page = 1, limit = 100): Promise<FeeAlert[]> {
  try {
    const { data, error } = await supabase
      .from('fee_alerts')
      .select('*')
      .order('paid_until', { ascending: true })
      .range((page - 1) * limit, page * limit - 1);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching fee alerts:', error);
    return [];
  }
}

/**
 * Fetches all students with their associated groups and fees info
 */
export async function getAllStudents(): Promise<Student[]> {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('first_name', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

/**
 * Fetches all groups
 */
export async function getAllGroups(): Promise<Group[]> {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
}

/**
 * Fetches groups for a specific student
 */
export async function getStudentGroups(studentId: string): Promise<Group[]> {
  try {
    const { data, error } = await supabase
      .from('student_groups')
      .select('group_id')
      .eq('student_id', studentId);
    
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    const groupIds = data.map(sg => sg.group_id);
    
    const { data: groups, error: groupsError } = await supabase
      .from('groups')
      .select('*')
      .in('id', groupIds);
    
    if (groupsError) throw groupsError;
    
    return groups || [];
  } catch (error) {
    console.error('Error fetching student groups:', error);
    return [];
  }
}

/**
 * Fetches latest fee info for a student
 */
export async function getStudentFeeInfo(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('fees')
      .select('*')
      .eq('student_id', studentId)
      .order('paid_until', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    return data || null;
  } catch (error) {
    console.error('Error fetching student fee info:', error);
    return null;
  }
}

/**
 * Creates a new group
 */
export async function createGroup(name: string, description?: string): Promise<Group | null> {
  try {
    const { data, error } = await supabase
      .from('groups')
      .insert([
        { name, description, status: 'active' }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating group:', error);
    return null;
  }
}

/**
 * Updates an existing group
 */
export async function updateGroup(id: string, updates: Partial<Group>): Promise<Group | null> {
  try {
    const { data, error } = await supabase
      .from('groups')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating group:', error);
    return null;
  }
}

/**
 * Deletes a group
 */
export async function deleteGroup(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting group:', error);
    return false;
  }
}

/**
 * Deletes a student and associated records
 */
export async function deleteStudent(id: string): Promise<boolean> {
  try {
    // Delete student records in related tables in the correct order
    // to respect foreign key constraints
    
    // 1. Delete from fee_exemptions
    const { error: feeExemptionError } = await supabase
      .from('fee_exemptions')
      .delete()
      .eq('student_id', id);
    
    if (feeExemptionError) throw feeExemptionError;
    
    // 2. Delete from quiz_results
    const { error: quizResultsError } = await supabase
      .from('quiz_results')
      .delete()
      .eq('student_id', id);
    
    if (quizResultsError) throw quizResultsError;
    
    // 3. Set NULL for sender_id and recipient_id in messages
    const { error: messagesSenderError } = await supabase
      .from('messages')
      .update({ sender_id: null })
      .eq('sender_id', id);
    
    if (messagesSenderError) throw messagesSenderError;
    
    const { error: messagesRecipientError } = await supabase
      .from('messages')
      .update({ recipient_id: null })
      .eq('recipient_id', id);
    
    if (messagesRecipientError) throw messagesRecipientError;
    
    // 4. Delete from users
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('student_id', id);
    
    if (userError) throw userError;
    
    // 5. Delete from student_groups, fees, attendance, practice_sessions
    // These have ON DELETE CASCADE, but we'll delete them explicitly to be safe
    const { error: studentGroupsError } = await supabase
      .from('student_groups')
      .delete()
      .eq('student_id', id);
    
    if (studentGroupsError) throw studentGroupsError;
    
    const { error: feesError } = await supabase
      .from('fees')
      .delete()
      .eq('student_id', id);
    
    if (feesError) throw feesError;
    
    const { error: attendanceError } = await supabase
      .from('attendance')
      .delete()
      .eq('student_id', id);
    
    if (attendanceError) throw attendanceError;
    
    const { error: practiceSessionsError } = await supabase
      .from('practice_sessions')
      .delete()
      .eq('student_id', id);
    
    if (practiceSessionsError) throw practiceSessionsError;
    
    // 6. Finally, delete the student record
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting student:', error);
    return false;
  }
}

/**
 * Gets students in a group
 */
export async function getGroupStudents(groupId: string): Promise<Student[]> {
  try {
    const { data, error } = await supabase
      .from('student_groups')
      .select('student_id')
      .eq('group_id', groupId);
    
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    const studentIds = data.map(sg => sg.student_id);
    
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .in('id', studentIds);
    
    if (studentsError) throw studentsError;
    
    return students || [];
  } catch (error) {
    console.error('Error fetching group students:', error);
    return [];
  }
}

/**
 * Reset all data (for development purposes only)
 */
export async function resetAllData(): Promise<boolean> {
  try {
    // Delete all data from tables in the correct order to respect foreign key constraints
    await supabase.from('student_groups').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('fees').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('practice_sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('practice_materials').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('students').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('groups').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    return true;
  } catch (error) {
    console.error('Error resetting data:', error);
    return false;
  }
}

/**
 * Fetches all chat groups with latest message
 */
export async function getAllChatGroups() {
  try {
    // First get all groups
    const { data: groups, error: groupsError } = await supabase
      .from('groups')
      .select('*')
      .eq('status', 'active')
      .order('name', { ascending: true });
    
    if (groupsError) throw groupsError;
    
    if (!groups || groups.length === 0) return [];
    
    // For each group, get the latest message
    const groupsWithLatestMessage = await Promise.all(
      groups.map(async (group) => {
        const { data: latestMessage, error: messageError } = await supabase
          .from('messages')
          .select('*')
          .eq('group_id', group.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        // We don't throw an error if no message found, just return null for latest message
        const unreadCount = await getUnreadMessagesCount(group.id);
        
        return {
          ...group,
          latestMessage: messageError ? null : latestMessage,
          unreadCount
        };
      })
    );
    
    return groupsWithLatestMessage;
  } catch (error) {
    console.error('Error fetching chat groups:', error);
    return [];
  }
}

/**
 * Fetches messages for a specific group
 */
export async function getGroupMessages(groupId: string) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id(id, first_name, last_name)
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching group messages:', error);
    return [];
  }
}

/**
 * Sends a message to a group
 */
export async function sendGroupMessage(groupId: string, senderId: string, message: string, isAdmin: boolean = false) {
  try {
    // For admin messages, use a different approach to bypass the foreign key constraint
    if (isAdmin) {
      // Admin messages will have null sender_id to avoid foreign key constraint
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            group_id: groupId,
            sender_id: null, // Using null for admin messages
            body: message,
            is_read: false,
            subject: 'Admin Message' // Use subject field to identify admin messages
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } else {
      // Regular student messages, keep the existing logic
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            group_id: groupId,
            sender_id: senderId,
            body: message,
            is_read: false
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    }
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(groupId: string) {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('group_id', groupId)
      .eq('is_read', false);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return false;
  }
}

/**
 * Get unread messages count for a group
 */
export async function getUnreadMessagesCount(groupId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', groupId)
      .eq('is_read', false);
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error('Error counting unread messages:', error);
    return 0;
  }
}

/**
 * Gets attendance records for students in a group for a specific month
 */
export async function getGroupAttendance(groupId: string, month: Date): Promise<Record<string, Record<number, boolean | null>>> {
  try {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    // Format dates to ISO strings for database query
    const startDate = startOfMonth.toISOString().split('T')[0];
    const endDate = endOfMonth.toISOString().split('T')[0];
    
    // Get all students in the group
    const students = await getGroupStudents(groupId);
    
    if (!students.length) return {};
    
    // Get attendance records for these students in the given month
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('group_id', groupId)
      .in('student_id', students.map(s => s.id))
      .gte('date', startDate)
      .lte('date', endDate);
    
    if (error) throw error;
    
    // Transform data into required format
    const attendanceMap: Record<string, Record<number, boolean | null>> = {};
    
    // Initialize with empty attendance records for all students
    students.forEach(student => {
      attendanceMap[student.id] = {};
    });
    
    // Fill in the actual attendance data
    (data || []).forEach(record => {
      const day = new Date(record.date).getDate();
      if (!attendanceMap[record.student_id]) {
        attendanceMap[record.student_id] = {};
      }
      attendanceMap[record.student_id][day] = record.status;
    });
    
    return attendanceMap;
  } catch (error) {
    console.error('Error fetching group attendance:', error);
    return {};
  }
}

/**
 * Updates a student's attendance record for a specific day
 */
export async function updateAttendance(
  studentId: string, 
  groupId: string, 
  date: Date, 
  status: boolean | null
): Promise<boolean> {
  try {
    const formattedDate = date.toISOString().split('T')[0];
    
    // Check if a record already exists
    const { data: existingRecord, error: checkError } = await supabase
      .from('attendance')
      .select('id')
      .eq('student_id', studentId)
      .eq('group_id', groupId)
      .eq('date', formattedDate)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingRecord) {
      // Update existing record
      if (status === null) {
        // If status is null, delete the record
        const { error: deleteError } = await supabase
          .from('attendance')
          .delete()
          .eq('id', existingRecord.id);
        
        if (deleteError) throw deleteError;
      } else {
        // Otherwise update the status
        const { error: updateError } = await supabase
          .from('attendance')
          .update({ 
            status, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', existingRecord.id);
        
        if (updateError) throw updateError;
      }
    } else if (status !== null) {
      // Only insert if status is not null
      const { error: insertError } = await supabase
        .from('attendance')
        .insert([{ 
          student_id: studentId, 
          group_id: groupId, 
          date: formattedDate, 
          status 
        }]);
      
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating attendance:', error);
    return false;
  }
}

/**
 * Clear all attendance records for a group in a specific month
 */
export async function clearGroupAttendance(groupId: string, month: Date): Promise<boolean> {
  try {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    // Format dates to ISO strings for database query
    const startDate = startOfMonth.toISOString().split('T')[0];
    const endDate = endOfMonth.toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('group_id', groupId)
      .gte('date', startDate)
      .lte('date', endDate);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error clearing group attendance:', error);
    return false;
  }
}

/**
 * Fetches practice leaderboard data
 * Returns students sorted by practice points in descending order
 */
export async function getPracticeLeaderboard() {
  try {
    // Get all active students
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id, first_name, last_name')
      .eq('status', 'active');
    
    if (studentsError) throw studentsError;
    
    if (!students || students.length === 0) return [];
    
    // For each student, get their practice sessions total time and points
    const leaderboardData = await Promise.all(
      students.map(async (student) => {
        // Get total practice time and points
        const { data: practiceData, error: practiceError } = await supabase
          .from('practice_sessions')
          .select('duration_minutes, points')
          .eq('student_id', student.id)
          .eq('status', 'completed');
        
        if (practiceError) throw practiceError;
        
        // Calculate total time and points
        let totalMinutes = 0;
        let totalPoints = 0;
        
        if (practiceData && practiceData.length > 0) {
          totalMinutes = practiceData.reduce((sum, session) => {
            // Make sure we're working with numbers
            const mins = typeof session.duration_minutes === 'number' ? session.duration_minutes : parseInt(session.duration_minutes) || 0;
            return sum + mins;
          }, 0);
          
          totalPoints = practiceData.reduce((sum, session) => {
            const pts = typeof session.points === 'number' ? session.points : parseFloat(session.points) || 0;
            return sum + pts;
          }, 0);
        }
        
        // Format time as hours and minutes
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        // Format with clock-style notation (e.g. 1:30m)
        const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}m`;
        
        return {
          student_id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          time: formattedTime,
          points: totalPoints,
          raw_minutes: totalMinutes, // Store raw minutes for sorting
          hours, // Store raw hours for sorting
          minutes: minutes // Store raw minutes for sorting
        };
      })
    );
    
    // Sort by points (descending)
    leaderboardData.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      // If points are equal, sort by time
      return b.raw_minutes - a.raw_minutes;
    });
    
    // Add rank
    return leaderboardData.map((data, index) => ({
      ...data,
      rank: index + 1,
      points: parseFloat(data.points.toFixed(2)) // Format points to 2 decimal places
    }));
  } catch (error) {
    console.error('Error fetching practice leaderboard:', error);
    return [];
  }
}

/**
 * Fetches quiz leaderboard data
 * Returns students sorted by quiz points in descending order
 */
export async function getQuizLeaderboard() {
  try {
    // Get all active students
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id, first_name, last_name')
      .eq('status', 'active');
    
    if (studentsError) throw studentsError;
    
    if (!students || students.length === 0) return [];
    
    // For each student, get their quiz points
    const leaderboardData = await Promise.all(
      students.map(async (student) => {
        // Get average quiz score
        const { data: quizData, error: quizError } = await supabase
          .from('quiz_results')
          .select('score')
          .eq('student_id', student.id);
        
        if (quizError) throw quizError;
        
        // Calculate average score
        let points = 0;
        
        if (quizData && quizData.length > 0) {
          const totalScore = quizData.reduce((sum, quiz) => sum + (quiz.score || 0), 0);
          points = totalScore / quizData.length;
        }
        
        return {
          student_id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          points: points
        };
      })
    );
    
    // Sort by points (descending)
    leaderboardData.sort((a, b) => b.points - a.points);
    
    // Add rank
    return leaderboardData.map((data, index) => ({
      ...data,
      rank: index + 1
    }));
  } catch (error) {
    console.error('Error fetching quiz leaderboard:', error);
    return [];
  }
}

export async function updateQuizPoints(studentId: string, increment: number) {
  try {
    // Get the current quiz results for the student
    const { data: quizData, error: getError } = await supabase
      .from('quiz_results')
      .select('id, score')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (getError) throw getError;
    
    if (quizData) {
      // Update existing quiz result
      const newScore = Math.max(0, (quizData.score || 0) + increment);
      const { error: updateError } = await supabase
        .from('quiz_results')
        .update({ score: newScore })
        .eq('id', quizData.id);
      
      if (updateError) throw updateError;
    } else {
      // Create new quiz result if none exists
      const { error: insertError } = await supabase
        .from('quiz_results')
        .insert([{ 
          student_id: studentId, 
          score: Math.max(0, increment) 
        }]);
      
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating quiz points:', error);
    return false;
  }
}

/**
 * Uploads a file to Supabase storage
 */
export async function uploadFileToStorage(file: File, bucketName: string = 'practice-materials') {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return {
      path: data.path,
      url: publicUrlData.publicUrl,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Creates a new practice material and associates it with selected groups
 */
export async function createPracticeMaterial(data: {
  title: string;
  description?: string;
  file_url?: string;
  file_type?: string;
  file_name?: string;
  file_size?: number;
  group_ids: string[];
}) {
  try {
    // Create practice material
    const { data: practiceMaterial, error } = await supabase
      .from('practice_materials')
      .insert({
        title: data.title,
        description: data.description,
        file_url: data.file_url,
        file_type: data.file_type,
        file_name: data.file_name,
        file_size: data.file_size,
      })
      .select()
      .single();

    if (error) throw error;

    // Associate practice material with groups
    if (data.group_ids && data.group_ids.length > 0) {
      const groupAssociations = data.group_ids.map(groupId => ({
        practice_material_id: practiceMaterial.id,
        group_id: groupId
      }));

      const { error: associationError } = await supabase
        .from('practice_material_groups')
        .insert(groupAssociations);

      if (associationError) throw associationError;
    }

    return practiceMaterial;
  } catch (error) {
    console.error('Error creating practice material:', error);
    throw error;
  }
}

/**
 * Gets practice materials for a specific group
 */
export async function getGroupPracticeMaterials(groupId: string) {
  try {
    const { data, error } = await supabase
      .from('practice_material_groups')
      .select(`
        practice_material_id,
        practice_materials(*)
      `)
      .eq('group_id', groupId);

    if (error) throw error;

    return data?.map(item => item.practice_materials) || [];
  } catch (error) {
    console.error('Error fetching group practice materials:', error);
    throw error;
  }
}

/**
 * Gets all practice materials with their associated groups
 */
export async function getAllPracticeMaterials() {
  try {
    const { data: materials, error } = await supabase
      .from('practice_materials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!materials || materials.length === 0) return [];

    const materialsWithGroups = await Promise.all(
      materials.map(async (material) => {
        const { data: groupAssociations, error: groupError } = await supabase
          .from('practice_material_groups')
          .select('group_id, groups(id, name)')
          .eq('practice_material_id', material.id);

        if (groupError) throw groupError;

        return {
          ...material,
          groups: groupAssociations?.map(association => association.groups) || []
        };
      })
    );

    return materialsWithGroups;
  } catch (error) {
    console.error('Error fetching practice materials:', error);
    throw error;
  }
}

/**
 * Fetches practice sessions for a specific student
 */
export async function getStudentPracticeSessions(studentId: string, period: 'day' | 'week' | 'month' = 'month') {
  try {
    let view = 'practice_sessions_month';
    
    if (period === 'day') {
      view = 'practice_sessions_today';
    } else if (period === 'week') {
      view = 'practice_sessions_week';
    }
    
    const { data, error } = await supabase
      .from(view)
      .select('count')
      .eq('student_id', studentId)
      .single();
    
    if (error) throw error;
    
    return data || { count: 0 };
  } catch (error) {
    console.error('Error fetching student practice sessions:', error);
    return { count: 0 };
  }
}

/**
 * Fetches practice stats for a specific student
 */
export async function getStudentPracticeStats(studentId: string, period: string = 'month') {
  try {
    const { data, error } = await supabase
      .rpc('get_student_practice_stats', { 
        p_student_id: studentId,
        p_period: period 
      });
    
    if (error) throw error;
    
    return data || { 
      total_sessions: 0, 
      total_minutes: 0, 
      total_points: 0,
      average_minutes_per_session: 0
    };
  } catch (error) {
    console.error('Error fetching student practice stats:', error);
    return { 
      total_sessions: 0, 
      total_minutes: 0, 
      total_points: 0,
      average_minutes_per_session: 0
    };
  }
}

/**
 * Fetches unread messages for a specific student
 */
export async function getStudentUnreadMessages(studentId: string) {
  try {
    // First get all groups that the student is a member of
    const { data: studentGroups, error: groupsError } = await supabase
      .from('student_groups')
      .select('group_id')
      .eq('student_id', studentId);
    
    if (groupsError) throw groupsError;
    
    // If no groups found, return 0 counts
    if (!studentGroups || studentGroups.length === 0) {
      return { count: 0, new_materials_count: 0 };
    }
    
    // Extract group IDs
    const groupIds = studentGroups.map(g => g.group_id);
    
    // Count unread messages across all student's groups
    const { count: unreadCount, error: countError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .in('group_id', groupIds)
      .eq('is_read', false);
    
    if (countError) throw countError;
    
    // Since new_materials_count doesn't exist in the database,
    // we'll return it as 0 for now
    return { 
      count: unreadCount || 0, 
      new_materials_count: 0 
    };
  } catch (error) {
    console.error('Error fetching student unread messages:', error);
    return { count: 0, new_materials_count: 0 };
  }
}

/**
 * Gets the student fee status with color coding
 */
export async function getStudentFeeStatus(studentId: string) {
  try {
    const { data, error } = await supabase.rpc('get_student_fee_status', {
      p_student_id: studentId
    });
    
    if (error) throw error;
    
    return data || null;
  } catch (error) {
    console.error('Error fetching student fee status:', error);
    return null;
  }
}

/**
 * Fetches recent activity for a specific student
 */
export async function getStudentRecentActivity(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('student_recent_activity')
      .select('*')
      .eq('student_id', studentId)
      .order('started_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching student recent activity:', error);
    return [];
  }
}

/**
 * Starts a new practice session for a student
 */
export async function startPracticeSession(studentId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('practice_sessions')
      .insert([{
        student_id: studentId,
        status: 'started',
        duration_minutes: 0,
        points: 0
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return data?.id || null;
  } catch (error) {
    console.error('Error starting practice session:', error);
    return null;
  }
}

/**
 * Updates an ongoing practice session with duration and points
 */
export async function updatePracticeSession(sessionId: string, durationMinutes: number): Promise<boolean> {
  try {
    // Calculate points (2 points per hour)
    const points = (durationMinutes / 60) * 2;
    
    const { error } = await supabase
      .from('practice_sessions')
      .update({
        duration_minutes: durationMinutes,
        points: points.toFixed(2)
      })
      .eq('id', sessionId)
      .eq('status', 'started');
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating practice session:', error);
    return false;
  }
}

/**
 * Completes a practice session
 */
export async function completePracticeSession(sessionId: string, durationMinutes: number): Promise<{ success: boolean, sessionData?: Record<string, unknown> }> {
  try {
    // Calculate points (2 points per hour)
    const points = (durationMinutes / 60) * 2;
    
    const { data, error } = await supabase
      .from('practice_sessions')
      .update({
        status: 'completed',
        duration_minutes: Math.round(durationMinutes), // Convert to integer
        points: points.toFixed(2),
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .eq('status', 'started')
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, sessionData: data };
  } catch (error) {
    console.error('Error completing practice session:', error);
    return { success: false };
  }
}

/**
 * Gets the current active practice session for a student, if any
 */
export async function getActivePracticeSession(studentId: string): Promise<Record<string, unknown> | null> {
  try {
    const { data, error } = await supabase
      .from('practice_sessions')
      .select('*')
      .eq('student_id', studentId)
      .eq('status', 'started')
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    
    return data || null;
  } catch (error) {
    console.error('Error fetching active practice session:', error);
    return null;
  }
}

/**
 * Update fee payment period by a number of months
 */
export async function updateFeePaidUntil(feeId: string, months: number): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('update_fee_paid_until', {
      p_fee_id: feeId,
      p_months: months
    });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating fee paid until:', error);
    return false;
  }
}

/**
 * Creates a fee record for a new student
 */
export async function createStudentFeeRecord(studentId: string, amount: number = 0): Promise<boolean> {
  try {
    // Set paid_until to end of current month
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const { error } = await supabase
      .from('fees')
      .insert([{
        student_id: studentId,
        amount: amount,
        paid_until: endOfMonth.toISOString(),
        payment_date: new Date().toISOString(),
        status: 'paid'
      }]);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error creating student fee record:', error);
    return false;
  }
}

// Get student profile by user id
export async function getStudentProfileByUserId(userId: number): Promise<Record<string, unknown> | null> {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('student_id')
      .eq('id', userId)
      .single();

    if (userError || !userData?.student_id) {
      console.error('Error getting student ID from user:', userError);
      return null;
    }

    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('id, first_name, last_name, phone, profile_image_url')
      .eq('id', userData.student_id)
      .single();

    if (studentError || !studentData) {
      console.error('Error getting student data:', studentError);
      return null;
    }

    // Get student's groups
    const { data: groupsData, error: groupsError } = await supabase
      .from('student_groups')
      .select(`
        id,
        groups:group_id (
          id,
          name,
          description
        )
      `)
      .eq('student_id', studentData.id);

    if (groupsError) {
      console.error('Error getting student groups:', groupsError);
      return { ...studentData, groups: [] };
    }

    // Format the groups data
    const groups = groupsData.map(item => item.groups);

    return {
      ...studentData,
      groups
    };
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return null;
  }
}

// Update student profile
export async function updateStudentProfile(studentId: string, data: { 
  phone?: string;
  first_name?: string;
  last_name?: string;
}): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('students')
      .update(data)
      .eq('id', studentId);

    if (error) {
      console.error('Error updating student profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating student profile:', error);
    return false;
  }
}

// Update user username
export async function updateUsername(studentId: string, username: string): Promise<boolean> {
  try {
    // First check if the username is already taken
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username.toLowerCase())
      .neq('student_id', studentId)
      .single();
    
    if (existingUser) {
      // Username already exists for another user
      console.error('Username already taken');
      return false;
    }
    
    // Update the username
    const { error } = await supabase
      .from('users')
      .update({ username: username.toLowerCase() })
      .eq('student_id', studentId);

    if (error) {
      console.error('Error updating username:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating username:', error);
    return false;
  }
}

/**
 * Updates the profile image for the currently authenticated student.
 * Uses the server-side API endpoint to handle the upload securely.
 */
export async function updateProfileImage(file: File): Promise<string | null> {
  try {
    // Create form data to send to API
    const formData = new FormData();
    formData.append('file', file);
    
    // Send to our server-side API endpoint
    // The server will determine the student ID based on the session/cookie
    const response = await fetch('/api/profile-image', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      let errorData = { error: 'Unknown error during upload' };
      try {
        errorData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
      }
      console.error('Error uploading profile image via API:', response.status, errorData);
      throw new Error(errorData.error || 'Failed to upload profile image');
    }
    
    const data = await response.json();
    if (!data.success || !data.imageUrl) {
        console.error('API response missing success flag or imageUrl:', data);
        throw new Error('Invalid response from image upload API');
    }

    console.log('Profile image updated successfully:', data.imageUrl);
    return data.imageUrl;
  } catch (error) {
    console.error('Client-side error in updateProfileImage:', error);
    // Return null as per the original function signature to indicate failure
    return null;
  }
}

/**
 * Gets practice materials available to a specific student based on their group memberships
 */
export async function getStudentPracticeMaterials(studentId: string) {
  try {
    // Get all groups the student belongs to
    const { data: studentGroups, error: groupsError } = await supabase
      .from('student_groups')
      .select('group_id')
      .eq('student_id', studentId);
    
    if (groupsError) throw groupsError;
    
    if (!studentGroups || studentGroups.length === 0) {
      return []; // Student doesn't belong to any groups
    }
    
    const groupIds = studentGroups.map(g => g.group_id);
    
    // Get all practice materials shared with these groups
    const { data: materialAssociations, error: materialsError } = await supabase
      .from('practice_material_groups')
      .select(`
        practice_material_id,
        group_id,
        groups(name)
      `)
      .in('group_id', groupIds);
    
    if (materialsError) throw materialsError;
    
    if (!materialAssociations || materialAssociations.length === 0) {
      return []; // No materials shared with student's groups
    }
    
    // Get unique material IDs
    const materialIds = [...new Set(materialAssociations.map(m => m.practice_material_id))];
    
    // Get the actual materials
    const { data: materials, error: materialsDataError } = await supabase
      .from('practice_materials')
      .select('*')
      .in('id', materialIds)
      .order('created_at', { ascending: false });
    
    if (materialsDataError) throw materialsDataError;
    
    if (!materials || materials.length === 0) {
      return [];
    }
    
    // For each material, add the groups it's shared with
    const materialsWithGroups = await Promise.all(
      materials.map(async (material) => {
        const groupsForMaterial = materialAssociations
          .filter(ma => ma.practice_material_id === material.id)
          .map(ma => ({ 
            id: ma.group_id, 
            name: ma.groups && 'name' in ma.groups ? ma.groups.name : 'Unnamed Group' 
          }));
        
        return {
          ...material,
          groups: groupsForMaterial
        };
      })
    );
    
    return materialsWithGroups;
  } catch (error) {
    console.error('Error fetching student practice materials:', error);
    return [];
  }
}

/**
 * Creates a new quiz
 */
export async function createQuiz(quizData: {
  title: string;
  time_limit: number;
  passing_score: number;
  content: QuizQuestion[];
  groupIds?: string[];
  attachment?: QuizAttachment;
}): Promise<Quiz | null> {
  try {
    // First create the quiz
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .insert([{ 
        title: quizData.title, 
        time_limit: quizData.time_limit,
        passing_score: quizData.passing_score,
        content: quizData.content,
        attachment: quizData.attachment || null
      }])
      .select('*')
      .single();
    
    if (error) throw error;
    
    // If we have group IDs, share with those groups
    if (quizData.groupIds && quizData.groupIds.length > 0 && quiz) {
      const groupAssociations = quizData.groupIds.map(groupId => ({
        quiz_id: quiz.id,
        group_id: groupId
      }));
      
      const { error: sharingError } = await supabase
        .from('quiz_groups')
        .insert(groupAssociations);
      
      if (sharingError) throw sharingError;
    }
    
    return quiz;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
}

/**
 * Gets all quizzes with their associated groups
 */
export async function getAllQuizzes(): Promise<Quiz[]> {
  try {
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!quizzes || quizzes.length === 0) return [];

    const quizzesWithGroups = await Promise.all(
      quizzes.map(async (quiz) => {
        const { data: groupAssociations, error: groupError } = await supabase
          .from('quiz_groups')
          .select('group_id, groups(id, name)')
          .eq('quiz_id', quiz.id);

        if (groupError) throw groupError;

        return {
          ...quiz,
          groups: groupAssociations?.map(association => 
            association.groups && typeof association.groups === 'object' ? association.groups : { id: '', name: 'Unknown Group' }
          ) || []
        };
      })
    );

    return quizzesWithGroups;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
}

/**
 * Gets a single quiz by ID
 */
export async function getQuizById(quizId: string): Promise<Quiz | null> {
  try {
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (error) throw error;

    // Get groups this quiz is shared with
    const { data: groupAssociations, error: groupError } = await supabase
      .from('quiz_groups')
      .select('group_id, groups(id, name)')
      .eq('quiz_id', quizId);

    if (groupError) throw groupError;

    return {
      ...quiz,
      groups: groupAssociations?.map(association => 
        association.groups && typeof association.groups === 'object' ? association.groups : { id: '', name: 'Unknown Group' }
      ) || []
    };
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
}

/**
 * Gets all quizzes accessible to a student based on their group memberships
 */
export async function getStudentQuizzes(studentId: string): Promise<Quiz[]> {
  try {
    // Get all groups the student belongs to
    const { data: studentGroups, error: groupsError } = await supabase
      .from('student_groups')
      .select('group_id')
      .eq('student_id', studentId);
    
    if (groupsError) throw groupsError;
    
    if (!studentGroups || studentGroups.length === 0) {
      return []; // Student doesn't belong to any groups
    }
    
    const groupIds = studentGroups.map(g => g.group_id);
    
    // Get all quizzes shared with these groups
    const { data: quizAssociations, error: quizzesError } = await supabase
      .from('quiz_groups')
      .select(`
        quiz_id,
        group_id,
        groups(id, name)
      `)
      .in('group_id', groupIds);
    
    if (quizzesError) throw quizzesError;
    
    if (!quizAssociations || quizAssociations.length === 0) {
      return []; // No quizzes shared with student's groups
    }
    
    // Get unique quiz IDs
    const quizIds = [...new Set(quizAssociations.map(q => q.quiz_id))];
    
    // Get the actual quizzes
    const { data: quizzes, error: quizzesDataError } = await supabase
      .from('quizzes')
      .select('*')
      .in('id', quizIds)
      .order('created_at', { ascending: false });
    
    if (quizzesDataError) throw quizzesDataError;
    
    if (!quizzes || quizzes.length === 0) {
      return [];
    }
    
    // For each quiz, add the groups it's shared with
    const quizzesWithGroups = await Promise.all(
      quizzes.map(async (quiz) => {
        const groupsForQuiz = quizAssociations
          .filter(qa => qa.quiz_id === quiz.id)
          .map(qa => {
            if (qa.groups && typeof qa.groups === 'object' && 'name' in qa.groups) {
              return {
                id: qa.group_id,
                name: qa.groups.name
              };
            }
            return {
              id: qa.group_id,
              name: 'Unnamed Group'
            };
          });
        
        return {
          ...quiz,
          groups: groupsForQuiz
        };
      })
    );
    
    return quizzesWithGroups;
  } catch (error) {
    console.error('Error fetching student quizzes:', error);
    return [];
  }
}

/**
 * Creates a new feature request or bug report
 */
export async function createFeatureRequest(
  studentId: string,
  type: 'feature' | 'bug',
  title: string,
  description: string
): Promise<{ success: boolean; id?: string }> {
  try {
    const { data, error } = await supabase
      .from('feature_requests')
      .insert([
        {
          student_id: studentId,
          type,
          title,
          description,
          status: 'pending'
        }
      ])
      .select('id')
      .single();
    
    if (error) throw error;
    
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error creating feature request:', error);
    return { success: false };
  }
}

/**
 * Gets all feature requests for admin
 */
export async function getAllFeatureRequests() {
  try {
    const { data, error } = await supabase
      .from('feature_requests')
      .select(`
        *,
        students:student_id (
          id,
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching all feature requests:', error);
    return [];
  }
}

/**
 * Gets feature requests for a specific student
 */
export async function getStudentFeatureRequests(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('feature_requests')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching student feature requests:', error);
    return [];
  }
}

/**
 * Updates the status of a feature request
 */
export async function updateFeatureRequestStatus(
  id: string,
  status: 'pending' | 'rejected' | 'in_development' | 'completed'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('feature_requests')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating feature request status:', error);
    return false;
  }
}

// Update student groups (replace all existing groups with new ones)
export async function updateStudentGroups(studentId: string, groupIds: string[]): Promise<boolean> {
  try {
    // First delete all existing group memberships
    const { error: deleteError } = await supabase
      .from('student_groups')
      .delete()
      .eq('student_id', studentId);
    
    if (deleteError) {
      console.error('Error deleting existing student groups:', deleteError);
      return false;
    }
    
    // If no new groups, we're done
    if (groupIds.length === 0) {
      return true;
    }
    
    // Add new group memberships
    const groupInserts = groupIds.map(groupId => ({
      student_id: studentId,
      group_id: groupId,
      joined_at: new Date().toISOString()
    }));
    
    const { error: insertError } = await supabase
      .from('student_groups')
      .insert(groupInserts);
    
    if (insertError) {
      console.error('Error inserting new student groups:', insertError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating student groups:', error);
    return false;
  }
} 