import { StatementFormat } from "./utils/parserRegistry";
import { cn } from "@/lib/utils";

interface BankLogoProps {
  bank: StatementFormat;
  className?: string;
}

const bankLogos: Record<StatementFormat, string> = {
  revolut: "/revolut-logo.png",
  wise: "/wise-logo.png",
};

export function BankLogo({ bank, className }: BankLogoProps) {
  return (
    <div 
      className={cn(
        "relative w-6 h-6 flex items-center justify-center",
        className
      )}
    >
      <img
        src={bankLogos[bank]}
        alt={`${bank.toUpperCase()} logo`}
        className="w-full h-full object-contain"
        onError={(e) => {
          // Hide the image on error
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
} 