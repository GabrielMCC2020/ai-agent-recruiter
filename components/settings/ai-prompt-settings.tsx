import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Brain } from "lucide-react";
import { useState } from "react";

interface AIPromptSettingsProps {
  systemPrompt: string | null;
  evaluationCriteria: string[];
  customInstructions: string | null;
  onSystemPromptChange: (value: string) => void;
  onEvaluationCriteriaChange: (value: string[]) => void;
  onCustomInstructionsChange: (value: string) => void;
}

export function AIPromptSettings({
  systemPrompt,
  evaluationCriteria,
  customInstructions,
  onSystemPromptChange,
  onEvaluationCriteriaChange,
  onCustomInstructionsChange,
}: AIPromptSettingsProps) {
  const [newCriteria, setNewCriteria] = useState("");

  const addCriteria = () => {
    if (newCriteria.trim()) {
      onEvaluationCriteriaChange([...evaluationCriteria, newCriteria.trim()]);
      setNewCriteria("");
    }
  };

  const removeCriteria = (index: number) => {
    onEvaluationCriteriaChange(
      evaluationCriteria.filter((_, i) => i !== index)
    );
  };

  const defaultSystemPrompt = `You are a professional AI recruiting agent conducting a job interview. Your role is to:

1. Ask clear, relevant questions based on the job description and position requirements
2. Evaluate responses thoroughly and take detailed notes
3. Be professional, courteous, and encouraging
4. Adapt your questioning style to the candidate's responses
5. Ensure the interview is conversational and engaging
6. Provide constructive feedback at the end

Remember to:
- Listen carefully to candidate responses
- Ask follow-up questions when needed
- Rate responses based on the established evaluation criteria
- Keep track of time and manage the interview duration effectively`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <div>
            <CardTitle>AI Prompt & Evaluation Settings</CardTitle>
            <CardDescription>
              Customize how the AI agent conducts interviews and evaluates candidates
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Prompt */}
        <div className="space-y-2">
          <Label htmlFor="system-prompt" className="text-sm font-medium">
            System Prompt for AI Agent
          </Label>
          <Textarea
            id="system-prompt"
            placeholder="Enter custom instructions for the AI agent..."
            value={systemPrompt || defaultSystemPrompt}
            onChange={(e) => onSystemPromptChange(e.target.value)}
            rows={6}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Define how the AI should behave, tone, and approach during interviews. This prompt will
            be used to generate interview questions and conduct the interview.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSystemPromptChange(defaultSystemPrompt)}
            className="mt-2"
          >
            Reset to Default
          </Button>
        </div>

        {/* Evaluation Criteria */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
          <h3 className="font-semibold text-sm">Evaluation Criteria</h3>
          <p className="text-xs text-muted-foreground">
            Define the criteria that will be used to evaluate and score candidate responses
          </p>

          <div className="space-y-3">
            {evaluationCriteria.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {evaluationCriteria.map((criteria, index) => (
                  <Badge key={index} variant="secondary" className="gap-2 px-3 py-1">
                    {criteria}
                    <button
                      onClick={() => removeCriteria(index)}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="Add evaluation criteria (e.g., Technical Skills)"
                value={newCriteria}
                onChange={(e) => setNewCriteria(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addCriteria();
                  }
                }}
              />
              <Button size="sm" onClick={addCriteria} className="gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white rounded border text-xs space-y-1">
            <p className="font-medium text-slate-900">Suggested Evaluation Criteria:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Technical Skills & Knowledge</li>
              <li>Problem Solving Ability</li>
              <li>Communication & Clarity</li>
              <li>Experience Relevance</li>
              <li>Cultural Fit</li>
              <li>Leadership Potential</li>
              <li>Learning Agility</li>
              <li>Attention to Detail</li>
            </ul>
          </div>
        </div>

        {/* Custom Instructions */}
        <div className="space-y-2">
          <Label htmlFor="custom-instructions" className="text-sm font-medium">
            Custom Instructions
          </Label>
          <Textarea
            id="custom-instructions"
            placeholder="Add any specific instructions or guidelines for this position's interviews..."
            value={customInstructions || ""}
            onChange={(e) => onCustomInstructionsChange(e.target.value)}
            rows={4}
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground mt-2">
            These instructions will be appended to the system prompt to provide specific guidance for
            this role
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
