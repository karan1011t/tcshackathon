# Sentinel AI — UI/UX Flow Documentation

> **Version:** 1.0
> **Product:** Sentinel AI
> **Document Type:** UI/UX User Flow
> **Target Users:** Organization Admin, AI Developer, Security Analyst, Compliance Officer

---

# 1. User Journey Overview

```text
Landing Page
      │
      ▼
Authentication
      │
      ▼
Organization Selection
      │
      ▼
Dashboard
      │
      ├──────────────► Live Monitoring
      │
      ├──────────────► Conversation Analysis
      │
      ├──────────────► Explainability
      │
      ├──────────────► Safe Rewrite
      │
      ├──────────────► Policy Manager
      │
      ├──────────────► Domain Packs
      │
      ├──────────────► Analytics
      │
      ├──────────────► Audit Logs
      │
      └──────────────► Settings
```

---

# 2. Navigation Structure

```text
Sentinel AI

├── Dashboard
│
├── Live Monitor
│
├── Conversations
│
├── Explainability
│
├── Safe Rewrite
│
├── Policies
│
│     ├── Organization Policies
│     ├── Custom Rules
│     ├── Policy Versions
│     └── Policy Suggestions
│
├── Domain Packs
│
├── Analytics
│
├── Audit Logs
│
├── Team
│
└── Settings
```

---

# 3. Authentication Flow

```text
User Opens Website

        │

        ▼

Login Page

        │

 ┌──────┴───────┐
 │              │
 ▼              ▼

Email Login   SSO Login

        │

        ▼

Authentication

        │

        ▼

Select Organization

        │

        ▼

Dashboard
```

---

# 4. Dashboard Flow

```text
Dashboard

│

├── Overall Safety Score

├── Today's Requests

├── Active Policies

├── Risk Distribution

├── Recent Conversations

├── Triggered Guardrails

├── Latest Policy Changes

└── Quick Actions
```

Quick Actions

- Analyze Response
- Add Policy
- Install Domain Pack
- View Audit Logs

---

# 5. AI Response Analysis Flow

```text
Paste Prompt

        │

        ▼

Paste AI Response

        │

        ▼

Run Analysis

        │

        ▼

Guardrail Pipeline

        │

        ├── Unsafe Content

        ├── Bias Detection

        ├── Confidential Leakage

        ├── Hallucination

        └── Unsupported Claims

        │

        ▼

Risk Engine

        │

        ▼

Overall Risk Score

        │

        ▼

Explainability

        │

        ▼

Safe Rewrite

        │

        ▼

Audit Log
```

---

# 6. Live Monitoring Flow

```text
Incoming Response

        │

        ▼

Response Queue

        │

        ▼

Guardrail Engine

        │

        ├── Running...

        ├── Running...

        ├── Running...

        └── Running...

        │

        ▼

Evaluation Completed

        │

        ▼

Risk Score Generated

        │

        ▼

Safe Rewrite

        │

        ▼

Delivered Response
```

---

# 7. Conversation Analysis Flow

```text
Conversation List

        │

        ▼

Open Conversation

        │

        ▼

Conversation Timeline

        │

        ▼

Select AI Message

        │

        ▼

View

├── Risk Score

├── Guardrails Triggered

├── Highlighted Text

├── Confidence

├── Severity

└── Rewrite
```

---

# 8. Explainability Flow

```text
Response

        │

        ▼

Highlighted Risky Text

        │

        ▼

Why Triggered?

        │

        ▼

Responsible Policy

        │

        ▼

Severity

        │

        ▼

Confidence

        │

        ▼

Recommendation
```

---

# 9. Safe Rewrite Flow

```text
Unsafe Response

        │

        ▼

Rewrite Generator

        │

        ▼

Generated Safe Response

        │

        ▼

Compare

Original

↓

Safe Version

↓

Approve

↓

Send to User
```

---

# 10. Organization Policy Flow

```text
Policies

        │

        ├── Create

        ├── Edit

        ├── Delete

        ├── Enable

        └── Disable

                │

                ▼

Policy Engine

                │

                ▼

Immediate Activation
```

---

# 11. Create Policy Flow

