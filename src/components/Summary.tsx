
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTransactions } from "@/context/TransactionContext";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const Summary: React.FC = () => {
  const { summary } = useTransactions();
  const { totalIncome, totalExpense, balance } = summary;

  const summaryItems = [
    {
      title: "Income",
      value: totalIncome,
      icon: <ArrowUpCircle className="text-income" />,
      className: "bg-income/5 border-income/10",
    },
    {
      title: "Expenses",
      value: totalExpense,
      icon: <ArrowDownCircle className="text-expense" />,
      className: "bg-expense/5 border-expense/10",
    },
    {
      title: "Balance",
      value: balance,
      icon: <Wallet className={balance >= 0 ? "text-income" : "text-expense"} />,
      className: balance >= 0 
        ? "bg-income/5 border-income/10" 
        : "bg-expense/5 border-expense/10",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {summaryItems.map((item, index) => (
        <Card key={index} className={cn("border overflow-hidden", item.className)}>
          <CardContent className="p-3">
            <div className="flex flex-col items-center justify-center text-center gap-1">
              <div className="mb-1">
                {item.icon}
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                {item.title}
              </p>
              <p className={cn(
                "text-sm font-bold",
                item.title === "Income" && "text-income",
                item.title === "Expenses" && "text-expense",
                item.title === "Balance" && (item.value >= 0 ? "text-income" : "text-expense")
              )}>
                ${Math.abs(item.value).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Summary;
