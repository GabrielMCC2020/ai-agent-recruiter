# Interview & Schedule Page - Feature Documentation

## Overview
The Interview & Schedule page provides recruiters with a comprehensive view of:
- **Pending Interview Invites** - Candidates awaiting interview responses
- **Completed Interviews** - Interview results with performance scores and recommendations

## Features

### 1. Two-Column Grid Layout
- **Left Column**: Pending Invites
- **Right Column**: Completed Interviews
- Responsive design that stacks on mobile

### 2. Search & Filter Functionality
- **Search bar**: Filter candidates by name, email, or position
- **Job filter dropdown**: View invites/interviews for specific jobs
- **Live statistics**: Shows count of pending and completed interviews

### 3. Pending Invites Display
Each invite card shows:
- Candidate name and email
- Position applied for
- Associated job title
- Invite status (Invited/In Progress)
- Date invited
- Resend invite button (for scheduled invites)

Status badges:
- 📧 **Invited** - Invite sent, awaiting response
- ⏳ **In Progress** - Candidate currently taking interview

### 4. Completed Interviews Display
Each completed interview shows:
- Candidate name and email
- Overall performance score (as percentage: 0-100%)
- Associated job and position
- Recommendation badge:
  - ✅ **Hire** (green) - 80%+ score
  - 👁️ **Consider** (amber) - 60-79% score
  - ❌ **Reject** (red) - <60% score

Color coding:
- **Green (90%)**: Excellent performance
- **Blue (75%)**: Good performance
- **Yellow (60%)**: Average performance
- **Red (30%)**: Poor performance

### 5. Interview Details Modal
Click "View Details" on any completed interview to see:
- Full candidate information
- Interview date and time
- Complete summary
- Strengths (with ✓ checkmarks, green highlights)
- Areas for improvement (with ! indicators, red highlights)
- Interview ID and status
- Export as PDF option (UI ready)

## UI Components Used

### New Components Created
1. **PendingInvitesList** (`components/interview/pending-invites-list.tsx`)
   - Displays list of pending interview invites
   - Handles resend functionality
   - Status-based styling

2. **CompletedInterviewsList** (`components/interview/completed-interviews-list.tsx`)
   - Displays completed interviews with performance scores
   - Shows recommendations
   - Click to view details

3. **InterviewDetailsModal** (`components/interview/interview-details-modal.tsx`)
   - Full interview details viewer
   - Strengths and weaknesses breakdown
   - Score display
   - Recommendation indicator

### Updated Components
- **interviews/page.tsx** - Main dashboard page with two-column layout

## API Endpoints

### GET /api/interviews/schedule
Fetches all interview data for the logged-in user

**Response:**
```json
{
  "jobs": [/* User's jobs */],
  "pendingInvites": [/* Scheduled and in-progress interviews */],
  "completedInterviews": [/* Completed interviews with summaries */]
}
```

## Performance Scoring

Interview results are converted to percentages:
- **Excellent** → 90%
- **Good** → 75%
- **Average** → 60%
- **Poor** → 30%

## Filter Flow

1. **Job Filter**: Select a specific job to see only related interviews
2. **Search Filter**: Search by candidate name, email, or position
3. **Filters combine**: Both filters work together to narrow results
4. **Statistics update**: Stats automatically update based on current filters

## Empty States

The page handles multiple empty states:
- No jobs created yet
- No pending invites or completed interviews
- No results matching search/filter criteria
- All with appropriate icons and helpful messages

## Responsive Design
- **Desktop**: Two-column grid layout side-by-side
- **Tablet**: Two columns with adjusted spacing
- **Mobile**: Single column stack (left column first, then right)

## Future Enhancements
1. Bulk actions (select multiple candidates)
2. Interview comparison between candidates
3. Export interview results as PDF/Excel
4. Email candidates with feedback
5. Schedule follow-up interviews
6. Interview notes and annotations
7. Team collaboration features

## Data Model

### Pending Invites
- id, interviewId, candidateName, candidateEmail
- position, title (job), status, createdAt

### Completed Interviews
- id, interviewId, candidateName, candidateEmail
- position, title, completedAt
- summary, overallRating, strengths, weaknesses, recommendation

## Styling & Colors

- **Blue (#2563eb)**: Pending/Email actions
- **Green (#16a34a)**: Hire recommendations, strengths
- **Red (#dc2626)**: Reject recommendations, areas to improve
- **Amber (#d97706)**: Consider recommendations, in-progress
- **Primary**: Main theme color for CTAs and emphasis

## Database Schema Note

The system uses existing schema:
- `interviews` table - stores interview records
- `interviewSummaries` table - stores AI-generated summaries with ratings
- `jobs` table - job postings
- `candidates` table - candidate information

No schema changes were required; the feature utilizes existing relationships.
