
import { STORAGE_KEYS, getStorageData, setStorageData } from "./storageUtils";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: "monthly" | "weekly" | "yearly";
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  recentTransactions: Transaction[];
  categoryTotals: Record<string, number>;
}

/**
 * Get all transactions
 */
export function getTransactions(): Transaction[] {
  return getStorageData<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
}

/**
 * Add a new transaction
 */
export function addTransaction(transaction: Omit<Transaction, "id">): Transaction {
  const transactions = getTransactions();
  const newTransaction = {
    ...transaction,
    id: crypto.randomUUID(),
  };
  
  setStorageData(STORAGE_KEYS.TRANSACTIONS, [newTransaction, ...transactions]);
  return newTransaction;
}

/**
 * Update an existing transaction
 */
export function updateTransaction(transaction: Transaction): void {
  const transactions = getTransactions();
  const updatedTransactions = transactions.map((t) => 
    t.id === transaction.id ? transaction : t
  );
  
  setStorageData(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);
}

/**
 * Delete a transaction
 */
export function deleteTransaction(id: string): void {
  const transactions = getTransactions();
  const filteredTransactions = transactions.filter((t) => t.id !== id);
  
  setStorageData(STORAGE_KEYS.TRANSACTIONS, filteredTransactions);
}

/**
 * Get transaction summary data
 */
export function getTransactionSummary(limit = 5): TransactionSummary {
  const transactions = getTransactions();
  
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryTotals: Record<string, number> = {};
  
  // Calculate totals
  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
      
      // Track expenses by category
      if (categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] += transaction.amount;
      } else {
        categoryTotals[transaction.category] = transaction.amount;
      }
    }
  });
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    recentTransactions: sortedTransactions.slice(0, limit),
    categoryTotals,
  };
}

/**
 * Get all budgets
 */
export function getBudgets(): Budget[] {
  return getStorageData<Budget[]>(STORAGE_KEYS.BUDGETS, []);
}

/**
 * Add a new budget
 */
export function addBudget(budget: Omit<Budget, "id">): Budget {
  const budgets = getBudgets();
  const newBudget = {
    ...budget,
    id: crypto.randomUUID(),
  };
  
  setStorageData(STORAGE_KEYS.BUDGETS, [...budgets, newBudget]);
  return newBudget;
}

/**
 * Update an existing budget
 */
export function updateBudget(budget: Budget): void {
  const budgets = getBudgets();
  const updatedBudgets = budgets.map((b) => 
    b.id === budget.id ? budget : b
  );
  
  setStorageData(STORAGE_KEYS.BUDGETS, updatedBudgets);
}

/**
 * Delete a budget
 */
export function deleteBudget(id: string): void {
  const budgets = getBudgets();
  const filteredBudgets = budgets.filter((b) => b.id !== id);
  
  setStorageData(STORAGE_KEYS.BUDGETS, filteredBudgets);
}

/**
 * Get budget utilization
 */
export function getBudgetUtilization(): Record<string, { budget: number; spent: number; remaining: number; percentage: number }> {
  const budgets = getBudgets();
  const { categoryTotals } = getTransactionSummary();
  
  const result: Record<string, { budget: number; spent: number; remaining: number; percentage: number }> = {};
  
  budgets.forEach((budget) => {
    const spent = categoryTotals[budget.category] || 0;
    const remaining = budget.amount - spent;
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    
    result[budget.category] = {
      budget: budget.amount,
      spent,
      remaining,
      percentage: Math.min(percentage, 100), // Cap at 100%
    };
  });
  
  return result;
}

/**
 * Export transactions to JSON string
 */
export function exportTransactions(): string {
  const transactions = getTransactions();
  return JSON.stringify(transactions);
}

/**
 * Import transactions from JSON string
 */
export function importTransactions(jsonData: string): boolean {
  try {
    const transactions = JSON.parse(jsonData) as Transaction[];
    setStorageData(STORAGE_KEYS.TRANSACTIONS, transactions);
    return true;
  } catch (error) {
    console.error("Error importing transactions:", error);
    return false;
  }
}
