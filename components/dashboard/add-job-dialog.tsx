"use client";

import * as React from "react";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { JobForm } from "./job-form";

interface AddJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobAdded?: () => void;
}

export function AddJobDialog({
  open,
  onOpenChange,
  onJobAdded,
}: AddJobDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [generatedData, setGeneratedData] = useState<Record<string, any> | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerateWithAI = async () => {
    if (!jobTitle.trim()) {
      toast.error("Please enter a job title");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/jobs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: jobTitle.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate job description");
      }

      const data = await response.json();
      setGeneratedData(data);
      toast.success("Job description generated successfully!");
    } catch (error) {
      console.error("Error generating job description:", error);
      toast.error("Failed to generate job description");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setJobTitle("");
    setGeneratedData(null);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleJobSaved = () => {
    toast.success("Job posted successfully!");
    handleClose();
    onJobAdded?.();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Job Posting</DialogTitle>
          <DialogDescription>
            Fill in the job details or let AI generate them from a job title
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Generated
            </TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Title</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., Senior React Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleGenerateWithAI();
                  }}
                  className="flex-1 px-3 py-2 border border-input rounded-md text-sm"
                />
                <Button
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating || !jobTitle.trim()}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Generate
                </Button>
              </div>
            </div>

            {generatedData && (
              <JobForm
                initialData={{
                  title: jobTitle,
                  ...generatedData,
                }}
                isSubmitting={isSubmitting}
                onSubmit={async (data) => {
                  setIsSubmitting(true);
                  try {
                    const response = await fetch("/api/jobs", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(data),
                    });

                    if (!response.ok) {
                      throw new Error("Failed to create job");
                    }

                    handleJobSaved();
                  } catch (error) {
                    console.error("Error creating job:", error);
                    toast.error("Failed to create job");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="manual">
            <JobForm
              isSubmitting={isSubmitting}
              onSubmit={async (data) => {
                setIsSubmitting(true);
                try {
                  const response = await fetch("/api/jobs", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  });

                  if (!response.ok) {
                    throw new Error("Failed to create job");
                  }

                  handleJobSaved();
                } catch (error) {
                  console.error("Error creating job:", error);
                  toast.error("Failed to create job");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
