"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { UploadCloud, Camera, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  loading: boolean;
}

export function ImageUpload({ onImageUpload, loading }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleButtonClick = (camera = false) => {
    if (fileInputRef.current) {
      if(camera) {
        fileInputRef.current.setAttribute('capture', 'environment');
      } else {
        fileInputRef.current.removeAttribute('capture');
      }
      fileInputRef.current.click();
    }
  };
  
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 relative overflow-hidden",
          isDragging ? "bg-secondary" : "bg-transparent",
          loading && "pointer-events-none opacity-50"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing your image...</p>
          </div>
        ) : (
          <>
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-400/50 scanner-line shadow-[0_0_15px_5px] shadow-blue-400/50 blur-sm"></div>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <UploadCloud className="h-12 w-12 text-primary" />
              </div>
              <p className="text-muted-foreground">
                Drag & drop an image here, or click to select a file
              </p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleButtonClick(false)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                >
                  Upload Image
                </button>
                <button
                  onClick={() => handleButtonClick(true)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium rounded-md"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Use Camera
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}