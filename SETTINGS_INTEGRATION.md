# Settings Integration Guide

## Overview
All recruiter settings are now globally connected to the application. This documentation explains how each setting is used throughout the system.

## Architecture

### Settings Flow
```
Recruiter Settings (Database)
    ↓
SettingsProvider (React Context)
    ↓
useSettings() Hook  
    ↓
Settings Utils Functions
    ↓
Components & APIs
```

## Settings Integration Points

### 1. **Interview Configuration Settings**

#### Applied To:
- Question Generation (`/api/interviews/generate-questions`)
- Interview Creation (`/api/interview/create`)
- Interview Session Page (`/interview/[interviewId]/session`)

#### Settings Used:
- `questionCount` - Determines total number of questions per interview (3-20)
- `technicalQuestionsPercentage` - Controls tech vs behavioral question split
- `behavioralQuestionsPercentage` - Automatically synced with technical %
- `questionDifficulty` - Affects question pool selection (easy/medium/hard/mixed)
- `interviewDuration` - Total time allowed for interview
- `timePerQuestion` - Average time per question
- `enableBreaksBetweenQuestions` - Adds breaks between questions
- `breakDuration` - Length of breaks in seconds
- `allowCandidateQuestions` - Permits Q&A at end
- `allowCandidateToSkipQuestions` - Allows skipping difficult questions

#### Example Usage:
```typescript
// In question generation
const totalQuestions = config.questionCount; // 5
const technicalCount = Math.round((5 * 60) / 100); // 3 technical
const behavioralCount = 5 - 3; // 2 behavioral

// Questions are selected based on difficulty
const questions = technicalQuestionPrompts[config.questionDifficulty];
```

---

### 2. **Voice Agent Settings**

#### Applied To:
- Interview Session Page (voice personality)
- API Endpoints (system prompt configuration)
- Question Generation (context)

#### Settings Used:
- `voiceType` - Agent personality (professional/friendly/formal/casual)
- `voiceTone` - Emotional tone (neutral/warm/energetic/calm)
- `languagePreference` - Interview language (6+ languages)

#### Impact:
- Affects how AI agent communicates
- Influences candidate experience
- Part of system prompt for LLM

#### Example:
```typescript
// System prompt construction
const voiceSection = `
Communication Style:
- Voice Type: ${settings.voiceType}
- Tone: ${settings.voiceTone}
- Be ${settings.voiceTone} and ${settings.voiceType.toLowerCase()} in your approach
`;
```

---

### 3. **AI Prompt & Evaluation Settings**

#### Applied To:
- Interview Question Generation
- Interview Summary Generation (`/api/interview/summary`)
- Answer Evaluation

#### Settings Used:
- `systemPrompt` - Base prompt for AI agent behavior
- `evaluationCriteria` - Criteria for scoring responses (e.g., "Technical Skills", "Communication")
- `customInstructions` - Role-specific guidance

#### Impact:
- Determines how interview is conducted
- Defines evaluation framework
- Customizes feedback for specific roles

#### Example:
```typescript
// Build complete system prompt
const systemPrompt = buildSystemPrompt(
  settings,
  position,
  companyName
);

// Criteria used in summary generation
const criteriaText = settings.evaluationCriteria
  .map(c => `- ${c}`)
  .join("\n");
```

---

### 4. **Notification Settings**

#### Applied To:
- Interview Completion Workflow
- Email Service Integration

#### Settings Used:
- `sendInterviewSummaryEmail` - Auto-send summary after interview
- `sendCandidateReminder` - Send pre-interview reminder email
- `reminderTime` - Hours before interview to send reminder

#### Impact:
- Automates communication
- Saves recruiter time
- Keeps candidates informed

#### Implementation Points:
```typescript
// In interview summary generation
if (settings.sendInterviewSummaryEmail) {
  await sendSummaryEmail(summary, candidate.email);
}

// In interview scheduling
if (settings.sendCandidateReminder) {
  scheduleReminderEmail(
    candidate.email,
    interview.datetime,
    settings.reminderTime * 60 * 60 * 1000
  );
}
```

---

### 5. **Performance & Recording Settings**

#### Applied To:
- Interview Session Lifecycle
- Data Storage & Processing

#### Settings Used:
- `autoSaveResponses` - Auto-save candidate responses during interview
- `enableRecording` - Record audio/video for quality review
- `enableTranscript` - Generate AI transcript of interview

#### Impact:
- Data backup & recovery
- Quality assurance
- Better analytics

#### Usage:
```typescript
// In interview session
if (settings.autoSaveResponses) {
  await autoSaveResponse(response);
}

// In interview requirements display
requirements.push(
  settings.enableRecording ? "Working camera" : null
);
```

---

### 6. **Branding Settings**

#### Applied To:
- Interview Start Page (`/interview/[interviewId]`)
- Interview Header
- Email Communications
- Interview Session UI

#### Settings Used:
- `companyName` - Display company name to candidates
- `companyLogo` - Show company logo URL

#### Impact:
- Professional appearance
- Company branding in candidate experience
- Personalized communications

#### Usage:
```typescript
// In interview page
{companyBranding.logo ? (
  <img src={companyBranding.logo} alt="Logo" />
) : (
  <DefaultIcon />
)}

// In emails
const emailTemplate = `
Dear Candidate,
${companyName} would like to invite you to an interview...
`;
```

