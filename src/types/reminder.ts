export interface Reminder {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  due_date: string;
  is_recurring: boolean;
  parent_reminder_id?: string;
  status: 'active' | 'archived';
  created_at?: string;
}

export interface ReminderFormValues {
  name: string;
  amount: number;
  due_date: string;
  is_recurring: boolean;
}