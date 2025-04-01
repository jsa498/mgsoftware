export type Student = {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  enrollment_date: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};

export type Group = {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};

export type StudentGroup = {
  id: string;
  student_id: string;
  group_id: string;
  joined_at: string;
};

export type PracticeSession = {
  id: string;
  student_id: string;
  duration_minutes: number;
  points: number;
  status: 'started' | 'completed' | 'cancelled';
  started_at: string;
  completed_at?: string;
  created_at: string;
};

export type Message = {
  id: string;
  sender_id?: string;
  recipient_id?: string;
  group_id?: string;
  subject?: string;
  body: string;
  is_read: boolean;
  created_at: string;
};

export type PracticeMaterial = {
  id: string;
  title: string;
  description?: string;
  file_url?: string;
  file_type?: string;
  file_name?: string;
  file_size?: number;
  group_ids?: string[];
  created_at: string;
  updated_at: string;
};

export type PracticeMaterialGroup = {
  id: string;
  practice_material_id: string;
  group_id: string;
  created_at: string;
};

export type Fee = {
  id: string;
  student_id: string;
  amount: number;
  paid_until: string;
  payment_date?: string;
  status: 'paid' | 'due' | 'past_due';
  created_at: string;
  updated_at: string;
};

export type DashboardStats = {
  activeStudentsCount: number;
  activeGroupsCount: number;
  unreadMessagesCount: number;
  newPracticeMaterialsCount: number;
};

export type RecentActivity = {
  id: string;
  student_name: string;
  duration_minutes?: number;
  points?: number;
  status: string;
  started_at: string;
  completed_at?: string;
};

export type FeeAlert = {
  id: string;
  student_name: string;
  amount: number;
  paid_until: string;
  status: string;
  alert_type: 'past_due' | 'due_soon' | 'upcoming';
};

export type Attendance = {
  id: string;
  student_id: string;
  group_id: string;
  date: string;
  status: boolean | null;
  created_at: string;
  updated_at: string;
};

export type StudentAttendance = {
  id: string;
  name: string;
  contact: string;
  attendance: Record<number, boolean | null>;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
};

export type QuizAttachment = {
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
};

export type Quiz = {
  id: string;
  title: string;
  time_limit: number;
  passing_score: number;
  content: QuizQuestion[];
  attachment?: QuizAttachment;
  created_at: string;
  updated_at: string;
  groups?: Group[];
};

export type QuizGroup = {
  id: string;
  quiz_id: string;
  group_id: string;
  created_at: string;
};

export type QuizResult = {
  id: string;
  student_id: string;
  quiz_id: string;
  score: number;
  completed_at: string;
  created_at: string;
};

export type FeatureRequest = {
  id: string;
  student_id: string;
  type: 'feature' | 'bug';
  title: string;
  description: string;
  status: 'pending' | 'rejected' | 'in_development' | 'completed';
  created_at: string;
  updated_at: string;
}; 