import OpenAI from "openai";
import { Pet } from "@shared/schema.js";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateTrainingPlan(pet: Pet) {
  try {
    // Determine species-specific training categories
    let trainingCategories;
    if (pet.species.toLowerCase() === 'dog') {
      trainingCategories = [
        { category: "Basic Commands", step: "Essential commands like sit, stay, come, down", type: "basic" },
        { category: "Exercise Goals", step: "Daily exercise routines and physical conditioning", type: "exercise" },
        { category: "House Training", step: "Bathroom habits and indoor behavior", type: "behavioral" },
        { category: "Leash Training", step: "Walking properly on leash without pulling", type: "behavioral" },
        { category: "Socialization", step: "Interaction with people, pets, and environments", type: "behavioral" },
        { category: "Advanced Tricks", step: "Fun and impressive tricks for mental stimulation", type: "basic" }
      ];
    } else if (pet.species.toLowerCase() === 'cat') {
      trainingCategories = [
        { category: "Basic Commands", step: "Essential commands like come, sit, stay using treats", type: "basic" },
        { category: "Exercise Goals", step: "Play sessions and physical activity routines", type: "exercise" },
        { category: "Litter Training", step: "Proper litter box usage and habits", type: "behavioral" },
        { category: "Harness Training", step: "Getting comfortable with harness and supervised outdoor time", type: "behavioral" },
        { category: "Socialization", step: "Interaction with people, other cats, and new environments", type: "behavioral" },
        { category: "Clicker Training", step: "Using positive reinforcement for tricks and behavior", type: "basic" }
      ];
    } else {
      // For other pets (birds, rabbits, reptiles, etc.)
      trainingCategories = [
        { category: "Basic Commands", step: "Species-appropriate basic responses and interactions", type: "basic" },
        { category: "Exercise Goals", step: "Physical activity and enrichment appropriate for the species", type: "exercise" },
        { category: "Habitat Training", step: "Proper use of living space and designated areas", type: "behavioral" },
        { category: "Handling Training", step: "Getting comfortable with human interaction and handling", type: "behavioral" },
        { category: "Socialization", step: "Interaction with humans and environmental adaptation", type: "behavioral" },
        { category: "Enrichment Activities", step: "Mental stimulation and species-specific behaviors", type: "basic" }
      ];
    }

    const prompt = `As a professional pet trainer with expertise in ${pet.species} behavior, analyze the following pet details and provide a comprehensive training plan with exactly 6 modules. Format the response as a JSON object with the fields specified below:

Pet Details:
- Species: ${pet.species}
- Breed: ${pet.breed || 'Not specified'}
- Size: ${pet.size || 'Not specified'}
- Age/Life Stage: Based on lifespan of ${pet.lifespan}

Required JSON format with EXACTLY these 6 categories:
{
  "trainingLevel": "string (Beginner/Intermediate/Advanced)",
  "exerciseNeeds": "string describing general exercise requirements for ${pet.species}",
  "exerciseSchedule": "string with recommended schedule",
  "exerciseDuration": "string with recommended duration per session",
  "trainingDetails": [
    {
      "category": "${trainingCategories[0].category}",
      "step": "${trainingCategories[0].step}",
      "type": "${trainingCategories[0].type}",
      "description": "detailed explanation specific to ${pet.species} training methods",
      "duration": "estimated time to master this category",
      "prerequisites": ["array of skills needed before this step"],
      "difficulty": "Beginner/Intermediate/Advanced",
      "checkpoints": ["array of 3-5 specific behaviors to check for progress"],
      "tips": ["array of 3-5 helpful tips and common mistakes to avoid for ${pet.species}"]
    },
    {
      "category": "${trainingCategories[1].category}",
      "step": "${trainingCategories[1].step}",
      "type": "${trainingCategories[1].type}",
      "description": "detailed explanation specific to ${pet.species} exercise and fitness",
      "duration": "estimated time to establish routine",
      "prerequisites": ["array of skills needed before this step"],
      "difficulty": "Beginner/Intermediate/Advanced",
      "checkpoints": ["array of 3-5 specific fitness goals to check for progress"],
      "tips": ["array of 3-5 helpful tips for ${pet.species} exercise"]
    },
    {
      "category": "${trainingCategories[2].category}",
      "step": "${trainingCategories[2].step}",
      "type": "${trainingCategories[2].type}",
      "description": "detailed explanation specific to ${pet.species} behavioral training",
      "duration": "estimated time to master this category",
      "prerequisites": ["array of skills needed before this step"],
      "difficulty": "Beginner/Intermediate/Advanced",
      "checkpoints": ["array of 3-5 specific behaviors to check for progress"],
      "tips": ["array of 3-5 helpful tips and common mistakes to avoid for ${pet.species}"]
    },
    {
      "category": "${trainingCategories[3].category}",
      "step": "${trainingCategories[3].step}",
      "type": "${trainingCategories[3].type}",
      "description": "detailed explanation specific to ${pet.species} behavioral methods",
      "duration": "estimated time to master this category",
      "prerequisites": ["array of skills needed before this step"],
      "difficulty": "Beginner/Intermediate/Advanced",
      "checkpoints": ["array of 3-5 specific behaviors to check for progress"],
      "tips": ["array of 3-5 helpful tips and common mistakes to avoid for ${pet.species}"]
    },
    {
      "category": "${trainingCategories[4].category}",
      "step": "${trainingCategories[4].step}",
      "type": "${trainingCategories[4].type}",
      "description": "detailed explanation specific to ${pet.species} socialization techniques",
      "duration": "estimated time to see improvement",
      "prerequisites": ["array of skills needed before this step"],
      "difficulty": "Beginner/Intermediate/Advanced",
      "checkpoints": ["array of 3-5 specific social behaviors to check for progress"],
      "tips": ["array of 3-5 helpful tips for ${pet.species} socialization"]
    },
    {
      "category": "${trainingCategories[5].category}",
      "step": "${trainingCategories[5].step}",
      "type": "${trainingCategories[5].type}",
      "description": "detailed explanation specific to ${pet.species} advanced training methods",
      "duration": "estimated time to master this category",
      "prerequisites": ["array of skills needed before this step"],
      "difficulty": "Intermediate/Advanced",
      "checkpoints": ["array of 3-5 specific advanced behaviors to check for progress"],
      "tips": ["array of 3-5 helpful tips and common mistakes to avoid for ${pet.species}"]
    }
  ],
  "exerciseType": "string describing recommended exercise types for ${pet.species}",
  "trainingProgress": "Not Started"
}

CRITICAL REQUIREMENTS:
1. MUST include exactly 6 training modules - no more, no less
2. Each module must have 3-5 checkpoints and 3-5 tips
3. Adapt ALL content specifically for ${pet.species} - not generic pet advice
4. Use species-appropriate terminology and techniques
5. Categories must be distributed as: 2 Basic Commands modules, 1 Exercise Goals module, 3 Behavioral Training modules
6. Make each step specific, actionable, and include clear success criteria for ${pet.species}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const trainingPlan = JSON.parse(response.choices[0].message.content || "{}");
    
    // Validate the response
    if (!trainingPlan.trainingDetails || !Array.isArray(trainingPlan.trainingDetails)) {
      throw new Error("Training plan missing trainingDetails array");
    }
    
    if (trainingPlan.trainingDetails.length !== 6) {
      throw new Error(`Expected exactly 6 training modules, got ${trainingPlan.trainingDetails.length}`);
    }
    
    // Validate type distribution (2 basic, 1 exercise, 3 behavioral)
    const typeCount = { basic: 0, exercise: 0, behavioral: 0 };
    trainingPlan.trainingDetails.forEach((detail: any) => {
      if (detail.type && typeCount.hasOwnProperty(detail.type)) {
        typeCount[detail.type as keyof typeof typeCount]++;
      }
    });
    
    if (typeCount.basic !== 2 || typeCount.exercise !== 1 || typeCount.behavioral !== 3) {
      console.warn(`Training plan type distribution incorrect: ${JSON.stringify(typeCount)}. Expected: basic=2, exercise=1, behavioral=3`);
      // Don't throw error, just log warning for now
    }
    
    return trainingPlan;
  } catch (error) {
    console.error("Error generating training plan:", error);
    throw new Error("Failed to generate training plan");
  }
}

export async function generateNutritionPlan(pet: Pet) {
  try {
    const prompt = `As a certified pet nutritionist and veterinary nutritionist, analyze the following pet details and provide comprehensive, evidence-based nutrition recommendations. Provide specific brand names, product names, and detailed nutritional guidance.

Pet Details:
- Species: ${pet.species}
- Breed: ${pet.breed || 'Not specified'}
- Size: ${pet.size || 'Not specified'}
- Weight: ${pet.weight || 'Not specified'}
- Age/Life Stage: Based on lifespan of ${pet.lifespan}

Provide nutrition recommendations in this JSON format:
{
  "dietType": "string (omnivore/carnivore/herbivore/etc.)",
  "feedingSchedule": "string with recommended feeding frequency",
  "portionSize": "string with portion guidance based on size/weight",
  "nutritionalNeeds": ["array of key nutritional requirements"],
  "foodRecommendations": [
    {
      "productName": "specific product name",
      "brand": "brand name (use real brands like Hill's Science Diet, Royal Canin, Blue Buffalo, etc.)",
      "category": "string (dry food/wet food/treats/supplements)",
      "activeIngredients": ["array of key ingredients"],
      "benefits": "detailed explanation of how this food helps the pet",
      "feedingGuide": "specific portion recommendations",
      "specialNotes": "any special considerations or veterinary notes"
    }
  ],
  "foodRestrictions": ["array of foods/ingredients to avoid for this species/breed"],
  "treatRecommendations": ["array of healthy treat options"],
  "specialConsiderations": "any breed-specific or species-specific dietary needs"
}

Ensure all recommendations are based on current veterinary nutritional science and include real, available pet food brands and products. Focus on high-quality, nutritionally complete options appropriate for the specific species and breed.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const nutritionPlan = JSON.parse(response.choices[0].message.content || "{}");
    return nutritionPlan;
  } catch (error) {
    console.error("Error generating nutrition plan:", error);
    throw new Error("Failed to generate nutrition plan");
  }
}

