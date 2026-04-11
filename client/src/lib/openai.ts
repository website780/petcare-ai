import { type AnalyzeImageResponse } from "@shared/schema";

// Create a function to analyze pet images using OpenAI's Vision API
export async function analyzePetImage(base64Image: string): Promise<AnalyzeImageResponse> {
  if (!base64Image) {
    throw new Error("No image data provided");
  }

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageData: base64Image }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to analyze image: ${error}`);
  }

  return response.json();
}

// Helper function to convert File to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (!reader.result) {
        reject(new Error("Failed to read file"));
        return;
      }
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// Helper function to validate image files
export function validateImageFile(file: File): boolean {
  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPEG or PNG image.");
  }

  if (file.size > maxSize) {
    throw new Error("File too large. Maximum size is 10MB.");
  }

  return true;
}

// Helper function to generate a prompt for pet analysis
export function generatePetAnalysisPrompt(): string {
  return `Analyze this pet image and provide the following information in JSON format:
- species: The type of pet (e.g., "Dog", "Cat", "Bird", etc.)
- breed: The specific breed if identifiable (optional)
- description: A brief description of what you see in the image
- weight: Estimated weight with units (e.g., '5.5 lbs' or '2.5 kg')
- size: Description of the pet's size (e.g., 'Small', 'Medium-sized with 15 inch height')
- careRecommendations: An array of 3-5 specific care recommendations for this type of pet

Response should be in this format:
{
  "species": string,
  "breed": string | undefined,
  "description": string,
  "weight": string,
  "size": string,
  "careRecommendations": string[]
}`;
}

// Function to analyze nutrition requirements
export async function analyzeNutritionRequirements(data: {
  breed: string;
  weight: number;
  activityLevel: string;
  species: string;
  age?: number;
}) {
  const response = await fetch("/api/nutrition/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to analyze nutrition: ${error}`);
  }

  return response.json();
}