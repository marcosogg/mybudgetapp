-- Create monthly_income table
CREATE TABLE monthly_income (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    salary NUMERIC NOT NULL DEFAULT 0,
    bonus NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT monthly_income_user_month_key UNIQUE(user_id, month)
);

-- Create index for efficient querying
CREATE INDEX idx_monthly_income_user_month ON monthly_income(user_id, month);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_monthly_income_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER monthly_income_updated_at
    BEFORE UPDATE ON monthly_income
    FOR EACH ROW
    EXECUTE FUNCTION update_monthly_income_updated_at();

-- Migrate existing income data
INSERT INTO monthly_income (user_id, month, salary, bonus)
SELECT 
    id as user_id,
    DATE_TRUNC('month', NOW()) as month,
    salary,
    bonus
FROM profiles
WHERE salary > 0 OR bonus > 0;

-- Remove salary and bonus from profiles
ALTER TABLE profiles DROP COLUMN salary;
ALTER TABLE profiles DROP COLUMN bonus; 