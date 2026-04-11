import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Calculator, DollarSign, Users, Target, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalculatorInputs {
  // Marketing Costs
  googleAdsCPI: number;
  appleAdsCPI: number;
  monthlyAdSpend: number;
  conversionRate: number;
  churnRate: number;
  
  // Operating Costs
  baselineOperating: number;
  developmentCost: number;
  maintenanceCostPerUser: number;
  
  // Revenue
  subscriptionPrice: number;
  subscriptionTerm: number; // 1 for monthly, 12 for yearly
}

interface RunRateResults {
  monthlyDownloads: number;
  monthlyConversions: number;
  monthlyChurn: number;
  monthlyRevenue: number;
  totalMonthlyCosts: number;
  monthlyProfit: number;
  yearlyRunRate: number;
  costPerAcquisition: number;
  userLifetimeValue: number;
  breakEvenPoint: number;
}

export default function RunRateCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    // Marketing - Based on research data
    googleAdsCPI: 2.75, // Average $2.50-$3.50 for pet apps
    appleAdsCPI: 3.25, // Average $2.40-$4.50 for pet apps
    monthlyAdSpend: 10000,
    conversionRate: 1.6, // Pet care mobile conversion rate
    churnRate: 75, // Average mobile app churn rate
    
    // Operating Costs
    baselineOperating: 5000,
    developmentCost: 15000,
    maintenanceCostPerUser: 2.5,
    
    // Revenue
    subscriptionPrice: 9.99,
    subscriptionTerm: 1 // Monthly
  });

  const [results, setResults] = useState<RunRateResults | null>(null);

  // Industry benchmarks for display
  const benchmarks = {
    googleCPI: { min: 2.50, max: 3.50, note: "Pet care apps on Google Ads" },
    appleCPI: { min: 2.40, max: 4.50, note: "Pet care apps on Apple Search Ads" },
    conversionRate: { value: 1.6, note: "Pet care mobile e-commerce conversion rate" },
    churnRate: { value: 75, note: "Average mobile app 90-day churn rate" },
    retention: { day1: 25, day7: 38, day30: 5.6, note: "Mobile app retention benchmarks" }
  };

  const calculateRunRate = () => {
    const adSpendRatio = 0.6; // Assume 60% Google, 40% Apple
    const googleSpend = inputs.monthlyAdSpend * adSpendRatio;
    const appleSpend = inputs.monthlyAdSpend * (1 - adSpendRatio);
    
    const googleDownloads = googleSpend / inputs.googleAdsCPI;
    const appleDownloads = appleSpend / inputs.appleAdsCPI;
    const totalDownloads = googleDownloads + appleDownloads;
    
    const conversions = totalDownloads * (inputs.conversionRate / 100);
    const churnRate = inputs.churnRate / 100;
    const retentionRate = 1 - churnRate;
    
    // Calculate active users (considering churn)
    const activeUsers = conversions * retentionRate;
    
    // Monthly revenue
    const monthlyRevenue = activeUsers * inputs.subscriptionPrice;
    
    // Total monthly costs
    const maintenanceCosts = activeUsers * inputs.maintenanceCostPerUser;
    const totalCosts = inputs.monthlyAdSpend + inputs.baselineOperating + inputs.developmentCost + maintenanceCosts;
    
    // Profit and run rate
    const monthlyProfit = monthlyRevenue - totalCosts;
    const yearlyRunRate = monthlyProfit * 12;
    
    // Additional metrics
    const costPerAcquisition = inputs.monthlyAdSpend / conversions;
    const avgCustomerLifespan = 1 / (inputs.churnRate / 100 / 12); // months
    const userLifetimeValue = inputs.subscriptionPrice * avgCustomerLifespan;
    const breakEvenPoint = costPerAcquisition / inputs.subscriptionPrice; // months

    setResults({
      monthlyDownloads: Math.round(totalDownloads),
      monthlyConversions: Math.round(conversions),
      monthlyChurn: Math.round(activeUsers * churnRate),
      monthlyRevenue: Math.round(monthlyRevenue),
      totalMonthlyCosts: Math.round(totalCosts),
      monthlyProfit: Math.round(monthlyProfit),
      yearlyRunRate: Math.round(yearlyRunRate),
      costPerAcquisition: Math.round(costPerAcquisition * 100) / 100,
      userLifetimeValue: Math.round(userLifetimeValue * 100) / 100,
      breakEvenPoint: Math.round(breakEvenPoint * 10) / 10
    });
  };

  useEffect(() => {
    calculateRunRate();
  }, [inputs]);

  const updateInput = (key: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Run Rate Calculator</h1>
        <p className="text-muted-foreground text-lg">
          Calculate monthly and yearly run rates based on factual pet app marketing data
        </p>
      </div>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="benchmarks">Industry Benchmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="benchmarks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Google Ads CPI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${benchmarks.googleCPI.min} - ${benchmarks.googleCPI.max}</div>
                <p className="text-xs text-muted-foreground mt-1">{benchmarks.googleCPI.note}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Apple Search Ads CPI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${benchmarks.appleCPI.min} - ${benchmarks.appleCPI.max}</div>
                <p className="text-xs text-muted-foreground mt-1">{benchmarks.appleCPI.note}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{benchmarks.conversionRate.value}%</div>
                <p className="text-xs text-muted-foreground mt-1">{benchmarks.conversionRate.note}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{benchmarks.churnRate.value}%</div>
                <p className="text-xs text-muted-foreground mt-1">{benchmarks.churnRate.note}</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Retention Benchmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Day 1:</span>
                    <span className="font-bold">{benchmarks.retention.day1}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Day 7:</span>
                    <span className="font-bold">{benchmarks.retention.day7}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Day 30:</span>
                    <span className="font-bold">{benchmarks.retention.day30}%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{benchmarks.retention.note}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Industry Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Market Growth</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Pet care app market: $2.02B in 2024</li>
                    <li>• Growing at 18% CAGR through 2031</li>
                    <li>• Mobile pet care: $635.52M in 2023</li>
                    <li>• 70% of US households own pets</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cost Optimization</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• iOS typically 60-70% higher CPI than Android</li>
                    <li>• Retaining customers costs 5x less than acquiring new ones</li>
                    <li>• Personalized messaging boosts retention to 60-74%</li>
                    <li>• Mobile apps convert 3x better than mobile web</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Marketing Costs
                  </CardTitle>
                  <CardDescription>
                    Based on 2024-2025 industry data for pet care apps
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="googleCPI">Google Ads CPI ($)</Label>
                      <Input
                        id="googleCPI"
                        type="number"
                        step="0.01"
                        value={inputs.googleAdsCPI}
                        onChange={(e) => updateInput('googleAdsCPI', parseFloat(e.target.value) || 0)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Range: $2.50-$3.50</p>
                    </div>
                    <div>
                      <Label htmlFor="appleCPI">Apple Ads CPI ($)</Label>
                      <Input
                        id="appleCPI"
                        type="number"
                        step="0.01"
                        value={inputs.appleAdsCPI}
                        onChange={(e) => updateInput('appleAdsCPI', parseFloat(e.target.value) || 0)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Range: $2.40-$4.50</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="adSpend">Monthly Ad Spend ($)</Label>
                    <Input
                      id="adSpend"
                      type="number"
                      value={inputs.monthlyAdSpend}
                      onChange={(e) => updateInput('monthlyAdSpend', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="conversion">Conversion Rate (%)</Label>
                      <Input
                        id="conversion"
                        type="number"
                        step="0.1"
                        value={inputs.conversionRate}
                        onChange={(e) => updateInput('conversionRate', parseFloat(e.target.value) || 0)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Pet care: 1.6%</p>
                    </div>
                    <div>
                      <Label htmlFor="churn">Churn Rate (%)</Label>
                      <Input
                        id="churn"
                        type="number"
                        step="0.1"
                        value={inputs.churnRate}
                        onChange={(e) => updateInput('churnRate', parseFloat(e.target.value) || 0)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Mobile apps: 75%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Operating Costs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="operating">Baseline Operating Expenses/Month ($)</Label>
                    <Input
                      id="operating"
                      type="number"
                      value={inputs.baselineOperating}
                      onChange={(e) => updateInput('baselineOperating', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Marketing, office, utilities, etc.</p>
                  </div>

                  <div>
                    <Label htmlFor="development">Development Cost/Month ($)</Label>
                    <Input
                      id="development"
                      type="number"
                      value={inputs.developmentCost}
                      onChange={(e) => updateInput('developmentCost', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Team salaries, tools, infrastructure</p>
                  </div>

                  <div>
                    <Label htmlFor="maintenance">Maintenance Cost per User/Month ($)</Label>
                    <Input
                      id="maintenance"
                      type="number"
                      step="0.01"
                      value={inputs.maintenanceCostPerUser}
                      onChange={(e) => updateInput('maintenanceCostPerUser', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Server costs, support, etc.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Revenue Model
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="price">Subscription Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={inputs.subscriptionPrice}
                      onChange={(e) => updateInput('subscriptionPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="term">Subscription Term</Label>
                    <select
                      id="term"
                      className="w-full p-2 border rounded"
                      value={inputs.subscriptionTerm}
                      onChange={(e) => updateInput('subscriptionTerm', parseInt(e.target.value))}
                    >
                      <option value={1}>Monthly</option>
                      <option value={12}>Yearly</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {results && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Monthly Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{results.monthlyDownloads.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Downloads</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{results.monthlyConversions.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Conversions</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Monthly Revenue:</span>
                          <span className="font-bold text-green-600">${results.monthlyRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Monthly Costs:</span>
                          <span className="font-bold text-red-600">${results.totalMonthlyCosts.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg">
                          <span>Monthly Profit:</span>
                          <span className={`font-bold ${results.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${results.monthlyProfit.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Key Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">${results.yearlyRunRate.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Annual Run Rate</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold">${results.costPerAcquisition}</div>
                          <div className="text-xs text-muted-foreground">Cost per Acquisition</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold">${results.userLifetimeValue}</div>
                          <div className="text-xs text-muted-foreground">User Lifetime Value</div>
                        </div>
                      </div>

                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-lg font-bold text-yellow-700">{results.breakEvenPoint} months</div>
                        <div className="text-xs text-muted-foreground">Break-even Point</div>
                      </div>

                      {results.userLifetimeValue > results.costPerAcquisition && (
                        <Badge variant="default" className="w-full justify-center py-2">
                          ✓ Positive Unit Economics (LTV &gt; CAC)
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}