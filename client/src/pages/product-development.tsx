import { useState } from "react";
import { Header } from "@/components/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Code,
  Database,
  GitPullRequest,
  Globe,
  Layout,
  Layers,
  Lock,
  Smartphone,
  Tag,
  Video,
  Share,
  MessageSquare,
} from "lucide-react";

export default function ProductDevelopmentPage() {
  const [selectedTab, setSelectedTab] = useState("plan");

  // Current date for timeline calculations
  const currentDate = new Date();
  const phaseStartDate = new Date("2025-05-15");
  
  // Calculate days since phase start
  const daysSinceStart = Math.floor(
    (currentDate.getTime() - phaseStartDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Phase duration in days (estimated 14 weeks)
  const phaseDuration = 98;
  
  // Calculate progress percentage (cap at 100%)
  const progressPercentage = Math.min(
    Math.round((daysSinceStart / phaseDuration) * 100),
    100
  );

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl md:text-3xl">
                    Phase 2: Product Development Plan
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Technical roadmap and implementation details for upcoming features
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    Start: May 15, 2025
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-sm px-3 py-1 border-primary text-primary"
                  >
                    Duration: 14 weeks
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Overall Progress: {progressPercentage}%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {daysSinceStart} days since start
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <Tabs
                defaultValue="plan"
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 md:grid-cols-5">
                  <TabsTrigger value="plan">Overview</TabsTrigger>
                  <TabsTrigger value="gtm">GTM Integration</TabsTrigger>
                  <TabsTrigger value="food">Food API Integration</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                  <TabsTrigger value="features">Additional Features</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="plan" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Tag className="h-5 w-5 text-blue-500" />
                          GTM Integration
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Badge className="bg-amber-500">In Progress</Badge>
                          <p className="text-sm text-muted-foreground">
                            Implement Google Tag Manager for comprehensive 
                            analytics and event tracking
                          </p>
                          <div className="pt-2">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>30%</span>
                            </div>
                            <Progress value={30} className="h-1.5 mt-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Database className="h-5 w-5 text-green-500" />
                          Food API Integrations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Badge className="bg-green-500">Completed</Badge>
                          <p className="text-sm text-muted-foreground">
                            Nom Nom for dogs/cats and Amazon Associates API
                            for other animals
                          </p>
                          <div className="pt-2">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>100%</span>
                            </div>
                            <Progress value={100} className="h-1.5 mt-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Share className="h-5 w-5 text-purple-500" />
                          Social Media Sharing
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Badge className="bg-blue-500">Planned</Badge>
                          <p className="text-sm text-muted-foreground">
                            Implement profile sharing functionality with
                            photos and pet information
                          </p>
                          <div className="pt-2">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>0%</span>
                            </div>
                            <Progress value={0} className="h-1.5 mt-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Video className="h-5 w-5 text-red-500" />
                          Vetster Telehealth
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Badge className="bg-blue-500">Planned</Badge>
                          <p className="text-sm text-muted-foreground">
                            Integrate with Vetster Telehealth API for virtual
                            vet consultations
                          </p>
                          <div className="pt-2">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>0%</span>
                            </div>
                            <Progress value={0} className="h-1.5 mt-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Smartphone className="h-5 w-5 text-indigo-500" />
                          Android Development
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Badge className="bg-gray-500">Not Started</Badge>
                          <p className="text-sm text-muted-foreground">
                            Develop native Android app using React Native
                            with feature parity to iOS
                          </p>
                          <div className="pt-2">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>0%</span>
                            </div>
                            <Progress value={0} className="h-1.5 mt-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Timeline</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Feature</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead className="text-right">Team</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-blue-500" />
                              GTM Integration
                            </div>
                          </TableCell>
                          <TableCell>May 15, 2025</TableCell>
                          <TableCell>May 29, 2025</TableCell>
                          <TableCell>2 weeks</TableCell>
                          <TableCell className="text-right">
                            1 Frontend Developer
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Database className="h-4 w-4 text-green-500" />
                              Food API Integrations
                            </div>
                          </TableCell>
                          <TableCell>May 15, 2025</TableCell>
                          <TableCell>June 5, 2025</TableCell>
                          <TableCell>3 weeks</TableCell>
                          <TableCell className="text-right">
                            1 Backend, 1 Frontend
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Share className="h-4 w-4 text-purple-500" />
                              Social Media Sharing
                            </div>
                          </TableCell>
                          <TableCell>June 6, 2025</TableCell>
                          <TableCell>June 20, 2025</TableCell>
                          <TableCell>2 weeks</TableCell>
                          <TableCell className="text-right">
                            1 Frontend Developer
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4 text-red-500" />
                              Vetster Telehealth
                            </div>
                          </TableCell>
                          <TableCell>June 21, 2025</TableCell>
                          <TableCell>July 19, 2025</TableCell>
                          <TableCell>4 weeks</TableCell>
                          <TableCell className="text-right">
                            1 Backend, 1 Frontend
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-4 w-4 text-indigo-500" />
                              Android Development
                            </div>
                          </TableCell>
                          <TableCell>June 21, 2025</TableCell>
                          <TableCell>August 30, 2025</TableCell>
                          <TableCell>10 weeks</TableCell>
                          <TableCell className="text-right">
                            2 React Native, 1 QA
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* GTM INTEGRATION TAB */}
                <TabsContent value="gtm" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Google Tag Manager Integration</CardTitle>
                      <CardDescription>
                        Implement comprehensive analytics tracking across the application
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="setup">
                          <AccordionTrigger className="font-medium">
                            Technical Setup
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">Container Configuration</h4>
                              <p className="text-sm text-muted-foreground">
                                Create a dedicated GTM container for the application with separate workspaces 
                                for development and production environments.
                              </p>
                              <ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
                                <li>Container ID stored in environment variable: <code>VITE_GTM_CONTAINER_ID</code></li>
                                <li>Create separate triggers for mobile and web-based interactions</li>
                                <li>Configure user-scoped custom dimensions for pet owners</li>
                              </ul>
                            </div>
                            
                            <div className="space-y-2 border-t pt-4">
                              <h4 className="font-medium">Code Implementation</h4>
                              <p className="text-sm text-muted-foreground">
                                Create a GTM utility library to standardize event tracking throughout the app.
                              </p>
                              <div className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-x-auto">
                                <pre>{`// client/src/lib/gtm.ts
export interface GTMEvent {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export function initGTM(id: string): void {
  if (!id) {
    console.warn('GTM ID is not provided');
    return;
  }

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = \`https://www.googletagmanager.com/gtm.js?id=\${id}\`;
  document.head.appendChild(script1);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', id);
}

export function trackEvent(eventData: GTMEvent): void {
  if (typeof window === 'undefined' || !window.dataLayer) return;
  window.dataLayer.push(eventData);
}

// Add custom event helpers
export const trackPageView = (path: string) => {
  trackEvent({
    event: 'page_view',
    page_path: path
  });
};

export const trackUserAction = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  trackEvent({
    event: 'user_action',
    action,
    category,
    label,
    value
  });
};
`}</pre>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="events">
                          <AccordionTrigger className="font-medium">
                            Event Tracking Plan
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Event Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Trigger</TableHead>
                                    <TableHead>Data Attributes</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="font-medium">pet_profile_create</TableCell>
                                    <TableCell>Profile</TableCell>
                                    <TableCell>New pet profile creation</TableCell>
                                    <TableCell>species, breed</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">pet_profile_update</TableCell>
                                    <TableCell>Profile</TableCell>
                                    <TableCell>Edit pet information</TableCell>
                                    <TableCell>field_changed, pet_id</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">reminder_create</TableCell>
                                    <TableCell>Reminders</TableCell>
                                    <TableCell>New reminder created</TableCell>
                                    <TableCell>reminder_type, pet_id</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">product_view</TableCell>
                                    <TableCell>Nutrition</TableCell>
                                    <TableCell>Product details viewed</TableCell>
                                    <TableCell>product_id, brand, category</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">product_click</TableCell>
                                    <TableCell>Nutrition</TableCell>
                                    <TableCell>Product link clicked</TableCell>
                                    <TableCell>product_id, destination_url</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">training_start</TableCell>
                                    <TableCell>Training</TableCell>
                                    <TableCell>Training plan started</TableCell>
                                    <TableCell>training_type, pet_id</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">training_complete</TableCell>
                                    <TableCell>Training</TableCell>
                                    <TableCell>Training step completed</TableCell>
                                    <TableCell>training_id, step_number</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">telehealth_inquiry</TableCell>
                                    <TableCell>Veterinary</TableCell>
                                    <TableCell>Vet consultation requested</TableCell>
                                    <TableCell>concern_type, urgency</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="ecommerce">
                          <AccordionTrigger className="font-medium">
                            Enhanced E-commerce Tracking
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              Implement Google Analytics Enhanced E-commerce tracking for the product
                              recommendation engine and affiliate link interactions.
                            </p>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium">Product Impression Tracking</h4>
                              <div className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-x-auto">
                                <pre>{`// Track product impressions in category views
trackEvent({
  event: 'view_item_list',
  ecommerce: {
    item_list_name: 'Fresh Dog Food',
    items: [
      {
        item_id: 'nom-nom-fresh-beef',
        item_name: 'Fresh Beef Mash Recipe',
        item_brand: 'Nom Nom',
        item_category: 'Dog Food',
        item_variant: 'Fresh',
        price: 69.99,
        position: 1
      },
      // Additional products...
    ]
  }
});`}</pre>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium">Product Detail Views</h4>
                              <div className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-x-auto">
                                <pre>{`// Track product detail views
trackEvent({
  event: 'view_item',
  ecommerce: {
    items: [{
      item_id: 'nom-nom-fresh-beef',
      item_name: 'Fresh Beef Mash Recipe',
      item_brand: 'Nom Nom',
      item_category: 'Dog Food',
      item_variant: 'Fresh',
      price: 69.99
    }]
  }
});`}</pre>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium">Affiliate Link Clicks (Outbound)</h4>
                              <div className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-x-auto">
                                <pre>{`// Track outbound affiliate clicks
trackEvent({
  event: 'select_item',
  ecommerce: {
    item_list_name: 'Fresh Dog Food',
    items: [{
      item_id: 'nom-nom-fresh-beef',
      item_name: 'Fresh Beef Mash Recipe',
      item_brand: 'Nom Nom',
      affiliation: 'Nom Nom Partner Program',
      item_category: 'Dog Food',
      price: 69.99
    }]
  }
});`}</pre>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* FOOD API INTEGRATION TAB */}
                <TabsContent value="food" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Food Product API Integrations</CardTitle>
                      <CardDescription>
                        Connect with Nom Nom Pet Food for dogs/cats and Amazon Associates for other animals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="implementation">
                          <AccordionTrigger className="font-medium">
                            Implementation Details
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">Current Implementation</h4>
                              <Badge className="bg-green-500">Completed</Badge>
                              <p className="text-sm text-muted-foreground mt-2">
                                The initial integration has been completed with:
                              </p>
                              <ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
                                <li>Nom Nom Pet Food integration for dogs and cats with fresh human-grade options</li>
                                <li>Amazon Associates API integration for other pets (birds, fish, reptiles, small pets)</li>
                                <li>Product display with detailed information, pricing, and affiliate links</li>
                                <li>Category filtering and search functionality</li>
                              </ul>
                            </div>
                            
                            <div className="space-y-2 border-t pt-4">
                              <h4 className="font-medium">API-Based Enhancement (Phase 2.5)</h4>
                              <p className="text-sm text-muted-foreground">
                                Next stage improvements to replace static product data with dynamic API integration:
                              </p>
                              <div className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-x-auto">
                                <pre>{`// server/lib/nomnom.ts
import axios from 'axios';
import { FoodProduct } from '@shared/schema';

const NOMNOM_API_BASE = 'https://partners.nomnomnow.com/api/v1';
const NOMNOM_API_KEY = process.env.NOMNOM_API_KEY;

// Client for Nom Nom API
export const nomNomClient = axios.create({
  baseURL: NOMNOM_API_BASE,
  headers: {
    'Authorization': \`Bearer \${NOMNOM_API_KEY}\`,
    'Content-Type': 'application/json'
  }
});

// Fetch product catalog 
export async function fetchNomNomProducts(petType: string): Promise<FoodProduct[]> {
  try {
    const response = await nomNomClient.get('/products', {
      params: { 
        pet_type: petType.toLowerCase(), 
        include_nutrition: true,
        include_ingredients: true 
      }
    });
    
    return response.data.products.map(transformNomNomProduct);
  } catch (error) {
    console.error('Error fetching Nom Nom products:', error);
    throw new Error('Failed to fetch Nom Nom products');
  }
}

// Transform API response to our schema
function transformNomNomProduct(apiProduct: any): FoodProduct {
  return {
    id: \`nom-nom-\${apiProduct.sku}\`,
    name: apiProduct.name,
    brand: 'Nom Nom',
    imageUrl: apiProduct.image_url,
    description: apiProduct.description,
    price: apiProduct.price,
    packageSize: apiProduct.package_size,
    ingredients: apiProduct.ingredients.map((i: any) => i.name),
    benefits: apiProduct.benefits || [],
    rating: apiProduct.rating || 4.8,
    tags: apiProduct.tags || [],
    petType: apiProduct.pet_type,
    ageRange: apiProduct.age_range || 'All Life Stages',
    isSubscriptionAvailable: true,
    discountPercent: apiProduct.discount_percent,
    specialNeeds: apiProduct.special_needs || [],
    productUrl: \`https://partners.nomnomnow.com/\${apiProduct.sku}?ref=petcare\`
  };
}
`}</pre>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="amazon">
                          <AccordionTrigger className="font-medium">
                            Amazon Product Advertising API
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">Amazon PA-API Integration</h4>
                              <p className="text-sm text-muted-foreground">
                                Future implementation for real-time Amazon product data:
                              </p>
                              <div className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-x-auto">
                                <pre>{`// server/lib/amazon.ts
import crypto from 'crypto';
import axios from 'axios';
import { FoodProduct } from '@shared/schema';

// Amazon PA-API credentials
const AMAZON_ACCESS_KEY = process.env.AMAZON_ACCESS_KEY;
const AMAZON_SECRET_KEY = process.env.AMAZON_SECRET_KEY;
const AMAZON_PARTNER_TAG = process.env.AMAZON_PARTNER_TAG || 'petcare-app-20';
const AMAZON_HOST = 'webservices.amazon.com';
const AMAZON_REGION = 'us-east-1';
const AMAZON_URI = '/paapi5/searchitems';
const AMAZON_SERVICE = 'ProductAdvertisingAPI';

// Generate request signature
function generateSignature(
  secretKey: string,
  dateStamp: string,
  regionName: string,
  serviceName: string
) {
  const kDate = crypto.createHmac('sha256', 'AWS4' + secretKey).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(regionName).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(serviceName).digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
  return kSigning;
}

// Search Amazon products
export async function searchAmazonProducts(
  keywords: string,
  petType: string
): Promise<FoodProduct[]> {
  const date = new Date();
  const amzDate = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dateStamp = date.toISOString().split('T')[0].replace(/-/g, '');
  
  const requestBody = {
    Keywords: \`\${petType} food \${keywords}\`,
    Resources: [
      'ItemInfo.Title',
      'ItemInfo.Features',
      'ItemInfo.ProductInfo',
      'ItemInfo.ByLineInfo',
      'Images.Primary.Large',
      'Offers.Listings.Price'
    ],
    PartnerTag: AMAZON_PARTNER_TAG,
    PartnerType: 'Associates',
    Marketplace: 'www.amazon.com',
    SearchIndex: 'PetSupplies'
  };
  
  // Create canonical request
  const canonicalRequest = [
    'POST',
    AMAZON_URI,
    '',
    'host:' + AMAZON_HOST,
    'x-amz-date:' + amzDate,
    '',
    'host;x-amz-date',
    crypto.createHash('sha256').update(JSON.stringify(requestBody)).digest('hex')
  ].join('\\n');
  
  // Create string to sign
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    \`\${dateStamp}/\${AMAZON_REGION}/\${AMAZON_SERVICE}/aws4_request\`,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\\n');
  
  // Calculate signature
  const signature = crypto
    .createHmac('sha256', generateSignature(AMAZON_SECRET_KEY, dateStamp, AMAZON_REGION, AMAZON_SERVICE))
    .update(stringToSign)
    .digest('hex');
  
  // Create authorization header
  const authHeader = \`AWS4-HMAC-SHA256 Credential=\${AMAZON_ACCESS_KEY}/\${dateStamp}/\${AMAZON_REGION}/\${AMAZON_SERVICE}/aws4_request, SignedHeaders=host;x-amz-date, Signature=\${signature}\`;
  
  try {
    const response = await axios.post(
      \`https://\${AMAZON_HOST}\${AMAZON_URI}\`, 
      requestBody,
      {
        headers: {
          'Authorization': authHeader,
          'X-Amz-Date': amzDate,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.ItemsResult.Items.map(transformAmazonProduct);
  } catch (error) {
    console.error('Error fetching Amazon products:', error);
    throw new Error('Failed to fetch Amazon products');
  }
}

// Transform Amazon product to our schema
function transformAmazonProduct(product: any): FoodProduct {
  return {
    id: \`amazon-\${product.ASIN}\`,
    name: product.ItemInfo.Title.DisplayValue,
    brand: product.ItemInfo.ByLineInfo.Brand.DisplayValue,
    imageUrl: product.Images.Primary.Large.URL,
    description: product.ItemInfo.Features?.DisplayValues.join(' ') || '',
    price: product.Offers.Listings[0].Price.Amount,
    packageSize: product.ItemInfo.ProductInfo.Size?.DisplayValue || '',
    ingredients: [],
    benefits: product.ItemInfo.Features?.DisplayValues || [],
    rating: 4.5, // Default since Amazon doesn't provide ratings via API
    tags: [],
    petType: 'other',
    ageRange: 'All Life Stages',
    isSubscriptionAvailable: product.Offers.Listings[0].DeliveryInfo.IsAmazonFulfilled,
    productUrl: \`https://www.amazon.com/dp/\${product.ASIN}?tag=\${AMAZON_PARTNER_TAG}\`
  };
}
`}</pre>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="endpoints">
                          <AccordionTrigger className="font-medium">
                            API Endpoints
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">New Backend Routes</h4>
                              <p className="text-sm text-muted-foreground">
                                API routes to be implemented for dynamic product data:
                              </p>
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Endpoint</TableHead>
                                      <TableHead>Method</TableHead>
                                      <TableHead>Description</TableHead>
                                      <TableHead>Parameters</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell className="font-mono text-xs">/api/products</TableCell>
                                      <TableCell>GET</TableCell>
                                      <TableCell>Get products based on pet type</TableCell>
                                      <TableCell className="font-mono text-xs">?petType=dog|cat|bird|etc</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="font-mono text-xs">/api/products/recommendations</TableCell>
                                      <TableCell>GET</TableCell>
                                      <TableCell>Get personalized recommendations</TableCell>
                                      <TableCell className="font-mono text-xs">?petId=123</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="font-mono text-xs">/api/products/search</TableCell>
                                      <TableCell>GET</TableCell>
                                      <TableCell>Search products by keyword</TableCell>
                                      <TableCell className="font-mono text-xs">?q=grain+free&petType=dog</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="font-mono text-xs">/api/products/track-click</TableCell>
                                      <TableCell>POST</TableCell>
                                      <TableCell>Track affiliate link click</TableCell>
                                      <TableCell className="font-mono text-xs">productId, userId, source</TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* SOCIAL MEDIA TAB */}
                <TabsContent value="social" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Social Media Sharing</CardTitle>
                      <CardDescription>
                        Allow users to share pet profiles and achievements on social platforms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="feature">
                          <AccordionTrigger className="font-medium">
                            Feature Specification
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">Share Pet Profile Button</h4>
                              <p className="text-sm text-muted-foreground">
                                Add a prominent "Share Pet Profile" button on the pet profile page that will:
                              </p>
                              <ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
                                <li>Collect pet's basic information (name, breed, age, etc.)</li>
                                <li>Gather pet photos from the gallery</li>
                                <li>Create a shareable card with branding</li>
                                <li>Offer sharing options for various platforms</li>
                              </ul>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                              <div>
                                <h4 className="font-medium mb-2">Implementation Details</h4>
                                <ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
                                  <li>Create a shareable image using HTML Canvas</li>
                                  <li>Implement Web Share API for mobile devices</li>
                                  <li>Add direct sharing links for major platforms</li>
                                  <li>Enable sharing via messaging apps</li>
                                  <li>Track sharing events with GTM</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Technical Requirements</h4>
                                <ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
                                  <li>html2canvas for creating shareable images</li>
                                  <li>Social platform SDK integrations</li>
                                  <li>Mobile-optimized sharing experience</li>
                                  <li>Image optimization for social platforms</li>
                                  <li>Fallback for browsers without Web Share API</li>
                                </ul>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="implementation">
                          <AccordionTrigger className="font-medium">
                            Implementation Code
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">SharePetProfile Component</h4>
                              <div className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-x-auto">
                                <pre>{`// client/src/components/SharePetProfile.tsx
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Share2, 
  Copy, 
  MessageCircle, 
  Download 
} from 'lucide-react';
import { Pet } from '@shared/schema';
import { trackEvent } from '@/lib/gtm';

interface SharePetProfileProps {
  pet: Pet;
  photos: string[]; // Array of photo URLs from gallery
}

export function SharePetProfile({ pet, photos }: SharePetProfileProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate shareable image
  const generateShareImage = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Higher resolution
        useCORS: true, // Handle cross-origin images
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imageUrl = canvas.toDataURL('image/png');
      setShareImage(imageUrl);
      setShowShareOptions(true);
      
      // Track event
      trackEvent({
        event: 'generate_share_image',
        category: 'Social',
        action: 'Generate',
        label: pet.name
      });
    } catch (error) {
      console.error('Error generating share image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Share using Web Share API (mobile)
  const shareWithAPI = async () => {
    if (!shareImage) return;
    
    // Convert base64 to blob
    const blob = await fetch(shareImage).then(r => r.blob());
    const file = new File([blob], \`\${pet.name}_profile.png\`, { type: 'image/png' });
    
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: \`\${pet.name}'s Pet Profile\`,
          text: \`Check out \${pet.name}, my \${pet.breed} \${pet.species} on PetCare AI!\`,
          files: [file]
        });
        
        // Track successful share
        trackEvent({
          event: 'share_profile',
          category: 'Social',
          action: 'Share',
          label: 'Web Share API',
          pet_id: pet.id
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for unsupported browsers
      downloadImage();
    }
  };

  // Direct platform shares
  const shareTo = (platform: string) => {
    if (!shareImage) return;
    
    let shareUrl = '';
    const appUrl = window.location.href;
    const text = encodeURIComponent(\`Check out \${pet.name}, my \${pet.breed} \${pet.species} on PetCare AI!\`);
    
    switch (platform) {
      case 'facebook':
        shareUrl = \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(appUrl)}\`;
        break;
      case 'twitter':
        shareUrl = \`https://twitter.com/intent/tweet?text=\${text}&url=\${encodeURIComponent(appUrl)}\`;
        break;
      case 'whatsapp':
        shareUrl = \`https://wa.me/?text=\${text} \${encodeURIComponent(appUrl)}\`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
    
    // Track share
    trackEvent({
      event: 'share_profile',
      category: 'Social',
      action: 'Share',
      label: platform,
      pet_id: pet.id
    });
  };

  // Download image
  const downloadImage = () => {
    if (!shareImage) return;
    
    const link = document.createElement('a');
    link.href = shareImage;
    link.download = \`\${pet.name}_profile.png\`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Track download
    trackEvent({
      event: 'download_profile',
      category: 'Social',
      action: 'Download',
      label: 'Image',
      pet_id: pet.id
    });
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            className="gap-2" 
            size="lg" 
            onClick={generateShareImage}
            disabled={isGenerating}
          >
            <Share2 className="h-5 w-5" />
            {isGenerating ? 'Generating...' : 'Share Pet Profile'}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share {pet.name}'s Profile</DialogTitle>
          </DialogHeader>
          
          {/* Preview card that will be converted to image */}
          <div className="mt-4">
            <div 
              ref={cardRef} 
              className="bg-white rounded-lg overflow-hidden border shadow-md p-4 w-full max-w-sm mx-auto"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">{pet.name}</h3>
                <div className="bg-primary text-white text-xs px-2 py-1 rounded">
                  {pet.species}
                </div>
              </div>
              
              {pet.imageUrl && (
                <div className="h-48 rounded-md overflow-hidden mb-3">
                  <img 
                    src={pet.imageUrl} 
                    alt={pet.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Breed:</span>
                  <span>{pet.breed}</span>
                </div>
                
                {pet.age && (
                  <div className="flex justify-between">
                    <span className="font-medium">Age:</span>
                    <span>{pet.age}</span>
                  </div>
                )}
                
                {pet.weight && (
                  <div className="flex justify-between">
                    <span className="font-medium">Weight:</span>
                    <span>{pet.weight}</span>
                  </div>
                )}
                
                <div className="pt-2 flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    Shared via PetCare AI
                  </span>
                  <img 
                    src="/logo.png" 
                    alt="PetCare AI" 
                    className="h-6" 
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Share options */}
          {showShareOptions && shareImage && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => shareTo('facebook')}
                  className="h-10 w-10 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => shareTo('twitter')}
                  className="h-10 w-10 rounded-full bg-sky-500 text-white hover:bg-sky-600"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => shareTo('instagram')}
                  className="h-10 w-10 rounded-full bg-pink-500 text-white hover:bg-pink-600"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => shareTo('whatsapp')}
                  className="h-10 w-10 rounded-full bg-green-500 text-white hover:bg-green-600"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex justify-center gap-2">
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={shareWithAPI}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={downloadImage}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
`}</pre>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ADDITIONAL FEATURES TAB */}
                <TabsContent value="features" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Vetster Telehealth Integration</CardTitle>
                      <CardDescription>
                        Connect with Vetster API for virtual veterinary consultations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="api">
                          <AccordionTrigger className="font-medium">
                            Vetster API Integration
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">API Client Setup</h4>
                              <div className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-x-auto">
                                <pre>{`// server/lib/vetster.ts
import axios from 'axios';

const VETSTER_API_BASE = 'https://api.vetster.com/v1';
const VETSTER_API_KEY = process.env.VETSTER_API_KEY;
const VETSTER_API_SECRET = process.env.VETSTER_API_SECRET;

// Generate token
async function getVetsterToken() {
  try {
    const response = await axios.post(
      \`\${VETSTER_API_BASE}/auth/token\`,
      {
        apiKey: VETSTER_API_KEY,
        apiSecret: VETSTER_API_SECRET
      }
    );
    
    return response.data.token;
  } catch (error) {
    console.error('Error obtaining Vetster token:', error);
    throw new Error('Failed to authenticate with Vetster API');
  }
}

// Create API client with token
export async function getVetsterClient() {
  const token = await getVetsterToken();
  
  return axios.create({
    baseURL: VETSTER_API_BASE,
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    }
  });
}

// Get available vets by specialty
export async function getAvailableVets(
  specialty: string = '',
  date: string = ''
) {
  const client = await getVetsterClient();
  
  try {
    const response = await client.get('/practitioners', {
      params: {
        specialty,
        availableDate: date,
        limit: 20,
        offset: 0
      }
    });
    
    return response.data.practitioners;
  } catch (error) {
    console.error('Error fetching Vetster practitioners:', error);
    throw new Error('Failed to fetch available veterinarians');
  }
}

// Book appointment
export async function bookAppointment(appointmentData: {
  practitionerId: string;
  petOwnerId: string;
  petId: string;
  appointmentType: string;
  startTime: string;
  endTime: string;
  concerns: string;
  petSymptoms: string[];
}) {
  const client = await getVetsterClient();
  
  try {
    const response = await client.post('/appointments', appointmentData);
    return response.data.appointment;
  } catch (error) {
    console.error('Error booking Vetster appointment:', error);
    throw new Error('Failed to book veterinary consultation');
  }
}

// Get appointment details
export async function getAppointment(appointmentId: string) {
  const client = await getVetsterClient();
  
  try {
    const response = await client.get(\`/appointments/\${appointmentId}\`);
    return response.data.appointment;
  } catch (error) {
    console.error('Error fetching Vetster appointment:', error);
    throw new Error('Failed to retrieve appointment details');
  }
}

// Register pet owner with Vetster
export async function registerPetOwner(userData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }
}) {
  const client = await getVetsterClient();
  
  try {
    const response = await client.post('/petowners', userData);
    return response.data.petOwner;
  } catch (error) {
    console.error('Error registering pet owner with Vetster:', error);
    throw new Error('Failed to register with Vetster');
  }
}

// Register pet with Vetster
export async function registerPet(petData: {
  petOwnerId: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  birthdate: string;
  weight: number;
  medicalHistory: string;
  medications: string[];
  allergies: string[];
  imageUrl?: string;
}) {
  const client = await getVetsterClient();
  
  try {
    const response = await client.post('/pets', petData);
    return response.data.pet;
  } catch (error) {
    console.error('Error registering pet with Vetster:', error);
    throw new Error('Failed to register pet with Vetster');
  }
}
`}</pre>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="component">
                          <AccordionTrigger className="font-medium">
                            Telehealth Consultation Component
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">VetsterConsultation Component</h4>
                              <p className="text-sm text-muted-foreground">
                                Frontend component for booking vet consultations.
                              </p>
                              <div className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-x-auto">
                                <pre>{`// client/src/components/VetsterConsultation.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { z } from 'zod';
import { Pet } from '@shared/schema';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertTriangle,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  Video,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trackEvent } from '@/lib/gtm';

// Form schema
const consultationSchema = z.object({
  practitionerId: z.string().min(1, 'Please select a veterinarian'),
  appointmentType: z.enum(['general', 'emergency', 'followup']),
  appointmentDate: z.date(),
  appointmentTime: z.string().min(1, 'Please select a time'),
  concerns: z.string().min(10, 'Please describe your concerns'),
  symptoms: z.array(z.string()).min(1, 'Please select at least one symptom'),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

interface VetsterConsultationProps {
  pet: Pet;
}

export function VetsterConsultation({ pet }: VetsterConsultationProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Form setup
  const form = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      appointmentType: 'general',
      concerns: '',
      symptoms: [],
    },
  });
  
  // Get available vets
  const { data: vets = [], isLoading: isLoadingVets } = useQuery({
    queryKey: ['/api/vetster/practitioners', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''],
    enabled: !!selectedDate,
  });
  
  // Get available time slots
  const { data: timeSlots = [], isLoading: isLoadingTimeSlots } = useQuery({
    queryKey: [
      '/api/vetster/timeslots', 
      form.watch('practitionerId'), 
      selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
    ],
    enabled: !!form.watch('practitionerId') && !!selectedDate,
  });
  
  // Common symptoms based on pet type
  const commonSymptoms = [
    'Vomiting',
    'Diarrhea',
    'Lethargy',
    'Loss of appetite',
    'Coughing',
    'Sneezing',
    'Limping',
    'Itching/Scratching',
    'Eye discharge',
    'Ear issues',
    'Excessive drinking/urination',
    'Weight loss',
  ];
  
  // Book consultation
  const bookConsultation = useMutation({
    mutationFn: async (data: ConsultationFormData) => {
      // Format the data
      const startDateTime = \`\${format(data.appointmentDate, 'yyyy-MM-dd')}T\${data.appointmentTime}\`;
      
      // Calculate end time (30 min later)
      const [hours, minutes] = data.appointmentTime.split(':');
      const startTime = new Date();
      startTime.setHours(parseInt(hours, 10));
      startTime.setMinutes(parseInt(minutes, 10));
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 30);
      
      const endDateTime = \`\${format(data.appointmentDate, 'yyyy-MM-dd')}T\${format(endTime, 'HH:mm')}\`;
      
      const appointmentData = {
        practitionerId: data.practitionerId,
        petId: pet.id,
        appointmentType: data.appointmentType,
        startTime: startDateTime,
        endTime: endDateTime,
        concerns: data.concerns,
        petSymptoms: data.symptoms,
      };
      
      const response = await apiRequest('POST', '/api/vetster/appointments', appointmentData);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to book consultation');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Track booking
      trackEvent({
        event: 'book_vet_consultation',
        category: 'Veterinary',
        action: 'Book',
        label: form.watch('appointmentType'),
        consultation_id: data.id
      });
      
      // Reset form
      form.reset();
      
      // Update appointments list
      queryClient.invalidateQueries({ queryKey: ['/api/vetster/appointments'] });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: ConsultationFormData) => {
    bookConsultation.mutate(data);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          Book a Telehealth Consultation
        </CardTitle>
        <CardDescription>
          Connect with a licensed veterinarian via video chat
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="new">
          <TabsList className="mb-4">
            <TabsTrigger value="new">New Consultation</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Consultations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="appointmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consultation Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select consultation type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="general">General Check-up</SelectItem>
                              <SelectItem value="emergency">Urgent Care</SelectItem>
                              <SelectItem value="followup">Follow-up Visit</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="appointmentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Appointment Date</FormLabel>
                          <div className="border rounded-md p-2">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                setSelectedDate(date);
                              }}
                              disabled={(date) => {
                                // Disable dates in the past
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date < today;
                              }}
                              className="rounded-md border"
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="practitionerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Veterinarian</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoadingVets || vets.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={
                                  isLoadingVets
                                    ? "Loading vets..."
                                    : vets.length === 0
                                    ? "No vets available for selected date"
                                    : "Select a veterinarian"
                                } />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vets.map((vet: any) => (
                                <SelectItem key={vet.id} value={vet.id}>
                                  Dr. {vet.firstName} {vet.lastName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="appointmentTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Appointment Time</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={
                              isLoadingTimeSlots ||
                              timeSlots.length === 0 ||
                              !form.watch('practitionerId')
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={
                                  !form.watch('practitionerId')
                                    ? "Select a vet first"
                                    : isLoadingTimeSlots
                                    ? "Loading times..."
                                    : timeSlots.length === 0
                                    ? "No available times"
                                    : "Select a time"
                                } />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((slot: string) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="concerns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Describe your concerns</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Please describe what's happening with your pet..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select symptoms (if any)</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {commonSymptoms.map((symptom) => (
                          <div
                            key={symptom}
                            className={\`
                              border rounded-md p-2 cursor-pointer transition-colors
                              \${field.value.includes(symptom) ? 'bg-primary/10 border-primary' : ''}
                            \`}
                            onClick={() => {
                              const newValue = field.value.includes(symptom)
                                ? field.value.filter((s) => s !== symptom)
                                : [...field.value, symptom];
                              field.onChange(newValue);
                            }}
                          >
                            <span className="text-sm">{symptom}</span>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {bookConsultation.isError && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {bookConsultation.error instanceof Error
                        ? bookConsultation.error.message
                        : 'Failed to book consultation'}
                    </AlertDescription>
                  </Alert>
                )}
                
                {bookConsultation.isSuccess && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      Your consultation has been booked. You'll receive a confirmation email with details.
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="upcoming">
            {/* Upcoming appointments component here */}
          </TabsContent>
          
          <TabsContent value="past">
            {/* Past appointments component here */}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Consultations powered by Vetster Telehealth
        </p>
        
        <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={bookConsultation.isPending}>
          {bookConsultation.isPending ? 'Booking...' : 'Book Consultation'}
        </Button>
      </CardFooter>
    </Card>
  );
}
`}</pre>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Android Development</CardTitle>
                      <CardDescription>
                        Native Android application using React Native
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="react-native">
                          <AccordionTrigger className="font-medium">
                            React Native Setup
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">Project Configuration</h4>
                              <p className="text-sm text-muted-foreground">
                                Setting up the React Native project structure with appropriate configuration
                                for Android.
                              </p>
                              <div className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-x-auto">
                                <pre>{`// Technical stack and setup:
// - React Native CLI (not Expo)
// - TypeScript configuration
// - React Navigation for navigation
// - Reuse of shared API and schema types
// - Custom native modules for platform-specific features

// package.json dependencies:
{
  "dependencies": {
    "@react-native-async-storage/async-storage": "^1.18.2",
    "@react-native-community/netinfo": "^9.4.1",
    "@react-navigation/bottom-tabs": "^6.5.8",
    "@react-navigation/native": "^6.1.7",
    "@react-navigation/native-stack": "^6.9.13",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.5.0",
    "date-fns": "^2.30.0",
    "react": "18.2.0",
    "react-native": "0.72.4",
    "react-native-config": "^1.5.1",
    "react-native-device-info": "^10.9.0",
    "react-native-gesture-handler": "^2.12.1",
    "react-native-image-picker": "^5.6.1",
    "react-native-keychain": "^8.1.2",
    "react-native-reanimated": "^3.4.2",
    "react-native-safe-area-context": "^4.7.2",
    "react-native-screens": "^3.25.0",
    "react-native-share": "^9.2.3",
    "react-native-svg": "^13.13.0",
    "react-native-vector-icons": "^10.0.0",
    "zod": "^3.22.2"
  },
  "devDependencies": {
    "@babel/core": "^7.22.11",
    "@babel/preset-env": "^7.22.10",
    "@react-native/eslint-config": "^0.72.2",
    "@react-native/metro-config": "^0.72.11",
    "@tsconfig/react-native": "^3.0.2",
    "@types/react": "^18.2.21",
    "@types/react-native": "^0.72.2",
    "babel-jest": "^29.6.4",
    "eslint": "^8.48.0",
    "jest": "^29.6.4",
    "metro-react-native-babel-preset": "^0.77.0",
    "react-native-svg-transformer": "^1.1.0",
    "typescript": "^5.2.2"
  }
}

// App navigation structure
// - Auth Stack (Login, Register)
// - Main Tab Navigator
//   - Home Stack (Home, Pet Profile, etc.)
//   - Nutrition Stack (Nutrition Guide, Food Products)
//   - Training Stack (Training Guides, Progress Tracking)
//   - Vet Stack (Health Assessment, Telehealth)
//   - Profile Stack (User Profile, Settings)

// Navigation setup in App.tsx:
import React, { useEffect } from 'react';
import { StatusBar, LogBox, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { enableScreens } from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from './src/contexts/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { setupNotifications } from './src/utils/notifications';
import ThemeProvider from './src/contexts/ThemeContext';

// Enable screens for performance
enableScreens();

// Ignore specific warnings
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => {
  // Setup notifications on app start
  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default App;
`}</pre>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="features">
                          <AccordionTrigger className="font-medium">
                            Key Components and Features
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">Android-Specific Features</h4>
                              <p className="text-sm text-muted-foreground">
                                Android-specific components and optimizations.
                              </p>
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Feature</TableHead>
                                      <TableHead>Implementation</TableHead>
                                      <TableHead>Technical Details</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody className="text-sm">
                                    <TableRow>
                                      <TableCell>Camera Integration</TableCell>
                                      <TableCell>react-native-image-picker</TableCell>
                                      <TableCell>Custom permissions handling, image compression, direct camera access</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Push Notifications</TableCell>
                                      <TableCell>Firebase Cloud Messaging</TableCell>
                                      <TableCell>Background notifications, notification channels, custom sounds</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Offline Mode</TableCell>
                                      <TableCell>AsyncStorage + SQLite</TableCell>
                                      <TableCell>Data persistence, sync when connection restored, conflict resolution</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Authentication</TableCell>
                                      <TableCell>Biometric Authentication</TableCell>
                                      <TableCell>Fingerprint/face recognition, secure storage of tokens</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Deep Linking</TableCell>
                                      <TableCell>Android App Links</TableCell>
                                      <TableCell>Verification of URL ownership, direct app opening from links</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Material Design</TableCell>
                                      <TableCell>React Native Paper</TableCell>
                                      <TableCell>Android design guidelines, native look and feel, animations</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Performance</TableCell>
                                      <TableCell>Hermes Engine</TableCell>
                                      <TableCell>Optimized JavaScript engine, reduced memory usage, faster startup</TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}