interface NutritionAnalysisParams {
  breed: string;
  weight: number;
  activityLevel: string;
  species: string;
  age?: number;
}

export async function generatePersonalizedNutrition(params: NutritionAnalysisParams) {
  try {
    const prompt = `As a certified veterinary nutritionist, provide detailed, science-based nutrition recommendations for this specific pet. Use real AAFCO guidelines and veterinary nutritional science.

Pet Details:
- Species: ${params.species}
- Breed: ${params.breed}
- Weight: ${params.weight} lbs
- Activity Level: ${params.activityLevel}
- Age: ${params.age || 'Adult'}

Calculate precise nutritional requirements and provide recommendations in this JSON format:
{
  "dailyCalories": number,
  "protein": {
    "grams": number,
    "percentage": number,
    "sources": ["list of best protein sources for this pet"]
  },
  "fats": {
    "grams": number,
    "percentage": number,
    "sources": ["list of healthy fat sources"]
  },
  "carbohydrates": {
    "grams": number,
    "percentage": number,
    "sources": ["list of appropriate carb sources"]
  },
  "recommendedFoods": [
    {
      "productName": "specific product name",
      "brand": "real brand name",
      "dailyAmount": "cups or cans per day",
      "caloriesPerServing": number,
      "proteinContent": "percentage",
      "fatContent": "percentage",
      "reasons": "why this food is ideal for this specific pet"
    }
  ],
  "feedingSchedule": "optimal feeding times and frequency",
  "specialConsiderations": "breed-specific or activity-level specific notes",
  "supplementRecommendations": ["if any supplements are beneficial"],
  "warningFoods": ["list of specific food names to avoid for this breed - just the food names"]
}

IMPORTANT: For warningFoods array, only return SHORT food names like:
- "Chocolate" (not "Chocolate can be toxic to dogs")
- "Grapes" (not "Grapes and raisins should be avoided")
- "Onions" (not "Onions can cause anemia in pets")

Base calculations on:
- RER (Resting Energy Requirement) = 70 × (weight in kg)^0.75
- Activity multipliers: Sedentary (1.2-1.4), Moderate (1.6-1.8), Active (2.0-3.0), Very Active (3.0-5.0)
- AAFCO minimum protein requirements
- Breed-specific nutritional considerations`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const nutritionAnalysis = JSON.parse(response.choices[0].message.content || "{}");
    return nutritionAnalysis;
  } catch (error) {
    console.error("Error generating personalized nutrition:", error);
    throw new Error("Failed to generate personalized nutrition analysis");
  }
}

