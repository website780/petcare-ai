import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from "date-fns";
import { z } from "zod";
import type { PetExpense, Pet } from "@shared/schema";
import {
  Wallet,
  DollarSign,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  PieChart,
  Calendar,
  Stethoscope,
  Utensils,
  Pill,
  Scissors,
  Dumbbell,
  Package,
  Tag,
  Filter,
  Download,
  BarChart3,
  Camera,
  Receipt,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const expenseFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().optional(),
  vendor: z.string().optional(),
  expenseDate: z.string().min(1, "Date is required"),
  petId: z.coerce.number().optional(),
  isRecurring: z.coerce.number().default(0),
  recurringFrequency: z.enum(["weekly", "monthly", "yearly"]).optional(),
});

const categories = [
  { value: "vet_visit", label: "Vet Visit", icon: Stethoscope, color: "bg-blue-100 text-blue-800" },
  { value: "food", label: "Food & Treats", icon: Utensils, color: "bg-green-100 text-green-800" },
  { value: "medication", label: "Medication", icon: Pill, color: "bg-purple-100 text-purple-800" },
  { value: "grooming", label: "Grooming", icon: Scissors, color: "bg-pink-100 text-pink-800" },
  { value: "training", label: "Training", icon: Dumbbell, color: "bg-orange-100 text-orange-800" },
  { value: "supplies", label: "Supplies", icon: Package, color: "bg-yellow-100 text-yellow-800" },
  { value: "insurance", label: "Insurance", icon: Tag, color: "bg-indigo-100 text-indigo-800" },
  { value: "emergency", label: "Emergency", icon: Stethoscope, color: "bg-red-100 text-red-800" },
  { value: "other", label: "Other", icon: Tag, color: "bg-gray-100 text-gray-800" },
];

interface OcrResult {
  amount: number | null;
  vendor: string | null;
  date: string | null;
  category: string;
  currency: string;
  rawText: string | null;
  confidence: number;
}

