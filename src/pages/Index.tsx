
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/context/TransactionContext";
import Summary from "@/components/Summary";
import TransactionItem from "@/components/TransactionItem";
import BudgetProgress from "@/components/BudgetProgress";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { summary, budgetUtilization, isLoading } = useTransactions();
  const isMobile = useIsMobile();
  
  // Get top 3 budgets sorted by percentage used
  const topBudgets = Object.entries(budgetUtilization)
    .sort(([, a], [, b]) => b.percentage - a.percentage)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container-padding min-h-screen animate-fade-in">
      <div className="py-8 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">CashWise</h1>
          <p className="text-muted-foreground">Track and manage your finances</p>
        </header>

        <Summary />

        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <Link to="/transactions">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View All
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
            <CardDescription>Your latest 5 transactions</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {summary.recentTransactions.length > 0 ? (
              <div className="space-y-2">
                {summary.recentTransactions.map((transaction) => (
                  <TransactionItem 
                    key={transaction.id} 
                    transaction={transaction}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No transactions yet</p>
                <Link to="/add">
                  <Button size="sm" className="gap-1">
                    <PlusIcon size={16} />
                    Add Transaction
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {topBudgets.length > 0 && (
          <Card>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Budget Status</CardTitle>
                <Link to="/budget">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    Manage
                    <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
              <CardDescription>Your top budget categories</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="space-y-4">
                {topBudgets.map(([category, data]) => (
                  <BudgetProgress
                    key={category}
                    category={category}
                    spent={data.spent}
                    budget={data.budget}
                    percentage={data.percentage}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
