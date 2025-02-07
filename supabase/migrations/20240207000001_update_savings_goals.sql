-- Step 1: Add new columns with temporary nullability
ALTER TABLE public.savings_goals
ADD COLUMN goal_type text,
ADD COLUMN recurring_amount numeric,
ADD COLUMN period_start date,
ADD COLUMN period_end date;

-- Step 2: Migrate existing data
-- First, ensure all existing goals are properly marked as one-time goals
-- and have their dates properly set
UPDATE public.savings_goals
SET 
  goal_type = 'one_time',
  period_start = COALESCE(start_date, CURRENT_DATE),
  period_end = COALESCE(end_date, start_date + INTERVAL '1 year');

-- Step 3: Make required columns non-nullable
ALTER TABLE public.savings_goals
ALTER COLUMN goal_type SET NOT NULL,
ALTER COLUMN period_start SET NOT NULL;

-- Step 4: Add basic type constraint
ALTER TABLE public.savings_goals
ADD CONSTRAINT valid_goal_type 
CHECK (goal_type IN ('one_time', 'recurring_monthly', 'recurring_yearly'));

-- Step 5: Add constraint for recurring amount
ALTER TABLE public.savings_goals
ADD CONSTRAINT valid_recurring_amount CHECK (
  (goal_type IN ('recurring_monthly', 'recurring_yearly') AND recurring_amount IS NOT NULL) OR
  (goal_type = 'one_time' AND recurring_amount IS NULL)
);

-- Step 6: Add constraint for period end
ALTER TABLE public.savings_goals
ADD CONSTRAINT valid_period_end CHECK (
  (goal_type = 'one_time' AND period_end IS NOT NULL) OR
  (goal_type IN ('recurring_monthly', 'recurring_yearly'))
);

-- Step 7: Create an index for faster queries on active goals
CREATE INDEX idx_active_savings_goals ON public.savings_goals (user_id, goal_type)
WHERE period_end IS NULL;

-- Step 8: Add trigger to ensure only one active recurring goal per user
CREATE OR REPLACE FUNCTION check_active_recurring_goals()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.goal_type IN ('recurring_monthly', 'recurring_yearly') AND NEW.period_end IS NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.savings_goals
      WHERE user_id = NEW.user_id
        AND goal_type = NEW.goal_type
        AND period_end IS NULL
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) THEN
      RAISE EXCEPTION 'User can only have one active recurring goal of each type';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_active_recurring_goal
BEFORE INSERT OR UPDATE ON public.savings_goals
FOR EACH ROW
EXECUTE FUNCTION check_active_recurring_goals();

-- Step 9: Drop old columns (after ensuring data is migrated)
ALTER TABLE public.savings_goals
DROP COLUMN IF EXISTS start_date,
DROP COLUMN IF EXISTS end_date;

-- Step 10: Update RLS policies to reflect new schema
DROP POLICY IF EXISTS "Users can view their own savings goals" ON public.savings_goals;
DROP POLICY IF EXISTS "Users can insert their own savings goals" ON public.savings_goals;
DROP POLICY IF EXISTS "Users can update their own savings goals" ON public.savings_goals;
DROP POLICY IF EXISTS "Users can delete their own savings goals" ON public.savings_goals;

CREATE POLICY "Users can view their own savings goals"
  ON public.savings_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own savings goals"
  ON public.savings_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own savings goals"
  ON public.savings_goals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own savings goals"
  ON public.savings_goals FOR DELETE
  USING (auth.uid() = user_id); 