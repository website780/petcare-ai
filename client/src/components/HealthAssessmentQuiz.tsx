import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, ActivitySquare } from "lucide-react";
import { Pet } from "@shared/schema";

interface HealthAssessmentQuizProps {
  pet: Pet;
}

interface Question {
  id: string;
  text: string;
  type: "radio" | "checkbox" | "textarea";
  options?: {
    value: string;
    label: string;
    riskScore: number;
  }[];
}

const questions: Question[] = [
  {
    id: "appetite",
    text: "How is your pet's appetite lately?",
    type: "radio",
    options: [
      { value: "normal", label: "Normal/Good", riskScore: 0 },
      { value: "increased", label: "Increased significantly", riskScore: 1 },
      { value: "decreased", label: "Decreased significantly", riskScore: 2 },
      { value: "none", label: "Not eating at all", riskScore: 3 },
    ],
  },
  {
    id: "energy",
    text: "How would you describe your pet's energy level?",
    type: "radio",
    options: [
      { value: "normal", label: "Normal/Playful", riskScore: 0 },
      { value: "hyperactive", label: "Unusually hyperactive", riskScore: 1 },
      { value: "lethargic", label: "Lethargic/Low energy", riskScore: 2 },
      { value: "none", label: "Cannot/unwilling to move much", riskScore: 3 },
    ],
  },
  {
    id: "behavior",
    text: "Have you noticed any changes in behavior?",
    type: "radio",
    options: [
      { value: "no", label: "No changes", riskScore: 0 },
      { value: "slight", label: "Slight changes", riskScore: 1 },
      { value: "noticeable", label: "Noticeable changes", riskScore: 2 },
      { value: "significant", label: "Significant changes", riskScore: 3 },
    ],
  },
  {
    id: "bathroom",
    text: "Any changes in bathroom habits?",
    type: "radio",
    options: [
      { value: "normal", label: "Normal", riskScore: 0 },
      { value: "slight", label: "Slight changes", riskScore: 1 },
      { value: "frequent", label: "Much more/less frequent", riskScore: 2 },
      { value: "issues", label: "Having accidents/visible issues", riskScore: 3 },
    ],
  },
  {
    id: "physical",
    text: "Have you noticed any physical changes?",
    type: "radio",
    options: [
      { value: "none", label: "No changes", riskScore: 0 },
      { value: "minor", label: "Minor changes (e.g., small weight change)", riskScore: 1 },
      { value: "noticeable", label: "Noticeable changes", riskScore: 2 },
      { value: "severe", label: "Severe changes", riskScore: 3 },
    ],
  },
  {
    id: "symptoms",
    text: "Are you noticing any of these specific symptoms? (Select all that apply)",
    type: "checkbox",
    options: [
      { value: "vomiting", label: "Vomiting", riskScore: 2 },
      { value: "diarrhea", label: "Diarrhea", riskScore: 2 },
      { value: "limping", label: "Limping or difficulty walking", riskScore: 2 },
      { value: "scratching", label: "Excessive scratching or itching", riskScore: 1 },
      { value: "coughing", label: "Coughing or breathing issues", riskScore: 2 },
      { value: "other", label: "Other concerning symptoms", riskScore: 1 },
      { value: "none", label: "None of the above", riskScore: 0 },
    ],
  },
  {
    id: "notes",
    text: "Additional notes or concerns (optional)",
    type: "textarea",
  },
];

interface Results {
  riskLevel: "low" | "moderate" | "high" | "severe";
  healthScore: number; // percentage score (0-100)
  recommendations: string[];
  notes?: string;
}

