# Interview & Schedule Page - Visual Guide

## 📺 Full Page Layout

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                   Interview & Schedule                                   ┃
┃         Manage interview invites and review completed interviews          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌───────────────────────────────────────────────────────────────────────────┐
│ 🔍 [Search candidates...]  [Filter by job ▼]    📧 Pending: 5  ✅ Done: 12  │
└───────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┬──────────────────────────────────┐
│  📧 PENDING INVITES (5)              │  ✅ COMPLETED INTERVIEWS (12)    │
├──────────────────────────────────────┼──────────────────────────────────┤
│                                      │                                  │
│ ┌──────────────────────────────────┐ │ ┌──────────────────────────────┐ │
│ │ John Doe                         │ │ │ Jane Smith            [90%]  │ │
│ │ john.doe@company.com             │ │ │ jane.smith@company.com [Card]│ │
│ │                                  │ │ │                              │ │
│ │ Position: Senior Developer       │ │ │ Position: Frontend Engineer  │ │
│ │ Job: React Developer Role        │ │ │ Job: React Developer Role    │ │
│ │ Status: 📧 Invited               │ │ │ Recommendation: ✅ HIRE      │ │
│ │ Date: Mar 10, 2026               │ │ │                              │ │
│ │                                  │ │ │ [View Details]               │ │
│ │ [Resend Invite]                  │ │ └──────────────────────────────┘ │
│ └──────────────────────────────────┘ │                                  │
│                                      │ ┌──────────────────────────────┐ │
│ ┌──────────────────────────────────┐ │ │ Michael Chen          [75%]  │ │
│ │ Sarah Johnson                    │ │ │ michael.chen@email.com  [Card]│ │
│ │ sarah.j@email.com                │ │ │                              │ │
│ │                                  │ │ │ Position: Backend Dev       │ │
│ │ Position: QA Engineer            │ │ │ Job: Python Backend Role     │ │
│ │ Job: QA Automation Role          │ │ │ Recommendation: 👁️ CONSIDER │ │
│ │ Status: ⏳ In Progress            │ │ │                              │ │
│ │ Date: Mar 8, 2026                │ │ │ [View Details]               │ │
│ │                                  │ │ └──────────────────────────────┘ │
│ │ [No action available]            │ │                                  │
│ └──────────────────────────────────┘ │ ┌──────────────────────────────┐ │
│                                      │ │ David Lee             [60%]   │ │
│ ┌──────────────────────────────────┐ │ │ david.lee@email.com     [Card]│ │
│ │ Emma Wilson                      │ │ │                              │ │
│ │ emma.w@mail.com                  │ │ │ Position: DevOps Engineer   │ │
│ │                                  │ │ │ Job: DevOps Role            │ │
│ │ Position: Product Manager        │ │ │ Recommendation: 👁️ CONSIDER │ │
│ │ Job: Product Manager Needed      │ │ │                              │ │
│ │ Status: 📧 Invited               │ │ │ [View Details]               │ │
│ │ Date: Mar 9, 2026                │ │ └──────────────────────────────┘ │
│ │                                  │ │                                  │
│ │ [Resend Invite]                  │ │ ┌──────────────────────────────┐ │
│ └──────────────────────────────────┘ │ │ Lisa Anderson         [30%]   │ │
│                                      │ │ lisa.and@email.com      [Card]│ │
│ ┌──────────────────────────────────┐ │ │                              │ │
│ │ + 1 more pending invite          │ │ │ Position: UI Designer       │ │
│ │ [Scroll to see more]             │ │ │ Job: UI/UX Designer Role    │ │
│ └──────────────────────────────────┘ │ │ Recommendation: ❌ REJECT    │ │
│                                      │ │                              │ │
│                                      │ │ [View Details]               │ │
│                                      │ │ └──────────────────────────────┘ │
│                                      │                                  │
│                                      │ [+ 7 more completed] [Scroll]   │
└──────────────────────────────────────┴──────────────────────────────────┘
```

---

## 🎨 Component Details

### Pending Invite Card (Left Column)

```
┌─────────────────────────────────────────────────┐
│  Blue left border (status indicator)            │
├─────────────────────────────────────────────────┤
│                                                 │
│  📧 Invited  (badge)                            │
│                                                 │
│  John Doe                                       │
│  john.doe@company.com                           │
│                                                 │
│  Position: Senior Developer                     │
│  Job: React Developer Role                      │
│  📅 Mar 10, 2026                                │
│                                                 │
│  ┌──────────────────┐                           │
│  │ [Resend Invite]  │  (for scheduled status)   │
│  └──────────────────┘                           │
│                                                 │
└─────────────────────────────────────────────────┘

