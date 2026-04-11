import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, DollarSign, Users, Shield, Code, Megaphone, FileText, Calculator, Download } from "lucide-react";

export default function BusinessOperationsPage() {
  const operationalCosts = {
    legal: [
      { item: "Business Registration & Incorporation", cost: "$500-2,000", frequency: "One-time", description: "LLC/Corp formation, state fees, registered agent" },
      { item: "Intellectual Property Protection", cost: "$2,000-10,000", frequency: "One-time + Annual", description: "Trademark registration, patent filing if applicable" },
      { item: "Legal Counsel Retainer", cost: "$5,000-15,000", frequency: "Monthly", description: "General counsel, contract review, compliance" },
      { item: "Privacy Policy & Terms of Service", cost: "$1,000-3,000", frequency: "One-time + Updates", description: "GDPR, CCPA compliance documentation" },
      { item: "Employment Law Compliance", cost: "$500-2,000", frequency: "Annual", description: "HR policies, employee handbook, state compliance" },
      { item: "Data Protection & Privacy Compliance", cost: "$3,000-8,000", frequency: "Annual", description: "HIPAA, SOC2, privacy audits for pet data" }
    ],
    taxes: [
      { item: "CPA/Accounting Services", cost: "$2,000-5,000", frequency: "Monthly", description: "Bookkeeping, financial statements, tax prep" },
      { item: "Federal Corporate Income Tax", cost: "21% of profits", frequency: "Annual", description: "Standard corporate tax rate" },
      { item: "State Corporate Tax", cost: "0-12% varies by state", frequency: "Annual", description: "State-specific corporate tax rates" },
      { item: "Payroll Taxes", cost: "15.3% of wages", frequency: "Quarterly", description: "Social Security, Medicare, unemployment" },
      { item: "Sales Tax Registration", cost: "$50-500", frequency: "One-time per state", description: "SaaS sales tax compliance" },
      { item: "Tax Software & Tools", cost: "$200-1,000", frequency: "Annual", description: "QuickBooks, TaxJar for multi-state compliance" }
    ],
    development: [
      { item: "Senior Full-Stack Developers", cost: "$120,000-180,000", frequency: "Annual per person", description: "2-3 developers needed for core features" },
      { item: "AI/ML Engineer", cost: "$150,000-220,000", frequency: "Annual", description: "OpenAI integration, model optimization" },
      { item: "Mobile Developers (iOS/Android)", cost: "$100,000-150,000", frequency: "Annual each", description: "Native app development and maintenance" },
      { item: "DevOps Engineer", cost: "$110,000-160,000", frequency: "Annual", description: "Infrastructure, deployment, monitoring" },
      { item: "QA/Testing Engineer", cost: "$80,000-120,000", frequency: "Annual", description: "Automated testing, manual QA processes" },
      { item: "Development Tools & Licenses", cost: "$2,000-5,000", frequency: "Annual", description: "IDEs, GitHub, testing tools, monitoring" }
    ],
    infrastructure: [
      { item: "Cloud Hosting (AWS/Azure)", cost: "$2,000-8,000", frequency: "Monthly", description: "Scalable infrastructure based on user growth" },
      { item: "Database Services (Neon/RDS)", cost: "$500-2,000", frequency: "Monthly", description: "PostgreSQL hosting, backups, scaling" },
      { item: "CDN & File Storage", cost: "$300-1,000", frequency: "Monthly", description: "Pet photos, app assets distribution" },
      { item: "Monitoring & Analytics", cost: "$500-1,500", frequency: "Monthly", description: "DataDog, New Relic, app performance monitoring" },
      { item: "Security Services", cost: "$1,000-3,000", frequency: "Monthly", description: "Web application firewall, security scanning" },
      { item: "Backup & Disaster Recovery", cost: "$300-800", frequency: "Monthly", description: "Data backup, business continuity planning" }
    ],
    thirdParty: [
      { item: "OpenAI API Usage", cost: "$1,000-5,000", frequency: "Monthly", description: "AI image analysis, GPT-4 for recommendations" },
      { item: "Firebase Authentication", cost: "$25-200", frequency: "Monthly", description: "User authentication and management" },
      { item: "Push Notification Services", cost: "$50-300", frequency: "Monthly", description: "iOS/Android push notifications" },
      { item: "Email Service (SendGrid)", cost: "$100-500", frequency: "Monthly", description: "Transactional emails, marketing campaigns" },
      { item: "SMS Service (Twilio)", cost: "$200-800", frequency: "Monthly", description: "Emergency alerts, appointment reminders" },
      { item: "Payment Processing (Stripe)", cost: "2.9% + $0.30 per transaction", frequency: "Per transaction", description: "Subscription billing, one-time payments" },
      { item: "App Store Fees", cost: "15-30% of revenue", frequency: "Monthly", description: "Apple App Store, Google Play Store commissions" }
    ],
    marketing: [
      { item: "Digital Marketing Manager", cost: "$70,000-110,000", frequency: "Annual", description: "Social media, content marketing, campaigns" },
      { item: "Performance Marketing Specialist", cost: "$60,000-95,000", frequency: "Annual", description: "Paid ads, conversion optimization" },
      { item: "Content Creator/Designer", cost: "$50,000-75,000", frequency: "Annual", description: "Graphics, videos, social media content" },
      { item: "Facebook/Instagram Ads", cost: "$3,000-15,000", frequency: "Monthly", description: "Paid social media advertising" },
      { item: "Google Ads", cost: "$2,000-10,000", frequency: "Monthly", description: "Search ads, display network" },
      { item: "Influencer Marketing", cost: "$5,000-25,000", frequency: "Monthly", description: "Pet influencer partnerships" },
      { item: "Marketing Tools & Analytics", cost: "$500-2,000", frequency: "Monthly", description: "HubSpot, Mailchimp, Google Analytics Pro" }
    ],
    operations: [
      { item: "CEO/Founder", cost: "$150,000-300,000", frequency: "Annual", description: "Strategic leadership, fundraising, vision" },
      { item: "CTO/Technical Lead", cost: "$180,000-250,000", frequency: "Annual", description: "Technical strategy, team leadership" },
      { item: "Head of Product", cost: "$140,000-200,000", frequency: "Annual", description: "Product roadmap, user research, feature planning" },
      { item: "Customer Success Manager", cost: "$60,000-90,000", frequency: "Annual", description: "User onboarding, support, retention" },
      { item: "Business Development", cost: "$80,000-120,000", frequency: "Annual", description: "Veterinary partnerships, B2B sales" },
      { item: "Office Space/Co-working", cost: "$2,000-8,000", frequency: "Monthly", description: "Physical workspace, meeting rooms" },
      { item: "Business Insurance", cost: "$3,000-8,000", frequency: "Annual", description: "General liability, E&O, cyber insurance" },
      { item: "Software Licenses", cost: "$1,000-3,000", frequency: "Monthly", description: "Office 365, Slack, project management tools" }
    ],
    compliance: [
      { item: "Veterinary Advisory Board", cost: "$10,000-25,000", frequency: "Annual", description: "Licensed veterinarians for medical guidance" },
      { item: "HIPAA Compliance Consultant", cost: "$5,000-15,000", frequency: "Annual", description: "Pet health data protection compliance" },
      { item: "SOC2 Type II Audit", cost: "$15,000-35,000", frequency: "Annual", description: "Security and availability compliance audit" },
      { item: "FDA Consultation", cost: "$10,000-30,000", frequency: "One-time", description: "Medical device classification guidance" },
      { item: "State Licensing (if required)", cost: "$500-2,000", frequency: "Annual per state", description: "Professional service licensing" },
      { item: "Insurance Coverage", cost: "$5,000-15,000", frequency: "Annual", description: "Professional liability, data breach insurance" }
    ]
  };

  const totalMonthlyCosts = {
    minimum: 35000,
    realistic: 65000,
    scaled: 120000
  };

  const fundingStages = [
    {
      stage: "Pre-Seed / Bootstrap",
      amount: "$50K - $250K",
      duration: "6-12 months",
      focus: "MVP development, initial team, market validation",
      team: "2-4 people (founders + 1-2 developers)"
    },
    {
      stage: "Seed Round",
      amount: "$500K - $2M",
      duration: "12-18 months", 
      focus: "Product development, user acquisition, core team",
      team: "5-10 people across development, marketing, operations"
    },
    {
      stage: "Series A",
      amount: "$2M - $10M",
      duration: "18-36 months",
      focus: "Scale operations, marketing, regulatory compliance",
      team: "15-25 people across all departments"
    }
  ];

  // Export functions
  const exportToCSV = () => {
    let csvContent = "Category,Item,Cost,Frequency,Description\n";
    
    // Add all cost categories to CSV
    Object.entries(operationalCosts).forEach(([category, costs]) => {
      costs.forEach(cost => {
        const row = `"${category}","${cost.item}","${cost.cost}","${cost.frequency}","${cost.description}"\n`;
        csvContent += row;
      });
    });
    
    // Add funding stages
    csvContent += "\n\nFunding Stage,Amount,Duration,Team Size,Focus\n";
    fundingStages.forEach(stage => {
      const row = `"${stage.stage}","${stage.amount}","${stage.duration}","${stage.team}","${stage.focus}"\n`;
      csvContent += row;
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'pet-care-ai-business-operations.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    // Create Excel-compatible HTML table
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Pet Care AI Business Operations</title>
        <style>
          table { border-collapse: collapse; width: 100%; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          h1 { color: #2c3e50; }
          h2 { color: #34495e; margin-top: 30px; }
          h3 { color: #7f8c8d; }
        </style>
      </head>
      <body>
        <h1>Pet Care AI Business Operations Cost Breakdown</h1>
        <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h2>Monthly Cost Summary</h2>
        <table>
          <tr><th>Operation Level</th><th>Monthly Cost</th><th>Description</th></tr>
          <tr><td>Minimum Viable Operations</td><td>$${totalMonthlyCosts.minimum.toLocaleString()}</td><td>Small team, basic infrastructure</td></tr>
          <tr><td>Realistic Operations</td><td>$${totalMonthlyCosts.realistic.toLocaleString()}</td><td>Full team, proper compliance</td></tr>
          <tr><td>Scaled Operations</td><td>$${totalMonthlyCosts.scaled.toLocaleString()}</td><td>Growth mode, full marketing</td></tr>
        </table>
        
        <h2>Funding Requirements</h2>
        <table>
          <tr><th>Stage</th><th>Amount</th><th>Duration</th><th>Team Size</th><th>Focus</th></tr>
    `;
    
    fundingStages.forEach(stage => {
      htmlContent += `<tr><td>${stage.stage}</td><td>${stage.amount}</td><td>${stage.duration}</td><td>${stage.team}</td><td>${stage.focus}</td></tr>`;
    });
    
    htmlContent += `</table><h2>Detailed Cost Breakdown</h2>`;
    
    // Add detailed costs
    Object.entries(operationalCosts).forEach(([category, costs]) => {
      htmlContent += `<h3>${category.charAt(0).toUpperCase() + category.slice(1)} Costs</h3>`;
      htmlContent += `<table><tr><th>Item</th><th>Cost</th><th>Frequency</th><th>Description</th></tr>`;
      costs.forEach(cost => {
        htmlContent += `<tr><td>${cost.item}</td><td>${cost.cost}</td><td>${cost.frequency}</td><td>${cost.description}</td></tr>`;
      });
      htmlContent += `</table><br>`;
    });
    
    htmlContent += `
        <h2>Summary</h2>
        <p><strong>Total Categories:</strong> ${Object.keys(operationalCosts).length}</p>
        <p><strong>Total Line Items:</strong> ${Object.values(operationalCosts).reduce((sum, costs) => sum + costs.length, 0)}</p>
        <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </body></html>`;
    
    // Create and download Excel file
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'pet-care-ai-business-operations.xls');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const exportData = {
      generatedOn: new Date().toISOString(),
      company: "Pet Care AI",
      reportType: "Business Operations Cost Breakdown",
      monthlyCostSummary: totalMonthlyCosts,
      fundingStages: fundingStages,
      operationalCosts: operationalCosts,
      summary: {
        totalCategories: Object.keys(operationalCosts).length,
        totalLineItems: Object.values(operationalCosts).reduce((sum, costs) => sum + costs.length, 0)
      }
    };
    
    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'pet-care-ai-business-operations.json');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Pet Care AI Business Operations</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Complete guide to running a Pet Care AI company - costs, requirements, and operational needs
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button onClick={exportToCSV} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
              <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Excel
              </Button>
              <Button onClick={() => exportToJSON()} variant="secondary" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download JSON
              </Button>
            </div>
          </div>

          {/* Download Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Download Business Operations Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">CSV Format</div>
                  <p className="text-sm text-muted-foreground mt-2">Spreadsheet compatible</p>
                  <p className="text-xs text-muted-foreground">Opens in Excel, Sheets, Numbers</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">Excel Format</div>
                  <p className="text-sm text-muted-foreground mt-2">Formatted tables & styling</p>
                  <p className="text-xs text-muted-foreground">Professional presentation ready</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">JSON Format</div>
                  <p className="text-sm text-muted-foreground mt-2">Developer & API friendly</p>
                  <p className="text-xs text-muted-foreground">Structured data for integration</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  All formats include complete cost breakdown, funding requirements, and business timeline
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Cost Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Monthly Operating Cost Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">${totalMonthlyCosts.minimum.toLocaleString()}</p>
                  <p className="text-sm text-green-600">Minimum Viable Operations</p>
                  <p className="text-xs text-muted-foreground">Small team, basic infrastructure</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">${totalMonthlyCosts.realistic.toLocaleString()}</p>
                  <p className="text-sm text-blue-600">Realistic Operations</p>
                  <p className="text-xs text-muted-foreground">Full team, proper compliance</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-700">${totalMonthlyCosts.scaled.toLocaleString()}</p>
                  <p className="text-sm text-purple-600">Scaled Operations</p>
                  <p className="text-xs text-muted-foreground">Growth mode, full marketing</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funding Stages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Funding Requirements by Stage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {fundingStages.map((stage, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-2">{stage.stage}</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Amount:</span> {stage.amount}</p>
                      <p><span className="font-medium">Runway:</span> {stage.duration}</p>
                      <p><span className="font-medium">Team Size:</span> {stage.team}</p>
                      <p><span className="font-medium">Focus:</span> {stage.focus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Cost Breakdown */}
          <Tabs defaultValue="legal" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
              <TabsTrigger value="legal">Legal</TabsTrigger>
              <TabsTrigger value="taxes">Taxes</TabsTrigger>
              <TabsTrigger value="development">Development</TabsTrigger>
              <TabsTrigger value="infrastructure">IT/Cloud</TabsTrigger>
              <TabsTrigger value="thirdParty">3rd Party</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
            </TabsList>

            <TabsContent value="legal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Legal & Compliance Costs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {operationalCosts.legal.map((cost, index) => (
                      <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{cost.item}</h4>
                          <div className="text-right">
                            <Badge variant="outline">{cost.cost}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{cost.frequency}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{cost.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="taxes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Tax & Accounting Obligations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {operationalCosts.taxes.map((cost, index) => (
                      <div key={index} className="border-l-4 border-orange-500 pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{cost.item}</h4>
                          <div className="text-right">
                            <Badge variant="outline">{cost.cost}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{cost.frequency}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{cost.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="development">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Development Team & Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {operationalCosts.development.map((cost, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{cost.item}</h4>
                          <div className="text-right">
                            <Badge variant="outline">{cost.cost}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{cost.frequency}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{cost.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="infrastructure">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    IT Infrastructure & Cloud Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {operationalCosts.infrastructure.map((cost, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{cost.item}</h4>
                          <div className="text-right">
                            <Badge variant="outline">{cost.cost}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{cost.frequency}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{cost.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="thirdParty">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Third Party Services & APIs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {operationalCosts.thirdParty.map((cost, index) => (
                      <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{cost.item}</h4>
                          <div className="text-right">
                            <Badge variant="outline">{cost.cost}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{cost.frequency}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{cost.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="marketing">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    Marketing & Customer Acquisition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {operationalCosts.marketing.map((cost, index) => (
                      <div key={index} className="border-l-4 border-pink-500 pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{cost.item}</h4>
                          <div className="text-right">
                            <Badge variant="outline">{cost.cost}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{cost.frequency}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{cost.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="operations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Operations & Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {operationalCosts.operations.map((cost, index) => (
                      <div key={index} className="border-l-4 border-teal-500 pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{cost.item}</h4>
                          <div className="text-right">
                            <Badge variant="outline">{cost.cost}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{cost.frequency}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{cost.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Additional Compliance Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Regulatory & Compliance Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operationalCosts.compliance.map((cost, index) => (
                  <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{cost.item}</h4>
                      <div className="text-right">
                        <Badge variant="outline">{cost.cost}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{cost.frequency}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{cost.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Milestones & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Business Milestones Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium">Months 0-6: Foundation</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                    <li>Business registration and legal structure</li>
                    <li>MVP development and core team hiring</li>
                    <li>Initial veterinary advisory board</li>
                    <li>Basic compliance framework setup</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium">Months 6-12: Product Launch</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                    <li>Full product development and testing</li>
                    <li>App store approval and launch</li>
                    <li>Initial marketing campaigns</li>
                    <li>User acquisition and feedback loop</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium">Months 12-24: Scale & Growth</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                    <li>Series A fundraising</li>
                    <li>Team expansion across all departments</li>
                    <li>Advanced features and AI capabilities</li>
                    <li>Enterprise partnerships with veterinary clinics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}