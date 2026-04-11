import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { DollarSign, Users, ShoppingCart, CreditCard, LineChart, PieChart, BarChart, Lock, Unlock } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Default color scheme
const colors = {
  monthly: 'rgba(54, 162, 235, 0.6)',
  yearly: 'rgba(75, 192, 192, 0.6)',
  injury: 'rgba(255, 99, 132, 0.6)',
  training: 'rgba(255, 159, 64, 0.6)',
  marketing: 'rgba(255, 99, 132, 0.4)',
  openai: 'rgba(54, 162, 235, 0.4)',
  firebase: 'rgba(75, 192, 192, 0.4)',
  ads: 'rgba(255, 159, 64, 0.4)',
  development: 'rgba(153, 102, 255, 0.4)',
  other: 'rgba(201, 203, 207, 0.4)',
};

export default function RevenueProjectionPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { toast } = useToast();
  
  // User input parameters
  const [monthlyDownloads, setMonthlyDownloads] = useState(1000);
  const [trialConversionRate, setTrialConversionRate] = useState(40); // percentage
  const [monthlySubscriptionRate, setMonthlySubscriptionRate] = useState(60); // percentage
  const [yearlySubscriptionRate, setYearlySubscriptionRate] = useState(40); // percentage
  const [churnRateMonthly, setChurnRateMonthly] = useState(5); // percentage per month
  const [churnRateYearly, setChurnRateYearly] = useState(15); // percentage per year
  const [injuryScanUsage, setInjuryScanUsage] = useState(20); // percentage of users
  const [trainingUsage, setTrainingUsage] = useState(15); // percentage of users
  
  // Operating Costs
  const [marketingCostPerUser, setMarketingCostPerUser] = useState(2.50); // $ per acquired user
  const [openAICostPerUser, setOpenAICostPerUser] = useState(0.15); // $ per active user per month
  const [firebaseCostPerUser, setFirebaseCostPerUser] = useState(0.05); // $ per active user per month
  const [adsCostPercentage, setAdsCostPercentage] = useState(10); // percentage of revenue
  const [developmentCostMonthly, setDevelopmentCostMonthly] = useState(10000); // $ per month
  const [otherCostsMonthly, setOtherCostsMonthly] = useState(2000); // $ per month
  
  // Price points
  const monthlySubscriptionPrice = 8.99;
  const yearlySubscriptionPrice = 79.99;
  const injuryScanPrice = 1.99; // per 5 scans
  const trainingPrice = 39.99; // per year

  // Projection data
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [selectedChart, setSelectedChart] = useState('revenue');
  const numberOfMonths = 36; // 3 years projection
  
  // Handle password verification
  const handlePasswordSubmit = () => {
    const correctPassword = "PetC@re9!";
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setShowPasswordDialog(false);
      toast({
        title: "Access Granted",
        description: "Welcome to the Revenue Projection dashboard.",
      });
    } else {
      setPasswordError("Incorrect password. Please try again.");
      setPassword('');
    }
  };

  // Calculate projections
  useEffect(() => {
    calculateProjections();
  }, [
    monthlyDownloads, trialConversionRate, monthlySubscriptionRate, yearlySubscriptionRate,
    churnRateMonthly, churnRateYearly, injuryScanUsage, trainingUsage,
    marketingCostPerUser, openAICostPerUser, firebaseCostPerUser, adsCostPercentage,
    developmentCostMonthly, otherCostsMonthly
  ]);

  const calculateProjections = () => {
    const monthlyData = [];
    const yearlyData = [];
    
    // Initial values
    let monthlySubscribers = 0;
    let yearlySubscribers = 0;
    let totalRevenue = 0;
    let cumulativeRevenue = 0;
    let totalCosts = 0;
    let cumulativeCosts = 0;
    
    for (let month = 1; month <= numberOfMonths; month++) {
      // New users who converted from trial
      const newConvertsFromTrial = monthlyDownloads * (trialConversionRate / 100);
      
      // Distribution between monthly and yearly subscriptions
      const newMonthlySubscribers = newConvertsFromTrial * (monthlySubscriptionRate / 100);
      const newYearlySubscribers = newConvertsFromTrial * (yearlySubscriptionRate / 100);
      
      // Apply churn
      const monthlyChurn = monthlySubscribers * (churnRateMonthly / 100);
      // Yearly churn is applied only every 12 months for existing subscribers
      const yearlyChurn = month % 12 === 0 ? yearlySubscribers * (churnRateYearly / 100) : 0;
      
      // Update subscriber counts
      monthlySubscribers = monthlySubscribers + newMonthlySubscribers - monthlyChurn;
      yearlySubscribers = yearlySubscribers + newYearlySubscribers - yearlyChurn;
      
      // Total active users
      const totalActiveUsers = monthlySubscribers + yearlySubscribers;
      
      // Calculate revenue
      const monthlySubscriptionRevenue = monthlySubscribers * monthlySubscriptionPrice;
      const yearlySubscriptionRevenue = (month % 12 === 1) 
        ? newYearlySubscribers * yearlySubscriptionPrice // New yearly subscriptions
        : 0; // Existing yearly subscriptions already paid
      
      // In-app purchases (future features)
      const injuryScanRevenue = totalActiveUsers * (injuryScanUsage / 100) * injuryScanPrice;
      const trainingRevenue = (month % 12 === 1) 
        ? totalActiveUsers * (trainingUsage / 100) * trainingPrice 
        : 0;
      
      // Total revenue for the month
      const monthRevenue = monthlySubscriptionRevenue + yearlySubscriptionRevenue + injuryScanRevenue + trainingRevenue;
      totalRevenue += monthRevenue;
      cumulativeRevenue += monthRevenue;
      
      // Calculate costs
      const marketingCost = monthlyDownloads * marketingCostPerUser;
      const openAICost = totalActiveUsers * openAICostPerUser;
      const firebaseCost = totalActiveUsers * firebaseCostPerUser;
      const adsCost = monthRevenue * (adsCostPercentage / 100);
      
      const totalMonthCosts = marketingCost + openAICost + firebaseCost + adsCost + developmentCostMonthly + otherCostsMonthly;
      totalCosts += totalMonthCosts;
      cumulativeCosts += totalMonthCosts;
      
      // Calculate profit
      const monthProfit = monthRevenue - totalMonthCosts;
      const cumulativeProfit = cumulativeRevenue - cumulativeCosts;
      
      // Add to monthly data
      monthlyData.push({
        month,
        monthlySubscribers: Math.round(monthlySubscribers),
        yearlySubscribers: Math.round(yearlySubscribers),
        totalActiveUsers: Math.round(totalActiveUsers),
        monthlySubscriptionRevenue: parseFloat(monthlySubscriptionRevenue.toFixed(2)),
        yearlySubscriptionRevenue: parseFloat(yearlySubscriptionRevenue.toFixed(2)),
        injuryScanRevenue: parseFloat(injuryScanRevenue.toFixed(2)),
        trainingRevenue: parseFloat(trainingRevenue.toFixed(2)),
        totalRevenue: parseFloat(monthRevenue.toFixed(2)),
        cumulativeRevenue: parseFloat(cumulativeRevenue.toFixed(2)),
        marketingCost: parseFloat(marketingCost.toFixed(2)),
        openAICost: parseFloat(openAICost.toFixed(2)),
        firebaseCost: parseFloat(firebaseCost.toFixed(2)),
        adsCost: parseFloat(adsCost.toFixed(2)),
        developmentCost: parseFloat(developmentCostMonthly.toFixed(2)),
        otherCosts: parseFloat(otherCostsMonthly.toFixed(2)),
        totalCosts: parseFloat(totalMonthCosts.toFixed(2)),
        cumulativeCosts: parseFloat(cumulativeCosts.toFixed(2)),
        profit: parseFloat(monthProfit.toFixed(2)),
        cumulativeProfit: parseFloat(cumulativeProfit.toFixed(2)),
      });
      
      // Add yearly aggregates
      if (month % 12 === 0) {
        const yearNumber = month / 12;
        const yearStart = month - 12;
        
        // Calculate yearly totals
        const yearTotalRevenue = monthlyData.slice(yearStart, month).reduce((sum, m) => sum + m.totalRevenue, 0);
        const yearTotalCosts = monthlyData.slice(yearStart, month).reduce((sum, m) => sum + m.totalCosts, 0);
        const yearProfit = yearTotalRevenue - yearTotalCosts;
        
        yearlyData.push({
          year: yearNumber,
          averageMonthlySubscribers: Math.round(monthlyData.slice(yearStart, month).reduce((sum, m) => sum + m.monthlySubscribers, 0) / 12),
          averageYearlySubscribers: Math.round(monthlyData.slice(yearStart, month).reduce((sum, m) => sum + m.yearlySubscribers, 0) / 12),
          totalRevenue: parseFloat(yearTotalRevenue.toFixed(2)),
          totalCosts: parseFloat(yearTotalCosts.toFixed(2)),
          profit: parseFloat(yearProfit.toFixed(2)),
          profitMargin: parseFloat(((yearProfit / yearTotalRevenue) * 100).toFixed(2)),
        });
      }
    }
    
    setMonthlyData(monthlyData);
    setYearlyData(yearlyData);
  };

  // Chart data for revenue
  const revenueChartData = {
    labels: monthlyData.map(d => `Month ${d.month}`),
    datasets: [
      {
        label: 'Monthly Subscription',
        data: monthlyData.map(d => d.monthlySubscriptionRevenue),
        backgroundColor: colors.monthly,
        borderColor: colors.monthly.replace('0.6', '1'),
        borderWidth: 1,
      },
      {
        label: 'Yearly Subscription',
        data: monthlyData.map(d => d.yearlySubscriptionRevenue),
        backgroundColor: colors.yearly,
        borderColor: colors.yearly.replace('0.6', '1'),
        borderWidth: 1,
      },
      {
        label: 'Injury Scan',
        data: monthlyData.map(d => d.injuryScanRevenue),
        backgroundColor: colors.injury,
        borderColor: colors.injury.replace('0.6', '1'),
        borderWidth: 1,
      },
      {
        label: 'Training',
        data: monthlyData.map(d => d.trainingRevenue),
        backgroundColor: colors.training,
        borderColor: colors.training.replace('0.6', '1'),
        borderWidth: 1,
      },
    ]
  };

  // Chart data for profit
  const profitChartData = {
    labels: monthlyData.map(d => `Month ${d.month}`),
    datasets: [
      {
        label: 'Monthly Profit',
        data: monthlyData.map(d => d.profit),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Cumulative Profit',
        data: monthlyData.map(d => d.cumulativeProfit),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ]
  };

  // Summary data
  const summaryData = monthlyData.length > 0 
    ? {
        totalActiveUsers: monthlyData[monthlyData.length - 1].totalActiveUsers,
        totalMRR: monthlyData[monthlyData.length - 1].monthlySubscriptionRevenue + 
                 (monthlyData[monthlyData.length - 1].yearlySubscriptionRevenue / 12) +
                 monthlyData[monthlyData.length - 1].injuryScanRevenue + 
                 (monthlyData[monthlyData.length - 1].trainingRevenue / 12),
        thirdYearRevenue: yearlyData.length > 2 ? yearlyData[2].totalRevenue : 0,
        thirdYearProfit: yearlyData.length > 2 ? yearlyData[2].profit : 0,
      }
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Password Dialog */}
      <Dialog 
        open={showPasswordDialog} 
        onOpenChange={(open) => {
          if (isAuthenticated) {
            setShowPasswordDialog(open);
          } else {
            setShowPasswordDialog(true);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5" /> Secure Access Required
            </DialogTitle>
            <DialogDescription>
              Please enter the password to access the Revenue Projection dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
              />
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>
            <Button onClick={handlePasswordSubmit} className="w-full">
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lock Screen */}
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Lock className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Revenue Projection Dashboard</h1>
          <p className="text-muted-foreground mb-4">This page is password protected.</p>
          <Button onClick={() => setShowPasswordDialog(true)}>Enter Password</Button>
        </div>
      ) : (
        /* Main Dashboard Content */
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Revenue Projection & Business Model</h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <Unlock className="h-4 w-4 mr-1" /> Authenticated Access
            </div>
          </div>
          
          {/* Key Metrics Summary */}
          {summaryData && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Total Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {summaryData.totalActiveUsers.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">After 3 years</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Monthly Recurring Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${summaryData.totalMRR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-sm text-muted-foreground">Per month after 3 years</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Year 3 Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${summaryData.thirdYearRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-sm text-muted-foreground">Total for year 3</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Year 3 Profit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${summaryData.thirdYearProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-sm text-muted-foreground">Total for year 3</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* User Parameters Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Subscription Model Parameters</CardTitle>
              <CardDescription>Adjust parameters to see different revenue projections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyDownloads">Monthly App Downloads</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="monthlyDownloads"
                        type="number"
                        value={monthlyDownloads}
                        onChange={(e) => setMonthlyDownloads(parseInt(e.target.value) || 0)}
                        className="w-24"
                        min="0"
                      />
                      <Slider
                        id="monthlyDownloadsSlider"
                        defaultValue={[monthlyDownloads]}
                        max={5000}
                        step={100}
                        onValueChange={(value) => setMonthlyDownloads(value[0])}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trialConversionRate">Trial Conversion Rate (%)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="trialConversionRate"
                        type="number"
                        value={trialConversionRate}
                        onChange={(e) => setTrialConversionRate(parseFloat(e.target.value) || 0)}
                        className="w-24"
                        min="0"
                        max="100"
                      />
                      <Slider
                        id="trialConversionRateSlider"
                        defaultValue={[trialConversionRate]}
                        max={100}
                        step={1}
                        onValueChange={(value) => setTrialConversionRate(value[0])}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Subscription Distribution (%)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="monthlyRate" className="text-sm">Monthly ($8.99)</Label>
                        <Input
                          id="monthlyRate"
                          type="number"
                          value={monthlySubscriptionRate}
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value) || 0;
                            setMonthlySubscriptionRate(newValue);
                            setYearlySubscriptionRate(100 - newValue);
                          }}
                          className="w-full"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="yearlyRate" className="text-sm">Yearly ($79.99)</Label>
                        <Input
                          id="yearlyRate"
                          type="number"
                          value={yearlySubscriptionRate}
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value) || 0;
                            setYearlySubscriptionRate(newValue);
                            setMonthlySubscriptionRate(100 - newValue);
                          }}
                          className="w-full"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Churn Rates (%)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="monthlyChurn" className="text-sm">Monthly (per month)</Label>
                        <Input
                          id="monthlyChurn"
                          type="number"
                          value={churnRateMonthly}
                          onChange={(e) => setChurnRateMonthly(parseFloat(e.target.value) || 0)}
                          className="w-full"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="yearlyChurn" className="text-sm">Yearly (per year)</Label>
                        <Input
                          id="yearlyChurn"
                          type="number"
                          value={churnRateYearly}
                          onChange={(e) => setChurnRateYearly(parseFloat(e.target.value) || 0)}
                          className="w-full"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>In-App Purchase Usage (%)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="injuryScanUsage" className="text-sm">Injury Scan ($1.99)</Label>
                        <Input
                          id="injuryScanUsage"
                          type="number"
                          value={injuryScanUsage}
                          onChange={(e) => setInjuryScanUsage(parseFloat(e.target.value) || 0)}
                          className="w-full"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="trainingUsage" className="text-sm">Training ($39.99/yr)</Label>
                        <Input
                          id="trainingUsage"
                          type="number"
                          value={trainingUsage}
                          onChange={(e) => setTrainingUsage(parseFloat(e.target.value) || 0)}
                          className="w-full"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Operating Costs</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="marketingCost" className="text-sm">Marketing ($ per user)</Label>
                        <Input
                          id="marketingCost"
                          type="number"
                          value={marketingCostPerUser}
                          onChange={(e) => setMarketingCostPerUser(parseFloat(e.target.value) || 0)}
                          className="w-full"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="openAICost" className="text-sm">OpenAI ($ per user/mo)</Label>
                        <Input
                          id="openAICost"
                          type="number"
                          value={openAICostPerUser}
                          onChange={(e) => setOpenAICostPerUser(parseFloat(e.target.value) || 0)}
                          className="w-full"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Revenue Projection</CardTitle>
              <CardDescription>3-year revenue forecast based on the parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="revenue" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
                  <TabsTrigger value="profit">Profit Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="revenue">
                  <div className="h-[400px]">
                    <Bar data={revenueChartData} options={{ maintainAspectRatio: false }} />
                  </div>
                </TabsContent>
                <TabsContent value="profit">
                  <div className="h-[400px]">
                    <Bar data={profitChartData} options={{ maintainAspectRatio: false }} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Yearly Projections */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Yearly Projections</CardTitle>
              <CardDescription>Annual financial overview</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Avg. Monthly Subscribers</TableHead>
                    <TableHead>Avg. Yearly Subscribers</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Total Costs</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Profit Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {yearlyData.map((year) => (
                    <TableRow key={year.year}>
                      <TableCell>{year.year}</TableCell>
                      <TableCell>{year.averageMonthlySubscribers.toLocaleString()}</TableCell>
                      <TableCell>{year.averageYearlySubscribers.toLocaleString()}</TableCell>
                      <TableCell>${year.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      <TableCell>${year.totalCosts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      <TableCell className={year.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ${year.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={year.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {year.profitMargin}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Business Model Notes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Business Model Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Subscription Pricing</h3>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Monthly subscription: <span className="font-medium">${monthlySubscriptionPrice}</span> per month</li>
                    <li>Yearly subscription: <span className="font-medium">${yearlySubscriptionPrice}</span> per year (${(yearlySubscriptionPrice / 12).toFixed(2)} per month, ~{((1 - (yearlySubscriptionPrice / 12 / monthlySubscriptionPrice)) * 100).toFixed(0)}% discount)</li>
                    <li>7-day free trial available for both subscription types</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Future In-App Purchases</h3>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Injury scan package: <span className="font-medium">${injuryScanPrice}</span> for 5 scans</li>
                    <li>Guided Training Tracking: <span className="font-medium">${trainingPrice}</span> per year</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Key Assumptions</h3>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Monthly app downloads: {monthlyDownloads}</li>
                    <li>Trial conversion rate: {trialConversionRate}%</li>
                    <li>Monthly churn rate: {churnRateMonthly}% (monthly subscriptions)</li>
                    <li>Yearly churn rate: {churnRateYearly}% (yearly subscriptions at renewal)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}