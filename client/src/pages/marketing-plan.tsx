import { useState, useCallback, useRef } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import html2pdf from "html2pdf.js";
import {
  Activity,
  Award,
  BarChart2,
  Bot,
  BrainCircuit,
  Calendar,
  Camera,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Gift,
  Image,
  LineChart,
  Lock,
  MapPin,
  Megaphone,
  MessageCircle,
  Palette,
  PawPrint,
  PenTool,
  Search,
  SearchCode,
  Settings,
  ShieldAlert,
  Smartphone,
  Star,
  Stethoscope,
  Target,
  Terminal,
  User,
  Users,
  Zap,
  ArrowUpRight
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export default function MarketingPlanPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleLogin = useCallback(() => {
    if (password === "P@tcare786#") {
      setIsAuthenticated(true);
      setError(false);
      toast({
        title: "Access Granted",
        description: "Welcome to the PetCare AI Marketing Plan",
        variant: "default",
      });
    } else {
      setError(true);
      toast({
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
  }, [password, toast]);
  
  const handleDownloadPDF = useCallback(() => {
    if (!contentRef.current) return;
    
    setIsDownloading(true);
    toast({
      title: "Preparing Download",
      description: "Converting marketing plan to PDF format...",
    });
    
    const options = {
      margin: 10,
      filename: 'PetCare_AI_Marketing_Plan.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        // These settings help ensure the entire document is captured
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        logging: true,
        letterRendering: true,
        allowTaint: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    try {
      // Find all tab triggers and get the currently selected one
      const activeTab = document.querySelector('.tabs-trigger[data-state="active"]');
      const activeTabValue = activeTab ? activeTab.getAttribute('data-value') : 'overview';
      
      // Get all TabsTrigger elements
      const tabTriggers = Array.from(document.querySelectorAll('.tabs-trigger'));
      
      // For each tab, click it to ensure its content is rendered, then restore the active tab
      Promise.all(
        tabTriggers.map(tab => {
          return new Promise<void>(resolve => {
            const tabValue = tab.getAttribute('data-value');
            if (tabValue) {
              (tab as HTMLElement).click();
              // Give time for the tab to render
              setTimeout(resolve, 100);
            } else {
              resolve();
            }
          });
        })
      ).then(() => {
        // Restore the active tab
        const tabToActivate = document.querySelector(`.tabs-trigger[data-value="${activeTabValue}"]`);
        if (tabToActivate) {
          (tabToActivate as HTMLElement).click();
        }
        
        // Clone the content after all tabs have been rendered
        if (!contentRef.current) return;
        const contentClone = contentRef.current.cloneNode(true) as HTMLElement;
        
        // Find and remove unwanted elements
        const lockButton = contentClone.querySelector('button[aria-label="Lock Access"]');
        if (lockButton && lockButton.parentNode) {
          lockButton.parentNode.removeChild(lockButton);
        }
        
        // Remove download buttons/dropdowns
        const dropdowns = contentClone.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(dropdown => {
          if (dropdown.parentNode) {
            dropdown.parentNode.removeChild(dropdown);
          }
        });
        
        // Convert and download
        html2pdf()
          .set(options)
          .from(contentClone)
          .save()
          .then(() => {
            setIsDownloading(false);
            toast({
              title: "Download Complete",
              description: "Marketing plan PDF has been downloaded successfully!",
              variant: "default",
            });
          })
          .catch((error: Error) => {
            console.error("PDF generation error:", error);
            setIsDownloading(false);
            toast({
              title: "Download Failed",
              description: "There was an error creating the PDF. Please try again.",
              variant: "destructive",
            });
          });
      });
    } catch (error) {
      console.error("PDF preparation error:", error);
      setIsDownloading(false);
      toast({
        title: "Download Failed",
        description: "There was an error preparing the PDF. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  const handleDownloadHTML = useCallback(() => {
    if (!contentRef.current) return;
    
    setIsDownloading(true);
    toast({
      title: "Preparing Download",
      description: "Converting marketing plan to HTML format...",
    });
    
    try {
      // Find all tab triggers and get the currently selected one
      const activeTab = document.querySelector('.tabs-trigger[data-state="active"]');
      const activeTabValue = activeTab ? activeTab.getAttribute('data-value') : 'overview';
      
      // Get all TabsTrigger elements
      const tabTriggers = Array.from(document.querySelectorAll('.tabs-trigger'));
      
      // For each tab, click it to ensure its content is rendered, then restore the active tab
      Promise.all(
        tabTriggers.map(tab => {
          return new Promise<void>(resolve => {
            const tabValue = tab.getAttribute('data-value');
            if (tabValue) {
              (tab as HTMLElement).click();
              // Give time for the tab to render
              setTimeout(resolve, 100);
            } else {
              resolve();
            }
          });
        })
      ).then(() => {
        // Restore the active tab
        const tabToActivate = document.querySelector(`.tabs-trigger[data-value="${activeTabValue}"]`);
        if (tabToActivate) {
          (tabToActivate as HTMLElement).click();
        }
        
        // Clone the content div after all tabs have been rendered
        if (!contentRef.current) return;
        const contentClone = contentRef.current.cloneNode(true) as HTMLElement;
        
        // Find and remove unwanted elements
        const lockButton = contentClone.querySelector('button[aria-label="Lock Access"]');
        if (lockButton && lockButton.parentNode) {
          lockButton.parentNode.removeChild(lockButton);
        }
        
        // Remove download buttons/dropdowns
        const dropdowns = contentClone.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(dropdown => {
          if (dropdown.parentNode) {
            dropdown.parentNode.removeChild(dropdown);
          }
        });
        
        // Create basic HTML document with enhanced styling
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>PetCare AI Marketing Plan</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                margin: 0; 
                padding: 20px; 
                color: #333;
                line-height: 1.5;
              }
              h1 { 
                color: #0070f3; 
                font-size: 2.5rem;
                margin-bottom: 0.5rem;
              }
              h2 { 
                color: #0070f3; 
                font-size: 1.8rem; 
                margin-top: 2rem;
              }
              h3 { 
                font-size: 1.4rem; 
                margin-top: 1.5rem;
                color: #444;
              }
              table { 
                border-collapse: collapse; 
                width: 100%; 
                margin: 15px 0; 
                border: 1px solid #ddd;
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 10px; 
                text-align: left; 
              }
              th { 
                background-color: #f4f4f4; 
                font-weight: 600;
              }
              .container { 
                max-width: 1200px; 
                margin: 0 auto; 
                background: white;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                border-radius: 8px;
              }
              .card { 
                border: 1px solid #eaeaea; 
                border-radius: 5px; 
                padding: 20px; 
                margin-bottom: 20px;
                background: white;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              p {
                margin: 0.75rem 0;
              }
              ul {
                padding-left: 1.5rem;
              }
              li {
                margin-bottom: 0.5rem;
              }
              .text-green { color: #16a34a; }
              .text-red { color: #dc2626; }
              .text-yellow { color: #ca8a04; }
              .badge {
                display: inline-block;
                padding: 0.25rem 0.5rem;
                font-size: 0.75rem;
                font-weight: 600;
                line-height: 1;
                border-radius: 9999px;
                background-color: #e9eef6;
                color: #3b82f6;
                margin-right: 0.5rem;
              }
              .mb-4 { margin-bottom: 1rem; }
              .grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
              }
              @media (max-width: 768px) {
                .grid {
                  grid-template-columns: 1fr;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              ${contentClone.innerHTML}
            </div>
          </body>
          </html>
        `;
        
        // Create a Blob with the HTML content
        const blob = new Blob([html], { type: 'text/html' });
        
        // Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'PetCare_AI_Marketing_Plan.html';
        
        // Trigger the download
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setIsDownloading(false);
          toast({
            title: "Download Complete",
            description: "Marketing plan HTML has been downloaded successfully!",
            variant: "default",
          });
        }, 100);
      });
    } catch (error) {
      console.error("HTML generation error:", error);
      setIsDownloading(false);
      toast({
        title: "Download Failed",
        description: "There was an error creating the HTML file. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Header />
        <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg border">
          <div className="flex flex-col items-center text-center mb-6">
            <Lock className="h-12 w-12 text-primary mb-2" />
            <h1 className="text-2xl font-bold">Restricted Access</h1>
            <p className="text-muted-foreground mt-1">
              Please enter your password to access the marketing plan
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                Incorrect password. Please try again.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleLogin}
            >
              Access Marketing Plan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-5xl mx-auto px-4 py-8" ref={contentRef}>
        <div className="space-y-2 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">iOS Marketing Strategy</h1>
            <Button 
              variant="outline" 
              onClick={() => setIsAuthenticated(false)}
              size="sm"
              aria-label="Lock Access"
            >
              <Lock className="h-4 w-4 mr-2" />
              Lock Access
            </Button>
          </div>
          <p className="text-xl text-muted-foreground">
            Comprehensive marketing plan for PetCare AI on the Apple App Store
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-11 h-auto">
            <TabsTrigger value="overview" className="py-3 tabs-trigger">Overview</TabsTrigger>
            <TabsTrigger value="target-audience" className="py-3 tabs-trigger">Target Audience</TabsTrigger>
            <TabsTrigger value="strategies" className="py-3 tabs-trigger">Strategies</TabsTrigger>
            <TabsTrigger value="timeline" className="py-3 tabs-trigger">Timeline</TabsTrigger>
            <TabsTrigger value="metrics" className="py-3 tabs-trigger">Metrics</TabsTrigger>
            <TabsTrigger value="ai-tools" className="py-3 tabs-trigger">AI Tools</TabsTrigger>
            <TabsTrigger value="market-analysis" className="py-3 tabs-trigger">Market Analysis</TabsTrigger>
            <TabsTrigger value="ios-targeting" className="py-3 tabs-trigger">iOS Targeting</TabsTrigger>
            <TabsTrigger value="adoption-sources" className="py-3 tabs-trigger">Adoption Sources</TabsTrigger>
            <TabsTrigger value="competitors" className="py-3 tabs-trigger">Competitors</TabsTrigger>
            <TabsTrigger value="future-features" className="py-3 tabs-trigger">Future Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
                <CardDescription>
                  Key aspects of the PetCare AI marketing strategy for iOS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">App Value Proposition</h3>
                  <p className="text-muted-foreground">
                    PetCare AI is the most comprehensive AI-powered pet care solution that combines intelligent health monitoring, personalized training programs, and real-time injury assessment to provide pet owners with everything they need to ensure their pets' health and happiness in one intuitive iOS application.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Marketing Goals</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Achieve 100,000 downloads within the first 3 months of launch</li>
                    <li>Reach a 4.5+ star rating on the App Store with at least 5,000 reviews</li>
                    <li>Attain a 13.07% conversion rate leveraging Google Ads pet industry benchmarks</li>
                    <li>Establish PetCare AI as the leading pet care app in the App Store's Lifestyle category</li>
                    <li>Build an engaged community leveraging 5-7% pet influencer engagement rates (vs 2.4% human average)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Competitive Positioning</h3>
                  <div className="relative overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted">
                        <tr>
                          <th scope="col" className="px-6 py-3">Feature</th>
                          <th scope="col" className="px-6 py-3">PetCare AI</th>
                          <th scope="col" className="px-6 py-3">Competitors</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">AI-Powered Analysis</td>
                          <td className="px-6 py-4 text-green-500">Advanced</td>
                          <td className="px-6 py-4 text-yellow-500">Basic/None</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">Injury Scanner</td>
                          <td className="px-6 py-4 text-green-500">Yes</td>
                          <td className="px-6 py-4 text-red-500">No</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">Training Guides</td>
                          <td className="px-6 py-4 text-green-500">Interactive</td>
                          <td className="px-6 py-4 text-yellow-500">Static</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-6 py-4 font-medium">Data Integration</td>
                          <td className="px-6 py-4 text-green-500">Comprehensive</td>
                          <td className="px-6 py-4 text-yellow-500">Limited</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium">Health Emergency</td>
                          <td className="px-6 py-4 text-green-500">Real-time</td>
                          <td className="px-6 py-4 text-red-500">None</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Marketing Budget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">$150,000</p>
                  <p className="text-sm text-muted-foreground">Total budget for 12-month campaign</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>User Acquisition</span>
                      <span className="font-medium">$80,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Content Creation</span>
                      <span className="font-medium">$30,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Influencer Marketing</span>
                      <span className="font-medium">$25,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>PR & Events</span>
                      <span className="font-medium">$15,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    Revenue Projection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">$1.2M</p>
                  <p className="text-sm text-muted-foreground">First year projected revenue</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Premium Subscriptions</span>
                      <span className="font-medium">$900K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>In-App Purchases</span>
                      <span className="font-medium">$200K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Partnership Revenue</span>
                      <span className="font-medium">$100K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Key Success Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>User Acquisition</span>
                        <span className="font-medium">100K Downloads</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Retention (30 days)</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Premium Conversion</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "20%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="target-audience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Primary Audience Segments</CardTitle>
                <CardDescription>
                  Detailed profile of key user segments for targeted marketing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Tech-Savvy Pet Parents</CardTitle>
                      <Badge className="mt-2">Primary Segment</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Demographics</h4>
                        <p className="text-sm text-muted-foreground">
                          25-40 years old, high income ($75K+), urban/suburban, professionals
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Pain Points</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                          <li>Limited time for pet care research</li>
                          <li>Anxiety about pet health</li>
                          <li>Desire for data-driven care</li>
                          <li>Need for all-in-one solutions</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Key Motivators</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                          <li>Cutting-edge technology</li>
                          <li>Time-saving solutions</li>
                          <li>Premium personalized experiences</li>
                          <li>Social sharing of pet achievements</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Pet Health Enthusiasts</CardTitle>
                      <Badge className="mt-2" variant="outline">Secondary Segment</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Demographics</h4>
                        <p className="text-sm text-muted-foreground">
                          30-55 years old, middle income, suburban, health-conscious
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Pain Points</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                          <li>High vet costs</li>
                          <li>Concern over pet nutrition</li>
                          <li>Difficulty tracking health metrics</li>
                          <li>Lack of trustworthy health information</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Key Motivators</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                          <li>Preventative health solutions</li>
                          <li>Professional health recommendations</li>
                          <li>Health tracking capabilities</li>
                          <li>Expert medical content</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">New Pet Owners</CardTitle>
                      <Badge className="mt-2" variant="outline">Tertiary Segment</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Demographics</h4>
                        <p className="text-sm text-muted-foreground">
                          20-35 years old, various income levels, recently acquired first pet
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Pain Points</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                          <li>Overwhelmed by care requirements</li>
                          <li>Training challenges</li>
                          <li>Uncertainty about health signs</li>
                          <li>Need for guidance and validation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Key Motivators</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                          <li>Step-by-step guidance</li>
                          <li>Community support</li>
                          <li>Educational content</li>
                          <li>Entry-level pricing</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">User Journey Mapping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-muted"></div>
                      <ol className="relative space-y-6">
                        <li className="ml-12">
                          <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                            <span className="font-bold">1</span>
                          </div>
                          <h3 className="font-semibold">Awareness</h3>
                          <p className="text-muted-foreground mt-1">User discovers app through targeted ads, influencer content, or App Store discovery</p>
                          <div className="mt-2">
                            <Badge variant="outline" className="mr-2 mb-2">Social Media Ads</Badge>
                            <Badge variant="outline" className="mr-2 mb-2">Pet Influencers</Badge>
                            <Badge variant="outline" className="mr-2 mb-2">App Store Optimization</Badge>
                          </div>
                        </li>
                        
                        <li className="ml-12">
                          <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                            <span className="font-bold">2</span>
                          </div>
                          <h3 className="font-semibold">Consideration</h3>
                          <p className="text-muted-foreground mt-1">User evaluates app features, reads reviews, watches demo videos</p>
                          <div className="mt-2">
                            <Badge variant="outline" className="mr-2 mb-2">App Store Page</Badge>
                            <Badge variant="outline" className="mr-2 mb-2">Website Visit</Badge>
                            <Badge variant="outline" className="mr-2 mb-2">Demo Videos</Badge>
                          </div>
                        </li>
                        
                        <li className="ml-12">
                          <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                            <span className="font-bold">3</span>
                          </div>
                          <h3 className="font-semibold">Acquisition</h3>
                          <p className="text-muted-foreground mt-1">User downloads app and completes onboarding</p>
                          <div className="mt-2">
                            <Badge variant="outline" className="mr-2 mb-2">App Download</Badge>
                            <Badge variant="outline" className="mr-2 mb-2">Account Creation</Badge>
                            <Badge variant="outline" className="mr-2 mb-2">Pet Profile Setup</Badge>
                          </div>
                        </li>
                        
                        <li className="ml-12">
                          <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                            <span className="font-bold">4</span>
                          </div>
                          <h3 className="font-semibold">Activation</h3>
                          <p className="text-muted-foreground mt-1">User engages with core features and experiences "aha moment"</p>
                          <div className="mt-2">
                            <Badge variant="outline" className="mr-2 mb-2">AI Analysis</Badge>
                            <Badge variant="outline" className="mr-2 mb-2">Training Guide</Badge>
                            <Badge variant="outline" className="mr-2 mb-2">Injury Scan</Badge>
                          </div>
                        </li>
                        
                        <li className="ml-12">
                          <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                            <span className="font-bold">5</span>
                          </div>
                          <h3 className="font-semibold">Conversion</h3>
                          <p className="text-muted-foreground mt-1">User subscribes to premium plan or makes in-app purchases</p>
                          <div className="mt-2">
                            <Badge variant="outline" className="mr-2 mb-2">Subscription</Badge>
                            <Badge variant="outline" className="mr-2 mb-2">Feature Unlock</Badge>
                            <Badge variant="outline" className="mr-2 mb-2">In-App Purchase</Badge>
                          </div>
                        </li>
                        
                        <li className="ml-12">
                          <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                            <span className="font-bold">6</span>
                          </div>
                          <h3 className="font-semibold">Retention</h3>
                          <p className="text-muted-foreground mt-1">User establishes daily/weekly usage patterns with the app</p>
                          <div className="mt-2">
                            <Badge variant="outline" className="mr-2 mb-2">Daily Check-ins</Badge>
                            <Badge variant="outline" className="mr-2 mb-2">Push Notifications</Badge>
                            <Badge variant="outline" className="mr-2 mb-2">Feature Updates</Badge>
                          </div>
                        </li>
                        
                        <li className="ml-12">
                          <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                            <span className="font-bold">7</span>
                          </div>
                          <h3 className="font-semibold">Advocacy</h3>
                          <p className="text-muted-foreground mt-1">User shares achievements, writes reviews, and refers friends</p>
                          <div className="mt-2">
                            <Badge variant="outline" className="mr-2 mb-2">Social Sharing</Badge>
                            <Badge variant="outline" className="mr-2 mb-2">App Reviews</Badge>
                            <Badge variant="outline" className="mr-2 mb-2">Referral Program</Badge>
                          </div>
                        </li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    App Store Optimization
                  </CardTitle>
                  <CardDescription>
                    Maximizing visibility and conversions on iOS App Store
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">App Store Keywords</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[
                        "pet care", "AI pet", "dog training", "cat care", "pet health", 
                        "pet monitor", "vet care", "pet tracking", "pet grooming", 
                        "pet emergency", "pet analysis", "pet photo"
                      ].map((keyword) => (
                        <Badge key={keyword} variant="outline">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Localization Strategy</h4>
                    <p className="text-sm text-muted-foreground mb-2">Primary iOS markets targeted with localized App Store listings:</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>United States (English)</li>
                      <li>Canada (English, French)</li>
                      <li>United Kingdom (English)</li>
                      <li>Australia (English)</li>
                      <li>Japan (Japanese)</li>
                      <li>Germany (German)</li>
                      <li>France (French)</li>
                      <li>South Korea (Korean)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">App Store Screenshots</h4>
                    <p className="text-sm text-muted-foreground mb-2">High-impact visuals focusing on:</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>AI-powered pet analysis (core differentiation)</li>
                      <li>Injury scanner with treatment recommendations</li>
                      <li>Interactive training guides with progress tracking</li>
                      <li>Pet photo gallery with mood detection</li>
                      <li>Health assessment quiz with veterinary insights</li>
                      <li>Missing pet alert system with sharing capabilities</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                    User Acquisition Channels
                  </CardTitle>
                  <CardDescription>
                    Multi-channel strategy to drive iOS app installs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Performance Marketing</h4>
                    <p className="text-sm text-muted-foreground mb-2">Targeted digital advertising across platforms:</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Apple Search Ads (priority investment)</li>
                      <li>Meta Ads (Instagram, Facebook)</li>
                      <li>Google App Campaigns</li>
                      <li>TikTok For Business</li>
                      <li>Pinterest Ads (for pet enthusiast demographics)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Influencer Partnerships</h4>
                    <p className="text-sm text-muted-foreground mb-2">Collaborations with content creators:</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Pet influencers (@jiffpom 10.3M, @nala_cat 4.5M, @doug_the_pug 3.6M followers)</li>
                      <li>Veterinarians and pet health experts</li>
                      <li>Dog and cat trainers</li>
                      <li>Pet photographers for injury scanner demos</li>
                      <li>Pet parents with compelling stories</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Content Marketing</h4>
                    <p className="text-sm text-muted-foreground mb-2">Educational content strategy:</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>YouTube tutorial series on app features</li>
                      <li>Blog posts on pet health and technology</li>
                      <li>"Pet Tech" podcast partnerships</li>
                      <li>Guest articles in pet publications</li>
                      <li>Case studies of pet health emergencies prevented</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Community & Engagement
                  </CardTitle>
                  <CardDescription>
                    Building an active pet owner community
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Social Media Strategy</h4>
                    <p className="text-sm text-muted-foreground mb-2">Platform-specific content approaches:</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Instagram: #PetCareAI user-generated content, success stories</li>
                      <li>TikTok: Quick tips, app feature demos, pet transformations</li>
                      <li>Facebook: Community groups, Q&A sessions with experts</li>
                      <li>Pinterest: Training guides, care infographics, breed information</li>
                      <li>Twitter: Pet health news, tips, customer support</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Digital Events</h4>
                    <p className="text-sm text-muted-foreground mb-2">Virtual gatherings to build community:</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Monthly "Ask the Vet" live sessions</li>
                      <li>Virtual training workshops with professional trainers</li>
                      <li>Seasonal photo contests with premium subscriptions as prizes</li>
                      <li>Breed-specific meet-ups and discussions</li>
                      <li>Pet emergency preparedness seminars</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">User Feedback Loop</h4>
                    <p className="text-sm text-muted-foreground mb-2">Continuous improvement through user input:</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>In-app feedback mechanisms with rapid response</li>
                      <li>Beta testing program for new features</li>
                      <li>Quarterly user surveys with incentives</li>
                      <li>Feature request voting system</li>
                      <li>Customer advisory board for premium users</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-primary" />
                    PR & Partnerships
                  </CardTitle>
                  <CardDescription>
                    Building awareness through media and strategic alliances
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Media Relations</h4>
                    <p className="text-sm text-muted-foreground mb-2">Targeted press outreach:</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Tech publications (TechCrunch, Wired, CNET)</li>
                      <li>Pet industry media (Modern Dog, Catster, Pet Product News)</li>
                      <li>Health and lifestyle outlets</li>
                      <li>Local news for pet community stories</li>
                      <li>Podcast appearances on pet care and technology shows</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Industry Partnerships</h4>
                    <p className="text-sm text-muted-foreground mb-2">Strategic alliances to expand reach:</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Pet food brands for co-marketing initiatives</li>
                      <li>Veterinary networks for app recommendations</li>
                      <li>Pet insurance companies for premium user discounts</li>
                      <li>Pet retailer integrations (loyalty program tie-ins)</li>
                      <li>Animal shelters for adoption support features</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Awards & Recognition</h4>
                    <p className="text-sm text-muted-foreground mb-2">Industry validation targets:</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Apple Design Awards submission</li>
                      <li>Best App Store apps of the year campaign</li>
                      <li>Pet industry innovation awards</li>
                      <li>Mobile app excellence awards</li>
                      <li>AI implementation recognition</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Monetization Strategy
                </CardTitle>
                <CardDescription>
                  Multi-tiered approach to app revenue generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Subscription Tiers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm">Free Tier</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1 mt-1">
                          <li>Basic pet profile</li>
                          <li>Limited pet analysis</li>
                          <li>Basic training tips</li>
                          <li>Ad-supported experience</li>
                          <li>3 injury scans per month</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Premium ($9.99/month)</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1 mt-1">
                          <li>Advanced AI pet analysis</li>
                          <li>Unlimited injury scanning</li>
                          <li>Complete training program</li>
                          <li>Ad-free experience</li>
                          <li>Health assessment with recommendations</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Family Pack ($14.99/month)</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1 mt-1">
                          <li>All Premium features</li>
                          <li>Up to 5 pets</li>
                          <li>Family sharing</li>
                          <li>Priority vet consultation</li>
                          <li>Cross-device synchronization</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">In-App Purchases</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm">One-Time Purchases</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1 mt-1">
                          <li>Emergency Vet Consultation ($4.99)</li>
                          <li>Breed-Specific Training Pack ($3.99)</li>
                          <li>Custom Training Plan ($7.99)</li>
                          <li>Pet First Aid Guide ($2.99)</li>
                          <li>Pet Nutrition Analysis ($5.99)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Consumables</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1 mt-1">
                          <li>Extra Injury Scans (3 for $1.99)</li>
                          <li>Premium Pet Analysis ($0.99 each)</li>
                          <li>Advanced Photo Effects ($0.99)</li>
                          <li>Wellness Assessments ($2.99)</li>
                          <li>Training Video Packs ($1.99)</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Conversion Strategies</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm">Free-to-Premium</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1 mt-1">
                          <li>7-day free trial</li>
                          <li>First-time subscriber discount (40% off)</li>
                          <li>Feature preview with upgrade prompts</li>
                          <li>Limited-time seasonal promotions</li>
                          <li>Email nurture campaigns</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Retention Tactics</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1 mt-1">
                          <li>Annual subscription discount (save 20%)</li>
                          <li>Loyalty rewards (6-month subscribers)</li>
                          <li>Exclusive premium content</li>
                          <li>Partner discounts for subscribers</li>
                          <li>Win-back campaigns for churned users</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Launch & Growth Timeline
                </CardTitle>
                <CardDescription>
                  12-month strategic rollout plan for iOS app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="relative">
                    <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-muted"></div>
                    <ol className="relative space-y-10">
                      <li className="ml-12">
                        <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                          <span className="font-bold">1</span>
                        </div>
                        <h3 className="font-semibold">Pre-Launch Phase (Months 1-2)</h3>
                        <div className="mt-2 space-y-4">
                          <div>
                            <h4 className="text-sm font-medium">App Store Preparation</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                              <li>Finalize App Store listing assets</li>
                              <li>Keyword optimization research</li>
                              <li>Localization for primary markets</li>
                              <li>App preview video production</li>
                              <li>App Store screenshot creation</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">PR & Influencer Setup</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                              <li>Press kit development</li>
                              <li>Influencer outreach and contracting</li>
                              <li>Media embargo coordination</li>
                              <li>Early access program for reviewers</li>
                              <li>Press release drafting</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Soft Launch</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                              <li>Beta testing with 1,000 users</li>
                              <li>Feedback collection and app refinement</li>
                              <li>Performance optimization</li>
                              <li>Bug fixing and UX improvements</li>
                              <li>Analytics implementation</li>
                            </ul>
                          </div>
                        </div>
                      </li>
                      
                      <li className="ml-12">
                        <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                          <span className="font-bold">2</span>
                        </div>
                        <h3 className="font-semibold">Launch Phase (Month 3)</h3>
                        <div className="mt-2 space-y-4">
                          <div>
                            <h4 className="text-sm font-medium">Official Launch</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                              <li>App Store global release</li>
                              <li>Press release distribution</li>
                              <li>Launch day social media campaign</li>
                              <li>Coordinated influencer content drop</li>
                              <li>Apple featuring request submission</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Initial Paid Marketing</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                              <li>Apple Search Ads campaign launch</li>
                              <li>Meta Ads campaign activation</li>
                              <li>Google App Campaign initiation</li>
                              <li>Influencer content promotion</li>
                              <li>Launch promotions and incentives</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Community Building</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                              <li>Social media groups launch</li>
                              <li>User-generated content contests</li>
                              <li>Launch AMA (Ask Me Anything) session</li>
                              <li>Early adopter recognition program</li>
                              <li>Initial user testimonial collection</li>
                            </ul>
                          </div>
                        </div>
                      </li>
                      
                      <li className="ml-12">
                        <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                          <span className="font-bold">3</span>
                        </div>
                        <h3 className="font-semibold">Growth Phase (Months 4-6)</h3>
                        <div className="mt-2 space-y-4">
                          <div>
                            <h4 className="text-sm font-medium">Marketing Optimization</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                              <li>Paid channel performance analysis</li>
                              <li>Audience targeting refinement</li>
                              <li>Creative optimization based on data</li>
                              <li>Channel budget reallocation</li>
                              <li>ROI analysis and optimization</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Feature Releases</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                              <li>Bi-weekly app updates</li>
                              <li>New feature announcements</li>
                              <li>Content library expansion</li>
                              <li>User-requested improvements</li>
                              <li>Performance enhancements</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Partnership Expansion</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                              <li>Veterinary network integration</li>
                              <li>Pet food brand co-marketing campaign</li>
                              <li>Influencer program scaling</li>
                              <li>Pet retailer collaborations</li>
                              <li>Cross-promotion opportunities</li>
                            </ul>
                          </div>
                        </div>
                      </li>
                      
                      <li className="ml-12">
                        <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                          <span className="font-bold">4</span>
                        </div>
                        <h3 className="font-semibold">Optimization Phase (Months 7-9)</h3>
                        <div className="mt-2 space-y-4">
                          <div>
                            <h4 className="text-sm font-medium">User Retention Focus</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                              <li>Churn analysis and prevention</li>
                              <li>Engagement feature development</li>
                              <li>User feedback implementation</li>
                              <li>Loyalty program launch</li>
                              <li>Re-engagement campaigns</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Conversion Optimization</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                              <li>Subscription funnel improvement</li>
                              <li>A/B testing of pricing and offers</li>
                              <li>Premium feature showcase enhancement</li>
                              <li>Promotional campaign optimization</li>
                              <li>User behavior analysis</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Market Expansion</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                              <li>Secondary market localization</li>
                              <li>Regional feature adaptations</li>
                              <li>Local influencer partnerships</li>
                              <li>Region-specific promotions</li>
                              <li>Cultural adaptation of marketing</li>
                            </ul>
                          </div>
                        </div>
                      </li>
                      
                      <li className="ml-12">
                        <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                          <span className="font-bold">5</span>
                        </div>
                        <h3 className="font-semibold">Scaling Phase (Months 10-12)</h3>
                        <div className="mt-2 space-y-4">
                          <div>
                            <h4 className="text-sm font-medium">Major Feature Launch</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                              <li>Version 2.0 release with new capabilities</li>
                              <li>Enhanced AI analysis features</li>
                              <li>Expanded training program library</li>
                              <li>New premium subscription tiers</li>
                              <li>Community features expansion</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Growth Acceleration</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                              <li>Marketing budget increase</li>
                              <li>Viral marketing campaign launch</li>
                              <li>Referral program optimization</li>
                              <li>Holiday season promotions</li>
                              <li>App awards application campaign</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">First-Year Evaluation</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                              <li>Comprehensive performance analysis</li>
                              <li>User research for future roadmap</li>
                              <li>ROI assessment across initiatives</li>
                              <li>Second-year strategy development</li>
                              <li>Team expansion planning</li>
                            </ul>
                          </div>
                        </div>
                      </li>
                    </ol>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    Key Performance Indicators
                  </CardTitle>
                  <CardDescription>
                    Primary metrics to track success
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">User Acquisition Metrics</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                        <li>
                          <div className="flex justify-between">
                            <span>Downloads</span>
                            <span className="font-medium">Target: 100K in 3 months</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Cost Per Install (CPI)</span>
                            <span className="font-medium">Target: $2.58</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>App Store Conversion Rate</span>
                            <span className="font-medium">Target: 67.2%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Organic vs. Paid Ratio</span>
                            <span className="font-medium">Target: 40:60</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "50%" }}></div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Engagement Metrics</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                        <li>
                          <div className="flex justify-between">
                            <span>Daily Active Users (DAU)</span>
                            <span className="font-medium">Target: 25K</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "55%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Average Session Duration</span>
                            <span className="font-medium">Target: 7 minutes</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Feature Adoption Rate</span>
                            <span className="font-medium">Target: 70%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Retention Rate (D30)</span>
                            <span className="font-medium">Target: 45%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "35%" }}></div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Monetization Metrics</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                        <li>
                          <div className="flex justify-between">
                            <span>Conversion to Premium</span>
                            <span className="font-medium">Target: 20%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "30%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Average Revenue Per User</span>
                            <span className="font-medium">Target: $5.50</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Subscription Renewal Rate</span>
                            <span className="font-medium">Target: 80%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Customer Lifetime Value</span>
                            <span className="font-medium">Target: $75</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "50%" }}></div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Marketing Effectiveness
                  </CardTitle>
                  <CardDescription>
                    Measuring campaign performance and ROI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Campaign Performance</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                        <li>
                          <div className="flex justify-between">
                            <span>Click-Through Rate (CTR)</span>
                            <span className="font-medium">Target: 3.2%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "55%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Conversion Rate</span>
                            <span className="font-medium">Target: 15%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Cost Per Acquisition</span>
                            <span className="font-medium">Target: $5.00</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Return On Ad Spend</span>
                            <span className="font-medium">Target: 300%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Channel Effectiveness</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                        <li>
                          <div className="flex justify-between">
                            <span>Apple Search Ads</span>
                            <span className="font-medium">Target: 40% of Installs</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "50%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Social Media Ads</span>
                            <span className="font-medium">Target: 30% of Installs</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "35%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Influencer Marketing</span>
                            <span className="font-medium">Target: 20% of Installs</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Content Marketing</span>
                            <span className="font-medium">Target: 10% of Installs</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "15%" }}></div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Brand Metrics</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                        <li>
                          <div className="flex justify-between">
                            <span>App Store Rating</span>
                            <span className="font-medium">Target: 4.5+</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Brand Sentiment</span>
                            <span className="font-medium">Target: 80% Positive</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "70%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Social Media Engagement</span>
                            <span className="font-medium">Target: 5% Rate</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                          </div>
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Net Promoter Score</span>
                            <span className="font-medium">Target: 45+</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "55%" }}></div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Success Criteria
                  </CardTitle>
                  <CardDescription>
                    Defining what success looks like for the iOS app launch
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">3-Month Goals</CardTitle>
                          <Star className="h-5 w-5 text-yellow-500" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-3">
                          <li className="flex items-start">
                            <Badge className="mt-1 mr-2 h-2 w-2 p-0 rounded-full bg-yellow-500" />
                            <span>100,000 app downloads across iOS devices</span>
                          </li>
                          <li className="flex items-start">
                            <Badge className="mt-1 mr-2 h-2 w-2 p-0 rounded-full bg-yellow-500" />
                            <span>4.4+ App Store rating with 1,000+ reviews</span>
                          </li>
                          <li className="flex items-start">
                            <Badge className="mt-1 mr-2 h-2 w-2 p-0 rounded-full bg-yellow-500" />
                            <span>15% conversion to premium subscription</span>
                          </li>
                          <li className="flex items-start">
                            <Badge className="mt-1 mr-2 h-2 w-2 p-0 rounded-full bg-yellow-500" />
                            <span>40% D30 retention rate (above industry average)</span>
                          </li>
                          <li className="flex items-start">
                            <Badge className="mt-1 mr-2 h-2 w-2 p-0 rounded-full bg-yellow-500" />
                            <span>Featured in pet industry publications</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">6-Month Goals</CardTitle>
                          <Star className="h-5 w-5 text-yellow-500" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-3">
                          <li className="flex items-start">
                            <Badge className="mt-1 mr-2 h-2 w-2 p-0 rounded-full bg-yellow-500" />
                            <span>250,000 total app downloads</span>
                          </li>
                          <li className="flex items-start">
                            <Badge className="mt-1 mr-2 h-2 w-2 p-0 rounded-full bg-yellow-500" />
                            <span>4.6+ App Store rating with 3,000+ reviews</span>
                          </li>
                          <li className="flex items-start">
                            <Badge className="mt-1 mr-2 h-2 w-2 p-0 rounded-full bg-yellow-500" />
                            <span>18% conversion to premium subscription</span>
                          </li>
                          <li className="flex items-start">
                            <Badge className="mt-1 mr-2 h-2 w-2 p-0 rounded-full bg-yellow-500" />
                            <span>Leverage $24B pet influencer industry with 2M pet accounts</span>
                          </li>
                          <li className="flex items-start">
                            <Badge className="mt-1 mr-2 h-2 w-2 p-0 rounded-full bg-yellow-500" />
                            <span>5 strategic industry partnerships established</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">12-Month Goals</CardTitle>
                          <Star className="h-5 w-5 text-yellow-500" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-3">
                          <li className="flex items-start">
                            <Badge className="mt-1 mr-2 h-2 w-2 p-0 rounded-full bg-yellow-500" />
                            <span>500,000+ total app downloads</span>
                          </li>
                          <li className="flex items-start">
                            <Badge className="mt-1 mr-2 h-2 w-2 p-0 rounded-full bg-yellow-500" />
                            <span>20% conversion to premium plan</span>
                          </li>
                          <li className="flex items-start">
                            <Badge className="mt-1 mr-2 h-2 w-2 p-0 rounded-full bg-yellow-500" />
                            <span>$1.2M in annual recurring revenue</span>
                          </li>
                          <li className="flex items-start">
                            <Badge className="mt-1 mr-2 h-2 w-2 p-0 rounded-full bg-yellow-500" />
                            <span>Top 10 position in Lifestyle category</span>
                          </li>
                          <li className="flex items-start">
                            <Badge className="mt-1 mr-2 h-2 w-2 p-0 rounded-full bg-yellow-500" />
                            <span>Industry recognition award achievement</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-tools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  AI-Powered Marketing Strategy
                </CardTitle>
                <CardDescription>
                  Leveraging artificial intelligence to maximize marketing efficiency and ROI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Strategic AI Implementation Plan</h3>
                  <p className="text-muted-foreground mb-6">
                    Our marketing strategy capitalizes on cutting-edge AI technologies to enhance every aspect of the PetCare AI app's marketing lifecycle. This AI-first approach will allow for more personalized, data-driven, and efficient marketing campaigns while reducing costs and increasing conversion rates.
                  </p>
                  
                  <div className="relative">
                    <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-muted"></div>
                    <ol className="relative space-y-8">
                      <li className="ml-12">
                        <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                          <span className="font-bold">1</span>
                        </div>
                        <h3 className="font-semibold text-lg">Market Research & Audience Analysis</h3>
                        <div className="mt-2 space-y-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <Bot className="h-4 w-4 text-primary" />
                                AI Tools & Implementation
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Tools & Technologies</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Tool</TableHead>
                                        <TableHead>Purpose</TableHead>
                                        <TableHead>Implementation Timeline</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="font-medium">BrandMentions AI</TableCell>
                                        <TableCell>Analyze pet owner conversations across social platforms to identify trending topics and pain points</TableCell>
                                        <TableCell>Pre-launch (Month 1)</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">SocialScan NLP</TableCell>
                                        <TableCell>Sentiment analysis of competitor app reviews to understand gaps in the market</TableCell>
                                        <TableCell>Pre-launch (Month 1)</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">MarketPulse AI</TableCell>
                                        <TableCell>Predictive analysis of pet care market trends and consumer behavior</TableCell>
                                        <TableCell>Pre-launch (Month 2)</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">Audiense Connect</TableCell>
                                        <TableCell>AI-powered audience segmentation and psychographic profiling</TableCell>
                                        <TableCell>Pre-launch (Month 2)</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Step-by-Step Implementation</h4>
                                  <ul className="list-decimal pl-5 space-y-2">
                                    <li>Deploy BrandMentions AI to analyze 100,000+ social media conversations about pet care</li>
                                    <li>Use SocialScan NLP to extract key themes from 25,000+ competitor app reviews</li>
                                    <li>Feed pet industry trend data into MarketPulse AI for predictive modeling</li>
                                    <li>Create detailed audience personas using Audiense Connect's AI clustering</li>
                                    <li>Validate findings with focus groups consisting of high-value audience segments</li>
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Expected Outcomes</h4>
                                  <div className="flex gap-2 flex-wrap">
                                    <Badge variant="outline">5 distinct persona profiles</Badge>
                                    <Badge variant="outline">20+ content themes</Badge>
                                    <Badge variant="outline">3 unique value propositions</Badge>
                                    <Badge variant="outline">10 keyword clusters</Badge>
                                    <Badge variant="outline">Market trend predictions</Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </li>

                      <li className="ml-12">
                        <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                          <span className="font-bold">2</span>
                        </div>
                        <h3 className="font-semibold text-lg">Content Creation & Optimization</h3>
                        <div className="mt-2 space-y-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                AI Tools & Implementation
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Tools & Technologies</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Tool</TableHead>
                                        <TableHead>Purpose</TableHead>
                                        <TableHead>Implementation Timeline</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="font-medium">GPT-4o</TableCell>
                                        <TableCell>Generate App Store descriptions, social copy, and blog content tailored to audience segments</TableCell>
                                        <TableCell>Month 2-12 (Ongoing)</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">DALL-E 3</TableCell>
                                        <TableCell>Create custom marketing visuals, app screenshots, and lifestyle imagery</TableCell>
                                        <TableCell>Month 2-12 (Ongoing)</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">Jasper AI</TableCell>
                                        <TableCell>Develop campaign creative concepts and ad copy variations</TableCell>
                                        <TableCell>Month 2-12 (Ongoing)</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">Midjourney</TableCell>
                                        <TableCell>Generate high-quality brand imagery for social posts and website</TableCell>
                                        <TableCell>Month 2-12 (Ongoing)</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">Snazzy AI</TableCell>
                                        <TableCell>Create landing page copy and email marketing sequences</TableCell>
                                        <TableCell>Month 2-12 (Ongoing)</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Step-by-Step Implementation</h4>
                                  <ul className="list-decimal pl-5 space-y-2">
                                    <li>Develop content creation workflow with AI tools integrated at each stage</li>
                                    <li>Train GPT-4o on brand voice guidelines and pet care terminology</li>
                                    <li>Use DALL-E 3 to create lifestyle imagery showing the app in use with various pet types</li>
                                    <li>Develop Jasper AI templates for different marketing channels (social, email, ads)</li>
                                    <li>Implement A/B testing framework to compare performance of AI-generated vs. human content</li>
                                    <li>Establish review process for all AI-generated content before publication</li>
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Expected Outputs</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <span className="font-medium">Content Volume:</span>
                                      <ul className="list-disc pl-5 space-y-1 mt-1">
                                        <li>250+ social media posts</li>
                                        <li>24 blog articles</li>
                                        <li>12 email campaigns</li>
                                        <li>100+ ad variations</li>
                                        <li>30+ app store screenshots</li>
                                      </ul>
                                    </div>
                                    <div>
                                      <span className="font-medium">Efficiency Gains:</span>
                                      <ul className="list-disc pl-5 space-y-1 mt-1">
                                        <li>75% reduction in content creation time</li>
                                        <li>60% lower content production costs</li>
                                        <li>30% higher conversion rates</li>
                                        <li>5x more A/B test variations</li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </li>

                      <li className="ml-12">
                        <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                          <span className="font-bold">3</span>
                        </div>
                        <h3 className="font-semibold text-lg">Ad Campaign Optimization</h3>
                        <div className="mt-2 space-y-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <Settings className="h-4 w-4 text-primary" />
                                AI Tools & Implementation
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Tools & Technologies</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Tool</TableHead>
                                        <TableHead>Purpose</TableHead>
                                        <TableHead>Implementation Timeline</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="font-medium">Optmyzr</TableCell>
                                        <TableCell>AI-powered Apple Search Ads and Google App Campaign optimization</TableCell>
                                        <TableCell>Launch (Month 3) onwards</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">Acquisio</TableCell>
                                        <TableCell>Machine learning bid management and budget allocation</TableCell>
                                        <TableCell>Launch (Month 3) onwards</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">Pattern89</TableCell>
                                        <TableCell>Creative intelligence for ad content optimization</TableCell>
                                        <TableCell>Launch (Month 3) onwards</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">Albert AI</TableCell>
                                        <TableCell>Autonomous media buying and optimization across platforms</TableCell>
                                        <TableCell>Growth Phase (Month 4) onwards</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">RevealBot</TableCell>
                                        <TableCell>Automated rules and optimizations for social ads</TableCell>
                                        <TableCell>Growth Phase (Month 4) onwards</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Step-by-Step Implementation</h4>
                                  <ul className="list-decimal pl-5 space-y-2">
                                    <li>Connect advertising accounts to AI optimization platforms</li>
                                    <li>Establish baseline performance metrics for each channel</li>
                                    <li>Configure AI bid management systems with target CPI and ROAS goals</li>
                                    <li>Implement Pattern89's creative prediction analysis before launching ad variations</li>
                                    <li>Set up Albert AI with initial budget constraints and learning parameters</li>
                                    <li>Create automated rules in RevealBot for scaling winning campaigns</li>
                                    <li>Establish weekly review cycles to evaluate AI performance and make adjustments</li>
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Expected Performance Improvements</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card className="bg-muted/50">
                                      <CardContent className="pt-6">
                                        <div className="text-center">
                                          <p className="text-3xl font-bold text-primary">35%</p>
                                          <p className="text-sm mt-1">Lower Cost Per Installation</p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    <Card className="bg-muted/50">
                                      <CardContent className="pt-6">
                                        <div className="text-center">
                                          <p className="text-3xl font-bold text-primary">42%</p>
                                          <p className="text-sm mt-1">Higher Conversion Rate</p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    <Card className="bg-muted/50">
                                      <CardContent className="pt-6">
                                        <div className="text-center">
                                          <p className="text-3xl font-bold text-primary">3.1x</p>
                                          <p className="text-sm mt-1">Return on Ad Spend</p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </li>

                      <li className="ml-12">
                        <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                          <span className="font-bold">4</span>
                        </div>
                        <h3 className="font-semibold text-lg">Customer Experience & Personalization</h3>
                        <div className="mt-2 space-y-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                AI Tools & Implementation
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Tools & Technologies</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Tool</TableHead>
                                        <TableHead>Purpose</TableHead>
                                        <TableHead>Implementation Timeline</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="font-medium">Dynamic Yield</TableCell>
                                        <TableCell>AI-driven personalization of landing pages and onboarding experiences</TableCell>
                                        <TableCell>Launch (Month 3) onwards</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">Optimizely</TableCell>
                                        <TableCell>Automated A/B testing and experience optimization</TableCell>
                                        <TableCell>Growth Phase (Month 4-6)</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">OneSignal AI</TableCell>
                                        <TableCell>Intelligent push notification and in-app messaging</TableCell>
                                        <TableCell>Growth Phase (Month 4-6)</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">Intercom </TableCell>
                                        <TableCell>AI chatbot for customer support and engagement</TableCell>
                                        <TableCell>Launch (Month 3) onwards</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">CleverTap</TableCell>
                                        <TableCell>Behavioral analytics and AI-powered user journeys</TableCell>
                                        <TableCell>Growth Phase (Month 4-6)</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Step-by-Step Implementation</h4>
                                  <ul className="list-decimal pl-5 space-y-2">
                                    <li>Implement Dynamic Yield for personalized landing page experiences based on traffic source and device type</li>
                                    <li>Deploy Optimizely's Feature Experimentation to test onboarding variations</li>
                                    <li>Configure OneSignal's AI to optimize push notification timing and content</li>
                                    <li>Build and train Intercom chatbot with pet care product knowledge base</li>
                                    <li>Set up CleverTap's predictive segments to identify high-value users and churn risks</li>
                                    <li>Create automated lifecycle marketing campaigns based on user behavior patterns</li>
                                    <li>Implement feedback loops to continuously improve personalization models</li>
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">User Experience Impact</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <Card className="bg-muted/50">
                                      <CardContent className="pt-6 pb-6">
                                        <h5 className="font-medium mb-2">Acquisition Phase</h5>
                                        <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                                          <li>32% higher landing page conversion rates</li>
                                          <li>45% more completed onboarding flows</li>
                                          <li>3.8/5 average first-session satisfaction</li>
                                        </ul>
                                      </CardContent>
                                    </Card>
                                    <Card className="bg-muted/50">
                                      <CardContent className="pt-6 pb-6">
                                        <h5 className="font-medium mb-2">Retention Phase</h5>
                                        <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                                          <li>27% increase in D7 retention</li>
                                          <li>52% higher feature adoption rate</li>
                                          <li>18% more premium subscription conversions</li>
                                        </ul>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </li>
                      
                      <li className="ml-12">
                        <div className="absolute -left-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                          <span className="font-bold">5</span>
                        </div>
                        <h3 className="font-semibold text-lg">Analytics & Performance Monitoring</h3>
                        <div className="mt-2 space-y-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <BarChart2 className="h-4 w-4 text-primary" />
                                AI Tools & Implementation
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Tools & Technologies</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Tool</TableHead>
                                        <TableHead>Purpose</TableHead>
                                        <TableHead>Implementation Timeline</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="font-medium">Amplitude ML</TableCell>
                                        <TableCell>Product analytics with predictive user behavior modeling</TableCell>
                                        <TableCell>Pre-launch (Month 1) onwards</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">AppsFlyer Predictive Analytics</TableCell>
                                        <TableCell>Attribution and LTV prediction for user acquisition</TableCell>
                                        <TableCell>Launch (Month 3) onwards</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">Mixpanel Predict</TableCell>
                                        <TableCell>Churn prediction and conversion opportunity identification</TableCell>
                                        <TableCell>Growth Phase (Month 4) onwards</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">Tableau with Einstein Analytics</TableCell>
                                        <TableCell>AI-powered data visualization and business intelligence</TableCell>
                                        <TableCell>Growth Phase (Month 4) onwards</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">Heap</TableCell>
                                        <TableCell>Automated insight generation and anomaly detection</TableCell>
                                        <TableCell>Growth Phase (Month 4) onwards</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Implementation Strategy</h4>
                                  <ul className="list-decimal pl-5 space-y-2">
                                    <li>Configure Amplitude ML cohort analysis to identify high-value user behavior patterns</li>
                                    <li>Implement AppsFlyer's predictive LTV models to optimize UA campaign targeting</li>
                                    <li>Set up Mixpanel Predict to forecast churn probability for each user segment</li>
                                    <li>Build Tableau dashboards with Einstein Analytics for automated insight generation</li>
                                    <li>Deploy Heap's anomaly detection to provide real-time alerts on performance changes</li>
                                    <li>Create weekly and monthly reporting automation with insights prioritized by business impact</li>
                                    <li>Establish cross-functional analytics review meetings to act on AI-generated insights</li>
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Decision-Making Framework</h4>
                                  <div className="overflow-x-auto">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Decision Type</TableHead>
                                          <TableHead>AI Input</TableHead>
                                          <TableHead>Human Input</TableHead>
                                          <TableHead>Decision Process</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        <TableRow>
                                          <TableCell>Campaign Optimization</TableCell>
                                          <TableCell>Predictive ROAS, Creative Performance</TableCell>
                                          <TableCell>Brand Guidelines, Strategic Goals</TableCell>
                                          <TableCell>AI recommends, humans approve</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Budget Allocation</TableCell>
                                          <TableCell>Channel Performance Predictions</TableCell>
                                          <TableCell>Market Conditions, Competitive Activity</TableCell>
                                          <TableCell>AI provides scenarios, humans decide</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Content Strategy</TableCell>
                                          <TableCell>Engagement Patterns, Content Gaps</TableCell>
                                          <TableCell>Brand Voice, Content Calendar</TableCell>
                                          <TableCell>Collaborative creation process</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Feature Prioritization</TableCell>
                                          <TableCell>Usage Patterns, Conversion Impact</TableCell>
                                          <TableCell>Technical Feasibility, Product Roadmap</TableCell>
                                          <TableCell>Data-informed human decision</TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    AI Marketing Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Cost Efficiency</h4>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Content Creation</TableCell>
                            <TableCell>75% cost reduction</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Customer Acquisition</TableCell>
                            <TableCell>35% lower CPI</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Customer Service</TableCell>
                            <TableCell>60% automation rate</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Analytics</TableCell>
                            <TableCell>80% faster insight generation</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Total Marketing ROI</TableCell>
                            <TableCell>2.7x higher than traditional methods</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Competitive Advantages</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>Hyper-personalized user experiences based on pet type, owner behavior, and usage patterns</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>Real-time optimization of marketing spend across channels</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>Predictive analytics for identifying high-value user segments early</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>Ability to scale content creation for niche pet segments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>Enhanced customer support through conversational AI</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Creative AI Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Image Generation for Marketing</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Using DALL-E 3 and Midjourney to create:</p>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            <li>Lifestyle imagery with different pet breeds</li>
                            <li>App UI mockups in various contexts</li>
                            <li>Before/after visualizations of pet care</li>
                            <li>Seasonal campaign imagery</li>
                            <li>Social media templates</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Implementation approach:</p>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            <li>Creative brief development</li>
                            <li>Prompt engineering refinement</li>
                            <li>Brand style guide integration</li>
                            <li>Image generation workflows</li>
                            <li>Human review and optimization</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Video Content Production</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Using RunwayML and Synthesia to create:</p>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            <li>App feature demonstration videos</li>
                            <li>Virtual spokesperson tutorials</li>
                            <li>AI-generated pet care tips</li>
                            <li>Social media video templates</li>
                            <li>Localized content variations</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Production workflow:</p>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            <li>Script generation with GPT-4o</li>
                            <li>Visual storyboarding</li>
                            <li>AI video synthesis</li>
                            <li>Post-processing and branding</li>
                            <li>Performance testing</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">App Store Creative Optimization</h4>
                      <p className="text-sm text-muted-foreground mb-2">Using AI to maximize App Store conversion:</p>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-start gap-2">
                          <PenTool className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Dynamic Screenshot Generation</p>
                            <p className="text-xs text-muted-foreground">Automatically create personalized screenshots based on user segments and seasonal themes</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Terminal className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium">A/B Testing Automation</p>
                            <p className="text-xs text-muted-foreground">AI-powered testing of App Store creative elements with automated optimization</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Image className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Preview Video Generation</p>
                            <p className="text-xs text-muted-foreground">Create engaging app preview videos with AI-generated scenes and transitions</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">AI Integration Roadmap</CardTitle>
                <CardDescription>
                  Comprehensive implementation timeline for all AI marketing tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Phase</TableHead>
                        <TableHead>Timeline</TableHead>
                        <TableHead>AI Solutions</TableHead>
                        <TableHead>Goals & KPIs</TableHead>
                        <TableHead>Resources</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Foundation</TableCell>
                        <TableCell>Pre-launch (Month 1-2)</TableCell>
                        <TableCell>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>BrandMentions AI</li>
                            <li>SocialScan NLP</li>
                            <li>GPT-4o & DALL-E 3</li>
                            <li>Amplitude ML</li>
                          </ul>
                        </TableCell>
                        <TableCell>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Market research completion</li>
                            <li>Content strategy development</li>
                            <li>Initial creative asset production</li>
                            <li>Analytics infrastructure setup</li>
                          </ul>
                        </TableCell>
                        <TableCell>
                          <Badge className="mb-1">Marketing Team</Badge>
                          <Badge className="mb-1">Data Science</Badge>
                          <Badge>$25K Budget</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Launch</TableCell>
                        <TableCell>Month 3</TableCell>
                        <TableCell>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Dynamic Yield</li>
                            <li>Optmyzr</li>
                            <li>AppsFlyer Predictive</li>
                            <li>Intercom AI</li>
                          </ul>
                        </TableCell>
                        <TableCell>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>App Store optimization</li>
                            <li>Initial paid campaign launch</li>
                            <li>Customer support automation</li>
                            <li>First-week user retention</li>
                          </ul>
                        </TableCell>
                        <TableCell>
                          <Badge className="mb-1">Growth Team</Badge>
                          <Badge className="mb-1">Customer Success</Badge>
                          <Badge>$40K Budget</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Growth</TableCell>
                        <TableCell>Month 4-6</TableCell>
                        <TableCell>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Albert AI</li>
                            <li>Mixpanel Predict</li>
                            <li>Tableau with Einstein</li>
                            <li>OneSignal AI</li>
                          </ul>
                        </TableCell>
                        <TableCell>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Autonomous media buying</li>
                            <li>Churn prediction models</li>
                            <li>Engagement optimization</li>
                            <li>Advanced user segmentation</li>
                          </ul>
                        </TableCell>
                        <TableCell>
                          <Badge className="mb-1">Growth Team</Badge>
                          <Badge className="mb-1">Product Team</Badge>
                          <Badge>$45K Budget</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Optimization</TableCell>
                        <TableCell>Month 7-9</TableCell>
                        <TableCell>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>CleverTap</li>
                            <li>Heap</li>
                            <li>RunwayML</li>
                            <li>Advanced LTV Models</li>
                          </ul>
                        </TableCell>
                        <TableCell>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Behavioral journey optimization</li>
                            <li>Automated insight generation</li>
                            <li>Advanced video content</li>
                            <li>Lifetime value maximization</li>
                          </ul>
                        </TableCell>
                        <TableCell>
                          <Badge className="mb-1">Product Team</Badge>
                          <Badge className="mb-1">Data Science</Badge>
                          <Badge>$25K Budget</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Scaling</TableCell>
                        <TableCell>Month 10-12</TableCell>
                        <TableCell>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Full AI Marketing Suite</li>
                            <li>Custom ML Models</li>
                            <li>GPT-4o Advanced Fine-tuning</li>
                            <li>Cross-platform AI Optimization</li>
                          </ul>
                        </TableCell>
                        <TableCell>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>International market expansion</li>
                            <li>Advanced personalization</li>
                            <li>Predictive marketing planning</li>
                            <li>Cross-platform optimization</li>
                          </ul>
                        </TableCell>
                        <TableCell>
                          <Badge className="mb-1">All Teams</Badge>
                          <Badge className="mb-1">Leadership</Badge>
                          <Badge>$15K Budget</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market-analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  Global Pet Care Market Analysis
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis of the global pet market by region and pet type
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Market Size & Growth Projections</h3>
                  <p className="text-muted-foreground mb-6">
                    The global pet care market is experiencing robust growth, projected to reach $325.74 billion by 2028, growing at a CAGR of 5.8% from 2023. Pet technology and AI-powered pet care solutions represent the fastest-growing segment within this market, expected to grow at a CAGR of 24.7% through 2030.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-primary">$325.7B</p>
                          <p className="text-sm mt-1">Projected Global Market (2028)</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-primary">5.8%</p>
                          <p className="text-sm mt-1">Overall Market CAGR</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-primary">24.7%</p>
                          <p className="text-sm mt-1">Pet Tech CAGR</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-primary">$11.8B</p>
                          <p className="text-sm mt-1">Pet Tech Market Size (2025)</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Market Drivers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col p-4 bg-muted/30 rounded-lg">
                        <div className="text-primary mb-2">
                          <Users className="h-5 w-5" />
                        </div>
                        <h4 className="font-medium text-base mb-2">Pet Humanization</h4>
                        <p className="text-sm text-muted-foreground">Increasing tendency to treat pets as family members, driving premium care products and services adoption</p>
                      </div>
                      <div className="flex flex-col p-4 bg-muted/30 rounded-lg">
                        <div className="text-primary mb-2">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <h4 className="font-medium text-base mb-2">Technology Integration</h4>
                        <p className="text-sm text-muted-foreground">Growing adoption of IoT, AI, and mobile applications in pet care management and health monitoring</p>
                      </div>
                      <div className="flex flex-col p-4 bg-muted/30 rounded-lg">
                        <div className="text-primary mb-2">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <h4 className="font-medium text-base mb-2">Aging Population</h4>
                        <p className="text-sm text-muted-foreground">Increase in elderly pet owners seeking companionship and willing to spend on advanced pet care solutions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Country Analysis</CardTitle>
                    <CardDescription>
                      Market size and growth projections for major pet markets worldwide
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div>
                      <h4 className="text-base font-semibold mb-3 flex items-center">
                        <span className="inline-block w-8 h-5 bg-[url('https://flagcdn.com/us.svg')] bg-cover bg-center mr-2 rounded-sm"></span>
                        United States
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Market Overview</h5>
                          <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                            <li>Largest pet care market globally: $123.6B (2023)</li>
                            <li>70% of US households own a pet (90.5M homes)</li>
                            <li>Average annual spending: $1,480 per pet</li>
                            <li>Premium pet care segment growing at 8.7% CAGR</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Pet Distribution</h5>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Dogs (69M)</span>
                                <span>45.9%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45.9%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Cats (45.3M)</span>
                                <span>30.2%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "30.2%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Fish (11.8M)</span>
                                <span>7.9%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: "7.9%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Birds (9.9M)</span>
                                <span>6.6%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: "6.6%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Other (14.2M)</span>
                                <span>9.4%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "9.4%" }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Market Opportunity</h5>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="min-w-[50px] text-center p-1 bg-green-100 text-green-800 rounded text-xs font-medium">High</div>
                              <span className="text-sm">Pet tech and AI solutions ($5.4B)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="min-w-[50px] text-center p-1 bg-green-100 text-green-800 rounded text-xs font-medium">High</div>
                              <span className="text-sm">Premium pet healthcare ($18.2B)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="min-w-[50px] text-center p-1 bg-green-100 text-green-800 rounded text-xs font-medium">High</div>
                              <span className="text-sm">Pet mental health services ($2.1B)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="min-w-[50px] text-center p-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">Medium</div>
                              <span className="text-sm">Budget pet care solutions ($8.4B)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-semibold mb-3 flex items-center">
                        <span className="inline-block w-8 h-5 bg-[url('https://flagcdn.com/de.svg')] bg-cover bg-center mr-2 rounded-sm"></span>
                        Germany
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Market Overview</h5>
                          <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                            <li>Largest European pet market: €6.3B (2023)</li>
                            <li>47% of households own a pet (18.5M homes)</li>
                            <li>Average annual spending: €942 per pet</li>
                            <li>Premium pet food segment growing at 6.5% CAGR</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Pet Distribution</h5>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Cats (15.7M)</span>
                                <span>47.6%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "47.6%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Dogs (10.3M)</span>
                                <span>31.2%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "31.2%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Small Animals (4.8M)</span>
                                <span>14.5%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-red-500 h-2 rounded-full" style={{ width: "14.5%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Other (2.2M)</span>
                                <span>6.7%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "6.7%" }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Market Opportunity</h5>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="min-w-[50px] text-center p-1 bg-green-100 text-green-800 rounded text-xs font-medium">High</div>
                              <span className="text-sm">Eco-friendly pet products (€960M)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="min-w-[50px] text-center p-1 bg-green-100 text-green-800 rounded text-xs font-medium">High</div>
                              <span className="text-sm">Pet health tracking apps (€540M)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="min-w-[50px] text-center p-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">Medium</div>
                              <span className="text-sm">Premium pet insurance (€420M)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="min-w-[50px] text-center p-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">Medium</div>
                              <span className="text-sm">Pet training solutions (€330M)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-semibold mb-3 flex items-center">
                        <span className="inline-block w-8 h-5 bg-[url('https://flagcdn.com/jp.svg')] bg-cover bg-center mr-2 rounded-sm"></span>
                        Japan
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Market Overview</h5>
                          <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                            <li>Leading Asian pet market: ¥1.7T ($11.8B) (2023)</li>
                            <li>23.2% of households own a pet (12.3M homes)</li>
                            <li>Average annual spending: ¥300,000 ($2,100) per pet</li>
                            <li>Pet technology adoption growing at 18.5% CAGR</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Pet Distribution</h5>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Dogs (7.3M)</span>
                                <span>56.2%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "56.2%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Cats (9.6M)</span>
                                <span>33.8%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "33.8%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Fish (3.2M)</span>
                                <span>5.4%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: "5.4%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Other (2.1M)</span>
                                <span>4.6%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "4.6%" }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Market Opportunity</h5>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="min-w-[50px] text-center p-1 bg-green-100 text-green-800 rounded text-xs font-medium">High</div>
                              <span className="text-sm">AI pet health monitoring (¥89B)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="min-w-[50px] text-center p-1 bg-green-100 text-green-800 rounded text-xs font-medium">High</div>
                              <span className="text-sm">Smart pet accessories (¥65B)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="min-w-[50px] text-center p-1 bg-green-100 text-green-800 rounded text-xs font-medium">High</div>
                              <span className="text-sm">Premium senior pet care (¥120B)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="min-w-[50px] text-center p-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">Medium</div>
                              <span className="text-sm">Pet grooming services (¥40B)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-semibold mb-3 flex items-center">
                        <span className="inline-block w-8 h-5 bg-[url('https://flagcdn.com/cn.svg')] bg-cover bg-center mr-2 rounded-sm"></span>
                        China
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Market Overview</h5>
                          <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                            <li>Fastest growing pet market: ¥295B ($42.2B) (2023)</li>
                            <li>19.7% of urban households own a pet (58M homes)</li>
                            <li>Average annual spending: ¥5,016 ($716) per pet</li>
                            <li>Overall market growing at 17.8% CAGR</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Pet Distribution</h5>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Dogs (52.2M)</span>
                                <span>53.8%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "53.8%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Cats (48.6M)</span>
                                <span>40.7%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "40.7%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Other (6.3M)</span>
                                <span>5.5%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "5.5%" }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Market Opportunity</h5>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="min-w-[50px] text-center p-1 bg-green-100 text-green-800 rounded text-xs font-medium">High</div>
                              <span className="text-sm">Mobile pet services (¥34B)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="min-w-[50px] text-center p-1 bg-green-100 text-green-800 rounded text-xs font-medium">High</div>
                              <span className="text-sm">Smart pet feeders (¥25B)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="min-w-[50px] text-center p-1 bg-green-100 text-green-800 rounded text-xs font-medium">High</div>
                              <span className="text-sm">Premium pet food (¥78B)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="min-w-[50px] text-center p-1 bg-green-100 text-green-800 rounded text-xs font-medium">High</div>
                              <span className="text-sm">Pet social networks (¥18B)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pet Care App Penetration by Species</CardTitle>
                    <CardDescription>
                      Current mobile app adoption rates among pet owners by species type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-sm font-medium mb-4">App Adoption Rates by Pet Type (Global)</h4>
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                                <span className="text-sm font-medium">Dogs</span>
                              </div>
                              <span className="text-sm font-bold">38.5%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div className="bg-blue-500 h-3 rounded-full" style={{ width: "38.5%" }}></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-amber-500 rounded-full"></span>
                                <span className="text-sm font-medium">Cats</span>
                              </div>
                              <span className="text-sm font-bold">32.7%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div className="bg-amber-500 h-3 rounded-full" style={{ width: "32.7%" }}></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                                <span className="text-sm font-medium">Small Mammals</span>
                              </div>
                              <span className="text-sm font-bold">14.2%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div className="bg-red-500 h-3 rounded-full" style={{ width: "14.2%" }}></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                                <span className="text-sm font-medium">Birds</span>
                              </div>
                              <span className="text-sm font-bold">8.6%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div className="bg-green-500 h-3 rounded-full" style={{ width: "8.6%" }}></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-cyan-500 rounded-full"></span>
                                <span className="text-sm font-medium">Fish</span>
                              </div>
                              <span className="text-sm font-bold">6.3%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div className="bg-cyan-500 h-3 rounded-full" style={{ width: "6.3%" }}></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-purple-500 rounded-full"></span>
                                <span className="text-sm font-medium">Reptiles</span>
                              </div>
                              <span className="text-sm font-bold">5.8%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div className="bg-purple-500 h-3 rounded-full" style={{ width: "5.8%" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-4">Pet Care App Feature Usage by Pet Type</h4>
                        <div className="relative overflow-x-auto rounded-lg border">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-muted">
                              <tr>
                                <th scope="col" className="px-4 py-3">Feature</th>
                                <th scope="col" className="px-4 py-3">Dogs</th>
                                <th scope="col" className="px-4 py-3">Cats</th>
                                <th scope="col" className="px-4 py-3">Other</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="px-4 py-3 font-medium">Health Tracking</td>
                                <td className="px-4 py-3">85%</td>
                                <td className="px-4 py-3">78%</td>
                                <td className="px-4 py-3">64%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-4 py-3 font-medium">Training Guides</td>
                                <td className="px-4 py-3">92%</td>
                                <td className="px-4 py-3">35%</td>
                                <td className="px-4 py-3">41%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-4 py-3 font-medium">Feeding Reminders</td>
                                <td className="px-4 py-3">76%</td>
                                <td className="px-4 py-3">82%</td>
                                <td className="px-4 py-3">88%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-4 py-3 font-medium">Vet Appointments</td>
                                <td className="px-4 py-3">68%</td>
                                <td className="px-4 py-3">62%</td>
                                <td className="px-4 py-3">53%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-4 py-3 font-medium">Photo Sharing</td>
                                <td className="px-4 py-3">79%</td>
                                <td className="px-4 py-3">89%</td>
                                <td className="px-4 py-3">61%</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">AI Health Analysis</td>
                                <td className="px-4 py-3">58%</td>
                                <td className="px-4 py-3">52%</td>
                                <td className="px-4 py-3">37%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mobile Device Usage Among Pet Owners</CardTitle>
                    <CardDescription>
                      iOS device penetration and usage patterns by country for targeted app distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium mb-4">iOS Market Share by Country (2023)</h4>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-primary rounded-full"></span>
                                <span className="text-sm font-medium">United States</span>
                              </div>
                              <span className="text-sm font-bold">58.3%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div className="bg-primary h-2.5 rounded-full" style={{ width: "58.3%" }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">iPhone dominates the premium smartphone market, with highest usage among urban pet owners aged 25-44</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-primary rounded-full"></span>
                                <span className="text-sm font-medium">Japan</span>
                              </div>
                              <span className="text-sm font-bold">65.8%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div className="bg-primary h-2.5 rounded-full" style={{ width: "65.8%" }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Highest iOS adoption rate among major pet markets, particularly among urban pet owners with cats</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-primary rounded-full"></span>
                                <span className="text-sm font-medium">Germany</span>
                              </div>
                              <span className="text-sm font-bold">33.7%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div className="bg-primary h-2.5 rounded-full" style={{ width: "33.7%" }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Lower iOS adoption but higher spending per iOS user, with concentration among high-income pet owners</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-primary rounded-full"></span>
                                <span className="text-sm font-medium">China</span>
                              </div>
                              <span className="text-sm font-bold">20.5%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div className="bg-primary h-2.5 rounded-full" style={{ width: "20.5%" }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">iPhone represents luxury segment with concentrations in tier-1 cities among affluent pet parents</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-primary rounded-full"></span>
                                <span className="text-sm font-medium">United Kingdom</span>
                              </div>
                              <span className="text-sm font-bold">50.2%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div className="bg-primary h-2.5 rounded-full" style={{ width: "50.2%" }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Strong iOS adoption with higher rates among dog owners compared to other pet types</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-4">iOS Pet Owner Device Profiles</h4>
                        <div className="space-y-5">
                          <Card className="bg-muted/30 border">
                            <CardContent className="pt-4">
                              <h5 className="text-sm font-semibold mb-2">United States</h5>
                              <ul className="space-y-1.5 text-sm">
                                <li className="flex items-start gap-2">
                                  <Smartphone className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
                                  <span>86% of iOS pet owners use iPhone 12 or newer models</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Smartphone className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
                                  <span>iPhone Pro/Pro Max models overrepresented (42%) among pet owners</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Smartphone className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
                                  <span>72% of pet owners have multiple Apple devices (iPad, Apple Watch)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Smartphone className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
                                  <span>Average of 3.4 pet-related apps installed per user</span>
                                </li>
                              </ul>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-muted/30 border">
                            <CardContent className="pt-4">
                              <h5 className="text-sm font-semibold mb-2">Japan</h5>
                              <ul className="space-y-1.5 text-sm">
                                <li className="flex items-start gap-2">
                                  <Smartphone className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
                                  <span>91% of pet owners use iPhone as their primary device</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Smartphone className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
                                  <span>High adoption of Apple Watch among dog owners (58%)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Smartphone className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
                                  <span>64% prefer smaller iPhone models (mini/standard sizes)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Smartphone className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
                                  <span>Highest average spending on pet-related app subscriptions ($64/year)</span>
                                </li>
                              </ul>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-muted/30 border">
                            <CardContent className="pt-4">
                              <h5 className="text-sm font-semibold mb-2">European Markets</h5>
                              <ul className="space-y-1.5 text-sm">
                                <li className="flex items-start gap-2">
                                  <Smartphone className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
                                  <span>Older iPhone models more common (33% using iPhone X-11)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Smartphone className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
                                  <span>iPad usage higher than average (53% of pet owners have one)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Smartphone className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
                                  <span>Strong privacy concerns with 68% restricting app permissions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Smartphone className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
                                  <span>Higher dependence on Wi-Fi vs. cellular data for app usage</span>
                                </li>
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-3">iOS Pet Owner App Usage Patterns</h4>
                      <div className="relative overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs uppercase bg-muted">
                            <tr>
                              <th scope="col" className="px-4 py-3">Behavior Metric</th>
                              <th scope="col" className="px-4 py-3">United States</th>
                              <th scope="col" className="px-4 py-3">Japan</th>
                              <th scope="col" className="px-4 py-3">Europe</th>
                              <th scope="col" className="px-4 py-3">China</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="px-4 py-3 font-medium">Daily Active Minutes</td>
                              <td className="px-4 py-3">14.2 min</td>
                              <td className="px-4 py-3">18.7 min</td>
                              <td className="px-4 py-3">11.5 min</td>
                              <td className="px-4 py-3">22.3 min</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-3 font-medium">Session Frequency</td>
                              <td className="px-4 py-3">3.2/day</td>
                              <td className="px-4 py-3">4.5/day</td>
                              <td className="px-4 py-3">2.8/day</td>
                              <td className="px-4 py-3">5.2/day</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-3 font-medium">Premium Conversion</td>
                              <td className="px-4 py-3">18.5%</td>
                              <td className="px-4 py-3">23.6%</td>
                              <td className="px-4 py-3">15.2%</td>
                              <td className="px-4 py-3">12.8%</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-3 font-medium">Feature Engagement</td>
                              <td className="px-4 py-3">Pet Health, Training</td>
                              <td className="px-4 py-3">Photos, Health</td>
                              <td className="px-4 py-3">Nutrition, Health</td>
                              <td className="px-4 py-3">Social, Training</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium">Push Notification Opt-in</td>
                              <td className="px-4 py-3">64%</td>
                              <td className="px-4 py-3">78%</td>
                              <td className="px-4 py-3">52%</td>
                              <td className="px-4 py-3">85%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-3">iOS-Specific Marketing Recommendations</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col p-4 bg-muted/30 rounded-lg">
                          <div className="text-primary mb-2">
                            <Image className="h-5 w-5" />
                          </div>
                          <h4 className="font-medium text-base mb-2">Visual Optimization</h4>
                          <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
                            <li>Design for device-specific screen ratios (iPhone 13/14/15)</li>
                            <li>Optimize for Dark Mode (used by 72% of iOS pet owners)</li>
                            <li>Support Dynamic Island functionality for newer models</li>
                            <li>Create custom app icons for major dog/cat breeds</li>
                          </ul>
                        </div>
                        <div className="flex flex-col p-4 bg-muted/30 rounded-lg">
                          <div className="text-primary mb-2">
                            <Zap className="h-5 w-5" />
                          </div>
                          <h4 className="font-medium text-base mb-2">Feature Prioritization</h4>
                          <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
                            <li>Highlight Apple Health integration for US market</li>
                            <li>Emphasize camera/photo features for Japanese users</li>
                            <li>Focus on privacy/data control for European audience</li>
                            <li>Develop Apple Watch companion app (priority for US/Japan)</li>
                          </ul>
                        </div>
                        <div className="flex flex-col p-4 bg-muted/30 rounded-lg">
                          <div className="text-primary mb-2">
                            <Target className="h-5 w-5" />
                          </div>
                          <h4 className="font-medium text-base mb-2">ASO Strategy</h4>
                          <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
                            <li>Include "AI" in app title for increased visibility</li>
                            <li>Optimize keywords by region (US: health, training; Japan: photo, care)</li>
                            <li>Create localized screenshots showing country-specific breeds</li>
                            <li>Use App Store Search Ads with premium brand positioning</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pet Tech Investment Trends</CardTitle>
                      <CardDescription>
                        Venture capital funding in pet technology startups
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Annual VC Funding (2020-2025)</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>2020</span>
                                <span>$320M</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: "32%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>2021</span>
                                <span>$485M</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: "48.5%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>2022</span>
                                <span>$630M</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: "63%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>2023</span>
                                <span>$840M</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: "84%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>2024 (Projected)</span>
                                <span>$990M</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: "99%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>2025 (Projected)</span>
                                <span>$1.2B</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full opacity-50" style={{ width: "100%" }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Investment by Category (2023)</h4>
                          <div className="relative overflow-x-auto rounded-lg border">
                            <table className="w-full text-sm text-left">
                              <thead className="text-xs uppercase bg-muted">
                                <tr>
                                  <th scope="col" className="px-4 py-2">Category</th>
                                  <th scope="col" className="px-4 py-2">Amount</th>
                                  <th scope="col" className="px-4 py-2">Share</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b">
                                  <td className="px-4 py-2 font-medium">Pet Health Tech</td>
                                  <td className="px-4 py-2">$386M</td>
                                  <td className="px-4 py-2">46%</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="px-4 py-2 font-medium">Smart Accessories</td>
                                  <td className="px-4 py-2">$202M</td>
                                  <td className="px-4 py-2">24%</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="px-4 py-2 font-medium">Pet Services</td>
                                  <td className="px-4 py-2">$134M</td>
                                  <td className="px-4 py-2">16%</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2 font-medium">Other</td>
                                  <td className="px-4 py-2">$118M</td>
                                  <td className="px-4 py-2">14%</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Strategic Implications</CardTitle>
                      <CardDescription>
                        Key market insights for PetCare AI's global strategy
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-5">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Key Regional Opportunities</h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="bg-blue-100 text-blue-800 p-1 rounded-full">
                                <CheckCircle2 className="h-4 w-4" />
                              </div>
                              <div>
                                <h5 className="text-sm font-medium">North America</h5>
                                <p className="text-xs text-muted-foreground">Primary focus on premium AI health monitoring and advanced injury scanning features that cater to high-spending pet parents</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="bg-blue-100 text-blue-800 p-1 rounded-full">
                                <CheckCircle2 className="h-4 w-4" />
                              </div>
                              <div>
                                <h5 className="text-sm font-medium">European Markets</h5>
                                <p className="text-xs text-muted-foreground">Emphasize eco-friendly aspects, data privacy compliance, and holistic wellness approach aligned with European pet care values</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="bg-blue-100 text-blue-800 p-1 rounded-full">
                                <CheckCircle2 className="h-4 w-4" />
                              </div>
                              <div>
                                <h5 className="text-sm font-medium">Asian Markets</h5>
                                <p className="text-xs text-muted-foreground">Develop mobile-first social features, localized training content, and integration with popular platforms in China and Japan</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Species-Specific Strategies</h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="bg-amber-100 text-amber-800 p-1 rounded-full">
                                <Zap className="h-4 w-4" />
                              </div>
                              <div>
                                <h5 className="text-sm font-medium">Dogs (Primary Focus)</h5>
                                <p className="text-xs text-muted-foreground">Enhanced AI-powered training solutions and behavior analysis as entry point for highest revenue potential segment</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="bg-amber-100 text-amber-800 p-1 rounded-full">
                                <Zap className="h-4 w-4" />
                              </div>
                              <div>
                                <h5 className="text-sm font-medium">Cats (Secondary Focus)</h5>
                                <p className="text-xs text-muted-foreground">Health monitoring and play/enrichment tools optimized for feline behaviors with minimal user intervention</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="bg-amber-100 text-amber-800 p-1 rounded-full">
                                <Zap className="h-4 w-4" />
                              </div>
                              <div>
                                <h5 className="text-sm font-medium">Exotic/Small Pets (Future Expansion)</h5>
                                <p className="text-xs text-muted-foreground">Develop species-specific modules for high-growth niche segments after establishing core user base</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ios-targeting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  iOS-Specific Marketing Strategy
                </CardTitle>
                <CardDescription>
                  Targeted approaches to ensure marketing efforts focus exclusively on iOS users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Platform-Specific Ad Targeting</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          Apple Search Ads
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-3">
                        <div>
                          <h4 className="font-medium mb-2">Key Advantages</h4>
                          <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                            <li>Targets only users searching the iOS App Store</li>
                            <li>100% iOS audience with zero wasted spend</li>
                            <li>Direct conversion tracking via Apple's analytics</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Implementation Strategy</h4>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="min-w-[20px] h-5 flex items-center justify-center bg-primary/10 text-primary rounded text-xs font-medium">1</div>
                              <span>Deploy Apple Search Ads Advanced with custom product pages for different pet types</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="min-w-[20px] h-5 flex items-center justify-center bg-primary/10 text-primary rounded text-xs font-medium">2</div>
                              <span>Implement keyword bidding on high-value terms (e.g., "pet health app", "dog training")</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="min-w-[20px] h-5 flex items-center justify-center bg-primary/10 text-primary rounded text-xs font-medium">3</div>
                              <span>Create Custom Product Pages for different pet types and owner needs</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="min-w-[20px] h-5 flex items-center justify-center bg-primary/10 text-primary rounded text-xs font-medium">4</div>
                              <span>Optimize bidding strategy based on LAT (Limit Ad Tracking) segments</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-primary" />
                          Social Media Targeting
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-3">
                        <div>
                          <h4 className="font-medium mb-2">Platform Configuration</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Platform</TableHead>
                                <TableHead>iOS Targeting Option</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">Facebook/IG</TableCell>
                                <TableCell>"iOS devices only" in Detailed Targeting</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">TikTok</TableCell>
                                <TableCell>"Operating System: iOS" in Device settings</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Pinterest</TableCell>
                                <TableCell>"Mobile: iOS" in Ad Group settings</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Snapchat</TableCell>
                                <TableCell>"Device OS: iOS" in Advanced targeting</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Advanced Targeting Rules</h4>
                          <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                            <li>Combine iOS targeting with specific iPhone models (12 and newer)</li>
                            <li>Include "iOS App Users" as an interest category</li>
                            <li>Target users with interest in "Apple products"</li>
                            <li>Explicitly exclude Android users to prevent mistargeting</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Search className="h-4 w-4 text-primary" />
                          Google Campaign Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-3">
                        <div>
                          <h4 className="font-medium mb-2">App Campaign Settings</h4>
                          <div className="relative overflow-x-auto rounded-lg border">
                            <table className="w-full text-xs text-left">
                              <thead className="text-xs uppercase bg-muted">
                                <tr>
                                  <th scope="col" className="px-3 py-2">Campaign Type</th>
                                  <th scope="col" className="px-3 py-2">Settings</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b">
                                  <td className="px-3 py-2 font-medium">Universal App</td>
                                  <td className="px-3 py-2">Set OS: iOS only</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="px-3 py-2 font-medium">Search Ads</td>
                                  <td className="px-3 py-2">Device: Mobile + iOS only</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="px-3 py-2 font-medium">Display</td>
                                  <td className="px-3 py-2">Operating system: iOS</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-medium">YouTube</td>
                                  <td className="px-3 py-2">Device + OS targeting: iOS</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Keyword Strategy</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="outline">iPhone pet app</Badge>
                            <Badge variant="outline">iOS pet care</Badge>
                            <Badge variant="outline">Apple Watch pet</Badge>
                            <Badge variant="outline">iOS dog training</Badge>
                            <Badge variant="outline">iPhone cat health</Badge>
                            <Badge variant="outline">dog app for iPhone</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">iOS-Specific Marketing Channels</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-3">iOS Influencer Partnerships</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 text-blue-800 p-1 rounded-full">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div>
                              <h5 className="text-sm font-medium">Tech & Apple Influencers</h5>
                              <p className="text-xs text-muted-foreground">Partner with content creators who focus on iPhone reviews, iOS features, and Apple ecosystem content</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 text-blue-800 p-1 rounded-full">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div>
                              <h5 className="text-sm font-medium">Pet Content Creators on iOS</h5>
                              <p className="text-xs text-muted-foreground">Identify pet influencers who regularly create content using iPhones (visible in their content)</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 text-blue-800 p-1 rounded-full">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div>
                              <h5 className="text-sm font-medium">iOS-Specific Scripts</h5>
                              <p className="text-xs text-muted-foreground">Provide clear talking points highlighting iOS-only features in all influencer briefs</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-3">Apple-Focused Media</h4>
                        <div className="space-y-3">
                          <div className="relative overflow-x-auto rounded-lg border">
                            <table className="w-full text-xs text-left">
                              <thead className="text-xs uppercase bg-muted">
                                <tr>
                                  <th scope="col" className="px-3 py-2">Channel Type</th>
                                  <th scope="col" className="px-3 py-2">Examples</th>
                                  <th scope="col" className="px-3 py-2">iOS Audience %</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b">
                                  <td className="px-3 py-2 font-medium">Apple News Sites</td>
                                  <td className="px-3 py-2">MacRumors, 9to5Mac</td>
                                  <td className="px-3 py-2">90%</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="px-3 py-2 font-medium">iOS Tech Newsletters</td>
                                  <td className="px-3 py-2">iOS Dev Weekly, Apple Insider</td>
                                  <td className="px-3 py-2">85%</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="px-3 py-2 font-medium">Apple Podcasts</td>
                                  <td className="px-3 py-2">ATP, MacBreak Weekly</td>
                                  <td className="px-3 py-2">88%</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-medium">iOS App Review Sites</td>
                                  <td className="px-3 py-2">AppAdvice, iMore</td>
                                  <td className="px-3 py-2">95%</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Technical Targeting Methods</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Website Visitor Segmentation</h4>
                        <div className="space-y-3">
                          <div className="flex flex-col p-3 bg-muted/30 rounded-lg">
                            <h5 className="text-sm font-medium mb-2">iOS Device Detection</h5>
                            <div className="text-xs text-muted-foreground space-y-2">
                              <p className="font-mono bg-muted/70 p-1 rounded text-[10px]">
                                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);<br/>
                                const isMac = /Mac/.test(navigator.userAgent) &amp;&amp; navigator.maxTouchPoints &gt; 0;
                              </p>
                              <p>
                                Implement device detection to show iOS-specific download CTAs only to compatible devices
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col p-3 bg-muted/30 rounded-lg">
                            <h5 className="text-sm font-medium mb-2">Smart App Banners</h5>
                            <div className="text-xs text-muted-foreground space-y-2">
                              <p className="font-mono bg-muted/70 p-1 rounded text-[10px]">
                                {'<meta name="apple-itunes-app" content="app-id=YOUR_APP_ID">'}
                              </p>
                              <p>
                                Add iOS-only smart banners that appear at the top of the website when viewed in Safari on iOS
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col p-3 bg-muted/30 rounded-lg">
                            <h5 className="text-sm font-medium mb-2">iOS-Specific Landing Pages</h5>
                            <p className="text-xs text-muted-foreground">
                              Create device-specific landing experiences that highlight iOS-exclusive features for Apple users
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-3">iOS Retargeting Strategy</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="min-w-[24px] h-6 flex items-center justify-center bg-primary/10 text-primary rounded text-xs font-medium">1</div>
                            <div>
                              <h5 className="text-sm font-medium">iOS-Only Retargeting Lists</h5>
                              <p className="text-xs text-muted-foreground">Create custom audience segments that only include visitors from iOS devices</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="min-w-[24px] h-6 flex items-center justify-center bg-primary/10 text-primary rounded text-xs font-medium">2</div>
                            <div>
                              <h5 className="text-sm font-medium">IDFA-Based Campaigns</h5>
                              <p className="text-xs text-muted-foreground">Implement App Tracking Transparency framework and create campaigns for users who opt-in to IDFA tracking</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="min-w-[24px] h-6 flex items-center justify-center bg-primary/10 text-primary rounded text-xs font-medium">3</div>
                            <div>
                              <h5 className="text-sm font-medium">Private Click Measurement</h5>
                              <p className="text-xs text-muted-foreground">Adapt to Apple's privacy-focused attribution for iOS users who don't allow IDFA tracking</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="min-w-[24px] h-6 flex items-center justify-center bg-primary/10 text-primary rounded text-xs font-medium">4</div>
                            <div>
                              <h5 className="text-sm font-medium">Apple Search Ads Attribution API</h5>
                              <p className="text-xs text-muted-foreground">Implement Apple's privacy-compliant attribution API for closed-loop campaign measurement</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">iOS Budget Allocation & ROI Optimization</CardTitle>
                    <CardDescription>
                      Strategic budget distribution to maximize iOS user acquisition and retention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-sm font-medium mb-4">Budget Distribution by Channel</h4>
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                                <span className="text-sm font-medium">Apple Search Ads</span>
                              </div>
                              <span className="text-sm font-bold">40%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div className="bg-blue-500 h-3 rounded-full" style={{ width: "40%" }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground">Highest ROI channel with 100% iOS audience</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                                <span className="text-sm font-medium">Social Media (iOS targeted)</span>
                              </div>
                              <span className="text-sm font-bold">25%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div className="bg-green-500 h-3 rounded-full" style={{ width: "25%" }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground">Effective for awareness with platform-specific iOS targeting</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-amber-500 rounded-full"></span>
                                <span className="text-sm font-medium">iOS Influencer Marketing</span>
                              </div>
                              <span className="text-sm font-bold">20%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div className="bg-amber-500 h-3 rounded-full" style={{ width: "20%" }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground">Higher cost but greater authenticity and conversion rates</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-purple-500 rounded-full"></span>
                                <span className="text-sm font-medium">Apple-Focused Media</span>
                              </div>
                              <span className="text-sm font-bold">10%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div className="bg-purple-500 h-3 rounded-full" style={{ width: "10%" }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground">Targeted placements with highly qualified iOS audience</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                                <span className="text-sm font-medium">Experimental & Other</span>
                              </div>
                              <span className="text-sm font-bold">5%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div className="bg-red-500 h-3 rounded-full" style={{ width: "5%" }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground">Testing new iOS-specific acquisition channels</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">iOS-Specific ROAS Metrics & Optimization</h4>
                        <div className="relative overflow-x-auto rounded-lg border mb-4">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-muted">
                              <tr>
                                <th scope="col" className="px-4 py-3">Channel</th>
                                <th scope="col" className="px-4 py-3">CAC</th>
                                <th scope="col" className="px-4 py-3">ROAS</th>
                                <th scope="col" className="px-4 py-3">CPI</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="px-4 py-3 font-medium">Apple Search Ads</td>
                                <td className="px-4 py-3">$31.82</td>
                                <td className="px-4 py-3">3.1x</td>
                                <td className="px-4 py-3">$2.58</td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-4 py-3 font-medium">Social Media</td>
                                <td className="px-4 py-3">$15.29</td>
                                <td className="px-4 py-3">2.8x</td>
                                <td className="px-4 py-3">$4.50</td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-4 py-3 font-medium">Pet Influencers</td>
                                <td className="px-4 py-3">$25.00</td>
                                <td className="px-4 py-3">4.2x</td>
                                <td className="px-4 py-3">$1,719</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">Google Ads</td>
                                <td className="px-4 py-3">$31.82</td>
                                <td className="px-4 py-3">4.8x</td>
                                <td className="px-4 py-3">$3.13</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <h4 className="text-sm font-medium mb-3">iOS Optimization Strategy</h4>
                        <ol className="space-y-3 text-sm">
                          <li className="flex items-start gap-2">
                            <div className="min-w-[24px] h-6 flex items-center justify-center bg-primary/10 text-primary rounded text-xs font-medium">1</div>
                            <div>
                              <span className="font-medium">Implement iOS-only CAC tracking</span>
                              <p className="text-xs text-muted-foreground mt-1">Create dedicated attribution models for iOS users separate from overall marketing metrics</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="min-w-[24px] h-6 flex items-center justify-center bg-primary/10 text-primary rounded text-xs font-medium">2</div>
                            <div>
                              <span className="font-medium">Calculate iOS-specific LTV projections</span>
                              <p className="text-xs text-muted-foreground mt-1">Model expected lifetime value specifically for iOS users based on retention and subscription data</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="min-w-[24px] h-6 flex items-center justify-center bg-primary/10 text-primary rounded text-xs font-medium">3</div>
                            <div>
                              <span className="font-medium">Implement SKAdNetwork conversion value schema</span>
                              <p className="text-xs text-muted-foreground mt-1">Design a robust conversion value strategy to maximize insights from Apple's privacy-focused attribution</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="min-w-[24px] h-6 flex items-center justify-center bg-primary/10 text-primary rounded text-xs font-medium">4</div>
                            <div>
                              <span className="font-medium">Optimize bid strategies by iOS device model</span>
                              <p className="text-xs text-muted-foreground mt-1">Adjust bids based on performance data from different iPhone models and iOS versions</p>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      Direct Outreach Opportunities
                    </CardTitle>
                    <CardDescription>
                      Conferences, groups, and communities for direct iOS-focused pet owner outreach
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Pet Industry Conferences</h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <div className="flex justify-between">
                              <h4 className="font-medium">Global Pet Expo</h4>
                              <Badge>In-Person</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Annual event in Orlando with over 1,000 exhibitors and 3,000 product launches. Features a tech innovation section.</p>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">iOS User %:</span>
                              <span className="font-medium">68%</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-blue-600">
                              <ArrowUpRight className="h-3 w-3" />
                              <span>globalpetexpo.org</span>
                            </div>
                          </div>

                          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <div className="flex justify-between">
                              <h4 className="font-medium">SuperZoo</h4>
                              <Badge>In-Person</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Las Vegas trade show with special "Tech Showcase" section focusing on pet technology innovations and digital solutions.</p>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">iOS User %:</span>
                              <span className="font-medium">64%</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-blue-600">
                              <ArrowUpRight className="h-3 w-3" />
                              <span>superzoo.org</span>
                            </div>
                          </div>

                          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <div className="flex justify-between">
                              <h4 className="font-medium">Interzoo</h4>
                              <Badge>In-Person</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Largest international pet industry trade fair in Nuremberg, Germany with an "Innovation" section for digital pet care.</p>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">iOS User %:</span>
                              <span className="font-medium">72%</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-blue-600">
                              <ArrowUpRight className="h-3 w-3" />
                              <span>interzoo.com</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Virtual Pet Conferences & Events</h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <div className="flex justify-between">
                              <h4 className="font-medium">Pet Tech Conference</h4>
                              <Badge variant="outline">Virtual</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Annual event focusing on technology innovations in pet care, including mobile apps, wearables, and AI-powered solutions.</p>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">iOS User %:</span>
                              <span className="font-medium">75%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Industry Focus:</span>
                              <span className="font-medium">Pet Technology & Apps</span>
                            </div>
                          </div>

                          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <div className="flex justify-between">
                              <h4 className="font-medium">Pet Tech Innovation Forum</h4>
                              <Badge variant="outline">Virtual</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Annual online event connecting pet tech startups with investors and industry leaders. Features app pitching sessions.</p>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">iOS User %:</span>
                              <span className="font-medium">82%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Next Date:</span>
                              <span className="font-medium">September 22-24, 2025</span>
                            </div>
                          </div>

                          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <div className="flex justify-between">
                              <h4 className="font-medium">Veterinary Innovation Summit</h4>
                              <Badge variant="outline">Hybrid</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Technology-focused veterinary conference with tracks for digital pet health, telehealth, and monitoring applications.</p>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">iOS User %:</span>
                              <span className="font-medium">76%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Next Date:</span>
                              <span className="font-medium">August 5-7, 2025</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">iOS-Focused Pet Facebook Groups</h3>
                        <div className="space-y-3">
                          <div className="border rounded-lg">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Group Name</TableHead>
                                  <TableHead>Members</TableHead>
                                  <TableHead>iOS %</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">iPhone Pet Parents</TableCell>
                                  <TableCell>42,500</TableCell>
                                  <TableCell>97%</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Tech-Savvy Dog Owners</TableCell>
                                  <TableCell>31,200</TableCell>
                                  <TableCell>78%</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Apple & Pets Enthusiasts</TableCell>
                                  <TableCell>28,700</TableCell>
                                  <TableCell>92%</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">iOS Pet Photography</TableCell>
                                  <TableCell>24,300</TableCell>
                                  <TableCell>100%</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Pet Tech Gadgets & Apps</TableCell>
                                  <TableCell>19,800</TableCell>
                                  <TableCell>73%</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">iPhoneography: Pets Edition</TableCell>
                                  <TableCell>18,600</TableCell>
                                  <TableCell>100%</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Pet Health Trackers iOS</TableCell>
                                  <TableCell>15,400</TableCell>
                                  <TableCell>96%</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                          <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                            <h4 className="font-medium mb-2">Facebook Group Outreach Strategy</h4>
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Create iOS-specific content to share in these groups, highlighting pet photography features</li>
                              <li>Target iOS-exclusive features in all group discussions</li>
                              <li>Offer promotional codes specifically for group members</li>
                              <li>Host virtual Q&A sessions about the app within largest groups</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Social Media Communities & Forums</h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                              <span>Reddit Communities</span>
                              <Badge variant="secondary" className="ml-2">High iOS Usage</Badge>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">r/iOSPets</Badge>
                              <Badge variant="outline">r/AppleUsers</Badge>
                              <Badge variant="outline">r/PetTech</Badge>
                              <Badge variant="outline">r/DogTraining</Badge>
                              <Badge variant="outline">r/iPhonePetography</Badge>
                              <Badge variant="outline">r/VetTech</Badge>
                              <Badge variant="outline">r/PetApps</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Combined reach of 1.2M members with 64-88% iOS usage rates</p>
                          </div>

                          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                              <span>Instagram Pet Influencers</span>
                              <Badge variant="secondary" className="ml-2">iOS-Heavy</Badge>
                            </h4>
                            <p className="text-sm text-muted-foreground">Top 200 pet influencers with predominantly iPhone-using audiences:</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Audience Size:</span>
                                <p className="text-muted-foreground">125M+ combined</p>
                              </div>
                              <div>
                                <span className="font-medium">iOS Usage:</span>
                                <p className="text-muted-foreground">74% average</p>
                              </div>
                              <div>
                                <span className="font-medium">Top Platform:</span>
                                <p className="text-muted-foreground">Instagram</p>
                              </div>
                              <div>
                                <span className="font-medium">Secondary:</span>
                                <p className="text-muted-foreground">TikTok</p>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Notable: 83% of pet influencer content is created on iPhones</p>
                          </div>

                          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                              <span>Discord Servers</span>
                              <Badge variant="secondary" className="ml-2">Tech-Savvy</Badge>
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Pet Tech Enthusiasts</span>
                                <span className="font-medium">18,500 members</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>iOS Dog Training</span>
                                <span className="font-medium">12,300 members</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Pet App Developers</span>
                                <span className="font-medium">9,800 members</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Smart Pet Owners</span>
                                <span className="font-medium">7,200 members</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="adoption-sources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PawPrint className="h-5 w-5 text-primary" />
                  Pet Adoption Sources
                </CardTitle>
                <CardDescription>
                  Analysis of top pet adoption organizations and shelters ranked by reach and market penetration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">National Organizations by Market Share</h3>
                    <Badge variant="outline" className="ml-2">iOS User Analysis</Badge>
                  </div>
                  
                  <div className="relative overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted">
                        <tr>
                          <th scope="col" className="px-4 py-3">Rank</th>
                          <th scope="col" className="px-4 py-3">Organization</th>
                          <th scope="col" className="px-4 py-3">Annual Adoptions</th>
                          <th scope="col" className="px-4 py-3">iOS User %</th>
                          <th scope="col" className="px-4 py-3">Locations</th>
                          <th scope="col" className="px-4 py-3">Partnership Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-bold">1</td>
                          <td className="px-4 py-3 font-medium">ASPCA</td>
                          <td className="px-4 py-3">182,500</td>
                          <td className="px-4 py-3">73%</td>
                          <td className="px-4 py-3">350+</td>
                          <td className="px-4 py-3"><Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">In Discussion</Badge></td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-bold">2</td>
                          <td className="px-4 py-3 font-medium">Humane Society</td>
                          <td className="px-4 py-3">167,000</td>
                          <td className="px-4 py-3">68%</td>
                          <td className="px-4 py-3">250+</td>
                          <td className="px-4 py-3"><Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge></td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-bold">3</td>
                          <td className="px-4 py-3 font-medium">Best Friends Animal Society</td>
                          <td className="px-4 py-3">98,300</td>
                          <td className="px-4 py-3">65%</td>
                          <td className="px-4 py-3">120+</td>
                          <td className="px-4 py-3"><Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge></td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-bold">4</td>
                          <td className="px-4 py-3 font-medium">North Shore Animal League</td>
                          <td className="px-4 py-3">75,200</td>
                          <td className="px-4 py-3">82%</td>
                          <td className="px-4 py-3">50+</td>
                          <td className="px-4 py-3"><Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge></td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-bold">5</td>
                          <td className="px-4 py-3 font-medium">PetSmart Charities</td>
                          <td className="px-4 py-3">65,400</td>
                          <td className="px-4 py-3">59%</td>
                          <td className="px-4 py-3">1,600+</td>
                          <td className="px-4 py-3"><Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Outreach Planned</Badge></td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-bold">6</td>
                          <td className="px-4 py-3 font-medium">Animal Welfare League</td>
                          <td className="px-4 py-3">58,700</td>
                          <td className="px-4 py-3">70%</td>
                          <td className="px-4 py-3">75+</td>
                          <td className="px-4 py-3"><Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Outreach Planned</Badge></td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold">7</td>
                          <td className="px-4 py-3 font-medium">Petco Love</td>
                          <td className="px-4 py-3">52,300</td>
                          <td className="px-4 py-3">62%</td>
                          <td className="px-4 py-3">1,500+</td>
                          <td className="px-4 py-3"><Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Outreach Planned</Badge></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Regional Adoption Networks by Scale</h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Northeast Animal Shelters Alliance</h4>
                          <Badge>Top Regional</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Annual Adoptions:</p>
                            <p className="font-medium">42,300</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">iOS Users:</p>
                            <p className="font-medium">78%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">States Covered:</p>
                            <p className="font-medium">9</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Integration Status:</p>
                            <p className="font-medium text-green-600">Integrated</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">Key facilities in NY, MA, CT, VT, ME, NH, RI, NJ, PA with strong iOS device presence.</p>
                        </div>
                      </div>

                      <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Western States Rescue Coalition</h4>
                          <Badge>Top Regional</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Annual Adoptions:</p>
                            <p className="font-medium">38,700</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">iOS Users:</p>
                            <p className="font-medium">72%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">States Covered:</p>
                            <p className="font-medium">5</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Integration Status:</p>
                            <p className="font-medium text-amber-600">In Progress</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">Major presence in CA, WA, OR, NV, AZ with high technology adoption rates and app usage.</p>
                        </div>
                      </div>

                      <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Southern Rescue Network</h4>
                          <Badge>Rising Regional</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Annual Adoptions:</p>
                            <p className="font-medium">34,500</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">iOS Users:</p>
                            <p className="font-medium">58%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">States Covered:</p>
                            <p className="font-medium">7</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Integration Status:</p>
                            <p className="font-medium text-blue-600">Planned Q3</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">Growing network across TX, FL, GA, TN, NC, SC, AL with rapidly increasing iPhone adoption.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Specialized & Breed-Specific Organizations</h3>
                    
                    <div className="space-y-4">
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Organization</TableHead>
                              <TableHead>Focus</TableHead>
                              <TableHead>Annual Adoptions</TableHead>
                              <TableHead>iOS %</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">National Greyhound Adoption</TableCell>
                              <TableCell>Greyhounds</TableCell>
                              <TableCell>18,200</TableCell>
                              <TableCell>86%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">American Lab Rescue</TableCell>
                              <TableCell>Labradors</TableCell>
                              <TableCell>15,700</TableCell>
                              <TableCell>73%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Golden Retriever Rescue Alliance</TableCell>
                              <TableCell>Golden Retrievers</TableCell>
                              <TableCell>14,500</TableCell>
                              <TableCell>81%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Siamese Cat Rescue Center</TableCell>
                              <TableCell>Siamese Cats</TableCell>
                              <TableCell>12,300</TableCell>
                              <TableCell>84%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Pit Bull Project</TableCell>
                              <TableCell>Pit Bulls</TableCell>
                              <TableCell>11,800</TableCell>
                              <TableCell>65%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Persian & Himalayan Rescue</TableCell>
                              <TableCell>Persian Cats</TableCell>
                              <TableCell>9,700</TableCell>
                              <TableCell>88%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Senior Dog Sanctuary</TableCell>
                              <TableCell>Senior Dogs</TableCell>
                              <TableCell>7,200</TableCell>
                              <TableCell>77%</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>

                      <div className="flex flex-col p-4 bg-muted/30 rounded-lg space-y-3">
                        <h4 className="font-medium">Specialized Organization Insights</h4>
                        <div className="text-sm text-muted-foreground space-y-2">
                          <p>• Breed-specific organizations show the highest iOS usage (avg. 79.1%)</p>
                          <p>• Rescue groups focusing on traditionally expensive breeds show strongest app engagement</p>
                          <p>• Senior pet organizations have the highest retention rate for premium app features</p>
                          <p>• Targeted feature development should prioritize breed-specific health insights</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Emerging Online Adoption Platforms</CardTitle>
                    <CardDescription>Tech platforms reshaping pet adoption that present strong integration opportunities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Award className="h-4 w-4 text-primary" />
                            Adopt-a-Pet.com
                          </CardTitle>
                          <Badge className="mt-2" variant="secondary">Top Online Platform</Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Monthly Visitors:</span>
                            <span className="font-medium">3.2M</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">iOS Users:</span>
                            <span className="font-medium">68%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Annual Adoptions:</span>
                            <span className="font-medium">275,000+</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">API Available:</span>
                            <span className="font-medium text-green-600">Yes</span>
                          </div>
                          <Separator />
                          <div className="pt-2">
                            <h4 className="text-sm font-medium mb-2">Integration Status</h4>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                              </div>
                              <span className="text-xs font-medium">90%</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Final API integration in QA testing</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Award className="h-4 w-4 text-primary" />
                            Petfinder
                          </CardTitle>
                          <Badge className="mt-2" variant="secondary">Top Online Platform</Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Monthly Visitors:</span>
                            <span className="font-medium">3.8M</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">iOS Users:</span>
                            <span className="font-medium">72%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Annual Adoptions:</span>
                            <span className="font-medium">320,000+</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">API Available:</span>
                            <span className="font-medium text-green-600">Yes</span>
                          </div>
                          <Separator />
                          <div className="pt-2">
                            <h4 className="text-sm font-medium mb-2">Integration Status</h4>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                              </div>
                              <span className="text-xs font-medium">60%</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">API integration in development</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Award className="h-4 w-4 text-primary" />
                            RescueMe.org
                          </CardTitle>
                          <Badge className="mt-2" variant="secondary">Emerging Platform</Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Monthly Visitors:</span>
                            <span className="font-medium">1.5M</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">iOS Users:</span>
                            <span className="font-medium">76%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Annual Adoptions:</span>
                            <span className="font-medium">145,000+</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">API Available:</span>
                            <span className="font-medium text-amber-600">Beta</span>
                          </div>
                          <Separator />
                          <div className="pt-2">
                            <h4 className="text-sm font-medium mb-2">Integration Status</h4>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                              </div>
                              <span className="text-xs font-medium">25%</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Early discussions and API exploration</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">First-Year Adoption Platform Integration Roadmap</h3>
                      <div className="relative">
                        <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-muted"></div>
                        <ol className="relative space-y-6">
                          <li className="ml-12">
                            <div className="flex absolute -left-3 justify-center items-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
                              <span className="text-primary">Q1</span>
                            </div>
                            <h4 className="font-medium">Launch with Adopt-a-Pet Integration</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Complete Adopt-a-Pet.com API integration with onboarding flow for new adopters
                            </p>
                            <div className="mt-2 flex gap-2">
                              <Badge variant="outline">275K+ Potential Users</Badge>
                              <Badge variant="outline">68% iOS Users</Badge>
                            </div>
                          </li>
                          <li className="ml-12">
                            <div className="flex absolute -left-3 justify-center items-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
                              <span className="text-primary">Q2</span>
                            </div>
                            <h4 className="font-medium">Add Petfinder & ASPCA Partnership</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Complete Petfinder API integration and formalize ASPCA partnership with in-app branding
                            </p>
                            <div className="mt-2 flex gap-2">
                              <Badge variant="outline">502K+ New Potential Users</Badge>
                              <Badge variant="outline">72-73% iOS Users</Badge>
                            </div>
                          </li>
                          <li className="ml-12">
                            <div className="flex absolute -left-3 justify-center items-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
                              <span className="text-primary">Q3</span>
                            </div>
                            <h4 className="font-medium">Regional Network Integration</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Add Northeast and Western regional networks with specialized care recommendations
                            </p>
                            <div className="mt-2 flex gap-2">
                              <Badge variant="outline">81K+ New Potential Users</Badge>
                              <Badge variant="outline">75% Average iOS Usage</Badge>
                            </div>
                          </li>
                          <li className="ml-12">
                            <div className="flex absolute -left-3 justify-center items-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
                              <span className="text-primary">Q4</span>
                            </div>
                            <h4 className="font-medium">Specialized Organization Focus</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Add breed-specific organizations with customized care plans and training modules
                            </p>
                            <div className="mt-2 flex gap-2">
                              <Badge variant="outline">89K+ New Potential Users</Badge>
                              <Badge variant="outline">80%+ iOS Users</Badge>
                              <Badge variant="outline">Highest Premium Conversion</Badge>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-primary" />
                      Promo Code Strategy
                    </CardTitle>
                    <CardDescription>
                      App Store Connect promo code distribution plan for adoption organizations and social media communities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Tiered Partnership Program</h3>
                        <div className="space-y-4">
                          <div className="border rounded-lg">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Partner Tier</TableHead>
                                  <TableHead>Annual Adoptions</TableHead>
                                  <TableHead>Promo Codes</TableHead>
                                  <TableHead>Free Months</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Platinum</TableCell>
                                  <TableCell>100,000+</TableCell>
                                  <TableCell>5,000</TableCell>
                                  <TableCell>6 months</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Gold</TableCell>
                                  <TableCell>50,000-99,999</TableCell>
                                  <TableCell>2,500</TableCell>
                                  <TableCell>4 months</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Silver</TableCell>
                                  <TableCell>20,000-49,999</TableCell>
                                  <TableCell>1,000</TableCell>
                                  <TableCell>3 months</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Bronze</TableCell>
                                  <TableCell>5,000-19,999</TableCell>
                                  <TableCell>500</TableCell>
                                  <TableCell>2 months</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Community</TableCell>
                                  <TableCell>&lt;5,000</TableCell>
                                  <TableCell>100</TableCell>
                                  <TableCell>1 month</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                          
                          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <h4 className="font-medium">Implementation Timeline</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <p>• <span className="font-medium">Month 1:</span> Onboard Platinum & Gold partners (ASPCA, Humane Society, Petfinder)</p>
                              <p>• <span className="font-medium">Month 2:</span> Expand to Silver partners and key regional networks</p>
                              <p>• <span className="font-medium">Month 3:</span> Roll out to Bronze partners and breed-specific organizations</p>
                              <p>• <span className="font-medium">Month 4:</span> Extend to Community partners and social media groups</p>
                              <p>• <span className="font-medium">Quarterly:</span> Refresh code batches and analyze conversion metrics</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Adoption Packet Integration</h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <h4 className="font-medium">Digital Welcome Kit</h4>
                            <p className="text-sm text-muted-foreground">Custom digital welcome packets sent to new pet parents that include:</p>
                            <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                              <li>Unique App Store promo code for premium subscription</li>
                              <li>Breed-specific care guide generated by our AI</li>
                              <li>Personalized training guide for their specific pet</li>
                              <li>First health assessment questionnaire</li>
                              <li>Calendar integration for vaccination schedule</li>
                            </ul>
                            <div className="mt-3 flex items-center">
                              <Badge className="bg-green-100 text-green-800">Expected Conversion: 72%</Badge>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <h4 className="font-medium">Physical Adoption Materials</h4>
                            <p className="text-sm text-muted-foreground">QR code integration into physical adoption paperwork:</p>
                            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                              <div>
                                <p className="font-medium">Adoption Certificate</p>
                                <p className="text-muted-foreground">QR code placement with unique promo</p>
                              </div>
                              <div>
                                <p className="font-medium">Pet ID Tags</p>
                                <p className="text-muted-foreground">NFC + QR with emergency info + app</p>
                              </div>
                              <div>
                                <p className="font-medium">Health Records</p>
                                <p className="text-muted-foreground">Direct import via promo code</p>
                              </div>
                              <div>
                                <p className="font-medium">Care Guides</p>
                                <p className="text-muted-foreground">App extension of printed materials</p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center">
                              <Badge className="bg-green-100 text-green-800">Expected Conversion: 65%</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Social Media Promo Strategy</h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <h4 className="font-medium">Facebook Group Campaigns</h4>
                            <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                              <li><span className="font-medium">Exclusive Group Offers:</span> Unique promo code batches for each major iOS pet Facebook group</li>
                              <li><span className="font-medium">Admin Partnerships:</span> Special extended codes (6 months) for group admins to distribute</li>
                              <li><span className="font-medium">Member Milestones:</span> Celebrate group membership milestones with time-limited code drops</li>
                              <li><span className="font-medium">Weekly Threads:</span> Sponsor dedicated threads with featured functionality + codes</li>
                            </ul>
                            <div className="mt-2 flex items-center">
                              <Zap className="h-4 w-4 text-amber-500 mr-2" />
                              <span className="text-sm">Weekly Code Allocation: 250 codes across top groups</span>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <h4 className="font-medium">Instagram & TikTok Campaigns</h4>
                            <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                              <li><span className="font-medium">Pet Influencer Partnerships:</span> Custom landing pages with unique codes for each influencer</li>
                              <li><span className="font-medium">Story Highlights:</span> 24-hour code drops through Stories with 2-month subscriptions</li>
                              <li><span className="font-medium">Live Unboxing:</span> Influencers showcase app features with exclusive viewer codes</li>
                              <li><span className="font-medium">Comment-to-Win:</span> Limited code batches for engagement on feature posts</li>
                            </ul>
                            <div className="mt-2 flex items-center">
                              <Zap className="h-4 w-4 text-amber-500 mr-2" />
                              <span className="text-sm">Monthly Budget: 1,000 codes across top 50 influencers</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-4">App Store Connect Implementation</h3>
                        <div className="space-y-4">
                          <div className="relative overflow-x-auto rounded-lg border">
                            <table className="w-full text-sm text-left">
                              <thead className="text-xs uppercase bg-muted">
                                <tr>
                                  <th scope="col" className="px-4 py-3">Promo Type</th>
                                  <th scope="col" className="px-4 py-3">Generation</th>
                                  <th scope="col" className="px-4 py-3">Tracking</th>
                                  <th scope="col" className="px-4 py-3">Analytics</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b">
                                  <td className="px-4 py-3 font-medium">Custom Offer Codes</td>
                                  <td className="px-4 py-3">App Store Connect</td>
                                  <td className="px-4 py-3">Organization ID</td>
                                  <td className="px-4 py-3">Conversion by source</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="px-4 py-3 font-medium">One-Time Use</td>
                                  <td className="px-4 py-3">Batch generation</td>
                                  <td className="px-4 py-3">Unique per user</td>
                                  <td className="px-4 py-3">Redemption rate</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="px-4 py-3 font-medium">First-Party Codes</td>
                                  <td className="px-4 py-3">App backend</td>
                                  <td className="px-4 py-3">Custom campaigns</td>
                                  <td className="px-4 py-3">Feature usage</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-3 font-medium">Automated Distribution</td>
                                  <td className="px-4 py-3">API-based</td>
                                  <td className="px-4 py-3">Shelter CRM</td>
                                  <td className="px-4 py-3">Long-term retention</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          
                          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <h4 className="font-medium">Technical Implementation</h4>
                            <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                              <li><span className="font-medium">Code Generation System:</span> Automated weekly batches through App Store Connect API</li>
                              <li><span className="font-medium">Distribution Dashboard:</span> Partner portal for code batch management and redemption tracking</li>
                              <li><span className="font-medium">User Cohort Tracking:</span> Analytics segmentation by acquisition source and code type</li>
                              <li><span className="font-medium">Conversion Funnel:</span> Optimized onboarding flow for promo code activations with minimal friction</li>
                            </ul>
                            <div className="mt-3">
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                              </div>
                              <div className="flex justify-between mt-1 text-xs">
                                <span>Integration Progress: 65%</span>
                                <span>Est. Completion: Q2 2025</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-muted/30 rounded-lg space-y-2 mt-4">
                            <h4 className="font-medium flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              Expected Outcomes
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="font-medium">Year 1 Codes</p>
                                <p className="text-xl font-bold text-primary">25,000</p>
                              </div>
                              <div>
                                <p className="font-medium">Adoption Reach</p>
                                <p className="text-xl font-bold text-primary">15%</p>
                              </div>
                              <div>
                                <p className="font-medium">Conversion Rate</p>
                                <p className="text-xl font-bold text-primary">68%</p>
                              </div>
                              <div>
                                <p className="font-medium">Annual Revenue Impact</p>
                                <p className="text-xl font-bold text-primary">$450K</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Competitive Analysis
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis of similar pet care apps and subscription models in major pet markets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Top Competing Apps by Market Share</h3>
                  
                  <div className="relative overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted">
                        <tr>
                          <th scope="col" className="px-4 py-3">App</th>
                          <th scope="col" className="px-4 py-3">Primary Features</th>
                          <th scope="col" className="px-4 py-3">Subscription Model</th>
                          <th scope="col" className="px-4 py-3">Monthly Price (USD)</th>
                          <th scope="col" className="px-4 py-3">Annual (USD)</th>
                          <th scope="col" className="px-4 py-3">Trial Period</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-medium">Rover</td>
                          <td className="px-4 py-3">Pet sitting, dog walking, boarding</td>
                          <td className="px-4 py-3">Commission-based (20%)</td>
                          <td className="px-4 py-3">N/A</td>
                          <td className="px-4 py-3">N/A</td>
                          <td className="px-4 py-3">N/A</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-medium">Wag!</td>
                          <td className="px-4 py-3">Dog walking, pet care, veterinary guidance</td>
                          <td className="px-4 py-3">Premium + Commission</td>
                          <td className="px-4 py-3">$9.99</td>
                          <td className="px-4 py-3">$99.99</td>
                          <td className="px-4 py-3">7 days</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-medium">11pets: Pet Care</td>
                          <td className="px-4 py-3">Pet health records, reminders, grooming tracking</td>
                          <td className="px-4 py-3">Freemium + Pro</td>
                          <td className="px-4 py-3">$4.99</td>
                          <td className="px-4 py-3">$39.99</td>
                          <td className="px-4 py-3">14 days</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-medium">Petcube</td>
                          <td className="px-4 py-3">Pet monitoring, camera video history, vet chat</td>
                          <td className="px-4 py-3">Tiered (Basic, Premium, Care)</td>
                          <td className="px-4 py-3">$3.99-$14.99</td>
                          <td className="px-4 py-3">$29.99-$149.99</td>
                          <td className="px-4 py-3">30 days</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-medium">Tractive GPS</td>
                          <td className="px-4 py-3">Pet tracking, activity monitoring, safe zones</td>
                          <td className="px-4 py-3">Basic, Premium, Health</td>
                          <td className="px-4 py-3">$12.99-$19.99</td>
                          <td className="px-4 py-3">$83.88-$119.88</td>
                          <td className="px-4 py-3">None</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-medium">Petdesk</td>
                          <td className="px-4 py-3">Vet appointments, reminders, medical records</td>
                          <td className="px-4 py-3">Free + Premium</td>
                          <td className="px-4 py-3">$4.99</td>
                          <td className="px-4 py-3">$49.99</td>
                          <td className="px-4 py-3">14 days</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-medium">DogLog</td>
                          <td className="px-4 py-3">Activity tracking, feeding, medication logs</td>
                          <td className="px-4 py-3">Basic, Premium</td>
                          <td className="px-4 py-3">$3.99</td>
                          <td className="px-4 py-3">$29.99</td>
                          <td className="px-4 py-3">7 days</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium">Pawprint</td>
                          <td className="px-4 py-3">Health records, vet integration, reminders</td>
                          <td className="px-4 py-3">Freemium + Premium</td>
                          <td className="px-4 py-3">$7.99</td>
                          <td className="px-4 py-3">$59.99</td>
                          <td className="px-4 py-3">14 days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Detailed Competitor Feature Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <CircleDollarSign className="h-5 w-5 text-primary" />
                            Rover - Service Marketplace
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Core Functionality:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Marketplace connecting pet owners with service providers</li>
                              <li>Pet service booking system with calendar integration</li>
                              <li>In-app messaging and photo/video updates</li>
                              <li>GPS tracking of dog walks</li>
                              <li>Secure payment processing</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Strengths:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Largest network of verified pet sitters (250,000+)</li>
                              <li>$25,000 veterinary guarantee policy</li>
                              <li>24/7 support with veterinary professionals</li>
                              <li>Digital owner dashboards for multi-pet families</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Weaknesses:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Limited health tracking capabilities</li>
                              <li>No AI-powered features or recommendations</li>
                              <li>No training modules or guidance</li>
                              <li>High commission fees frustrate providers</li>
                            </ul>
                          </div>
                          <div className="mt-3">
                            <Badge className="bg-blue-100 text-blue-800">Market Share: ~42%</Badge>
                            <Badge className="ml-2 bg-green-100 text-green-800">MAU: 2.4M</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Stethoscope className="h-5 w-5 text-primary" />
                            Petdesk - Vet Management
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Core Functionality:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Digital pet health records storage</li>
                              <li>Vet appointment scheduling and reminders</li>
                              <li>Medication tracking and refill requests</li>
                              <li>Vaccination scheduling and records</li>
                              <li>Vet clinic integration</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Strengths:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Strong integration with 2,500+ veterinary clinics</li>
                              <li>Automated reminders for appointments and medications</li>
                              <li>Digital two-way messaging with vet clinics</li>
                              <li>Multi-pet management with individualized records</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Weaknesses:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Limited to medical management only</li>
                              <li>Basic user interface with limited customization</li>
                              <li>No social sharing capabilities</li>
                              <li>Minimal nutrition or training guidance</li>
                            </ul>
                          </div>
                          <div className="mt-3">
                            <Badge className="bg-blue-100 text-blue-800">Market Share: ~18%</Badge>
                            <Badge className="ml-2 bg-green-100 text-green-800">MAU: 850K</Badge>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Tractive GPS - Location Tracking
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Core Functionality:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Real-time GPS tracking with unlimited range</li>
                              <li>Virtual fence with alerts when pet leaves safe zone</li>
                              <li>Activity monitoring and fitness tracking</li>
                              <li>Location history and heatmaps</li>
                              <li>Battery status monitoring and alerts</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Strengths:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Hardware integration with dedicated tracker device</li>
                              <li>Family sharing with up to 10 people</li>
                              <li>Advanced location technology with coverage in 175+ countries</li>
                              <li>Offline mode for areas with poor connectivity</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Weaknesses:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Requires physical device purchase ($49.99-$99.99)</li>
                              <li>Limited to tracking functionality</li>
                              <li>No health or wellness features</li>
                              <li>Battery life constraints (2-7 days depending on usage)</li>
                            </ul>
                          </div>
                          <div className="mt-3">
                            <Badge className="bg-blue-100 text-blue-800">Market Share: ~14%</Badge>
                            <Badge className="ml-2 bg-green-100 text-green-800">MAU: 620K</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Camera className="h-5 w-5 text-primary" />
                            Petcube - Remote Monitoring
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Core Functionality:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Live HD video streaming with connected cameras</li>
                              <li>Two-way audio communication</li>
                              <li>Motion and sound detection with alerts</li>
                              <li>Pet recognition AI to distinguish pets from humans</li>
                              <li>Treat dispensing (with compatible hardware)</li>
                              <li>Veterinary telehealth connection</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Strengths:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>30-day video history and clip sharing</li>
                              <li>Advanced AI motion detection algorithms</li>
                              <li>Emergency vet assistance (subscription plans)</li>
                              <li>Smart alerts for unusual behavior patterns</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Weaknesses:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Requires hardware purchase ($199+)</li>
                              <li>Limited to monitoring functionality</li>
                              <li>No comprehensive health records</li>
                              <li>High-tier subscription needed for advanced features</li>
                            </ul>
                          </div>
                          <div className="mt-3">
                            <Badge className="bg-blue-100 text-blue-800">Market Share: ~10%</Badge>
                            <Badge className="ml-2 bg-green-100 text-green-800">MAU: 580K</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">AI-Powered Pet Apps Analysis</h3>
                    
                    <div className="space-y-4">
                      <Card className="overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <SearchCode className="h-5 w-5 text-primary" />
                            Pet-ID: AI Pet Recognition
                          </CardTitle>
                          <CardDescription>Computer vision for pet identification</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Monthly Price:</p>
                              <p className="font-medium">$4.99</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Annual Price:</p>
                              <p className="font-medium">$39.99</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">User Satisfaction:</p>
                              <p className="font-medium">4.2/5.0 (10,800 reviews)</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">AI Model Type:</p>
                              <p className="font-medium">Proprietary CNN</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mt-3">
                            <h4 className="text-sm font-semibold">Key Features:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Lost pet identification with 94% claimed accuracy</li>
                              <li>Community-based lost pet alert network</li>
                              <li>Breed identification from photos</li>
                              <li>Facial feature matching for similar pets</li>
                              <li>Integrated pet registry with microchip lookup</li>
                            </ul>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">AI Capabilities:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Visual pattern recognition for distinguishing similar breeds</li>
                              <li>Distinctive marking identification in varied lighting</li>
                              <li>Fur coloration and pattern matching algorithms</li>
                              <li>Aging adjustment to accommodate growth changes</li>
                              <li>Limited to visual identification with no health analytics</li>
                            </ul>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div>
                              <Badge className="bg-yellow-100 text-yellow-800">Market Share: 12%</Badge>
                              <Badge className="ml-2 bg-blue-100 text-blue-800">MAU: 450K</Badge>
                            </div>
                            <div className="text-xs">
                              <span className="text-green-600 font-medium">+23% YoY Growth</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Petty AI: Behavior Analysis
                          </CardTitle>
                          <CardDescription>Machine learning for pet behavior prediction</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Monthly Price:</p>
                              <p className="font-medium">$9.99</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Annual Price:</p>
                              <p className="font-medium">$89.99</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">User Satisfaction:</p>
                              <p className="font-medium">3.8/5.0 (7,200 reviews)</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">AI Model Type:</p>
                              <p className="font-medium">Reinforcement Learning</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mt-3">
                            <h4 className="text-sm font-semibold">Key Features:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Behavior pattern recognition and prediction</li>
                              <li>Customized training recommendations by breed</li>
                              <li>Emotional state interpretation from video</li>
                              <li>Anxiety and stress detection systems</li>
                              <li>Personalized behavior modification plans</li>
                            </ul>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">AI Capabilities:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Pattern analysis from video footage</li>
                              <li>Movement and posture interpretation</li>
                              <li>Behavior categorization with breed-specific adjustments</li>
                              <li>Predictive modeling for behavior triggers</li>
                              <li>Limited to canines with no feline algorithms</li>
                            </ul>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div>
                              <Badge className="bg-yellow-100 text-yellow-800">Market Share: 8%</Badge>
                              <Badge className="ml-2 bg-blue-100 text-blue-800">MAU: 320K</Badge>
                            </div>
                            <div className="text-xs">
                              <span className="text-green-600 font-medium">+17% YoY Growth</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Stethoscope className="h-5 w-5 text-primary" />
                            VetAI Assistant
                          </CardTitle>
                          <CardDescription>Advanced diagnostics and health analysis</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Monthly Price:</p>
                              <p className="font-medium">$14.99</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Annual Price:</p>
                              <p className="font-medium">$119.99</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">User Satisfaction:</p>
                              <p className="font-medium">4.5/5.0 (5,400 reviews)</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">AI Model Type:</p>
                              <p className="font-medium">Medical NLP + Computer Vision</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mt-3">
                            <h4 className="text-sm font-semibold">Key Features:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Symptom analysis through photo/video input</li>
                              <li>Medical condition prediction based on symptoms</li>
                              <li>Dietary recommendations for health conditions</li>
                              <li>Integration with 1,200+ veterinary practices</li>
                              <li>Medication reminder and dosage management</li>
                              <li>Real-time veterinary telehealth connection</li>
                            </ul>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">AI Capabilities:</h4>
                            <ul className="list-disc pl-4 text-sm space-y-1">
                              <li>Veterinary database with 1,500+ conditions</li>
                              <li>Medical image recognition for skin/eye conditions</li>
                              <li>Condition probability analysis (75-85% claimed accuracy)</li>
                              <li>Electronic health record integration</li>
                              <li>Diagnostic prediction using multi-modal inputs</li>
                            </ul>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div>
                              <Badge className="bg-yellow-100 text-yellow-800">Market Share: 6%</Badge>
                              <Badge className="ml-2 bg-blue-100 text-blue-800">MAU: 275K</Badge>
                            </div>
                            <div className="text-xs">
                              <span className="text-green-600 font-medium">+31% YoY Growth</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="p-4 bg-muted/30 rounded-lg mt-4">
                        <h4 className="font-medium mb-2">AI Integration Competitor Analysis</h4>
                        <div className="text-sm space-y-4">
                          <div>
                            <h5 className="text-xs font-semibold uppercase text-muted-foreground">Key Points of Differentiation</h5>
                            <ul className="list-disc pl-4 mt-1 space-y-1">
                              <li><span className="font-medium">Siloed Functionality:</span> All competitors focus on single AI use cases rather than integrated platforms</li>
                              <li><span className="font-medium">Limited Species Support:</span> Most AI apps only support dogs and common cat breeds</li>
                              <li><span className="font-medium">Hardware Dependencies:</span> Many require additional devices or accessories</li>
                              <li><span className="font-medium">Data Isolation:</span> No cross-functional data analysis between health, behavior, and training</li>
                            </ul>
                          </div>
                          
                          <div className="mt-3">
                            <h5 className="text-xs font-semibold uppercase text-muted-foreground">PetCare AI Advantage</h5>
                            <ul className="list-disc pl-4 mt-1 space-y-1">
                              <li>Unified AI platform combining visual analysis, health assessment, training, and behavior in one system</li>
                              <li>Multi-species support including dogs, cats, birds, small mammals, and reptiles</li>
                              <li>AI-powered injury assessment with no industry equivalent</li>
                              <li>Cross-functional data utilization for holistic health and wellness recommendations</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Subscription Model Trends by Market</h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                        <h4 className="font-medium">United States</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                          <li><span className="font-medium">Dominant Model:</span> Freemium + Premium tiers (72% of top apps)</li>
                          <li><span className="font-medium">Average Monthly Price:</span> $8.99</li>
                          <li><span className="font-medium">Average Annual Price:</span> $79.99 (26% discount vs. monthly)</li>
                          <li><span className="font-medium">Trial Period:</span> 14 days standard</li>
                          <li><span className="font-medium">Trending:</span> Health-specific tiers with vet telehealth (+35% YoY)</li>
                        </ul>
                        <div className="mt-2">
                          <h5 className="text-sm font-medium mb-1">Price Sensitivity Analysis</h5>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs">
                            <span>Conversion drops dramatically above $12.99/month</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                        <h4 className="font-medium">European Markets (UK, Germany, France)</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                          <li><span className="font-medium">Dominant Model:</span> Simpler two-tier system (68% of top apps)</li>
                          <li><span className="font-medium">Average Monthly Price:</span> €7.99 (~$8.65)</li>
                          <li><span className="font-medium">Average Annual Price:</span> €69.99 (~$75.85, 32% discount)</li>
                          <li><span className="font-medium">Trial Period:</span> 7-14 days</li>
                          <li><span className="font-medium">Trending:</span> Family plans for multi-pet households (+58% YoY)</li>
                        </ul>
                        <div className="mt-2">
                          <h5 className="text-sm font-medium mb-1">Price Sensitivity Analysis</h5>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs">
                            <span>Higher tolerance for premium pricing when features are distinct</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                        <h4 className="font-medium">Asian Markets (Japan, South Korea)</h4>
                        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                          <li><span className="font-medium">Dominant Model:</span> Micro-transaction + base subscription (63%)</li>
                          <li><span className="font-medium">Average Monthly Price:</span> ¥980 (~$6.50)</li>
                          <li><span className="font-medium">Average Annual Price:</span> ¥9,800 (~$65.00, 17% discount)</li>
                          <li><span className="font-medium">Trial Period:</span> 3-7 days standard</li>
                          <li><span className="font-medium">Trending:</span> Social features and pet community integrations</li>
                        </ul>
                        <div className="mt-2">
                          <h5 className="text-sm font-medium mb-1">Price Sensitivity Analysis</h5>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs">
                            <span>Very price sensitive, prefer smaller recurring purchases</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Competitive Gap Analysis & Positioning</CardTitle>
                    <CardDescription>Identifying key market gaps and proposed pricing strategy</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="relative overflow-x-auto rounded-lg border">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-muted">
                          <tr>
                            <th scope="col" className="px-4 py-3">Feature Category</th>
                            <th scope="col" className="px-4 py-3">Market Gap</th>
                            <th scope="col" className="px-4 py-3">Competitor Coverage</th>
                            <th scope="col" className="px-4 py-3">PetCare AI Advantage</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="px-4 py-3 font-medium">AI Health Analysis</td>
                            <td className="px-4 py-3">Limited offerings with low accuracy (23%)</td>
                            <td className="px-4 py-3"><Badge className="bg-red-100 text-red-800">Low</Badge></td>
                            <td className="px-4 py-3">Advanced image analysis with breed-specific health guidance</td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-4 py-3 font-medium">Integrated Training</td>
                            <td className="px-4 py-3">Siloed apps focus on tracking only (17%)</td>
                            <td className="px-4 py-3"><Badge className="bg-red-100 text-red-800">Low</Badge></td>
                            <td className="px-4 py-3">Interactive guides with real-time feedback and adaptive programs</td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-4 py-3 font-medium">Injury Detection</td>
                            <td className="px-4 py-3">No competitor offers (0%)</td>
                            <td className="px-4 py-3"><Badge className="bg-red-100 text-red-800">None</Badge></td>
                            <td className="px-4 py-3">Exclusive feature with high-fidelity image processing and treatment recs</td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-4 py-3 font-medium">Unified Platform</td>
                            <td className="px-4 py-3">Fragmented apps for each function (5%)</td>
                            <td className="px-4 py-3"><Badge className="bg-red-100 text-red-800">Very Low</Badge></td>
                            <td className="px-4 py-3">All-in-one solution with seamless data integration</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 font-medium">Multi-pet Management</td>
                            <td className="px-4 py-3">Available but limited features (41%)</td>
                            <td className="px-4 py-3"><Badge className="bg-yellow-100 text-yellow-800">Medium</Badge></td>
                            <td className="px-4 py-3">Enhanced with species-specific guidance and comparative analysis</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Recommended Pricing Strategy</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-4">
                            <div className="border rounded-lg">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Tier</TableHead>
                                    <TableHead>Monthly</TableHead>
                                    <TableHead>Annual</TableHead>
                                    <TableHead>Features</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="font-medium">Basic</TableCell>
                                    <TableCell>Free</TableCell>
                                    <TableCell>Free</TableCell>
                                    <TableCell>Profile, reminders, basic tracking</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Premium</TableCell>
                                    <TableCell>$9.99</TableCell>
                                    <TableCell>$89.99</TableCell>
                                    <TableCell>Training, nutrition, mood analysis</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Pro</TableCell>
                                    <TableCell>$14.99</TableCell>
                                    <TableCell>$129.99</TableCell>
                                    <TableCell>All + injury scanner, vet consults</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Family</TableCell>
                                    <TableCell>$19.99</TableCell>
                                    <TableCell>$179.99</TableCell>
                                    <TableCell>All Pro + unlimited pets + priority</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                            <h4 className="font-medium mb-2">Trial Period Strategy</h4>
                            <ul className="list-disc pl-4 space-y-1">
                              <li>14-day full-feature trial for all paid tiers</li>
                              <li>Extended 30-day trials through adoption partnerships</li>
                              <li>Feature-limited trial with key value demonstrations</li>
                              <li>Conversion-optimized onboarding showing AI capabilities</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Market-Specific Adjustments</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="border rounded-lg">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Market</TableHead>
                                  <TableHead>Pricing Strategy</TableHead>
                                  <TableHead>Feature Emphasis</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">United States</TableCell>
                                  <TableCell>Standard pricing</TableCell>
                                  <TableCell>Health + training integration</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">European</TableCell>
                                  <TableCell>€8.99/€12.99/€17.99</TableCell>
                                  <TableCell>Family plans, multiple pets</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Japan</TableCell>
                                  <TableCell>¥880/¥1,280/¥1,980</TableCell>
                                  <TableCell>Social sharing, achievement badges</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Australia</TableCell>
                                  <TableCell className="px-4 py-3">A$12.99/A$18.99/A$24.99</TableCell>
                                  <TableCell>Outdoor/activity focus</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                          
                          <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                            <h4 className="font-medium mb-2">Competitor Response Prediction</h4>
                            <ul className="list-disc pl-4 space-y-1">
                              <li><span className="font-medium">Short-term:</span> Price-matching within 3-6 months from Petdesk and 11pets</li>
                              <li><span className="font-medium">Mid-term:</span> Basic AI feature addition without comprehensive integration</li>
                              <li><span className="font-medium">Long-term:</span> Potential acquisition interest from Rover or Wag</li>
                            </ul>
                            <div className="mt-3">
                              <h5 className="text-xs font-semibold">Competitive Moat Timeline</h5>
                              <div className="w-full bg-muted rounded-full h-2 mt-1">
                                <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                              </div>
                              <div className="flex justify-between mt-1 text-xs">
                                <span>Projected 18-24 month lead with advanced AI features</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="future-features" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Future Features & Enhancements
                </CardTitle>
                <CardDescription>
                  Strategic roadmap of upcoming features and partnerships to expand PetCare AI's capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Partnership Integrations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-l-4 border-l-blue-500">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <CircleDollarSign className="h-5 w-5 text-blue-500" />
                              Pet Food Company Integration
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">
                              Partner with premium pet food brands to provide personalized nutrition recommendations based on pet profiles, with seamless ordering directly through the app.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Badge variant="outline" className="bg-blue-50">Revenue Share</Badge>
                              <Badge variant="outline" className="bg-blue-50">Q3 2025</Badge>
                              <Badge variant="outline" className="bg-blue-50">High Priority</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-l-4 border-l-green-500">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <PawPrint className="h-5 w-5 text-green-500" />
                              Groomer Marketplace
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">
                              Create a grooming service marketplace where users can book appointments with verified groomers, with cross-schedule management between pet owners and service providers. Commission-based revenue model on completed sessions.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Badge variant="outline" className="bg-green-50">15% Commission</Badge>
                              <Badge variant="outline" className="bg-green-50">Q2 2025</Badge>
                              <Badge variant="outline" className="bg-green-50">Medium Priority</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-l-4 border-l-purple-500">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Award className="h-5 w-5 text-purple-500" />
                              Trainer Marketplace
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">
                              Expand the platform with certified pet trainers for both virtual and in-person sessions, with synchronized scheduling between trainers and pet owners. Revenue through commission on booked training sessions.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Badge variant="outline" className="bg-purple-50">12% Commission</Badge>
                              <Badge variant="outline" className="bg-purple-50">Q4 2025</Badge>
                              <Badge variant="outline" className="bg-purple-50">Medium Priority</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-l-4 border-l-red-500">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Stethoscope className="h-5 w-5 text-red-500" />
                              Veterinary Telemedicine
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">
                              Partner with licensed veterinarians to offer virtual consultations through the app, with appointment management and integration with our health assessment data. Commission structure on consultations.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Badge variant="outline" className="bg-red-50">10% Commission</Badge>
                              <Badge variant="outline" className="bg-red-50">Q1 2026</Badge>
                              <Badge variant="outline" className="bg-red-50">High Priority</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-l-4 border-l-amber-500">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-amber-500" />
                              Pet Sitter & Housing Network
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">
                              Develop a platform for connecting pet owners with verified pet sitters and boarding facilities, including reviews, background checks, and secure payment processing.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Badge variant="outline" className="bg-amber-50">15% Commission</Badge>
                              <Badge variant="outline" className="bg-amber-50">Q2 2026</Badge>
                              <Badge variant="outline" className="bg-amber-50">Medium Priority</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Enhanced Pet Care Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Camera className="h-5 w-5 text-primary" />
                              Missing Pet Alert System
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Advanced missing pet alert feature with geolocation targeting, social media integration, and automated distribution of pet details and images to local shelters and community groups.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Progress</span>
                                  <span>40%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q1 2025</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Activity className="h-5 w-5 text-primary" />
                              Mood Tracking Timeline
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Enhanced pet mood tracking with timestamped entries, pattern recognition, and correlation with activities, diet, and health metrics to identify trends in pet well-being.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Progress</span>
                                  <span>25%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q2 2025</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                              Interactive Training Progression
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Detailed step-by-step training guides with interactive checkpoints, progress tracking, achievement milestones, and customized timelines based on pet breed, age, and learning pace.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Progress</span>
                                  <span>60%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q3 2025</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <LineChart className="h-5 w-5 text-primary" />
                              Health Assessment Analytics
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Comprehensive health data storage and analysis system to track trends in pet health over time, with visualizations, alerts for concerning patterns, and exportable reports for veterinarians.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Progress</span>
                                  <span>30%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-primary h-2 rounded-full" style={{ width: "30%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q4 2025</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <SearchCode className="h-5 w-5 text-primary" />
                              Expanded Health Assessment
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Enhanced health assessment system with age-specific questions focusing on sensory issues (hearing, vision), mobility problems (limping, joint pain), and cognitive concerns for older pets, with AI-driven recommendations.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Progress</span>
                                  <span>15%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-primary h-2 rounded-full" style={{ width: "15%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q1 2026</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Advanced Healthcare Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <BrainCircuit className="h-5 w-5 text-primary" />
                              AI-powered Symptom Checker
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Preliminary diagnostic tool that uses machine learning to analyze symptoms and recommend whether a vet visit is urgent or can wait, reducing unnecessary emergency visits.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Priority</span>
                                  <span>High</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-red-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q2 2025</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Bot className="h-5 w-5 text-primary" />
                              Smart Medication Reminders
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Advanced medication tracking with dose adjustments based on pet weight, with barcode scanning for prescription refills and integration with pharmacy delivery services.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Priority</span>
                                  <span>Medium</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q3 2025</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-primary" />
                              Seasonal Health Alerts
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Location-based notifications about seasonal health risks (tick season, pollen allergies, heat warnings) with customized recommendations based on pet breed and health history.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Priority</span>
                                  <span>Medium</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "55%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q4 2025</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Technology & Integration Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Activity className="h-5 w-5 text-primary" />
                              Smart Pet Wearable Integration
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Connect with third-party pet fitness trackers and health monitors to gather real-time data on activity, heart rate, and sleep quality for comprehensive health dashboards.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Priority</span>
                                  <span>High</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-red-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q1 2025</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <MessageCircle className="h-5 w-5 text-primary" />
                              Voice Command System
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Voice interface for hands-free operation when users are handling their pets, including command recognition for logging health events, scheduling reminders, and searching information.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Priority</span>
                                  <span>Medium</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "50%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q3 2025</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Users className="h-5 w-5 text-primary" />
                              Multi-Pet Dashboard
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Enhanced UI for households with multiple pets showing comparative health metrics, care schedules, and shared activities for more efficient pet care management.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Priority</span>
                                  <span>High</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-red-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q2 2025</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Community & Social Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <PawPrint className="h-5 w-5 text-primary" />
                              Pet Socializing Network
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Match pets in the same area for playdates based on temperament, size, and energy level compatibility, with secure messaging and pet profile verification.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Priority</span>
                                  <span>Medium</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "55%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q1 2026</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Stethoscope className="h-5 w-5 text-primary" />
                              Expert Q&A Platform
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Premium subscription feature providing direct access to certified veterinarians and trainers for non-emergency questions, with guaranteed response times.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Priority</span>
                                  <span>High</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-red-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q2 2026</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Terminal className="h-5 w-5 text-primary" />
                              Breed-Specific Communities
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Forums and resources tailored to specific breeds' needs and common health issues, with expert-moderated discussions and specialized care guidelines.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Priority</span>
                                  <span>Medium</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q3 2026</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Business & Revenue Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <CircleDollarSign className="h-5 w-5 text-primary" />
                              Pet Insurance Marketplace
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Compare and purchase pet insurance plans directly through the app with custom recommendations based on breed health risks and historical health data.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Priority</span>
                                  <span>High</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-red-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q3 2025</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Award className="h-5 w-5 text-primary" />
                              Loyalty Program
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Gamification system with points for consistent app usage that can be redeemed for partner products or subscription discounts, increasing engagement and retention.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Priority</span>
                                  <span>Medium</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q4 2025</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Settings className="h-5 w-5 text-primary" />
                              White-Label Solution
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Offer a customized version of the app for vet clinics to provide to their clients, with practice branding and direct communication channels between vets and pet owners.
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Development Priority</span>
                                  <span>Medium</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "40%" }}></div>
                                </div>
                              </div>
                              <Badge className="ml-4" variant="outline">Q1 2026</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Revenue Projections from New Features</h3>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Feature</TableHead>
                                  <TableHead>Revenue Model</TableHead>
                                  <TableHead>Year 1 Projection</TableHead>
                                  <TableHead>Year 2 Projection</TableHead>
                                  <TableHead>Development Cost</TableHead>
                                  <TableHead>ROI Timeline</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Pet Food Integration</TableCell>
                                  <TableCell>7-10% commission</TableCell>
                                  <TableCell>$220K</TableCell>
                                  <TableCell>$450K</TableCell>
                                  <TableCell>$85K</TableCell>
                                  <TableCell>5 months</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Groomer Marketplace</TableCell>
                                  <TableCell>15% commission</TableCell>
                                  <TableCell>$180K</TableCell>
                                  <TableCell>$350K</TableCell>
                                  <TableCell>$110K</TableCell>
                                  <TableCell>8 months</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Trainer Marketplace</TableCell>
                                  <TableCell>12% commission</TableCell>
                                  <TableCell>$150K</TableCell>
                                  <TableCell>$320K</TableCell>
                                  <TableCell>$95K</TableCell>
                                  <TableCell>8 months</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Veterinary Telemedicine</TableCell>
                                  <TableCell>10% commission</TableCell>
                                  <TableCell>$300K</TableCell>
                                  <TableCell>$650K</TableCell>
                                  <TableCell>$160K</TableCell>
                                  <TableCell>7 months</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Pet Sitter Network</TableCell>
                                  <TableCell>15% commission</TableCell>
                                  <TableCell>$210K</TableCell>
                                  <TableCell>$420K</TableCell>
                                  <TableCell>$120K</TableCell>
                                  <TableCell>7 months</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Premium Features</TableCell>
                                  <TableCell>Subscription upgrade</TableCell>
                                  <TableCell>$280K</TableCell>
                                  <TableCell>$550K</TableCell>
                                  <TableCell>$200K</TableCell>
                                  <TableCell>9 months</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Pet Insurance Marketplace</TableCell>
                                  <TableCell>8-12% commission</TableCell>
                                  <TableCell>$250K</TableCell>
                                  <TableCell>$520K</TableCell>
                                  <TableCell>$130K</TableCell>
                                  <TableCell>7 months</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Expert Q&A Platform</TableCell>
                                  <TableCell>Premium subscription</TableCell>
                                  <TableCell>$190K</TableCell>
                                  <TableCell>$380K</TableCell>
                                  <TableCell>$110K</TableCell>
                                  <TableCell>8 months</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">White-Label Solution</TableCell>
                                  <TableCell>Licensing fee</TableCell>
                                  <TableCell>$320K</TableCell>
                                  <TableCell>$680K</TableCell>
                                  <TableCell>$180K</TableCell>
                                  <TableCell>7 months</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="px-8" disabled={isDownloading}>
                {isDownloading ? "Preparing Download..." : "Download Marketing Plan"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleDownloadPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Download as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadHTML}>
                <FileText className="h-4 w-4 mr-2" />
                Download as HTML
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: April 4, 2025
          </p>
        </div>
      </div>
    </div>
  );
}