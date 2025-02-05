import { useMemo } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Sun, Coffee, Moon } from "lucide-react";

export function GreetingHeader() {
  const { profile } = useProfile();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning,", icon: Sun };
    if (hour < 17) return { text: "Good afternoon,", icon: Coffee };
    return { text: "Good evening,", icon: Moon };
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-2xl font-semibold tracking-tight">
        {greeting.text} {profile?.name} <greeting.icon className="inline-block h-5 w-5 ml-1" />
      </h2>
      <p className="text-muted-foreground">
        Welcome to your financial dashboard
      </p>
    </div>
  );
} 