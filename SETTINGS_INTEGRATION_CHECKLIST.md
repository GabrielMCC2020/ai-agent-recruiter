# Settings Integration Checklist

## ✅ Completed Implementations

### Database & Context
- [x] Created `recruiterSettings` table in schema
- [x] Added `SettingsProvider` React Context
- [x] Created `useSettings()` hook
- [x] Added SettingsProvider to dashboard layout

### API Endpoints
- [x] Settings API (`/api/settings`) - GET, PUT methods
- [x] Question Generation API (`/api/interviews/generate-questions`)
- [x] Updated Interview Creation API (`/api/interview/create`) to return settings

### Components
- [x] VoiceAgentSettings component
- [x] InterviewConfigurationSettings component  
- [x] AIPromptSettings component
- [x] NotificationSettings component
- [x] PerformanceSettings component
- [x] Settings page (`/dashboard/settings`)

### UI Integration
- [x] Interview page shows settings-based duration
- [x] Interview page displays company logo from settings
- [x] Interview page shows requirements based on recording setting
- [x] Interview creation includes settings metadata

### Utilities
- [x] Settings utility functions (`lib/utils/settings-utils.ts`)
- [x] System prompt builder
- [x] Configuration helpers
- [x] Feature flag functions

---

## 🔄 Recommended Next Steps

### 1. Interview Session Page Integration
File: `/interview/[interviewId]/session/page.tsx`

**What needs updating:**
- Use `questionCount` from settings instead of hardcoded `MAX_QUESTIONS`
- Apply language preference from settings to speech recognition
- Use `voiceType` and `voiceTone` in system prompt
- Respect `autoSaveResponses` setting for saving logic
- Use `timePerQuestion` for question timing
- Apply break settings (`enableBreaksBetweenQuestions`, `breakDuration`)

**How to implement:**
```typescript
// At top of file, add:
import { useSettings } from "@/lib/context/settings-context";

// In component:
const { settings } = useSettings();
const maxQuestions = settings?.questionCount || 8;
const srLanguage = settings?.languagePreference || "en-US";

// Replace hardcoded constants with dynamic values
```

### 2. Question Generation Integration
File: `/interview/[interviewId]/session/page.tsx`

**What needs updating:**
- Use `/api/interviews/generate-questions` instead of hardcoded questions
- Pass job description and position to generation endpoint
- Use returned configuration data

### 3. Interview Summary Generation
File: `/api/interview/summary/route.ts`

**What needs updating:**
- Use `evaluationCriteria` from settings for scoring
- Apply `systemPrompt` and `customInstructions` to the LLM prompt
- Include criteria in the scoring rubric

### 4. Email Notification Integration
File: Email service integration needed

**What needs implementing:**
- Send summary email if `sendInterviewSummaryEmail` is true
- Schedule reminder email if `sendCandidateReminder` is true
- Use `reminderTime` for scheduling
- Include company branding in emails (logo, name)

### 5. Recording & Transcript
File: Interview session recording logic

**What needs implementing:**
- Only show camera/recording UI if `enableRecording` is true
- Generate transcript only if `enableTranscript` is true
- Store recordings based on settings

### 6. Interview Creation Flow
File: Dashboard components (job creation, interview sending)

**What needs updating:**
- When sending interview invites, fetch company settings
- Include company branding in invite emails
- Use interview configuration in email template

---

## 📋 Code Examples for Integration

### Using Settings in Interview Session
```typescript
import { useSettings } from "@/lib/context/settings-context";

export default function InterviewSessionPage() {
  const { settings } = useSettings();
  
  // Access settings
  const questionCount = settings?.questionCount || 8;
  const interviewDuration = settings?.interviewDuration || 30;
  const voiceType = settings?.voiceType || "professional";
  
  // Update fetching logic
  useEffect(() => {
    if (settings) {
      // Generate questions with settings
      generateQuestionsWithSettings();
    }
  }, [settings]);
}
```

