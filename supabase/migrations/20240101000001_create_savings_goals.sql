create table public.savings_goals (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    target_amount numeric not null,
    start_date date not null,
    end_date date,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint savings_goals_target_amount_check check (target_amount > 0)
);

-- Create RLS policies
alter table public.savings_goals enable row level security;

create policy "Users can view their own savings goals"
    on public.savings_goals for select
    using (auth.uid() = user_id);

create policy "Users can insert their own savings goals"
    on public.savings_goals for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own savings goals"
    on public.savings_goals for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own savings goals"
    on public.savings_goals for delete
    using (auth.uid() = user_id); 