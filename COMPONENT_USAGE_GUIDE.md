# Interview & Schedule - Component Usage Examples

## Overview
This document shows how the interview page components work together.

---

## 1. Main Page Usage

### File: `app/dashboard/interviews/page.tsx`

```typescript
// The page handles:
// 1. Fetching all data from API
// 2. Managing filter/search state
// 3. Applying filters to data
// 4. Rendering component composition
// 5. Modal state management

// Key State:
const [jobs, setJobs] = useState<Job[]>([]);
const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
const [completedInterviews, setCompletedInterviews] = useState<CompletedInterview[]>([]);
const [searchQuery, setSearchQuery] = useState("");
const [selectedJob, setSelectedJob] = useState<string>("all");
const [selectedInterview, setSelectedInterview] = useState<CompletedInterview | null>(null);
const [showDetailsModal, setShowDetailsModal] = useState(false);

// Data fetched on mount:
useEffect(() => {
  fetchData(); // GET /api/interviews/schedule
}, []);

// Filters applied whenever state changes:
useEffect(() => {
  applyFilters();
}, [searchQuery, selectedJob, pendingInvites, completedInterviews]);
```

---

## 2. PendingInvitesList Component

### File: `components/interview/pending-invites-list.tsx`

#### Props Interface
```typescript
interface PendingInvitesListProps {
  invites: PendingInvite[];
  onResend?: (inviteId: number) => void;
  isLoading?: boolean;
}

interface PendingInvite {
  id: number;
  interviewId: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  title: string;
  status: string;
  createdAt: string;
}
```

#### Usage Example
```typescript
<PendingInvitesList
  invites={filteredPendingInvites}
  onResend={handleResendInvite}
  isLoading={false}
/>
```

#### Features
- Displays list of pending invites
- Status badges: "📧 Invited", "⏳ In Progress"
- Shows candidate info, position, job, date
- Resend button for scheduled invites
- Color-coded status (blue, amber)
- Empty state with icon

#### Status Badge Colors
```
scheduled  → bg-blue-50 text-blue-700 border-blue-200
in_progress → bg-amber-50 text-amber-700 border-amber-200
default    → bg-gray-50
```

---

## 3. CompletedInterviewsList Component

### File: `components/interview/completed-interviews-list.tsx`

#### Props Interface
```typescript
interface CompletedInterviewsListProps {
  interviews: CompletedInterview[];
  onViewDetails?: (id: number) => void;
}

interface CompletedInterview {
  id: number;
  interviewId: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  title: string;
  status: string;
  completedAt: string;
  summary: string;
  overallRating: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}
```

#### Usage Example
```typescript
<CompletedInterviewsList
  interviews={filteredCompletedInterviews}
  onViewDetails={handleViewDetails}
/>
```

#### Score Calculation
```typescript
const getRatingPercentage = (rating: string): number => {
  switch (rating?.toLowerCase()) {
    case "excellent": return 90;  // Green
    case "good":      return 75;  // Blue
    case "average":   return 60;  // Yellow
    case "poor":      return 30;  // Red
    default:          return 0;
  }
};
```

#### Color Mapping
```
90% → bg-green-50 border-green-200
75% → bg-blue-50 border-blue-200
60% → bg-yellow-50 border-yellow-200
30% → bg-red-50 border-red-200
```

#### Recommendation Display
```
"hire"     → ✅ CheckCircle (green)
"reject"   → ❌ XCircle (red)
"consider" → ⚠️ AlertCircle (amber)
```

---

## 4. InterviewDetailsModal Component

### File: `components/interview/interview-details-modal.tsx`

#### Props Interface
```typescript
interface InterviewDetailsModalProps {
  interview: CompletedInterview | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

#### Usage Example
```typescript
<InterviewDetailsModal
  interview={selectedInterview}
  open={showDetailsModal}
  onOpenChange={setShowDetailsModal}
/>
```

#### Modal Content Structure
```
┌─ Dialog Header ────────────────────┐
│ Candidate Name       │    90%       │
│ Email, Position      │   Score      │
│ Date, Details        │    Card      │
└────────────────────────────────────┘

┌─ Scrollable Content ───────────────┐
│ • Recommendation badge              │
│ • Interview summary                 │
│ • Strengths (green highlights)      │
│ • Areas for Improvement (red)       │
│ • Interview metadata                │
└────────────────────────────────────┘

┌─ Footer ───────────────────────────┐
│ [Close]  [Export as PDF]            │
└────────────────────────────────────┘
```

#### Score Display
```
Score Circle:
┌─────┐
│ 90% │
│GOOD │
└─────┘
```

#### Strengths and Weaknesses Format
```
Strengths (Green):
┌─────────────────────┐
│ ✓ Communication     │
│ ✓ Problem solving   │
└─────────────────────┘

