-- Drop existing table and related objects
DROP TABLE IF EXISTS public.savings_goals CASCADE;

-- Create new table with updated schema
CREATE TABLE public.savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('one_time', 'recurring_monthly', 'recurring_yearly')),
  target_amount NUMERIC NOT NULL CHECK (target_amount > 0),
  recurring_amount NUMERIC CHECK (
    (goal_type IN ('recurring_monthly', 'recurring_yearly') AND recurring_amount IS NOT NULL AND recurring_amount > 0) OR
    (goal_type = 'one_time' AND recurring_amount IS NULL)
  ),
  period_start DATE CHECK (
    (goal_type = 'one_time' AND period_start IS NULL) OR
    (goal_type = 'recurring_monthly' AND period_start IS NOT NULL AND period_start = DATE_TRUNC('month', period_start)) OR
    (goal_type = 'recurring_yearly' AND period_start IS NOT NULL AND period_start = DATE_TRUNC('year', period_start))
  ),
  period_end DATE CHECK (period_end IS NULL),
  progress NUMERIC NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_savings_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_savings_goals_updated_at
  BEFORE UPDATE ON public.savings_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_savings_goals_updated_at();

-- Create trigger for date handling
CREATE OR REPLACE FUNCTION set_goal_dates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.goal_type = 'one_time' THEN
    NEW.period_start := NULL;
    NEW.period_end := NULL;
  ELSIF NEW.goal_type = 'recurring_monthly' THEN
    NEW.period_start := DATE_TRUNC('month', COALESCE(NEW.period_start, CURRENT_DATE));
    NEW.period_end := NULL;
  ELSIF NEW.goal_type = 'recurring_yearly' THEN
    NEW.period_start := DATE_TRUNC('year', CURRENT_DATE);
    NEW.period_end := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_goal_dates_trigger
  BEFORE INSERT OR UPDATE ON public.savings_goals
  FOR EACH ROW
  EXECUTE FUNCTION set_goal_dates();

-- Add RLS policies
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

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