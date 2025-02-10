
import { createContext, useContext, useState, ReactNode } from "react";

interface MonthContextType {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

const MonthContext = createContext<MonthContextType | undefined>(undefined);

export function MonthProvider({ children }: { children: ReactNode }) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const onMonthChange = (date: Date) => {
    setSelectedMonth(date);
  };

  return (
    <MonthContext.Provider value={{ selectedMonth, onMonthChange }}>
      {children}
    </MonthContext.Provider>
  );
}

export function useMonth() {
  const context = useContext(MonthContext);
  if (context === undefined) {
    throw new Error("useMonth must be used within a MonthProvider");
  }
  return context;
}
