CREATE OR REPLACE FUNCTION update_fee_paid_until(p_fee_id UUID, p_months INTEGER) 
RETURNS VOID AS $$
DECLARE
  current_date_value DATE;
BEGIN
  -- Get the current paid_until value
  SELECT paid_until INTO current_date_value FROM fees WHERE id = p_fee_id;
  
  -- Update with new date by adding or subtracting months
  UPDATE fees 
  SET 
    paid_until = (current_date_value + (p_months || ' months')::INTERVAL),
    updated_at = NOW()
  WHERE id = p_fee_id;
END;
$$ LANGUAGE plpgsql; 