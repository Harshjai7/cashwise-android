
import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BudgetProgressProps {
  category: string;
  spent: number;
  budget: number;
  percentage: number;
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({
  category,
  spent,
  budget,
  percentage,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{category}</span>
        <span className="text-sm text-muted-foreground">
          ${spent.toFixed(2)} / ${budget.toFixed(2)}
        </span>
      </div>
      
      <Progress 
        value={percentage} 
        className={cn(
          "h-2",
          percentage > 90 ? "bg-muted text-expense" : "bg-muted text-primary"
        )} 
      />
      
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>{percentage.toFixed(0)}% used</span>
        {percentage >= 100 ? (
          <span className="text-expense font-medium">Over budget</span>
        ) : percentage > 90 ? (
          <span className="text-amber-500 font-medium">Almost reached</span>
        ) : (
          <span>${(budget - spent).toFixed(2)} remaining</span>
        )}
      </div>
    </div>
  );
};

export default BudgetProgress;
