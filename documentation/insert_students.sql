-- SQL Script to import students from students.md into the database
-- Generated for MGSoftware

-- This script handles:
-- 1. Inserting students with properly capitalized names into the students table
-- 2. Creating corresponding user accounts with PINs
-- 3. Linking students to their respective groups

BEGIN;

-- Create temporary tables to hold the student data
CREATE TEMP TABLE temp_students (
    id SERIAL PRIMARY KEY,
    full_name TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    pin TEXT,
    username TEXT,
    groups TEXT[]
);

-- Insert all students from students.md
-- Each row represents one student with their information
INSERT INTO temp_students (full_name, phone, pin, groups) VALUES
('Ninderjeet Singh', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Boys Kirtan class', 'Sunday Kirtan Class', 'Tuesday tabla class']),
('Prabhnoor Kaur', '+1(000) 000-0000', '1176084', ARRAY['MGSV', 'Sqaumish Kirtan Lessons']),
('Tehjas Singh', '+1(000) 000-0000', '2705', ARRAY['MGSV']),
('Ekam Nagra', '+1(000) 000-0000', '4767', ARRAY['MGSV', 'Sunday Kirtan Class', 'Tuesday kirtan Class']),
('Prabhneet Kaur', '+1(000) 000-0000', '2011', ARRAY['MGSV', 'Sqaumish Kirtan Lessons']),
('Ekamjot Singh', '+1(000) 000-0000', '2009', ARRAY['MGSV', 'Boys Kirtan class', 'Tabla', 'Sunday Kirtan Class']),
('Himmat Chauhan', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Sunday Kirtan Class', 'Tuesday kirtan Class']),
('Jorawar Singh', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Tabla', 'Tuesday tabla class']),
('Gurveer Singh', '+1(000) 000-0000', '2014', ARRAY['MGSV', 'Tuesday kirtan Class']),
('Leah Kaur', '+1(000) 000-0000', '2012', ARRAY['MGSV', 'Tanti Saaj', 'Wednesday kirtan class', 'Sunday Kirtan Class']),
('Jasmine Kaur', '+1(000) 000-0000', '8384', ARRAY['MGSV', 'Sqaumish Kirtan Lessons']),
('Arleen Kaur', '+1(000) 000-0000', '0000', ARRAY['MGSV']),
('Sahib Kaur', '+1(000) 000-0000', '4434', ARRAY['MGSV']),
('Navjot Kaur', '+1(000) 000-0000', '1995', ARRAY['MGSV']),
('Jannat Kaur', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Sqaumish Kirtan Lessons']),
('Ersheen Kaur', '+1(000) 000-0000', '0000', ARRAY['MGSV']),
('Jaskeerat Kaur Garcha', '+1(000) 000-0000', '1313', ARRAY['MGSV']),
('Test Singh', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Test Group']),
('Felix Singh', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Tabla', 'Tuesday tabla class']),
('Jasleen Kaur Biring', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Tanti Saaj']),
('Jasmine Kaur', '+1(000) 000-0000', '20131211', ARRAY['MGSV']), -- Second Jasmine Kaur with different PIN
('Simar Boparai', '+1(000) 000-0000', '2646', ARRAY['MGSV', 'Sunday Kirtan Class']),
('Dayven Singh', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Sunday Kirtan Class']),
('Miherleen Kaur', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Tuesday kirtan Class']),
('Zoi Bawa', '+1(000) 000-0000', '301020', ARRAY['MGSV', 'Wednesday kirtan class']),
('Gurpreet Biring', '+1(000) 000-0000', '7802', ARRAY['MGSV', 'Tanti Saaj', 'Wednesday kirtan class']),
('Saroop Nanra', '+1(000) 000-0000', '8275', ARRAY['MGSV', 'Boys Kirtan class', 'Tuesday tabla class']),
('Harveer Singh', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Tabla', 'Tuesday tabla class']),
('Ekam Singh', '+1(000) 000-0000', '4629', ARRAY['MGSV', 'Tabla', 'Tuesday tabla class']),
('Anant Singh', '+1(000) 000-0000', '1699', ARRAY['MGSV', 'Sqaumish Kirtan Lessons']),
('Sahib Singh', '+1(000) 000-0000', '2025', ARRAY['MGSV']),
('Jaitegam Singh', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Tabla', 'Wednesday kirtan class']),
('Kirpa Kalra', '+1(000) 000-0000', '7319', ARRAY['MGSV', 'Tabla', 'Tanti Saaj', 'Tuesday tabla class']),
('Jasraj Mann', '+1(000) 000-0000', '7791', ARRAY['MGSV', 'Tabla', 'Wednesday kirtan class']),
('Sahib Grewal', '+1(000) 000-0000', '7751', ARRAY['MGSV', 'Tanti Saaj', 'Tabla', 'Wednesday kirtan class']),
('Jasreet Kaur', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Sqaumish Kirtan Lessons']),
('Mannat Kaur', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Sqaumish Kirtan Lessons']),
('Sidak Singh', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Tabla', 'Tuesday tabla class']),
('Varkha Biring', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Tanti Saaj', 'Wednesday kirtan class']),
('Heera Singh', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Boys Kirtan class', 'Sunday Kirtan Class']),
('Simar Mann', '+1(000) 000-0000', '55719', ARRAY['MGSV', 'Wednesday kirtan class']),
('Jugraj Mann', '+1(000) 000-0000', '1024', ARRAY['MGSV', 'Boys Kirtan class', 'Tabla', 'Sunday Kirtan Class']),
('Anand Chauhan', '+1(000) 000-0000', '1111', ARRAY['MGSV', 'Tanti Saaj', 'Sunday Kirtan Class', 'Tuesday kirtan Class']),
('Harian Singh', '+1(000) 000-0000', '1071', ARRAY['MGSV', 'Tabla', 'Sunday Kirtan Class']),
('Earleen Kaur', '+1(000) 000-0000', '2516', ARRAY['MGSV', 'Tanti Saaj', 'Sunday Kirtan Class']),
('Jaskaran Lail', '+1(000) 000-0000', '1979', ARRAY['MGSV', 'Boys Kirtan class', 'Tuesday kirtan Class']),
('Ajit Singh', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Tabla', 'Wednesday kirtan class']),
('Simran Biring', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Wednesday kirtan class']),
('Simreen Kaur', '+1(000) 000-0000', '2011', ARRAY['MGSV', 'Sunday Kirtan Class']),
('Angad Singh', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Sqaumish Kirtan Lessons']),
('Ish Kaur', '+1(000) 000-0000', '0000', ARRAY['MGSV']),
('Sophia Kaur', '+1(000) 000-0000', '2709', ARRAY['MGSV', 'Wednesday kirtan class', 'Sunday Kirtan Class']),
('Sukhman Bhatti', '+1(000) 000-0000', '1313', ARRAY['MGSV', 'Tabla', 'Tanti Saaj', 'Tuesday tabla class', 'Sunday Kirtan Class']),
('Fateh Singh', '+1(000) 000-0000', '1212', ARRAY['MGSV', 'Wednesday kirtan class']),
('Harman Kaur', '+1(000) 000-0000', '1234', ARRAY['MGSV']),
('Gurpreet Kaur', '+1(000) 000-0000', '222014', ARRAY['MGSV', 'Tanti Saaj', 'Wednesday kirtan class']),
('Jasmine Nanra', '+1(000) 000-0000', '1308659', ARRAY['MGSV', 'Sunday Kirtan Class']),
('Gursimran Singh', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Sunday Kirtan Class']),
('Ishaan Singh', '+1(000) 000-0000', '2170', ARRAY['MGSV', 'Boys Kirtan class', 'Wednesday kirtan class']),
('Shylin Kaur', '+1(000) 000-0000', '7319', ARRAY['MGSV', 'Tuesday kirtan Class']),
('Navleen Kaur', '+1(000) 000-0000', '9865', ARRAY['MGSV', 'Sqaumish Kirtan Lessons']),
('Taj Hanjra', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Tabla']),
('Gursharan Singh', '+1(000) 000-0000', '132225', ARRAY['MGSV', 'Tanti Saaj', 'Wednesday kirtan class']),
('Gurleen Thandi', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Sqaumish Kirtan Lessons']),
('Tript Kaur', '+1(000) 000-0000', '2713', ARRAY['MGSV', 'Wednesday kirtan class']),
('Muraadbir Singh', '+1(000) 000-0000', '1234', ARRAY['MGSV', 'Sqaumish Kirtan Lessons']),
('Yash Singh', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Tabla', 'Tuesday tabla class']),
('Taranjot Pannu', '+1(000) 000-0000', '1699', ARRAY['MGSV', 'Boys Kirtan class', 'Tanti Saaj', 'Sunday Kirtan Class']),
('Jaskaran Singh', '+1(604) 725-8010', '6242', ARRAY['MGSV', 'Tanti Saaj', 'Tabla', 'Sunday Kirtan Class']),
('Jasraj Garcha', '+1(000) 000-0000', '6768', ARRAY['MGSV', 'Tabla', 'Sunday Kirtan Class']),
('Gurshan Thind', '+1(000) 000-0000', '0000', ARRAY['MGSV']),
('Harkirat Lail', '+1(000) 000-0000', '06022008', ARRAY['MGSV', 'Boys Kirtan class', 'Tuesday kirtan Class']),
('Eknoor Garcha', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Sunday Kirtan Class']),
('Agam Nagra', '+1(000) 000-0000', '2010', ARRAY['MGSV', 'Tuesday kirtan Class', 'Tanti Saaj', 'Sunday Kirtan Class', 'April 23, 2025']),
('Japnoor Garcha', '+1(000) 000-0000', '1313', ARRAY['MGSV', 'Sunday Kirtan Class']),
('Puneet Kaur', '+1(000) 000-0000', '0000', ARRAY['MGSV']),
('Jaap Kaur', '+1(000) 000-0000', '1968', ARRAY['MGSV', 'Tanti Saaj', 'Tuesday kirtan Class', 'Sunday Kirtan Class']),
('Sehaj Bhatti', '+1(000) 000-0000', '2324', ARRAY['MGSV', 'Tanti Saaj', 'Tabla', 'Sunday Kirtan Class', 'Tuesday kirtan Class']),
('Harnoor Khurana', '+1(000) 000-0000', '1903', ARRAY['MGSV', 'Tanti Saaj', 'Sunday Kirtan Class', 'Tuesday kirtan Class']),
('Gurveen Kaur', '+1(000) 000-0000', '28025013', ARRAY['MGSV', 'Wednesday kirtan class']),
('Amol Kaur', '+1(000) 000-0000', '2025270', ARRAY['MGSV', 'Wednesday kirtan class']),
('Arshdeep Nagi', '+1(778) 556-2737', '0000', ARRAY['MGSV', 'Tanti Saaj', 'Tabla']),
('Karamjeet Singh', '+1(000) 000-0000', '5822', ARRAY['MGSV', 'Tabla', 'Tuesday tabla class']),
('Kawan Singh Nagra', '+1(000) 000-0000', '2012', ARRAY['MGSV', 'Sunday Kirtan Class', 'Tuesday tabla class']),
('Tia Kaur', '+1(000) 000-0000', '1214', ARRAY['MGSV', 'Sunday Kirtan Class']),
('Manvir Badesha', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Tabla']),
('Millen Singh', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Sunday Kirtan Class']),
('Jupjeet Thandi', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Sunday Kirtan Class', 'Tuesday kirtan Class']),
('Saroop Singh', '+1(000) 000-0000', '1984', ARRAY['MGSV', 'Tuesday kirtan Class']),
('Isher Singh', '+1(000) 000-0000', '0000', ARRAY['MGSV']),
('Saachi Boparai', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Sunday Kirtan Class']),
('Sahaj Kaur', '+1(604) 849-8412', '1984', ARRAY['MGSV', 'Sqaumish Kirtan Lessons']),
('Balreet Kaur', '+1(000) 000-0000', '2014', ARRAY['MGSV', 'Wednesday kirtan class']),
('Komalpreet Kaur', '+1(000) 000-0000', '0000', ARRAY['MGSV', 'Sunday Kirtan Class']);

-- Split full name into first_name and last_name
UPDATE temp_students 
SET 
    first_name = CASE 
        WHEN position(' ' in full_name) > 0 
        THEN initcap(substring(full_name from 1 for position(' ' in full_name) - 1))
        ELSE initcap(full_name)
    END,
    last_name = CASE 
        WHEN position(' ' in full_name) > 0 
        THEN initcap(substring(full_name from position(' ' in full_name) + 1))
        ELSE ''
    END;

-- Handle duplicate usernames by adding a numeric suffix
WITH name_counts AS (
    SELECT 
        lower(first_name) as name,
        COUNT(*) as count
    FROM temp_students
    GROUP BY lower(first_name)
    HAVING COUNT(*) > 1
)
UPDATE temp_students ts
SET username = CASE
    WHEN EXISTS (SELECT 1 FROM name_counts nc WHERE nc.name = lower(ts.first_name))
    THEN lower(ts.first_name) || ts.id  -- Append the serial ID to make it unique
    ELSE lower(ts.first_name)  -- Use regular lowercase first name if no duplicates
END;

-- Insert students
WITH inserted_students AS (
    INSERT INTO students (first_name, last_name, phone)
    SELECT first_name, last_name, phone
    FROM temp_students
    RETURNING id, first_name, last_name
)
-- Insert users with unique usernames for duplicates
, inserted_users AS (
    INSERT INTO users (username, pin, role, student_id)
    SELECT 
        COALESCE(ts.username, lower(s.first_name)), -- Use generated username or default
        ts.pin, 
        'student', 
        s.id
    FROM inserted_students s
    JOIN temp_students ts ON lower(s.first_name) = lower(ts.first_name) 
        AND (lower(s.last_name) = lower(ts.last_name) OR (s.last_name IS NULL AND ts.last_name IS NULL))
    ON CONFLICT (username) DO NOTHING
    RETURNING student_id
)
-- Insert student_groups
INSERT INTO student_groups (student_id, group_id)
SELECT u.student_id, g.id
FROM inserted_users u
JOIN inserted_students s ON u.student_id = s.id
JOIN temp_students ts ON lower(s.first_name) = lower(ts.first_name) 
    AND (lower(s.last_name) = lower(ts.last_name) OR (s.last_name IS NULL AND ts.last_name IS NULL))
CROSS JOIN unnest(ts.groups) AS group_name
JOIN groups g ON g.name = group_name
ON CONFLICT (student_id, group_id) DO NOTHING;

-- Clean up
DROP TABLE temp_students;

-- Display script execution status
DO $$
BEGIN
    RAISE NOTICE 'Student import completed successfully';
END $$;

COMMIT;