# Interview & Schedule Page - Quick Start Guide

## 🎯 What's New

The Interview & Schedule page gives you a complete dashboard to manage interview invites and results in one place.

## 📍 How to Access

1. Go to Dashboard
2. Click on **"Interview & Schedule"** in the sidebar
3. You'll see:
   - **Left side**: All pending interview invites waiting for candidate responses
   - **Right side**: Completed interviews with performance scores

## 🔍 How to Use

### Viewing Interview Invites (Left Column)

Each invite card shows:
```
┌─────────────────────────────────────┐
│ 📧 Invited                          │
│ John Doe                            │
│ john@example.com                    │
│                                     │
│ Position: Senior Developer          │
│ Job: React Developer Position       │
│ Invited: Mar 10, 2026               │
│                                     │
│ [Resend Invite]                    │
└─────────────────────────────────────┘
```

**Available Actions:**
- **Status Indicators**: 
  - 📧 **Invited** - Waiting for response
  - ⏳ **In Progress** - Currently taking interview
- **Resend Invite**: Send reminder email to candidate

### Viewing Completed Interviews (Right Column)

Each interview result shows:
```
┌──────────────────────────────────────┐
│ Jane Smith                    90%    │
│ jane@example.com           ┌─────┐  │
│                            │GOOD │  │
│ Position: Frontend Dev      └─────┘  │
│ Job: React Developer                │
│                                     │
│ ✅ HIRE RECOMMENDATION             │
│ [View Details]                      │
└──────────────────────────────────────┘
```

**Performance Scores:**
- 🟢 **90% - Excellent** = Hire
- 🔵 **75% - Good** = Good candidate
- 🟡 **60% - Average** = Consider
- 🔴 **30% - Poor** = Reject

### Filtering & Searching

**Search Bar** (Top Left)
- Type candidate name, email, or position
- Results update in real-time

**Job Filter Dropdown** (Top Middle)
- Select "All Jobs" to see everything
- Select specific job to see only those invites/interviews

**Statistics** (Top Right)
- **Pending**: Count of waiting interviews
- **Completed**: Count of finished interviews

## 📋 View Interview Details

1. Click **"View Details"** button on any completed interview
2. A modal opens showing:
   - Full candidate information
   - Complete interview summary
   - **Strengths** (green section with ✓)
   - **Areas for Improvement** (red section with !)
   - Overall rating percentage
   - Recommendation (Hire/Consider/Reject)
   - Interview ID and completion date

## 💡 Common Tasks

### Find a specific candidate
1. Type candidate name in search box
2. See pending invites and completed interviews for that candidate

### Check results for a specific job
1. Select job from "Filter by job" dropdown
2. All invites and interviews for that job appear

### Check candidate performance
1. Find candidate in Completed Interviews (right column)
2. Look at percentage score
3. Click "View Details" for full feedback

### Resend invite to candidate
1. Find candidate in Pending Invites (left column)
2. Click "Resend Invite" button
3. Email will be sent

## 📊 Understanding Performance Scores

The percentage score is calculated from AI evaluation:
- **Technical Skills**: How well candidate answered tech questions
- **Communication**: Clarity and articulation
- **Problem Solving**: Approach to challenges
- **Fit**: Match with job requirements

### Score Interpretation
| Score | Rating | Recommendation |
|-------|--------|----------------|
| 80%+ | Excellent | ✅ Hire |
| 60-79% | Average | 👁️ Consider |
| <60% | Poor | ❌ Reject |

## 🎨 UI Features

### Color Coding
- **Green cards/badges** = Excellent performance or hire recommendation
- **Blue** = Good performance or invited status
- **Yellow/Amber** = Average or in-progress status
- **Red** = Poor performance or reject recommendation

### Status Badges
- 📧 **Invited** = Invite sent, awaiting response
- ⏳ **In Progress** = Candidate is currently interviewing
- ✅ **Hire** = Recommended to hire
- ❌ **Reject** = Recommended to reject
- 🤔 **Consider** = Could be a good fit

## ❓ FAQ

**Q: Why don't I see any interviews?**
A: You need to:
1. Create a job posting first
2. Send interview invites from the Jobs page
3. Wait for candidates to complete interviews

**Q: How do I send interview invites?**
A: Go to Jobs → Click on a job → Click "Find Matching Candidates" → Select candidates → Choose interview type → Send Invites

**Q: Can I filter by multiple criteria?**
A: Yes! Search and job filter work together. You can search within a specific job's candidates.

**Q: What does "In Progress" mean?**
A: The candidate has started their interview but hasn't finished yet.

**Q: How long does it take to see results?**
A: As soon as the candidate completes their interview, the results appear in the Completed Interviews section.

## 🚀 Next Steps

1. **Monitor Invites**: Check pending invites regularly for candidate responses
2. **Review Results**: Review completed interviews as they come in
3. **Make Decisions**: Use the recommendations to guide hiring decisions
4. **Follow Up**: Use candidate information to schedule next rounds

## 💬 Tips

- Regular candidates by performance score to rank candidates
- Use "View Details" to read full summaries before making decisions
- Combine data with resumes and job requirements for final decisions
- Track candidate progression from invite to completion

---

**Need Help?** Check the INTERVIEW_SCHEDULE_FEATURE.md for technical details and feature documentation.