function calculateResults(answers: Record<string, string | string[]>, notes?: string): Results {
  let totalScore = 0;
  let maxPossibleScore = 0;
  let answeredQuestions = 0;

  questions.forEach((question) => {
    if (question.type === "textarea") return; // Skip notes question
    
    const answer = answers[question.id];
    
    if (question.type === "checkbox" && Array.isArray(answer)) {
      // Handle checkbox questions (symptoms)
      if (answer.length > 0) {
        answeredQuestions++;
        let questionScore = 0;
        let questionMaxScore = 0;
        
        answer.forEach((selectedValue) => {
          const option = question.options?.find((opt) => opt.value === selectedValue);
          if (option) {
            questionScore += option.riskScore;
          }
        });
        
        // For symptoms, max score is the highest individual symptom risk
        questionMaxScore = Math.max(...(question.options?.map(opt => opt.riskScore) || [0]));
        
        totalScore += Math.min(questionScore, questionMaxScore);
        maxPossibleScore += questionMaxScore;
      }
    } else if (question.type === "radio" && typeof answer === "string" && answer) {
      // Handle radio questions
      const option = question.options?.find((opt) => opt.value === answer);
      if (option) {
        totalScore += option.riskScore;
        answeredQuestions++;
      }
      maxPossibleScore += Math.max(...(question.options?.map(opt => opt.riskScore) || [0]));
    }
  });

  // Calculate health score as percentage (lower risk = higher health score)
  const healthScore = maxPossibleScore > 0 ? Math.round(((maxPossibleScore - totalScore) / maxPossibleScore) * 100) : 100;
  const averageScore = answeredQuestions > 0 ? totalScore / answeredQuestions : 0;

  let riskLevel: Results["riskLevel"];
  let recommendations: string[] = [];

  if (averageScore <= 0.5) {
    riskLevel = "low";
    recommendations = [
      "Continue with regular veterinary check-ups",
      "Maintain current diet and exercise routine",
      "Monitor for any changes in behavior or health",
    ];
  } else if (averageScore <= 1.5) {
    riskLevel = "moderate";
    recommendations = [
      "Schedule a check-up with your veterinarian",
      "Keep a daily log of symptoms or changes",
      "Review and possibly adjust diet and exercise",
      "Monitor water intake and bathroom habits",
    ];
  } else if (averageScore <= 2.5) {
    riskLevel = "high";
    recommendations = [
      "Contact your veterinarian soon",
      "Take detailed notes of all symptoms",
      "Consider dietary restrictions if recommended",
      "Monitor vital signs if possible",
      "Prepare for possible medical intervention",
    ];
  } else {
    riskLevel = "severe";
    recommendations = [
      "Seek immediate veterinary care",
      "Keep your pet comfortable and calm",
      "Monitor closely for worsening symptoms",
      "Prepare for emergency veterinary visit",
      "Consider restricting movement/activity",
    ];
  }

  return { riskLevel, healthScore, recommendations, notes };
}

