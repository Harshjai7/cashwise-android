
import React from "react";
import { Transaction } from "@/utils/transactionUtils";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Coffee, 
  ShoppingCart, 
  Home, 
  Car, 
  Utensils, 
  Briefcase, 
  Gift, 
  Heart, 
  Smartphone,
  MoreVertical 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useTransactions } from "@/context/TransactionContext";

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  "Food": <Utensils size={16} />,
  "Groceries": <ShoppingCart size={16} />,
  "Transport": <Car size={16} />,
  "Housing": <Home size={16} />,
  "Entertainment": <Coffee size={16} />,
  "Salary": <Briefcase size={16} />,
  "Gifts": <Gift size={16} />,
  "Health": <Heart size={16} />,
  "Technology": <Smartphone size={16} />,
  // Default fallback
  "Other": <ShoppingCart size={16} />,
};

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onEdit }) => {
  const { removeTransaction } = useTransactions();
  const [showDialog, setShowDialog] = React.useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || categoryIcons["Other"];
  };

  return (
    <>
      <div 
        className={cn(
          "flex items-center justify-between p-3 rounded-xl transition-all bg-card group hover:shadow-sm",
          transaction.type === "income" ? "hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20" : "hover:bg-rose-50/50 dark:hover:bg-rose-900/20"
        )}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className={cn(
            "flex items-center justify-center p-2 rounded-full",
            transaction.type === "income" ? "bg-income/10 text-income" : "bg-expense/10 text-expense"
          )}>
            {transaction.type === "income" 
              ? <ArrowUpCircle size={20} /> 
              : <ArrowDownCircle size={20} />
            }
          </div>
          
          <div className="flex flex-col">
            <span className="font-medium truncate max-w-[140px] sm:max-w-[180px]">
              {transaction.description}
            </span>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <span className="flex items-center gap-1">
                {getCategoryIcon(transaction.category)}
                {transaction.category}
              </span>
              <span>•</span>
              <span>{formatDate(transaction.date)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-semibold",
            transaction.type === "income" ? "text-income" : "text-expense"
          )}>
            {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toFixed(2)}
          </span>
          
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Transaction Options</DialogTitle>
                <DialogDescription>
                  {transaction.description} - ₹{transaction.amount.toFixed(2)}
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2 justify-end">
                {onEdit && (
                  <Button variant="outline" onClick={() => {
                    onEdit(transaction);
                    setShowDialog(false);
                  }}>
                    Edit
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    removeTransaction(transaction.id);
                    setShowDialog(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default TransactionItem;