```text
Step 1

Policy Name

        │

        ▼

Step 2

Description

        │

        ▼

Step 3

Trigger Condition

        │

        ▼

Step 4

Severity

        │

        ▼

Step 5

Review

        │

        ▼

Publish
```

---

# 12. Domain Pack Flow

```text
Domain Packs

        │

        ├── Healthcare

        ├── Finance

        ├── Legal

        ├── HR

        └── Education

                │

                ▼

Preview Policies

                │

                ▼

Install Pack

                │

                ▼

Activated
```

---

# 13. Adaptive Policy Evolution Flow

```text
Conversation

        │

        ▼

Policy Triggered

        │

        ▼

Developer Feedback

        │

        ▼

AI Suggests Rule

        │

        ▼

Administrator Review

        │

 ┌──────┴─────────┐

 ▼                ▼

Approve         Reject

 │

 ▼

Policy Updated

 │

 ▼

Version Created

 │

 ▼

Future Requests Use New Policy
```

---

# 14. Analytics Flow

```text
Analytics

│

├── Overall Risk Trend

├── Daily Requests

├── Risk Distribution

├── Guardrail Frequency

├── Top Violations

├── Policy Usage

├── Response Rewrite Rate

└── False Positive Rate
```

---

# 15. Audit Log Flow

```text
Audit Logs

        │

        ▼

Search

        │

        ▼

Filters

        │

        ├── Date

        ├── Severity

        ├── Guardrail

        ├── Policy

        └── Organization

        │

        ▼

Audit Record

        │

        ▼

Export

PDF

CSV

JSON
```

---

# 16. Settings Flow

```text
Settings

│

├── Organization

├── Members

├── API Keys

├── Notifications

├── Integrations

├── Branding

├── Billing

└── Security
```

---

# 17. Primary User Flow (Hackathon Demo)

```text
Login

        │

        ▼

Dashboard

        │

        ▼

Analyze AI Response

        │

        ▼

Guardrail Evaluation

        │

        ▼

Risk Score

        │

        ▼

Explainability

        │

        ▼

Safe Rewrite

        │

        ▼

Save Audit

        │

        ▼

View Analytics
```

---

# 18. User Roles & Permissions

## Organization Admin

- Manage organization
- Create/Edit policies
- Install domain packs
- Review AI policy suggestions
- View analytics
- Access audit logs
- Manage users

---

## AI Developer

- Test AI responses
- Analyze guardrail outputs
- Review safe rewrites
- Submit feedback
- View explainability
- Access conversation history

---

## Security Analyst

- Monitor live responses
- Investigate violations
- Review audit logs
- Analyze trends
- Export compliance reports

---

## Compliance Officer

- Review policy compliance
- Verify audit trails
- Monitor organization-wide risk
- Generate compliance reports

---

# 19. Global Navigation Pattern

```text
┌────────────────────────────────────────────┐
│ Top Navigation                             │
│ Search | Notifications | Org | Profile     │
└────────────────────────────────────────────┘

┌───────────────┬────────────────────────────┐
│ Sidebar       │ Main Workspace             │
│               │                            │
│ Dashboard     │ Dynamic Page Content       │
│ Live Monitor  │                            │
│ Policies      │                            │
│ Analytics     │                            │
│ Audit Logs    │                            │
│ Settings      │                            │
└───────────────┴────────────────────────────┘
```

---

# 20. UX Principles

- **Explainability First:** Every AI decision must clearly communicate *what* happened, *why* it happened, and *how* it can be resolved.
- **Progressive Disclosure:** Display high-level summaries first, allowing users to drill down into detailed analyses only when needed.
- **Real-Time Feedback:** Live indicators, status updates, and risk changes should update instantly without page refreshes.
- **Enterprise Consistency:** Maintain uniform layouts, typography, color semantics, and interaction patterns across all modules.
- **Minimal Cognitive Load:** Prioritize dashboards with concise summaries, actionable insights, and intuitive navigation over information-heavy interfaces.
- **Role-Based Experience:** Tailor visibility and actions based on user roles (Admin, Developer, Security Analyst, Compliance Officer).
- **Trust Through Transparency:** Every automated action (guardrail trigger, rewrite, policy suggestion) should be traceable and auditable.
- **Accessibility by Design:** Ensure keyboard navigation, sufficient color contrast, screen reader support, and responsive layouts for all users.

---