### Using Settings in APIs
```typescript
export async function POST(request: Request) {
  const { userId } = await auth();
  
  // Fetch settings
  const user = await db.select().from(users)
    .where(eq(users.clerkId, userId)).limit(1);
    
  const settings = await db.select().from(recruiterSettings)
    .where(eq(recruiterSettings.userId, user[0].id)).limit(1);
  
  // Use settings data
  const config = getInterviewConfiguration(settings[0]);
  
  // Apply in business logic
  const questions = generateQuestions(config);
}
```

### Settings-Based Question Generation
```typescript
async function generateQuestionsWithSettings() {
  const response = await fetch("/api/interviews/generate-questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobDescription,
      position: "Senior Developer"
    })
  });
  
  const { questions, configuration } = await response.json();
  
  // Use configuration for timing, breaks, etc.
  setMaxQuestions(configuration.totalQuestions);
  setTimePerQuestion(configuration.timePerQuestion);
}
```

---

## 🧪 Testing Scenarios

### Test 1: Settings Override
1. Go to `/dashboard/settings`
2. Change `questionCount` to 3
3. Save settings
4. Start a new interview
5. Verify only 3 questions are asked

### Test 2: Voice Personality
1. Change `voiceType` to "friendly" and `voiceTone` to "warm"
2. Start interview
3. Verify AI agent responds with new personality in prompts

### Test 3: Recording Feature
1. Disable `enableRecording` in settings
2. Go to interview page
3. Verify "Working camera" is NOT in requirements list

### Test 4: Question Distribution
1. Set `technicalQuestionsPercentage` to 80
2. Generate questions
3. Verify ~80% of questions are technical

### Test 5: Duration Display  
1. Set `interviewDuration` to 60 minutes
2. Go to `/interview/[id]`
3. Verify duration shows as "1 hour"

### Test 6: Evaluation Criteria
1. Add custom criteria: "Problem Solving", "Communication"
2. Complete interview
3. Verify summary includes these criteria in evaluation

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   Recruiter Settings                         │
│                  (Database Table)                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              SettingsProvider                                │
│          (React Context at /dashboard)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
       ┌────────┐   ┌────────┐   ┌────────┐
       │Settings│   │Interview│  │Settings │
       │Page    │   │Page    │   │Utils   │
       └────────┘   └────────┘   └────────┘
            │            │            │
            ▼            ▼            ▼
       ┌──────────────────────────────────────┐
       │  API Endpoints                        │
       ├──────────────────────────────────────┤
       │ /api/settings                        │
       │ /api/interviews/generate-questions   │
       │ /api/interview/create                │
       │ /api/interview/summary               │
       └──────────────────────────────────────┘
            │            │            │
            ▼            ▼            ▼
       ┌─────┐      ┌──────┐     ┌──────┐
       │DB   │      │LLM   │     │Email │
       └─────┘      └──────┘     └──────┘
```

---

## 🔐 Security Considerations

- [x] Settings tied to authenticated user via `userId`
- [x] Settings not exposed in public URLs
- [x] Company logo URL validation in UI (fallback on error)
- [ ] TODO: Add rate limiting to settings API
- [ ] TODO: Add audit logging for settings changes
- [ ] TODO: Encrypt sensitive prompts in transit

---

## 📝 Documentation Files

- **SETTINGS_INTEGRATION.md** - Detailed integration guide
- **SETTINGS_INTEGRATION_CHECKLIST.md** - This file
- **COMPONENT_USAGE_GUIDE.md** - Component examples
- **IMPLEMENTATION_COMPLETE.md** - Previous implementations

---

## 🚀 Performance Notes

- Settings loaded once at dashboard mount
- Cached in React context
- Available to all child routes
- No refetch needed unless explicitly updated
- Settings metadata returned with interview creation

---

## Summary

All foundational settings infrastructure is in place. The next phase is integrating settings into:
1. Interview session flow (question count, timing, voice)
2. Email notifications (summary, reminders)
3. Recording management (enable/disable video)
4. Summary generation (criteria, custom prompts)

This will make the recruiter experience fully customizable with zero friction - set it once in settings, applies to all interviews automatically.
