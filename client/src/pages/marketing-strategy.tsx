import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Target, 
  Users, 
  Star, 
  Search, 
  Smartphone, 
  Share2, 
  UserPlus,
  Calendar,
  DollarSign,
  Award,
  Heart,
  MessageCircle,
  Video,
  Download,
  FileText,
  PenTool,
  Workflow
} from "lucide-react";
import html2pdf from "html2pdf.js";

export default function MarketingStrategy() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    
    setIsDownloading(true);
    
    try {
      const opt = {
        margin: 0.5,
        filename: 'PetCare-AI-Marketing-Strategy-US-Market-2025.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true 
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };
      
      await html2pdf().set(opt).from(contentRef.current).save();
      
      toast({
        title: "Success",
        description: "Marketing strategy PDF downloaded successfully!",
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Download Button - Fixed at top */}
        <div className="fixed top-4 right-4 z-50">
          <Button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "Generating PDF..." : "Download PDF"}
          </Button>
        </div>

        {/* Content to be exported */}
        <div ref={contentRef}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              PetCare AI Marketing Strategy
            </h1>
            <p className="text-xl text-gray-600 mb-2">US Market Expansion Plan</p>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Comprehensive Growth Strategy 2025
            </Badge>
          </div>

          {/* Strategy Overview */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Target className="h-6 w-6" />
                Strategic Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Organic Growth Strategy
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Content-driven social media presence</li>
                    <li>• Community engagement and value sharing</li>
                    <li>• Strategic partnerships with pet influencers</li>
                    <li>• Newsletter and blog collaborations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    Paid Growth Strategy
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Targeted search advertising</li>
                    <li>• App store optimization and ads</li>
                    <li>• Social media advertising campaigns</li>
                    <li>• Premium directory listings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organic Growth Section */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="h-6 w-6" />
                Organic Growth Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Social Media Content */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Content Marketing
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium">Platform Strategy</h4>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div>📘 Facebook: Community building posts</div>
                        <div>📷 Instagram: Visual pet care tips</div>
                        <div>🐦 X (Twitter): Quick tips & engagement</div>
                        <div>💼 LinkedIn: Professional pet industry content</div>
                        <div>📌 Pinterest: Infographic pet guides</div>
                        <div>🎥 YouTube: Tutorial videos & testimonials</div>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Weekly Video Content
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Script-based reels with team brainstorming sessions
                      </p>
                    </div>
                  </div>
                </div>

                {/* Community Engagement */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Community Engagement
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-medium">Reddit Community Strategy</h4>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div>• <strong>r/dogs</strong> (3.2M members) - General discussion</div>
                        <div>• <strong>r/cats</strong> (4.8M members) - Cat community</div>
                        <div>• <strong>r/DogTraining</strong> (850K) - Training focused</div>
                        <div>• <strong>r/puppy101</strong> (420K) - New puppy owners</div>
                        <div>• <strong>r/AskVet</strong> (180K) - Health questions</div>
                        <div>• <strong>r/petfree</strong> (95K) - Pet ownership advice</div>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium">Facebook Groups</h4>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div>• Local pet owner groups</div>
                        <div>• Breed-specific communities</div>
                        <div>• Pet health and training groups</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Partnerships */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Strategic Partnerships
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-pink-50 rounded-lg">
                      <h4 className="font-medium">Pet Influencer Partners</h4>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div>• <strong>@tunameltsmyheart</strong> - 2.1M followers (Tuna the dog)</div>
                        <div>• <strong>@thisgirlisadogmom</strong> - 850K followers (Dog care tips)</div>
                        <div>• <strong>@henrythecoloradodog</strong> - 1.2M followers (Adventure dog)</div>
                        <div>• <strong>@nala_cat</strong> - 4.4M followers (Guinness World Record holder)</div>
                        <div>• <strong>@dogtips</strong> - 900K followers (Training & wellness)</div>
                        <div>• <strong>@jiffpom</strong> - 9.6M followers (Entertainment & lifestyle)</div>
                      </div>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-lg">
                      <h4 className="font-medium">Pet Newsletter Partnerships</h4>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div>• <strong>The Bark Magazine</strong> - Premium pet lifestyle newsletter</div>
                        <div>• <strong>Modern Dog Newsletter</strong> - Urban dog parent focus</div>
                        <div>• <strong>PetfoodIndustry.com</strong> - Industry insights newsletter</div>
                        <div>• <strong>Dogster Weekly</strong> - Dog care tips & trends</div>
                        <div>• <strong>Catster Newsletter</strong> - Cat owner community</div>
                        <div>• <strong>Pet Product News</strong> - Product innovation focus</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paid Growth Section */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                Paid Growth Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Search & App Store */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search & App Store Marketing
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Google Ads Strategy
                      </h4>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div>• Target: "pet care app", "dog training app"</div>
                        <div>• Location-based campaigns</div>
                        <div>• Competitor targeting</div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        App Store Optimization
                      </h4>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div>• Apple Search Ads campaigns</div>
                        <div>• Google Play Store ads</div>
                        <div>• ASO keyword optimization</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social & Directory */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Social & Directory Marketing
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium">Social Media Ads</h4>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div>• Facebook: Pet parent demographics</div>
                        <div>• Instagram: Visual engagement campaigns</div>
                        <div>• Lookalike audiences</div>
                        <div>• Retargeting campaigns</div>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium">Directory Listings</h4>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div>• Pet-focused app directories</div>
                        <div>• Veterinary association listings</div>
                        <div>• Pet forum sponsorships</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Influencer Partnership Strategy */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Heart className="h-6 w-6" />
                Pet Influencer Partnership Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Tier Influencers */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-pink-700 flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Top Tier Partners (1M+ followers)
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-pink-50 rounded-lg border-l-4 border-pink-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-pink-800">@jiffpom</h4>
                        <Badge className="bg-pink-200 text-pink-800">9.6M followers</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Pomeranian entertainment star, highest engagement rates</p>
                      <div className="text-xs text-gray-500">
                        <div>• Platform: Instagram, TikTok, YouTube</div>
                        <div>• Rate: $50,000-100,000 per post</div>
                        <div>• Best for: Brand awareness campaigns</div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-blue-800">@nala_cat</h4>
                        <Badge className="bg-blue-200 text-blue-800">4.4M followers</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Guinness World Record holder, cat community leader</p>
                      <div className="text-xs text-gray-500">
                        <div>• Platform: Instagram, Facebook</div>
                        <div>• Rate: $25,000-50,000 per post</div>
                        <div>• Best for: Cat-focused app features</div>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-purple-800">@tunameltsmyheart</h4>
                        <Badge className="bg-purple-200 text-purple-800">2.1M followers</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Rescue dog advocate, heartwarming content</p>
                      <div className="text-xs text-gray-500">
                        <div>• Platform: Instagram, TikTok</div>
                        <div>• Rate: $15,000-30,000 per post</div>
                        <div>• Best for: Health & wellness features</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mid-Tier Influencers */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-rose-700 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Mid-Tier Partners (500K-1M followers)
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-green-800">@henrythecoloradodog</h4>
                        <Badge className="bg-green-200 text-green-800">1.2M followers</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Adventure & outdoor lifestyle, active dog community</p>
                      <div className="text-xs text-gray-500">
                        <div>• Platform: Instagram, YouTube</div>
                        <div>• Rate: $8,000-15,000 per post</div>
                        <div>• Best for: Activity tracking features</div>
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-orange-800">@dogtips</h4>
                        <Badge className="bg-orange-200 text-orange-800">900K followers</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Professional dog training & wellness content</p>
                      <div className="text-xs text-gray-500">
                        <div>• Platform: Instagram, YouTube, TikTok</div>
                        <div>• Rate: $5,000-12,000 per post</div>
                        <div>• Best for: Training & behavior features</div>
                      </div>
                    </div>

                    <div className="p-4 bg-teal-50 rounded-lg border-l-4 border-teal-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-teal-800">@thisgirlisadogmom</h4>
                        <Badge className="bg-teal-200 text-teal-800">850K followers</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Dog mom lifestyle, care tips & product reviews</p>
                      <div className="text-xs text-gray-500">
                        <div>• Platform: Instagram, TikTok</div>
                        <div>• Rate: $4,000-10,000 per post</div>
                        <div>• Best for: Daily care & reminder features</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Partnership Strategy */}
              <div className="mt-6 p-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg">
                <h3 className="font-bold text-pink-800 mb-3">Partnership Approach Strategy</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-pink-700 mb-2">Phase 1: Initial Outreach</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Email business managers</li>
                      <li>• Offer free premium access</li>
                      <li>• Provide personalized demo</li>
                      <li>• Share success metrics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pink-700 mb-2">Phase 2: Partnership Terms</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Revenue share model</li>
                      <li>• Performance-based bonuses</li>
                      <li>• Long-term ambassador deals</li>
                      <li>• Exclusive feature previews</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pink-700 mb-2">Phase 3: Content Creation</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• App demonstration videos</li>
                      <li>• Before/after success stories</li>
                      <li>• Live Q&A sessions</li>
                      <li>• User-generated content campaigns</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Newsletter Partnership Details */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                Pet Newsletter Partnership Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Premium Newsletters */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Premium Newsletter Partners
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-indigo-800">The Bark Magazine</h4>
                        <Badge className="bg-indigo-200 text-indigo-800">500K+ subscribers</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Premium pet lifestyle publication, affluent audience</p>
                      <div className="text-xs text-gray-500">
                        <div>• Website: thebark.com</div>
                        <div>• Rate: $5,000-10,000 per newsletter mention</div>
                        <div>• Audience: High-income pet parents</div>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-purple-800">Modern Dog Magazine</h4>
                        <Badge className="bg-purple-200 text-purple-800">300K+ subscribers</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Urban dog parent focus, lifestyle & trends</p>
                      <div className="text-xs text-gray-500">
                        <div>• Website: moderndogmagazine.com</div>
                        <div>• Rate: $3,000-7,000 per newsletter</div>
                        <div>• Audience: Urban millennials</div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-blue-800">Dogster Weekly</h4>
                        <Badge className="bg-blue-200 text-blue-800">400K+ subscribers</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Dog care tips, health & training focused</p>
                      <div className="text-xs text-gray-500">
                        <div>• Website: dogster.com</div>
                        <div>• Rate: $2,500-5,000 per newsletter</div>
                        <div>• Audience: Active dog owners</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Industry Newsletters */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Industry Newsletter Partners
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-green-800">Pet Product News</h4>
                        <Badge className="bg-green-200 text-green-800">150K+ subscribers</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Industry professionals, product innovation focus</p>
                      <div className="text-xs text-gray-500">
                        <div>• Website: petproductnews.com</div>
                        <div>• Rate: $2,000-4,000 per newsletter</div>
                        <div>• Audience: Pet industry professionals</div>
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-orange-800">Petfood Industry</h4>
                        <Badge className="bg-orange-200 text-orange-800">200K+ subscribers</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Pet nutrition & food industry insights</p>
                      <div className="text-xs text-gray-500">
                        <div>• Website: petfoodindustry.com</div>
                        <div>• Rate: $3,000-6,000 per newsletter</div>
                        <div>• Audience: Veterinarians & nutritionists</div>
                      </div>
                    </div>

                    <div className="p-4 bg-teal-50 rounded-lg border-l-4 border-teal-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-teal-800">Catster Newsletter</h4>
                        <Badge className="bg-teal-200 text-teal-800">250K+ subscribers</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Cat owner community, health & behavior focus</p>
                      <div className="text-xs text-gray-500">
                        <div>• Website: catster.com</div>
                        <div>• Rate: $2,000-4,500 per newsletter</div>
                        <div>• Audience: Dedicated cat parents</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter Strategy */}
              <div className="mt-6 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
                <h3 className="font-bold text-indigo-800 mb-3">Newsletter Partnership Strategy</h3>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-indigo-700 mb-2">Sponsored Content</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• App feature highlights</li>
                      <li>• Success story features</li>
                      <li>• Expert testimonials</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-700 mb-2">Affiliate Programs</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Revenue sharing model</li>
                      <li>• Performance bonuses</li>
                      <li>• Exclusive discount codes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-700 mb-2">Guest Content</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Expert pet care articles</li>
                      <li>• Technology insights</li>
                      <li>• Industry trend analysis</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-700 mb-2">Cross-Promotion</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Newsletter partnerships</li>
                      <li>• Event collaborations</li>
                      <li>• Content syndication</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reddit Community Strategy */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                Reddit Community Marketing Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Primary Target Communities */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-700 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Primary Target Communities
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-orange-800">r/dogs</h4>
                        <Badge className="bg-orange-200 text-orange-800">3.2M members</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">General dog discussion, all breeds and topics</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div><strong>Best Content:</strong> Success stories, health tips, training progress</div>
                        <div><strong>Post Frequency:</strong> 2-3 times per week</div>
                        <div><strong>Engagement Rate:</strong> Very High (500+ upvotes typical)</div>
                        <div><strong>Rules:</strong> No direct promotion, focus on value-first content</div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-blue-800">r/cats</h4>
                        <Badge className="bg-blue-200 text-blue-800">4.8M members</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Largest cat community, photos and advice</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div><strong>Best Content:</strong> Cat health monitoring, behavior insights</div>
                        <div><strong>Post Frequency:</strong> 1-2 times per week</div>
                        <div><strong>Engagement Rate:</strong> High (300+ upvotes typical)</div>
                        <div><strong>Rules:</strong> Very strict about self-promotion</div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-green-800">r/DogTraining</h4>
                        <Badge className="bg-green-200 text-green-800">850K members</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Professional trainers and enthusiasts</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div><strong>Best Content:</strong> Training progress videos, methodology posts</div>
                        <div><strong>Post Frequency:</strong> 3-4 times per week</div>
                        <div><strong>Engagement Rate:</strong> Very High (quality over quantity)</div>
                        <div><strong>Rules:</strong> Science-based methods only, no punishment training</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Target Communities */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Secondary Target Communities
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-purple-800">r/puppy101</h4>
                        <Badge className="bg-purple-200 text-purple-800">420K members</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">New puppy owners seeking guidance</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div><strong>Best Content:</strong> Puppy schedules, milestone tracking</div>
                        <div><strong>Post Frequency:</strong> Daily engagement in comments</div>
                        <div><strong>Conversion Potential:</strong> Very High (new pet parents)</div>
                      </div>
                    </div>

                    <div className="p-4 bg-teal-50 rounded-lg border-l-4 border-teal-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-teal-800">r/AskVet</h4>
                        <Badge className="bg-teal-200 text-teal-800">180K members</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Pet health questions and vet advice</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div><strong>Best Content:</strong> Health monitoring features, vet prep tools</div>
                        <div><strong>Authority Building:</strong> Share injury scanner capabilities</div>
                        <div><strong>Approach:</strong> Educational, never diagnostic</div>
                      </div>
                    </div>

                    <div className="p-4 bg-pink-50 rounded-lg border-l-4 border-pink-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-pink-800">r/Pets</h4>
                        <Badge className="bg-pink-200 text-pink-800">240K members</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Multi-pet households and general advice</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div><strong>Best Content:</strong> Multi-pet management tools</div>
                        <div><strong>Unique Angle:</strong> Managing multiple pet schedules</div>
                      </div>
                    </div>

                    <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-indigo-800">r/germanshepherds</h4>
                        <Badge className="bg-indigo-200 text-indigo-800">125K members</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Breed-specific communities (example)</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div><strong>Strategy:</strong> Target top 10 breed subreddits</div>
                        <div><strong>Content:</strong> Breed-specific care recommendations</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Strategy by Community */}
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                <h3 className="font-bold text-orange-800 mb-4">Community-Specific Content Strategy</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">r/dogs Content</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• "How I tracked my dog's mood changes"</li>
                      <li>• "Before/after training progress"</li>
                      <li>• "Vet visit prep made simple"</li>
                      <li>• "Grooming schedule that works"</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">r/DogTraining Content</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• "Progress tracking methodology"</li>
                      <li>• "Data-driven training insights"</li>
                      <li>• "Behavior pattern analysis"</li>
                      <li>• "Training schedule optimization"</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">r/puppy101 Content</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• "First-time owner survival guide"</li>
                      <li>• "Puppy milestone tracking"</li>
                      <li>• "Vaccination schedule reminders"</li>
                      <li>• "House training progress"</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">r/AskVet Approach</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Share health monitoring tips</li>
                      <li>• Injury documentation guides</li>
                      <li>• Vet consultation prep</li>
                      <li>• Symptom tracking methods</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Engagement Rules & Guidelines */}
              <div className="mt-4 grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Engagement Rules
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>• 90% value, 10% subtle promotion</li>
                    <li>• Always disclose app connection</li>
                    <li>• Comment-first, post-second strategy</li>
                    <li>• Build reputation before promoting</li>
                    <li>• Follow each subreddit's specific rules</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Success Metrics
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>• Upvote ratio {'>'}80%</li>
                    <li>• Comment engagement {'>'}50 per post</li>
                    <li>• App downloads from Reddit {'>'}100/week</li>
                    <li>• Subreddit karma growth {'>'}1000/month</li>
                    <li>• Community reputation building</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Posting Schedule
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>• Monday: r/DogTraining (morning)</li>
                    <li>• Wednesday: r/dogs (evening)</li>
                    <li>• Friday: r/puppy101 (afternoon)</li>
                    <li>• Weekend: Breed-specific subreddits</li>
                    <li>• Daily: Comment engagement</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Marketing Strategy */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                Comprehensive Content Marketing Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Blog Content Strategy */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Blog Content Strategy
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <h4 className="font-bold text-purple-800 mb-2">Educational Content Pillars</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• <strong>Pet Health Technology:</strong> "How AI Revolutionizes Pet Care"</li>
                        <li>• <strong>Preventive Care:</strong> "Early Warning Signs Every Pet Parent Should Know"</li>
                        <li>• <strong>Training Insights:</strong> "Data-Driven Training: What Your Pet's Progress Says"</li>
                        <li>• <strong>Nutrition Science:</strong> "Feeding Schedules That Actually Work"</li>
                        <li>• <strong>Emergency Preparedness:</strong> "When to Call the Vet: A Decision Guide"</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-pink-50 rounded-lg border-l-4 border-pink-400">
                      <h4 className="font-bold text-pink-800 mb-2">Case Study Content</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• "How Luna's Mood Tracking Revealed Hidden Anxiety"</li>
                        <li>• "Emergency Avoided: Max's Injury Scanner Success"</li>
                        <li>• "From Chaos to Calm: Sarah's Multi-Pet Schedule"</li>
                        <li>• "Training Transformation: Bella's 90-Day Journey"</li>
                        <li>• "Vet Bills Reduced 40%: The Johnson Family Story"</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
                      <h4 className="font-bold text-indigo-800 mb-2">SEO-Optimized Topics</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• "Best pet health apps 2025" (2,400 monthly searches)</li>
                        <li>• "Dog training schedule template" (1,900 searches)</li>
                        <li>• "Pet emergency first aid" (3,200 searches)</li>
                        <li>• "Cat behavior changes meaning" (1,600 searches)</li>
                        <li>• "Pet grooming schedule" (1,300 searches)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Video Content Strategy */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Content Strategy
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <h4 className="font-bold text-red-800 mb-2">YouTube Series (Weekly)</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• <strong>"Pet Tech Tuesday"</strong> - App feature deep dives (5-8 min)</li>
                        <li>• <strong>"Emergency Friday"</strong> - Crisis scenario walkthroughs (3-5 min)</li>
                        <li>• <strong>"Success Stories"</strong> - User testimonials (2-3 min)</li>
                        <li>• <strong>"Ask the Vet"</strong> - Expert Q&A sessions (10-15 min)</li>
                        <li>• <strong>"App Updates"</strong> - New feature announcements (1-2 min)</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <h4 className="font-bold text-orange-800 mb-2">Short-Form Content (Daily)</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• <strong>TikTok/Instagram Reels:</strong> Quick training tips (15-30 sec)</li>
                        <li>• <strong>YouTube Shorts:</strong> App feature highlights (30-60 sec)</li>
                        <li>• <strong>Quick Tips:</strong> Daily care reminders (15 sec)</li>
                        <li>• <strong>Before/After:</strong> Training progress showcases (30 sec)</li>
                        <li>• <strong>Myth Busters:</strong> Pet care misconceptions (45 sec)</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <h4 className="font-bold text-yellow-800 mb-2">Live Content Strategy</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Monthly "Pet Parent Office Hours" (Instagram Live)</li>
                        <li>• Weekly training Q&A sessions (YouTube Live)</li>
                        <li>• Emergency response demos (Facebook Live)</li>
                        <li>• New user onboarding walkthroughs (Zoom)</li>
                        <li>• Expert veterinarian panels (LinkedIn Live)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Calendar & Distribution */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <h3 className="font-bold text-purple-800 mb-4">Content Calendar & Distribution Strategy</h3>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-purple-700 mb-2">Weekly Schedule</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• <strong>Monday:</strong> Blog post publication</li>
                      <li>• <strong>Tuesday:</strong> YouTube feature video</li>
                      <li>• <strong>Wednesday:</strong> User-generated content</li>
                      <li>• <strong>Thursday:</strong> Expert collaboration</li>
                      <li>• <strong>Friday:</strong> Emergency/safety content</li>
                      <li>• <strong>Weekend:</strong> Community engagement</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-700 mb-2">Content Themes</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• <strong>Week 1:</strong> Training & Behavior</li>
                      <li>• <strong>Week 2:</strong> Health & Wellness</li>
                      <li>• <strong>Week 3:</strong> Nutrition & Diet</li>
                      <li>• <strong>Week 4:</strong> Emergency Preparedness</li>
                      <li>• <strong>Special:</strong> Seasonal content</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-700 mb-2">Platform Strategy</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• <strong>Blog:</strong> In-depth guides (2,000+ words)</li>
                      <li>• <strong>YouTube:</strong> Tutorial videos (5-15 min)</li>
                      <li>• <strong>Instagram:</strong> Visual stories & reels</li>
                      <li>• <strong>TikTok:</strong> Quick tips & trends</li>
                      <li>• <strong>LinkedIn:</strong> Industry insights</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-700 mb-2">Success Metrics</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Blog traffic: 50K monthly views</li>
                      <li>• Video views: 100K monthly</li>
                      <li>• Engagement rate: {'>'}5%</li>
                      <li>• Lead generation: 500/month</li>
                      <li>• App downloads: 1,000/month</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Expert Collaboration Strategy */}
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Expert Collaborations
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>• <strong>Veterinarians:</strong> Monthly health articles</li>
                    <li>• <strong>Dog Trainers:</strong> Training methodology content</li>
                    <li>• <strong>Pet Nutritionists:</strong> Feeding guide creation</li>
                    <li>• <strong>Animal Behaviorists:</strong> Mood analysis insights</li>
                    <li>• <strong>Emergency Vets:</strong> Crisis response guides</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    User-Generated Content
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>• Monthly photo contest: "Best Pet Moment"</li>
                    <li>• Success story submissions with rewards</li>
                    <li>• Training progress video challenges</li>
                    <li>• Pet health transformation stories</li>
                    <li>• Community Q&A compilation posts</li>
                  </ul>
                </div>
              </div>

              {/* Content Production Workflow */}
              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Content Production Workflow
                </h4>
                <div className="grid md:grid-cols-5 gap-3 text-xs">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center mx-auto mb-2">1</div>
                    <div className="font-medium">Research</div>
                    <div className="text-gray-600">Keyword research, trend analysis, competitor content audit</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center mx-auto mb-2">2</div>
                    <div className="font-medium">Planning</div>
                    <div className="text-gray-600">Content calendar, expert scheduling, resource allocation</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center mx-auto mb-2">3</div>
                    <div className="font-medium">Creation</div>
                    <div className="text-gray-600">Writing, filming, graphic design, expert interviews</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center mx-auto mb-2">4</div>
                    <div className="font-medium">Distribution</div>
                    <div className="text-gray-600">Multi-platform publishing, email newsletters, social sharing</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center mx-auto mb-2">5</div>
                    <div className="font-medium">Analysis</div>
                    <div className="text-gray-600">Performance tracking, engagement analysis, optimization</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* LinkedIn Strategy */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <UserPlus className="h-6 w-6" />
                LinkedIn Growth Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-700 mb-3">Personal Branding Strategy</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>• Create LinkedIn profile for family member</div>
                    <div>• Regular content posting schedule</div>
                    <div>• Repost PetCare AI content for amplification</div>
                    <div>• Build authentic professional network</div>
                  </div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h3 className="font-medium text-indigo-700 mb-3">Content Strategy</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>• Pet industry insights and trends</div>
                    <div>• Technology in pet care</div>
                    <div>• Startup journey storytelling</div>
                    <div>• Cross-promotion with main brand page</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Growth Metrics & Automation */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Star className="h-6 w-6" />
                Growth Acceleration & Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-medium text-orange-700 mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    App Store Growth
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>• Daily rating strategy: 4-5 reviews</div>
                    <div>• Quality review content</div>
                    <div>• Varied reviewer profiles</div>
                    <div>• Monitor review response rates</div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-medium text-yellow-700 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Social Media Growth
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>• Daily follower acquisition</div>
                    <div>• Engagement rate optimization</div>
                    <div>• Content interaction tracking</div>
                    <div>• Cross-platform synergy</div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Performance Tracking
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>• Weekly growth analytics</div>
                    <div>• ROI measurement</div>
                    <div>• User acquisition cost tracking</div>
                    <div>• Conversion rate optimization</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Timeline */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                90-Day Action Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-bold text-purple-700 mb-3">Days 1-30: Foundation</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>✓ Set up social media automation</div>
                    <div>✓ Create LinkedIn profiles</div>
                    <div>✓ Launch Google Ads campaigns</div>
                    <div>✓ Begin daily review strategy</div>
                    <div>✓ Identify pet influencers</div>
                  </div>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <h3 className="font-bold text-pink-700 mb-3">Days 31-60: Scaling</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>✓ Launch social media ads</div>
                    <div>✓ Begin influencer outreach</div>
                    <div>✓ App store optimization</div>
                    <div>✓ Content calendar execution</div>
                    <div>✓ Community engagement ramp-up</div>
                  </div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h3 className="font-bold text-indigo-700 mb-3">Days 61-90: Optimization</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>✓ Analyze performance metrics</div>
                    <div>✓ Optimize ad campaigns</div>
                    <div>✓ Scale successful channels</div>
                    <div>✓ Expand influencer partnerships</div>
                    <div>✓ Plan next quarter strategy</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Launch Your Marketing Campaign?
                </h2>
                <p className="text-gray-600 mb-6">
                  This comprehensive strategy provides the roadmap for dominating the US pet care app market.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Start Implementation
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleDownloadPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Strategy PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}