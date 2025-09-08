import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Leaf, RefreshCw, XCircle } from "lucide-react";
import type { GenerateDetailedDescriptionOutput } from "@/ai/flows/generate-detailed-description";

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
                      <Badge className="bg-primary/20 text-white border-primary/30 hover:bg-primary/20 py-1 px-3">
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
