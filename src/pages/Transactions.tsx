
import React, { useState } from "react";
import { useTransactions } from "@/context/TransactionContext";
import TransactionItem from "@/components/TransactionItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, FilterIcon } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TransactionForm from "@/components/TransactionForm";
import { Transaction } from "@/utils/transactionUtils";

const Transactions = () => {
  const { transactions, isLoading } = useTransactions();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);

  // Filter transactions based on search query and type filter
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = 
      typeFilter === "all" || 
      transaction.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Handle edit transaction
  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction);
  };

  // Close edit dialog
  const closeEditDialog = () => {
    setEditTransaction(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container-padding min-h-screen animate-fade-in">
      <div className="py-8 space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">View and manage your transactions</p>
        </header>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-secondary" : ""}
          >
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <div className="bg-muted/40 p-3 rounded-lg space-y-3 animate-scale-in">
            <div>
              <label className="text-sm font-medium block mb-1">
                Transaction Type
              </label>
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {sortedTransactions.length > 0 ? (
          <div className="space-y-3 pb-16">
            {sortedTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">No transactions found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery || typeFilter !== "all"
                ? "Try adjusting your search filters"
                : "Add your first transaction"}
            </p>
          </div>
        )}
      </div>

      {/* Edit Transaction Dialog */}
      {editTransaction && (
        <Dialog open={!!editTransaction} onOpenChange={(open) => !open && closeEditDialog()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm
              transaction={editTransaction}
              onSubmit={closeEditDialog}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Transactions;
