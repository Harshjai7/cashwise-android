import React, { useState } from "react";
import { useTransactions } from "@/context/TransactionContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PlusIcon, Trash2Icon, ArrowLeftIcon } from "lucide-react";
import BudgetProgress from "@/components/BudgetProgress";
import { Budget } from "@/utils/transactionUtils";
import { useNavigate } from "react-router-dom";

const BudgetPage = () => {
  const { budgets, budgetUtilization, addNewBudget, removeBudget, isLoading } = useTransactions();
  const navigate = useNavigate();
  
  const [formData, setFormData<{
    category: string;
    amount: string;
    period: "monthly" | "weekly" | "yearly";
  }>({
    category: "",
    amount: "",
    period: "monthly"
  });

  const categories = [
    "Food",
    "Groceries",
    "Transport",
    "Housing",
    "Entertainment",
    "Health", 
    "Technology",
    "Other"
  ];

  // Check if category already has a budget
  const isCategoryUsed = (category: string) => {
    return budgets.some(budget => budget.category === category);
  };

  // Available categories (not already used)
  const availableCategories = categories.filter(
    category => !isCategoryUsed(category)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.category && parseFloat(formData.amount) > 0) {
      addNewBudget({
        category: formData.category,
        amount: parseFloat(formData.amount),
        period: formData.period
      });
      
      // Reset form
      setFormData({
        category: "",
        amount: "",
        period: "monthly"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Update the form rendering part with INR currency symbol
  return (
    <div className="container-padding min-h-screen animate-fade-in pb-16">
      <div className="py-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon size={18} />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Budget Manager</h1>
        </div>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg">Add New Budget</CardTitle>
            <CardDescription>Set spending limits for categories</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="category" className="text-sm font-medium block">
                    Category
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    disabled={availableCategories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="amount" className="text-sm font-medium block">
                    Amount (₹)
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="period" className="text-sm font-medium block">
                  Period
                </label>
                <Select
                  value={formData.period}
                  onValueChange={(value: "monthly" | "weekly" | "yearly") => 
                    setFormData(prev => ({ ...prev, period: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                type="submit"
                className="w-full gap-1"
                disabled={!formData.category || parseFloat(formData.amount) <= 0}
              >
                <PlusIcon size={16} />
                Add Budget
              </Button>
            </form>
          </CardContent>
        </Card>

        {budgets.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Budgets</h2>
            {budgets.map((budget) => {
              const utilization = budgetUtilization[budget.category] || {
                spent: 0,
                budget: budget.amount,
                percentage: 0
              };
              
              return (
                <Card key={budget.id} className="relative">
                  <CardContent className="p-4">
                    <div className="mb-4">
                      <BudgetProgress
                        category={budget.category}
                        spent={utilization.spent}
                        budget={budget.amount}
                        percentage={utilization.percentage}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        Budget period: <span className="font-medium">{budget.period}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeBudget(budget.id)}
                      >
                        <Trash2Icon size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No budgets set yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first budget to start tracking spending
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetPage;
