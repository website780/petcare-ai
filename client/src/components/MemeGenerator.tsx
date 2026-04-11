import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Download, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MemeTemplate {
  id: string;
  name: string;
  format: string;
  textBoxes: { x: number; y: number; width: number; height: number; placeholder: string }[];
}

export default function MemeGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [memeTexts, setMemeTexts] = useState<string[]>([]);
  const [petName, setPetName] = useState("my pet");
  const [customCaption, setCustomCaption] = useState("");
  const { toast } = useToast();

  const templates: MemeTemplate[] = [
    {
      id: "drake",
      name: "Drake Format",
      format: "Two-panel rejection/approval",
      textBoxes: [
        { x: 300, y: 120, width: 400, height: 80, placeholder: "Old way of doing things" },
        { x: 300, y: 420, width: 400, height: 80, placeholder: "New Pet Care AI way" }
      ]
    },
    {
      id: "brain",
      name: "Expanding Brain",
      format: "Four-level brain expansion",
      textBoxes: [
        { x: 200, y: 90, width: 500, height: 40, placeholder: "Basic pet care" },
        { x: 200, y: 290, width: 500, height: 40, placeholder: "Reading about pet behavior" },
        { x: 200, y: 490, width: 500, height: 40, placeholder: "Researching symptoms online" },
        { x: 200, y: 690, width: 500, height: 40, placeholder: "Using Pet Care AI daily" }
      ]
    },
    {
      id: "buttons",
      name: "Two Buttons",
      format: "Difficult choice scenario",
      textBoxes: [
        { x: 200, y: 465, width: 140, height: 30, placeholder: "Panic about pet" },
        { x: 460, y: 465, width: 140, height: 30, placeholder: "Check Pet Care AI" }
      ]
    },
    {
      id: "distracted",
      name: "Distracted Boyfriend",
      format: "Three-character template",
      textBoxes: [
        { x: 120, y: 580, width: 120, height: 40, placeholder: "Old pet care" },
        { x: 340, y: 580, width: 100, height: 40, placeholder: "Pet owner" },
        { x: 540, y: 580, width: 120, height: 40, placeholder: "Pet Care AI" }
      ]
    }
  ];

  const generateMeme = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;

    const svgId = `generated-meme-${templateId}`;
    
    switch (templateId) {
      case "drake":
        return (
          <svg id={svgId} viewBox="0 0 800 600" className="w-full h-auto border rounded bg-white">
            <rect width="800" height="600" fill="white"/>
            
            {/* Top panel - rejecting */}
            <rect x="0" y="0" width="800" height="300" fill="#fff" stroke="#ddd" strokeWidth="2"/>
            <circle cx="150" cy="150" r="80" fill="#8B4513"/>
            <path d="M 70 150 Q 150 100 230 150 Q 150 200 70 150" fill="#D2691E"/>
            <circle cx="130" cy="130" r="8" fill="#000"/>
            <circle cx="170" cy="130" r="8" fill="#000"/>
            <path d="M 120 170 Q 150 180 180 170" stroke="#000" strokeWidth="3" fill="none"/>
            <path d="M 80 120 L 40 80 M 40 120 L 80 80" stroke="#000" strokeWidth="6"/>
            
            <text x="300" y="140" fontSize="24" fontWeight="bold" fill="#000">
              {memeTexts[0] || "Guessing what's wrong with my pet"}
            </text>
            
            {/* Bottom panel - approving */}
            <rect x="0" y="300" width="800" height="300" fill="#fff" stroke="#ddd" strokeWidth="2"/>
            <circle cx="150" cy="450" r="80" fill="#8B4513"/>
            <path d="M 70 450 Q 150 400 230 450 Q 150 500 70 450" fill="#D2691E"/>
            <circle cx="130" cy="430" r="8" fill="#000"/>
            <circle cx="170" cy="430" r="8" fill="#000"/>
            <path d="M 120 470 Q 150 480 180 470" stroke="#000" strokeWidth="3" fill="none"/>
            <path d="M 100 410 L 130 440 L 200 370" stroke="#000" strokeWidth="6" fill="none"/>
            
            <text x="300" y="440" fontSize="24" fontWeight="bold" fill="#000">
              {memeTexts[1] || "Using Pet Care AI for instant answers"}
            </text>
          </svg>
        );
        
      case "brain":
        return (
          <svg id={svgId} viewBox="0 0 800 800" className="w-full h-auto border rounded bg-white">
            <rect width="800" height="800" fill="white"/>
            
            {/* Level 1 */}
            <rect x="0" y="0" width="800" height="200" fill="#fff" stroke="#ddd" strokeWidth="2"/>
            <circle cx="100" cy="100" r="30" fill="#FFB6C1"/>
            <text x="200" y="110" fontSize="20" fontWeight="bold" fill="#000">
              {memeTexts[0] || "Basic pet care"}
            </text>
            
            {/* Level 2 */}
            <rect x="0" y="200" width="800" height="200" fill="#fff" stroke="#ddd" strokeWidth="2"/>
            <circle cx="100" cy="300" r="40" fill="#87CEEB"/>
            <text x="200" y="310" fontSize="20" fontWeight="bold" fill="#000">
              {memeTexts[1] || "Reading about pet behavior"}
            </text>
            
            {/* Level 3 */}
            <rect x="0" y="400" width="800" height="200" fill="#fff" stroke="#ddd" strokeWidth="2"/>
            <circle cx="100" cy="500" r="50" fill="#DDA0DD"/>
            <text x="200" y="510" fontSize="20" fontWeight="bold" fill="#000">
              {memeTexts[2] || "Researching symptoms online"}
            </text>
            
            {/* Level 4 */}
            <rect x="0" y="600" width="800" height="200" fill="#fff" stroke="#ddd" strokeWidth="2"/>
            <circle cx="100" cy="700" r="60" fill="#FFD700"/>
            <circle cx="80" cy="680" r="8" fill="#FFF"/>
            <circle cx="120" cy="720" r="6" fill="#FFF"/>
            <text x="200" y="710" fontSize="20" fontWeight="bold" fill="#000">
              {memeTexts[3] || "Using Pet Care AI daily"}
            </text>
          </svg>
        );
        
      case "buttons":
        return (
          <svg id={svgId} viewBox="0 0 800 600" className="w-full h-auto border rounded bg-white">
            <rect width="800" height="600" fill="#87CEEB"/>
            
            {/* Person sweating */}
            <circle cx="400" cy="200" r="50" fill="#FDBCB4"/>
            <rect x="370" y="250" width="60" height="100" fill="#4169E1"/>
            
            {/* Sweat drops */}
            <circle cx="360" cy="180" r="4" fill="#87CEEB"/>
            <circle cx="440" cy="190" r="4" fill="#87CEEB"/>
            
            {/* Two buttons */}
            <rect x="200" y="450" width="150" height="50" fill="#FF6B6B" stroke="#000" strokeWidth="3" rx="10"/>
            <text x="275" y="480" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">
              {memeTexts[0] || "Panic about pet"}
            </text>
            
            <rect x="450" y="450" width="150" height="50" fill="#4CAF50" stroke="#000" strokeWidth="3" rx="10"/>
            <text x="525" y="480" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">
              {memeTexts[1] || "Check Pet Care AI"}
            </text>
            
            <text x="400" y="100" fontSize="24" fontWeight="bold" fill="#000" textAnchor="middle">
              When {petName} acts strange
            </text>
          </svg>
        );
        
      default:
        return null;
    }
  };

  const downloadMeme = () => {
    if (!selectedTemplate) return;
    
    const svg = document.getElementById(`generated-meme-${selectedTemplate}`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      canvas.width = 800;
      canvas.height = selectedTemplate === "brain" ? 800 : 600;
      
      img.onload = function() {
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }
        canvas.toBlob(function(blob) {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pet-care-ai-meme-${selectedTemplate}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        });
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
    
    toast({
      title: "Downloaded!",
      description: "Your custom meme has been downloaded",
    });
  };

  const generateCaption = () => {
    const captions = [
      `When ${petName} discovers Pet Care AI knows them better than I do 😅 #PetCareAI #${petName}Knows`,
      `The moment ${petName} realized AI understands their needs 🤯 #PetCareAI #PetParentLife`,
      `${petName}'s reaction to getting personalized AI care recommendations ✨ #PetCareAI #SmartPets`,
      `Me trying to understand ${petName} vs Pet Care AI providing instant insights 🧠 #PetCareAI #AIForPets`,
      `When Pet Care AI reveals what ${petName} was actually trying to communicate 💡 #PetCareAI #PetBehavior`
    ];
    
    const randomCaption = captions[Math.floor(Math.random() * captions.length)];
    setCustomCaption(randomCaption);
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Custom Meme Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="template">Meme Template</Label>
                <Select value={selectedTemplate} onValueChange={(value) => {
                  setSelectedTemplate(value);
                  const template = templates.find(t => t.id === value);
                  setMemeTexts(new Array(template?.textBoxes.length || 0).fill(""));
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a meme template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} - {template.format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="petName">Pet Name</Label>
                <Input
                  id="petName"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Enter your pet's name"
                />
              </div>

              {selectedTemplateData && (
                <div className="space-y-3">
                  <Label>Meme Text</Label>
                  {selectedTemplateData.textBoxes.map((textBox, index) => (
                    <div key={index}>
                      <Input
                        value={memeTexts[index] || ""}
                        onChange={(e) => {
                          const newTexts = [...memeTexts];
                          newTexts[index] = e.target.value;
                          setMemeTexts(newTexts);
                        }}
                        placeholder={textBox.placeholder}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="caption">Social Media Caption</Label>
                  <Button onClick={generateCaption} size="sm" variant="outline">
                    <Wand2 className="h-3 w-3 mr-1" />
                    Generate
                  </Button>
                </div>
                <Textarea
                  id="caption"
                  value={customCaption}
                  onChange={(e) => setCustomCaption(e.target.value)}
                  placeholder="Write a catchy caption for your meme..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={downloadMeme} disabled={!selectedTemplate} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Meme
                </Button>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <Label>Preview</Label>
              <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px] flex items-center justify-center">
                {selectedTemplate ? (
                  <div className="w-full max-w-md">
                    {generateMeme(selectedTemplate)}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Wand2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Select a template to start creating your meme</p>
                  </div>
                )}
              </div>

              {customCaption && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Label className="text-sm font-medium text-blue-800">Generated Caption:</Label>
                  <p className="text-sm text-blue-700 mt-1">{customCaption}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Meme Marketing Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <Badge variant="secondary">Timing</Badge>
              <p>Post memes during peak hours: 6-10 PM on weekdays, 12-3 PM on weekends</p>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary">Hashtags</Badge>
              <p>Use 3-5 relevant hashtags. Mix trending tags with niche pet care tags</p>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary">Engagement</Badge>
              <p>Ask questions in captions to encourage comments and increase reach</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}