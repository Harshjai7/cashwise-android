
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CircleDollarSign } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [animationState, setAnimationState] = useState<"initial" | "logoIn" | "textIn" | "complete">("initial");

  useEffect(() => {
    // Sequence of animations
    const timeouts = [
      setTimeout(() => setAnimationState("logoIn"), 300),
      setTimeout(() => setAnimationState("textIn"), 1000),
      setTimeout(() => setAnimationState("complete"), 2200),
      setTimeout(() => onComplete(), 2700),
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500">
      <div className="relative flex flex-col items-center gap-6">
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full p-4 transition-all duration-700",
            animationState === "initial" ? "opacity-0 scale-50" : "opacity-100 scale-100"
          )}
        >
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse-gentle" />
          <CircleDollarSign 
            size={72} 
            className="text-primary animate-spin-slow"
            strokeWidth={1.5}
          />
        </div>
        
        <h1 
          className={cn(
            "text-3xl font-semibold tracking-tight transition-all duration-700",
            animationState === "initial" || animationState === "logoIn" ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          )}
        >
          CashWise
        </h1>
        
        <p 
          className={cn(
            "text-sm text-muted-foreground transition-all duration-700",
            animationState === "initial" || animationState === "logoIn" ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          )}
        >
          Simplify your finances
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
