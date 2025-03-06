
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, PieChartIcon, BarChartIcon, LineChartIcon } from "lucide-react";
import { useTransactions } from "@/context/TransactionContext";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

type ChartType = "pie" | "bar" | "line";

const AnalyticsPage = () => {
  const { summary, isLoading } = useTransactions();
  const navigate = useNavigate();
  const [chartType, setChartType] = useState<ChartType>("pie");

  // Colors for chart segments
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Format data for charts
  const categoryData = Object.entries(summary.categoryTotals).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length]
  })).sort((a, b) => b.value - a.value); // Sort by value descending

  // Generate date-based data for line chart (simulated for last 7 days)
  const getLineChartData = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Create a somewhat random but deterministic value based on the day
      const value = (summary.totalExpense / 14) * (1 + Math.sin(i / 2));
      
      return {
        day: dayName,
        expense: Math.round(value)
      };
    });
  };

  const lineChartData = getLineChartData();

  // Render appropriate chart based on selection
  const renderChart = () => {
    switch(chartType) {
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="Daily Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

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
          <h1 className="text-2xl font-bold tracking-tight">Spending Analytics</h1>
        </div>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg">Spending Breakdown</CardTitle>
            <CardDescription>Visualize your spending patterns</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-center mb-4 gap-2">
              <Button 
                variant={chartType === "pie" ? "default" : "outline"}
                onClick={() => setChartType("pie")}
                className="gap-1"
              >
                <PieChartIcon size={18} />
                Pie
              </Button>
              <Button 
                variant={chartType === "bar" ? "default" : "outline"}
                onClick={() => setChartType("bar")}
                className="gap-1"
              >
                <BarChartIcon size={18} />
                Bar
              </Button>
              <Button 
                variant={chartType === "line" ? "default" : "outline"}
                onClick={() => setChartType("line")}
                className="gap-1"
              >
                <LineChartIcon size={18} />
                Line
              </Button>
            </div>
            
            {categoryData.length > 0 ? (
              <div>
                {renderChart()}
                
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  {chartType === "pie" && "Category distribution by percentage"}
                  {chartType === "bar" && "Category spending by amount (₹)"}
                  {chartType === "line" && "Daily spending trend"}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No expense data available</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add expenses to see analytics
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
