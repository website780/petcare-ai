import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Upload, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  Camera, 
  Send,
  MessageCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Pet } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TreatmentOption = {
  name: string;
  description: string;
  type: "MEDICATION" | "OINTMENT" | "BANDAGE" | "OTHER";
  brandNames: string[];
  activeIngredients: string[];
  usage: string;
  precautions: string[];
  expectedResults: string;
};

type InjuryAnalysis = {
  hasInjury: boolean;
  injuryDescription: string | null;
  severity: "LOW" | "MEDIUM" | "HIGH" | "NONE" | null;
  recommendations: string[];
  requiredVetVisit: boolean;
  immediateActions: string[];
  treatmentOptions: TreatmentOption[];
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

interface PetInjuryDetailsForm {
  location: string;
  duration: string;
  symptoms: string[];
  description: string;
}

interface PetInjuryScannerProps {
  pet: Pet;
}

export function PetInjuryScanner({ pet }: PetInjuryScannerProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<InjuryAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isDetailsFormVisible, setIsDetailsFormVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Injury details form state
  const [injuryDetails, setInjuryDetails] = useState<PetInjuryDetailsForm>({
    location: "",
    duration: "less-than-day",
    symptoms: [],
    description: ""
  });

  const commonSymptoms = [
    "Limping",
    "Swelling",
    "Bleeding",
    "Redness",
    "Hair loss",
    "Discharge",
    "Scratching",
    "Licking excessively",
    "Pain when touched",
    "Reduced activity",
    "Loss of appetite",
    "Whining/vocalization"
  ];

  const durationOptions = [
    { value: "less-than-day", label: "Less than 24 hours" },
    { value: "1-3-days", label: "1-3 days" },
    { value: "3-7-days", label: "3-7 days" },
    { value: "more-than-week", label: "More than a week" },
    { value: "chronic", label: "Chronic/Recurring" }
  ];

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Image too large",
        description: "Please select an image under 20MB"
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Show the details form
    setIsDetailsFormVisible(true);
  };

  const handleAnalyzeImage = async () => {
    if (!imagePreview) return;
    
    // Analyze the image
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const base64Image = imagePreview.split(",")[1];
      
      // Include pet species, breed, and injury details in the request
      const response = await apiRequest("POST", "/api/analyze/injury", { 
        imageData: base64Image,
        petSpecies: pet.species,
        petBreed: pet.breed,
        injuryDetails: {
          location: injuryDetails.location,
          duration: injuryDetails.duration,
          symptoms: injuryDetails.symptoms,
          description: injuryDetails.description
        }
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const result = await response.json();
      setAnalysis(result);
      
      // After analysis, add the first assistant message to the chat
      const initialMessage = result.injuryDescription || 
        (result.hasInjury 
          ? "I've analyzed the image and detected an injury." 
          : "I've analyzed the image and did not detect any significant injury.");
      
      setChatMessages([
        {
          role: 'assistant',
          content: initialMessage,
          timestamp: new Date()
        }
      ]);
      
      // Switch to the results tab
      setActiveTab("results");
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze the image. Please try again."
      });
    } finally {
      setIsAnalyzing(false);
      setIsDetailsFormVisible(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !analysis) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: newMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsSendingMessage(true);
    
    try {
      // Send the message to the server for processing
      const response = await apiRequest("POST", "/api/chat/injury", {
        message: newMessage,
        petId: pet.id,
        petSpecies: pet.species,
        petBreed: pet.breed,
        analysisContext: {
          hasInjury: analysis.hasInjury,
          injuryDescription: analysis.injuryDescription,
          severity: analysis.severity,
          chatHistory: chatMessages
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to get response");
      }
      
      const result = await response.json();
      
      // Add the assistant's response to the chat
      setChatMessages(prev => [
        ...prev, 
        {
          role: 'assistant',
          content: result.response,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error("Error in chat:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response. Please try again."
      });
    } finally {
      setIsSendingMessage(false);
      
      // Scroll to the bottom of the chat
      setTimeout(() => {
        if (chatEndRef.current) {
          chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
  });

  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case "HIGH": return "text-red-500 bg-red-100";
      case "MEDIUM": return "text-orange-500 bg-orange-100";
      case "LOW": return "text-yellow-500 bg-yellow-100";
      default: return "text-green-500 bg-green-100";
    }
  };

  const toggleSymptom = (symptom: string) => {
    setInjuryDetails(prev => {
      const symptoms = prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom];
      return { ...prev, symptoms };
    });
  };

  // Format date function for chat messages
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          {pet.name}'s Injury Scanner
        </CardTitle>
        <CardDescription>
          Upload a photo of the injury or concerning area for AI-powered analysis and recommendations specific to {pet.species} 
          {pet.breed ? ` (${pet.breed})` : ""}.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload & Details</TabsTrigger>
            <TabsTrigger value="results" disabled={!analysis}>Analysis & Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? "border-primary bg-primary/5" : "border-muted"}
                ${isAnalyzing ? "pointer-events-none opacity-50" : ""}`}
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 mx-auto mb-4 rounded-lg"
                />
              ) : (
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              )}
              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p>Analyzing image...</p>
                </div>
              ) : (
                <p>Drag & drop a photo of the injury here, or click to select one</p>
              )}
            </div>
            
            {isDetailsFormVisible && imagePreview && (
              <div className="space-y-4 mt-4 border rounded-lg p-4">
                <h3 className="font-medium text-lg">Injury Details</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Providing these details will help our AI give more accurate recommendations for {pet.name}.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Location on {pet.name}'s body
                    </label>
                    <Input 
                      placeholder="e.g., Right front paw, Left ear, etc."
                      value={injuryDetails.location}
                      onChange={(e) => setInjuryDetails({...injuryDetails, location: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      How long has this been a problem?
                    </label>
                    <Select 
                      value={injuryDetails.duration}
                      onValueChange={(value) => setInjuryDetails({...injuryDetails, duration: value})}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Symptoms observed (select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {commonSymptoms.map(symptom => (
                        <div 
                          key={symptom}
                          className={`border rounded-md p-2 cursor-pointer transition-colors text-sm
                            ${injuryDetails.symptoms.includes(symptom) 
                              ? 'bg-primary/10 border-primary' 
                              : 'hover:bg-muted/50'}`}
                          onClick={() => toggleSymptom(symptom)}
                        >
                          {symptom}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Additional details
                    </label>
                    <Textarea 
                      placeholder="Describe any other relevant information about the injury or condition..."
                      value={injuryDetails.description}
                      onChange={(e) => setInjuryDetails({...injuryDetails, description: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      onClick={handleAnalyzeImage} 
                      disabled={isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze Injury'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6">
            {analysis && (
              <div className="space-y-6">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {analysis.hasInjury ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      Analysis Results
                    </h3>
                    
                    {analysis.hasInjury && analysis.severity && (
                      <Badge variant="outline" className={getSeverityColor(analysis.severity)}>
                        {analysis.severity} Severity
                      </Badge>
                    )}
                  </div>
                  
                  {analysis.injuryDescription && (
                    <p className="text-muted-foreground mb-4">{analysis.injuryDescription}</p>
                  )}
                  
                  {analysis.requiredVetVisit && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Veterinary Visit Recommended</AlertTitle>
                      <AlertDescription>
                        Based on the analysis, a visit to a veterinarian is recommended for proper diagnosis and treatment.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {analysis.immediateActions.length > 0 && (
                    <AccordionItem value="immediate-actions">
                      <AccordionTrigger className="font-medium">
                        Immediate Actions
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                          {analysis.immediateActions.map((action, index) => (
                            <li key={index} className="text-muted-foreground">{action}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {analysis.recommendations.length > 0 && (
                    <AccordionItem value="recommendations">
                      <AccordionTrigger className="font-medium">
                        Recommendations
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                          {analysis.recommendations.map((rec, index) => (
                            <li key={index} className="text-muted-foreground">{rec}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {analysis.treatmentOptions.length > 0 && (
                    <AccordionItem value="treatment-options">
                      <AccordionTrigger className="font-medium">
                        Treatment Options
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {analysis.treatmentOptions.map((option, index) => (
                            <Card key={index}>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-semibold text-lg">{option.name}</h5>
                                  <Badge>{option.type}</Badge>
                                </div>
                                <p className="text-muted-foreground mb-4">{option.description}</p>

                                <div className="space-y-3">
                                  <div>
                                    <h6 className="font-medium mb-1">Recommended Brands:</h6>
                                    <div className="flex flex-wrap gap-2">
                                      {option.brandNames.map((brand, idx) => (
                                        <Badge key={idx} variant="secondary">{brand}</Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h6 className="font-medium mb-1">Active Ingredients:</h6>
                                    <div className="flex flex-wrap gap-2">
                                      {option.activeIngredients.map((ingredient, idx) => (
                                        <Badge key={idx} variant="outline">{ingredient}</Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h6 className="font-medium mb-1">Usage Instructions:</h6>
                                    <p className="text-muted-foreground">{option.usage}</p>
                                  </div>

                                  <div>
                                    <h6 className="font-medium mb-1">Precautions:</h6>
                                    <ul className="list-disc pl-5 space-y-1">
                                      {option.precautions.map((precaution, idx) => (
                                        <li key={idx} className="text-muted-foreground">{precaution}</li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div>
                                    <h6 className="font-medium mb-1">Expected Results:</h6>
                                    <p className="text-muted-foreground">{option.expectedResults}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Ask Follow-up Questions</h3>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-muted/30 h-64 overflow-y-auto flex flex-col gap-4">
                      {chatMessages.length > 0 ? (
                        chatMessages.map((message, index) => (
                          <div 
                            key={index} 
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.role === 'user' 
                                  ? 'bg-primary text-primary-foreground ml-auto' 
                                  : 'bg-muted'
                              }`}
                            >
                              <div className="text-sm">{message.content}</div>
                              <div className="text-xs mt-1 opacity-70 text-right">
                                {formatTime(message.timestamp)}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <p>Ask questions about {pet.name}'s injury or condition</p>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    
                    <div className="p-3 border-t flex gap-2">
                      <Input
                        placeholder={`Ask about ${pet.name}'s injury...`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        disabled={isSendingMessage}
                      />
                      <Button 
                        size="icon" 
                        onClick={handleSendMessage} 
                        disabled={!newMessage.trim() || isSendingMessage}
                      >
                        {isSendingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        Note: This tool provides an AI-powered preliminary assessment and does not replace professional veterinary care.
      </CardFooter>
    </Card>
  );
}