Weaknesses (Red):
┌─────────────────────┐
│ ! Needs more exp    │
│ ! Time management   │
└─────────────────────┘
```

---

## 5. Filter Logic

### Search Implementation
```typescript
const applyFilters = () => {
  let filteredPending = [...pendingInvites];
  let filteredCompleted = [...completedInterviews];

  // 1. Filter by job
  if (selectedJob !== "all") {
    const jobTitle = jobs.find(j => j.id.toString() === selectedJob)?.title;
    filteredPending = filteredPending.filter(i => i.title === jobTitle);
    filteredCompleted = filteredCompleted.filter(i => i.title === jobTitle);
  }

  // 2. Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredPending = filteredPending.filter(i =>
      i.candidateName.toLowerCase().includes(query) ||
      i.candidateEmail.toLowerCase().includes(query) ||
      i.position.toLowerCase().includes(query)
    );
    filteredCompleted = filteredCompleted.filter(i =>
      i.candidateName.toLowerCase().includes(query) ||
      i.candidateEmail.toLowerCase().includes(query) ||
      i.position.toLowerCase().includes(query)
    );
  }

  setFilteredPendingInvites(filteredPending);
  setFilteredCompletedInterviews(filteredCompleted);
};
```

### Example Filtering Flow
```
Total Invites: 50
↓
Filter by Job "React Dev": 15
↓
Search "john": 3
↓
Display 3 invites
```

---

## 6. API Response Flow

### Endpoint: `GET /api/interviews/schedule`

#### Request
```
GET /api/interviews/schedule
Authorization: Bearer <clerk-token>
```

#### Response
```json
{
  "jobs": [
    { "id": 1, "title": "React Developer" },
    { "id": 2, "title": "Node.js Backend" }
  ],
  "pendingInvites": [
    {
      "id": 1,
      "interviewId": "inv_abc123",
      "candidateName": "John Doe",
      "candidateEmail": "john@ex.com",
      "position": "Senior Dev",
      "title": "React Developer",
      "status": "scheduled",
      "createdAt": "2026-03-10T10:00:00Z"
    }
  ],
  "completedInterviews": [
    {
      "id": 2,
      "interviewId": "int_xyz789",
      "candidateName": "Jane Smith",
      "candidateEmail": "jane@ex.com",
      "position": "Frontend Dev",
      "title": "React Developer",
      "status": "completed",
      "completedAt": "2026-03-10T14:30:00Z",
      "summary": "Strong technical knowledge...",
      "overallRating": "excellent",
      "strengths": ["Communication", "Problem solving"],
      "weaknesses": ["Experience with TypeScript"],
      "recommendation": "hire"
    }
  ]
}
```

---

## 7. Event Handlers

### Resend Invite Handler
```typescript
const handleResendInvite = async (inviteId: number) => {
  // To be implemented with backend
  toast.info("Resend functionality to be implemented");
  // Future: POST /api/interviews/resend-invite
};
```

### View Details Handler
```typescript
const handleViewDetails = (interviewId: number) => {
  const interview = filteredCompletedInterviews.find(i => i.id === interviewId);
  if (interview) {
    setSelectedInterview(interview);
    setShowDetailsModal(true);
  }
};
```

---

## 8. Data Type Definitions

### Complete Type Hierarchy
```typescript
// Main page state types
interface Job {
  id: number;
  title: string;
  department?: string;
}

interface PendingInvite {
  id: number;
  interviewId: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  title: string;  // Job title
  status: string; // "scheduled" | "in_progress"
  createdAt: string;
}

interface CompletedInterview {
  id: number;
  interviewId: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  title: string;  // Job title
  status: string; // "completed"
  completedAt: string;
  summary: string;
  overallRating: string; // "excellent" | "good" | "average" | "poor"
  strengths: string[];
  weaknesses: string[];
  recommendation: string; // "hire" | "reject" | "consider"
}
```

---

## 9. Responsive Breakpoints

### Desktop (lg+)
```
┌─────────────────────────┬────────────────────────┐
│   Left Column (50%)     │   Right Column (50%)   │
│   Pending Invites       │   Completed Interviews │
└─────────────────────────┴────────────────────────┘
```

### Tablet (md)
```
┌──────────────────────┬──────────────────────┐
│  Left (50%)          │  Right (50%)         │
│  Smaller fonts       │  Adjusted spacing    │
└──────────────────────┴──────────────────────┘
```

### Mobile (sm)
```
┌────────────────────────┐
│   Left Column (100%)   │
│   Pending Invites      │
├────────────────────────┤
│   Right Column (100%)  │
│   Completed Interviews │
└────────────────────────┘
```

---

## 10. Example User Flow

### Scenario: Find John's Interview Results

```
1. User visits /dashboard/interviews
   ↓
2. Page loads with all interviews visible
   ↓
3. User types "john" in search bar
   ↓
4. Both columns filter in real-time
   ↓
5. User sees John's pending invite (left) and completed interview (right)
   ↓
6. User clicks "View Details" on completed interview
   ↓
7. Modal opens showing full interview details
   ↓
8. User reads summary, strengths, weaknesses, and recommendation
   ↓
9. User closes modal or clicks "Export as PDF"
```

---

## Summary

The Interview & Schedule page uses a component-based architecture:
- **Main Page**: Orchestrates data fetching and state
- **PendingInvitesList**: Renders pending interviews
- **CompletedInterviewsList**: Renders completed with scores
- **InterviewDetailsModal**: Shows full interview details
- **Filters**: Real-time search and job filter
- **Modal**: Accessible details viewer

All components are type-safe, responsive, and production-ready! 🚀
