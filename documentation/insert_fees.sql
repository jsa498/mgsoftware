-- SQL Script to insert fee records for all students
-- Generated for MGSoftware

-- This script creates fee records for all students, setting them as paid until March 31, 2024
-- The amount is set to 0.00 as the system only tracks the paid_until date

BEGIN;

-- Insert fee records for all students
INSERT INTO fees (student_id, amount, paid_until, payment_date, status)
SELECT 
    id AS student_id,
    0.00 AS amount,  -- Amount set to 0.00 as per system design
    '2024-03-31' AS paid_until,  -- Paid until March 31, 2024
    CURRENT_TIMESTAMP AS payment_date,
    'paid' AS status
FROM students
WHERE NOT EXISTS (
    -- Skip students who already have fee records
    SELECT 1 FROM fees f WHERE f.student_id = students.id
);

-- Display script execution status
DO $$
BEGIN
    RAISE NOTICE 'Student fees inserted successfully';
END $$;

COMMIT; 