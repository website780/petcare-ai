import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Star, Shield, Brain, Heart, Camera, ThumbsUp, MessageCircle } from "lucide-react";

export default function AppStorePage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced pet analysis using cutting-edge AI technology for personalized care recommendations"
    },
    {
      icon: Camera,
      title: "Injury Scanner",
      description: "Real-time injury assessment with detailed treatment recommendations"
    },
    {
      icon: Heart,
      title: "Comprehensive Care",
      description: "Complete pet management including training, grooming, and health monitoring"
    },
    {
      icon: Shield,
      title: "Trusted Platform",
      description: "Secure and reliable pet care companion backed by veterinary expertise"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* App Name and Tagline */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">PetCare AI</h1>
            <p className="text-xl text-muted-foreground">
              Your Intelligent Pet Care Companion
            </p>
          </div>

          {/* App Store Description */}
          <Card>
            <CardHeader>
              <CardTitle>App Store Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Short Description</h3>
                <p>
                  Transform your pet care journey with PetCare AI - the ultimate AI-powered companion for comprehensive pet management, training, and health monitoring.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Long Description</h3>
                <p className="space-y-2">
                  PetCare AI revolutionizes pet care by combining cutting-edge artificial intelligence with comprehensive pet management tools. Our advanced AI technology provides personalized care recommendations, real-time injury assessment, and interactive training guidance tailored to your pet's unique needs.
                </p>
                <div className="mt-4 space-y-2">
                  <p>🌟 Key Features:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>AI-Powered Pet Analysis & Recommendations</li>
                    <li>Real-time Injury Scanner with Treatment Guidance</li>
                    <li>Interactive Training Programs with Progress Tracking</li>
                    <li>Comprehensive Health & Grooming Management</li>
                    <li>Personalized Care Schedules & Reminders</li>
                    <li>Emergency Pet Care Support</li>
                    <li>Photo Gallery with AI Analysis</li>
                    <li>Missing Pet Alert System</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "pet care",
                    "AI pet",
                    "dog training",
                    "cat care",
                    "pet health",
                    "pet monitor",
                    "vet care",
                    "pet tracking",
                    "pet grooming",
                    "pet emergency",
                    "pet analysis",
                    "animal care",
                    "pet management",
                    "pet reminder",
                    "pet schedule",
                    "injury scanner",
                    "pet photo",
                    "missing pet",
                    "pet safety",
                    "pet training"
                  ].map((keyword) => (
                    <Badge key={keyword} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promotional Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Promotional Text */}
          <Card>
            <CardHeader>
              <CardTitle>Promotional Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Taglines</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your AI-Powered Pet Care Companion</li>
                  <li>Intelligent Pet Care Made Simple</li>
                  <li>The Future of Pet Care is Here</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Promotional Message</h3>
                <p>
                  Experience the next evolution in pet care with PetCare AI. Our cutting-edge AI technology transforms how you care for your beloved pets, providing personalized recommendations, real-time health monitoring, and interactive training all in one intuitive app. From emergency injury assessment to daily care routines, PetCare AI is your trusted companion in ensuring your pet's health, happiness, and well-being.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* App Store Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                App Store Reviews
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">4.8 out of 5 (13,047 reviews)</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* 5 Star Reviews */}
              <div className="space-y-4">
                <h4 className="font-semibold text-green-700">⭐⭐⭐⭐⭐ 5 Star Reviews</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">PetMom2024</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "This app literally saved my dog's life! The injury scanner detected a small cut on my Golden Retriever's paw that I almost missed. The AI recommended immediate vet care and it turned out to be infected. The vet was amazed at how early we caught it. Worth every penny!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 47 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">TechVet_Sarah</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 month ago</span>
                    </div>
                    <p className="text-sm">
                      "As a veterinarian, I'm impressed by the accuracy of this app's recommendations. I actually recommend it to my clients now. The AI training plans are evidence-based and the nutrition guidance aligns perfectly with veterinary standards. Finally, an app that gets pet care right!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 156 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">BusyPetDad</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">3 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "Game changer for busy pet parents! The feeding reminders are lifesavers and the mood tracking helped me realize my cat was stressed from a recent move. The personalized care schedule keeps me organized and my pets are healthier than ever. 10/10!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 89 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Star Reviews */}
              <div className="space-y-4">
                <h4 className="font-semibold text-blue-700">⭐⭐⭐⭐ 4 Star Reviews</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">FirstTimePetOwner</p>
                        <div className="flex">
                          {[1, 2, 3, 4].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          <Star className="h-3 w-3 text-gray-300" />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm">
                      "Really helpful for a new dog owner like me! The training tips are clear and my puppy is actually learning. The grooming scheduler saved me from forgetting appointments. Only wish the vet consultation feature was available 24/7, but overall amazing app."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 23 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">MultiPetHousehold</p>
                        <div className="flex">
                          {[1, 2, 3, 4].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          <Star className="h-3 w-3 text-gray-300" />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">5 days ago</span>
                    </div>
                    <p className="text-sm">
                      "Managing 3 cats and 2 dogs was chaos before this app. The individual pet profiles and customized care plans are fantastic. Love the photo gallery feature - helps track their growth and health over time. Would love to see more breed-specific content though."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 67 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Star Reviews */}
              <div className="space-y-4">
                <h4 className="font-semibold text-yellow-700">⭐⭐⭐ 3 Star Reviews</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">SeniorPetParent</p>
                        <div className="flex">
                          {[1, 2, 3].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          {[4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 text-gray-300" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "Good concept and helpful features, but the interface could be more user-friendly for seniors like me. Sometimes the AI recommendations are too technical. The customer support team was very patient in helping me set it up though. Has potential but needs simplification."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 12 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="space-y-4">
                <h4 className="font-semibold text-purple-700">📅 Most Recent Reviews</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">EmergencyPetSaver</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-sm">
                      "UPDATE: This app just helped me through a pet emergency at 2 AM! My cat was acting strange and the AI analysis suggested possible poisoning. Rushed to emergency vet and they confirmed it was serious. The app literally saved my cat's life! Changed my rating from 4 to 5 stars."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 234 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">RescueDogMom</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">4 days ago</span>
                    </div>
                    <p className="text-sm">
                      "Perfect for rescue pets with unknown histories! The health assessment quiz helped identify my rescue dog's anxiety triggers and the training program is specifically designed for traumatized pets. Amazing work by the developers - you can tell they really understand animals."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 178 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">PetPhotographer_Alex</p>
                        <div className="flex">
                          {[1, 2, 3, 4].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          <Star className="h-3 w-3 text-gray-300" />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm">
                      "Love how the app analyzes pet photos for mood and health indicators - really helpful for my pet photography business! Clients are impressed when I can tell them about their pet's emotional state. The photo tutorial section taught me techniques I never knew. Would love more advanced photography tips though."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 45 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Savings Reviews */}
              <div className="space-y-4">
                <h4 className="font-semibold text-emerald-700">💰 Cost Savings & Value Reviews</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">BudgetPetParent</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm">
                      "This app has saved me HUNDREDS of dollars in vet bills! The injury scanner caught my dog's ear infection early - what could have been a $300 emergency visit became a $50 regular checkup. The training tips eliminated the need for expensive private trainers. ROI is incredible!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 312 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">SmartSaver2024</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">3 days ago</span>
                    </div>
                    <p className="text-sm">
                      "Calculated my savings: $180/month in grooming appointments (learned to do basic grooming myself), $200 saved on unnecessary vet visits through early health detection, $150/month on better food choices. App paid for itself in the first month!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 428 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">VetBillReliefMom</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">5 days ago</span>
                    </div>
                    <p className="text-sm">
                      "My vet bills dropped 60% since using this app! The preventive care reminders caught issues before they became expensive emergencies. My vet even commented on how much healthier my pets are now. Best investment I've made for my furry family."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 267 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">EarlyDetectionSaver</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "The mood tracking feature detected my cat's depression early, preventing what could have been months of expensive behavioral therapy. Quick intervention saved $800+ in specialist visits. This app is literally a money-saving machine for pet owners."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 189 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional High-Rating Reviews */}
              <div className="space-y-4">
                <h4 className="font-semibold text-green-700">⭐⭐⭐⭐⭐ More 5 Star Reviews</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">NewPuppyParent</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">4 days ago</span>
                    </div>
                    <p className="text-sm">
                      "First-time dog owner and this app has been my lifesaver! The potty training schedule worked perfectly, feeding reminders keep me on track, and the puppy health tips are invaluable. My vet is impressed with how well-cared for my puppy is!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 76 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">SeniorDogSpecialist</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm">
                      "My 12-year-old Golden Retriever's quality of life improved dramatically. The app's senior pet care recommendations and arthritis management tips have been amazing. Early detection of hip issues saved thousands in surgery costs."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 143 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">CatLady365</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">6 days ago</span>
                    </div>
                    <p className="text-sm">
                      "Managing 4 cats was overwhelming until I found this app. Individual health tracking, feeding schedules, and behavior analysis for each cat. The litter box health insights alone are worth the subscription. My cats are healthier and happier!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 92 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">TravelingPetDad</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-sm">
                      "Travel a lot for work and this app gives me peace of mind. My pet sitter uses it to follow the exact care routine, and I can monitor my dog's mood and health remotely. The emergency consultation feature was a lifesaver during a trip to Europe!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 158 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Reviews */}
              <div className="space-y-4">
                <h4 className="font-semibold text-indigo-700">👨‍⚕️ Professional Reviews</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-indigo-500 pl-4 bg-indigo-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Dr_Jennifer_DVM</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 month ago</span>
                    </div>
                    <p className="text-sm">
                      "As a practicing veterinarian for 15 years, I'm genuinely impressed by the accuracy of this app's health assessments. I now recommend it to clients for preventive care monitoring. The early detection capabilities have prevented countless emergency visits."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 542 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-indigo-500 pl-4 bg-indigo-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">CertifiedTrainer_Mike</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">3 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "Professional dog trainer here - this app's training protocols are evidence-based and effective. I use it to supplement my in-person training sessions. The progress tracking and behavioral analysis features are better than some professional tools I've used."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 287 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-indigo-500 pl-4 bg-indigo-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">PetNutritionist_Amy</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "The nutritional recommendations are spot-on and align with current veterinary nutritional science. I'm impressed by the breed-specific dietary guidance and portion calculations. Finally, an app that promotes proper pet nutrition!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 198 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* More Cost Savings & Specialty Reviews */}
              <div className="space-y-4">
                <h4 className="font-semibold text-emerald-700">💸 Additional Cost Savings Stories</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">DIYGroomerSavings</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">3 days ago</span>
                    </div>
                    <p className="text-sm">
                      "Used to spend $300/month on professional grooming for my 3 dogs. The grooming tutorials taught me to do basic grooming myself - now only need professional grooming every 3 months. Saving $2,400/year!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 89 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">PreventiveCareWins</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm">
                      "App caught my dog's dental issues early through photo analysis. $150 cleaning vs $1,500 dental surgery. The nutrition recommendations also reduced food costs by 30% while improving my dog's health. Best ROI ever!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 156 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">TrainingCostCutter</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">5 days ago</span>
                    </div>
                    <p className="text-sm">
                      "Was quoted $1,200 for professional dog training. This app's personalized training program solved my dog's behavioral issues for fraction of the cost. Behavioral problems disappeared in 6 weeks!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 203 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">InsuranceSavings</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "My pet insurance company gave me a 15% discount for using preventive care apps like this one. Between early detection savings and insurance discount, app pays for itself multiple times over."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 134 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* International Reviews */}
              <div className="space-y-4">
                <h4 className="font-semibold text-violet-700">🌍 International User Reviews</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-l-4 border-violet-500 pl-4 bg-violet-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">LondonPetMum</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">6 days ago</span>
                    </div>
                    <p className="text-sm">
                      "Brilliant app! Works perfectly in the UK. The vet consultation feature connected me with local vets when my cat fell ill during weekend. Saved £300 in emergency clinic fees. Interface is intuitive and customer service excellent."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 67 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-violet-500 pl-4 bg-violet-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">TokyoCatDad</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">4 days ago</span>
                    </div>
                    <p className="text-sm">
                      "Amazing app from Japan! Language support is excellent, and features work great with local pet care standards. The AI accurately identifies Japanese cat breeds. My vet was impressed with the health tracking data."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 82 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-violet-500 pl-4 bg-violet-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">SydneyDogTrainer</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm">
                      "Professional dog trainer in Australia - this app complements my services perfectly. Climate-specific advice for Australian conditions, native plant toxicity warnings. Clients love the 24/7 support aspect!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 95 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-violet-500 pl-4 bg-violet-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">GermanShepherdFan_DE</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">3 days ago</span>
                    </div>
                    <p className="text-sm">
                      "Excellent app here in Germany! Breed-specific guidance for German Shepherds was spot-on. Hip dysplasia monitoring features caught early signs. Local vet integration works seamlessly with European standards."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 73 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specialty Pet Reviews */}
              <div className="space-y-4">
                <h4 className="font-semibold text-amber-700">🦜 Specialty Pet Reviews</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-l-4 border-amber-500 pl-4 bg-amber-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">BirdLover2024</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm">
                      "Was skeptical about using this for my African Grey parrot, but the exotic pet features are incredible! Dietary recommendations, behavioral analysis, even detected early signs of feather plucking. Saved me hundreds in avian vet consultations."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 54 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-amber-500 pl-4 bg-amber-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">RabbitRescuer</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">4 days ago</span>
                    </div>
                    <p className="text-sm">
                      "Run a rabbit rescue and this app has been a game-changer! Tracks health for all 15 rabbits individually, dietary planning for different breeds, and the photo documentation helps with adoption profiles. Absolutely essential tool!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 128 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-amber-500 pl-4 bg-amber-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">GuineaPigMom</p>
                        <div className="flex">
                          {[1, 2, 3, 4].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          <Star className="h-3 w-3 text-gray-300" />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "Great for guinea pigs too! Vitamin C tracking, social group monitoring, cage hygiene reminders. Only wish there were more guinea pig-specific features, but what's there works well. Customer support was helpful with small pet questions."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 41 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-amber-500 pl-4 bg-amber-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">FerretFanatic</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">5 days ago</span>
                    </div>
                    <p className="text-sm">
                      "Ferret owner here - love that this app includes exotic pets! Sleep pattern tracking, play behavior analysis, and ferret-specific health alerts. The community features let me connect with other ferret parents worldwide."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 38 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Reviews */}
              <div className="space-y-4">
                <h4 className="font-semibold text-cyan-700">🔄 Update & Feature Reviews</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-cyan-500 pl-4 bg-cyan-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">UpdateAppreciator</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-sm">
                      "UPDATE: The new AI features in version 3.2 are incredible! Mood detection accuracy improved dramatically, and the new batch photo analysis saves so much time. Developers really listen to feedback - every update brings requested features!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 167 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-cyan-500 pl-4 bg-cyan-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">FeatureRequester</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm">
                      "Requested multi-pet family sharing 6 months ago - it's now live and works perfectly! My spouse and I can both track our dogs' care. Kids love the gamification features for pet care tasks. Outstanding developer responsiveness!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 89 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-cyan-500 pl-4 bg-cyan-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">TechSavvyPetParent</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">3 days ago</span>
                    </div>
                    <p className="text-sm">
                      "The new Apple Watch integration is fantastic! Heart rate monitoring during walks, activity tracking, even emergency alerts if my dog's vitals seem off. Seamlessly syncs with the main app. This is the future of pet care!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 234 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* New User Reviews - Recent Launch */}
              <div className="space-y-4">
                <h4 className="font-semibold text-purple-700">🆕 Recent Launch Reviews (Last 4 Months)</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">EarlyAdopter2024</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">3 months ago</span>
                    </div>
                    <p className="text-sm">
                      "Beta tested this app and loved seeing it launch! Amazing to watch it evolve from concept to fully-featured pet care platform. The AI accuracy has improved 300% since early testing. Proud to be an early supporter of this game-changing technology!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 445 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">LaunchWeekUser</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">4 months ago</span>
                    </div>
                    <p className="text-sm">
                      "Downloaded during launch week - incredible to see a startup execute this well! Seamless onboarding, intuitive UI, and the AI actually works. Already saved $200 on unnecessary vet visits thanks to accurate health assessments. Supporting innovative tech like this!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 312 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">TechReviewer_Mike</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">3 months ago</span>
                    </div>
                    <p className="text-sm">
                      "Tech reviewer here - this is the real deal! Clean code, fast performance, excellent AI implementation. No bugs in 3 months of heavy usage. The team clearly knows what they're doing. This will dominate the pet care app market."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 523 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Savings Reviews */}
              <div className="space-y-4">
                <h4 className="font-semibold text-green-700">💰 Cost Savings Success Stories</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">BudgetPetParent</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "Saved over $800 this year! The app prevented 3 unnecessary emergency vet visits and helped me catch health issues early. My groomer said my dog's coat improved dramatically following the app's care routine. Best $10/month I've ever spent!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 267 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">FrugalPetLover</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 month ago</span>
                    </div>
                    <p className="text-sm">
                      "Emergency fund stayed intact! Dog training through the app cost $0 vs $300 local classes. Grooming scheduler helped me find deals and the nutrition guide reduced food waste by 40%. This app pays for itself 10x over."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 198 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">SmartSpender_Sarah</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">3 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "Calculated exact savings: $1,200 in first 6 months! Avoided overpriced pet store food ($400), unnecessary vet anxiety visits ($500), professional grooming ($300). The injury scanner alone has saved 4 emergency visits. ROI is insane!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 445 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Endorsements */}
              <div className="space-y-4">
                <h4 className="font-semibold text-blue-700">👩‍⚕️ Professional Veterinary Reviews</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Dr_VetMedicine</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "DVM with 15 years experience - this app aligns perfectly with veterinary best practices. The injury assessment algorithm is impressively accurate. I've started recommending it to clients for better home monitoring. Finally, quality tech in our field!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 612 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">VetTech_Professional</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 month ago</span>
                    </div>
                    <p className="text-sm">
                      "Veterinary technician here - clients who use this app come in more prepared and informed. Their pets are healthier overall, and they ask better questions. The educational content is scientifically accurate. Great tool for pet education!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 234 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">AnimalNutritionist_PhD</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">3 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "PhD in Animal Nutrition - the dietary recommendations are evidence-based and species-appropriate. Portion calculations are accurate, ingredient analysis is thorough. This app represents the gold standard in pet nutrition guidance. Highly recommend!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 398 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* International Users */}
              <div className="space-y-4">
                <h4 className="font-semibold text-indigo-700">🌍 Global User Reviews</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-indigo-500 pl-4 bg-indigo-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">LondonPetOwner_UK</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm">
                      "Brilliant app from London! Works perfectly with UK vet systems and local pet services. The weather-based care suggestions adapt to our rainy climate. Currency conversion for cost savings tracking is spot-on. Proper quality, innit!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 156 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-indigo-500 pl-4 bg-indigo-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">TokyoDogLover_JP</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "日本から投稿！Perfect for small Tokyo apartments - exercise routines adapt to limited space. Cultural sensitivity in training methods respects Japanese pet care traditions. The app even suggests local Japanese pet foods. Amazing global adaptation!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 287 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-indigo-500 pl-4 bg-indigo-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">SydneyVetNurse_AU</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">3 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "G'day from Australia! Works beautifully with our unique wildlife interactions - even has snake bite protocol for dogs! Heat stress monitoring perfect for our summers. The developers really understand global pet care needs!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 198 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* First-Time Pet Owner Reviews */}
              <div className="space-y-4">
                <h4 className="font-semibold text-orange-700">🐾 First-Time Pet Owner Success Stories</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">NewDogMom_2024</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm">
                      "First dog ever at age 30 - this app held my hand through everything! Potty training, feeding schedules, vaccination reminders, even helped me understand dog body language. My rescue pup is thriving thanks to step-by-step guidance. Confidence booster!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 334 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">CollegeCatParent</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "College student, first cat - parents were skeptical but now they're amazed! The budget tracking helped me afford quality care on student loans. Emergency preparedness section saved my kitten when she ate something bad. This app = responsible pet ownership!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 267 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">RetiredPetNewbie</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">3 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "70 years old, first pet ever! Granddaughter helped set it up - now I'm more tech-savvy than she is! The large text mode and voice commands make it senior-friendly. My little terrier and I are learning together. Never too old to start!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 445 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Success Stories */}
              <div className="space-y-4">
                <h4 className="font-semibold text-red-700">🚨 Emergency Response Success Stories</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">LifeSaver_Mom</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">4 days ago</span>
                    </div>
                    <p className="text-sm">
                      "EMERGENCY UPDATE: App detected chocolate poisoning symptoms in my lab mix before I even realized what happened. Step-by-step emergency protocol guided me through inducing vomiting. Vet said we caught it just in time - this app literally saved my dog's life!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 1,234 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">QuickThinking_Dad</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm">
                      "3AM emergency - cat couldn't breathe properly. App's emergency triage asked the right questions, determined it was critical, auto-called nearest 24hr vet AND sent them my cat's medical history. Saved precious minutes that made the difference. Incredible!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 789 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">GratefulPetParent</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "Seizure emergency with my epileptic dog - app coached me through seizure protocol, timed the episode, and prepared detailed report for vet. Emergency features worked flawlessly under pressure. My hands were shaking but the app kept me calm and effective."
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 567 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Pet Household Reviews */}
              <div className="space-y-4">
                <h4 className="font-semibold text-teal-700">🏠 Multi-Pet Household Management</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-teal-500 pl-4 bg-teal-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">CrazyPetLady_5Dogs</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm">
                      "Managing 5 rescue dogs was chaos until this app! Individual profiles, synchronized feeding schedules, medication reminders for each dog, and the family sharing feature lets my husband help. Color-coded system is a lifesaver. Organization level: EXPERT!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 445 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-teal-500 pl-4 bg-teal-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">DogCatBird_Family</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">3 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "Dogs, cats, AND birds - this app handles every species! Cross-species interaction monitoring prevents conflicts, species-specific care plans, and even tracks which pets can't be in the same room. It's like having a zoo management system at home!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 298 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-teal-500 pl-4 bg-teal-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">MultiPetChaos_Mom</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "3 cats, 2 dogs, 1 rabbit - the expense tracking shows I'm saving $300/month on optimized feeding schedules! Bulk care reminders, group medication management, and conflict prevention tips. This app turned chaos into clockwork efficiency!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 356 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Training Success Stories */}
              <div className="space-y-4">
                <h4 className="font-semibold text-amber-700">🎓 Training Transformation Success</h4>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-amber-500 pl-4 bg-amber-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">RescueDogProgress</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "Rescue dog with severe anxiety transformed in 3 months! AI detected stress patterns I missed, customized desensitization program, and tracked micro-improvements. From cowering in corners to confident dog park visits. The progress videos made me cry happy tears!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 789 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-amber-500 pl-4 bg-amber-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">StubborHusky_Owner</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 month ago</span>
                    </div>
                    <p className="text-sm">
                      "Siberian Husky owner - these dogs are notoriously stubborn! The breed-specific training approach worked where 3 professional trainers failed. High-energy exercise plans, mental stimulation games, and escape-prevention strategies. My Husky is finally manageable!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 445 helpful</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-amber-500 pl-4 bg-amber-50 p-3 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">AggressiveRescue_Success</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">3 weeks ago</span>
                    </div>
                    <p className="text-sm">
                      "Aggressive rescue almost returned to shelter - this app saved our adoption! Aggression triggers analysis, de-escalation techniques, and rehabilitation timeline. 6 months later, she's a certified therapy dog visiting hospitals. Miraculous transformation!"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 1,123 helpful</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Developer Response */}
              <div className="bg-blue-100 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    DEVELOPER
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-900 mb-1">PetCare AI Development Team</p>
                    <p className="text-sm text-blue-800">
                      Overwhelmed by these incredible stories! Seeing emergency saves, cost savings, and training transformations validates our mission. Your feedback drives every update - we're launching 24/7 vet consultations next month based on your requests. To our early adopters: thank you for believing in us from day one. To new users: welcome to the PetCare AI family! Every review motivates our team to build better features for you and your pets. 
                    </p>
                    <p className="text-xs text-blue-600 mt-2">Updated response - 2 days ago</p>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
