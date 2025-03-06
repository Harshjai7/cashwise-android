
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Transaction, TransactionType } from "@/utils/transactionUtils";
import { useTransactions } from "@/context/TransactionContext";
import { ArrowLeftIcon, SaveIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit?: () => void;
}

const categories = {
  expense: [
    "Food",
    "Groceries",
    "Transport",
    "Housing",
    "Entertainment",
    "Health",
    "Technology",
    "Other"
  ],
  income: [
    "Salary",
    "Gifts",
    "Investments",
    "Other"
  ]
};

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, onSubmit }) => {
  const navigate = useNavigate();
  const { addNewTransaction, updateExistingTransaction } = useTransactions();

  const [formData, setFormData] = useState<{
    amount: string;
    description: string;
    type: TransactionType;
    category: string;
    date: string;
  }>({
    amount: transaction?.amount.toString() || "",
    description: transaction?.description || "",
    type: transaction?.type || "expense",
    category: transaction?.category || "",
    date: transaction?.date || format(new Date(), "yyyy-MM-dd"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData = {
      amount: parseFloat(formData.amount),
      description: formData.description,
      type: formData.type,
      category: formData.category,
      date: formData.date,
    };

    if (transaction) {
      // Update existing transaction
      updateExistingTransaction({
        ...transactionData,
        id: transaction.id,
      });
    } else {
      // Add new transaction
      addNewTransaction(transactionData);
    }

    if (onSubmit) {
      onSubmit();
    } else {
      navigate(-1);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // If type changes, reset category 
    if (field === "type") {
      setFormData((prev) => ({ 
        ...prev, 
        category: "",
        [field]: value as TransactionType 
      }));
    }
  };

  const isFormValid = () => {
    return (
      parseFloat(formData.amount) > 0 &&
      formData.description.trim() !== "" &&
      formData.category !== ""
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-16">
      <div className="flex items-center justify-between mb-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon size={18} />
        </Button>
        <h1 className="text-xl font-semibold">
          {transaction ? "Edit Transaction" : "Add Transaction"}
        </h1>
        <div className="w-9"></div> {/* Spacer for alignment */}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant={formData.type === "expense" ? "default" : "outline"}
          className="w-full"
          onClick={() => handleChange("type", "expense")}
        >
          Expense
        </Button>
        <Button
          type="button"
          variant={formData.type === "income" ? "default" : "outline"}
          className="w-full"
          onClick={() => handleChange("type", "income")}
        >
          Income
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="amount" className="text-sm font-medium block mb-1">
            Amount ($)
          </label>
          <Input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            className="text-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium block mb-1">
            Description
          </label>
          <Input
            id="description"
            placeholder="What was this for?"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="text-sm font-medium block mb-1">
            Category
          </label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories[formData.type].map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="date" className="text-sm font-medium block mb-1">
            Date
          </label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full gap-2"
        disabled={!isFormValid()}
      >
        <SaveIcon size={16} />
        {transaction ? "Update" : "Save"} Transaction
      </Button>
    </form>
  );
};

export default TransactionForm;