export function HealthAssessmentQuiz({ pet }: HealthAssessmentQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [notes, setNotes] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: value,
    }));
  };

  const handleCheckboxAnswer = (value: string, checked: boolean) => {
    setAnswers((prev) => {
      const currentAnswers = Array.isArray(prev[questions[currentQuestion].id]) 
        ? prev[questions[currentQuestion].id] as string[]
        : [];
      
      if (value === "none") {
        // If "none" is selected, clear all other selections
        return {
          ...prev,
          [questions[currentQuestion].id]: checked ? ["none"] : [],
        };
      } else {
        // If any other option is selected, remove "none"
        const filteredAnswers = currentAnswers.filter(a => a !== "none");
        
        if (checked) {
          return {
            ...prev,
            [questions[currentQuestion].id]: [...filteredAnswers, value],
          };
        } else {
          return {
            ...prev,
            [questions[currentQuestion].id]: filteredAnswers.filter(a => a !== value),
          };
        }
      }
    });
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
  };

  const getIsNextDisabled = () => {
    const question = questions[currentQuestion];
    const answer = answers[question.id];
    
    if (question.type === "radio") {
      return !answer;
    } else if (question.type === "checkbox") {
      return !Array.isArray(answer) || answer.length === 0;
    } else if (question.type === "textarea") {
      // Notes are optional, so never disable for textarea
      return false;
    }
    
    return false;
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const quizResults = calculateResults(answers, notes);
      setResults(quizResults);
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setNotes("");
    setShowResults(false);
    setResults(null);
  };

  const getRiskLevelColor = (level: Results["riskLevel"]) => {
    switch (level) {
      case "low":
        return "text-green-500";
      case "moderate":
        return "text-yellow-500";
      case "high":
        return "text-orange-500";
      case "severe":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full h-14 rounded-2xl border-black/[0.08] hover:border-[#ff6b4a]/40 hover:bg-[#ff6b4a]/5 group transition-all"
        >
          <ActivitySquare className="mr-3 h-5 w-5 text-[#ff6b4a] group-hover:scale-110 transition-transform" />
          <span className="font-black tracking-tight">Initiate Health Diagnostic</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl flex flex-col">
        <div className="bg-gradient-to-r from-[#ff6b4a] to-orange-400 h-1.5 shrink-0" />
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          <DialogHeader className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff6b4a]">
                {showResults ? "Diagnostic Output" : `Module ${currentQuestion + 1} of ${questions.length}`}
              </div>
              {!showResults && (
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div key={i} className={`w-6 h-1 rounded-full transition-all ${i === currentQuestion ? 'bg-[#ff6b4a]' : i < currentQuestion ? 'bg-[#ff6b4a]/20' : 'bg-black/5'}`} />
                  ))}
                </div>
              )}
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight">
              {showResults ? "Health Assessment" : questions[currentQuestion].text}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {!showResults ? (
              <div className="space-y-6">
                {questions[currentQuestion].type === "radio" && (
                  <RadioGroup
                    value={answers[questions[currentQuestion].id] as string}
                    onValueChange={handleAnswer}
                    className="grid gap-3"
                  >
                    {questions[currentQuestion].options?.map((option) => (
                      <div key={option.value}>
                        <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                        <Label
                          htmlFor={option.value}
                          className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                            answers[questions[currentQuestion].id] === option.value
                              ? 'border-[#ff6b4a] bg-[#ff6b4a]/5 shadow-sm'
                              : 'border-black/[0.04] hover:border-black/[0.1] bg-white'
                          }`}
                        >
                          <span className="font-bold text-sm">{option.label}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            answers[questions[currentQuestion].id] === option.value
                              ? 'border-[#ff6b4a] bg-[#ff6b4a]'
                              : 'border-black/10'
                          }`}>
                            {answers[questions[currentQuestion].id] === option.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                {questions[currentQuestion].type === "checkbox" && (
                  <div className="grid gap-3">
                    {questions[currentQuestion].options?.map((option) => {
                      const currentAnswers = Array.isArray(answers[questions[currentQuestion].id])
                        ? answers[questions[currentQuestion].id] as string[]
                        : [];
                      const isChecked = currentAnswers.includes(option.value);
                      
                      return (
                        <div key={option.value}>
                          <Checkbox
                            id={option.value}
                            checked={isChecked}
                            onCheckedChange={(checked) => handleCheckboxAnswer(option.value, !!checked)}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={option.value}
                            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                              isChecked
                                ? 'border-[#ff6b4a] bg-[#ff6b4a]/5 shadow-sm'
                                : 'border-black/[0.04] hover:border-black/[0.1] bg-white'
                            }`}
                          >
                            <span className="font-bold text-sm">{option.label}</span>
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                              isChecked
                                ? 'border-[#ff6b4a] bg-[#ff6b4a]'
                                : 'border-black/10'
                            }`}>
                              {isChecked && <div className="w-2 h-2 bg-white rounded-[2px]" />}
                            </div>
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {questions[currentQuestion].type === "textarea" && (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Describe additional nuances here..."
                      value={notes}
                      onChange={(e) => handleNotesChange(e.target.value)}
                      className="min-h-[150px] rounded-2xl border-black/[0.08] focus-visible:ring-[#ff6b4a] transition-all p-4 font-medium"
                    />
                    <div className="p-4 rounded-2xl bg-muted/50 border border-black/[0.02]">
                       <p className="text-[10px] font-black uppercase text-muted-foreground leading-relaxed">
                          Clinical Note: This data will be ingested for longitudinal tracking.
                       </p>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-4 pt-4">
                  {currentQuestion > 0 && (
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentQuestion((prev) => prev - 1)}
                      className="flex-1 h-12 rounded-xl font-black text-xs uppercase tracking-widest"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    disabled={getIsNextDisabled()}
                    className="flex-[2] h-12 rounded-xl bg-black hover:bg-black/90 font-black text-xs uppercase tracking-widest text-white transition-all shadow-lg"
                  >
                    {currentQuestion === questions.length - 1 ? "Extract Intelligence" : "Next Module"}
                  </Button>
                </div>
              </div>
            ) : results ? (
              <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex items-center justify-between p-6 rounded-3xl bg-black text-white shadow-xl">
                   <div>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Vitality Score</div>
                      <div className="text-4xl font-black">{results.healthScore}%</div>
                   </div>
                   <div className="flex flex-col items-end">
                      <div className={`p-2 rounded-xl bg-white/10 flex items-center gap-2 mb-2`}>
                        <AlertTriangle className={`h-4 w-4 ${getRiskLevelColor(results.riskLevel)}`} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{results.riskLevel} Track</span>
                      </div>
                      <div className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">Status: Calculated</div>
                   </div>
                </div>
                
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff6b4a]">Recommended Protocols</h5>
                  <div className="grid gap-2">
                    {results.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 rounded-2xl bg-black/[0.02] border border-black/[0.04]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b4a]" />
                        <span className="text-xs font-bold leading-tight">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {results.notes && results.notes.trim() && (
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff6b4a]">Patient Disclosures</h5>
                    <div className="p-4 rounded-2xl bg-muted/30 border border-black/[0.02]">
                      <p className="text-xs font-medium text-muted-foreground whitespace-pre-wrap italic">
                        "{results.notes}"
                      </p>
                    </div>
                  </div>
                )}

                <Button 
                    onClick={handleReset} 
                    className="w-full h-12 rounded-xl border border-black/[0.1] hover:bg-black hover:text-white transition-all font-black text-xs uppercase tracking-widest"
                    variant="outline"
                >
                  Regenerate Assessment
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
