CREATE OR REPLACE FUNCTION get_student_fee_status(p_student_id UUID) 
RETURNS TABLE(
  id UUID,
  student_id UUID,
  student_name TEXT,
  amount NUMERIC,
  paid_until DATE,
  status TEXT,
  color_code TEXT
) AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    f.id,
    f.student_id,
    s.first_name || ' ' || s.last_name AS student_name,
    f.amount,
    f.paid_until,
    CASE
      WHEN f.paid_until < CURRENT_DATE THEN 'past_due'
      WHEN f.paid_until <= (CURRENT_DATE + INTERVAL '1 month') THEN 'due_soon'
      ELSE 'paid'
    END AS status,
    CASE
      WHEN f.paid_until < CURRENT_DATE THEN 'red'
      WHEN f.paid_until <= (CURRENT_DATE + INTERVAL '1 month') THEN 'yellow'
      ELSE 'green'
    END AS color_code
  FROM fees f
  JOIN students s ON f.student_id = s.id
  WHERE f.student_id = p_student_id
  ORDER BY f.paid_until DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql; 