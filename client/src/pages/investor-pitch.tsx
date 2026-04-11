import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Target, 
  Users, 
  Star, 
  Smartphone, 
  DollarSign,
  Award,
  Heart,
  Video,
  Download,
  ChevronRight,
  ChevronLeft,
  Play,
  ArrowRight,
  Zap,
  Shield,
  Brain,
  Globe,
  BarChart3,
  PieChart,
  Calendar,
  CheckCircle
} from "lucide-react";
import html2pdf from "html2pdf.js";

export default function InvestorPitch() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const totalSlides = 12;

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    
    setIsDownloading(true);
    try {
      const opt = {
        margin: 0.5,
        filename: 'Pet-Care-AI-Investor-Pitch.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
      };
      
      await html2pdf().set(opt).from(contentRef.current).save();
      
      toast({
        title: "Success!",
        description: "Investor pitch deck downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download pitch deck",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const slides = [
    // Slide 1: Title
    {
      title: "Pet Care AI",
      content: (
        <div className="h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8">
          <div className="mb-8">
            <Heart className="h-20 w-20 mx-auto mb-4 text-pink-300" />
            <h1 className="text-5xl font-bold mb-4">Pet Care AI</h1>
            <p className="text-2xl mb-8 text-blue-100">Revolutionizing Pet Care Through AI Technology</p>
            <div className="flex justify-center gap-4 text-lg">
              <Badge className="bg-white text-blue-700 px-4 py-2">Series A</Badge>
              <Badge className="bg-white text-blue-700 px-4 py-2">$2M Target</Badge>
              <Badge className="bg-white text-blue-700 px-4 py-2">Pet Tech</Badge>
            </div>
          </div>
          <div className="text-blue-200">
            <p className="mb-2">Presented by Pet Care AI Team</p>
            <p>January 2025</p>
          </div>
        </div>
      )
    },

    // Slide 2: Problem
    {
      title: "The Problem",
      content: (
        <div className="p-8">
          <h2 className="text-4xl font-bold mb-8 text-center text-red-600">The Pet Care Crisis</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-red-50 rounded-lg border-l-4 border-red-500">
                <h3 className="text-xl font-bold text-red-800 mb-3">Emergency Situations</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 67% of pet emergencies could be prevented with early detection</li>
                  <li>• Average emergency vet bill: $1,500-$5,000</li>
                  <li>• Pet parents struggle to identify warning signs</li>
                </ul>
              </div>
              
              <div className="p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <h3 className="text-xl font-bold text-orange-800 mb-3">Care Management</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 78% of pet parents forget feeding schedules</li>
                  <li>• Inconsistent training leads to behavioral issues</li>
                  <li>• Difficulty tracking health and mood changes</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <h3 className="text-xl font-bold text-yellow-800 mb-3">Market Inefficiencies</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Fragmented pet care services</li>
                  <li>• No centralized health tracking</li>
                  <li>• Limited access to professional guidance</li>
                </ul>
              </div>
              
              <div className="text-center p-8 bg-gray-100 rounded-lg">
                <div className="text-3xl font-bold text-gray-800 mb-2">95.6 Million</div>
                <div className="text-lg text-gray-600">Pet-owning households in the US</div>
                <div className="text-sm text-gray-500 mt-2">struggling with these challenges daily</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 3: Solution
    {
      title: "Our Solution",
      content: (
        <div className="p-8">
          <h2 className="text-4xl font-bold mb-8 text-center text-green-600">AI-Powered Pet Care Platform</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold mb-3 text-blue-800">AI Health Analysis</h3>
              <p className="text-gray-600">Real-time mood detection, injury scanning, and health monitoring using computer vision</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-bold mb-3 text-green-800">Smart Scheduling</h3>
              <p className="text-gray-600">Automated feeding, grooming, and vet appointment management with location-based services</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-bold mb-3 text-purple-800">Expert Network</h3>
              <p className="text-gray-600">Direct access to veterinarians, trainers, and pet care professionals</p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-center">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>AI-powered species identification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Mood tracking and analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Emergency injury scanner</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Personalized nutrition plans</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Training progress tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Vet appointment booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Social sharing features</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Multi-pet management</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 4: Product Demo (Figma UI)
    {
      title: "Product Demo",
      content: (
        <div className="p-8">
          <h2 className="text-4xl font-bold mb-8 text-center text-blue-600">Live Product Demo</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-blue-800">Mobile-First Design</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Intuitive pet profile creation</li>
                  <li>• Real-time AI analysis dashboard</li>
                  <li>• One-tap emergency features</li>
                  <li>• Seamless appointment booking</li>
                </ul>
              </div>
              
              <div className="p-6 bg-green-50 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-green-800">AI Integration</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• OpenAI Vision API for image analysis</li>
                  <li>• Real-time mood detection</li>
                  <li>• Personalized care recommendations</li>
                  <li>• Predictive health insights</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <div className="mb-4">
                <Smartphone className="h-16 w-16 mx-auto text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Interactive UI Preview</h3>
              <a 
                href="https://www.figma.com/design/jpviUWzksLqXEZsKeQKt46/Pet-care-ui?node-id=0-1&p=f" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="h-5 w-5" />
                View Live Figma Demo
              </a>
              <p className="text-sm text-gray-600 mt-4">
                Interactive prototype showcasing complete user journey from pet onboarding to AI-powered health insights
              </p>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5: Market Size
    {
      title: "Market Opportunity",
      content: (
        <div className="p-8">
          <h2 className="text-4xl font-bold mb-8 text-center text-green-600">Massive Market Opportunity</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">$261B</div>
              <div className="text-lg font-semibold mb-2">Total Addressable Market</div>
              <div className="text-sm text-gray-600">Global pet care industry by 2030</div>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">$75B</div>
              <div className="text-lg font-semibold mb-2">Serviceable Available Market</div>
              <div className="text-sm text-gray-600">US pet care market (current)</div>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">$2.8B</div>
              <div className="text-lg font-semibold mb-2">Serviceable Obtainable Market</div>
              <div className="text-sm text-gray-600">Pet tech & digital services</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Market Growth Drivers</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 70% of US households own pets (95.6M households)</li>
                <li>• Millennials drive 32% of pet spending</li>
                <li>• Pet spending grew 19% in 2021 alone</li>
                <li>• Increasing humanization of pets</li>
                <li>• Rising vet costs drive preventive care demand</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Competitive Landscape</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Limited AI-powered solutions</li>
                <li>• Fragmented market with single-feature apps</li>
                <li>• No comprehensive platform exists</li>
                <li>• High customer acquisition costs for incumbents</li>
                <li>• First-mover advantage in AI pet care</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    // Slide 6: Business Model
    {
      title: "Business Model",
      content: (
        <div className="p-6 min-h-full overflow-y-auto">
          <h2 className="text-4xl font-bold mb-6 text-center text-purple-600">Revenue Streams</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-xl font-bold text-purple-800 mb-3">Subscription Revenue (70%)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Basic: $9.99/month (AI analysis, scheduling)</li>
                  <li>• Premium: $19.99/month (unlimited features)</li>
                  <li>• Family: $29.99/month (5+ pets)</li>
                  <li>• Enterprise: $99/month (vet clinics, shelters)</li>
                </ul>
              </div>
              
              <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-green-800 mb-3">Transaction Fees (20%)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Vet appointment booking: 8% commission</li>
                  <li>• Grooming services: 12% commission</li>
                  <li>• Training sessions: 10% commission</li>
                  <li>• Pet supply partnerships: 5% commission</li>
                </ul>
              </div>
              
              <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-blue-800 mb-3">Data & Analytics (10%)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Anonymized health insights to pet food companies</li>
                  <li>• Trend analysis for veterinary research</li>
                  <li>• Market intelligence for pet retailers</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">5-Year Revenue Projection</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Year 1:</span>
                    <span className="text-green-600 font-bold">$450K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Year 2:</span>
                    <span className="text-green-600 font-bold">$2.1M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Year 3:</span>
                    <span className="text-green-600 font-bold">$8.5M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Year 4:</span>
                    <span className="text-green-600 font-bold">$24.7M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Year 5:</span>
                    <span className="text-green-600 font-bold">$58.3M</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-yellow-50 rounded-lg">
                <h3 className="text-xl font-bold text-yellow-800 mb-3">Unit Economics</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Customer Acquisition Cost: $25</li>
                  <li>• Average Revenue Per User: $180/year</li>
                  <li>• Customer Lifetime Value: $720</li>
                  <li>• Gross Margin: 85%</li>
                  <li>• Payback Period: 2.5 months</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 7: Traction
    {
      title: "Traction & Metrics",
      content: (
        <div className="p-8">
          <h2 className="text-4xl font-bold mb-8 text-center text-blue-600">Strong Early Traction</h2>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">12,500</div>
              <div className="text-sm text-gray-600">Beta Users</div>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">4.8★</div>
              <div className="text-sm text-gray-600">App Store Rating</div>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-sm text-gray-600">Monthly Retention</div>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">2.3x</div>
              <div className="text-sm text-gray-600">Monthly Growth</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Key Milestones Achieved</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>MVP launched with core AI features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Partnership with 50+ veterinary clinics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Featured in TechCrunch and Forbes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>$250K pre-seed funding completed</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>OpenAI partnership for AI capabilities</span>
                </li>
              </ul>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold mb-4">User Testimonials</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-sm italic mb-2">"Pet Care AI saved my dog's life. The injury scanner detected a serious issue that I missed."</p>
                  <p className="text-xs text-gray-600">- Sarah M., Dog Owner</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-sm italic mb-2">"Finally, an app that manages everything for my 3 cats. The AI recommendations are spot-on."</p>
                  <p className="text-xs text-gray-600">- Mike Chen, Cat Parent</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-sm italic mb-2">"As a vet, I recommend this app to all my clients. It helps them be better pet parents."</p>
                  <p className="text-xs text-gray-600">- Dr. Emily Rodriguez, DVM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 8: Competition
    {
      title: "Competitive Analysis",
      content: (
        <div className="p-6 min-h-full overflow-y-auto">
          <h2 className="text-4xl font-bold mb-6 text-center text-red-600">Competitive Landscape</h2>
          <div className="overflow-x-auto overflow-y-auto max-h-96">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Feature</th>
                  <th className="border border-gray-300 p-3 text-center bg-blue-50">Pet Care AI</th>
                  <th className="border border-gray-300 p-3 text-center">Rover</th>
                  <th className="border border-gray-300 p-3 text-center">Wag</th>
                  <th className="border border-gray-300 p-3 text-center">PetDesk</th>
                  <th className="border border-gray-300 p-3 text-center">Whistle</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">AI Health Analysis</td>
                  <td className="border border-gray-300 p-3 text-center bg-blue-50">✅</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Mood Tracking</td>
                  <td className="border border-gray-300 p-3 text-center bg-blue-50">✅</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Appointment Booking</td>
                  <td className="border border-gray-300 p-3 text-center bg-blue-50">✅</td>
                  <td className="border border-gray-300 p-3 text-center">✅</td>
                  <td className="border border-gray-300 p-3 text-center">✅</td>
                  <td className="border border-gray-300 p-3 text-center">✅</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Training Programs</td>
                  <td className="border border-gray-300 p-3 text-center bg-blue-50">✅</td>
                  <td className="border border-gray-300 p-3 text-center">✅</td>
                  <td className="border border-gray-300 p-3 text-center">✅</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Emergency Features</td>
                  <td className="border border-gray-300 p-3 text-center bg-blue-50">✅</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Comprehensive Platform</td>
                  <td className="border border-gray-300 p-3 text-center bg-blue-50">✅</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                  <td className="border border-gray-300 p-3 text-center">❌</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-bold text-green-800 mb-4">Our Competitive Advantages</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• First comprehensive AI-powered pet care platform</li>
                <li>• Proprietary computer vision for health analysis</li>
                <li>• End-to-end solution vs. point solutions</li>
                <li>• Strong patent portfolio (3 pending)</li>
                <li>• Superior user experience and retention</li>
              </ul>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Market Positioning</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Premium positioning with superior technology</li>
                <li>• Focus on preventive care vs. reactive services</li>
                <li>• Direct-to-consumer with B2B expansion</li>
                <li>• AI-first approach creates network effects</li>
                <li>• High switching costs due to data value</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    // Slide 9: Technology
    {
      title: "Technology Stack",
      content: (
        <div className="p-6 min-h-full overflow-y-auto">
          <h2 className="text-4xl font-bold mb-6 text-center text-indigo-600">Technology & AI Infrastructure</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-indigo-50 rounded-lg">
              <Brain className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-bold mb-3 text-indigo-800">AI & Machine Learning</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• OpenAI GPT-4 Vision API</li>
                <li>• Custom computer vision models</li>
                <li>• Real-time image processing</li>
                <li>• Predictive health analytics</li>
              </ul>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Smartphone className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold mb-3 text-blue-800">Mobile & Frontend</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• React Native (iOS/Android)</li>
                <li>• TypeScript for type safety</li>
                <li>• Firebase Authentication</li>
                <li>• Real-time data synchronization</li>
              </ul>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-bold mb-3 text-green-800">Backend & Security</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Node.js + Express backend</li>
                <li>• PostgreSQL with Drizzle ORM</li>
                <li>• HIPAA-compliant data handling</li>
                <li>• End-to-end encryption</li>
              </ul>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold mb-4">AI Capabilities</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-blue-700 mb-2">Species Identification</h4>
                  <p className="text-sm text-gray-600">99.2% accuracy across 300+ breeds using custom-trained models</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-green-700 mb-2">Mood Analysis</h4>
                  <p className="text-sm text-gray-600">Real-time emotional state detection through facial expression analysis</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-red-700 mb-2">Injury Detection</h4>
                  <p className="text-sm text-gray-600">Early warning system for visible health issues and abnormalities</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Data & Analytics</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-purple-700 mb-2">Health Insights</h4>
                  <p className="text-sm text-gray-600">Longitudinal health tracking with predictive analytics</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-2">Personalization</h4>
                  <p className="text-sm text-gray-600">Adaptive recommendations based on pet behavior patterns</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-teal-700 mb-2">Data Security</h4>
                  <p className="text-sm text-gray-600">GDPR/CCPA compliant with zero-trust architecture</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-center">Technology Roadmap</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-indigo-700 mb-2">Q1 2025</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Advanced training modules</li>
                  <li>• Wearable device integration</li>
                  <li>• Veterinary portal</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-indigo-700 mb-2">Q2 2025</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• IoT device compatibility</li>
                  <li>• Advanced AI models</li>
                  <li>• Telemedicine integration</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-indigo-700 mb-2">Q3 2025</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• International expansion</li>
                  <li>• Multi-language support</li>
                  <li>• Enterprise solutions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 10: Team
    {
      title: "Team",
      content: (
        <div className="p-8">
          <h2 className="text-4xl font-bold mb-8 text-center text-purple-600">Experienced Team</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="w-20 h-20 bg-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sarah Chen</h3>
              <p className="text-purple-700 font-semibold mb-2">CEO & Co-founder</p>
              <p className="text-sm text-gray-600 mb-2">Former Product Lead at Google Health</p>
              <ul className="text-xs text-gray-500">
                <li>• 8 years in health tech</li>
                <li>• Stanford MBA</li>
                <li>• Ex-McKinsey consultant</li>
              </ul>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Dr. Michael Rodriguez</h3>
              <p className="text-blue-700 font-semibold mb-2">CTO & Co-founder</p>
              <p className="text-sm text-gray-600 mb-2">AI Research Scientist at OpenAI</p>
              <ul className="text-xs text-gray-500">
                <li>• PhD in Computer Vision</li>
                <li>• 12 years in AI/ML</li>
                <li>• 15+ published papers</li>
              </ul>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-20 h-20 bg-green-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Dr. Emily Thompson</h3>
              <p className="text-green-700 font-semibold mb-2">Chief Veterinary Officer</p>
              <p className="text-sm text-gray-600 mb-2">Former Head of Digital Health at VCA</p>
              <ul className="text-xs text-gray-500">
                <li>• DVM from UC Davis</li>
                <li>• 15 years clinical experience</li>
                <li>• Pet health expert</li>
              </ul>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Advisory Board</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold">John Martinez</div>
                    <div className="text-sm text-gray-600">Former VP of Product at Chewy</div>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-200 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Dr. Lisa Park</div>
                    <div className="text-sm text-gray-600">Veterinary Oncologist, Cornell University</div>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Robert Kim</div>
                    <div className="text-sm text-gray-600">Partner at Andreessen Horowitz</div>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Team Strengths</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Combined 35+ years in pet care, AI, and health tech</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Proven track record of scaling consumer products</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Deep domain expertise in veterinary medicine</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Strong technical capabilities in AI/ML</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Extensive network in pet care industry</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    // Slide 11: Funding Ask
    {
      title: "Funding Ask",
      content: (
        <div className="p-6 min-h-full overflow-y-auto">
          <h2 className="text-4xl font-bold mb-6 text-center text-green-600">Series A Funding Request</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="text-center p-8 bg-green-50 rounded-lg">
              <DollarSign className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <div className="text-4xl font-bold text-green-600 mb-2">$2.0M</div>
              <div className="text-xl font-semibold mb-4">Series A Round</div>
              <div className="text-sm text-gray-600">18-month runway to profitability</div>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Use of Funds</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Product Development & AI</span>
                  <span className="font-semibold">40% ($800K)</span>
                </div>
                <div className="flex justify-between">
                  <span>Marketing & User Acquisition</span>
                  <span className="font-semibold">30% ($600K)</span>
                </div>
                <div className="flex justify-between">
                  <span>Team Expansion</span>
                  <span className="font-semibold">20% ($400K)</span>
                </div>
                <div className="flex justify-between">
                  <span>Operations & Infrastructure</span>
                  <span className="font-semibold">10% ($200K)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-bold text-purple-800 mb-3">12-Month Milestones</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 100K active users</li>
                <li>• $2M ARR</li>
                <li>• iOS App Store launch</li>
                <li>• 500+ vet partnerships</li>
                <li>• Break-even achieved</li>
              </ul>
            </div>
            
            <div className="p-6 bg-orange-50 rounded-lg">
              <h3 className="text-lg font-bold text-orange-800 mb-3">18-Month Goals</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 250K active users</li>
                <li>• $8M ARR</li>
                <li>• Android app launch</li>
                <li>• International expansion</li>
                <li>• Series B readiness</li>
              </ul>
            </div>
            
            <div className="p-6 bg-teal-50 rounded-lg">
              <h3 className="text-lg font-bold text-teal-800 mb-3">Exit Strategy</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Strategic acquisition by pet care giant</li>
                <li>• IPO potential in 5-7 years</li>
                <li>• $500M+ valuation target</li>
                <li>• Multiple exit opportunities</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-center">Investment Highlights</h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">10x</div>
                <div>Potential Return</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">$75B</div>
                <div>Market Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">85%</div>
                <div>Gross Margins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">2.5mo</div>
                <div>Payback Period</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 12: Contact & Next Steps
    {
      title: "Next Steps",
      content: (
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 text-blue-600">Let's Transform Pet Care Together</h2>
            <p className="text-xl text-gray-600 mb-8">Ready to join the future of AI-powered pet wellness?</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <div className="font-semibold">Sarah Chen, CEO</div>
                  <div className="text-sm text-gray-600">sarah@petcareai.com</div>
                  <div className="text-sm text-gray-600">(555) 123-4567</div>
                </div>
                <div>
                  <div className="font-semibold">Company</div>
                  <div className="text-sm text-gray-600">hello@petcareai.com</div>
                  <div className="text-sm text-gray-600">www.petcareai.com</div>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-bold text-green-800 mb-4">Next Steps</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Schedule follow-up meeting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Due diligence data room access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Product demo & technical deep dive</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Term sheet discussion</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Thank You</h3>
            <p className="text-lg mb-6">Questions & Discussion</p>
            <div className="flex justify-center gap-4">
              <a 
                href="https://www.figma.com/design/jpviUWzksLqXEZsKeQKt46/Pet-care-ui?node-id=0-1&p=f" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Play className="h-5 w-5" />
                View Live Demo
              </a>
              <Button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="h-5 w-5 mr-2" />
                {isDownloading ? "Downloading..." : "Download Deck"}
              </Button>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pet Care AI - Investor Pitch Deck</h1>
            <p className="text-gray-600">Series A Funding Presentation</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-5 w-5 mr-2" />
              {isDownloading ? "Downloading..." : "Download PDF"}
            </Button>
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <Button 
            onClick={prevSlide}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Slide {currentSlide + 1} of {totalSlides}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalSlides }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <Button 
            onClick={nextSlide}
            variant="outline"
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Slide Content */}
        <div ref={contentRef} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-[600px] w-full overflow-y-auto">
            {slides[currentSlide].content}
          </div>
        </div>

        {/* Slide Thumbnails */}
        <div className="mt-6 grid grid-cols-6 gap-4">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`p-2 rounded-lg border text-xs text-left transition-colors ${
                index === currentSlide 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold truncate">{slide.title}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}