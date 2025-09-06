'use server';

/**
 * @fileOverview Provides a detailed description of an image, including its origin and nature.
 *
 * - generateDetailedDescription - An async function that takes an image data URI and returns a detailed description.
 * - GenerateDetailedDescriptionInput - The input type for the generateDetailedDescription function.
 * - GenerateDetailedDescriptionOutput - The return type for the generateDetailedDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDetailedDescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo to be analyzed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});

export type GenerateDetailedDescriptionInput = z.infer<typeof GenerateDetailedDescriptionInputSchema>;

const GenerateDetailedDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed description of the image, including its origin and nature.'),
  isEcoFriendly: z.boolean().describe('Whether the item in the image is eco-friendly.'),
});

export type GenerateDetailedDescriptionOutput = z.infer<typeof GenerateDetailedDescriptionOutputSchema>;

export async function generateDetailedDescription(input: GenerateDetailedDescriptionInput): Promise<GenerateDetailedDescriptionOutput> {
  return generateDetailedDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDetailedDescriptionPrompt',
  input: {schema: GenerateDetailedDescriptionInputSchema},
  output: {schema: GenerateDetailedDescriptionOutputSchema},
  prompt: `You are an AI assistant designed to provide detailed descriptions of images.

  Analyze the image provided and give a detailed description of the item in the image, including its origin and nature.  Then make a determination as to whether the item in the image is eco-friendly.  If it is, set the isEcoFriendly output field to true, otherwise set it to false.

  Image: {{media url=photoDataUri}}`,
});

const generateDetailedDescriptionFlow = ai.defineFlow(
  {
    name: 'generateDetailedDescriptionFlow',
    inputSchema: GenerateDetailedDescriptionInputSchema,
    outputSchema: GenerateDetailedDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