Status Types:
┌──────────────────┐  ┌──────────────────┐
│ 📧 Invited       │  │ ⏳ In Progress   │
│ Blue Background  │  │ Amber Background │
└──────────────────┘  └──────────────────┘
```

### Completed Interview Card (Right Column)

```
┌─────────────────────────────────────────────────┐
│  Green left border (status indicator)           │
├─────────────────────────────────────────────────┤
│                                                 │
│  Jane Smith                    ┌──────┐        │
│  jane.smith@company.com        │ 90%  │        │
│                                │ GOOD │        │
│  Position: Frontend Engineer   └──────┘        │
│  Job: React Developer Role                     │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  ✅ Hire                                 │  │
│  │                     [View Details] →     │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘

Score Card Breakdown:
┌──────┐         Color by Performance:
│ 90%  │  🟢 Green (Excellent)
│ GOOD │  🔵 Blue (Good)
└──────┘  🟡 Yellow (Average)
           🔴 Red (Poor)

Recommendations:
┌─────────────┐  ┌───────────┐  ┌──────────┐
│ ✅ Hire     │  │ 👁️ Consider│  │ ❌ Reject │
│ Green Text  │  │ Amber Text │  │ Red Text │
└─────────────┘  └───────────┘  └──────────┘
```

---

## 🔍 Search & Filter Bar

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  🔍 [Search candidates...]  [Filter by job ▼]  📧5  ✅12       │
│                                                                  │
│  Input field      Dropdown       Statistics                     │
│  • Real-time      • All Jobs     • Pending count               │
│  • By name        • React Dev    • Completed count            │
│  • By email       • Node Dev                                   │
│  • By position    • More...                                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

Filter Combinations:

ALL JOBS + EMPTY SEARCH = All Results
         ↓
"React Dev" Job + EMPTY SEARCH = Only React Dev candidates
         ↓
"React Dev" Job + "john" SEARCH = John in React Dev job only
```

---

## 📋 Interview Details Modal

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✖ Interview Details                                 ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                      ┃
┃  Jane Smith                              ┌────────┐  ┃
┃  jane.smith@company.com                  │ 90%    │  ┃
┃  👤 Frontend Engineer                    │ GOOD   │  ┃
┃  💼 React Developer Role                 └────────┘  ┃
┃  📅 Mar 10, 2026 at 2:30 PM                         ┃
┃                                                      ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ [Scrollable Content Area]                           ┃
┃                                                      ┃
┃  🎯 Recommendation: ✅ HIRE                          ┃
┃                                                      ┃
┃  📝 Interview Summary                                ┃
┃  ═══════════════════════════════════════════         ┃
┃  Jane demonstrated strong knowledge of React        ┃
┃  and JavaScript fundamentals. She solved all        ┃
┃  coding challenges efficiently and communicated     ┃
┃  her thoughts clearly throughout the interview...   ┃
┃                                                      ┃
┃  💪 Strengths                                        ┃
┃  ═══════════════════════════════════════════         ┃
┃  ┌──────────────────────────────────────────┐       ┃
┃  │ ✓ Strong React & JavaScript knowledge    │       ┃
┃  │ ✓ Excellent problem-solving skills       │       ┃
┃  │ ✓ Great communication abilities          │       ┃
┃  │ ✓ Team collaboration experience          │       ┃
┃  └──────────────────────────────────────────┘       ┃
┃                                                      ┃
┃  ⚠️  Areas for Improvement                          ┃
┃  ═══════════════════════════════════════════         ┃
┃  ┌──────────────────────────────────────────┐       ┃
┃  │ ! Limited TypeScript experience          │       ┃
┃  │ ! Needs exposure to testing frameworks   │       ┃
┃  └──────────────────────────────────────────┘       ┃
┃                                                      ┃
┃  [More content scrollable below...]                 ┃
┃                                                      ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                      ┃
┃  [Close]                   [Export as PDF] →         ┃
┃                                                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🎯 Performance Score Visualization

