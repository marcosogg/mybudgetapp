-- Insert mock data for testing
-- Note: Replace 'your-user-id' with an actual user ID from your auth.users table
WITH test_user AS (
  SELECT id FROM auth.users LIMIT 1
)
INSERT INTO public.savings_goals 
(user_id, name, goal_type, target_amount, recurring_amount, period_start, period_end, progress, notes)
SELECT
  id as user_id,
  name,
  goal_type,
  target_amount,
  recurring_amount,
  period_start,
  period_end,
  progress,
  notes
FROM test_user CROSS JOIN (
  VALUES
    (
      'Emergency Fund',
      'one_time',
      10000,
      NULL,
      CURRENT_DATE,
      CURRENT_DATE + INTERVAL '1 year',
      25,
      'Building emergency savings'
    ),
    (
      'Monthly Savings',
      'recurring',
      1000,
      100,
      CURRENT_DATE,
      NULL,
      50,
      'Regular monthly savings goal'
    ),
    (
      'New Car',
      'one_time',
      25000,
      NULL,
      CURRENT_DATE,
      CURRENT_DATE + INTERVAL '2 years',
      10,
      'Saving for a new car'
    )
) AS mock_data(name, goal_type, target_amount, recurring_amount, period_start, period_end, progress, notes); 