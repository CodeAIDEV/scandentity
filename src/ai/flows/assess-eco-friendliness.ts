'use server';
/**
 * @fileOverview Determines the eco-friendliness of an image based on its description.
 *
 * - assessEcoFriendliness - A function that assesses the eco-friendliness of an image.
 * - AssessEcoFriendlinessInput - The input type for the assessEcoFriendliness function.
 * - AssessEcoFriendlinessOutput - The return type for the assessEcoFriendliness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessEcoFriendlinessInputSchema = z.object({
  description: z
    .string()
    .describe('A detailed description of the scanned image including origin and nature.'),
});
export type AssessEcoFriendlinessInput = z.infer<typeof AssessEcoFriendlinessInputSchema>;

const AssessEcoFriendlinessOutputSchema = z.object({
  isEcoFriendly: z
    .boolean()
    .describe(
      'Whether the scanned image is eco-friendly (true) or not (false) based on its description.'
    ),
  reason: z
    .string()
    .describe('The reasoning behind the eco-friendliness assessment.'),
});
export type AssessEcoFriendlinessOutput = z.infer<typeof AssessEcoFriendlinessOutputSchema>;

export async function assessEcoFriendliness(
  input: AssessEcoFriendlinessInput
): Promise<AssessEcoFriendlinessOutput> {
  return assessEcoFriendlinessFlow(input);
}

const assessEcoFriendlinessPrompt = ai.definePrompt({
  name: 'assessEcoFriendlinessPrompt',
  input: {schema: AssessEcoFriendlinessInputSchema},
  output: {schema: AssessEcoFriendlinessOutputSchema},
  prompt: `You are an AI assistant designed to assess the eco-friendliness of an image based on its description.

  Given the following description, determine if the image represents something eco-friendly or not.
  Respond with whether it is eco-friendly or not, and your reasoning.

  Description: {{{description}}}
  `,
});

const assessEcoFriendlinessFlow = ai.defineFlow(
  {
    name: 'assessEcoFriendlinessFlow',
    inputSchema: AssessEcoFriendlinessInputSchema,
    outputSchema: AssessEcoFriendlinessOutputSchema,
  },
  async input => {
    const {output} = await assessEcoFriendlinessPrompt(input);
    return output!;
  }
);
