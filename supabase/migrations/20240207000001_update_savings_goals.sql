-- Drop existing table and related objects
DROP TABLE IF EXISTS public.savings_goals CASCADE;

-- Create new table with simplified schema
CREATE TABLE public.savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL DEFAULT 'Untitled Goal',
  goal_type TEXT NOT NULL CHECK (goal_type IN ('one_time', 'recurring')),
  target_amount NUMERIC NOT NULL CHECK (target_amount > 0),
  recurring_amount NUMERIC CHECK (
    (goal_type = 'recurring' AND recurring_amount IS NOT NULL AND recurring_amount > 0) OR
    (goal_type = 'one_time' AND recurring_amount IS NULL)
  ),
  period_start DATE NOT NULL,
  period_end DATE CHECK (
    (goal_type = 'one_time' AND period_end IS NOT NULL AND period_end > period_start) OR
    (goal_type = 'recurring')
  ),
  progress NUMERIC NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger
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

-- Create index for faster queries
CREATE INDEX idx_savings_goals_user_active ON public.savings_goals (user_id, goal_type)
WHERE period_end IS NULL;

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

-- Add trigger to enforce single active recurring goal
CREATE OR REPLACE FUNCTION check_active_recurring_goals()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.goal_type = 'recurring' AND NEW.period_end IS NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.savings_goals
      WHERE user_id = NEW.user_id
        AND goal_type = 'recurring'
        AND period_end IS NULL
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) THEN
      RAISE EXCEPTION 'User can only have one active recurring goal';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_active_recurring_goal
  BEFORE INSERT OR UPDATE ON public.savings_goals
  FOR EACH ROW
  EXECUTE FUNCTION check_active_recurring_goals(); 