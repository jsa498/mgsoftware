CREATE OR REPLACE FUNCTION get_student_practice_stats(p_student_id UUID, p_period TEXT) 
RETURNS TABLE(
  session_count BIGINT,
  total_minutes BIGINT,
  last_practice_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    COUNT(*) AS session_count,
    COALESCE(SUM(p.duration_minutes), 0) AS total_minutes,
    MAX(p.completed_at) AS last_practice_date
  FROM practice_sessions p
  WHERE p.student_id = p_student_id
  AND p.status = 'completed'
  AND CASE 
    WHEN p_period = 'today' THEN DATE(p.started_at) = CURRENT_DATE
    WHEN p_period = 'week' THEN p.started_at >= (CURRENT_DATE - INTERVAL '7 days')
    WHEN p_period = 'month' THEN p.started_at >= (CURRENT_DATE - INTERVAL '1 month')
    WHEN p_period = 'all' THEN TRUE
    ELSE FALSE
  END;
END;
$$ LANGUAGE plpgsql; 