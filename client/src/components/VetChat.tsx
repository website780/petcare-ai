import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Pet } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Loader2, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

interface VetChatCategory {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

interface VetChatProps {
  pet: Pet;
}

export function VetChat({ pet }: VetChatProps) {
  const [activeTab, setActiveTab] = useState<string>("topics");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Define issue categories to help guide the user
  const issueCategories: VetChatCategory[] = [
    {
      id: "behaviour",
      name: "Behavioral Issues",
      description: "Ask about unusual behaviors, aggression, anxiety, or training concerns",
      examples: [
        "My pet is suddenly afraid of loud noises",
        "Why is my pet hiding more than usual?",
        "My pet is showing aggression toward other animals"
      ]
    },
    {
      id: "diet",
      name: "Diet & Nutrition",
      description: "Questions about food, diet changes, weight issues, or eating habits",
      examples: [
        "My pet has stopped eating their regular food",
        "How much should I feed my pet?",
        "Is my pet's weight healthy?"
      ]
    },
    {
      id: "symptom",
      name: "General Symptoms",
      description: "Discuss symptoms like lethargy, vomiting, digestive issues, or other health concerns",
      examples: [
        "My pet seems more tired than usual",
        "My pet is drinking more water than normal",
        "My pet has been vomiting"
      ]
    },
    {
      id: "preventcare",
      name: "Preventive Care",
      description: "Ask about vaccinations, parasite prevention, dental care, or routine check-ups",
      examples: [
        "When should my pet be vaccinated?",
        "What flea and tick prevention is best?",
        "How often should I brush my pet's teeth?"
      ]
    },
    {
      id: "senior",
      name: "Senior Pet Care",
      description: "Questions about aging pets, mobility issues, cognitive changes, or special needs",
      examples: [
        "My older pet is sleeping more than usual",
        "My senior pet seems confused sometimes",
        "My pet is having trouble climbing stairs"
      ]
    }
  ];

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
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
      const response = await apiRequest("POST", "/api/chat/vet", {
        message: newMessage,
        petId: pet.id,
        petSpecies: pet.species,
        petBreed: pet.breed,
        chatHistory: chatMessages,
        category: selectedCategory
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
      
      // After first message, switch to chat tab
      if (activeTab === "topics") {
        setActiveTab("chat");
      }
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

  const selectTopicAndInitiateChat = (categoryId: string, exampleQuestion?: string) => {
    setSelectedCategory(categoryId);
    
    if (exampleQuestion) {
      setNewMessage(exampleQuestion);
    }
    
    // If an example was selected, send it immediately
    if (exampleQuestion) {
      setTimeout(() => {
        handleSendMessage();
      }, 100);
    } else {
      setActiveTab("chat");
    }
  };

  // Format date function for chat messages
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Ask a Veterinary Question
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="topics">Health Topics</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="topics" className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Select a topic to get started with questions about {pet.name}'s health:
            </p>
            
            <div className="space-y-3">
              {issueCategories.map(category => (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => selectTopicAndInitiateChat(category.id)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium text-base mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium">Example questions:</p>
                      <ul className="space-y-1">
                        {category.examples.map((example, idx) => (
                          <li 
                            key={idx}
                            className="text-sm text-primary hover:underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectTopicAndInitiateChat(category.id, example);
                            }}
                          >
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="chat" className="space-y-4">
            {selectedCategory === "" && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-muted/50 rounded-md text-sm">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <p>
                  You can select a health topic to help our AI provide more targeted advice for {pet.name}.
                </p>
                <Button 
                  variant="link" 
                  className="text-xs h-auto p-0"
                  onClick={() => setActiveTab("topics")}
                >
                  Choose Topic
                </Button>
              </div>
            )}
            
            {selectedCategory !== "" && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Current topic:</span>
                  <Badge variant="outline" className="text-xs">
                    {issueCategories.find(c => c.id === selectedCategory)?.name || "General Question"}
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActiveTab("topics")}
                  className="h-8 text-xs"
                >
                  Change Topic
                </Button>
              </div>
            )}
            
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
                    <p>Ask a question about {pet.name}'s health</p>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              
              <div className="p-3 border-t flex gap-2">
                <Input
                  placeholder={`Ask a question about ${pet.name}...`}
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
            
            <p className="text-xs text-muted-foreground text-center mt-2">
              This AI assistant can provide general guidance but is not a substitute for professional veterinary care.
              Always consult with a licensed veterinarian for medical advice.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}