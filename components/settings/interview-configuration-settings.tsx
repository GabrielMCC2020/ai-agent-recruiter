import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { HelpCircle, ClipboardList } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InterviewConfigurationSettingsProps {
  questionCount: number;
  technicalQuestionsPercentage: number;
  behavioralQuestionsPercentage: number;
  questionDifficulty: string;
  interviewDuration: number;
  timePerQuestion: number;
  enableBreaksBetweenQuestions: boolean;
  breakDuration: number;
  allowCandidateQuestions: boolean;
  allowCandidateToSkipQuestions: boolean;
  onQuestionCountChange: (value: number) => void;
  onTechnicalPercentageChange: (value: number) => void;
  onBehavioralPercentageChange: (value: number) => void;
  onDifficultyChange: (value: string) => void;
  onInterviewDurationChange: (value: number) => void;
  onTimePerQuestionChange: (value: number) => void;
  onEnableBreaksChange: (value: boolean) => void;
  onBreakDurationChange: (value: number) => void;
  onAllowCandidateQuestionsChange: (value: boolean) => void;
  onAllowSkipQuestionsChange: (value: boolean) => void;
}

export function InterviewConfigurationSettings({
  questionCount,
  technicalQuestionsPercentage,
  behavioralQuestionsPercentage,
  questionDifficulty,
  interviewDuration,
  timePerQuestion,
  enableBreaksBetweenQuestions,
  breakDuration,
  allowCandidateQuestions,
  allowCandidateToSkipQuestions,
  onQuestionCountChange,
  onTechnicalPercentageChange,
  onBehavioralPercentageChange,
  onDifficultyChange,
  onInterviewDurationChange,
  onTimePerQuestionChange,
  onEnableBreaksChange,
  onBreakDurationChange,
  onAllowCandidateQuestionsChange,
  onAllowSkipQuestionsChange,
}: InterviewConfigurationSettingsProps) {
  const technicalCount = Math.round((questionCount * technicalQuestionsPercentage) / 100);
  const behavioralCount = questionCount - technicalCount;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-green-500" />
          <div>
            <CardTitle>Interview Configuration</CardTitle>
            <CardDescription>
              Set up interview questions, duration, and flow settings
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Questions Configuration */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Questions Configuration
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Total Questions per Interview</Label>
              <span className="text-lg font-bold text-primary">{questionCount}</span>
            </div>
            <Slider
              value={[questionCount]}
              onValueChange={([value]) => onQuestionCountChange(value)}
              min={3}
              max={20}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Range: 3-20 questions</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Technical Questions</Label>
                <span className="text-sm font-bold text-blue-600">
                  {technicalQuestionsPercentage}% ({technicalCount})
                </span>
              </div>
              <Slider
                value={[technicalQuestionsPercentage]}
                onValueChange={([value]) => {
                  onTechnicalPercentageChange(value);
                  onBehavioralPercentageChange(100 - value);
                }}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Behavioral Questions</Label>
                <span className="text-sm font-bold text-purple-600">
                  {behavioralQuestionsPercentage}% ({behavioralCount})
                </span>
              </div>
              <Slider
                value={[behavioralQuestionsPercentage]}
                onValueChange={([value]) => {
                  onBehavioralPercentageChange(value);
                  onTechnicalPercentageChange(100 - value);
                }}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="difficulty" className="text-sm font-medium">
              Question Difficulty
            </Label>
            <Select value={questionDifficulty} onValueChange={onDifficultyChange}>
              <SelectTrigger id="difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy - Foundation level questions</SelectItem>
                <SelectItem value="medium">Medium - Industry standard</SelectItem>
                <SelectItem value="hard">Hard - Advanced challenges</SelectItem>
                <SelectItem value="mixed">Mixed - Varied difficulty levels</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Time Configuration */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
          <h3 className="font-semibold text-sm">Time Configuration</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interview-duration" className="text-sm font-medium">
                Total Interview Duration (minutes)
              </Label>
              <Input
                id="interview-duration"
                type="number"
                value={interviewDuration}
                onChange={(e) => onInterviewDurationChange(Number(e.target.value))}
                min={10}
                max={120}
              />
              <p className="text-xs text-muted-foreground">Recommended: 20-45 minutes</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-per-question" className="text-sm font-medium">
                Time Per Question (minutes)
              </Label>
              <Input
                id="time-per-question"
                type="number"
                value={timePerQuestion}
                onChange={(e) => onTimePerQuestionChange(Number(e.target.value))}
                min={2}
                max={15}
              />
              <p className="text-xs text-muted-foreground">Recommended: 3-7 minutes</p>
            </div>
          </div>

          <Alert className="mt-4">
            <HelpCircle className="h-4 w-4" />
            <AlertDescription>
              Estimated interview duration: ~{interviewDuration} minutes for {questionCount}{" "}
              questions
            </AlertDescription>
          </Alert>
        </div>

        {/* Interview Flow Settings */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
          <h3 className="font-semibold text-sm">Interview Flow</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Enable Breaks Between Questions</Label>
                <p className="text-xs text-muted-foreground">
                  Give candidates brief breaks to compose their thoughts
                </p>
              </div>
              <Switch
                checked={enableBreaksBetweenQuestions}
                onCheckedChange={onEnableBreaksChange}
              />
            </div>

            {enableBreaksBetweenQuestions && (
              <div className="ml-4 space-y-2">
                <Label htmlFor="break-duration" className="text-sm font-medium">
                  Break Duration (seconds)
                </Label>
                <Input
                  id="break-duration"
                  type="number"
                  value={breakDuration}
                  onChange={(e) => onBreakDurationChange(Number(e.target.value))}
                  min={1}
                  max={30}
                />
                <p className="text-xs text-muted-foreground">Typical: 2-5 seconds</p>
              </div>
            )}

            <div className="border-t pt-4 flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Allow Candidate Questions</Label>
                <p className="text-xs text-muted-foreground">
                  Let candidates ask questions at the end of interview
                </p>
              </div>
              <Switch
                checked={allowCandidateQuestions}
                onCheckedChange={onAllowCandidateQuestionsChange}
              />
            </div>

            <div className="border-t pt-4 flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Allow Skipping Questions</Label>
                <p className="text-xs text-muted-foreground">
                  Permit candidates to skip difficult questions
                </p>
              </div>
              <Switch
                checked={allowCandidateToSkipQuestions}
                onCheckedChange={onAllowSkipQuestionsChange}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
