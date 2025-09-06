"use client";

import { useState } from "react";
import type { GenerateDetailedDescriptionOutput } from "@/ai/flows/generate-detailed-description";
import { analyzeImage } from "@/app/actions";
import { ImageUpload } from "@/components/image-upload";
import { ResultDisplay } from "@/components/result-display";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] =
    useState<GenerateDetailedDescriptionOutput | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setResult(null);
    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const dataUri = reader.result as string;
      setImageUrl(dataUri);
      try {
        const analysisResult = await analyzeImage({ photoDataUri: dataUri });
        setResult(analysisResult);
      } catch (e) {
        console.error(e);
        toast({
          title: "Analysis Failed",
          description:
            "Something went wrong while analyzing your image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      toast({
        title: "File Error",
        description: "Could not read the selected file. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    };
  };

  const handleReset = () => {
    setImageUrl(null);
    setResult(null);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 font-body transition-colors duration-300">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-headline font-bold text-foreground tracking-tight">
            Scandentify
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Upload an image to learn more about it and its eco-impact. Our AI will provide a detailed description and analysis.
          </p>
        </header>

        <div className="min-h-[400px] flex items-center justify-center">
          {!imageUrl ? (
            <ImageUpload onImageUpload={handleImageUpload} loading={loading} />
          ) : (
            <ResultDisplay
              imageUrl={imageUrl}
              result={result}
              loading={loading}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </main>
  );
}
