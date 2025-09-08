"use server";

import {
  generateDetailedDescription,
  type GenerateDetailedDescriptionInput,
} from "@/ai/flows/generate-detailed-description";
import { textToSpeech } from "@/ai/flows/text-to-speech";

export async function analyzeImage(input: GenerateDetailedDescriptionInput) {
  return await generateDetailedDescription(input);
}

export async function convertTextToSpeech(text: string) {
  return await textToSpeech(text);
}