export async function generateVaccinationPlan(pet: Pet) {
  try {
    const prompt = `As a licensed veterinarian with expertise in preventive care, provide comprehensive vaccination requirements for this specific pet. Consider their species, breed, and typical health needs.

Pet Details:
- Species: ${pet.species}
- Breed: ${pet.breed || 'Not specified'}
- Size: ${pet.size || 'Not specified'}
- Lifespan: ${pet.lifespan || 'Not specified'}

Provide a detailed vaccination plan in this JSON format:
{
  "vaccinationSchedule": "A comprehensive description of the overall vaccination schedule for this species and breed, including puppy/kitten series timing, booster schedules, and annual requirements",
  "vaccinationNotes": "Important breed-specific considerations, common health predispositions, and special vaccination notes for this particular breed",
  "coreVaccines": [
    {
      "name": "Vaccine name",
      "protectsAgainst": "What disease(s) it protects against",
      "initialSeries": "When to start and how many doses for initial series",
      "boosterFrequency": "How often boosters are needed (annual, 3-year, etc.)",
      "required": true,
      "notes": "Any special considerations"
    }
  ],
  "nonCoreVaccines": [
    {
      "name": "Vaccine name",
      "protectsAgainst": "What disease(s) it protects against",
      "recommendedFor": "What situations/lifestyles this is recommended for",
      "boosterFrequency": "How often boosters are needed",
      "required": false,
      "notes": "Any special considerations"
    }
  ],
  "ageBasedSchedule": [
    {
      "ageRange": "6-8 weeks",
      "vaccines": ["List of vaccines due at this age"],
      "notes": "Any notes for this age period"
    }
  ],
  "breedSpecificRisks": ["List of health conditions this breed is predisposed to that may affect vaccination decisions"],
  "nextVaccinationDue": "Estimated date for first/next vaccination based on typical schedule (use ISO date format like 2025-02-01)"
}

IMPORTANT:
- Include ALL core vaccines required by law or veterinary standards for this species
- Include relevant non-core vaccines based on breed and common lifestyles
- For ${pet.species}, ensure species-appropriate vaccines (don't include dog vaccines for cats, etc.)
- Be specific about timing (weeks, months, years) for all schedules
- Consider breed-specific health predispositions when making recommendations`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const vaccinationPlan = JSON.parse(response.choices[0].message.content || "{}");
    
    const vaccinationRecords = [
      ...vaccinationPlan.coreVaccines.map((vaccine: any) => JSON.stringify({
        name: vaccine.name,
        dateAdministered: null,
        nextDue: null,
        veterinarian: null,
        notes: vaccine.notes || `Core vaccine - ${vaccine.protectsAgainst}`,
        status: "upcoming",
        isCore: true,
        protectsAgainst: vaccine.protectsAgainst,
        boosterFrequency: vaccine.boosterFrequency
      })),
      ...vaccinationPlan.nonCoreVaccines.map((vaccine: any) => JSON.stringify({
        name: vaccine.name,
        dateAdministered: null,
        nextDue: null,
        veterinarian: null,
        notes: vaccine.notes || `Recommended for: ${vaccine.recommendedFor}`,
        status: "upcoming",
        isCore: false,
        protectsAgainst: vaccine.protectsAgainst,
        boosterFrequency: vaccine.boosterFrequency,
        recommendedFor: vaccine.recommendedFor
      }))
    ];

    return {
      vaccinationRecords,
      vaccinationSchedule: vaccinationPlan.vaccinationSchedule,
      vaccinationNotes: vaccinationPlan.vaccinationNotes,
      nextVaccinationDue: vaccinationPlan.nextVaccinationDue ? new Date(vaccinationPlan.nextVaccinationDue) : null,
      ageBasedSchedule: vaccinationPlan.ageBasedSchedule,
      breedSpecificRisks: vaccinationPlan.breedSpecificRisks
    };
  } catch (error) {
    console.error("Error generating vaccination plan:", error);
    return {
      vaccinationRecords: [],
      vaccinationSchedule: `Regular vaccination schedule recommended for ${pet.species}. Consult your veterinarian for a personalized vaccination plan.`,
      vaccinationNotes: `Standard vaccinations for ${pet.breed || pet.species} should be discussed with your veterinarian.`,
      nextVaccinationDue: null,
      ageBasedSchedule: [],
      breedSpecificRisks: []
    };
  }
}

export async function analyzePetBasic(imageData: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a veterinary assistant. Identify the pet in the image and provide basic details.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this pet image and provide the following in JSON format: { species, breed, weight (approx in lbs) }",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error in analyzePetBasic:", error);
    throw new Error("Failed to identify pet basic info");
  }
}