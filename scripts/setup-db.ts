import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing environment variables for Supabase');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  console.log('Setting up database...');

  try {
    // Create extension for UUID generation if not exists
    await supabase.rpc('pgsql', { query: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";' });

    // Create students table
    await supabase.from('students').select('count(*)').throwOnError();
    console.log('Students table already exists, skipping creation');
  } catch (error) {
    console.log('Creating students table...');
    const createStudentsTable = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS students (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        address TEXT,
        enrollment_date TIMESTAMPTZ DEFAULT now(),
        status TEXT DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log('Students table created');
  }

  try {
    // Create groups table
    await supabase.from('groups').select('count(*)').throwOnError();
    console.log('Groups table already exists, skipping creation');
  } catch (error) {
    console.log('Creating groups table...');
    const createGroupsTable = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS groups (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log('Groups table created');
  }

  try {
    // Create student_groups table
    await supabase.from('student_groups').select('count(*)').throwOnError();
    console.log('Student groups table already exists, skipping creation');
  } catch (error) {
    console.log('Creating student_groups table...');
    const createStudentGroupsTable = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS student_groups (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id UUID REFERENCES students(id) ON DELETE CASCADE,
        group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
        joined_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE (student_id, group_id)
      );
    `);
    console.log('Student groups table created');
  }

  try {
    // Create practice_sessions table
    await supabase.from('practice_sessions').select('count(*)').throwOnError();
    console.log('Practice sessions table already exists, skipping creation');
  } catch (error) {
    console.log('Creating practice_sessions table...');
    const createPracticeSessionsTable = await supabase.sql(`
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
    `);
    console.log('Practice sessions table created');
  }

  try {
    // Create messages table
    await supabase.from('messages').select('count(*)').throwOnError();
    console.log('Messages table already exists, skipping creation');
  } catch (error) {
    console.log('Creating messages table...');
    const createMessagesTable = await supabase.sql(`
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
    `);
    console.log('Messages table created');
  }

  try {
    // Create practice_materials table
    await supabase.from('practice_materials').select('count(*)').throwOnError();
    console.log('Practice materials table already exists, skipping creation');
  } catch (error) {
    console.log('Creating practice_materials table...');
    const createPracticeMaterialsTable = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS practice_materials (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        description TEXT,
        file_url TEXT,
        file_type TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log('Practice materials table created');
  }

  try {
    // Create fees table
    await supabase.from('fees').select('count(*)').throwOnError();
    console.log('Fees table already exists, skipping creation');
  } catch (error) {
    console.log('Creating fees table...');
    const createFeesTable = await supabase.sql(`
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
    `);
    console.log('Fees table created');
  }

  console.log('Database setup complete!');
}

setupDatabase()
  .catch(error => {
    console.error('Error setting up database:', error);
    process.exit(1);
  }); 