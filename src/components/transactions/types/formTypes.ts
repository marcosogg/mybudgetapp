
export interface TransactionFormValues {
  date: string;
  description: string;
  amount: number;
  category_id: string | null;
  tags: string[];
}

export interface TransactionFormProps {
  initialData?: TransactionFormValues;
  onSubmit: (values: TransactionFormValues) => void;
  onCancel: () => void;
}
