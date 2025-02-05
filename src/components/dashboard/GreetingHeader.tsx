import { useMemo } from "react";

export function GreetingHeader() {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 17) return "Good afternoon,";
    return "Good evening,";
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-2xl font-semibold tracking-tight">{greeting}</h2>
      <p className="text-muted-foreground">
        Welcome to your financial dashboard
      </p>
    </div>
  );
} 