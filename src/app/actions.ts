"use server";

import {
  generateDetailedDescription,
  type GenerateDetailedDescriptionInput,
} from "@/ai/flows/generate-detailed-description";

export async function analyzeImage(input: GenerateDetailedDescriptionInput) {
  return await generateDetailedDescription(input);
}
