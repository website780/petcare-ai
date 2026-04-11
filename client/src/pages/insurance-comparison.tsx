import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { format } from "date-fns";
import { z } from "zod";
import type { InsurancePolicy, InsuranceClaim, Pet } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Shield,
  DollarSign,
  Plus,
  Trash2,
  TrendingUp,
  PiggyBank,
  Calculator,
  Check,
  X,
  Clock,
  AlertTriangle,
  Heart,
  Stethoscope,
  Scale,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Star,
  MapPin,
  Globe,
  Building2,
  Award,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle
} from "lucide-react";

const policyFormSchema = z.object({
  providerName: z.string().min(1, "Provider name is required"),
  policyNumber: z.string().optional(),
  planType: z.string().min(1, "Plan type is required"),
  monthlyPremium: z.coerce.number().min(1, "Monthly premium is required"),
  annualDeductible: z.coerce.number().min(0, "Annual deductible is required"),
  reimbursementRate: z.coerce.number().min(1).max(100, "Reimbursement rate must be between 1-100%"),
  annualLimit: z.coerce.number().optional(),
  petId: z.coerce.number().optional(),
});

const claimFormSchema = z.object({
  policyId: z.coerce.number().min(1, "Policy is required"),
  claimDate: z.string().min(1, "Claim date is required"),
  amount: z.coerce.number().min(1, "Amount is required"),
  reimbursedAmount: z.coerce.number().optional(),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["pending", "approved", "denied", "paid"]).default("pending"),
});

interface InsuranceProvider {
  name: string;
  type: 'national' | 'regional';
  region?: string;
  avgPremium: number;
  premiumRange: { min: number; max: number };
  reimbursement: number[];
  deductibleOptions: number[];
  annualLimits: string[];
  waitingPeriods: { accident: number; illness: number; cruciate: number };
  rating: number;
  reviewCount: number;
  features: {
    accidentCoverage: boolean;
    illnessCoverage: boolean;
    hereditary: boolean;
    behavioral: boolean;
    altTherapy: boolean;
    examFees: boolean;
    prescriptions: boolean;
    dentalIllness: boolean;
    wellness: boolean;
    multiPetDiscount: boolean;
    directVetPay: boolean;
    mobileApp: boolean;
  };
  pros: string[];
  cons: string[];
  bestFor: string;
  website: string;
  founded: number;
  headquarters: string;
}