export default function ExpenseTrackerPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPet, setFilterPet] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const form = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      category: "vet_visit",
      amount: 0,
      expenseDate: new Date().toISOString().split('T')[0],
      isRecurring: 0,
    },
  });

  const { data: expenses = [], isLoading } = useQuery<PetExpense[]>({
    queryKey: [`/api/users/${user?.dbId}/expenses`],
    enabled: !!user?.dbId,
  });

  const { data: pets = [] } = useQuery<Pet[]>({
    queryKey: ['/api/pets'],
    enabled: !!user?.dbId,
  });

  const createExpenseMutation = useMutation({
    mutationFn: async (data: z.infer<typeof expenseFormSchema>) => {
      return apiRequest('POST', `/api/users/${user?.dbId}/expenses`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.dbId}/expenses`] });
      setIsDialogOpen(false);
      form.reset();
      setReceiptPreview(null);
      setOcrResult(null);
      toast({ title: "Expense added successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to add expense", description: error.message, variant: "destructive" });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.dbId}/expenses`] });
      toast({ title: "Expense deleted" });
    },
  });

  const handleReceiptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Please upload an image file", variant: "destructive" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Image size must be under 10MB", variant: "destructive" });
      return;
    }

    setIsScanning(true);
    setOcrResult(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setReceiptPreview(base64);

        try {
          const response = await apiRequest('POST', '/api/expenses/ocr', { imageBase64: base64 });
          const data: OcrResult = await response.json();
          setOcrResult(data);

          if (data.amount !== null) {
            form.setValue('amount', data.amount / 100);
          }
          if (data.vendor) {
            form.setValue('vendor', data.vendor);
          }
          if (data.date) {
            form.setValue('expenseDate', data.date);
          }
          if (data.category && categories.some(c => c.value === data.category)) {
            form.setValue('category', data.category);
          }
          if (data.rawText) {
            form.setValue('description', data.rawText.slice(0, 200));
          }

          if (data.confidence >= 0.7) {
            toast({ title: "Receipt scanned successfully", description: "Review the extracted details below" });
          } else {
            toast({ 
              title: "Receipt partially scanned", 
              description: "Please verify and correct any missing details",
              variant: "default" 
            });
          }
        } catch (error) {
          console.error("OCR error:", error);
          toast({ 
            title: "Failed to scan receipt", 
            description: "Please enter the details manually",
            variant: "destructive" 
          });
        } finally {
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsScanning(false);
      toast({ title: "Failed to process image", variant: "destructive" });
    }
  };

  const clearReceipt = () => {
    setReceiptPreview(null);
    setOcrResult(null);
  };

  const filteredExpenses = expenses.filter((expense) => {
    if (filterCategory !== "all" && expense.category !== filterCategory) return false;
    if (filterPet !== "all" && expense.petId?.toString() !== filterPet) return false;
    
    if (dateRange !== "all") {
      const expenseDate = new Date(expense.expenseDate);
      const now = new Date();
      
      switch (dateRange) {
        case "this_month":
          if (!isWithinInterval(expenseDate, { start: startOfMonth(now), end: endOfMonth(now) })) return false;
          break;
        case "last_month":
          const lastMonth = subMonths(now, 1);
          if (!isWithinInterval(expenseDate, { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) })) return false;
          break;
        case "last_3_months":
          if (!isWithinInterval(expenseDate, { start: startOfMonth(subMonths(now, 3)), end: now })) return false;
          break;
        case "this_year":
          if (expenseDate.getFullYear() !== now.getFullYear()) return false;
          break;
      }
    }
    
    return true;
  });

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const thisMonthExpenses = expenses.filter((e) => {
    const date = new Date(e.expenseDate);
    return isWithinInterval(date, { start: startOfMonth(new Date()), end: endOfMonth(new Date()) });
  }).reduce((sum, e) => sum + e.amount, 0);

  const lastMonthExpenses = expenses.filter((e) => {
    const date = new Date(e.expenseDate);
    const lastMonth = subMonths(new Date(), 1);
    return isWithinInterval(date, { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) });
  }).reduce((sum, e) => sum + e.amount, 0);

  const monthOverMonthChange = lastMonthExpenses > 0 
    ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100)
    : 0;

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(c => c.value === categoryValue) || categories[categories.length - 1];
  };

  const getPetName = (petId: number | null) => {
    if (!petId) return "General";
    const pet = pets.find(p => p.id === petId);
    return pet?.name || "Unknown";
  };

  const exportToCSV = () => {
    const headers = ["Date", "Category", "Description", "Vendor", "Pet", "Amount"];
    const rows = filteredExpenses.map(e => [
      format(new Date(e.expenseDate), 'yyyy-MM-dd'),
      getCategoryInfo(e.category).label,
      e.description || "",
      e.vendor || "",
      getPetName(e.petId),
      e.amount.toString()
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pet-expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Expenses exported to CSV" });
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sign In Required</h1>
          <p className="text-muted-foreground">Please sign in to access expense tracking features.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2" data-testid="text-page-title">
                <Wallet className="h-8 w-8 text-primary" />
                Pet Expense Tracker
              </h1>
              <p className="text-muted-foreground mt-1">
                Log vet bills, food costs, and supplies to understand your pet care budget
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToCSV} data-testid="button-export-csv">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-expense">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                    <DialogDescription>
                      Scan a receipt or manually enter expense details.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {/* Receipt Upload Section */}
                  <div className="mb-4">
                    <Label className="text-sm font-medium mb-2 block">Scan Receipt (Optional)</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center relative">
                      {isScanning ? (
                        <div className="flex flex-col items-center gap-2 py-4">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="text-sm text-muted-foreground">Scanning receipt...</p>
                        </div>
                      ) : receiptPreview ? (
                        <div className="space-y-3">
                          <div className="relative inline-block">
                            <img 
                              src={receiptPreview} 
                              alt="Receipt preview" 
                              className="max-h-32 mx-auto rounded-md"
                            />
                            <button
                              type="button"
                              onClick={clearReceipt}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          {ocrResult && (
                            <div className={`flex items-center justify-center gap-2 text-sm ${ocrResult.confidence >= 0.7 ? 'text-green-600' : 'text-yellow-600'}`}>
                              {ocrResult.confidence >= 0.7 ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span>Data extracted successfully</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-4 w-4" />
                                  <span>Partial data - please verify</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <label className="cursor-pointer block py-4">
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleReceiptUpload}
                            data-testid="input-receipt-upload"
                          />
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex gap-2">
                              <Camera className="h-6 w-6 text-muted-foreground" />
                              <Receipt className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium">Take a photo or upload receipt</p>
                            <p className="text-xs text-muted-foreground">AI will automatically extract details</p>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => createExpenseMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-expense-category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat.value} value={cat.value}>
                                    <div className="flex items-center gap-2">
                                      <cat.icon className="h-4 w-4" />
                                      {cat.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount ($)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} data-testid="input-expense-amount" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="expenseDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} data-testid="input-expense-date" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Annual checkup" {...field} data-testid="input-expense-description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="vendor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vendor (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., PetSmart, Vet Clinic" {...field} data-testid="input-expense-vendor" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {pets.length > 0 && (
                        <FormField
                          control={form.control}
                          name="petId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pet (Optional)</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a pet" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {pets.map((pet) => (
                                    <SelectItem key={pet.id} value={pet.id.toString()}>
                                      {pet.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <Button type="submit" className="w-full" disabled={createExpenseMutation.isPending} data-testid="button-save-expense">
                        {createExpenseMutation.isPending ? "Saving..." : "Save Expense"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{filteredExpenses.length} transactions</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">${thisMonthExpenses.toLocaleString()}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Last Month</p>
                    <p className="text-2xl font-bold">${lastMonthExpenses.toLocaleString()}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card className={`bg-gradient-to-br ${monthOverMonthChange <= 0 ? 'from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900' : 'from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Month vs Month</p>
                    <p className="text-2xl font-bold flex items-center gap-1">
                      {monthOverMonthChange <= 0 ? <TrendingDown className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                      {monthOverMonthChange > 0 ? '+' : ''}{monthOverMonthChange.toFixed(1)}%
                    </p>
                  </div>
                  <BarChart3 className={`h-8 w-8 ${monthOverMonthChange <= 0 ? 'text-emerald-600' : 'text-orange-600'}`} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="expenses" className="space-y-6">
            <TabsList>
              <TabsTrigger value="expenses" data-testid="tab-expenses">All Expenses</TabsTrigger>
              <TabsTrigger value="breakdown" data-testid="tab-breakdown">Category Breakdown</TabsTrigger>
              <TabsTrigger value="trends" data-testid="tab-trends">Spending Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="expenses">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Expense History
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-[150px]" data-testid="filter-category">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {pets.length > 0 && (
                        <Select value={filterPet} onValueChange={setFilterPet}>
                          <SelectTrigger className="w-[120px]" data-testid="filter-pet">
                            <SelectValue placeholder="Pet" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Pets</SelectItem>
                            {pets.map((pet) => (
                              <SelectItem key={pet.id} value={pet.id.toString()}>{pet.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[140px]" data-testid="filter-date">
                          <SelectValue placeholder="Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="this_month">This Month</SelectItem>
                          <SelectItem value="last_month">Last Month</SelectItem>
                          <SelectItem value="last_3_months">Last 3 Months</SelectItem>
                          <SelectItem value="this_year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="text-center py-8">Loading expenses...</div>
                  ) : filteredExpenses.length === 0 ? (
                    <div className="py-12 text-center">
                      <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Expenses Found</h3>
                      <p className="text-muted-foreground mb-4">
                        {expenses.length === 0 
                          ? "Start tracking your pet care expenses to understand your budget."
                          : "No expenses match your current filters."}
                      </p>
                      {expenses.length === 0 && (
                        <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-first-expense">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Expense
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Pet</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredExpenses.map((expense) => {
                          const catInfo = getCategoryInfo(expense.category);
                          const CatIcon = catInfo.icon;
                          return (
                            <TableRow key={expense.id}>
                              <TableCell>{format(new Date(expense.expenseDate), 'MMM d, yyyy')}</TableCell>
                              <TableCell>
                                <Badge className={`${catInfo.color} flex items-center gap-1 w-fit`}>
                                  <CatIcon className="h-3 w-3" />
                                  {catInfo.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">{expense.description || '-'}</TableCell>
                              <TableCell>{expense.vendor || '-'}</TableCell>
                              <TableCell>{getPetName(expense.petId)}</TableCell>
                              <TableCell className="text-right font-medium">${expense.amount.toLocaleString()}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteExpenseMutation.mutate(expense.id)}
                                  data-testid={`button-delete-expense-${expense.id}`}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="breakdown">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Spending by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(categoryTotals)
                        .sort((a, b) => b[1] - a[1])
                        .map(([category, amount]) => {
                          const catInfo = getCategoryInfo(category);
                          const CatIcon = catInfo.icon;
                          const percentage = totalExpenses > 0 ? (amount / totalExpenses * 100) : 0;
                          return (
                            <div key={category} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge className={`${catInfo.color} flex items-center gap-1`}>
                                    <CatIcon className="h-3 w-3" />
                                    {catInfo.label}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <span className="font-semibold">${amount.toLocaleString()}</span>
                                  <span className="text-sm text-muted-foreground ml-2">({percentage.toFixed(1)}%)</span>
                                </div>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary transition-all" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      {Object.keys(categoryTotals).length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          No expenses to show. Add your first expense to see the breakdown.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Category Summary</CardTitle>
                    <CardDescription>Total spending per category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {categories.map((cat) => {
                        const amount = categoryTotals[cat.value] || 0;
                        const CatIcon = cat.icon;
                        return (
                          <Card key={cat.value} className={amount > 0 ? 'bg-primary/5' : 'bg-muted/30'}>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <CatIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{cat.label}</span>
                              </div>
                              <p className="text-xl font-bold">${amount.toLocaleString()}</p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Monthly Spending Trends
                  </CardTitle>
                  <CardDescription>
                    Track how your pet care spending changes over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlyTrendsChart expenses={expenses} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

function MonthlyTrendsChart({ expenses }: { expenses: PetExpense[] }) {
  const monthlyData: Record<string, number> = {};
  
  expenses.forEach((expense) => {
    const date = new Date(expense.expenseDate);
    const monthKey = format(date, 'MMM yyyy');
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + expense.amount;
  });

  const sortedMonths = Object.entries(monthlyData)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-12);

  const maxAmount = Math.max(...sortedMonths.map(([, amount]) => amount), 1);

  if (sortedMonths.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Add expenses to see your spending trends over time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2 h-64">
        {sortedMonths.map(([month, amount]) => {
          const height = (amount / maxAmount) * 100;
          return (
            <div key={month} className="flex-1 flex flex-col items-center justify-end gap-2">
              <div className="text-xs font-medium">${amount.toLocaleString()}</div>
              <div 
                className="w-full bg-primary rounded-t transition-all hover:bg-primary/80" 
                style={{ height: `${height}%`, minHeight: '4px' }}
              />
              <div className="text-xs text-muted-foreground -rotate-45 origin-top-left whitespace-nowrap">
                {month}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="grid md:grid-cols-3 gap-4 pt-8 border-t">
        <Card className="bg-primary/5">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Average Monthly</p>
            <p className="text-2xl font-bold">
              ${(sortedMonths.reduce((sum, [, amount]) => sum + amount, 0) / sortedMonths.length).toFixed(0)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Highest Month</p>
            <p className="text-2xl font-bold">${Math.max(...sortedMonths.map(([, a]) => a)).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Lowest Month</p>
            <p className="text-2xl font-bold">${Math.min(...sortedMonths.map(([, a]) => a)).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
