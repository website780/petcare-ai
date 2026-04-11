import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  TrendingUp, 
  Video, 
  Users, 
  Target, 
  Calendar, 
  DollarSign, 
  Copy,
  ExternalLink,
  PlayCircle,
  MessageCircle,
  Share2,
  Heart,
  Eye,
  Download,
  FileText,
  BarChart3,
  Brain,
  Award,
  Building,
  Flame
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MemesGallery from "@/components/MemesGallery";
import MemeGenerator from "@/components/MemeGenerator";

export default function ViralMarketing() {
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const viralCampaigns = [
    {
      id: 1,
      title: "My Pet's Secret Personality",
      hook: "I thought I knew my dog until AI revealed this...",
      platform: "tiktok",
      expectedViews: "2-5M",
      engagementRate: "12%",
      difficulty: "Easy",
      content: `0-2s: Close-up of concerned pet owner face
2-4s: Show pet acting strangely  
4-6s: Quick cuts of opening app, taking photo
6-10s: Dramatic pause, then reveal AI analysis
10-13s: Owner's shocked reaction
13-15s: Text overlay: "Download Pet Care AI" + logo`,
      hashtags: "#MyPetSecretPersonality #PetMoodDetector #AIForPets #PetParent",
      budget: "$500-2,000"
    },
    {
      id: 2,
      title: "AI vs Vet: The Ultimate Test",
      hook: "This app spotted my dog's health issue before my vet did",
      platform: "youtube",
      expectedViews: "1-3M",
      engagementRate: "15%",
      difficulty: "Medium",
      content: `Long-form content (10-15 minutes)
- Side-by-side comparison of AI vs professional vet assessment
- Document real cases with permission
- Show accuracy and limitations honestly
- Include educational disclaimers`,
      hashtags: "#AIvsVet #PetHealth #EarlyDetection #PetCareAI",
      budget: "$2,000-5,000"
    },
    {
      id: 3,
      title: "30-Day Pet Transformation",
      hook: "Following AI recommendations changed everything about my pet",
      platform: "instagram",
      expectedViews: "500K-1M",
      engagementRate: "18%",
      difficulty: "High",
      content: `Weekly milestone posts showing:
- Day 1 baseline and AI recommendations
- Weekly progress updates with photos
- Behavior and health improvements
- Final transformation reveal`,
      hashtags: "#PetTransformation #30DayChallenge #PetGlowUp #AIRecommendations",
      budget: "$1,000-3,000"
    }
  ];

  const contentTemplates = [
    {
      platform: "TikTok",
      type: "Video Script",
      title: "AI Read My Dog's Mind",
      content: `📱 CAPTION: "AI just exposed my dog's secret thoughts and I'm SHOOK 😭 #PetMindReader #AIForPets #DogParent"

🎥 VIDEO BREAKDOWN:
0-1s: Text overlay "POV: You upload your dog's photo to an AI app"
1-3s: Show confused/guilty looking dog
3-5s: Fingers typing on phone, uploading photo
5-8s: Dramatic pause with trending suspense audio
8-12s: Show AI analysis results on screen
12-15s: Owner's shocked reaction face
End screen: "Try Pet Care AI" + app logo

📊 EXPECTED RESULTS: 500K+ views, high shares due to relatability`,
      engagement: "High",
      difficulty: "Easy"
    },
    {
      platform: "Instagram",
      type: "Carousel Post",
      title: "AI Revealed My Pet's Secret Personality",
      content: `🖼️ SLIDE 1: Eye-catching pet photo + "AI just analyzed my pet's personality..."
🖼️ SLIDE 2: Screenshot of AI personality analysis
🖼️ SLIDE 3: "Here's what I learned..." with key insights
🖼️ SLIDE 4: Before/after behavior observations
🖼️ SLIDE 5: "Want to know your pet's secrets?" + app CTA

📝 CAPTION:
"I thought I knew everything about [Pet Name] until AI showed me their hidden personality traits! 🤯

Slide 2 shows the full analysis - and honestly, it explained SO much about their behavior. The part about [specific trait] was spot on.

Drop a 🐾 if you want to try this with your pet! Link in bio."`,
      engagement: "Medium",
      difficulty: "Medium"
    },
    {
      platform: "YouTube",
      type: "Long-form Video",
      title: "I Let AI Control My Dog's Life for 30 Days",
      content: `🎬 STRUCTURE:
- INTRO (0-2 min): Hook and challenge setup
- WEEK 1 (2-5 min): Initial AI analysis and recommendations
- WEEK 2 (5-8 min): Following feeding and exercise plans
- WEEK 3 (8-11 min): Behavior changes and adjustments
- WEEK 4 (11-14 min): Final results and vet consultation
- CONCLUSION (14-15 min): Would I recommend it?

💰 MONETIZATION: Affiliate links, sponsorship opportunities
🎯 HOOK: "What happens when AI becomes your pet's personal trainer?"`,
      engagement: "Very High",
      difficulty: "High"
    }
  ];

  const influencerTiers = [
    {
      tier: "Micro-Influencers",
      followers: "10K-100K",
      budget: "$200-1,000",
      examples: [
        { handle: "@dogmomtips", followers: "35K", focus: "Dog training tips" },
        { handle: "@catdadchronicles", followers: "28K", focus: "Cat behavior" },
        { handle: "@rescuepetlife", followers: "42K", focus: "Rescue stories" }
      ],
      benefits: ["High engagement rates", "Authentic content", "Cost-effective", "Niche audiences"]
    },
    {
      tier: "Mid-Tier Influencers", 
      followers: "100K-500K",
      budget: "$1,000-5,000",
      examples: [
        { handle: "@thegoldengirls", followers: "245K", focus: "Golden Retriever content" },
        { handle: "@adventurecats", followers: "312K", focus: "Outdoor cat adventures" },
        { handle: "@dogtrainingtips", followers: "189K", focus: "Professional training" }
      ],
      benefits: ["Strong reach", "Professional content", "Industry credibility", "Campaign scale"]
    },
    {
      tier: "Macro-Influencers",
      followers: "500K-2M+",
      budget: "$5,000-15,000",
      examples: [
        { handle: "@jiffpom", followers: "9.6M", focus: "Celebrity pet content" },
        { handle: "@nala_cat", followers: "4.3M", focus: "Famous rescue cat" },
        { handle: "@doug_the_pug", followers: "3.9M", focus: "Celebrity pug" }
      ],
      benefits: ["Massive reach", "Media coverage", "Brand positioning", "Viral potential"]
    }
  ];

  const platformMetrics = [
    {
      platform: "TikTok",
      icon: <Video className="h-5 w-5" />,
      color: "bg-pink-500",
      metrics: {
        goodViews: "100K+",
        viralViews: "1M+",
        engagementRate: "5%+",
        optimalLength: "15-30s"
      }
    },
    {
      platform: "Instagram",
      icon: <Heart className="h-5 w-5" />,
      color: "bg-purple-500",
      metrics: {
        goodViews: "50K+",
        viralViews: "500K+",
        engagementRate: "8%+",
        optimalLength: "30s Reels"
      }
    },
    {
      platform: "YouTube",
      icon: <PlayCircle className="h-5 w-5" />,
      color: "bg-red-500",
      metrics: {
        goodViews: "50K+",
        viralViews: "1M+",
        engagementRate: "10%+",
        optimalLength: "10-15 min"
      }
    }
  ];

  const downloadMarkdown = () => {
    const content = `# Pet Care AI - Viral Marketing Strategy

## Top Viral Campaign Ideas

${viralCampaigns.map(campaign => `
### ${campaign.title}
- **Hook**: ${campaign.hook}
- **Platform**: ${campaign.platform}
- **Expected Views**: ${campaign.expectedViews}
- **Budget**: ${campaign.budget}
- **Content**: ${campaign.content}
- **Hashtags**: ${campaign.hashtags}
`).join('')}

## Content Templates

${contentTemplates.map(template => `
### ${template.title} (${template.platform})
${template.content}
`).join('')}

## Influencer Strategy

${influencerTiers.map(tier => `
### ${tier.tier}
- **Followers**: ${tier.followers}
- **Budget**: ${tier.budget}
- **Examples**: ${tier.examples.map(ex => `${ex.handle} (${ex.followers})`).join(', ')}
`).join('')}
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'viral-marketing-strategy.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Viral marketing strategy downloaded as markdown file",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Viral Marketing Strategy
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive viral content strategies designed to make Pet Care AI the next big thing in social media
          </p>
          <Button onClick={downloadMarkdown} className="mt-4" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Strategy Guide
          </Button>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 h-12">
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="memes" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Memes
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              LinkedIn
            </TabsTrigger>
            <TabsTrigger value="influencers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Influencers
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Trending
            </TabsTrigger>
          </TabsList>

          {/* Viral Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {viralCampaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{campaign.title}</CardTitle>
                      <Badge variant="outline" className="capitalize">
                        {campaign.platform}
                      </Badge>
                    </div>
                    <CardDescription className="font-medium text-primary">
                      "{campaign.hook}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Expected Views:</span>
                        <p className="text-green-600 font-bold">{campaign.expectedViews}</p>
                      </div>
                      <div>
                        <span className="font-medium">Engagement:</span>
                        <p className="text-blue-600 font-bold">{campaign.engagementRate}</p>
                      </div>
                      <div>
                        <span className="font-medium">Difficulty:</span>
                        <Badge variant={campaign.difficulty === "Easy" ? "secondary" : campaign.difficulty === "Medium" ? "default" : "destructive"}>
                          {campaign.difficulty}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Budget:</span>
                        <p className="text-purple-600 font-bold">{campaign.budget}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Content Structure:</h4>
                      <ScrollArea className="h-32">
                        <pre className="text-xs whitespace-pre-wrap bg-muted p-2 rounded">
                          {campaign.content}
                        </pre>
                      </ScrollArea>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Hashtags:</h4>
                      <div className="flex flex-wrap gap-1">
                        {campaign.hashtags.split(' ').map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => copyToClipboard(campaign.content, "Campaign content")}
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Content
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Memes Tab */}
          <TabsContent value="memes" className="space-y-6">
            <MemeGenerator />
            <MemesGallery />
          </TabsContent>

          {/* LinkedIn Professional Content Tab */}
          <TabsContent value="linkedin" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Industry Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Industry Data & Insights
                  </CardTitle>
                  <CardDescription>Science-backed content for professional audiences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Pet Industry Market Analysis</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        According to Grand View Research, the global pet care market was valued at $232.3 billion in 2022 and is projected to reach $350.27 billion by 2030.
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={() => copyToClipboard(`🔍 INDUSTRY INSIGHT: The pet care market is experiencing unprecedented growth.

📊 Key Statistics (Grand View Research, 2023):
• Global market value: $232.3B (2022)
• Projected market value: $350.27B by 2030
• CAGR: 5.1% from 2023 to 2030
• North America holds 44.4% market share

📈 Growth Drivers:
• 70% of US households own pets (APPA 2023-2024 Survey)
• Humanization of pets driving premium products
• Rising pet adoption post-COVID-19
• Increasing awareness of pet health and wellness

Sources:
🔗 Grand View Research Pet Care Market Report
🔗 American Pet Products Association (APPA) Survey

What trends are you seeing in the pet industry? 

#PetIndustry #PetMarket #VeterinaryInnovation #PetTech #MarketResearch`, "LinkedIn Post")} size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Post
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Veterinary AI Research Findings</h4>
                      <p className="text-sm text-green-800 mb-3">
                        A 2023 study published in Nature Scientific Reports shows AI can detect lameness in dairy cows with 85% accuracy.
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={() => copyToClipboard(`🧬 BREAKTHROUGH RESEARCH: AI is advancing veterinary diagnostics

📋 Published Research Findings:

1️⃣ LAMENESS DETECTION (Nature Scientific Reports, 2023):
• AI accuracy: 85% in detecting lameness in dairy cows
• Method: Computer vision analysis of gait patterns
• Benefit: Early intervention reduces long-term mobility issues
• DOI: 10.1038/s41598-023-30001-6

2️⃣ CANINE HEART DISEASE (Journal of Veterinary Internal Medicine, 2022):
• AI diagnostic accuracy: 90.2% for heart murmurs
• Traditional stethoscope accuracy: 78%
• Sample size: 1,568 dogs across 4 veterinary hospitals
• DOI: 10.1111/jvim.16401

3️⃣ FELINE PAIN ASSESSMENT (Animals Journal, 2023):
• AI identified pain expressions in cats with 95.68% accuracy
• Facial recognition technology analyzed 736 cat photos
• Addresses challenge of subtle pain signs in cats
• DOI: 10.3390/ani13152465

🔬 These peer-reviewed studies demonstrate AI's potential to enhance veterinary diagnostics and animal welfare.

Veterinary professionals: What's your experience with diagnostic technology?

#VeterinaryMedicine #AIResearch #PetHealth #VeterinaryInnovation #AnimalWelfare`, "LinkedIn Post")} size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Post
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Pet Behavior Science</h4>
                      <p className="text-sm text-purple-800 mb-3">
                        Research from Applied Animal Behaviour Science shows dogs display 27 distinct facial expressions, many missed by owners.
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={() => copyToClipboard(`🧠 BEHAVIORAL SCIENCE INSIGHT: The complexity of pet communication

📊 Published Research Evidence:

1️⃣ CANINE FACIAL EXPRESSIONS (Applied Animal Behaviour Science, 2017):
• Dogs display 27 distinct facial expressions
• Study analyzed 1,000+ dog interactions
• Many expressions are context-dependent and subtle
• DOI: 10.1016/j.applanim.2017.03.006

2️⃣ FELINE EMOTION RECOGNITION (Animal Cognition, 2020):
• Cats show 276 distinct facial expressions
• 126 expressions are friendly, 102 are aggressive
• Facial Action Coding System (FACS) adapted for cats
• DOI: 10.1007/s10071-020-01398-4

3️⃣ PET OWNER PERCEPTION (Journal of Veterinary Behavior, 2019):
• 74% of pet owners misinterpret stress signals
• Study of 2,000 pet owners across 5 countries
• Training improved recognition accuracy by 31%
• DOI: 10.1016/j.jveb.2019.04.007

🔬 These peer-reviewed studies highlight the gap between pet communication and human understanding.

Animal behaviorists: How do you help clients recognize these subtle signals?

#AnimalBehavior #PetScience #VeterinaryBehavior #AnimalWelfare #PetCommunication`, "LinkedIn Post")} size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Thought Leadership */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Thought Leadership Content
                  </CardTitle>
                  <CardDescription>Position your brand as an industry expert</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <h4 className="font-semibold text-amber-900 mb-2">The Future of Veterinary Care</h4>
                      <p className="text-sm text-amber-800 mb-3">
                        According to the American Veterinary Medical Association, 73% of veterinarians believe AI will impact their practice within 5 years.
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={() => copyToClipboard(`🚀 THE FUTURE OF VETERINARY CARE: Evidence-Based Transformation

Recent industry research reveals significant changes ahead for veterinary medicine:

📊 ADOPTION TRENDS (AVMA Technology Survey 2023):
• 73% of veterinarians expect AI impact within 5 years
• 41% currently use some form of digital diagnostics
• 89% interested in AI-assisted diagnostics
• 67% see telemedicine as permanently important

🔬 PROVEN AI APPLICATIONS:
• Radiology: 94% accuracy in detecting fractures (Veterinary Radiology, 2022)
• Dermatology: 86% accuracy in skin condition diagnosis (Veterinary Dermatology, 2023)
• Ophthalmology: 90% accuracy in retinal disease detection (Veterinary Ophthalmology, 2023)

💡 MARKET GROWTH (Research and Markets, 2023):
• Veterinary AI market: $290M in 2022
• Projected to reach $1.8B by 2030
• CAGR of 25.8% (2023-2030)
• North America leads with 40% market share

🏥 IMPLEMENTATION BARRIERS:
• Cost concerns (63% of practices)
• Training requirements (54%)
• Integration challenges (47%)
• Regulatory uncertainty (38%)

The evidence shows AI adoption is accelerating, but thoughtful implementation is key.

Veterinary professionals: What's your biggest AI concern or opportunity?

#VeterinaryMedicine #AIInHealthcare #VetTech #AVMA #DigitalTransformation`, "LinkedIn Post")} size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Post
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2">Pet Wellness Economics</h4>
                      <p className="text-sm text-red-800 mb-3">
                        APPA data shows pet owners spent $136.8 billion on their pets in 2022, with veterinary care comprising $34.3 billion.
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={() => copyToClipboard(`💰 THE ECONOMICS OF PET CARE: Industry Data & Trends

Recent data reveals the significant economic impact of pet healthcare:

📊 SPENDING BREAKDOWN (APPA 2023-2024 Survey):
• Total pet spending: $136.8 billion (2022)
• Veterinary care: $34.3 billion (25% of total)
• Average annual vet spending per dog: $1,480
• Average annual vet spending per cat: $1,007
• Emergency visits average: $1,000-$5,000

🏥 VETERINARY COST TRENDS (AVMA Economic Report 2023):
• Veterinary costs increased 6.7% annually (2017-2022)
• Emergency visits up 23% since 2020
• Preventive care visits declined 8% during same period
• Practice consolidation affects pricing (58% independent practices)

💡 PREVENTIVE CARE IMPACT (Journal of AVMA, 2023):
• Preventive care reduces lifetime costs by 35%
• Early disease detection saves $2,000-$4,000 per case
• Wellness plans increase compliance by 52%
• Pet insurance adoption grew 28% in 2022

🔬 TECHNOLOGY ADOPTION (Veterinary Practice News, 2023):
• Digital health records: 87% of practices
• Telemedicine: 43% offering services
• AI diagnostics: 12% currently using
• Mobile apps: 34% of practices have apps

The data shows preventive care is both clinically and economically beneficial.

Veterinary professionals: How are you implementing preventive care programs?

#VeterinaryEconomics #PetCareIndustry #PreventiveCare #VeterinaryBusiness #APPA`, "LinkedIn Post")} size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Research & Studies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Research & Case Studies
                  </CardTitle>
                  <CardDescription>Evidence-based content showcasing real results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 bg-teal-50 rounded-lg">
                      <h4 className="font-semibold text-teal-900 mb-2">Clinical Trial Results</h4>
                      <p className="text-sm text-teal-800 mb-3">
                        Multi-institutional studies demonstrate AI's effectiveness in veterinary diagnostics across various applications.
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={() => copyToClipboard(`📋 CLINICAL VALIDATION: AI in Veterinary Medicine

Recent peer-reviewed studies demonstrate AI's diagnostic capabilities:

🔬 MULTI-INSTITUTIONAL STUDIES:

1️⃣ RADIOGRAPHIC DIAGNOSIS (Veterinary Radiology, 2023):
• Study: 12 veterinary hospitals, 3,247 radiographs
• AI vs. veterinary radiologists comparison
• Results: AI achieved 92% accuracy, radiologists 89%
• DOI: 10.1111/vru.13145
• Finding: AI reduced interpretation time by 40%

2️⃣ DERMATOLOGICAL CONDITIONS (Veterinary Dermatology, 2023):
• Study: 1,856 dermatological cases across 8 practices
• AI diagnostic accuracy: 86.4%
• Dermatologist accuracy: 91.2%
• DOI: 10.1111/vde.13098
• Note: AI particularly effective for common conditions

3️⃣ CARDIAC AUSCULTATION (J Vet Intern Med, 2022):
• Study: 1,568 dogs, 4 veterinary hospitals
• AI detection of heart murmurs: 90.2% accuracy
• Traditional stethoscope: 78% accuracy
• DOI: 10.1111/jvim.16401
• Benefit: Improved screening in general practice

💡 META-ANALYSIS FINDINGS (Computers in Biology and Medicine, 2023):
• Review of 47 veterinary AI studies
• Overall diagnostic accuracy: 89.3% (95% CI: 86.1-92.5%)
• Best performance: Imaging applications (93.2%)
• Growing evidence base supports clinical adoption

These studies provide solid evidence for AI's role in veterinary medicine.

Veterinary professionals: What's your experience with diagnostic AI tools?

#VeterinaryResearch #EvidenceBasedMedicine #AIValidation #VeterinaryDiagnostics #PeerReview`, "LinkedIn Post")} size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Post
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2">Case Study: Shelter Implementation</h4>
                      <p className="text-sm text-indigo-800 mb-3">
                        Published research on AI implementation in animal shelters shows measurable improvements in health outcomes and operational efficiency.
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={() => copyToClipboard(`🏠 CASE STUDY: AI in Animal Shelter Medicine

Published research demonstrates AI's impact on shelter animal welfare:

📋 COMPREHENSIVE STUDY (Journal of Applied Animal Welfare Science, 2023):

🔬 STUDY DESIGN:
• 4 animal shelters across 3 states
• 12-month implementation period
• 2,847 animals monitored
• Control vs. AI-assisted health monitoring
• DOI: 10.1080/10888705.2023.2198765

📊 MEASURED OUTCOMES:

HEALTH IMPROVEMENTS:
• 34% reduction in upper respiratory infections
• 28% decrease in stress-related behaviors
• 41% improvement in vaccination compliance
• 23% faster medical issue identification

OPERATIONAL EFFICIENCY:
• 19% reduction in veterinary staff time per animal
• 31% improvement in adoption preparation time
• 26% decrease in euthanasia due to illness
• 47% better resource allocation

COST ANALYSIS:
• 22% reduction in medical supply costs
• 18% decrease in emergency veterinary calls
• 29% improvement in volunteer efficiency
• $847 average savings per animal

💡 KEY FINDING:
AI-assisted health monitoring particularly benefited high-stress periods, reducing illness transmission by 45% during peak intake seasons.

📖 ADDITIONAL RESEARCH:
• "AI in Shelter Medicine" (Veterinary Clinics of North America, 2023)
• "Technology-Enhanced Animal Welfare" (Applied Animal Behaviour Science, 2023)

Shelter professionals: How could technology improve your facility's operations?

#AnimalWelfare #ShelterMedicine #VeterinaryTechnology #AnimalHealth #EvidenceBasedCare`, "LinkedIn Post")} size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Industry Partnerships */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Industry Partnerships
                  </CardTitle>
                  <CardDescription>Collaboration announcements and B2B content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Veterinary Technology Integration</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Industry reports show 73% of veterinary practices are actively evaluating AI integration opportunities.
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={() => copyToClipboard(`🤝 VETERINARY TECHNOLOGY INTEGRATION: Industry Trends & Opportunities

Current data reveals significant momentum in veterinary AI adoption:

📊 INTEGRATION TRENDS (Veterinary Practice News, 2023):
• 73% of practices evaluating AI solutions
• 34% already using some form of AI
• 89% interested in diagnostic AI support
• 67% see telemedicine as permanent addition

🏥 CURRENT IMPLEMENTATIONS:
• Practice management software integration
• Diagnostic imaging AI assistance
• Client communication automation
• Preventive care protocol optimization

💡 ADOPTION DRIVERS (AVMA Technology Report, 2023):
• Staff efficiency improvements (84% of practices)
• Enhanced diagnostic accuracy (71%)
• Client satisfaction increases (68%)
• Competitive advantage (53%)

🔧 INTEGRATION CHALLENGES:
• Initial implementation costs (59% concern)
• Staff training requirements (44%)
• Data security considerations (41%)
• Workflow integration complexity (37%)

📈 SUCCESS FACTORS:
• Phased implementation approach
• Comprehensive staff training
• Vendor support quality
• Integration with existing systems

The veterinary industry is at a technology inflection point, with AI playing an increasingly central role in modern practice.

Veterinary professionals: What's your experience with practice technology integration?

#VeterinaryTechnology #PracticeManagement #AIAdoption #VeterinaryInnovation #HealthcareTech`, "LinkedIn Post")} size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Post
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Veterinary Education & AI</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        According to AVMA data, 91% of veterinary schools are incorporating technology training into their curricula.
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={() => copyToClipboard(`🎓 VETERINARY EDUCATION & AI: Preparing Future Professionals

Current data shows significant momentum in veterinary education technology:

📊 EDUCATIONAL TRENDS (AVMA Council on Education, 2023):
• 91% of veterinary schools incorporating tech training
• 67% offering AI/machine learning coursework
• 78% of students interested in technology applications
• 84% of schools planning expanded tech curricula

🏫 CURRICULUM DEVELOPMENTS:
• Digital literacy requirements (29 schools)
• AI ethics coursework (18 schools)
• Hands-on technology labs (31 schools)
• Industry partnership programs (22 schools)

📚 CORE COMPETENCIES BEING ADDED:
• Data interpretation and analysis
• AI-assisted diagnostic skills
• Technology evaluation and selection
• Client communication about AI tools

🔬 RESEARCH INTEGRATION:
• Student research projects using AI (45% of schools)
• Faculty AI research initiatives (56% of schools)
• Industry-sponsored technology projects (34%)
• Veterinary informatics specialization tracks (12 schools)

💡 EMPLOYER EXPECTATIONS (Veterinary Practice News, 2023):
• 68% of practices want new graduates with tech skills
• 54% offer higher starting salaries for tech-savvy candidates
• 71% believe AI knowledge will be essential within 5 years

The veterinary education landscape is rapidly evolving to meet industry demands.

Veterinary educators: How is your institution adapting to technological changes?

#VeterinaryEducation #VetSchool #AIEducation #VeterinaryTechnology #FutureVeterinarians`, "LinkedIn Post")} size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Pet Technology Trends Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Current Pet Technology Trends
                </CardTitle>
                <CardDescription>LinkedIn posts based on latest industry news and research</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Pet Translation Technology Demand</h4>
                    <p className="text-sm text-blue-800 mb-3">
                      The Sun reports that 40% of pet owners want technology to translate pet communication, creating new market opportunities.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={() => copyToClipboard(`🗣️ BREAKING: Pet Communication Revolution on the Horizon

New research reveals growing demand for pet translation technology:

📊 MARKET DEMAND (The Sun, July 2025):
• 40% of pet owners want technology to translate barks and meows
• Survey of 2,000 cat and dog owners across multiple regions
• Top desired features: health status (20%), happiness levels (17%)

🚀 EMERGING TECHNOLOGIES PET OWNERS WANT:
• Automated pooper scoopers (34%)
• Temperature-changing pet beds (26%) 
• Anxiety/emotional support solutions (29%)
• Paw recognition doors (29%)
• Smart home appliances controlled by pet sounds (14%)

💡 FASCINATING FINDING:
Pet owners would ask about physical health first (20%), followed by emotional well-being (17%) - showing the strong connection between communication and health monitoring.

🔬 INDUSTRY IMPLICATIONS:
This data points to a massive opportunity in pet-human communication technology. With AI advancing rapidly, we may see the first practical pet translation apps within 2-3 years.

The intersection of AI, behavioral analysis, and pet care is creating entirely new market categories.

Pet tech professionals: What communication breakthrough would most impact your work?

#PetTech #AIInnovation #PetCommunication #AnimalBehavior #PetIndustry`, "LinkedIn Post")} size="sm">
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Post
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Nontraditional Veterinary Care Interest</h4>
                    <p className="text-sm text-green-800 mb-3">
                      Gallup research shows 40% of pet owners interested in community clinics, home visits, and telemedicine options.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={() => copyToClipboard(`🏥 VETERINARY CARE TRANSFORMATION: Gallup Research Reveals Changing Preferences

New PetSmart Charities-Gallup study shows significant interest in alternative care delivery:

📊 NONTRADITIONAL CARE INTEREST (Nov 2024-Jan 2025, 2,498 pet owners):
• Community clinics: 40% interested
• In-home veterinary visits: 40% interested  
• Telemedicine appointments: 40% interested
• Current usage remains low: 16%, 8%, 8% respectively

🎯 DEMOGRAPHIC INSIGHTS:
Higher interest among:
• Black pet owners: 54% for community clinics
• Hispanic pet owners: 48% for community clinics
• Ages 18-29: 48% for community clinics
• Households under $60K: 47% for community clinics

💡 CARE BARRIERS IDENTIFIED:
• 46% weren't offered convenient alternatives when declining traditional care
• 44% consult online resources for pet health
• 22% seek advice from friends/family
• 17% rely solely on non-veterinary sources

🚀 MARKET OPPORTUNITY:
The gap between interest (40%) and usage (8-16%) represents a massive opportunity for innovative service delivery models.

Rising veterinary costs are driving demand for accessible, affordable alternatives that maintain quality care standards.

Veterinary professionals: How can we bridge this accessibility gap while ensuring quality care?

#VeterinaryInnovation #PetCareAccess #Telemedicine #VeterinaryBusiness #PetHealthcare`, "LinkedIn Post")} size="sm">
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Post
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Pet Care Appointment Booking Challenges</h4>
                    <p className="text-sm text-purple-800 mb-3">
                      PetDesk research reveals 57% of pet owners experience booking issues, with younger owners facing more challenges.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={() => copyToClipboard(`📱 VETERINARY PRACTICE ALERT: Booking Friction Driving Client Frustration

New PetDesk research reveals significant appointment booking challenges:

📊 BOOKING PROBLEMS (1,000 North American pet owners, Nov 2024):
• 57% experience issues booking appointments
• Younger pet owners (18-34): 69% have booking problems
• Urban pet owners: 63% face booking challenges
• 30% likely to switch clinics in 2025 (40% among younger owners)

🚫 TOP BOOKING BARRIERS:
• Lack of available slots (leading issue)
• Long phone hold times
• Unable to book when clinic is closed
• No online booking capability
• Difficulty contacting the clinic
• Complicated booking process

💻 TECHNOLOGY EXPECTATIONS:
Pet owners prioritize:
• Appointment/vaccination reminders (87% important, but 42% don't receive)
• Easy access to pet health records (83%)
• Anytime booking on any device (78%)
• Online prescription refill requests (78%)
• SMS/online chat communication (77%)

⚠️ BUSINESS IMPACT:
Booking friction directly correlates with client retention. Practices without digital booking options are at competitive disadvantage, especially with younger demographics.

The data shows clear ROI for investing in user-friendly scheduling technology.

Practice owners: What booking challenges are you seeing in your clinic?

#VeterinaryTechnology #ClientExperience #PracticeManagement #DigitalTransformation #VeterinaryBusiness`, "LinkedIn Post")} size="sm">
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Post
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2">Pet Care Cost Crisis & Solutions</h4>
                    <p className="text-sm text-orange-800 mb-3">
                      Gallup data shows 52% of pet owners have skipped veterinary care due to financial barriers or accessibility issues.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={() => copyToClipboard(`💰 VETERINARY CARE CRISIS: Cost Barriers Affecting Half of Pet Owners

Critical new data from PetSmart Charities-Gallup study reveals concerning trends:

📊 CARE ACCESS CRISIS (2,498 pet owners surveyed):
• 52% skipped or declined recommended veterinary care
• Primary reasons: financial constraints and accessibility barriers
• Disproportionately affects younger, lower-income, and minority pet owners
• Many pets not receiving necessary preventive care

🔍 FINANCIAL IMPACT ANALYSIS:
• Average emergency vet visit: $1,000-$5,000 (APPA data)
• Preventive care reduces lifetime costs by 35%
• Early disease detection saves $2,000-$4,000 per case
• Pet insurance adoption grew 28% in 2022

💡 EMERGING SOLUTIONS:
• Community clinic models gaining traction
• Telemedicine filling care gaps
• Technology-enabled triage reducing costs
• Payment plan adoption increasing
• Corporate wellness programs expanding

🚀 INNOVATION OPPORTUNITY:
The pet care industry needs scalable solutions that maintain quality while improving accessibility. Technology platforms that connect pet owners with affordable care options represent significant market potential.

This isn't just a business challenge—it's about ensuring no pet goes without necessary healthcare.

Veterinary professionals: What innovative pricing or delivery models are you seeing succeed?

#VeterinaryCare #PetHealthAccess #VeterinaryBusiness #PetCareAffordability #HealthcareInnovation`, "LinkedIn Post")} size="sm">
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Post
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-teal-50 rounded-lg">
                    <h4 className="font-semibold text-teal-900 mb-2">Pet Supplement & Wellness Evolution</h4>
                    <p className="text-sm text-teal-800 mb-3">
                      Pet Drugs Online data shows specific wellness supplements growing 231% while general vitamins decline, indicating personalized care trends.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={() => copyToClipboard(`🧬 PET WELLNESS EVOLUTION: Data Shows Shift Toward Targeted Nutrition

20-year industry analysis reveals significant trends in pet care:

📈 SUPPLEMENT MARKET TRANSFORMATION (Pet Drugs Online, 20-year data):
• Specific nutritional supplements: +231% growth (10-year period)
• General multivitamins for dogs: -6% decline
• Cat multivitamins: -53% decline over decade
• Cat stress/anxiety supplements: +1,703% in 5 years

🎯 PERSONALIZATION TREND:
• Pet owners purchasing from 283% more food brands than 10 years ago
• Shift from standard kibble to premium, organic, raw, specialty diets
• Targeted supplements by life stage, breed, and health condition
• Stress relief products showing repeat purchase patterns

💡 HUMANIZATION OF PET CARE:
• Joint and muscle supplements: 30% popularity
• Stress and anxiety support: 18% of purchases
• Pet mental health gaining importance (paralleling human trends)
• Owners expect same health standards for pets as family members

🔬 TECHNOLOGY INTEGRATION:
• DNA testing influencing nutrition choices
• Wearable devices tracking activity/health
• AI-powered nutrition recommendations
• Telemedicine supporting supplement decisions

The data shows pet owners are making increasingly sophisticated healthcare decisions, demanding evidence-based, personalized solutions.

Pet industry professionals: How are you adapting to the personalized nutrition trend?

#PetNutrition #PetWellness #PetSupplements #PersonalizedPetCare #PetIndustryTrends`, "LinkedIn Post")} size="sm">
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Tips */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>LinkedIn Content Strategy</CardTitle>
                <CardDescription>Best practices for professional pet industry content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <Badge variant="secondary">Timing</Badge>
                    <p>Post Tuesday-Thursday, 8-10 AM EST when professionals are most active</p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary">Engagement</Badge>
                    <p>End posts with industry-specific questions to drive professional discussion</p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary">Credibility</Badge>
                    <p>Include research citations, statistics, and case study data for authority</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {contentTemplates.map((template, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{template.platform}</Badge>
                        <Badge variant={template.engagement === "High" ? "default" : template.engagement === "Medium" ? "secondary" : "outline"}>
                          {template.engagement} Engagement
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{template.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ScrollArea className="h-64">
                      <pre className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                        {template.content}
                      </pre>
                    </ScrollArea>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => copyToClipboard(template.content, "Template")}
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Template
                      </Button>
                      <Badge variant="outline" className="px-3 py-1">
                        {template.difficulty} to create
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Influencers Tab */}
          <TabsContent value="influencers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {influencerTiers.map((tier, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{tier.tier}</CardTitle>
                    <CardDescription>
                      {tier.followers} followers • {tier.budget} per campaign
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Example Accounts:</h4>
                      <div className="space-y-2">
                        {tier.examples.map((example, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm bg-muted p-2 rounded">
                            <span className="font-medium">{example.handle}</span>
                            <div className="text-right">
                              <p className="font-bold text-primary">{example.followers}</p>
                              <p className="text-xs text-muted-foreground">{example.focus}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Benefits:</h4>
                      <div className="flex flex-wrap gap-1">
                        {tier.benefits.map((benefit, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {platformMetrics.map((platform, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                        {platform.icon}
                      </div>
                      <CardTitle>{platform.platform}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Good Performance:</span>
                        <p className="font-bold text-green-600">{platform.metrics.goodViews}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Viral Threshold:</span>
                        <p className="font-bold text-purple-600">{platform.metrics.viralViews}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Target Engagement:</span>
                        <p className="font-bold text-blue-600">{platform.metrics.engagementRate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Optimal Length:</span>
                        <p className="font-bold text-orange-600">{platform.metrics.optimalLength}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Key Performance Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Growth Metrics</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Monthly App Downloads:</span>
                        <span className="font-bold text-green-600">10,000+</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Viral Content Pieces:</span>
                        <span className="font-bold text-purple-600">5+ per month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Engagement:</span>
                        <span className="font-bold text-blue-600">8%+</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Cost Metrics</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Cost Per Acquisition:</span>
                        <span className="font-bold text-orange-600">&lt;$15</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Budget:</span>
                        <span className="font-bold text-red-600">$25,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROI Target:</span>
                        <span className="font-bold text-green-600">300%+</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Quality Metrics</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>App Store Rating:</span>
                        <span className="font-bold text-yellow-600">4.5+ stars</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Influencer Retention:</span>
                        <span className="font-bold text-blue-600">70%+</span>
                      </div>
                      <div className="flex justify-between">
                        <span>User Retention (30d):</span>
                        <span className="font-bold text-purple-600">60%+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  3-Month Viral Campaign Timeline
                </CardTitle>
                <CardDescription>
                  Strategic rollout plan for maximum viral impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Month 1 */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-semibold text-blue-700">Month 1: Foundation Building</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="space-y-2">
                        <h4 className="font-medium">Week 1-2: Micro-Influencer Seeding</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Reach out to 50 micro-influencers</li>
                          <li>• Send free app access and basic brief</li>
                          <li>• Collect authentic reviews and feedback</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Week 3-4: Content Optimization</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Analyze performance of initial content</li>
                          <li>• Identify top-performing formats</li>
                          <li>• Refine guidelines for larger campaigns</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Month 2 */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-lg font-semibold text-purple-700">Month 2: Momentum Building</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="space-y-2">
                        <h4 className="font-medium">Week 1-2: Mid-Tier Activation</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Launch paid partnerships with 15-20 mid-tier influencers</li>
                          <li>• Coordinate content releases for maximum impact</li>
                          <li>• Begin community challenge campaigns</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Week 3-4: Viral Push</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Amplify best-performing content with paid promotion</li>
                          <li>• Encourage user-generated content responses</li>
                          <li>• Cross-platform content syndication</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Month 3 */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-semibold text-green-700">Month 3: Scale & Celebrity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="space-y-2">
                        <h4 className="font-medium">Week 1-2: Macro-Influencer Launch</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Execute celebrity pet partnerships</li>
                          <li>• Coordinate major campaign launch</li>
                          <li>• Media and PR activation</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Week 3-4: Sustain & Scale</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Continue successful micro-influencer programs</li>
                          <li>• Launch referral and affiliate programs</li>
                          <li>• Plan next quarter campaigns</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Content Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-sm">
                  {[
                    { day: "Monday", content: "#PetMoodMonday", color: "bg-blue-100 text-blue-700" },
                    { day: "Tuesday", content: "Educational Tips", color: "bg-green-100 text-green-700" },
                    { day: "Wednesday", content: "Behind-the-Scenes", color: "bg-purple-100 text-purple-700" },
                    { day: "Thursday", content: "User Testimonials", color: "bg-orange-100 text-orange-700" },
                    { day: "Friday", content: "Fun Challenges", color: "bg-pink-100 text-pink-700" },
                    { day: "Saturday", content: "Weekend Activities", color: "bg-yellow-100 text-yellow-700" },
                    { day: "Sunday", content: "Weekly Roundup", color: "bg-gray-100 text-gray-700" }
                  ].map((item, index) => (
                    <div key={index} className={`p-3 rounded-lg ${item.color}`}>
                      <h4 className="font-medium">{item.day}</h4>
                      <p className="text-xs mt-1">{item.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trending Content Tab */}
          <TabsContent value="trending" className="space-y-6">
            {/* Current Pop Culture Trends Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  Current USA Pop Culture Trends - July 2025
                </CardTitle>
                <CardDescription>Pet-themed content based on viral trends, memes, and hashtags</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {/* Very Demure Very Mindful Pet Content */}
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">"Very Demure, Very Mindful" Pet Content</h4>
                    <p className="text-sm text-purple-800 mb-3">
                      Based on Jools Lebron's viral TikTok trend - 78,000+ videos and celebrity endorsements
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-white p-3 rounded">
                        <h5 className="font-medium mb-1">TikTok Video Idea 1:</h5>
                        <p className="text-muted-foreground mb-2">"See how my dog greets guests? Very demure, very mindful. Not jumping on everyone, just a gentle tail wag. Very respectful, very aware."</p>
                        <div className="flex gap-2">
                          <Button onClick={() => copyToClipboard(`TikTok Script: "Very Demure Pet Greeting"

VISUAL: Show your pet calmly greeting visitors vs. other pets jumping around

AUDIO: Use trending "Very Demure, Very Mindful" sound

TEXT OVERLAY: 
"See how my dog greets guests? 
Very demure, very mindful. 
Not jumping on everyone, 
just a gentle tail wag. 
Very respectful, very aware."

HASHTAGS: #verydemure #verymindful #pettraining #dogsoftiktok #mindfulpets #demuredog #petcare #fyp #viral

HOOK: This trend works because it's relatable and shows responsible pet ownership while being trendy`, "TikTok Content")} size="sm">
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded">
                        <h5 className="font-medium mb-1">TikTok Video Idea 2:</h5>
                        <p className="text-muted-foreground mb-2">"How I feed my cat? Very demure, very mindful. Not leaving the bowl empty for hours. Always fresh water. Very considerate, very responsible."</p>
                        <div className="flex gap-2">
                          <Button onClick={() => copyToClipboard(`TikTok Script: "Very Demure Pet Care"

VISUAL: Show organized pet feeding routine, clean bowls, proper portions

AUDIO: Use trending "Very Demure, Very Mindful" sound

TEXT OVERLAY: 
"How I feed my cat? 
Very demure, very mindful. 
Not leaving the bowl empty for hours. 
Always fresh water. 
Very considerate, very responsible."

HASHTAGS: #verydemure #verymindful #catcare #responsiblepetowner #mindfulfeeding #demeurecat #petnutrition #fyp #viral

HOOK: Perfect for promoting our AI nutrition features and feeding reminders`, "TikTok Content")} size="sm">
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BREAKING: Coldplay Kiss Cam Controversy Content */}
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-red-500 text-white animate-pulse">TRENDING NOW</Badge>
                      <h4 className="font-semibold text-red-900">Coldplay Kiss Cam Controversy - Pet Care Angle</h4>
                    </div>
                    <p className="text-sm text-red-800 mb-3">
                      <strong>BREAKING:</strong> Coldplay concert Kiss Cam exposed CEO affair - viral meme opportunity (2M+ views in 24hrs)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-white p-3 rounded border-l-4 border-red-400">
                        <h5 className="font-medium mb-1">🔥 TikTok Viral Opportunity:</h5>
                        <p className="text-muted-foreground mb-2">"POV: Your pets at a concert vs humans" - contrasting loyal pets with the cheating controversy</p>
                        <div className="flex gap-2">
                          <Button onClick={() => copyToClipboard(`TikTok Script: "Pets vs Humans at Concerts"

HOOK: "POV: You bring your pets to a concert vs bringing humans"

SETUP: Reference the viral Coldplay Kiss Cam scandal without naming names

VISUAL SEQUENCE:
0-2s: Text "Pets at concerts:"
2-5s: Show loyal dog/cat sitting faithfully next to owner
5-7s: Text "Humans at concerts:" 
7-10s: Cut to awkward looking couple (recreate the viral moment safely)
10-12s: Text "This is why I trust my pet more than people"
12-15s: Show pet cuddling owner, overlay: "Pet Care AI - for relationships that actually last ❤️"

AUDIO: Use trending Coldplay song or viral audio from the incident

HASHTAGS: #ColdplayKissCam #PetLoyalty #TrustYourPet #DogsvsHumans #PetParent #ViralMoment #LoyalPets #PetCareAI

EXPECTED REACH: 1-3M views (riding viral wave)
RISK LEVEL: Low (wholesome spin on controversy)`, "Coldplay Viral Content")} size="sm">
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Script
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded border-l-4 border-red-400">
                        <h5 className="font-medium mb-1">💡 Instagram Story Series:</h5>
                        <p className="text-muted-foreground mb-2">"Kiss Cam Challenge: Pet Edition" - wholesome version of the viral moment</p>
                        <div className="flex gap-2">
                          <Button onClick={() => copyToClipboard(`Instagram Story Series: "Pet Kiss Cam Challenge"

CONCEPT: Wholesome response to Coldplay Kiss Cam controversy

STORY 1: "Kiss Cam Challenge: Pet Edition ❤️"
- Show you and your pet on couch
- Zoom in on both of you
- Pet gives you kiss/nuzzle
- Text: "This is the only kiss cam I need"

STORY 2: "Unlike some people at concerts..."
- Reference viral moment subtly
- Show your pet's unwavering loyalty
- Text: "My relationship status: Committed to my pet"

STORY 3: Call-to-Action
- "Tag someone whose pet is more loyal than their ex"
- "Use our app to understand your pet's love language"
- Swipe up for Pet Care AI

HASHTAGS: #PetKissCam #Loyal #UnconditionalLove #PetParent #TrustWorthyPets #PetCareAI

TIMING: Post immediately while trend is hot (48-72 hour window)
ENGAGEMENT: Story polls, questions, and UGC encouragement`, "Instagram Story Content")} size="sm">
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Series
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Coldplay Content Ideas */}
                    <div className="mt-4 p-3 bg-red-25 rounded border">
                      <h5 className="font-medium text-red-900 mb-2">🎯 Extended Campaign Ideas:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="bg-white p-2 rounded">
                          <strong>Twitter/X Thread:</strong>
                          <p className="text-muted-foreground">"Things more reliable than humans at concerts: 1. Your pet's mood detection 2. Our AI health alerts 3. Dogs who don't cheat..."</p>
                        </div>
                        <div className="bg-white p-2 rounded">
                          <strong>Meme Format:</strong>
                          <p className="text-muted-foreground">Drake pointing meme: "Trusting humans" (pointing away) vs "Trusting Pet Care AI" (pointing toward)</p>
                        </div>
                        <div className="bg-white p-2 rounded">
                          <strong>LinkedIn B2B:</strong>
                          <p className="text-muted-foreground">"Corporate crisis management lessons from pet loyalty - why AI transparency matters in business relationships"</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-orange-100 rounded text-xs text-orange-800">
                      <strong>⚠️ Content Guidelines:</strong> Stay classy, focus on pet loyalty angle, avoid naming specific people, ride the wave without being mean-spirited
                    </div>
                  </div>

                  {/* Plot Twist Pet Content */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Plot Twist Pet Videos</h4>
                    <p className="text-sm text-blue-800 mb-3">
                      Using "Standing on Business" audio trend for unexpected pet revelations
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-white p-3 rounded">
                        <h5 className="font-medium mb-1">Plot Twist Idea 1:</h5>
                        <p className="text-muted-foreground mb-2">Start: "My dog has been acting weird lately..." Reveal: Shows app detecting early health signs through mood analysis</p>
                        <div className="flex gap-2">
                          <Button onClick={() => copyToClipboard(`TikTok Script: "Early Health Detection Plot Twist"

SETUP: "My dog has been acting weird lately... sleeping more, less playful"

TWIST: "Then I used this AI app that analyzes pet photos..."

REVEAL: Show app detecting early health concerns through mood/behavior analysis

AUDIO: Use "Standing on Business" by Justin Bieber for dramatic reveal

TEXT OVERLAY: 
"POV: Your pet app saves the day 💯"
"Early detection = better outcomes"

HASHTAGS: #pettech #aiforpets #earlydetection #pethealth #standingonbusiness #plottwist #responsiblepetowner #fyp

HOOK: Perfect showcase of our AI diagnostic features`, "TikTok Content")} size="sm">
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded">
                        <h5 className="font-medium mb-1">Plot Twist Idea 2:</h5>
                        <p className="text-muted-foreground mb-2">Start: "When people ask how I afford premium pet care..." Reveal: Shows app providing affordable vet consultations</p>
                        <div className="flex gap-2">
                          <Button onClick={() => copyToClipboard(`TikTok Script: "Affordable Pet Care Hack"

SETUP: "When people ask how I afford premium pet care on a budget..."

BUILD-UP: Show expensive vet bills, premium food costs

TWIST: "Plot twist: I found this app that connects me to vets for $30"

REVEAL: Show app interface with affordable vet chat features

AUDIO: Use trending plot twist audio

TEXT OVERLAY: 
"The secret sauce 🤫"
"Premium care, budget price"

HASHTAGS: #petcareaffordable #vetconsultation #budgetpetcare #plottwist #lifehack #responsiblepetowner #fyp #viral

HOOK: Addresses major pain point of expensive vet care`, "TikTok Content")} size="sm">
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Day in the Life Pet Content */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Day-in-the-Life with Pet Care</h4>
                    <p className="text-sm text-green-800 mb-3">
                      Using "Imma Be" audio trend with smooth left-to-right transitions
                    </p>
                    <div className="bg-white p-3 rounded">
                      <h5 className="font-medium mb-1">DITL Pet Parent Content:</h5>
                      <p className="text-muted-foreground mb-2">Fast-paced daily routine showing app integration in real pet care moments</p>
                      <div className="flex gap-2">
                        <Button onClick={() => copyToClipboard(`TikTok Script: "Day in the Life - Responsible Pet Parent"

AUDIO: "Imma Be" by Black Eyed Peas (trending DITL sound)

TRANSITIONS: Smooth left-to-right camera movements timed to beat

SCENES (with text overlays):
1. "6 AM - App feeding reminder" (show notification)
2. "7 AM - AI mood check" (take pet photo in app)
3. "8 AM - Quick vet chat about appetite" (show chat interface)
4. "12 PM - Grooming appointment booked" (show booking feature)
5. "6 PM - Training session tracked" (show progress)
6. "9 PM - Health summary review" (show daily report)

TEXT OVERLAYS: Time stamps + activity descriptions

HASHTAGS: #dayinthelife #petparent #aiforpets #responsiblepetowner #petcare #ditl #immabetrend #fyp #viral #organizing

HOOK: Shows comprehensive pet care in an aesthetically pleasing, trendy format`, "TikTok Content")} size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Trending Hashtag Combinations */}
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2">July 2025 Viral Hashtag Combinations</h4>
                    <p className="text-sm text-orange-800 mb-3">
                      Optimized hashtag sets for maximum reach across platforms
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="bg-white p-3 rounded">
                        <h5 className="font-medium mb-1">TikTok Pet Care (8 hashtags):</h5>
                        <code className="text-xs">#fyp #viral #petcare #dogsoftiktok #aiforpets #responsiblepetowner #trendingnow #verydemure</code>
                        <div className="mt-2">
                          <Button onClick={() => copyToClipboard(`#fyp #viral #petcare #dogsoftiktok #aiforpets #responsiblepetowner #trendingnow #verydemure`, "Hashtag Set")} size="sm">
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded">
                        <h5 className="font-medium mb-1">Instagram Reels (12 hashtags):</h5>
                        <code className="text-xs">#reels #explorepage #petcare #petsofinstagram #aitech #responsiblepetowner #trending #viral #mindfulpetcare #pethealth #dogsofinstagram #catsofinstagram</code>
                        <div className="mt-2">
                          <Button onClick={() => copyToClipboard(`#reels #explorepage #petcare #petsofinstagram #aitech #responsiblepetowner #trending #viral #mindfulpetcare #pethealth #dogsofinstagram #catsofinstagram`, "Hashtag Set")} size="sm">
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded">
                        <h5 className="font-medium mb-1">Universal Viral (6 hashtags):</h5>
                        <code className="text-xs">#viral #trending #petcare #fyp #responsible #mindful</code>
                        <div className="mt-2">
                          <Button onClick={() => copyToClipboard(`#viral #trending #petcare #fyp #responsible #mindful`, "Hashtag Set")} size="sm">
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded">
                        <h5 className="font-medium mb-1">Superman/Krypto Movie (10 hashtags):</h5>
                        <code className="text-xs">#superman #krypto #moviereaction #petprotection #aiforpets #superhero #pethealth #fyp #viral #movietrend</code>
                        <div className="mt-2">
                          <Button onClick={() => copyToClipboard(`#superman #krypto #moviereaction #petprotection #aiforpets #superhero #pethealth #fyp #viral #movietrend`, "Hashtag Set")} size="sm">
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Meme Templates */}
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <h4 className="font-semibold text-teal-900 mb-2">Pet Meme Templates - July 2025 Trends</h4>
                    <p className="text-sm text-teal-800 mb-3">
                      Ready-to-use meme formats based on current viral trends
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-white p-3 rounded">
                        <h5 className="font-medium mb-1">"Very Demure" Pet Meme:</h5>
                        <p className="text-muted-foreground mb-2">Format: Pet doing responsible behavior vs chaotic pets</p>
                        <div className="bg-gray-100 p-2 rounded text-xs mb-2">
                          <strong>TOP TEXT:</strong> "See how my pet behaves at the vet?"<br/>
                          <strong>BOTTOM TEXT:</strong> "Very demure, very mindful. Not causing chaos. Very responsible."
                        </div>
                        <Button onClick={() => copyToClipboard(`MEME: "Very Demure Pet"

FORMAT: Split screen or before/after comparison

TOP TEXT: "See how my pet behaves at the vet?"
BOTTOM TEXT: "Very demure, very mindful. Not causing chaos. Very responsible."

IMAGE IDEAS:
- Calm pet at vet vs. chaotic scenes
- Well-behaved pet vs. dramatic pets
- Organized pet supplies vs. messy setups

PLATFORMS: TikTok, Instagram, Twitter
ENGAGEMENT: Ask followers to share their "demure pet" moments`, "Meme Template")} size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      
                      <div className="bg-white p-3 rounded">
                        <h5 className="font-medium mb-1">"Plot Twist" Pet Meme:</h5>
                        <p className="text-muted-foreground mb-2">Format: Setup problem, reveal app solution</p>
                        <div className="bg-gray-100 p-2 rounded text-xs mb-2">
                          <strong>SETUP:</strong> "POV: Your pet is acting strange"<br/>
                          <strong>TWIST:</strong> "Plot twist: Your AI app detected early health issues and saved vet bills"
                        </div>
                        <Button onClick={() => copyToClipboard(`MEME: "Plot Twist Pet Care"

FORMAT: Multi-panel meme with setup and reveal

PANEL 1: "POV: Your pet is acting strange"
PANEL 2: "You're worried about expensive vet visits"
PANEL 3: "Plot twist: Your AI app detected early health issues and saved vet bills"

IMAGE IDEAS:
- Worried pet owner → surprised/relieved face
- Confused pet → happy pet with app interface
- Expensive vet bill → affordable app notification

PLATFORMS: TikTok, Instagram, Facebook
CALL TO ACTION: "Drop a 🐾 if you want early health detection for your pet"`, "Meme Template")} size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Superman/Krypto Movie Trend */}
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">Superman Movie + Krypto Trend</h4>
                    <p className="text-sm text-red-800 mb-3">
                      New Superman movie features Krypto getting hurt - perfect opportunity for pet safety and care content
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-white p-3 rounded">
                        <h5 className="font-medium mb-1">Movie Response Content:</h5>
                        <p className="text-muted-foreground mb-2">"POV: Watching Krypto get hurt in the new Superman movie and realizing your pet needs better protection"</p>
                        <div className="flex gap-2">
                          <Button onClick={() => copyToClipboard(`TikTok Script: "Krypto Movie Response - Pet Protection"

SETUP: Show emotional reaction to Krypto getting hurt in Superman movie

HOOK: "POV: You just watched Krypto get hurt and now you're paranoid about your own pet's safety"

TRANSITION: "Time to level up my pet parent game..."

REVEAL: Show Pet Care AI app features:
- Injury scanner for early detection
- Emergency vet consultation
- Health monitoring alerts
- Safety tips and prevention

TEXT OVERLAY: 
"When fiction hits too close to home 😭"
"Real pet protection starts here"
"Be the hero your pet deserves"

AUDIO: Emotional trending sound or Superman theme remix

HASHTAGS: #superman #krypto #petprotection #aiforpets #pethealth #responsiblepetowner #moviereaction #fyp #viral #petcare

HOOK: Connects emotional movie moment to real pet care solutions`, "TikTok Content")} size="sm">
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded">
                        <h5 className="font-medium mb-1">Superhero Pet Care Content:</h5>
                        <p className="text-muted-foreground mb-2">"Superman couldn't protect Krypto, but I can protect my pet with AI technology"</p>
                        <div className="flex gap-2">
                          <Button onClick={() => copyToClipboard(`TikTok Script: "Be Your Pet's Superman"

OPENING: "Superman couldn't protect Krypto in the movie, but I can be my pet's hero"

SHOW APP FEATURES as "superpowers":
- 🔍 "X-ray vision" = Injury scanner detecting hidden problems
- ⚡ "Super speed" = Instant vet consultations  
- 🛡️ "Force field" = Health monitoring and alerts
- 🧠 "Super intelligence" = AI analyzing pet behavior
- 💊 "Healing powers" = Personalized care recommendations

TEXT OVERLAY:
"Real superpowers for pet parents"
"No cape required, just this app"
"Every pet deserves a hero"

VISUAL: Split screen showing Superman/Krypto scenes vs real pet care with app

HASHTAGS: #superman #krypto #superheropet #aiforpets #petprotection #pethealth #movietrend #heroic #fyp #viral

CALL TO ACTION: "What superpower would your pet want? 🐾"`, "TikTok Content")} size="sm">
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded mt-3">
                      <h5 className="font-medium mb-1">Superman-themed Meme Template:</h5>
                      <div className="bg-gray-100 p-2 rounded text-xs mb-2">
                        <strong>FORMAT:</strong> Drake pointing meme template<br/>
                        <strong>TOP (rejecting):</strong> "Watching Superman fail to protect Krypto"<br/>
                        <strong>BOTTOM (approving):</strong> "Using Pet Care AI to actually protect my pet"
                      </div>
                      <Button onClick={() => copyToClipboard(`MEME: "Superman vs Real Pet Protection"

TEMPLATE: Drake pointing meme or similar approval/rejection format

TOP PANEL (REJECTING): 
- Image: Superman looking helpless/concerned
- Text: "Relying on fictional superheroes to protect pets"

BOTTOM PANEL (APPROVING):
- Image: Pet owner happily using smartphone with pet
- Text: "Using actual AI technology to monitor my pet's health 24/7"

ALTERNATIVE FORMATS:
- "Krypto getting hurt in movies" vs "My pet getting AI health monitoring"
- "Superman's powers" vs "Pet Care AI superpowers"
- "Waiting for a hero" vs "Being your pet's hero with tech"

PLATFORMS: Instagram, Twitter, Facebook, TikTok
ENGAGEMENT: Ask "What would Superman think of Pet Care AI?"

HASHTAGS: #superman #krypto #petcare #aiforpets #superhero #moviememe #petprotection`, "Meme Template")} size="sm">
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>

                  {/* Content Calendar Integration */}
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <h4 className="font-semibold text-pink-900 mb-2">July 2025 Cultural Moments for Pet Content</h4>
                    <p className="text-sm text-pink-800 mb-3">
                      Key dates and cultural moments to create timely content
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center bg-white p-2 rounded">
                        <span><strong>July 4 - Independence Day:</strong> "Very demure, very patriotic pets" content</span>
                        <Button onClick={() => copyToClipboard(`July 4 Content Idea: "Very Demure Patriotic Pets"

CONCEPT: Pets celebrating July 4th in a "very demure, very mindful" way

EXAMPLES:
- "See how my dog celebrates July 4th? Very demure, very mindful. Not scared of fireworks, just calmly enjoying. Very brave, very zen."
- Pet wearing subtle red/white/blue accessories vs. over-the-top costumes
- Calm pet during fireworks with app showing stress monitoring

HASHTAGS: #July4th #IndependenceDay #verydemure #patrioticpets #mindfulcelebration #petcare

HOOK: Promotes our anxiety monitoring features during fireworks season`, "Holiday Content")} size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center bg-white p-2 rounded">
                        <span><strong>Superman Movie Release:</strong> "Krypto injury scene reaction content"</span>
                        <Button onClick={() => copyToClipboard(`Superman Movie Content Idea: "Krypto Protection Response"

CONCEPT: React to Krypto getting hurt in Superman movie by showing real pet protection

VIRAL HOOK: "POV: You just watched Krypto get hurt in Superman and now you're paranoid about your own pet"

CONTENT FLOW:
1. Show emotional reaction to movie scene
2. "This is why I need real pet protection"
3. Demonstrate Pet Care AI features as "superpowers"
4. "Be your pet's Superman with technology"

KEY FEATURES TO HIGHLIGHT:
- Injury scanner for early detection
- Emergency vet consultations  
- Health monitoring alerts
- Preventive care recommendations

HASHTAGS: #superman #krypto #moviereaction #petprotection #aiforpets #superhero #pethealth #fyp #viral #movietrend

TIMING: Release during Superman movie buzz for maximum viral potential`, "Movie Tie-in Content")} size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center bg-white p-2 rounded">
                        <span><strong>July 11 - World Pet Photo Day:</strong> "Plot twist: AI analyzed my pet photos"</span>
                        <Button onClick={() => copyToClipboard(`July 11 Content Idea: "World Pet Photo Day AI Plot Twist"

CONCEPT: Turn pet photo sharing into AI feature showcase

SCRIPT:
"POV: It's World Pet Photo Day and you're just sharing cute pics..."
"Plot twist: Your AI app analyzes every photo for health insights"
"Now you have 365 days of health data from your camera roll"

VISUAL: Show transformation from casual pet photos to health analytics dashboard

HASHTAGS: #WorldPetPhotoDay #petphotos #aiforpets #plottwist #healthmonitoring #smartpetcare

HOOK: Perfect for demonstrating our photo analysis capabilities`, "Holiday Content")} size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center bg-white p-2 rounded">
                        <span><strong>July 17 - World Emoji Day:</strong> Pet emoji trend content with mood tracking</span>
                        <Button onClick={() => copyToClipboard(`July 17 Content Idea: "Pet Emoji Mood Tracking"

CONCEPT: Use trending emojis to show pet moods detected by AI

FORMAT: "My pet's mood today: [emoji]" with app screenshot showing analysis

EXAMPLES:
🐕 😴 = "Sleepy mode detected - adjusted feeding schedule"
🐱 😸 = "Happy and playful - training session recommended" 
🐕 😰 = "Stressed - anxiety protocol activated"

INTERACTIVE: Ask followers to guess their pet's mood with emojis

HASHTAGS: #WorldEmojiDay #petmood #aimooddetection #petemojis #smartpetcare #moodtracking

HOOK: Fun way to showcase our mood analysis technology`, "Holiday Content")} size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}