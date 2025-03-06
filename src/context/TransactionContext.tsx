
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Transaction, 
  Budget, 
  getTransactions, 
  getBudgets, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction,
  addBudget,
  updateBudget,
  deleteBudget,
  getTransactionSummary,
  getBudgetUtilization,
  TransactionSummary
} from "../utils/transactionUtils";
import { useToast } from "@/components/ui/use-toast";

interface TransactionContextType {
  transactions: Transaction[];
  budgets: Budget[];
  summary: TransactionSummary;
  budgetUtilization: Record<string, { budget: number; spent: number; remaining: number; percentage: number }>;
  addNewTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateExistingTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  addNewBudget: (budget: Omit<Budget, "id">) => void;
  updateExistingBudget: (budget: Budget) => void;
  removeBudget: (id: string) => void;
  refreshData: () => void;
  isLoading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [summary, setSummary] = useState<TransactionSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    recentTransactions: [],
    categoryTotals: {},
  });
  const [budgetUtilization, setBudgetUtilization] = useState<Record<string, { budget: number; spent: number; remaining: number; percentage: number }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load data on initial render
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    try {
      setIsLoading(true);
      const loadedTransactions = getTransactions();
      const loadedBudgets = getBudgets();
      const calculatedSummary = getTransactionSummary();
      const calculatedUtilization = getBudgetUtilization();

      setTransactions(loadedTransactions);
      setBudgets(loadedBudgets);
      setSummary(calculatedSummary);
      setBudgetUtilization(calculatedUtilization);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load your financial data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNewTransaction = (transaction: Omit<Transaction, "id">) => {
    try {
      const newTransaction = addTransaction(transaction);
      refreshData();
      toast({
        title: "Transaction added",
        description: `${transaction.type === "income" ? "Income" : "Expense"} of $${transaction.amount.toFixed(2)} recorded`,
      });
      return newTransaction;
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  const updateExistingTransaction = (transaction: Transaction) => {
    try {
      updateTransaction(transaction);
      refreshData();
      toast({
        title: "Transaction updated",
        description: "Your transaction has been updated",
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  const removeTransaction = (id: string) => {
    try {
      deleteTransaction(id);
      refreshData();
      toast({
        title: "Transaction deleted",
        description: "Your transaction has been removed",
      });
    } catch (error) {
      console.error("Error removing transaction:", error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const addNewBudget = (budget: Omit<Budget, "id">) => {
    try {
      const newBudget = addBudget(budget);
      refreshData();
      toast({
        title: "Budget created",
        description: `Budget of $${budget.amount.toFixed(2)} set for ${budget.category}`,
      });
      return newBudget;
    } catch (error) {
      console.error("Error adding budget:", error);
      toast({
        title: "Error",
        description: "Failed to create budget",
        variant: "destructive",
      });
    }
  };

  const updateExistingBudget = (budget: Budget) => {
    try {
      updateBudget(budget);
      refreshData();
      toast({
        title: "Budget updated",
        description: "Your budget has been updated",
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive",
      });
    }
  };

  const removeBudget = (id: string) => {
    try {
      deleteBudget(id);
      refreshData();
      toast({
        title: "Budget deleted",
        description: "Your budget has been removed",
      });
    } catch (error) {
      console.error("Error removing budget:", error);
      toast({
        title: "Error",
        description: "Failed to delete budget",
        variant: "destructive",
      });
    }
  };

  const value = {
    transactions,
    budgets,
    summary,
    budgetUtilization,
    addNewTransaction,
    updateExistingTransaction,
    removeTransaction,
    addNewBudget,
    updateExistingBudget,
    removeBudget,
    refreshData,
    isLoading,
  };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
};
