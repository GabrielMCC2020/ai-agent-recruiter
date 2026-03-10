"use client";

import * as React from "react";
import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandidateForm } from "./candidate-form";
import { toast } from "sonner";

interface AddCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCandidateAdded?: () => void;
}

export function AddCandidateDialog({
  open,
  onOpenChange,
  onCandidateAdded,
}: AddCandidateDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Record<string, any> | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === "application/pdf") {
        handleFileSelect(file);
      } else {
        toast.error("Please upload a PDF file");
      }
    }
  };

  const handleFileSelect = async (file: File) => {
    setResumeFile(file);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/candidates/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API response error:", {
          status: response.status,
          error: errorData,
        });
        throw new Error(errorData.error || "Failed to parse resume");
      }

      const data = await response.json();
      if (data.error) {
        console.error("Data contains error:", data.error);
        throw new Error(data.error);
      }
      setParsedData(data);
      toast.success("Resume parsed successfully!");
    } catch (error) {
      console.error("Error parsing resume:", error);
      toast.error(
        error instanceof Error
          ? `Failed to parse resume: ${error.message}`
          : "Failed to parse resume. Please fill in the form manually."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResumeFile(null);
    setParsedData(null);
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
          <DialogDescription>
            Upload a resume for AI-powered form filling or fill in the details manually.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resume">Upload Resume</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="space-y-4">
            {!resumeFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Drag and drop your resume here</p>
                  <p className="text-xs text-muted-foreground">or</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".pdf";
                    input.onchange = (e: any) => {
                      if (e.target.files?.[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    };
                    input.click();
                  }}
                  className="mt-2"
                >
                  Select File
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  PDF files only, max 10MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{resumeFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {!isLoading && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-r-transparent" />
                    <p className="ml-2 text-sm text-muted-foreground">
                      Parsing resume...
                    </p>
                  </div>
                )}

                {parsedData && !isLoading && (
                  <CandidateForm
                    initialData={parsedData}
                    resumeUrl={resumeFile.name}
                    onSuccess={() => {
                      handleClose();
                      onCandidateAdded?.();
                    }}
                  />
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <CandidateForm
              onSuccess={() => {
                handleClose();
                onCandidateAdded?.();
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
