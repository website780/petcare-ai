import React, { useState } from 'react';
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
import { Line } from 'react-chartjs-2';
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
import { Lock, Unlock, Users, DollarSign, TrendingUp, Share2, Briefcase, CreditCard } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function EquitySharePlanPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { toast } = useToast();

  // Marketing model parameters
  const [monthlyDownloads, setMonthlyDownloads] = useState(1000);
  const [marketingCostPerUser, setMarketingCostPerUser] = useState(2.5); // $ per acquired user
  const [adsCostPercentage, setAdsCostPercentage] = useState(10); // percentage of revenue
  const [totalDownloads, setTotalDownloads] = useState(0); // Cumulative downloads
  const [monthsToSimulate, setMonthsToSimulate] = useState(36); // 3 years
  
  // Subscription parameters (for revenue calculation)
  const monthlySubscriptionPrice = 8.99; // $
  const yearlySubscriptionPrice = 79.99; // $
  const trialConversionRate = 40; // percentage
  const monthlySubscriptionRate = 60; // percentage
  const yearlySubscriptionRate = 40; // percentage
  
  // Marketing plan tiers constants
  const tier1MaxDownloads = 2000;
  const tier1Cost = 20000; // INR
  
  const tier2MinDownloads = tier1MaxDownloads;
  const tier2MaxDownloads = 10000;
  const tier2Cost = 40000; // INR
  
  const tier3MinDownloads = tier2MaxDownloads;
  const tier3MonthlyCost = 100000; // INR
  const tier3EquityShares = 100000; // out of 5000000
  const tier3EquityPercentage = (tier3EquityShares / 5000000) * 100;
  const tier3VestingYears = 4;
  
  // USD to INR conversion (for display purposes)
  const usdToInrRate = 83.27; // 1 USD = 83.27 INR (as of April 2025)
  
  // Handle password verification
  const handlePasswordSubmit = () => {
    const correctPassword = "PetC@re9!";
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setShowPasswordDialog(false);
      toast({
        title: "Access Granted",
        description: "Welcome to the Equity Share Plan dashboard.",
      });
    } else {
      setPasswordError("Incorrect password. Please try again.");
      setPassword('');
    }
  };

  // Calculate marketing costs and equity distribution
  const simulateGrowth = () => {
    let downloads = 0;
    let revenue = 0;
    let adsCost = 0;
    let marketingCost = 0;
    let equityShares = 0;
    
    const monthlyData = [];
    
    for (let month = 1; month <= monthsToSimulate; month++) {
      // Add new downloads this month
      const newDownloads = monthlyDownloads;
      downloads += newDownloads;
      
      // Calculate revenue based on conversion rate and subscription mix
      const newConverts = newDownloads * (trialConversionRate / 100);
      const newMonthlySubscribers = newConverts * (monthlySubscriptionRate / 100);
      const newYearlySubscribers = newConverts * (yearlySubscriptionRate / 100);
      
      const monthRevenue = newMonthlySubscribers * monthlySubscriptionPrice + 
                          (month % 12 === 1 ? newYearlySubscribers * yearlySubscriptionPrice : 0);
      
      revenue += monthRevenue;
      
      // Calculate ad costs
      const monthAdsCost = monthRevenue * (adsCostPercentage / 100);
      adsCost += monthAdsCost;
      
      // Calculate marketing costs based on tier
      let tierName = "";
      let fixedMarketingCost = 0;
      let monthEquityShares = 0;
      
      if (downloads <= tier1MaxDownloads) {
        // Tier 1: First 1000-2000 downloads
        tierName = "Tier 1";
        fixedMarketingCost = downloads === tier1MaxDownloads && month === 1 ? tier1Cost : 0;
      } else if (downloads <= tier2MaxDownloads) {
        // Tier 2: 2000-10000 downloads
        tierName = "Tier 2";
        fixedMarketingCost = downloads === tier2MaxDownloads && downloads - newDownloads < tier2MaxDownloads ? tier2Cost : 0;
      } else {
        // Tier 3: 10000+ downloads with equity
        tierName = "Tier 3";
        fixedMarketingCost = tier3MonthlyCost;
        
        // Equity shares vested over 4 years (monthly vesting)
        if (month <= tier3VestingYears * 12) {
          monthEquityShares = tier3EquityShares / (tier3VestingYears * 12);
          equityShares += monthEquityShares;
        }
      }
      
      marketingCost += fixedMarketingCost;
      
      // Convert USD to INR for display
      const fixedMarketingCostUSD = fixedMarketingCost / usdToInrRate;
      
      monthlyData.push({
        month,
        totalDownloads: downloads,
        newDownloads,
        tierName,
        revenue: monthRevenue,
        cumulativeRevenue: revenue,
        adsCost: monthAdsCost,
        cumulativeAdsCost: adsCost,
        fixedMarketingCost,
        cumulativeMarketingCost: marketingCost,
        equitySharesVested: equityShares,
        monthEquityShares,
      });
    }
    
    return monthlyData;
  };
  
  const monthlyData = simulateGrowth();
  
  // Calculate key metrics
  const totalCumulativeDownloads = monthlyData[monthlyData.length - 1]?.totalDownloads || 0;
  const totalCumulativeRevenue = monthlyData[monthlyData.length - 1]?.cumulativeRevenue || 0;
  const totalCumulativeAdsCost = monthlyData[monthlyData.length - 1]?.cumulativeAdsCost || 0;
  const totalCumulativeMarketingCost = monthlyData[monthlyData.length - 1]?.cumulativeMarketingCost || 0;
  const totalEquitySharesVested = monthlyData[monthlyData.length - 1]?.equitySharesVested || 0;
  
  // Prepare chart data
  const growthChartData = {
    labels: monthlyData.map(d => `Month ${d.month}`),
    datasets: [
      {
        label: 'Cumulative Downloads',
        data: monthlyData.map(d => d.totalDownloads),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      }
    ]
  };
  
  const costChartData = {
    labels: monthlyData.map(d => `Month ${d.month}`),
    datasets: [
      {
        label: 'Monthly Marketing Cost (INR)',
        data: monthlyData.map(d => d.fixedMarketingCost),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      {
        label: 'Monthly Ads Cost (USD)',
        data: monthlyData.map(d => d.adsCost),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      }
    ]
  };
  
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
              Please enter the password to access the Equity Share Plan dashboard.
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
          <h1 className="text-2xl font-bold mb-2">Equity Share Plan Dashboard</h1>
          <p className="text-muted-foreground mb-4">This page is password protected.</p>
          <Button onClick={() => setShowPasswordDialog(true)}>Enter Password</Button>
        </div>
      ) : (
        /* Main Dashboard Content */
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Marketing Partnership & Equity Share Plan</h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <Unlock className="h-4 w-4 mr-1" /> Authenticated Access
            </div>
          </div>
          
          {/* Marketing Plan Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Marketing Partnership Tiers</CardTitle>
              <CardDescription>Our tiered marketing partnership structure based on app downloads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="bg-blue-50 dark:bg-blue-950">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-500" /> Tier 1: Initial Launch
                    </CardTitle>
                    <CardDescription>First {tier1MaxDownloads.toLocaleString()} downloads</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                        Fixed cost: ₹{tier1Cost.toLocaleString()} + Ad costs
                      </li>
                      <li className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-500" />
                        Users receive app for free
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
                        Focus on market testing
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="bg-purple-50 dark:bg-purple-950">
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-purple-500" /> Tier 2: Growth Phase
                    </CardTitle>
                    <CardDescription>{tier2MinDownloads.toLocaleString()} - {tier2MaxDownloads.toLocaleString()} downloads</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                        Fixed cost: ₹{tier2Cost.toLocaleString()} + Ad costs
                      </li>
                      <li className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                        Users charged subscription fees
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
                        Focus on user acquisition
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="bg-green-50 dark:bg-green-950">
                    <CardTitle className="text-lg flex items-center">
                      <Share2 className="h-5 w-5 mr-2 text-green-500" /> Tier 3: Equity Partnership
                    </CardTitle>
                    <CardDescription>{tier3MinDownloads.toLocaleString()}+ downloads</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                        Monthly: ₹{tier3MonthlyCost.toLocaleString()} + Ad costs
                      </li>
                      <li className="flex items-center">
                        <Share2 className="h-4 w-4 mr-2 text-purple-500" />
                        {tier3EquityShares.toLocaleString()} shares ({tier3EquityPercentage}%)
                      </li>
                      <li className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
                        {tier3VestingYears}-year vesting schedule
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          {/* Simulation Parameters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Marketing Growth Simulator</CardTitle>
              <CardDescription>Estimate costs and equity distribution based on growth projections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyDownloads">Monthly Downloads</Label>
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
                    <Label htmlFor="monthsToSimulate">Months to Simulate</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="monthsToSimulate"
                        type="number"
                        value={monthsToSimulate}
                        onChange={(e) => setMonthsToSimulate(parseInt(e.target.value) || 0)}
                        className="w-24"
                        min="1"
                        max="60"
                      />
                      <Slider
                        id="monthsToSimulateSlider"
                        defaultValue={[monthsToSimulate]}
                        max={60}
                        min={12}
                        step={12}
                        onValueChange={(value) => setMonthsToSimulate(value[0])}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="marketingCost">Avg. User Acquisition Cost (USD)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="marketingCost"
                        type="number"
                        value={marketingCostPerUser}
                        onChange={(e) => setMarketingCostPerUser(parseFloat(e.target.value) || 0)}
                        className="w-24"
                        min="0"
                        step="0.1"
                      />
                      <Slider
                        id="marketingCostSlider"
                        defaultValue={[marketingCostPerUser]}
                        max={10}
                        step={0.1}
                        onValueChange={(value) => setMarketingCostPerUser(value[0])}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adsCost">Ads Cost (% of Revenue)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="adsCost"
                        type="number"
                        value={adsCostPercentage}
                        onChange={(e) => setAdsCostPercentage(parseFloat(e.target.value) || 0)}
                        className="w-24"
                        min="0"
                        max="100"
                      />
                      <Slider
                        id="adsCostSlider"
                        defaultValue={[adsCostPercentage]}
                        max={50}
                        step={1}
                        onValueChange={(value) => setAdsCostPercentage(value[0])}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Total Downloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalCumulativeDownloads.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">
                  After {monthsToSimulate} months
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalCumulativeRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-muted-foreground">
                  ≈ ₹{(totalCumulativeRevenue * usdToInrRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Marketing Costs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{totalCumulativeMarketingCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <p className="text-sm text-muted-foreground">
                  + ${totalCumulativeAdsCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ads
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  Equity Vested
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalEquitySharesVested.toLocaleString(undefined, { maximumFractionDigits: 0 })} shares
                </div>
                <p className="text-sm text-muted-foreground">
                  {((totalEquitySharesVested / 5000000) * 100).toFixed(2)}% of company
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Download Growth Projection</CardTitle>
                <CardDescription>Cumulative app downloads over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Line 
                    data={growthChartData} 
                    options={{ 
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Total Downloads'
                          }
                        },
                        x: {
                          title: {
                            display: true,
                            text: 'Month'
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Marketing Cost Breakdown</CardTitle>
                <CardDescription>Monthly fixed costs and ad spend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Line 
                    data={costChartData} 
                    options={{ 
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Cost'
                          }
                        },
                        x: {
                          title: {
                            display: true,
                            text: 'Month'
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Data Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Detailed Monthly Projections</CardTitle>
              <CardDescription>Marketing costs and equity vesting schedule</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Total Downloads</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Monthly Revenue (USD)</TableHead>
                      <TableHead>Marketing Cost (INR)</TableHead>
                      <TableHead>Ads Cost (USD)</TableHead>
                      <TableHead>Equity Shares Vested</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyData.filter((_, index) => index % 3 === 0 || index < 5 || index > monthlyData.length - 5).map((month) => (
                      <TableRow key={month.month}>
                        <TableCell>{month.month}</TableCell>
                        <TableCell>{month.totalDownloads.toLocaleString()}</TableCell>
                        <TableCell>{month.tierName}</TableCell>
                        <TableCell>${month.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        <TableCell>₹{month.fixedMarketingCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                        <TableCell>${month.adsCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        <TableCell>
                          {month.monthEquityShares > 0 ? 
                            `+${month.monthEquityShares.toFixed(2)} (${month.equitySharesVested.toFixed(0)} total)` : 
                            month.equitySharesVested > 0 ? month.equitySharesVested.toFixed(0) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Agreement Terms */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Partnership Agreement Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Tier 1: Initial Launch Phase</h3>
                  <ul className="list-disc pl-5 text-sm">
                    <li>First {tier1MaxDownloads.toLocaleString()} downloads will be free for users</li>
                    <li>One-time payment of ₹{tier1Cost.toLocaleString()} plus actual advertising costs</li>
                    <li>Focus on market testing, user feedback, and initial product refinement</li>
                    <li>Marketing company responsible for user acquisition strategy and implementation</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Tier 2: Growth Phase</h3>
                  <ul className="list-disc pl-5 text-sm">
                    <li>For downloads {tier2MinDownloads.toLocaleString()} to {tier2MaxDownloads.toLocaleString()}</li>
                    <li>One-time payment of ₹{tier2Cost.toLocaleString()} plus actual advertising costs</li>
                    <li>Users will be charged subscription fees (₹{(monthlySubscriptionPrice * usdToInrRate).toFixed(0)}/mo or ₹{(yearlySubscriptionPrice * usdToInrRate).toFixed(0)}/yr)</li>
                    <li>Focus on scaling user acquisition and improving retention metrics</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Tier 3: Equity Partnership</h3>
                  <ul className="list-disc pl-5 text-sm">
                    <li>For {tier3MinDownloads.toLocaleString()}+ downloads</li>
                    <li>Monthly payment of ₹{tier3MonthlyCost.toLocaleString()} plus advertising costs</li>
                    <li>Equity allocation of {tier3EquityShares.toLocaleString()} shares out of {(5000000).toLocaleString()} total shares ({tier3EquityPercentage}%)</li>
                    <li>Shares vest over {tier3VestingYears} years on a monthly basis</li>
                    <li>Partnership continues as long as both parties agree to maintain the relationship</li>
                    <li>Termination clauses to be detailed in formal agreement</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Key Agreement Conditions</h3>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Performance metrics and expectations will be clearly defined for each tier</li>
                    <li>Regular review periods to assess marketing effectiveness</li>
                    <li>Transparency in advertising spend with detailed reporting</li>
                    <li>Collaborative approach to user acquisition strategy</li>
                    <li>Clear exit provisions for both parties if targets are not met</li>
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