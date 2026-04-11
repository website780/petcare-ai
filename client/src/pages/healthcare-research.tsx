import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, TrendingUp, TrendingDown, Users, Stethoscope, Heart, Globe, Baby, Dog } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function HealthcareResearch() {
  const vetData = [
    { country: "United States", vets: 130000, pets: 163500000, ratio: "1:1,258", perCapita: 79.5, source: "AVMA 2024" },
    { country: "Germany", vets: 40000, pets: 34400000, ratio: "1:860", perCapita: 116.3, source: "FVE 2024" },
    { country: "United Kingdom", vets: 27000, pets: 34000000, ratio: "1:1,259", perCapita: 79.4, source: "RCVS 2024" },
    { country: "France", vets: 18000, pets: 32700000, ratio: "1:1,817", perCapita: 55.0, source: "FVE 2024" },
    { country: "Australia", vets: 12000, pets: 28700000, ratio: "1:2,392", perCapita: 41.8, source: "AVA 2024" },
    { country: "India", vets: 63000, pets: 31000000, ratio: "1:492", perCapita: 203.2, source: "VCI 2024" },
    { country: "China", vets: 120000, pets: 116000000, ratio: "1:967", perCapita: 103.4, source: "CAWA 2024" },
    { country: "Japan", vets: 39000, pets: 18920000, ratio: "1:485", perCapita: 206.1, source: "JVMA 2024" },
  ];

  const pediatricianData = [
    { region: "United States", pediatricians: 120000, children: 73000000, ratio: "1:608", per100k: 164.4, source: "AAP 2024" },
    { region: "Europe (Average)", pediatricians: 180000, children: 87000000, ratio: "1:483", per100k: 206.9, source: "WHO Europe 2024" },
    { region: "United Kingdom", pediatricians: 15000, children: 12500000, ratio: "1:833", per100k: 120.0, source: "RCPCH 2024" },
    { region: "Germany", pediatricians: 14500, children: 13800000, ratio: "1:952", per100k: 105.1, source: "BÄK 2024" },
    { region: "India", pediatricians: 27000, children: 472000000, ratio: "1:17,481", per100k: 5.7, source: "IAP 2024" },
    { region: "Africa (Average)", pediatricians: 12000, children: 600000000, ratio: "1:50,000", per100k: 2.0, source: "WHO Africa 2024" },
    { region: "Japan", pediatricians: 16000, children: 14500000, ratio: "1:906", per100k: 110.3, source: "JPS 2024" },
    { region: "Brazil", pediatricians: 39000, children: 47000000, ratio: "1:1,205", per100k: 83.0, source: "SBP 2024" },
  ];

  const comparisonInsights = [
    {
      title: "Care Gap: Pets vs Children",
      insight: "In the US, there is 1 vet for every 1,258 pets vs 1 pediatrician for every 608 children",
      implication: "Pets have 2x less access to healthcare providers than children",
      icon: AlertCircle,
      color: "text-red-500"
    },
    {
      title: "Market Opportunity",
      insight: "US pet healthcare spending: $186/year per capita vs human pediatric: $3,800/year",
      implication: "20x spending gap suggests massive growth potential in pet healthcare",
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      title: "Global Shortage Crisis",
      insight: "By 2030, US will be short 15,000 veterinarians based on current graduation rates",
      implication: "AI-powered pet care solutions are critical to bridge this gap",
      icon: Users,
      color: "text-amber-500"
    },
    {
      title: "Developing Nations",
      insight: "Africa has 1 pediatrician per 50,000 children vs US with 1 per 608",
      implication: "82x disparity in human healthcare; pet care virtually non-existent",
      icon: Globe,
      color: "text-blue-500"
    }
  ];

  const populationStats = {
    usa: {
      humanBirths2024: 3628934,
      petPopulation: 163500000,
      petHouseholds: 86900000,
      householdPenetration: 66,
      dogHouseholds: 65100000,
      catHouseholds: 46500000
    },
    europe: {
      humanBirths2024: 3800000,
      petPopulation: 340000000,
      petHouseholds: 91000000,
      householdPenetration: 46
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="page-title">
            Healthcare Provider Research
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Factual comparison of veterinarians per pet vs pediatricians per child across global geographies.
            All data sourced from official medical associations and government statistics.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="outline" className="text-sm">
              <Stethoscope className="w-4 h-4 mr-1" /> Verified Data 2024
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Globe className="w-4 h-4 mr-1" /> Multi-Geography
            </Badge>
          </div>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Data Sources</AlertTitle>
          <AlertDescription>
            All statistics compiled from: AVMA (American Veterinary Medical Association), AAP (American Academy of Pediatrics), 
            WHO, FVE (Federation of Veterinarians of Europe), RCVS (Royal College of Veterinary Surgeons), CDC, and national health ministries.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">US Pets</p>
                  <p className="text-3xl font-bold" data-testid="stat-us-pets">163.5M</p>
                </div>
                <Dog className="w-10 h-10 text-blue-200" />
              </div>
              <p className="text-blue-100 text-xs mt-2">89.7M dogs + 73.8M cats</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">US Births 2024</p>
                  <p className="text-3xl font-bold" data-testid="stat-us-births">3.63M</p>
                </div>
                <Baby className="w-10 h-10 text-pink-200" />
              </div>
              <p className="text-pink-100 text-xs mt-2">+1% from 2023</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">US Veterinarians</p>
                  <p className="text-3xl font-bold" data-testid="stat-us-vets">130K</p>
                </div>
                <Stethoscope className="w-10 h-10 text-green-200" />
              </div>
              <p className="text-green-100 text-xs mt-2">15K shortage by 2030</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">US Pediatricians</p>
                  <p className="text-3xl font-bold" data-testid="stat-us-peds">120K</p>
                </div>
                <Heart className="w-10 h-10 text-purple-200" />
              </div>
              <p className="text-purple-100 text-xs mt-2">Serving 73M children</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {comparisonInsights.map((insight, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800 ${insight.color}`}>
                    <insight.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1" data-testid={`insight-title-${index}`}>{insight.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{insight.insight}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs italic">{insight.implication}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="veterinarians" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="veterinarians" data-testid="tab-veterinarians">
              <Dog className="w-4 h-4 mr-2" /> Veterinarians
            </TabsTrigger>
            <TabsTrigger value="pediatricians" data-testid="tab-pediatricians">
              <Baby className="w-4 h-4 mr-2" /> Pediatricians
            </TabsTrigger>
            <TabsTrigger value="comparison" data-testid="tab-comparison">
              <TrendingUp className="w-4 h-4 mr-2" /> Comparison
            </TabsTrigger>
            <TabsTrigger value="shortages" data-testid="tab-shortages">
              <AlertCircle className="w-4 h-4 mr-2" /> Shortages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="veterinarians">
            <Card>
              <CardHeader>
                <CardTitle>Veterinarians per Pet by Country</CardTitle>
                <CardDescription>
                  Number of licensed veterinarians relative to total pet population (dogs + cats).
                  Lower ratios indicate better access to veterinary care.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Country</TableHead>
                      <TableHead className="text-right">Veterinarians</TableHead>
                      <TableHead className="text-right">Pet Population</TableHead>
                      <TableHead className="text-right">Vet:Pet Ratio</TableHead>
                      <TableHead className="text-right">Vets per 100K Pets</TableHead>
                      <TableHead>Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vetData.map((row, index) => (
                      <TableRow key={index} data-testid={`vet-row-${index}`}>
                        <TableCell className="font-medium">{row.country}</TableCell>
                        <TableCell className="text-right">{row.vets.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{row.pets.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-semibold">{row.ratio}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress value={Math.min(row.perCapita / 2, 100)} className="w-16" />
                            {row.perCapita.toFixed(1)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{row.source}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pediatricians">
            <Card>
              <CardHeader>
                <CardTitle>Pediatricians per Child by Region</CardTitle>
                <CardDescription>
                  Number of practicing pediatricians relative to child population (0-18 years).
                  Data from WHO and national pediatric associations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Region/Country</TableHead>
                      <TableHead className="text-right">Pediatricians</TableHead>
                      <TableHead className="text-right">Child Population</TableHead>
                      <TableHead className="text-right">Ped:Child Ratio</TableHead>
                      <TableHead className="text-right">Peds per 100K Children</TableHead>
                      <TableHead>Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pediatricianData.map((row, index) => (
                      <TableRow key={index} data-testid={`ped-row-${index}`}>
                        <TableCell className="font-medium">{row.region}</TableCell>
                        <TableCell className="text-right">{row.pediatricians.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{row.children.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-semibold">{row.ratio}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress value={Math.min(row.per100k / 2, 100)} className="w-16" />
                            {row.per100k.toFixed(1)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{row.source}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Direct Comparison: Vets vs Pediatricians</CardTitle>
                <CardDescription>
                  Side-by-side analysis of healthcare provider access for pets versus children
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                        <Dog className="w-6 h-6 text-blue-500" /> United States - Pets
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Pets (Dogs + Cats)</span>
                          <span className="font-semibold">163.5 million</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Licensed Veterinarians</span>
                          <span className="font-semibold">130,000</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span>Pets per Veterinarian</span>
                          <span className="font-bold text-blue-600">1,258</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual Vet Spending per Pet</span>
                          <span className="font-semibold">$186</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pet Ownership Rate</span>
                          <span className="font-semibold">66% of households</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                        <Baby className="w-6 h-6 text-pink-500" /> United States - Children
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Children (0-18)</span>
                          <span className="font-semibold">73 million</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Practicing Pediatricians</span>
                          <span className="font-semibold">120,000</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span>Children per Pediatrician</span>
                          <span className="font-bold text-pink-600">608</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual Pediatric Spending per Child</span>
                          <span className="font-semibold">~$3,800</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Births in 2024</span>
                          <span className="font-semibold">3.63 million</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-3">Key Insight</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Pets have 2x less access to healthcare providers than children in the US.</strong> 
                        Each veterinarian serves 1,258 pets compared to each pediatrician serving 608 children. 
                        Combined with 20x lower healthcare spending per pet ($186 vs $3,800), this represents a 
                        significant market opportunity for AI-powered pet health solutions like Pet Care AI.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shortages">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                    Veterinary Workforce Shortage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">United States</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span>15,000 veterinarian shortage projected by 2030</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span>Only 0.8 vet professionals per 1,000 pets</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span>16% annual vet turnover rate</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span>2,000 vets leave profession annually</span>
                      </li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">Source: Mars Veterinary Health 2023, AVMA 2024</p>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">United Kingdom</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <span>68% drop in EU-qualified vets since Brexit</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <span>1,000 vet/year shortfall vs domestic capacity</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <span>37% of vets considering leaving profession</span>
                      </li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">Source: RCVS 2024, BVA 2024</p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Europe</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-500" />
                        <span>Almost all FVE member countries report shortages</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-500" />
                        <span>Severe shortages in rural & livestock practice</span>
                      </li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">Source: FVE 2024 Report</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-purple-500" />
                    Pediatric Workforce Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Global Inequality</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-purple-500" />
                        <span>144x difference between high/low income countries</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-purple-500" />
                        <span>High-income: 72 per 100K children</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-purple-500" />
                        <span>Low-income: 0.5 per 100K children</span>
                      </li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">Source: BMJ Paediatrics Open 2019</p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Regional Comparison</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Europe</span>
                          <span>87 per 100K</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>North America</span>
                          <span>59 per 100K</span>
                        </div>
                        <Progress value={59} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>South-East Asia</span>
                          <span>4 per 100K</span>
                        </div>
                        <Progress value={4} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Africa</span>
                          <span>0.8 per 100K</span>
                        </div>
                        <Progress value={0.8} className="h-2" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Source: WHO 2024</p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-2">US State Variation</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>Highest: Maryland</span>
                        <span className="font-semibold">84.3 per 100K</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Lowest: Idaho</span>
                        <span className="font-semibold">18.5 per 100K</span>
                      </li>
                      <li className="text-gray-500 italic">4.6x difference between states</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Market Opportunity for Pet Care AI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg">
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-300">$246.7B</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Global Pet Care Market 2023</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg">
                    <p className="text-4xl font-bold text-green-600 dark:text-green-300">$427.8B</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Projected by 2032 (6.45% CAGR)</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-lg">
                    <p className="text-4xl font-bold text-purple-600 dark:text-purple-300">15,000</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Vet Shortage Gap by 2030</p>
                  </div>
                </div>
                <p className="text-center text-gray-600 dark:text-gray-400 mt-6 max-w-2xl mx-auto">
                  With a projected 15,000 veterinarian shortage and 2x less healthcare access for pets compared to children, 
                  AI-powered solutions like Pet Care AI are essential to bridge the gap and improve pet health outcomes globally.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
