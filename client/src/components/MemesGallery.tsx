import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Meme {
  id: number;
  title: string;
  format: string;
  platform: string[];
  engagement: "High" | "Medium" | "Low";
  component: React.ReactNode;
  caption: string;
  hashtags: string;
}

export default function MemesGallery() {
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const downloadMeme = (memeId: number, title: string) => {
    const svg = document.getElementById(`meme-${memeId}`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      canvas.width = 800;
      canvas.height = 800;
      
      img.onload = function() {
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob(function(blob) {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title.replace(/\s+/g, '-').toLowerCase()}-meme.png`;
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
      description: `${title} meme downloaded`,
    });
  };

  const memes: Meme[] = [
    {
      id: 1,
      title: "Drake Meme - Pet Care Edition",
      format: "Drake Template",
      platform: ["TikTok", "Instagram", "Twitter"],
      engagement: "High",
      caption: "When you realize AI knows your pet better than you do 😅 #PetCareAI #PetParent #RelateableMemes",
      hashtags: "#PetCareAI #DrakeFormat #PetMemes #AIForPets",
      component: (
        <svg id="meme-1" viewBox="0 0 800 600" className="w-full h-auto border rounded">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="800" height="600" fill="white"/>
          <rect width="800" height="600" fill="url(#grid)"/>
          
          {/* Top panel - rejecting */}
          <rect x="0" y="0" width="800" height="300" fill="#fff" stroke="#ddd" strokeWidth="2"/>
          <circle cx="150" cy="150" r="80" fill="#8B4513"/>
          <path d="M 70 150 Q 150 100 230 150 Q 150 200 70 150" fill="#D2691E"/>
          <circle cx="130" cy="130" r="8" fill="#000"/>
          <circle cx="170" cy="130" r="8" fill="#000"/>
          <path d="M 120 170 Q 150 180 180 170" stroke="#000" strokeWidth="3" fill="none"/>
          <path d="M 80 120 L 40 80 M 40 120 L 80 80" stroke="#000" strokeWidth="6"/>
          
          <text x="300" y="120" fontSize="28" fontWeight="bold" fill="#000">
            Guessing what's wrong
          </text>
          <text x="300" y="160" fontSize="28" fontWeight="bold" fill="#000">
            with my pet for hours
          </text>
          <text x="300" y="200" fontSize="20" fill="#666">
            "Is he sick? Hungry? Bored?"
          </text>
          
          {/* Bottom panel - approving */}
          <rect x="0" y="300" width="800" height="300" fill="#fff" stroke="#ddd" strokeWidth="2"/>
          <circle cx="150" cy="450" r="80" fill="#8B4513"/>
          <path d="M 70 450 Q 150 400 230 450 Q 150 500 70 450" fill="#D2691E"/>
          <circle cx="130" cy="430" r="8" fill="#000"/>
          <circle cx="170" cy="430" r="8" fill="#000"/>
          <path d="M 120 470 Q 150 480 180 470" stroke="#000" strokeWidth="3" fill="none"/>
          <path d="M 100 410 L 130 440 L 200 370" stroke="#000" strokeWidth="6" fill="none"/>
          
          <text x="300" y="420" fontSize="28" fontWeight="bold" fill="#000">
            Using Pet Care AI to get
          </text>
          <text x="300" y="460" fontSize="28" fontWeight="bold" fill="#000">
            instant mood analysis
          </text>
          <text x="300" y="500" fontSize="20" fill="#666">
            "Ah, overstimulated! Makes sense."
          </text>
        </svg>
      )
    },
    {
      id: 2,
      title: "Distracted Boyfriend - Pet Edition",
      format: "Distracted Boyfriend",
      platform: ["Instagram", "Twitter", "Reddit"],
      engagement: "High",
      caption: "When AI pet analysis is more accurate than your 5 years of experience 👀 #PetCareAI #Relatable",
      hashtags: "#PetCareAI #DistractedBoyfriend #PetMemes #AIAccuracy",
      component: (
        <svg id="meme-2" viewBox="0 0 800 600" className="w-full h-auto border rounded">
          <rect width="800" height="600" fill="#87CEEB"/>
          
          {/* Background buildings */}
          <rect x="0" y="300" width="800" height="300" fill="#696969"/>
          <rect x="100" y="200" width="80" height="400" fill="#708090"/>
          <rect x="200" y="250" width="60" height="350" fill="#778899"/>
          <rect x="300" y="180" width="100" height="420" fill="#696969"/>
          <rect x="500" y="220" width="90" height="380" fill="#708090"/>
          <rect x="650" y="280" width="70" height="320" fill="#778899"/>
          
          {/* Ground */}
          <rect x="0" y="500" width="800" height="100" fill="#D3D3D3"/>
          
          {/* Girlfriend (Traditional Pet Care) */}
          <circle cx="200" cy="420" r="40" fill="#FDBCB4"/>
          <rect x="180" y="460" width="40" height="80" fill="#FF6B6B"/>
          <rect x="170" y="540" width="20" height="40" fill="#4169E1"/>
          <rect x="210" y="540" width="20" height="40" fill="#4169E1"/>
          <text x="120" y="610" fontSize="16" fontWeight="bold" fill="#000">Traditional Pet Care</text>
          
          {/* Boyfriend (Pet Owner) */}
          <circle cx="400" cy="400" r="40" fill="#FDBCB4"/>
          <rect x="380" y="440" width="40" height="80" fill="#4682B4"/>
          <rect x="370" y="520" width="20" height="40" fill="#000"/>
          <rect x="410" y="520" width="20" height="40" fill="#000"/>
          <text x="340" y="610" fontSize="16" fontWeight="bold" fill="#000">Pet Owner</text>
          
          {/* Other Woman (AI Pet Analysis) */}
          <circle cx="600" cy="420" r="40" fill="#FDBCB4"/>
          <rect x="580" y="460" width="40" height="80" fill="#9370DB"/>
          <rect x="570" y="540" width="20" height="40" fill="#8B0000"/>
          <rect x="610" y="540" width="20" height="40" fill="#8B0000"/>
          <text x="540" y="610" fontSize="16" fontWeight="bold" fill="#000">AI Pet Analysis</text>
          
          {/* Eyes direction */}
          <circle cx="395" cy="395" r="3" fill="#000"/>
          <circle cx="405" cy="395" r="3" fill="#000"/>
          
          {/* Speech bubbles */}
          <ellipse cx="250" cy="350" rx="80" ry="30" fill="white" stroke="#000" strokeWidth="2"/>
          <text x="210" y="360" fontSize="12" fill="#000">"Trust your instincts"</text>
          
          <ellipse cx="550" cy="350" rx="90" ry="30" fill="white" stroke="#000" strokeWidth="2"/>
          <text x="500" y="360" fontSize="12" fill="#000">"Instant AI analysis"</text>
          
          <text x="250" y="50" fontSize="24" fontWeight="bold" fill="#000" textAnchor="middle">
            When you discover Pet Care AI
          </text>
        </svg>
      )
    },
    {
      id: 3,
      title: "Brain Expansion - Pet Knowledge",
      format: "Expanding Brain",
      platform: ["TikTok", "Instagram", "Twitter"],
      engagement: "Medium",
      caption: "The evolution of pet parenting in 2025 🧠 #PetCareAI #PetParentEvolution #AIForPets",
      hashtags: "#PetCareAI #ExpandingBrain #PetEvolution #SmartPetCare",
      component: (
        <svg id="meme-3" viewBox="0 0 800 800" className="w-full h-auto border rounded">
          <rect width="800" height="800" fill="white"/>
          
          {/* Level 1 - Small brain */}
          <rect x="0" y="0" width="800" height="200" fill="#fff" stroke="#ddd" strokeWidth="2"/>
          <circle cx="100" cy="100" r="30" fill="#FFB6C1"/>
          <text x="200" y="110" fontSize="24" fontWeight="bold" fill="#000">My pet is fine</text>
          
          {/* Level 2 - Medium brain */}
          <rect x="0" y="200" width="800" height="200" fill="#fff" stroke="#ddd" strokeWidth="2"/>
          <circle cx="100" cy="300" r="40" fill="#87CEEB"/>
          <text x="200" y="310" fontSize="24" fontWeight="bold" fill="#000">Maybe I should watch them more</text>
          
          {/* Level 3 - Large brain */}
          <rect x="0" y="400" width="800" height="200" fill="#fff" stroke="#ddd" strokeWidth="2"/>
          <circle cx="100" cy="500" r="50" fill="#DDA0DD"/>
          <text x="200" y="510" fontSize="24" fontWeight="bold" fill="#000">I should research pet behavior</text>
          
          {/* Level 4 - Galaxy brain */}
          <rect x="0" y="600" width="800" height="200" fill="#fff" stroke="#ddd" strokeWidth="2"/>
          <circle cx="100" cy="700" r="60" fill="#FFD700"/>
          <circle cx="80" cy="680" r="8" fill="#FFF"/>
          <circle cx="120" cy="720" r="6" fill="#FFF"/>
          <circle cx="110" cy="670" r="4" fill="#FFF"/>
          <circle cx="90" cy="710" r="5" fill="#FFF"/>
          <text x="200" y="710" fontSize="24" fontWeight="bold" fill="#000">Using AI to analyze my pet daily</text>
        </svg>
      )
    },
    {
      id: 4,
      title: "This Is Fine - Pet Parent Edition",
      format: "This Is Fine",
      platform: ["Twitter", "Instagram", "Reddit"],
      engagement: "Medium",
      caption: "Me pretending I understand my pet's behavior vs using Pet Care AI 🔥 #ThisIsFine #PetCareAI",
      hashtags: "#PetCareAI #ThisIsFine #PetParentLife #RelateableMemes",
      component: (
        <svg id="meme-4" viewBox="0 0 800 600" className="w-full h-auto border rounded">
          <rect width="800" height="600" fill="#FFA500"/>
          
          {/* Room */}
          <rect x="100" y="400" width="600" height="200" fill="#8B4513"/>
          <rect x="100" y="300" width="600" height="100" fill="#DEB887"/>
          
          {/* Table */}
          <rect x="300" y="450" width="200" height="20" fill="#654321"/>
          <rect x="320" y="470" width="20" height="80" fill="#654321"/>
          <rect x="460" y="470" width="20" height="80" fill="#654321"/>
          
          {/* Pet owner sitting */}
          <circle cx="400" cy="420" r="30" fill="#FDBCB4"/>
          <rect x="380" y="450" width="40" height="60" fill="#4169E1"/>
          <rect x="370" y="510" width="20" height="30" fill="#000"/>
          <rect x="410" y="510" width="20" height="30" fill="#000"/>
          
          {/* Fire effects */}
          <path d="M 150 350 Q 170 320 190 350 Q 180 370 150 350" fill="#FF4500"/>
          <path d="M 180 340 Q 200 310 220 340 Q 210 360 180 340" fill="#FF6347"/>
          <path d="M 580 340 Q 600 310 620 340 Q 610 360 580 340" fill="#FF4500"/>
          <path d="M 610 350 Q 630 320 650 350 Q 640 370 610 350" fill="#FF6347"/>
          
          {/* Confused pet */}
          <circle cx="250" cy="480" r="25" fill="#D2691E"/>
          <circle cx="240" cy="470" r="4" fill="#000"/>
          <circle cx="260" cy="470" r="4" fill="#000"/>
          <path d="M 235 490 Q 250 500 265 490" stroke="#000" strokeWidth="2" fill="none"/>
          <text x="200" y="550" fontSize="12" fill="#000">Confused pet</text>
          
          {/* Speech bubble */}
          <ellipse cx="400" cy="350" rx="120" ry="40" fill="white" stroke="#000" strokeWidth="2"/>
          <text x="320" y="360" fontSize="16" fontWeight="bold" fill="#000">This is fine. I know</text>
          <text x="340" y="380" fontSize="16" fontWeight="bold" fill="#000">what my pet needs.</text>
          
          <text x="400" y="50" fontSize="28" fontWeight="bold" fill="#000" textAnchor="middle">
            Pet parents before Pet Care AI
          </text>
        </svg>
      )
    },
    {
      id: 5,
      title: "Woman Yelling at Cat - Pet Edition",
      format: "Woman Yelling at Cat",
      platform: ["Instagram", "Twitter", "TikTok"],
      engagement: "High",
      caption: "Me trying to figure out my pet's mood vs my pet's actual thoughts 😂 #PetCareAI #WomanYellingAtCat",
      hashtags: "#PetCareAI #WomanYellingAtCat #PetMood #RelateableMemes",
      component: (
        <svg id="meme-5" viewBox="0 0 800 400" className="w-full h-auto border rounded">
          <rect width="800" height="400" fill="white"/>
          
          {/* Left side - Woman pointing */}
          <rect x="0" y="0" width="400" height="400" fill="#F0F8FF"/>
          <circle cx="200" cy="150" r="40" fill="#FDBCB4"/>
          <rect x="180" y="190" width="40" height="80" fill="#FF69B4"/>
          <path d="M 240 180 L 300 200" stroke="#FDBCB4" strokeWidth="8"/>
          <circle cx="190" cy="140" r="3" fill="#000"/>
          <circle cx="210" cy="140" r="3" fill="#000"/>
          <path d="M 180 160 Q 200 150 220 160" stroke="#000" strokeWidth="2" fill="none"/>
          
          <text x="50" y="320" fontSize="18" fontWeight="bold" fill="#000">
            "You're acting weird!"
          </text>
          <text x="50" y="345" fontSize="18" fontWeight="bold" fill="#000">
            "Are you sick? Hungry?"
          </text>
          <text x="50" y="370" fontSize="18" fontWeight="bold" fill="#000">
            "What do you need?!"
          </text>
          
          {/* Right side - Cat at table */}
          <rect x="400" y="0" width="400" height="400" fill="#FFFACD"/>
          
          {/* Table */}
          <rect x="500" y="280" width="200" height="20" fill="#8B4513"/>
          
          {/* Cat */}
          <ellipse cx="600" cy="230" rx="30" ry="25" fill="#D2691E"/>
          <circle cx="590" cy="220" r="3" fill="#000"/>
          <circle cx="610" cy="220" r="3" fill="#000"/>
          <path d="M 580 210 L 590 200 M 610 210 L 620 200" stroke="#000" strokeWidth="2"/>
          <path d="M 585 235 Q 600 245 615 235" stroke="#000" strokeWidth="2" fill="none"/>
          
          {/* Salad */}
          <ellipse cx="550" cy="270" rx="25" ry="15" fill="#90EE90"/>
          
          <text x="450" y="320" fontSize="18" fontWeight="bold" fill="#000">
            Cat's actual thoughts:
          </text>
          <text x="450" y="345" fontSize="18" fontWeight="bold" fill="#000">
            "I'm perfectly content,
          </text>
          <text x="450" y="370" fontSize="18" fontWeight="bold" fill="#000">
            just being a cat"
          </text>
        </svg>
      )
    },
    {
      id: 6,
      title: "Two Buttons - Pet Care Dilemma",
      format: "Two Buttons",
      platform: ["TikTok", "Instagram", "Twitter"],
      engagement: "Medium",
      caption: "The eternal pet parent struggle 😅 #PetCareAI #TwoButtons #PetParentLife",
      hashtags: "#PetCareAI #TwoButtons #PetParentStruggles #Relatable",
      component: (
        <svg id="meme-6" viewBox="0 0 800 600" className="w-full h-auto border rounded">
          <rect width="800" height="600" fill="#87CEEB"/>
          
          {/* Person sweating */}
          <circle cx="400" cy="200" r="50" fill="#FDBCB4"/>
          <rect x="370" y="250" width="60" height="100" fill="#4169E1"/>
          <rect x="360" y="350" width="25" height="60" fill="#000"/>
          <rect x="415" y="350" width="25" height="60" fill="#000"/>
          
          {/* Sweat drops */}
          <circle cx="360" cy="180" r="4" fill="#87CEEB"/>
          <circle cx="440" cy="190" r="4" fill="#87CEEB"/>
          <circle cx="380" cy="170" r="3" fill="#87CEEB"/>
          
          {/* Two buttons */}
          <rect x="200" y="450" width="150" height="50" fill="#FF6B6B" stroke="#000" strokeWidth="3" rx="10"/>
          <text x="275" y="480" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
            Panic and Google
          </text>
          <text x="275" y="495" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
            symptoms for 3 hours
          </text>
          
          <rect x="450" y="450" width="150" height="50" fill="#4CAF50" stroke="#000" strokeWidth="3" rx="10"/>
          <text x="525" y="480" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
            Use Pet Care AI
          </text>
          <text x="525" y="495" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
            for instant analysis
          </text>
          
          {/* Control panel */}
          <rect x="300" y="420" width="200" height="80" fill="#696969" stroke="#000" strokeWidth="2"/>
          <text x="400" y="440" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">
            Pet Acting Strange
          </text>
          
          <text x="400" y="100" fontSize="24" fontWeight="bold" fill="#000" textAnchor="middle">
            Every Pet Parent's Dilemma
          </text>
        </svg>
      )
    },
    {
      id: 7,
      title: "Spongebob Mocking - Pet Expert Edition",
      format: "Spongebob Mocking",
      platform: ["TikTok", "Twitter", "Instagram"],
      engagement: "High",
      caption: "When people say 'just use your instincts' but AI gives you actual answers 🤡 #PetCareAI #SpongeBobMocking",
      hashtags: "#PetCareAI #SpongeBobMocking #PetParentLife #AIvsInstincts",
      component: (
        <svg id="meme-7" viewBox="0 0 800 600" className="w-full h-auto border rounded">
          <rect width="800" height="600" fill="#87CEEB"/>
          
          {/* Underwater scene */}
          <ellipse cx="100" cy="500" rx="80" ry="20" fill="#8FBC8F"/>
          <ellipse cx="300" cy="520" rx="60" ry="15" fill="#9ACD32"/>
          <ellipse cx="500" cy="510" rx="90" ry="25" fill="#8FBC8F"/>
          <ellipse cx="700" cy="530" rx="70" ry="18" fill="#9ACD32"/>
          
          {/* Bubbles */}
          <circle cx="150" cy="300" r="8" fill="white" opacity="0.7"/>
          <circle cx="180" cy="250" r="6" fill="white" opacity="0.7"/>
          <circle cx="200" cy="200" r="10" fill="white" opacity="0.7"/>
          <circle cx="600" cy="350" r="7" fill="white" opacity="0.7"/>
          <circle cx="620" cy="300" r="9" fill="white" opacity="0.7"/>
          
          {/* Spongebob mocking */}
          <rect x="350" y="250" width="100" height="150" fill="#FFFF00" rx="10"/>
          <circle cx="400" cy="200" r="40" fill="#FFFF00"/>
          <circle cx="380" cy="190" r="12" fill="white"/>
          <circle cx="420" cy="190" r="12" fill="white"/>
          <circle cx="375" cy="185" r="4" fill="#000"/>
          <circle cx="425" cy="195" r="4" fill="#000"/>
          
          {/* Mocking mouth */}
          <path d="M 370 210 Q 400 230 430 210 Q 400 240 370 210" fill="#000"/>
          
          {/* Arms in mocking gesture */}
          <ellipse cx="320" cy="300" rx="15" ry="40" fill="#FFFF00"/>
          <ellipse cx="480" cy="300" rx="15" ry="40" fill="#FFFF00"/>
          
          {/* Text bubble */}
          <ellipse cx="400" cy="100" rx="180" ry="60" fill="white" stroke="#000" strokeWidth="3"/>
          <text x="280" y="90" fontSize="16" fontWeight="bold" fill="#000">
            "JuSt TrUsT yOuR iNsTiNcTs
          </text>
          <text x="300" y="110" fontSize="16" fontWeight="bold" fill="#000">
            WiTh YoUr PeT"
          </text>
          
          <text x="400" y="550" fontSize="20" fontWeight="bold" fill="#000" textAnchor="middle">
            Meanwhile Pet Care AI: *provides scientific analysis*
          </text>
        </svg>
      )
    },
    {
      id: 8,
      title: "Sleeping Drake - Pet Emergency Edition",
      format: "Sleeping Drake",
      platform: ["Instagram", "Twitter", "TikTok"],
      engagement: "Medium",
      caption: "3AM pet parent emergency protocol 🌙 #PetCareAI #3AMLife #PetEmergency",
      hashtags: "#PetCareAI #3AMEmergency #SleepingDrake #PetParentLife",
      component: (
        <svg id="meme-8" viewBox="0 0 800 600" className="w-full h-auto border rounded">
          <rect width="800" height="600" fill="#1a1a2e"/>
          
          {/* Top panel - Drake sleeping */}
          <rect x="0" y="0" width="800" height="300" fill="#16213e" stroke="#333" strokeWidth="2"/>
          <circle cx="150" cy="150" r="80" fill="#8B4513"/>
          <path d="M 70 150 Q 150 100 230 150 Q 150 200 70 150" fill="#D2691E"/>
          
          {/* Sleeping eyes */}
          <path d="M 120 140 Q 130 130 140 140" stroke="#000" strokeWidth="4" fill="none"/>
          <path d="M 160 140 Q 170 130 180 140" stroke="#000" strokeWidth="4" fill="none"/>
          
          {/* ZZZ */}
          <text x="250" y="80" fontSize="30" fill="#fff">Z</text>
          <text x="270" y="60" fontSize="25" fill="#fff">Z</text>
          <text x="285" y="45" fontSize="20" fill="#fff">Z</text>
          
          <text x="300" y="120" fontSize="24" fontWeight="bold" fill="#fff">
            Peacefully sleeping at 3 AM
          </text>
          <text x="300" y="160" fontSize="24" fontWeight="bold" fill="#fff">
            when your pet acts weird
          </text>
          
          {/* Bottom panel - Drake panicking */}
          <rect x="0" y="300" width="800" height="300" fill="#16213e" stroke="#333" strokeWidth="2"/>
          <circle cx="150" cy="450" r="80" fill="#8B4513"/>
          <path d="M 70 450 Q 150 400 230 450 Q 150 500 70 450" fill="#D2691E"/>
          
          {/* Wide awake eyes */}
          <circle cx="130" cy="430" r="12" fill="#fff"/>
          <circle cx="170" cy="430" r="12" fill="#fff"/>
          <circle cx="130" cy="430" r="6" fill="#000"/>
          <circle cx="170" cy="430" r="6" fill="#000"/>
          
          {/* Worried mouth */}
          <path d="M 120 470 Q 150 460 180 470" stroke="#000" strokeWidth="3" fill="none"/>
          
          <text x="300" y="420" fontSize="24" fontWeight="bold" fill="#fff">
            Instantly wide awake checking
          </text>
          <text x="300" y="460" fontSize="24" fontWeight="bold" fill="#fff">
            Pet Care AI for answers
          </text>
          
          {/* Phone glow */}
          <rect x="280" y="480" width="60" height="100" fill="#fff" rx="10"/>
          <rect x="285" y="485" width="50" height="70" fill="#4169E1"/>
          <text x="310" y="525" fontSize="8" fill="#fff">Pet Care AI</text>
        </svg>
      )
    },
    {
      id: 9,
      title: "Coldplay Kiss Cam - Pet Loyalty Edition",
      format: "Drake Meme",
      platform: ["TikTok", "Instagram", "Twitter"],
      engagement: "High",
      caption: "After the Coldplay Kiss Cam drama, this is why pets > humans 😤 #ColdplayKissCam #PetLoyalty #TrustYourPet",
      hashtags: "#ColdplayKissCam #PetLoyalty #TrustYourPet #PetCareAI #DogsvsHumans #LoyalPets",
      component: (
        <svg id="meme-9" viewBox="0 0 800 600" className="w-full h-auto border rounded">
          <rect width="800" height="600" fill="#1a1a2e"/>
          
          {/* Top panel - Drake declining humans */}
          <rect x="0" y="0" width="800" height="300" fill="#2c2c54" stroke="#fff" strokeWidth="2"/>
          <circle cx="150" cy="150" r="80" fill="#8B4513"/>
          <path d="M 70 150 Q 150 100 230 150 Q 150 200 70 150" fill="#D2691E"/>
          
          {/* Drake face - rejecting */}
          <circle cx="130" cy="130" r="8" fill="#000"/>
          <circle cx="170" cy="130" r="8" fill="#000"/>
          <path d="M 120 170 Q 150 160 180 170" stroke="#000" strokeWidth="3" fill="none"/>
          
          {/* Hand gesture - pushing away */}
          <ellipse cx="250" cy="130" rx="30" ry="15" fill="#8B4513"/>
          <text x="300" y="120" fontSize="28" fontWeight="bold" fill="#fff">
            Dating humans after watching
          </text>
          <text x="300" y="160" fontSize="28" fontWeight="bold" fill="#fff">
            that Coldplay Kiss Cam
          </text>
          <text x="300" y="200" fontSize="20" fill="#ff6b6b">
            (Trust issues activated)
          </text>
          
          {/* Bottom panel - Drake pointing to pets */}
          <rect x="0" y="300" width="800" height="300" fill="#2c2c54" stroke="#fff" strokeWidth="2"/>
          <circle cx="150" cy="450" r="80" fill="#8B4513"/>
          <path d="M 70 450 Q 150 400 230 450 Q 150 500 70 450" fill="#D2691E"/>
          
          {/* Drake face - approving */}
          <circle cx="130" cy="430" r="8" fill="#000"/>
          <circle cx="170" cy="430" r="8" fill="#000"/>
          <path d="M 130 470 Q 150 480 170 470" stroke="#000" strokeWidth="3" fill="none"/>
          
          {/* Hand gesture - pointing */}
          <ellipse cx="250" cy="430" rx="40" ry="15" fill="#8B4513"/>
          <text x="300" y="420" fontSize="28" fontWeight="bold" fill="#fff">
            Dating your pet instead
          </text>
          <text x="300" y="460" fontSize="28" fontWeight="bold" fill="#fff">
            (Unconditional loyalty guaranteed)
          </text>
          <text x="300" y="500" fontSize="20" fill="#4ecdc4">
            Use Pet Care AI to understand them better! ❤️
          </text>
          
          {/* Concert Kiss Cam reference */}
          <rect x="600" y="50" width="150" height="100" fill="#444" stroke="#fff" strokeWidth="2" rx="10"/>
          <text x="675" y="80" fontSize="12" fill="#fff" textAnchor="middle">KISS CAM</text>
          <text x="675" y="100" fontSize="12" fill="#fff" textAnchor="middle">😬</text>
          <text x="675" y="120" fontSize="10" fill="#ff6b6b" textAnchor="middle">AWKWARD</text>
        </svg>
      )
    },
    {
      id: 10,
      title: "Galaxy Brain - Pet Care Evolution",
      format: "Galaxy Brain Extended",
      platform: ["Instagram", "TikTok", "Reddit"],
      engagement: "High",
      caption: "The ultimate pet parent evolution 🧠✨ #PetCareAI #GalaxyBrain #PetEvolution",
      hashtags: "#PetCareAI #GalaxyBrain #PetParentEvolution #AIRevolution",
      component: (
        <svg id="meme-9" viewBox="0 0 800 1000" className="w-full h-auto border rounded">
          <rect width="800" height="1000" fill="white"/>
          
          {/* Level 1 */}
          <rect x="0" y="0" width="800" height="200" fill="#fff" stroke="#ddd" strokeWidth="2"/>
          <circle cx="100" cy="100" r="25" fill="#FFB6C1"/>
          <text x="200" y="110" fontSize="20" fontWeight="bold" fill="#000">Pets don't need special care</text>
          
          {/* Level 2 */}
          <rect x="0" y="200" width="800" height="200" fill="#fff" stroke="#ddd" strokeWidth="2"/>
          <circle cx="100" cy="300" r="35" fill="#87CEEB"/>
          <text x="200" y="310" fontSize="20" fontWeight="bold" fill="#000">Maybe I should read about pet behavior</text>
          
          {/* Level 3 */}
          <rect x="0" y="400" width="800" height="200" fill="#fff" stroke="#ddd" strokeWidth="2"/>
          <circle cx="100" cy="500" r="45" fill="#DDA0DD"/>
          <text x="200" y="510" fontSize="20" fontWeight="bold" fill="#000">Researching every pet symptom online</text>
          
          {/* Level 4 */}
          <rect x="0" y="600" width="800" height="200" fill="#fff" stroke="#ddd" strokeWidth="2"/>
          <circle cx="100" cy="700" r="55" fill="#FFD700"/>
          <circle cx="80" cy="680" r="6" fill="#FFF"/>
          <circle cx="120" cy="720" r="4" fill="#FFF"/>
          <text x="200" y="710" fontSize="20" fontWeight="bold" fill="#000">Using AI for instant pet analysis</text>
          
          {/* Level 5 - Ultimate */}
          <rect x="0" y="800" width="800" height="200" fill="#000" stroke="#333" strokeWidth="2"/>
          <circle cx="100" cy="900" r="65" fill="#9400D3"/>
          <circle cx="70" cy="870" r="8" fill="#FFF"/>
          <circle cx="130" cy="930" r="6" fill="#FFF"/>
          <circle cx="110" cy="860" r="4" fill="#FFF"/>
          <circle cx="90" cy="920" r="5" fill="#FFF"/>
          <circle cx="120" cy="880" r="3" fill="#FFF"/>
          <path d="M 50 900 Q 100 850 150 900" stroke="#FFF" strokeWidth="2" fill="none"/>
          <path d="M 60 920 Q 100 870 140 920" stroke="#FFF" strokeWidth="2" fill="none"/>
          <text x="200" y="910" fontSize="20" fontWeight="bold" fill="#FFF">
            AI predicting pet needs before they happen
          </text>
        </svg>
      )
    },
    {
      id: 10,
      title: "Surprised Pikachu - Pet Behavior",
      format: "Surprised Pikachu",
      platform: ["Instagram", "Twitter", "TikTok"],
      engagement: "High",
      caption: "When Pet Care AI reveals what your pet was actually trying to tell you 😱 #PetCareAI #SurprisedPikachu",
      hashtags: "#PetCareAI #SurprisedPikachu #PetBehavior #MindBlown",
      component: (
        <svg id="meme-10" viewBox="0 0 800 600" className="w-full h-auto border rounded">
          <rect width="800" height="600" fill="#FFFACD"/>
          
          {/* Pikachu body */}
          <ellipse cx="400" cy="400" rx="120" ry="100" fill="#FFFF00"/>
          
          {/* Head */}
          <circle cx="400" cy="250" r="100" fill="#FFFF00"/>
          
          {/* Ears */}
          <path d="M 330 180 Q 320 120 350 140 Q 360 100 340 160" fill="#FFFF00"/>
          <path d="M 470 180 Q 480 120 450 140 Q 440 100 460 160" fill="#FFFF00"/>
          <path d="M 335 160 Q 340 130 355 150" fill="#000"/>
          <path d="M 465 160 Q 460 130 445 150" fill="#000"/>
          
          {/* Red cheeks */}
          <circle cx="320" cy="270" r="25" fill="#FF6B6B"/>
          <circle cx="480" cy="270" r="25" fill="#FF6B6B"/>
          
          {/* Surprised eyes */}
          <circle cx="365" cy="230" r="20" fill="#000"/>
          <circle cx="435" cy="230" r="20" fill="#000"/>
          <circle cx="365" cy="225" r="8" fill="#FFF"/>
          <circle cx="435" cy="225" r="8" fill="#FFF"/>
          
          {/* Surprised mouth */}
          <ellipse cx="400" cy="280" rx="15" ry="25" fill="#000"/>
          
          {/* Arms */}
          <ellipse cx="280" cy="350" rx="30" ry="60" fill="#FFFF00"/>
          <ellipse cx="520" cy="350" rx="30" ry="60" fill="#FFFF00"/>
          
          {/* Tail */}
          <path d="M 500 450 Q 550 400 580 450 Q 600 420 570 460 Q 590 440 560 470" fill="#FFFF00" stroke="#8B4513" strokeWidth="8"/>
          
          {/* Speech bubble */}
          <ellipse cx="400" cy="100" rx="200" ry="60" fill="white" stroke="#000" strokeWidth="3"/>
          <text x="250" y="90" fontSize="18" fontWeight="bold" fill="#000">
            "Your pet was asking for mental
          </text>
          <text x="280" y="120" fontSize="18" fontWeight="bold" fill="#000">
            stimulation, not more food"
          </text>
          
          <text x="400" y="550" fontSize="24" fontWeight="bold" fill="#000" textAnchor="middle">
            Pet owners discovering AI analysis
          </text>
        </svg>
      )
    },
    {
      id: 11,
      title: "Hide the Pain Harold - Vet Bills",
      format: "Hide the Pain Harold",
      platform: ["Instagram", "Twitter", "Reddit"],
      engagement: "Medium",
      caption: "When Pet Care AI could have saved you that $200 vet visit 💸 #PetCareAI #HideThePainHarold #VetBills",
      hashtags: "#PetCareAI #HideThePainHarold #VetBills #PetParentStruggles",
      component: (
        <svg id="meme-11" viewBox="0 0 800 600" className="w-full h-auto border rounded">
          <rect width="800" height="600" fill="#F0F8FF"/>
          
          {/* Harold's head */}
          <circle cx="400" cy="250" r="120" fill="#FDBCB4"/>
          
          {/* Hair */}
          <path d="M 280 180 Q 400 120 520 180 Q 450 160 400 170 Q 350 160 280 180" fill="#D3D3D3"/>
          
          {/* Eyes with pain */}
          <circle cx="350" cy="220" r="15" fill="#FFF"/>
          <circle cx="450" cy="220" r="15" fill="#FFF"/>
          <circle cx="350" cy="220" r="8" fill="#000"/>
          <circle cx="450" cy="220" r="8" fill="#000"/>
          
          {/* Eyebrows showing stress */}
          <path d="M 330 200 Q 350 190 370 200" stroke="#8B4513" strokeWidth="4" fill="none"/>
          <path d="M 430 200 Q 450 190 470 200" stroke="#8B4513" strokeWidth="4" fill="none"/>
          
          {/* Forced smile */}
          <path d="M 350 290 Q 400 310 450 290" stroke="#000" strokeWidth="6" fill="none"/>
          
          {/* Body */}
          <rect x="320" y="370" width="160" height="180" fill="#4169E1"/>
          
          {/* Vet bill in hand */}
          <rect x="500" y="300" width="120" height="80" fill="white" stroke="#000" strokeWidth="2"/>
          <text x="520" y="325" fontSize="14" fontWeight="bold" fill="#000">VET BILL</text>
          <text x="530" y="345" fontSize="20" fontWeight="bold" fill="#FF0000">$247.50</text>
          <text x="520" y="365" fontSize="10" fill="#000">Routine check-up</text>
          
          {/* Thought bubble */}
          <ellipse cx="200" cy="150" rx="140" ry="80" fill="white" stroke="#000" strokeWidth="2"/>
          <circle cx="280" cy="200" r="10" fill="white" stroke="#000" strokeWidth="1"/>
          <circle cx="300" cy="220" r="6" fill="white" stroke="#000" strokeWidth="1"/>
          
          <text x="120" y="135" fontSize="16" fontWeight="bold" fill="#000">
            "Pet Care AI would have
          </text>
          <text x="130" y="155" fontSize="16" fontWeight="bold" fill="#000">
            told me this for free..."
          </text>
          
          <text x="400" y="580" fontSize="20" fontWeight="bold" fill="#000" textAnchor="middle">
            Realizing AI could have prevented this
          </text>
        </svg>
      )
    },
    {
      id: 12,
      title: "Animated Loading Cat",
      format: "GIF-style Animation",
      platform: ["TikTok", "Instagram", "Twitter"],
      engagement: "High",
      caption: "Pet Care AI analyzing your pet's mood be like... 🔄 #PetCareAI #Loading #CatAnalysis",
      hashtags: "#PetCareAI #LoadingCat #AIAnalysis #PetMoodDetection",
      component: (
        <svg id="meme-12" viewBox="0 0 800 600" className="w-full h-auto border rounded">
          <rect width="800" height="600" fill="#1a1a2e"/>
          
          {/* Screen effect */}
          <rect x="100" y="100" width="600" height="400" fill="#000" stroke="#4169E1" strokeWidth="4" rx="20"/>
          <rect x="120" y="120" width="560" height="360" fill="#0a0a0a"/>
          
          {/* Cat silhouette */}
          <ellipse cx="400" cy="350" rx="80" ry="60" fill="#333"/>
          <circle cx="400" cy="280" r="50" fill="#333"/>
          <path d="M 360 240 L 370 220 L 380 240" fill="#333"/>
          <path d="M 420 240 L 430 220 L 440 240" fill="#333"/>
          <circle cx="380" cy="270" r="4" fill="#00FF00"/>
          <circle cx="420" cy="270" r="4" fill="#00FF00"/>
          
          {/* Scanning lines animation effect */}
          <g className="animate-pulse">
            <rect x="120" y="180" width="560" height="2" fill="#00FF00" opacity="0.8"/>
            <rect x="120" y="220" width="560" height="1" fill="#00FF00" opacity="0.6"/>
            <rect x="120" y="260" width="560" height="2" fill="#00FF00" opacity="0.8"/>
            <rect x="120" y="300" width="560" height="1" fill="#00FF00" opacity="0.6"/>
            <rect x="120" y="340" width="560" height="2" fill="#00FF00" opacity="0.8"/>
            <rect x="120" y="380" width="560" height="1" fill="#00FF00" opacity="0.6"/>
            <rect x="120" y="420" width="560" height="2" fill="#00FF00" opacity="0.8"/>
          </g>
          
          {/* Status text */}
          <text x="400" y="150" fontSize="24" fontWeight="bold" fill="#00FF00" textAnchor="middle">
            PET CARE AI ANALYZING...
          </text>
          
          {/* Progress bar */}
          <rect x="200" y="520" width="400" height="20" fill="#333" stroke="#00FF00" strokeWidth="2"/>
          <rect x="202" y="522" width="300" height="16" fill="#00FF00">
            <animate attributeName="width" values="0;396;396" dur="3s" repeatCount="indefinite"/>
          </rect>
          
          {/* Loading percentage */}
          <text x="400" y="560" fontSize="18" fontWeight="bold" fill="#00FF00" textAnchor="middle">
            MOOD DETECTION: 85% COMPLETE
          </text>
          
          {/* Binary background */}
          <text x="50" y="200" fontSize="10" fill="#004400" opacity="0.3">01101001</text>
          <text x="50" y="250" fontSize="10" fill="#004400" opacity="0.3">11010110</text>
          <text x="50" y="300" fontSize="10" fill="#004400" opacity="0.3">01011101</text>
          <text x="700" y="200" fontSize="10" fill="#004400" opacity="0.3">10110010</text>
          <text x="700" y="250" fontSize="10" fill="#004400" opacity="0.3">01101011</text>
          <text x="700" y="300" fontSize="10" fill="#004400" opacity="0.3">11010101</text>
        </svg>
      )
    },
    {
      id: 13,
      title: "Stonks Guy - Pet Care Success",
      format: "Stonks Meme",
      platform: ["Reddit", "Twitter", "Instagram"],
      engagement: "High",
      caption: "When Pet Care AI improves your pet parenting skills 📈 #PetCareAI #Stonks #PetParentWin",
      hashtags: "#PetCareAI #Stonks #PetParentSuccess #AIWins",
      component: (
        <svg id="meme-13" viewBox="0 0 800 600" className="w-full h-auto border rounded">
          <rect width="800" height="600" fill="#1a1a2e"/>
          
          {/* Background pattern */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#333" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="800" height="600" fill="url(#grid)"/>
          
          {/* Stonks guy */}
          <circle cx="400" cy="250" r="100" fill="#FDBCB4"/>
          
          {/* Hair */}
          <path d="M 300 200 Q 400 150 500 200 Q 450 180 400 190 Q 350 180 300 200" fill="#8B4513"/>
          
          {/* Eyes */}
          <circle cx="360" cy="230" r="12" fill="#FFF"/>
          <circle cx="440" cy="230" r="12" fill="#FFF"/>
          <circle cx="360" cy="230" r="6" fill="#000"/>
          <circle cx="440" cy="230" r="6" fill="#000"/>
          
          {/* Mouth */}
          <path d="M 360 280 Q 400 300 440 280" stroke="#000" strokeWidth="4" fill="none"/>
          
          {/* Body */}
          <rect x="320" y="350" width="160" height="200" fill="#4169E1"/>
          
          {/* Chart in background */}
          <rect x="100" y="100" width="200" height="150" fill="#000" stroke="#00FF00" strokeWidth="2"/>
          <path d="M 120 220 L 150 200 L 180 180 L 210 160 L 240 140 L 270 120" stroke="#00FF00" strokeWidth="4" fill="none"/>
          
          {/* Chart in hands */}
          <rect x="500" y="400" width="120" height="80" fill="#FFF" stroke="#000" strokeWidth="2"/>
          <path d="M 520 460 L 540 450 L 560 440 L 580 430 L 600 420" stroke="#00FF00" strokeWidth="3" fill="none"/>
          
          {/* Text */}
          <text x="400" y="80" fontSize="36" fontWeight="bold" fill="#00FF00" textAnchor="middle">
            PET CARE
          </text>
          <text x="400" y="550" fontSize="28" fontWeight="bold" fill="#00FF00" textAnchor="middle">
            STONKS ↗
          </text>
          
          {/* Arrow pointing up */}
          <path d="M 650 200 L 650 150 L 680 180 L 650 150 L 620 180 Z" fill="#00FF00"/>
        </svg>
      )
    },
    {
      id: 14,
      title: "Chad vs Virgin - Pet Care",
      format: "Chad vs Virgin",
      platform: ["Reddit", "Instagram", "Twitter"],
      engagement: "Medium",
      caption: "The virgin manual pet care vs the Chad Pet Care AI user 💪 #PetCareAI #ChadVirgin #PetParentLevel",
      hashtags: "#PetCareAI #ChadVirgin #PetParentGlowUp #AISuperiority",
      component: (
        <svg id="meme-14" viewBox="0 0 800 600" className="w-full h-auto border rounded">
          <rect width="800" height="600" fill="#F0F8FF"/>
          
          {/* Virgin side */}
          <rect x="0" y="0" width="400" height="600" fill="#FFE4E1"/>
          
          {/* Virgin character */}
          <circle cx="200" cy="150" r="40" fill="#FDBCB4"/>
          <rect x="180" y="190" width="40" height="80" fill="#808080"/>
          <circle cx="185" cy="140" r="3" fill="#000"/>
          <circle cx="215" cy="140" r="3" fill="#000"/>
          <path d="M 185 160 Q 200 150 215 160" stroke="#000" strokeWidth="2" fill="none"/>
          
          {/* Virgin traits */}
          <text x="20" y="50" fontSize="16" fontWeight="bold" fill="#000">The Virgin Manual Pet Care:</text>
          <text x="20" y="80" fontSize="12" fill="#000">• Googles symptoms for hours</text>
          <text x="20" y="100" fontSize="12" fill="#000">• Still confused about pet needs</text>
          <text x="20" y="120" fontSize="12" fill="#000">• Expensive vet visits for minor issues</text>
          <text x="20" y="300" fontSize="12" fill="#000">• Reads 50 articles, gets 50 answers</text>
          <text x="20" y="320" fontSize="12" fill="#000">• Overthinks every pet behavior</text>
          <text x="20" y="340" fontSize="12" fill="#000">• Panics at 3 AM about pet health</text>
          
          {/* Chad side */}
          <rect x="400" y="0" width="400" height="600" fill="#E6FFE6"/>
          
          {/* Chad character */}
          <circle cx="600" cy="150" r="50" fill="#FDBCB4"/>
          <rect x="570" y="200" width="60" height="100" fill="#FF6B6B"/>
          <circle cx="580" cy="135" r="4" fill="#000"/>
          <circle cx="620" cy="135" r="4" fill="#000"/>
          <path d="M 570 165 Q 600 175 630 165" stroke="#000" strokeWidth="3" fill="none"/>
          
          {/* Chad jaw */}
          <rect x="580" y="180" width="40" height="20" fill="#FDBCB4"/>
          
          {/* Chad traits */}
          <text x="420" y="50" fontSize="16" fontWeight="bold" fill="#000">The Chad Pet Care AI User:</text>
          <text x="420" y="80" fontSize="12" fill="#000">• Instant pet mood analysis</text>
          <text x="420" y="100" fontSize="12" fill="#000">• Knows exactly what pet needs</text>
          <text x="420" y="120" fontSize="12" fill="#000">• Prevents problems before they happen</text>
          <text x="420" y="300" fontSize="12" fill="#000">• One app, all the answers</text>
          <text x="420" y="320" fontSize="12" fill="#000">• Confident pet parenting</text>
          <text x="420" y="340" fontSize="12" fill="#000">• Sleeps peacefully knowing AI monitors</text>
          
          {/* VS in middle */}
          <text x="400" y="300" fontSize="24" fontWeight="bold" fill="#000" textAnchor="middle">VS</text>
        </svg>
      )
    },
    {
      id: 15,
      title: "Doge Much Wow - Pet Care",
      format: "Doge Meme",
      platform: ["Instagram", "Twitter", "TikTok"],
      engagement: "High",
      caption: "Such analysis. Much accurate. Very pet care. Wow. 🐕 #PetCareAI #Doge #MuchWow",
      hashtags: "#PetCareAI #Doge #MuchWow #SuchAnalysis #VeryAccurate",
      component: (
        <svg id="meme-15" viewBox="0 0 800 600" className="w-full h-auto border rounded">
          <rect width="800" height="600" fill="#FFE4B5"/>
          
          {/* Doge */}
          <ellipse cx="400" cy="350" rx="150" ry="120" fill="#D2691E"/>
          <circle cx="400" cy="250" r="100" fill="#D2691E"/>
          
          {/* Ears */}
          <ellipse cx="330" cy="180" rx="30" ry="60" fill="#D2691E" transform="rotate(-30 330 180)"/>
          <ellipse cx="470" cy="180" rx="30" ry="60" fill="#D2691E" transform="rotate(30 470 180)"/>
          <ellipse cx="330" cy="185" rx="15" ry="30" fill="#8B4513" transform="rotate(-30 330 185)"/>
          <ellipse cx="470" cy="185" rx="15" ry="30" fill="#8B4513" transform="rotate(30 470 185)"/>
          
          {/* Eyes */}
          <ellipse cx="370" cy="230" rx="15" ry="20" fill="#000"/>
          <ellipse cx="430" cy="230" rx="15" ry="20" fill="#000"/>
          <circle cx="375" cy="225" r="4" fill="#FFF"/>
          <circle cx="435" cy="225" r="4" fill="#FFF"/>
          
          {/* Nose */}
          <ellipse cx="400" cy="270" rx="8" ry="6" fill="#000"/>
          
          {/* Mouth */}
          <path d="M 380 290 Q 400 310 420 290" stroke="#000" strokeWidth="3" fill="none"/>
          
          {/* Chest */}
          <ellipse cx="400" cy="380" rx="80" ry="60" fill="#F4A460"/>
          
          {/* Doge text scattered around */}
          <text x="100" y="150" fontSize="24" fontWeight="bold" fill="#FF6B6B" transform="rotate(-15 100 150)">
            such analysis
          </text>
          <text x="600" y="180" fontSize="20" fontWeight="bold" fill="#4169E1" transform="rotate(10 600 180)">
            very accurate
          </text>
          <text x="150" y="450" fontSize="22" fontWeight="bold" fill="#32CD32" transform="rotate(-10 150 450)">
            much pet care
          </text>
          <text x="550" y="500" fontSize="26" fontWeight="bold" fill="#FF4500" transform="rotate(15 550 500)">
            wow
          </text>
          <text x="100" y="350" fontSize="18" fontWeight="bold" fill="#9370DB" transform="rotate(-20 100 350)">
            so smart
          </text>
          <text x="600" y="350" fontSize="20" fontWeight="bold" fill="#DC143C" transform="rotate(12 600 350)">
            many insights
          </text>
        </svg>
      )
    },
    {
      id: 16,
      title: "Animated Typing Cat - AI Analysis",
      format: "GIF-style Animation",
      platform: ["TikTok", "Instagram", "Twitter"],
      engagement: "High",
      caption: "Pet Care AI analyzing your cat's mood in real-time... 🔍 #PetCareAI #CatAnalysis #AIInProgress",
      hashtags: "#PetCareAI #CatAnalysis #AIAnalysis #RealTimeAnalysis",
      component: (
        <svg id="meme-16" viewBox="0 0 800 600" className="w-full h-auto border rounded">
          <rect width="800" height="600" fill="#2F4F4F"/>
          
          {/* Terminal window */}
          <rect x="50" y="50" width="700" height="500" fill="#000" stroke="#4169E1" strokeWidth="2" rx="10"/>
          <rect x="50" y="50" width="700" height="30" fill="#4169E1"/>
          <circle cx="80" cy="65" r="6" fill="#FF6B6B"/>
          <circle cx="100" cy="65" r="6" fill="#FFD700"/>
          <circle cx="120" cy="65" r="6" fill="#32CD32"/>
          
          {/* Cat ASCII art */}
          <text x="80" y="120" fontSize="12" fontFamily="monospace" fill="#00FF00">
            {`     /\\_/\\  `}
          </text>
          <text x="80" y="140" fontSize="12" fontFamily="monospace" fill="#00FF00">
            {`    ( o.o ) `}
          </text>
          <text x="80" y="160" fontSize="12" fontFamily="monospace" fill="#00FF00">
            {`     > ^ <  `}
          </text>
          
          {/* Typing animation */}
          <text x="80" y="200" fontSize="14" fontFamily="monospace" fill="#00FF00">
            $ pet-care-ai analyze --species=cat --image=upload.jpg
          </text>
          <text x="80" y="220" fontSize="14" fontFamily="monospace" fill="#00FF00">
            Loading AI model...
          </text>
          <text x="80" y="240" fontSize="14" fontFamily="monospace" fill="#00FF00">
            Processing image data...
          </text>
          <text x="80" y="260" fontSize="14" fontFamily="monospace" fill="#00FF00">
            Analyzing facial expressions...
          </text>
          
          {/* Blinking cursor */}
          <rect x="300" y="265" width="10" height="15" fill="#00FF00" className="animate-pulse"/>
          
          {/* Progress indicators */}
          <text x="80" y="300" fontSize="12" fontFamily="monospace" fill="#FFD700">
            [████████████████████████████████] 100%
          </text>
          <text x="80" y="320" fontSize="12" fontFamily="monospace" fill="#32CD32">
            Analysis complete!
          </text>
          
          {/* Results */}
          <text x="80" y="360" fontSize="14" fontFamily="monospace" fill="#00FF00">
            RESULTS:
          </text>
          <text x="80" y="380" fontSize="12" fontFamily="monospace" fill="#FFD700">
            Mood: Content (87% confidence)
          </text>
          <text x="80" y="400" fontSize="12" fontFamily="monospace" fill="#FFD700">
            Energy Level: Relaxed
          </text>
          <text x="80" y="420" fontSize="12" fontFamily="monospace" fill="#FFD700">
            Health Indicators: Normal
          </text>
          <text x="80" y="440" fontSize="12" fontFamily="monospace" fill="#FFD700">
            Recommendations: Continue current care routine
          </text>
          
          {/* Matrix-style background */}
          <text x="600" y="120" fontSize="8" fontFamily="monospace" fill="#004400" opacity="0.3">
            01010101
          </text>
          <text x="600" y="140" fontSize="8" fontFamily="monospace" fill="#004400" opacity="0.3">
            11001100
          </text>
          <text x="600" y="160" fontSize="8" fontFamily="monospace" fill="#004400" opacity="0.3">
            10101010
          </text>
        </svg>
      )
    },
    {
      id: 17,
      title: "Lisa Simpson Presentation - Pet Facts",
      format: "Lisa Simpson Facts",
      platform: ["Instagram", "Twitter", "Reddit"],
      engagement: "Medium",
      caption: "Important pet care facts that Pet Care AI taught me 📊 #PetCareAI #PetFacts #LisaSimpson",
      hashtags: "#PetCareAI #PetFacts #LisaSimpsonMeme #PetEducation",
      component: (
        <svg id="meme-17" viewBox="0 0 800 600" className="w-full h-auto border rounded">
          <rect width="800" height="600" fill="#87CEEB"/>
          
          {/* Classroom background */}
          <rect x="0" y="400" width="800" height="200" fill="#8B4513"/>
          <rect x="0" y="200" width="800" height="200" fill="#F5DEB3"/>
          
          {/* Presentation screen */}
          <rect x="450" y="150" width="300" height="200" fill="#FFF" stroke="#000" strokeWidth="3"/>
          
          {/* Lisa Simpson */}
          <circle cx="200" cy="300" r="50" fill="#FFD700"/>
          <rect x="175" y="350" width="50" height="100" fill="#FF6B6B"/>
          <rect x="165" y="450" width="25" height="50" fill="#4169E1"/>
          <rect x="210" y="450" width="25" height="50" fill="#4169E1"/>
          
          {/* Hair spikes */}
          <path d="M 160 280 L 150 260 L 170 270" fill="#FFD700"/>
          <path d="M 180 270 L 170 250 L 190 260" fill="#FFD700"/>
          <path d="M 200 270 L 190 250 L 210 260" fill="#FFD700"/>
          <path d="M 220 270 L 210 250 L 230 260" fill="#FFD700"/>
          <path d="M 240 280 L 250 260 L 230 270" fill="#FFD700"/>
          
          {/* Eyes */}
          <circle cx="180" cy="290" r="8" fill="#FFF"/>
          <circle cx="220" cy="290" r="8" fill="#FFF"/>
          <circle cx="180" cy="290" r="4" fill="#000"/>
          <circle cx="220" cy="290" r="4" fill="#000"/>
          
          {/* Mouth */}
          <ellipse cx="200" cy="310" rx="8" ry="5" fill="#000"/>
          
          {/* Pointing finger */}
          <rect x="250" y="320" width="60" height="10" fill="#FFD700"/>
          <circle cx="310" cy="325" r="8" fill="#FFD700"/>
          
          {/* Presentation content */}
          <text x="600" y="200" fontSize="16" fontWeight="bold" fill="#000" textAnchor="middle">
            PET CARE FACTS
          </text>
          <text x="470" y="230" fontSize="12" fill="#000">
            • 68% of pet behaviors are
          </text>
          <text x="480" y="250" fontSize="12" fill="#000">
            misunderstood by owners
          </text>
          <text x="470" y="280" fontSize="12" fill="#000">
            • AI can detect mood changes
          </text>
          <text x="480" y="300" fontSize="12" fill="#000">
            3 days before symptoms
          </text>
          <text x="470" y="330" fontSize="12" fill="#000">
            • Early detection prevents
          </text>
          <text x="480" y="350" fontSize="12" fill="#000">
            80% of health issues
          </text>
          
          {/* Speech bubble */}
          <ellipse cx="300" cy="200" rx="120" ry="60" fill="white" stroke="#000" strokeWidth="2"/>
          <text x="220" y="190" fontSize="14" fontWeight="bold" fill="#000">
            "Pet Care AI reveals the
          </text>
          <text x="230" y="210" fontSize="14" fontWeight="bold" fill="#000">
            science behind every
          </text>
          <text x="250" y="230" fontSize="14" fontWeight="bold" fill="#000">
            pet behavior!"
          </text>
        </svg>
      )
    },
    {
      id: 18,
      title: "Animated Progress Bar - Pet Health",
      format: "GIF-style Loading",
      platform: ["Instagram", "TikTok", "Twitter"],
      engagement: "High",
      caption: "Pet Care AI upgrading your pet parenting skills... 📈 #PetCareAI #UpgradeInProgress #PetParentLevel",
      hashtags: "#PetCareAI #UpgradeInProgress #PetParentLevel #SkillsUpgrade",
      component: (
        <svg id="meme-18" viewBox="0 0 800 600" className="w-full h-auto border rounded">
          <rect width="800" height="600" fill="#1a1a2e"/>
          
          {/* Game-style interface */}
          <rect x="100" y="100" width="600" height="400" fill="#2a2a4e" stroke="#4169E1" strokeWidth="3" rx="15"/>
          
          {/* Title */}
          <text x="400" y="150" fontSize="32" fontWeight="bold" fill="#FFD700" textAnchor="middle">
            PET PARENT LEVEL UP!
          </text>
          
          {/* Character icon */}
          <rect x="150" y="200" width="100" height="100" fill="#4169E1" rx="10"/>
          <text x="200" y="260" fontSize="40" fill="#FFF" textAnchor="middle">👤</text>
          
          {/* Stats */}
          <text x="300" y="230" fontSize="18" fontWeight="bold" fill="#FFF">
            Pet Understanding: 
          </text>
          <rect x="300" y="240" width="300" height="20" fill="#333" stroke="#FFF" strokeWidth="1"/>
          <rect x="302" y="242" width="250" height="16" fill="#32CD32">
            <animate attributeName="width" values="50;296;296" dur="3s" repeatCount="indefinite"/>
          </rect>
          <text x="610" y="254" fontSize="14" fill="#32CD32">85%</text>
          
          <text x="300" y="280" fontSize="18" fontWeight="bold" fill="#FFF">
            Care Efficiency: 
          </text>
          <rect x="300" y="290" width="300" height="20" fill="#333" stroke="#FFF" strokeWidth="1"/>
          <rect x="302" y="292" width="270" height="16" fill="#FFD700">
            <animate attributeName="width" values="30;296;296" dur="3.5s" repeatCount="indefinite"/>
          </rect>
          <text x="610" y="304" fontSize="14" fill="#FFD700">92%</text>
          
          <text x="300" y="330" fontSize="18" fontWeight="bold" fill="#FFF">
            Stress Reduction: 
          </text>
          <rect x="300" y="340" width="300" height="20" fill="#333" stroke="#FFF" strokeWidth="1"/>
          <rect x="302" y="342" width="290" height="16" fill="#FF6B6B">
            <animate attributeName="width" values="70;296;296" dur="2.5s" repeatCount="indefinite"/>
          </rect>
          <text x="610" y="354" fontSize="14" fill="#FF6B6B">98%</text>
          
          {/* Achievement unlocked */}
          <text x="400" y="420" fontSize="24" fontWeight="bold" fill="#FFD700" textAnchor="middle">
            🏆 ACHIEVEMENT UNLOCKED 🏆
          </text>
          <text x="400" y="450" fontSize="18" fill="#FFF" textAnchor="middle">
            "AI-Powered Pet Parent"
          </text>
          
          {/* Sparkle effects */}
          <circle cx="150" cy="150" r="3" fill="#FFD700" className="animate-pulse"/>
          <circle cx="650" cy="180" r="2" fill="#4169E1" className="animate-pulse"/>
          <circle cx="120" cy="350" r="4" fill="#32CD32" className="animate-pulse"/>
          <circle cx="680" cy="400" r="3" fill="#FF6B6B" className="animate-pulse"/>
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Viral Marketing Memes</h2>
        <p className="text-muted-foreground">
          Ready-to-use funny memes for your Pet Care AI social media campaigns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {memes.map((meme) => (
          <Card key={meme.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{meme.title}</CardTitle>
                <Badge variant={meme.engagement === "High" ? "default" : meme.engagement === "Medium" ? "secondary" : "outline"}>
                  {meme.engagement} Engagement
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {meme.platform.map((platform) => (
                  <Badge key={platform} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full max-w-md mx-auto">
                {meme.component}
              </div>
              
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium text-sm mb-1">Suggested Caption:</h4>
                  <p className="text-sm bg-muted p-2 rounded">{meme.caption}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-1">Hashtags:</h4>
                  <p className="text-xs text-muted-foreground">{meme.hashtags}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => copyToClipboard(meme.caption, "Caption")}
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Caption
                </Button>
                <Button 
                  onClick={() => downloadMeme(meme.id, meme.title)}
                  variant="outline" 
                  size="sm"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}