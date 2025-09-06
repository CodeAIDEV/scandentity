import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Leaf, RefreshCw, XCircle, Volume2, VolumeX } from "lucide-react";
import type { GenerateDetailedDescriptionOutput } from "@/ai/flows/generate-detailed-description";
import { useEffect, useState, useRef } from "react";
import { getAudioForText } from "@/app/actions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ResultDisplayProps {
  imageUrl: string;
  result: GenerateDetailedDescriptionOutput | null;
  loading: boolean;
  onReset: () => void;
}

export function ResultDisplay({
  imageUrl,
  result,
  loading,
  onReset,
}: ResultDisplayProps) {
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [isAutoplayOn, setIsAutoplayOn] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (result?.description) {
      const fetchAudio = async () => {
        setIsAudioLoading(true);
        try {
          const audioResult = await getAudioForText(result.description);
          setAudioDataUri(audioResult.audioDataUri);
        } catch (error) {
          console.error("Failed to generate audio:", error);
          toast({
            title: "Audio Generation Failed",
            description: "Could not generate audio for the result.",
            variant: "destructive",
          });
        } finally {
          setIsAudioLoading(false);
        }
      };
      fetchAudio();
    }
  }, [result, toast]);

  useEffect(() => {
    if (audioDataUri && isAutoplayOn && audioRef.current) {
      audioRef.current.src = audioDataUri;
      audioRef.current.play().catch(e => console.error("Autoplay failed:", e));
    }
  }, [audioDataUri, isAutoplayOn]);
  
  return (
    <div className="w-full animate-in fade-in duration-500">
      <Card className="overflow-hidden shadow-lg bg-card/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-square">
            <Image
              src={imageUrl}
              alt="Scanned item"
              fill
              className="object-cover"
              data-ai-hint="scanned object"
            />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <CardHeader className="px-0 pt-0">
              <div className="flex justify-between items-center">
                <CardTitle className="font-headline text-2xl">Analysis Result</CardTitle>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoplay-switch"
                    checked={isAutoplayOn}
                    onCheckedChange={setIsAutoplayOn}
                    aria-label="Toggle autoplay"
                  />
                  <Label htmlFor="autoplay-switch" className="flex items-center cursor-pointer">
                    {isAutoplayOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-muted-foreground"/>}
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div>
                    {result.isEcoFriendly ? (
                      <Badge className="bg-primary/20 text-primary-foreground border-primary/30 hover:bg-primary/20 py-1 px-3">
                        <Leaf className="mr-2 h-4 w-4" />
                        Eco-Friendly
                      </Badge>
                    ) : (
                      <Badge
                        variant="destructive"
                        className="bg-destructive/20 text-destructive-foreground border-destructive/30 hover:bg-destructive/20 py-1 px-3"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Not Eco-Friendly
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {result.description}
                  </p>

                  {isAudioLoading && (
                     <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  )}

                  {audioDataUri && (
                    <audio ref={audioRef} controls className="w-full">
                      <source src={audioDataUri} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                  )}

                </div>
              ) : (
                <p className="text-muted-foreground">
                  No analysis result available.
                </p>
              )}
              <Button onClick={onReset} variant="outline" className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Scan Another Image
              </Button>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