### Score Card Format
```
┌─────────────┐
│    90%      │  Percentage from rating
│    GOOD     │  Rating label
└─────────────┘  Color: Usually in circular badge

Rating Conversion:
────────────────────────────────
Excellent → 90% → Green   ✅ HIRE
Good      → 75% → Blue    👁️ CONSIDER
Average   → 60% → Yellow  👁️ CONSIDER
Poor      → 30% → Red     ❌ REJECT
────────────────────────────────
```

### Color Bar Under Each Card
```
┌──────────────────────────────────┐
│ Candidate Name      Score Badge   │
├──────────────────────────────────┤
│ Details...                        │
│                                  │
│ Recommendation Badge              │
│                                  │
│ [View Details]                    │
└──────────────────────────────────┘
  ↑
Border color indicates performance:
🟢 Left border = Green (Excellent)
🔵 Left border = Blue (Good)
🟡 Left border = Yellow (Average)
🔴 Left border = Red (Poor)
```

---

## 📱 Mobile View (Single Column Stack)

```
┌──────────────────────────────┐
│ Interview & Schedule         │
│ Manage interview invites...  │
└──────────────────────────────┘

┌──────────────────────────────┐
│ 🔍 Search...                  │
│ [Filter ▼]  📧5 ✅12          │
└──────────────────────────────┘

┌──────────────────────────────┐
│ 📧 PENDING INVITES            │
├──────────────────────────────┤
│ ┌────────────────────────────┐│
│ │ John Doe                   ││
│ │ john@ex.com                ││
│ │ Senior Dev Role            ││
│ │ [Resend]                   ││
│ └────────────────────────────┘│
│ ┌────────────────────────────┐│
│ │ + 4 more                   ││
│ └────────────────────────────┘│
└──────────────────────────────┘

┌──────────────────────────────┐
│ ✅ COMPLETED INTERVIEWS       │
├──────────────────────────────┤
│ ┌────────────────────────────┐│
│ │ Jane Smith        [90%]    ││
│ │ jane@ex.com                ││
│ │ Frontend Dev               ││
│ │ ✅ HIRE                    ││
│ │ [View Details]             ││
│ └────────────────────────────┘│
│ ┌────────────────────────────┐│
│ │ + 11 more                  ││
│ └────────────────────────────┘│
└──────────────────────────────┘
```

---

## 🎨 Color Scheme Reference

```
Primary Colors:
├─ Primary (Blue): Links, CTAs, highlights
├─ Background: White (#FFFFFF)
├─ Text: Dark Gray (#1F2937)
└─ Muted: Light Gray (#6B7280)

Performance Colors:
├─ Excellent (Green):   #10B981 (#22C55E for light)
├─ Good (Blue):         #3B82F6
├─ Average (Blue):      #3B82F6
├─ Consider (Amber):    #F59E0B
└─ Poor (Red):          #EF4444

Card Status Colors:
├─ Pending/Blue:    bg-blue-50, border-blue-200
├─ In Progress:     bg-amber-50, border-amber-200
├─ Good/Blue:       bg-blue-50
├─ Excellent/Green: bg-green-50, border-green-200
├─ Consider/Amber:  bg-amber-50, border-amber-200
└─ Poor/Red:        bg-red-50, border-red-200
```

---

## 📊 Empty States

### No Jobs
```
┌─────────────────────────────────┐
│                                 │
│          💼                     │
│                                 │
│  No jobs yet                    │
│                                 │
│  Create a job posting first to  │
│  send interview invites         │
│                                 │
└─────────────────────────────────┘
```

### No Invites or Interviews
```
┌─────────────────────────────────┐
│                                 │
│          🔍                     │
│                                 │
│  No matches found               │
│                                 │
│  Try adjusting your search or   │
│  filters                        │
│                                 │
└─────────────────────────────────┘
```

---

## ✨ Summary

This visual guide shows:
✅ Full page layout with both columns
✅ Individual card designs
✅ Search and filter bar
✅ Interview details modal
✅ Performance score display
✅ All color coding
✅ Mobile responsive view
✅ Empty states

Everything is **clean, modern, and user-friendly**! 🎉