const nationalProviders: InsuranceProvider[] = [
  {
    name: "Healthy Paws",
    type: "national",
    avgPremium: 45,
    premiumRange: { min: 25, max: 90 },
    reimbursement: [70, 80, 90],
    deductibleOptions: [100, 250, 500, 750],
    annualLimits: ["Unlimited"],
    waitingPeriods: { accident: 15, illness: 15, cruciate: 12 },
    rating: 4.8,
    reviewCount: 32450,
    features: {
      accidentCoverage: true, illnessCoverage: true, hereditary: true,
      behavioral: false, altTherapy: true, examFees: false,
      prescriptions: true, dentalIllness: true, wellness: false,
      multiPetDiscount: true, directVetPay: true, mobileApp: true
    },
    pros: ["No annual limits", "Fast claim processing (2-3 days)", "Highly rated customer service"],
    cons: ["No wellness plans", "Cruciate ligament 12-month wait", "No exam fee coverage"],
    bestFor: "Pet owners wanting unlimited coverage with fast claims",
    website: "https://www.healthypawspetinsurance.com",
    founded: 2009,
    headquarters: "Bellevue, WA"
  },
  {
    name: "Lemonade",
    type: "national",
    avgPremium: 30,
    premiumRange: { min: 10, max: 70 },
    reimbursement: [70, 80, 90],
    deductibleOptions: [100, 250, 500],
    annualLimits: ["$5,000", "$10,000", "$20,000", "$50,000", "$100,000"],
    waitingPeriods: { accident: 2, illness: 14, cruciate: 6 },
    rating: 4.6,
    reviewCount: 18230,
    features: {
      accidentCoverage: true, illnessCoverage: true, hereditary: true,
      behavioral: true, altTherapy: true, examFees: true,
      prescriptions: true, dentalIllness: true, wellness: true,
      multiPetDiscount: true, directVetPay: false, mobileApp: true
    },
    pros: ["Lowest premiums", "AI-powered instant claims", "Wellness add-on available", "Giveback program"],
    cons: ["Annual limits apply", "Newer company", "No direct vet payment"],
    bestFor: "Budget-conscious pet owners who want modern, tech-forward service",
    website: "https://www.lemonade.com/pet",
    founded: 2020,
    headquarters: "New York, NY"
  },
  {
    name: "Embrace",
    type: "national",
    avgPremium: 42,
    premiumRange: { min: 20, max: 85 },
    reimbursement: [70, 80, 90],
    deductibleOptions: [200, 300, 500, 750, 1000],
    annualLimits: ["$5,000", "$10,000", "$15,000", "$30,000"],
    waitingPeriods: { accident: 2, illness: 14, cruciate: 6 },
    rating: 4.7,
    reviewCount: 24180,
    features: {
      accidentCoverage: true, illnessCoverage: true, hereditary: true,
      behavioral: true, altTherapy: true, examFees: true,
      prescriptions: true, dentalIllness: true, wellness: true,
      multiPetDiscount: true, directVetPay: false, mobileApp: true
    },
    pros: ["Diminishing deductible", "Wellness Rewards program", "Covers exam fees", "Behavioral therapy"],
    cons: ["Annual limits", "Higher premiums for older pets", "Pre-existing conditions excluded"],
    bestFor: "Pet owners wanting comprehensive coverage with wellness rewards",
    website: "https://www.embracepetinsurance.com",
    founded: 2003,
    headquarters: "Cleveland, OH"
  },
  {
    name: "Nationwide",
    type: "national",
    avgPremium: 50,
    premiumRange: { min: 30, max: 100 },
    reimbursement: [50, 70, 90],
    deductibleOptions: [250],
    annualLimits: ["$10,000", "Unlimited (Whole Pet plan)"],
    waitingPeriods: { accident: 14, illness: 14, cruciate: 6 },
    rating: 4.3,
    reviewCount: 15670,
    features: {
      accidentCoverage: true, illnessCoverage: true, hereditary: true,
      behavioral: true, altTherapy: true, examFees: true,
      prescriptions: true, dentalIllness: true, wellness: true,
      multiPetDiscount: true, directVetPay: false, mobileApp: true
    },
    pros: ["Exotic pet coverage", "Wellness plans included", "Large established company", "Wide vet network"],
    cons: ["Higher premiums", "Longer waiting periods", "Benefit schedule limits on some plans"],
    bestFor: "Exotic pet owners and those wanting established insurer backing",
    website: "https://www.petinsurance.com",
    founded: 1982,
    headquarters: "Columbus, OH"
  },
  {
    name: "Trupanion",
    type: "national",
    avgPremium: 55,
    premiumRange: { min: 35, max: 120 },
    reimbursement: [90],
    deductibleOptions: [0, 100, 200, 250, 500, 700, 1000],
    annualLimits: ["Unlimited"],
    waitingPeriods: { accident: 5, illness: 30, cruciate: 30 },
    rating: 4.5,
    reviewCount: 28340,
    features: {
      accidentCoverage: true, illnessCoverage: true, hereditary: true,
      behavioral: false, altTherapy: true, examFees: false,
      prescriptions: true, dentalIllness: true, wellness: false,
      multiPetDiscount: true, directVetPay: true, mobileApp: true
    },
    pros: ["90% reimbursement only", "No payout limits", "Direct vet payment", "$0 deductible option"],
    cons: ["Higher premiums", "Longer illness waiting period", "No wellness coverage"],
    bestFor: "Pet owners wanting maximum coverage and direct vet payment",
    website: "https://www.trupanion.com",
    founded: 2000,
    headquarters: "Seattle, WA"
  },
  {
    name: "Pets Best",
    type: "national",
    avgPremium: 35,
    premiumRange: { min: 18, max: 75 },
    reimbursement: [70, 80, 90],
    deductibleOptions: [50, 100, 200, 250, 500],
    annualLimits: ["$5,000", "Unlimited"],
    waitingPeriods: { accident: 3, illness: 14, cruciate: 6 },
    rating: 4.4,
    reviewCount: 19870,
    features: {
      accidentCoverage: true, illnessCoverage: true, hereditary: true,
      behavioral: false, altTherapy: true, examFees: true,
      prescriptions: true, dentalIllness: true, wellness: true,
      multiPetDiscount: true, directVetPay: false, mobileApp: true
    },
    pros: ["Low $50 deductible option", "Unlimited coverage available", "Fast claim processing"],
    cons: ["No behavioral coverage", "Some breed restrictions", "Wellness is add-on cost"],
    bestFor: "Budget-conscious owners wanting low deductible options",
    website: "https://www.petsbest.com",
    founded: 2005,
    headquarters: "Boise, ID"
  },
  {
    name: "ASPCA Pet Health Insurance",
    type: "national",
    avgPremium: 38,
    premiumRange: { min: 20, max: 80 },
    reimbursement: [70, 80, 90],
    deductibleOptions: [100, 250, 500],
    annualLimits: ["$5,000", "$10,000", "Unlimited"],
    waitingPeriods: { accident: 14, illness: 14, cruciate: 6 },
    rating: 4.2,
    reviewCount: 12450,
    features: {
      accidentCoverage: true, illnessCoverage: true, hereditary: true,
      behavioral: true, altTherapy: true, examFees: false,
      prescriptions: true, dentalIllness: true, wellness: true,
      multiPetDiscount: true, directVetPay: false, mobileApp: true
    },
    pros: ["Supports ASPCA mission", "Behavioral coverage", "Wellness add-on available"],
    cons: ["14-day accident waiting period", "No exam fee coverage", "Some exclusions"],
    bestFor: "Animal welfare supporters wanting solid coverage",
    website: "https://www.aspcapetinsurance.com",
    founded: 2006,
    headquarters: "New York, NY"
  },
  {
    name: "Figo",
    type: "national",
    avgPremium: 40,
    premiumRange: { min: 22, max: 85 },
    reimbursement: [70, 80, 90, 100],
    deductibleOptions: [100, 250, 500, 750, 1000, 1500],
    annualLimits: ["$10,000", "$14,000", "Unlimited"],
    waitingPeriods: { accident: 1, illness: 14, cruciate: 6 },
    rating: 4.5,
    reviewCount: 14230,
    features: {
      accidentCoverage: true, illnessCoverage: true, hereditary: true,
      behavioral: true, altTherapy: true, examFees: true,
      prescriptions: true, dentalIllness: true, wellness: true,
      multiPetDiscount: true, directVetPay: false, mobileApp: true
    },
    pros: ["100% reimbursement option", "1-day accident wait", "Cloud-based pet tag included"],
    cons: ["Newer company", "Some state restrictions", "Wellness costs extra"],
    bestFor: "Tech-savvy owners wanting 100% reimbursement option",
    website: "https://www.figopetinsurance.com",
    founded: 2012,
    headquarters: "Chicago, IL"
  },
  {
    name: "Spot",
    type: "national",
    avgPremium: 37,
    premiumRange: { min: 19, max: 78 },
    reimbursement: [70, 80, 90],
    deductibleOptions: [100, 250, 500, 750, 1000],
    annualLimits: ["$2,500", "$3,000", "$4,000", "$5,000", "$7,000", "Unlimited"],
    waitingPeriods: { accident: 14, illness: 14, cruciate: 6 },
    rating: 4.6,
    reviewCount: 8920,
    features: {
      accidentCoverage: true, illnessCoverage: true, hereditary: true,
      behavioral: true, altTherapy: true, examFees: true,
      prescriptions: true, dentalIllness: true, wellness: true,
      multiPetDiscount: true, directVetPay: false, mobileApp: true
    },
    pros: ["30-day money-back guarantee", "No upper age limits", "Exam fee coverage"],
    cons: ["14-day accident wait", "Newer in market", "Some coverage caps"],
    bestFor: "Senior pet owners and those wanting exam fee coverage",
    website: "https://spotpetins.com",
    founded: 2019,
    headquarters: "Miami, FL"
  },
  {
    name: "ManyPets",
    type: "national",
    avgPremium: 33,
    premiumRange: { min: 15, max: 70 },
    reimbursement: [70, 80, 90],
    deductibleOptions: [250, 500],
    annualLimits: ["$10,000", "$15,000", "Unlimited"],
    waitingPeriods: { accident: 2, illness: 14, cruciate: 6 },
    rating: 4.4,
    reviewCount: 6780,
    features: {
      accidentCoverage: true, illnessCoverage: true, hereditary: true,
      behavioral: true, altTherapy: true, examFees: false,
      prescriptions: true, dentalIllness: true, wellness: true,
      multiPetDiscount: true, directVetPay: false, mobileApp: true
    },
    pros: ["Competitive pricing", "2-day accident wait", "Optional wellness"],
    cons: ["Limited deductible options", "Newer to US market", "No exam fees"],
    bestFor: "Price-conscious pet owners wanting quick accident coverage",
    website: "https://manypets.com",
    founded: 2017,
    headquarters: "New York, NY (UK origin)"
  }
];

