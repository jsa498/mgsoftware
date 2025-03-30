-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  enrollment_date TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create student_groups table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS student_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, group_id)
);

-- Create practice_sessions table
CREATE TABLE IF NOT EXISTS practice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  duration_minutes INTEGER,
  points NUMERIC(5,2),
  status TEXT DEFAULT 'completed',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES students(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES students(id) ON DELETE SET NULL,
  group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
  subject TEXT,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create practice_materials table
CREATE TABLE IF NOT EXISTS practice_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create fees table
CREATE TABLE IF NOT EXISTS fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  paid_until DATE NOT NULL,
  payment_date TIMESTAMPTZ,
  status TEXT DEFAULT 'due',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert sample data for students
INSERT INTO students (first_name, last_name, phone, enrollment_date, status)
VALUES
  ('Sahib Singh', 'Grewal', '123-456-7890', '2023-01-15', 'active'),
  ('Prabhnoor', 'Kaur', '123-456-7891', '2023-02-20', 'active'),
  ('Tehjas', 'Singh', '123-456-7892', '2023-03-10', 'active'),
  ('Ekam Kaur', 'Nagra', '123-456-7893', '2023-04-05', 'active'),
  ('Prabhneet', 'Kaur', '123-456-7894', '2023-05-01', 'active');

-- Insert sample data for groups
INSERT INTO groups (name, description, status)
VALUES
  ('Beginners', 'For beginners learning the basics', 'active'),
  ('Intermediate', 'For intermediate students', 'active'),
  ('Advanced', 'For advanced students', 'active'),
  ('Morning Batch', 'Morning session students', 'active'),
  ('Evening Batch', 'Evening session students', 'active');

-- Insert sample data for student_groups
INSERT INTO student_groups (student_id, group_id)
SELECT s.id, g.id
FROM students s, groups g
WHERE s.first_name = 'Sahib Singh' AND g.name = 'Advanced'
UNION ALL
SELECT s.id, g.id
FROM students s, groups g
WHERE s.first_name = 'Prabhnoor' AND g.name = 'Intermediate'
UNION ALL
SELECT s.id, g.id
FROM students s, groups g
WHERE s.first_name = 'Tehjas' AND g.name = 'Beginners';

-- Insert sample data for practice_sessions
INSERT INTO practice_sessions (student_id, duration_minutes, points, status, started_at, completed_at)
SELECT s.id, 9, 0.45, 'completed', NOW() - INTERVAL '6 HOURS', NOW() - INTERVAL '6 HOURS' + INTERVAL '9 MINUTES'
FROM students s
WHERE s.first_name = 'Sahib Singh'
UNION ALL
SELECT s.id, 7, 0.36, 'completed', NOW() - INTERVAL '6 HOURS' - INTERVAL '20 MINUTES', NOW() - INTERVAL '6 HOURS' - INTERVAL '13 MINUTES'
FROM students s
WHERE s.first_name = 'Sahib Singh';

-- Insert sample data for fees
INSERT INTO fees (student_id, amount, paid_until, status)
SELECT s.id, 100.00, '2025-02-28', 'past_due'
FROM students s
WHERE s.first_name = 'Prabhnoor'
UNION ALL
SELECT s.id, 100.00, '2025-02-28', 'past_due'
FROM students s
WHERE s.first_name = 'Tehjas'
UNION ALL
SELECT s.id, 100.00, '2025-02-28', 'past_due'
FROM students s
WHERE s.first_name = 'Ekam Kaur'
UNION ALL
SELECT s.id, 100.00, '2025-02-28', 'past_due'
FROM students s
WHERE s.first_name = 'Prabhneet';

-- Create view for active students count
CREATE OR REPLACE VIEW active_students_count AS
SELECT COUNT(*) as count FROM students WHERE status = 'active';

-- Create view for active groups count
CREATE OR REPLACE VIEW active_groups_count AS
SELECT COUNT(*) as count FROM groups WHERE status = 'active';

-- Create view for unread messages count
CREATE OR REPLACE VIEW unread_messages_count AS
SELECT COUNT(*) as count FROM messages WHERE is_read = false;

-- Create view for new practice materials count (added in the last 7 days)
CREATE OR REPLACE VIEW new_practice_materials_count AS
SELECT COUNT(*) as count FROM practice_materials WHERE created_at > NOW() - INTERVAL '7 days';

-- Create view for recent activity
CREATE OR REPLACE VIEW recent_activity AS
SELECT 
  ps.id,
  CONCAT(s.first_name, ' ', s.last_name) as student_name,
  ps.duration_minutes,
  ps.points,
  ps.status,
  ps.started_at,
  ps.completed_at
FROM practice_sessions ps
JOIN students s ON ps.student_id = s.id
ORDER BY ps.started_at DESC
LIMIT 10;

-- Create view for fee alerts
CREATE OR REPLACE VIEW fee_alerts AS
SELECT 
  f.id,
  CONCAT(s.first_name, ' ', s.last_name) as student_name,
  f.amount,
  f.paid_until,
  f.status
FROM fees f
JOIN students s ON f.student_id = s.id
WHERE f.status = 'past_due'
ORDER BY f.paid_until ASC; 