---

## Connected Components & APIs

### Frontend Components

#### 1. **SettingsProvider** (`lib/context/settings-context.tsx`)
- Wraps entire dashboard
- Provides `useSettings()` hook
- Auto-fetches on mount
- Manages loading & error states

```typescript
const { settings, loading, error, refreshSettings } = useSettings();
```

#### 2. **Interview Page** (`app/interview/[interviewId]/page.tsx`)
- Fetches settings on mount
- Shows company logo if available
- Displays duration based on settings
- Creates interview with settings context

#### 3. **Settings Page** (`app/dashboard/settings/page.tsx`)
- Displays all 5 setting categories
- Real-time change tracking
- Save/Reset functionality
- Sticky save bar

### Backend APIs

#### 1. **Settings API** (`/api/settings`)
- `GET` - Fetch or create default settings
- `PUT` - Update settings
- Returns full RecruiterSettings object

#### 2. **Question Generation** (`/api/interviews/generate-questions`)
- Uses settings to generate questions
- Returns questions with configuration metadata
- Respects difficulty, count, and type percentages

#### 3. **Interview Creation** (`/api/interview/create`)
- Fetches user settings from DB
- Returns settings metadata with interview
- Enables client-side configuration

#### 4. **Interview Summary** (`/api/interview/summary`)
- Uses evaluation criteria from settings
- Applies custom system prompt
- Generates scores based on criteria

---

## Usage Example: Complete Interview Flow

### 1. Recruiter Configures Settings
```
Settings Page → Update 5 question / 95% technical / 45min interview
                → Save to DB
```

### 2. Recruiter Sends Invites
```
Dashboard → Send Invites → Email includes company logo from settings
```

### 3. Candidate Starts Interview
```
/interview/[id] → Load company branding
                → Show duration from settings
                → List requirements based on recording setting
```

### 4. Interview Session Starts
```
/interview/[id]/session → Generate questions (5 total, 95% technical)
                        → Use voice settings (professional, warm tone)
                        → Auto-save responses if enabled
                        → Record if enabled
```

### 5. Interview Completes
```
Summary API → Generate summary using evaluation criteria
            → Apply custom prompt/instructions
            → Send email if setting enabled
```

---

## Settings Utils Helper Functions

All utility functions in `lib/utils/settings-utils.ts`:

### Configuration Builders
- `getInterviewConfiguration()` - Get all interview config
- `buildSystemPrompt()` - Generate complete AI prompt
- `getInterviewDurationText()` - Format duration nicely

### Feature Flags
- `shouldAutoSave()` - Check auto-save enabled
- `shouldRecordInterview()` - Check recording enabled
- `shouldGenerateTranscript()` - Check transcript enabled
- `shouldSendSummaryEmail()` - Check email enabled
- `shouldSendCandidateReminder()` - Check reminder enabled

### Data Getters
- `getCandidateReminderHours()` - Get reminder timing
- `getCompanyBranding()` - Get name & logo
- `getVoiceSettings()` - Get voice configuration

---

## How to Add New Settings

1. **Add to Schema** (`lib/db/schema.ts`)
   - Add new column to `recruiterSettings` table

2. **API Endpoint** (`/api/settings/route.ts`)
   - Include in GET default values
   - Include in PUT update

3. **Settings Component** (`components/settings/*.tsx`)
   - Create UI component for setting
   - Pass change handler

4. **Main Page** (`app/dashboard/settings/page.tsx`)
   - Add component to settings page
   - Connect to state update

5. **Utilities** (`lib/utils/settings-utils.ts`)
   - Add helper function if needed

6. **Usage**
   - Use `useSettings()` hook in components
   - Call utility helper functions in APIs

---

## Error Handling

### In Components
```typescript
const { settings, loading, error } = useSettings();

if (loading) return <LoadingState />;
if (error) return <ErrorState message={error} />;
if (!settings) return <NoSettingsState />;

// Use settings safely
```

### In APIs
```typescript
if (!settings.length) {
  // Create defaults
  const defaults = await db.insert(...).returning();
  settings = defaults;
}
```

---

## Performance Optimization

- Settings fetched once at dashboard mount (via provider)
- Cached in React context
- Available to all child components
- Refresh available via `refreshSettings()` after updates

---

## Testing Settings Integration

### 1. Test Settings Page
- Navigate to `/dashboard/settings`
- Change values
- Save and verify in DB

### 2. Test Interview Settings Impact  
- Generate interview questions - count/difficulty should change
- Check duration displayed on interview page
- Verify company logo shows if set

### 3. Test Feature Flags
- Toggle recording - requirements list updates
- Toggle reminder - email should/shouldn't send
- Toggle auto-save - responses behavior changes

---

## Summary

All settings are now globally integrated:

✅ Database Schema (RecruiterSettings table)  
✅ React Context (SettingsProvider + useSettings hook)  
✅ API Integration (All endpoints use settings)  
✅ Component Integration (Pages fetch and use settings)  
✅ Utility Functions (Easy setting access)  
✅ Error Handling (Fallbacks & defaults)  
✅ Feature Flags (Enable/disable functionality)

The recruiter no longer needs to manually configure each interview - all settings apply automatically to all interviews until changed.
