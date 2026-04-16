import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Brain, 
  Camera, 
  Calendar, 
  Users, 
  Shield, 
  TrendingUp,
  Utensils,
  GraduationCap,
  Scissors,
  Bell,
  Share2,
  User,
  DollarSign,
  BarChart3,
  MapPin,
  Stethoscope,
  MessageCircle,
  Star,
  Clock,
  FileText,
  Globe,
  Smartphone
} from "lucide-react";
import { useLocation } from "wouter";

const featureCategories = [
  {
    title: "Core Pet Management",
    icon: Heart,
    color: "bg-red-50 text-red-600 border-red-200",
    features: [
      {
        name: "AI Pet Species Identification",
        description: "Upload photos to identify your pet's breed and species using advanced AI",
        icon: Camera,
        badge: "AI-Powered"
      },
      {
        name: "Pet Profile Management",
        description: "Comprehensive pet profiles with breed, age, size, and health details",
        icon: FileText,
        badge: "Essential"
      },
      {
        name: "Pet Mood Analysis",
        description: "AI-powered mood tracking with personalized recommendations",
        icon: Brain,
        badge: "AI-Powered"
      },
      {
        name: "Photo Gallery",
        description: "Organize and manage your pet's photos with smart categorization",
        icon: Camera,
        badge: "Core"
      }
    ]
  },
  {
    title: "Health & Medical",
    icon: Stethoscope,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    features: [
      {
        name: "AI Injury Scanner",
        description: "Scan pet injuries and receive treatment recommendations",
        icon: Brain,
        badge: "AI-Powered"
      },
      {
        name: "Health Assessment Quiz",
        description: "Comprehensive health evaluations with risk level analysis",
        icon: Heart,
        badge: "Medical"
      },
      {
        name: "Vet Consultation Booking",
        description: "Schedule appointments with local veterinarians",
        icon: Calendar,
        badge: "Professional"
      },
      {
        name: "Pet Health Chat",
        description: "24/7 AI assistant for health questions and concerns",
        icon: MessageCircle,
        badge: "AI-Powered"
      },
      {
        name: "Emergency Care Guide",
        description: "Immediate action steps for pet emergencies",
        icon: Heart,
        badge: "Critical"
      }
    ]
  },
  {
    title: "Nutrition & Feeding",
    icon: Utensils,
    color: "bg-green-50 text-green-600 border-green-200",
    features: [
      {
        name: "Personalized Nutrition Plans",
        description: "AI-generated meal plans based on breed and health needs",
        icon: Brain,
        badge: "AI-Powered"
      },
      {
        name: "Food Recommendation Engine",
        description: "Specific product suggestions with brand recommendations",
        icon: Star,
        badge: "Smart"
      },
      {
        name: "Feeding Schedule Management",
        description: "Create and manage customized feeding schedules",
        icon: Clock,
        badge: "Essential"
      },
      {
        name: "Portion Size Calculator",
        description: "Calculate optimal portions based on weight and activity",
        icon: BarChart3,
        badge: "Smart"
      },
      {
        name: "Feeding Reminders",
        description: "Never miss a meal with smart notification system",
        icon: Bell,
        badge: "Convenience"
      }
    ]
  },
  {
    title: "Training & Behavior",
    icon: GraduationCap,
    color: "bg-purple-50 text-purple-600 border-purple-200",
    features: [
      {
        name: "AI Training Plans",
        description: "Step-by-step training programs tailored to your pet",
        icon: Brain,
        badge: "AI-Powered"
      },
      {
        name: "Progress Tracking",
        description: "Monitor training milestones and achievements",
        icon: TrendingUp,
        badge: "Analytics"
      },
      {
        name: "Professional Trainer Booking",
        description: "Connect with certified pet trainers in your area",
        icon: Users,
        badge: "Professional"
      },
      {
        name: "Exercise Recommendations",
        description: "Personalized exercise plans based on breed needs",
        icon: Heart,
        badge: "Health"
      },
      {
        name: "Behavioral Guidance",
        description: "Expert tips for common behavioral challenges",
        icon: MessageCircle,
        badge: "Expert"
      }
    ]
  },
  {
    title: "Grooming & Care",
    icon: Scissors,
    color: "bg-yellow-50 text-yellow-600 border-yellow-200",
    features: [
      {
        name: "Grooming Schedule Tracker",
        description: "Track grooming appointments and maintenance tasks",
        icon: Calendar,
        badge: "Organization"
      },
      {
        name: "Professional Groomer Finder",
        description: "Locate and book appointments with local groomers",
        icon: MapPin,
        badge: "Local Services"
      },
      {
        name: "Grooming Tips & Tutorials",
        description: "Learn professional grooming techniques at home",
        icon: GraduationCap,
        badge: "Educational"
      },
      {
        name: "Task Completion Tracking",
        description: "Mark grooming tasks as complete with progress tracking",
        icon: TrendingUp,
        badge: "Progress"
      }
    ]
  },
  {
    title: "Social & Sharing",
    icon: Share2,
    color: "bg-pink-50 text-pink-600 border-pink-200",
    features: [
      {
        name: "Achievement Sharing",
        description: "Share pet milestones on social media platforms",
        icon: Star,
        badge: "Social"
      },
      {
        name: "Missing Pet Alerts",
        description: "Quickly share missing pet information with contact details",
        icon: Bell,
        badge: "Emergency"
      },
      {
        name: "Milestone Celebrations",
        description: "Track and celebrate your pet's special moments",
        icon: Heart,
        badge: "Memories"
      },
      {
        name: "Community Features",
        description: "Connect with other pet owners and share experiences",
        icon: Users,
        badge: "Community"
      }
    ]
  },
  {
    title: "Business & Analytics",
    icon: TrendingUp,
    color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    features: [
      {
        name: "Marketing Strategy Suite",
        description: "Comprehensive marketing plans and implementation guides",
        icon: Globe,
        badge: "Business"
      },
      {
        name: "Investor Pitch Deck",
        description: "Professional 12-slide presentation for Series A funding",
        icon: DollarSign,
        badge: "Investment"
      },
      {
        name: "Revenue Projections",
        description: "Financial modeling and analytics dashboard",
        icon: BarChart3,
        badge: "Analytics"
      },
      {
        name: "Business Integrations",
        description: "Connect with pet service providers and vendors",
        icon: Users,
        badge: "B2B"
      },
      {
        name: "Content Marketing Tools",
        description: "Blog strategy, SEO optimization, and social media planning",
        icon: FileText,
        badge: "Marketing"
      }
    ]
  },
  {
    title: "User Management",
    icon: User,
    color: "bg-gray-50 text-gray-600 border-gray-200",
    features: [
      {
        name: "Firebase Authentication",
        description: "Secure login with Google and Facebook integration",
        icon: Shield,
        badge: "Security"
      },
      {
        name: "Multi-Pet Households",
        description: "Manage multiple pets from a single account",
        icon: Users,
        badge: "Family"
      },
      {
        name: "User Profile Management",
        description: "Customize your profile and preferences",
        icon: User,
        badge: "Personal"
      },
      {
        name: "Privacy Controls",
        description: "Manage data sharing and privacy settings",
        icon: Shield,
        badge: "Privacy"
      }
    ]
  },
  {
    title: "Service Integration",
    icon: MapPin,
    color: "bg-orange-50 text-orange-600 border-orange-200",
    features: [
      {
        name: "Google Maps Integration",
        description: "Find local pet services with ratings and reviews",
        icon: MapPin,
        badge: "Location"
      },
      {
        name: "Service Provider Network",
        description: "Connect with vets, groomers, and trainers",
        icon: Users,
        badge: "Professional"
      },
      {
        name: "Appointment Booking System",
        description: "Unified booking across all pet service categories",
        icon: Calendar,
        badge: "Convenience"
      },
      {
        name: "Review & Rating System",
        description: "Read and write reviews for service providers",
        icon: Star,
        badge: "Community"
      }
    ]
  },
  {
    title: "Smart Reminders",
    icon: Bell,
    color: "bg-teal-50 text-teal-600 border-teal-200",
    features: [
      {
        name: "Feeding Notifications",
        description: "Customizable meal reminders with smart scheduling",
        icon: Utensils,
        badge: "Daily Care"
      },
      {
        name: "Medication Alerts",
        description: "Never miss medication doses with precise timing",
        icon: Heart,
        badge: "Health"
      },
      {
        name: "Appointment Reminders",
        description: "Get notified before vet and grooming appointments",
        icon: Calendar,
        badge: "Organization"
      },
      {
        name: "Training Session Alerts",
        description: "Stay consistent with training schedule notifications",
        icon: GraduationCap,
        badge: "Consistency"
      }
    ]
  }
];

