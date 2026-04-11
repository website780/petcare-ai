import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Camera, Eye, Sun, Target, Lightbulb } from 'lucide-react';

interface PhotoExample {
  id: string;
  title: string;
  imageUrl: string;
  isGood: boolean;
  reasons: string[];
  tips?: string[];
}

interface TutorialSection {
  title: string;
  description: string;
  examples: PhotoExample[];
}

export function PhotoTutorial() {
  const [activeTab, setActiveTab] = useState('dogs');

  const tutorialSections: { [key: string]: TutorialSection } = {
    dogs: {
      title: "Dog Photo Guidelines",
      description: "Capture your dog's emotions through proper lighting, positioning, and timing.",
      examples: [
        {
          id: 'dog-good-1',
          title: "Perfect Natural Light",
          imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
          isGood: true,
          reasons: [
            "Natural daylight provides even, soft lighting",
            "Eyes are clearly visible and well-lit",
            "Facial features are distinct and sharp",
            "No harsh shadows on the face"
          ],
          tips: [
            "Take photos near a window during daytime",
            "Avoid direct sunlight which creates harsh shadows"
          ]
        },
        {
          id: 'dog-bad-1',
          title: "Poor Lighting with Flash",
          imageUrl: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=300&fit=crop",
          isGood: false,
          reasons: [
            "Flash creates unnatural bright spots",
            "Eyes may appear red or glazed",
            "Harsh shadows behind the pet",
            "Facial expressions appear distorted"
          ],
          tips: [
            "Never use flash for pet photos",
            "Move to better natural light instead"
          ]
        },
        {
          id: 'dog-good-2',
          title: "Eye Level Perspective",
          imageUrl: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop",
          isGood: true,
          reasons: [
            "Camera at pet's eye level",
            "Full body visible in natural pose",
            "Photographer positioned at dog's height",
            "Clear view of facial features and body language"
          ],
          tips: [
            "Get down to your pet's level",
            "Capture full body when possible for better mood analysis"
          ]
        },
        {
          id: 'dog-bad-2',
          title: "Wrong Angle - Too High",
          imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
          isGood: false,
          reasons: [
            "Shot from above creates unnatural perspective",
            "Pet appears to be looking up submissively",
            "Body proportions look distorted",
            "Facial expressions hard to read"
          ],
          tips: [
            "Avoid shooting from above",
            "Get on the same level as your pet"
          ]
        }
      ]
    },
    cats: {
      title: "Cat Photo Guidelines",
      description: "Focus on whisker position, ear orientation, and eye expressions for accurate mood detection.",
      examples: [
        {
          id: 'cat-good-1',
          title: "Relaxed and Content",
          imageUrl: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=300&fit=crop",
          isGood: true,
          reasons: [
            "Whiskers in natural forward position",
            "Ears upright and relaxed",
            "Eyes partially closed showing contentment",
            "Natural body posture"
          ],
          tips: [
            "Capture cats during their calm moments",
            "Look for natural whisker positioning"
          ]
        },
        {
          id: 'cat-bad-1',
          title: "Stressed or Anxious",
          imageUrl: "https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=400&h=300&fit=crop",
          isGood: false,
          reasons: [
            "Ears flattened against head",
            "Wide eyes showing stress",
            "Whiskers pulled back",
            "Tense body posture"
          ],
          tips: [
            "Wait for your cat to relax before taking photos",
            "Use gentle encouragement, not force"
          ]
        },
        {
          id: 'cat-good-2',
          title: "Alert and Curious",
          imageUrl: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=300&fit=crop",
          isGood: true,
          reasons: [
            "Forward-facing ears showing alertness",
            "Direct eye contact",
            "Whiskers positioned forward",
            "Natural head tilt showing curiosity"
          ],
          tips: [
            "Use interesting sounds to get attention",
            "Capture the natural curiosity response"
          ]
        }
      ]
    },
    general: {
      title: "General Guidelines",
      description: "Universal tips that apply to photographing any pet for mood analysis.",
      examples: [
        {
          id: 'general-good-1',
          title: "Clean Background",
          imageUrl: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop",
          isGood: true,
          reasons: [
            "Simple, uncluttered background",
            "Pet is the clear focus",
            "No distracting elements",
            "Good contrast between pet and background"
          ],
          tips: [
            "Use plain walls or outdoor settings",
            "Remove distracting objects from frame"
          ]
        },
        {
          id: 'general-bad-1',
          title: "Cluttered Background",
          imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
          isGood: false,
          reasons: [
            "Busy background distracts from pet",
            "Multiple objects competing for attention",
            "Poor contrast makes pet blend in",
            "Cluttered composition"
          ],
          tips: [
            "Move to a simpler location",
            "Use depth of field to blur background"
          ]
        }
      ]
    }
  };

  const generalTips = [
    {
      icon: <Sun className="w-5 h-5" />,
      title: "Natural Lighting",
      description: "Use natural daylight near windows. Avoid flash and artificial lighting."
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Eye Level",
      description: "Get down to your pet's level for the most natural perspective."
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Focus on Face",
      description: "Ensure the pet's face, especially eyes and mouth, are clearly visible."
    },
    {
      icon: <Camera className="w-5 h-5" />,
      title: "Multiple Shots",
      description: "Take several photos to capture the best natural expression."
    }
  ];

  const currentSection = tutorialSections[activeTab];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Pet Photo Tutorial</h1>
        <p className="text-muted-foreground">
          Learn how to take the perfect photos of your pet for accurate mood analysis
        </p>
      </div>

      {/* General Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Quick Tips for All Pets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generalTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="text-primary mt-1">
                  {tip.icon}
                </div>
                <div>
                  <h4 className="font-medium">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Species-Specific Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Photo Examples by Pet Type</CardTitle>
          <CardDescription>
            See good and bad examples to understand what makes an effective pet photo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dogs">Dogs</TabsTrigger>
              <TabsTrigger value="cats">Cats</TabsTrigger>
              <TabsTrigger value="general">All Pets</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{currentSection.title}</h3>
                  <p className="text-muted-foreground">{currentSection.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentSection.examples.map((example) => (
                    <Card key={example.id} className={`border-2 ${example.isGood ? 'border-green-200' : 'border-red-200'}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{example.title}</CardTitle>
                          <Badge variant={example.isGood ? 'default' : 'destructive'} className="flex items-center gap-1">
                            {example.isGood ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            {example.isGood ? 'Good' : 'Avoid'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img 
                            src={example.imageUrl} 
                            alt={example.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">
                            {example.isGood ? 'Why this works:' : 'Why this doesn\'t work:'}
                          </h4>
                          <ul className="text-sm space-y-1">
                            {example.reasons.map((reason, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className={`w-2 h-2 rounded-full mt-1.5 ${example.isGood ? 'bg-green-500' : 'bg-red-500'}`} />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {example.tips && (
                          <div className="border-t pt-3">
                            <h4 className="font-medium mb-2">Tips:</h4>
                            <ul className="text-sm space-y-1">
                              {example.tips.map((tip, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="w-2 h-2 rounded-full mt-1.5 bg-blue-500" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Emotion Detection Guide */}
      <Card>
        <CardHeader>
          <CardTitle>What Our AI Looks For</CardTitle>
          <CardDescription>
            Understanding how the AI analyzes pet emotions helps you take better photos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Happiness/Relaxation Indicators</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  Relaxed facial muscles
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  Neutral or slightly open mouth
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  Forward or relaxed ear position
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  Soft, relaxed eye expression
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Stress/Anxiety Indicators</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  Dilated pupils
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  Flattened or pinned back ears
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  Tense facial muscles
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  Excessive panting or closed mouth
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Photo Demo</CardTitle>
          <CardDescription>
            Step-by-step demonstration of proper pet photography techniques
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before/After Comparison */}
            <div className="space-y-4">
              <h4 className="font-medium">Before: Poor Lighting & Angle</h4>
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop" 
                  alt="Poor pet photo example"
                  className="w-full h-full object-cover"
                />
              </div>
              <ul className="text-sm space-y-1">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  Dark, shadowy lighting
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  Cluttered background
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  Wrong camera angle
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">After: Perfect Lighting & Composition</h4>
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop" 
                  alt="Perfect pet photo example"
                  className="w-full h-full object-cover"
                />
              </div>
              <ul className="text-sm space-y-1">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  Natural, even lighting
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  Clean background
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  Eye-level perspective
                </li>
              </ul>
            </div>
          </div>
          
          {/* Step-by-step instructions */}
          <div className="mt-8 border-t pt-6">
            <h4 className="font-medium mb-4">Step-by-Step Process:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <h5 className="font-medium">Find Good Light</h5>
                <p className="text-sm text-muted-foreground">Position near a window with natural daylight</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <h5 className="font-medium">Get Eye Level</h5>
                <p className="text-sm text-muted-foreground">Crouch down to your pet's level</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <h5 className="font-medium">Capture Expression</h5>
                <p className="text-sm text-muted-foreground">Focus on eyes and natural facial expressions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting Section */}
      <Card>
        <CardHeader>
          <CardTitle>Common Issues & Solutions</CardTitle>
          <CardDescription>
            Quick fixes for the most common pet photography problems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-red-600">Problem: Blurry Photos</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    Pet moving too quickly
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    Camera shake from handheld shooting
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    Insufficient lighting
                  </li>
                </ul>
                <div className="border-l-4 border-green-500 pl-4">
                  <h5 className="font-medium text-green-600">Solutions:</h5>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>• Wait for calm moments or after exercise</li>
                    <li>• Use burst mode to capture multiple shots</li>
                    <li>• Move to brighter natural light</li>
                    <li>• Hold phone with both hands for stability</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-red-600">Problem: Pet Won't Look at Camera</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    Distracted by surroundings
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    Camera anxiety or fear
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    No motivation to focus
                  </li>
                </ul>
                <div className="border-l-4 border-green-500 pl-4">
                  <h5 className="font-medium text-green-600">Solutions:</h5>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>• Use favorite treats to get attention</li>
                    <li>• Make interesting sounds (kisses, squeaks)</li>
                    <li>• Have someone call their name from behind you</li>
                    <li>• Be patient and take photos gradually</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Pro Tips for Different Situations</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Active Pets</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Photograph after exercise when tired</li>
                    <li>• Use continuous shooting mode</li>
                    <li>• Focus on action shots showing personality</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">Shy Pets</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Shoot from a distance with zoom</li>
                    <li>• Let them get comfortable first</li>
                    <li>• Capture natural behaviors</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h5 className="font-medium text-purple-800 mb-2">Multiple Pets</h5>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Focus on one pet at a time</li>
                    <li>• Use treats to keep them in position</li>
                    <li>• Get help from family members</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="text-center py-8">
          <Camera className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Ready to Take Amazing Pet Photos?</h3>
          <p className="text-muted-foreground mb-4">
            Now that you know the techniques, try them out with your pet!
          </p>
          <Button asChild>
            <a href="/" className="inline-flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Start Taking Photos
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}