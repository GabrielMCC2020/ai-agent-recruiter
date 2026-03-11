import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, Volume2 } from "lucide-react";

interface VoiceAgentSettingsProps {
  voiceType: string;
  voiceTone: string;
  languagePreference: string;
  onVoiceTypeChange: (value: string) => void;
  onVoiceToneChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
}

export function VoiceAgentSettings({
  voiceType,
  voiceTone,
  languagePreference,
  onVoiceTypeChange,
  onVoiceToneChange,
  onLanguageChange,
}: VoiceAgentSettingsProps) {
  return (
    <Card>
<CardHeader>
        <div className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-blue-500" />
          <div>
            <CardTitle>Configuración del Agente de Voz</CardTitle>
            <CardDescription>
              Personaliza cómo el agente de voz de IA interactúa con los candidatos
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="voice-type" className="text-sm font-medium">
            Voice Type
          </Label>
          <Select value={voiceType} onValueChange={onVoiceTypeChange}>
            <SelectTrigger id="voice-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">
                Professional (Formal & Structured)
              </SelectItem>
              <SelectItem value="friendly">
                Friendly (Warm & Approachable)
              </SelectItem>
              <SelectItem value="formal">
                Formal (Rigorous & Demanding)
              </SelectItem>
              <SelectItem value="casual">
                Casual (Relaxed & Conversational)
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Choose the personality and style of the voice agent
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="voice-tone" className="text-sm font-medium">
            Voice Tone
          </Label>
          <Select value={voiceTone} onValueChange={onVoiceToneChange}>
            <SelectTrigger id="voice-tone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neutral">Neutral & Balanced</SelectItem>
              <SelectItem value="warm">Warm & Encouraging</SelectItem>
              <SelectItem value="energetic">Energetic & Enthusiastic</SelectItem>
              <SelectItem value="calm">Calm & Composed</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Set the emotional tone of interactions
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language" className="text-sm font-medium">
            Language Preference
          </Label>
          <Select value={languagePreference} onValueChange={onLanguageChange}>
            <SelectTrigger id="language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish (Español)</SelectItem>
              <SelectItem value="french">French (Français)</SelectItem>
              <SelectItem value="german">German (Deutsch)</SelectItem>
              <SelectItem value="chinese">Chinese (中文)</SelectItem>
              <SelectItem value="japanese">Japanese (日本語)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Select the primary language for interviews
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