const regionalProviders: InsuranceProvider[] = [
  {
    name: "Hartville",
    type: "regional",
    region: "Midwest & Northeast",
    avgPremium: 39,
    premiumRange: { min: 22, max: 82 },
    reimbursement: [70, 80, 90],
    deductibleOptions: [100, 250, 500],
    annualLimits: ["$5,000", "$10,000", "Unlimited"],
    waitingPeriods: { accident: 3, illness: 14, cruciate: 6 },
    rating: 4.3,
    reviewCount: 8450,
    features: {
      accidentCoverage: true, illnessCoverage: true, hereditary: true,
      behavioral: false, altTherapy: true, examFees: false,
      prescriptions: true, dentalIllness: true, wellness: true,
      multiPetDiscount: true, directVetPay: false, mobileApp: true
    },
    pros: ["AARP member discounts", "Wellness plans available", "Good regional presence"],
    cons: ["Limited behavioral coverage", "Regional focus", "No exam fees"],
    bestFor: "Midwest/Northeast pet owners, especially AARP members",
    website: "https://www.hartvillepetinsurance.com",
    founded: 1997,
    headquarters: "Canton, OH"
  },
  {
    name: "24PetWatch",
    type: "regional",
    region: "US & Canada",
    avgPremium: 36,
    premiumRange: { min: 18, max: 75 },
    reimbursement: [70, 80, 90],
    deductibleOptions: [100, 200, 300, 500],
    annualLimits: ["$5,000", "$10,000", "$20,000"],
    waitingPeriods: { accident: 5, illness: 14, cruciate: 6 },
    rating: 4.1,
    reviewCount: 5230,
    features: {
      accidentCoverage: true, illnessCoverage: true, hereditary: true,
      behavioral: false, altTherapy: true, examFees: false,
      prescriptions: true, dentalIllness: true, wellness: false,
      multiPetDiscount: true, directVetPay: false, mobileApp: true
    },
    pros: ["Free microchip ID tag", "Cross-border coverage (US/Canada)", "Lost pet services"],
    cons: ["No wellness plans", "Limited coverage caps", "Fewer reimbursement options"],
    bestFor: "Cross-border travelers and microchip registry users",
    website: "https://www.24petwatch.com",
    founded: 1996,
    headquarters: "Knoxville, TN"
  },
  {
    name: "Pumpkin",
    type: "regional",
    region: "Northeast & West Coast",
    avgPremium: 44,
    premiumRange: { min: 24, max: 90 },
    reimbursement: [90],
    deductibleOptions: [100, 250, 500],
    annualLimits: ["$10,000", "$20,000", "Unlimited"],
    waitingPeriods: { accident: 14, illness: 14, cruciate: 6 },
    rating: 4.7,
    reviewCount: 7890,
    features: {
      accidentCoverage: true, illnessCoverage: true, hereditary: true,
      behavioral: true, altTherapy: true, examFees: true,
      prescriptions: true, dentalIllness: true, wellness: true,
      multiPetDiscount: true, directVetPay: false, mobileApp: true
    },
    pros: ["90% reimbursement standard", "Preventive care included", "Exam fees covered"],
    cons: ["Higher premiums", "Only 90% option", "Regional availability"],
    bestFor: "Premium coverage seekers in coastal areas",
    website: "https://www.pumpkin.care",
    founded: 2020,
    headquarters: "New York, NY"
  },
  {
    name: "Fetch by The Dodo",
    type: "regional",
    region: "Major Metro Areas",
    avgPremium: 41,
    premiumRange: { min: 20, max: 88 },
    reimbursement: [70, 80, 90],
    deductibleOptions: [250, 300],
    annualLimits: ["Unlimited"],
    waitingPeriods: { accident: 15, illness: 15, cruciate: 6 },
    rating: 4.4,
    reviewCount: 11230,
    features: {
      accidentCoverage: true, illnessCoverage: true, hereditary: true,
      behavioral: true, altTherapy: true, examFees: false,
      prescriptions: true, dentalIllness: true, wellness: false,
      multiPetDiscount: false, directVetPay: false, mobileApp: true
    },
    pros: ["The Dodo content integration", "No annual limits", "Strong brand"],
    cons: ["Limited deductible options", "No multi-pet discount", "Metro focus"],
    bestFor: "Urban pet owners who love The Dodo content",
    website: "https://www.fetchpet.com",
    founded: 2014,
    headquarters: "New York, NY"
  },
  {
    name: "Bivvy",
    type: "regional",
    region: "Online Only - Select States",
    avgPremium: 25,
    premiumRange: { min: 18, max: 35 },
    reimbursement: [70],
    deductibleOptions: [250],
    annualLimits: ["$2,000", "$5,000"],
    waitingPeriods: { accident: 14, illness: 14, cruciate: 6 },
    rating: 3.9,
    reviewCount: 4120,
    features: {
      accidentCoverage: true, illnessCoverage: true, hereditary: false,
      behavioral: false, altTherapy: false, examFees: false,
      prescriptions: true, dentalIllness: false, wellness: false,
      multiPetDiscount: false, directVetPay: false, mobileApp: true
    },
    pros: ["Lowest fixed rates", "Simple pricing", "No age limits"],
    cons: ["Limited coverage", "Low annual caps", "Basic coverage only"],
    bestFor: "Budget-conscious owners wanting basic accident/illness coverage",
    website: "https://www.bivvy.com",
    founded: 2018,
    headquarters: "Kansas City, MO"
  },
  {
    name: "Wagmo",
    type: "regional",
    region: "East Coast",
    avgPremium: 28,
    premiumRange: { min: 15, max: 50 },
    reimbursement: [70, 80],
    deductibleOptions: [0, 250],
    annualLimits: ["Wellness-focused"],
    waitingPeriods: { accident: 0, illness: 0, cruciate: 0 },
    rating: 4.5,
    reviewCount: 3450,
    features: {
      accidentCoverage: false, illnessCoverage: false, hereditary: false,
      behavioral: false, altTherapy: false, examFees: true,
      prescriptions: true, dentalIllness: true, wellness: true,
      multiPetDiscount: true, directVetPay: false, mobileApp: true
    },
    pros: ["Wellness-only plans", "No waiting periods", "Routine care focus"],
    cons: ["No accident/illness coverage", "Limited to wellness", "Must pair with another insurer"],
    bestFor: "Pet owners wanting supplemental wellness coverage",
    website: "https://www.wagmo.io",
    founded: 2017,
    headquarters: "New York, NY"
  }
];

