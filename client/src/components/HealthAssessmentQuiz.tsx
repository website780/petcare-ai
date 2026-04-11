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
        <Button variant="outline" className="w-full">
          <ActivitySquare className="mr-2 h-4 w-4" />
          Start Health Assessment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {showResults ? "Assessment Results" : `Health Assessment (${currentQuestion + 1}/${questions.length})`}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {!showResults ? (
            <div className="space-y-4">
              <p className="text-lg font-medium mb-4">{questions[currentQuestion].text}</p>
              
              {questions[currentQuestion].type === "radio" && (
                <RadioGroup
                  value={answers[questions[currentQuestion].id] as string}
                  onValueChange={handleAnswer}
                >
                  <div className="space-y-2">
                    {questions[currentQuestion].options?.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} data-testid={`radio-${option.value}`} />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
              
              {questions[currentQuestion].type === "checkbox" && (
                <div className="space-y-2">
                  {questions[currentQuestion].options?.map((option) => {
                    const currentAnswers = Array.isArray(answers[questions[currentQuestion].id])
                      ? answers[questions[currentQuestion].id] as string[]
                      : [];
                    const isChecked = currentAnswers.includes(option.value);
                    
                    return (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={isChecked}
                          onCheckedChange={(checked) => handleCheckboxAnswer(option.value, !!checked)}
                          data-testid={`checkbox-${option.value}`}
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {questions[currentQuestion].type === "textarea" && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Please describe any additional concerns or symptoms you've noticed..."
                    value={notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    className="min-h-[100px]"
                    data-testid="textarea-notes"
                  />
                  <p className="text-sm text-muted-foreground">
                    This field is optional and will be included in your assessment results for future reference.
                  </p>
                </div>
              )}
              
              <Button
                onClick={handleNext}
                disabled={getIsNextDisabled()}
                className="w-full mt-4"
                data-testid="button-next"
              >
                {currentQuestion === questions.length - 1 ? "Show Results" : "Next Question"}
              </Button>
            </div>
          ) : results ? (
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-primary" data-testid="health-score">
                    {results.healthScore}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Health Score
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-5 w-5 ${getRiskLevelColor(results.riskLevel)}`} />
                  <p className={`font-medium ${getRiskLevelColor(results.riskLevel)}`} data-testid="risk-level">
                    {results.riskLevel.charAt(0).toUpperCase() + results.riskLevel.slice(1)} Risk Level
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">Recommendations:</p>
                  <ul className="list-disc list-inside space-y-1" data-testid="recommendations">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="text-muted-foreground">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {results.notes && results.notes.trim() && (
                  <div className="space-y-2">
                    <p className="font-medium">Additional Notes:</p>
                    <div className="bg-muted p-3 rounded-md" data-testid="additional-notes">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {results.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <Button onClick={handleReset} className="w-full">
                Start New Assessment
              </Button>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