export default function Features() {
  const [_, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Smartphone className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pet Care AI Features
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the comprehensive suite of AI-powered features designed to revolutionize pet care. 
            From health monitoring to business analytics, our platform covers every aspect of modern pet management.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              40+ Features
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Professional Grade
            </Badge>
          </div>
        </div>

        {/* Feature Categories */}
        <div className="space-y-16">
          {featureCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="relative">
              {/* Category Header */}
              <div className="flex items-center mb-8">
                <div className={`p-3 rounded-lg ${category.color} mr-4`}>
                  <category.icon className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
                  <p className="text-gray-600 mt-1">{category.features.length} features in this category</p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.features.map((feature, featureIndex) => (
                  <Card key={featureIndex} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${category.color}`}>
                            <feature.icon className="h-5 w-5" />
                          </div>
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {feature.name}
                          </CardTitle>
                        </div>
                        <Badge 
                          variant={feature.badge === "AI-Powered" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {feature.badge}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Platform Overview</h3>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Pet Care AI represents the future of intelligent pet management, combining cutting-edge AI with practical everyday solutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">40+</div>
              <div className="text-blue-100">Total Features</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">10</div>
              <div className="text-blue-100">Feature Categories</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">15+</div>
              <div className="text-blue-100">AI-Powered Features</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">5+</div>
              <div className="text-blue-100">Business Tools</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Pet Care?
            </h3>
            <p className="text-gray-600 mb-6">
              Experience the most comprehensive pet care platform powered by advanced AI technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setLocation("/")}
                className="bg-[#0F172A] text-white px-10 py-4 rounded-full font-bold shadow-[0_20px_50px_rgba(15,23,42,0.3)] hover:shadow-[0_25px_60px_rgba(15,23,42,0.5)] hover:-translate-y-1 transition-all duration-300"
              >
                Get Started
              </button>
              <button 
                onClick={() => setLocation("/")}
                className="border border-gray-300 text-gray-700 px-10 py-4 rounded-full font-bold hover:bg-gray-50 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}