export default function InsuranceComparisonPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [providerFilter, setProviderFilter] = useState<'all' | 'national' | 'regional'>('all');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'value'>('value');
  const [compareToPolicy, setCompareToPolicy] = useState<number | null>(null);

  const policyForm = useForm<z.infer<typeof policyFormSchema>>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      providerName: "",
      planType: "accident_illness",
      monthlyPremium: 0,
      annualDeductible: 250,
      reimbursementRate: 80,
    },
  });

  const claimForm = useForm<z.infer<typeof claimFormSchema>>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      claimDate: new Date().toISOString().split('T')[0],
      amount: 0,
      category: "vet_visit",
      status: "pending",
    },
  });

  const { data: policies = [], isLoading: policiesLoading } = useQuery<InsurancePolicy[]>({
    queryKey: [`/api/users/${user?.dbId}/insurance-policies`],
    enabled: !!user?.dbId,
  });

  const { data: claims = [], isLoading: claimsLoading } = useQuery<InsuranceClaim[]>({
    queryKey: [`/api/users/${user?.dbId}/insurance-claims`],
    enabled: !!user?.dbId,
  });

  const { data: pets = [] } = useQuery<Pet[]>({
    queryKey: ['/api/pets'],
    enabled: !!user?.dbId,
  });

  const createPolicyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof policyFormSchema>) => {
      return apiRequest('POST', `/api/users/${user?.dbId}/insurance-policies`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.dbId}/insurance-policies`] });
      setIsPolicyDialogOpen(false);
      policyForm.reset();
      toast({ title: "Policy added successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to add policy", description: error.message, variant: "destructive" });
    },
  });

  const deletePolicyMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/insurance-policies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.dbId}/insurance-policies`] });
      toast({ title: "Policy deleted" });
    },
  });

  const createClaimMutation = useMutation({
    mutationFn: async (data: z.infer<typeof claimFormSchema>) => {
      return apiRequest('POST', `/api/users/${user?.dbId}/insurance-claims`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.dbId}/insurance-claims`] });
      setIsClaimDialogOpen(false);
      claimForm.reset();
      toast({ title: "Claim added successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to add claim", description: error.message, variant: "destructive" });
    },
  });

  const deleteClaimMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/insurance-claims/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.dbId}/insurance-claims`] });
      toast({ title: "Claim deleted" });
    },
  });

  const totalPremiumsPaid = policies.reduce((sum, p) => sum + (p.monthlyPremium * 12), 0);
  const totalClaimed = claims.reduce((sum, c) => sum + c.amount, 0);
  const totalReimbursed = claims.reduce((sum, c) => sum + (c.reimbursedAmount || 0), 0);
  const roi = totalPremiumsPaid > 0 ? ((totalReimbursed - totalPremiumsPaid) / totalPremiumsPaid * 100) : 0;

  const allProviders = useMemo(() => {
    let providers = [...nationalProviders, ...regionalProviders];
    
    if (providerFilter === 'national') {
      providers = providers.filter(p => p.type === 'national');
    } else if (providerFilter === 'regional') {
      providers = providers.filter(p => p.type === 'regional');
    }
    
    if (sortBy === 'price') {
      providers.sort((a, b) => a.avgPremium - b.avgPremium);
    } else if (sortBy === 'rating') {
      providers.sort((a, b) => b.rating - a.rating);
    } else {
      providers.sort((a, b) => {
        const valueA = (a.reimbursement[a.reimbursement.length - 1] / a.avgPremium) * a.rating;
        const valueB = (b.reimbursement[b.reimbursement.length - 1] / b.avgPremium) * b.rating;
        return valueB - valueA;
      });
    }
    
    return providers;
  }, [providerFilter, sortBy]);

  const selectedPolicy = policies.find(p => p.id === compareToPolicy);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <Check className="h-3 w-3" />;
      case 'approved': return <Check className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'denied': return <X className="h-3 w-3" />;
      default: return null;
    }
  };

  const toggleProviderSelection = (name: string) => {
    setSelectedProviders(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : prev.length < 4 ? [...prev, name] : prev
    );
  };

  const getComparisonValue = (provider: InsuranceProvider, metric: string): string | React.ReactNode => {
    switch (metric) {
      case 'premium':
        return `$${provider.avgPremium}/mo`;
      case 'reimbursement':
        return provider.reimbursement.join('%, ') + '%';
      case 'deductible':
        return '$' + provider.deductibleOptions.join(', $');
      case 'limits':
        return provider.annualLimits.join(', ');
      case 'accidentWait':
        return `${provider.waitingPeriods.accident} days`;
      case 'illnessWait':
        return `${provider.waitingPeriods.illness} days`;
      default:
        return '-';
    }
  };

  const FeatureIcon = ({ available }: { available: boolean }) => {
    return available 
      ? <CheckCircle2 className="h-4 w-4 text-green-600" />
      : <XCircle className="h-4 w-4 text-red-400" />;
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sign In Required</h1>
          <p className="text-muted-foreground">Please sign in to access insurance comparison features.</p>
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
                <Shield className="h-8 w-8 text-primary" />
                Pet Insurance Comparison
              </h1>
              <p className="text-muted-foreground mt-1">
                Compare national & regional providers, track claims, and see your ROI
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={isPolicyDialogOpen} onOpenChange={setIsPolicyDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-policy">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Policy
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Insurance Policy</DialogTitle>
                    <DialogDescription>
                      Add your pet insurance policy details to track coverage and claims.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...policyForm}>
                    <form onSubmit={policyForm.handleSubmit((data) => createPolicyMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={policyForm.control}
                        name="providerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provider Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Healthy Paws" {...field} data-testid="input-provider-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={policyForm.control}
                        name="policyNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Policy Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., POL-12345" {...field} data-testid="input-policy-number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={policyForm.control}
                        name="planType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Plan Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-plan-type">
                                  <SelectValue placeholder="Select plan type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="accident_only">Accident Only</SelectItem>
                                <SelectItem value="accident_illness">Accident & Illness</SelectItem>
                                <SelectItem value="comprehensive">Comprehensive</SelectItem>
                                <SelectItem value="wellness">Wellness Add-on</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={policyForm.control}
                          name="monthlyPremium"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Premium ($)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} data-testid="input-monthly-premium" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={policyForm.control}
                          name="annualDeductible"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Annual Deductible ($)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} data-testid="input-annual-deductible" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={policyForm.control}
                          name="reimbursementRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reimbursement Rate (%)</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" max="100" {...field} data-testid="input-reimbursement-rate" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={policyForm.control}
                          name="annualLimit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Annual Limit ($)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="Unlimited" {...field} data-testid="input-annual-limit" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {pets.length > 0 && (
                        <FormField
                          control={policyForm.control}
                          name="petId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Associated Pet (Optional)</FormLabel>
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
                      <Button type="submit" className="w-full" disabled={createPolicyMutation.isPending} data-testid="button-save-policy">
                        {createPolicyMutation.isPending ? "Saving..." : "Save Policy"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" data-testid="button-add-claim" disabled={policies.length === 0}>
                    <FileText className="h-4 w-4 mr-2" />
                    Add Claim
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Insurance Claim</DialogTitle>
                    <DialogDescription>
                      Track your insurance claims and reimbursements.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...claimForm}>
                    <form onSubmit={claimForm.handleSubmit((data) => createClaimMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={claimForm.control}
                        name="policyId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Policy</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value?.toString()}>
                              <FormControl>
                                <SelectTrigger data-testid="select-policy">
                                  <SelectValue placeholder="Select policy" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {policies.map((policy) => (
                                  <SelectItem key={policy.id} value={policy.id.toString()}>
                                    {policy.providerName} - {policy.planType}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={claimForm.control}
                        name="claimDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Claim Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-claim-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={claimForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-claim-category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="vet_visit">Vet Visit</SelectItem>
                                <SelectItem value="surgery">Surgery</SelectItem>
                                <SelectItem value="medication">Medication</SelectItem>
                                <SelectItem value="emergency">Emergency Care</SelectItem>
                                <SelectItem value="diagnostic">Diagnostic Tests</SelectItem>
                                <SelectItem value="hospitalization">Hospitalization</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={claimForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Claim Amount ($)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} data-testid="input-claim-amount" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={claimForm.control}
                          name="reimbursedAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reimbursed ($)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} data-testid="input-reimbursed-amount" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={claimForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-claim-status">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="denied">Denied</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={claimForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Brief description of the claim" {...field} data-testid="input-claim-description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={createClaimMutation.isPending} data-testid="button-save-claim">
                        {createClaimMutation.isPending ? "Saving..." : "Save Claim"}
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
                    <p className="text-sm text-muted-foreground">Annual Premiums</p>
                    <p className="text-2xl font-bold">${totalPremiumsPaid.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Claimed</p>
                    <p className="text-2xl font-bold">${totalClaimed.toLocaleString()}</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Reimbursed</p>
                    <p className="text-2xl font-bold">${totalReimbursed.toLocaleString()}</p>
                  </div>
                  <PiggyBank className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card className={`bg-gradient-to-br ${roi >= 0 ? 'from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900' : 'from-red-50 to-red-100 dark:from-red-950 dark:to-red-900'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Insurance ROI</p>
                    <p className="text-2xl font-bold flex items-center gap-1">
                      {roi >= 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                      {roi.toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className={`h-8 w-8 ${roi >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="compare" className="space-y-6">
            <TabsList>
              <TabsTrigger value="compare" data-testid="tab-compare">
                <Scale className="h-4 w-4 mr-2" />
                Compare Providers
              </TabsTrigger>
              <TabsTrigger value="policies" data-testid="tab-policies">
                <Shield className="h-4 w-4 mr-2" />
                My Policies
              </TabsTrigger>
              <TabsTrigger value="claims" data-testid="tab-claims">
                <FileText className="h-4 w-4 mr-2" />
                Claims History
              </TabsTrigger>
              <TabsTrigger value="calculator" data-testid="tab-calculator">
                <Calculator className="h-4 w-4 mr-2" />
                ROI Calculator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compare" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <Select value={providerFilter} onValueChange={(v: 'all' | 'national' | 'regional') => setProviderFilter(v)}>
                    <SelectTrigger className="w-[180px]" data-testid="select-provider-filter">
                      <SelectValue placeholder="Filter providers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <span className="flex items-center gap-2"><Globe className="h-4 w-4" /> All Providers</span>
                      </SelectItem>
                      <SelectItem value="national">
                        <span className="flex items-center gap-2"><Building2 className="h-4 w-4" /> National Only</span>
                      </SelectItem>
                      <SelectItem value="regional">
                        <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Regional Only</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={(v: 'price' | 'rating' | 'value') => setSortBy(v)}>
                    <SelectTrigger className="w-[160px]" data-testid="select-sort-by">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="value">Best Value</SelectItem>
                      <SelectItem value="price">Lowest Price</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>

                  {policies.length > 0 && (
                    <Select 
                      value={compareToPolicy?.toString() || "none"} 
                      onValueChange={(v) => setCompareToPolicy(v === "none" ? null : parseInt(v))}
                    >
                      <SelectTrigger className="w-[200px]" data-testid="select-compare-policy">
                        <SelectValue placeholder="Compare to my policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No comparison</SelectItem>
                        {policies.map((policy) => (
                          <SelectItem key={policy.id} value={policy.id.toString()}>
                            {policy.providerName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                {selectedProviders.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedProviders.length}/4 selected</Badge>
                    <Button size="sm" variant="outline" onClick={() => setSelectedProviders([])}>
                      Clear
                    </Button>
                  </div>
                )}
              </div>

              {selectedPolicy && (
                <Card className="border-primary bg-primary/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Comparing Against Your Policy</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Provider</p>
                        <p className="font-semibold">{selectedPolicy.providerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Premium</p>
                        <p className="font-semibold text-primary">${selectedPolicy.monthlyPremium}/mo</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Deductible</p>
                        <p className="font-semibold">${selectedPolicy.annualDeductible}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reimbursement</p>
                        <p className="font-semibold">{selectedPolicy.reimbursementRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Annual Limit</p>
                        <p className="font-semibold">{selectedPolicy.annualLimit ? `$${selectedPolicy.annualLimit.toLocaleString()}` : 'Unlimited'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      National Providers
                    </CardTitle>
                    <CardDescription>
                      Major insurance companies with nationwide coverage
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="w-full">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead className="min-w-[150px]">Provider</TableHead>
                            <TableHead className="text-right">Avg. Premium</TableHead>
                            <TableHead className="text-right">Reimbursement</TableHead>
                            <TableHead className="text-right">Deductible</TableHead>
                            <TableHead className="text-center">Rating</TableHead>
                            <TableHead className="text-center">Value</TableHead>
                            {selectedPolicy && <TableHead className="text-center">vs Your Policy</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allProviders.filter(p => p.type === 'national').map((provider) => {
                            const valueScore = (provider.reimbursement[provider.reimbursement.length - 1] / provider.avgPremium) * provider.rating / 10;
                            const premiumDiff = selectedPolicy ? provider.avgPremium - selectedPolicy.monthlyPremium : 0;
                            
                            return (
                              <TableRow 
                                key={provider.name}
                                className={selectedProviders.includes(provider.name) ? 'bg-primary/5' : ''}
                              >
                                <TableCell>
                                  <Checkbox
                                    checked={selectedProviders.includes(provider.name)}
                                    onCheckedChange={() => toggleProviderSelection(provider.name)}
                                    data-testid={`checkbox-provider-${provider.name.toLowerCase().replace(/\s/g, '-')}`}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{provider.name}</span>
                                    <span className="text-xs text-muted-foreground">Since {provider.founded}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">${provider.avgPremium}/mo</TableCell>
                                <TableCell className="text-right">{provider.reimbursement.join('-')}%</TableCell>
                                <TableCell className="text-right">${provider.deductibleOptions[0]} - ${provider.deductibleOptions[provider.deductibleOptions.length - 1]}</TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-medium">{provider.rating}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-center gap-2">
                                    <Progress value={valueScore * 100} className="w-16 h-2" />
                                    <span className="text-sm font-medium">{valueScore.toFixed(1)}</span>
                                  </div>
                                </TableCell>
                                {selectedPolicy && (
                                  <TableCell className="text-center">
                                    <Badge 
                                      variant={premiumDiff < 0 ? "default" : premiumDiff > 0 ? "destructive" : "secondary"}
                                      className="text-xs"
                                    >
                                      {premiumDiff < 0 ? `$${Math.abs(premiumDiff)} cheaper` : 
                                       premiumDiff > 0 ? `$${premiumDiff} more` : 'Same'}
                                    </Badge>
                                  </TableCell>
                                )}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Regional & Specialty Providers
                    </CardTitle>
                    <CardDescription>
                      Smaller insurers with regional focus or specialty coverage options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="w-full">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead className="min-w-[150px]">Provider</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead className="text-right">Avg. Premium</TableHead>
                            <TableHead className="text-right">Reimbursement</TableHead>
                            <TableHead className="text-center">Rating</TableHead>
                            <TableHead className="text-center">Value</TableHead>
                            {selectedPolicy && <TableHead className="text-center">vs Your Policy</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allProviders.filter(p => p.type === 'regional').map((provider) => {
                            const valueScore = (provider.reimbursement[provider.reimbursement.length - 1] / provider.avgPremium) * provider.rating / 10;
                            const premiumDiff = selectedPolicy ? provider.avgPremium - selectedPolicy.monthlyPremium : 0;
                            
                            return (
                              <TableRow 
                                key={provider.name}
                                className={selectedProviders.includes(provider.name) ? 'bg-primary/5' : ''}
                              >
                                <TableCell>
                                  <Checkbox
                                    checked={selectedProviders.includes(provider.name)}
                                    onCheckedChange={() => toggleProviderSelection(provider.name)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{provider.name}</span>
                                    <span className="text-xs text-muted-foreground">{provider.bestFor.slice(0, 35)}...</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-xs">
                                    {provider.region}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right font-medium">${provider.avgPremium}/mo</TableCell>
                                <TableCell className="text-right">{provider.reimbursement.join('-')}%</TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-medium">{provider.rating}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-center gap-2">
                                    <Progress value={valueScore * 100} className="w-16 h-2" />
                                    <span className="text-sm font-medium">{valueScore.toFixed(1)}</span>
                                  </div>
                                </TableCell>
                                {selectedPolicy && (
                                  <TableCell className="text-center">
                                    <Badge 
                                      variant={premiumDiff < 0 ? "default" : premiumDiff > 0 ? "destructive" : "secondary"}
                                      className="text-xs"
                                    >
                                      {premiumDiff < 0 ? `$${Math.abs(premiumDiff)} cheaper` : 
                                       premiumDiff > 0 ? `$${premiumDiff} more` : 'Same'}
                                    </Badge>
                                  </TableCell>
                                )}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {selectedProviders.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Side-by-Side Comparison
                    </CardTitle>
                    <CardDescription>
                      Detailed feature comparison of your selected providers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="w-full">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[200px]">Feature</TableHead>
                            {selectedPolicy && (
                              <TableHead className="text-center min-w-[150px] bg-primary/10">
                                <div className="flex flex-col items-center">
                                  <Badge variant="default" className="mb-1">Your Policy</Badge>
                                  <span>{selectedPolicy.providerName}</span>
                                </div>
                              </TableHead>
                            )}
                            {selectedProviders.map(name => {
                              const provider = allProviders.find(p => p.name === name);
                              return (
                                <TableHead key={name} className="text-center min-w-[150px]">
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="font-medium">{name}</span>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                      <span className="text-xs">{provider?.rating}</span>
                                    </div>
                                  </div>
                                </TableHead>
                              );
                            })}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Monthly Premium</TableCell>
                            {selectedPolicy && (
                              <TableCell className="text-center bg-primary/5 font-semibold">
                                ${selectedPolicy.monthlyPremium}/mo
                              </TableCell>
                            )}
                            {selectedProviders.map(name => {
                              const p = allProviders.find(pr => pr.name === name);
                              return <TableCell key={name} className="text-center">${p?.avgPremium}/mo</TableCell>;
                            })}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Reimbursement Options</TableCell>
                            {selectedPolicy && (
                              <TableCell className="text-center bg-primary/5">
                                {selectedPolicy.reimbursementRate}%
                              </TableCell>
                            )}
                            {selectedProviders.map(name => {
                              const p = allProviders.find(pr => pr.name === name);
                              return <TableCell key={name} className="text-center">{p?.reimbursement.join('%, ')}%</TableCell>;
                            })}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Deductible Range</TableCell>
                            {selectedPolicy && (
                              <TableCell className="text-center bg-primary/5">
                                ${selectedPolicy.annualDeductible}
                              </TableCell>
                            )}
                            {selectedProviders.map(name => {
                              const p = allProviders.find(pr => pr.name === name);
                              return <TableCell key={name} className="text-center">${p?.deductibleOptions.join(', $')}</TableCell>;
                            })}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Annual Limits</TableCell>
                            {selectedPolicy && (
                              <TableCell className="text-center bg-primary/5">
                                {selectedPolicy.annualLimit ? `$${selectedPolicy.annualLimit.toLocaleString()}` : 'Unlimited'}
                              </TableCell>
                            )}
                            {selectedProviders.map(name => {
                              const p = allProviders.find(pr => pr.name === name);
                              return <TableCell key={name} className="text-center text-sm">{p?.annualLimits.join(', ')}</TableCell>;
                            })}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Accident Wait</TableCell>
                            {selectedPolicy && <TableCell className="text-center bg-primary/5">-</TableCell>}
                            {selectedProviders.map(name => {
                              const p = allProviders.find(pr => pr.name === name);
                              return <TableCell key={name} className="text-center">{p?.waitingPeriods.accident} days</TableCell>;
                            })}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Illness Wait</TableCell>
                            {selectedPolicy && <TableCell className="text-center bg-primary/5">-</TableCell>}
                            {selectedProviders.map(name => {
                              const p = allProviders.find(pr => pr.name === name);
                              return <TableCell key={name} className="text-center">{p?.waitingPeriods.illness} days</TableCell>;
                            })}
                          </TableRow>
                          <TableRow className="bg-muted/30">
                            <TableCell className="font-semibold" colSpan={selectedPolicy ? selectedProviders.length + 2 : selectedProviders.length + 1}>
                              Coverage Features
                            </TableCell>
                          </TableRow>
                          {[
                            { key: 'hereditary', label: 'Hereditary Conditions' },
                            { key: 'behavioral', label: 'Behavioral Therapy' },
                            { key: 'altTherapy', label: 'Alternative Therapy' },
                            { key: 'examFees', label: 'Exam Fees Covered' },
                            { key: 'prescriptions', label: 'Prescriptions' },
                            { key: 'dentalIllness', label: 'Dental Illness' },
                            { key: 'wellness', label: 'Wellness Plans' },
                            { key: 'multiPetDiscount', label: 'Multi-Pet Discount' },
                            { key: 'directVetPay', label: 'Direct Vet Payment' },
                          ].map(({ key, label }) => (
                            <TableRow key={key}>
                              <TableCell>{label}</TableCell>
                              {selectedPolicy && <TableCell className="text-center bg-primary/5"><HelpCircle className="h-4 w-4 mx-auto text-muted-foreground" /></TableCell>}
                              {selectedProviders.map(name => {
                                const p = allProviders.find(pr => pr.name === name);
                                return (
                                  <TableCell key={name} className="text-center">
                                    <FeatureIcon available={p?.features[key as keyof typeof p.features] || false} />
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    These are estimated average rates based on industry data and may vary based on pet age, breed, location, and specific coverage options. 
                    Always request personalized quotes from providers for accurate pricing. Data compiled from provider websites and industry reports (2024).
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="policies">
              {policiesLoading ? (
                <div className="text-center py-8">Loading policies...</div>
              ) : policies.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Policies Yet</h3>
                    <p className="text-muted-foreground mb-4">Add your first insurance policy to start tracking coverage and claims.</p>
                    <Button onClick={() => setIsPolicyDialogOpen(true)} data-testid="button-add-first-policy">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Policy
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {policies.map((policy) => (
                    <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{policy.providerName}</CardTitle>
                            <CardDescription>{policy.planType?.replace('_', ' ').toUpperCase()}</CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deletePolicyMutation.mutate(policy.id)}
                            data-testid={`button-delete-policy-${policy.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Monthly Premium</span>
                            <span className="font-semibold">${policy.monthlyPremium}/mo</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Annual Deductible</span>
                            <span className="font-semibold">${policy.annualDeductible}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Reimbursement</span>
                            <span className="font-semibold">{policy.reimbursementRate}%</span>
                          </div>
                          {policy.annualLimit && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Annual Limit</span>
                              <span className="font-semibold">${policy.annualLimit.toLocaleString()}</span>
                            </div>
                          )}
                          {policy.policyNumber && (
                            <div className="pt-2 border-t">
                              <span className="text-xs text-muted-foreground">Policy #: {policy.policyNumber}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="claims">
              {claimsLoading ? (
                <div className="text-center py-8">Loading claims...</div>
              ) : claims.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Claims Yet</h3>
                    <p className="text-muted-foreground mb-4">Track your insurance claims to monitor your coverage usage and ROI.</p>
                    {policies.length > 0 ? (
                      <Button onClick={() => setIsClaimDialogOpen(true)} data-testid="button-add-first-claim">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Claim
                      </Button>
                    ) : (
                      <p className="text-sm text-muted-foreground">Add a policy first to start tracking claims.</p>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Reimbursed</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {claims.map((claim) => (
                          <TableRow key={claim.id}>
                            <TableCell>{format(new Date(claim.claimDate), 'MMM d, yyyy')}</TableCell>
                            <TableCell className="capitalize">{claim.category.replace('_', ' ')}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{claim.description || '-'}</TableCell>
                            <TableCell className="text-right font-medium">${claim.amount}</TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              ${claim.reimbursedAmount || 0}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(claim.status)} flex items-center gap-1 w-fit`}>
                                {getStatusIcon(claim.status)}
                                {claim.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteClaimMutation.mutate(claim.id)}
                                data-testid={`button-delete-claim-${claim.id}`}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="calculator">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Insurance ROI Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate if pet insurance is worth it based on your expected costs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ROICalculator />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

function ROICalculator() {
  const [monthlyPremium, setMonthlyPremium] = useState(45);
  const [deductible, setDeductible] = useState(250);
  const [reimbursement, setReimbursement] = useState(80);
  const [expectedAnnualCost, setExpectedAnnualCost] = useState(2000);

  const annualPremium = monthlyPremium * 12;
  const effectiveCoverage = Math.max(0, expectedAnnualCost - deductible);
  const expectedReimbursement = effectiveCoverage * (reimbursement / 100);
  const netCost = annualPremium - expectedReimbursement;
  const roi = ((expectedReimbursement - annualPremium) / annualPremium) * 100;
  const breakEvenCost = deductible + (annualPremium / (reimbursement / 100));

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Monthly Premium ($)</Label>
            <Input
              type="number"
              value={monthlyPremium}
              onChange={(e) => setMonthlyPremium(Number(e.target.value))}
              data-testid="input-calc-premium"
            />
          </div>
          <div>
            <Label>Annual Deductible ($)</Label>
            <Input
              type="number"
              value={deductible}
              onChange={(e) => setDeductible(Number(e.target.value))}
              data-testid="input-calc-deductible"
            />
          </div>
          <div>
            <Label>Reimbursement Rate (%)</Label>
            <Input
              type="number"
              value={reimbursement}
              onChange={(e) => setReimbursement(Number(e.target.value))}
              data-testid="input-calc-reimbursement"
            />
          </div>
          <div>
            <Label>Expected Annual Vet Costs ($)</Label>
            <Input
              type="number"
              value={expectedAnnualCost}
              onChange={(e) => setExpectedAnnualCost(Number(e.target.value))}
              data-testid="input-calc-expected-cost"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Card className="bg-primary/5">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Annual Premium Cost</span>
                <span className="font-semibold">${annualPremium}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected Reimbursement</span>
                <span className="font-semibold text-green-600">${expectedReimbursement.toFixed(0)}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-muted-foreground">Net Cost/Savings</span>
                <span className={`font-bold ${netCost > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {netCost > 0 ? '-' : '+'}${Math.abs(netCost).toFixed(0)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className={roi > 0 ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Calculated ROI</p>
              <p className={`text-3xl font-bold ${roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Break-Even Point</p>
              <p className="text-xl font-semibold">${breakEvenCost.toFixed(0)}/year</p>
              <p className="text-xs text-muted-foreground mt-1">
                You need to spend at least this much in vet bills annually for insurance to pay off
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Heart className="h-4 w-4 text-primary" />
          Insurance Value Assessment
        </h4>
        {expectedAnnualCost > breakEvenCost ? (
          <p className="text-sm text-green-700 dark:text-green-300">
            Based on your expected vet costs, pet insurance appears to be a good investment. 
            You're likely to save ${(expectedReimbursement - annualPremium).toFixed(0)} annually.
          </p>
        ) : (
          <p className="text-sm text-amber-700 dark:text-amber-300">
            With your expected vet costs, insurance may not provide immediate savings. However, 
            it offers peace of mind for unexpected emergencies that could cost thousands.
          </p>
        )}
      </div>
    </div>
  );
}
