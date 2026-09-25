# 🔍 Campus Lost & Found Smart Matcher

> AI-powered lost and found lifecycle management system built on ServiceNow App Engine

## 🎯 Problem Statement

Students constantly lose keys, IDs, wallets, and water bottles across massive campus libraries and classrooms. The current system relies on physical boxes at different desks, making it incredibly tedious to locate missing items. Return cycles take **weeks** instead of **minutes**.

## 💡 Solution

A centralized, intelligent platform that **digitizes the entire lost and found lifecycle** and uses **automated AI classification** to bridge the gap between "lost" reports and "found" inventory instantly.

```
📱 Student reports lost item → 🤖 Smart Match Engine scans found items
    → 📊 Confidence score computed → 📧 Student notified instantly
        → 🎫 Claim code generated → ✅ Verified pickup
```

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    SELF-SERVICE LAYER                     │
│  ┌─────────────────────┐  ┌─────────────────────────┐    │
│  │  Report Lost Item   │  │   Report Found Item     │    │
│  │  (Service Catalog)  │  │   (Service Catalog)     │    │
│  └─────────┬───────────┘  └───────────┬─────────────┘    │
├────────────┼──────────────────────────┼──────────────────┤
│            ▼           DATA MODEL     ▼                  │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐   │
│  │  Lost Item   │  │  Found Item  │  │   Location    │   │
│  │  (6 states)  │  │  (6 states)  │  │  (lat/lng)    │   │
│  └──────┬───────┘  └──────┬───────┘  └───────────────┘   │
├─────────┼─────────────────┼──────────────────────────────┤
│         ▼   MATCH ENGINE  ▼                              │
│  ┌─────────────────────────────────────────────────┐     │
│  │  Smart Match Engine (Confidence Scoring)        │     │
│  │  ┌────────────┬────────────┬──────────────────┐ │     │
│  │  │Category 30%│Location 25%│Timeline 25%      │ │     │
│  │  │            │ (Haversine)│Description 20%   │ │     │
│  │  └────────────┴────────────┴──────────────────┘ │     │
│  └──────────────────────┬──────────────────────────┘     │
├─────────────────────────┼────────────────────────────────┤
│                         ▼                                │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐   │
│  │    Match     │→ │    Claim     │→ │  Pickup &     │   │
│  │  (5 states)  │  │  (6 states)  │  │  Verification │   │
│  └──────────────┘  └──────────────┘  └───────────────┘   │
├──────────────────────────────────────────────────────────┤
│                   AUTOMATION LAYER                        │
│  • 5 Flow Designer Workflows (fulfillment + notification)│
│  • 4 Email Notifications (confirmation + alerts)         │
│  • 13 Business Rules (matching + state enforcement)      │
│  • Unique Claim Code Generation (8-char alphanumeric)    │
├──────────────────────────────────────────────────────────┤
│                    ADMIN DASHBOARD                        │
│  • 3-tab dashboard with 11 widgets                       │
│  • Real-time KPIs, match analytics, disposal tracking    │
│  • Role-based access (admin, desk_staff, student)        │
└──────────────────────────────────────────────────────────┘
```

## 📊 Match Scoring Algorithm

The Smart Match Engine computes a weighted confidence score across 4 dimensions:

| Factor | Weight | Method |
|--------|--------|--------|
| **Category** | 30% | Exact category match (electronics, keys, wallet, etc.) |
| **Location** | 25% | Same building (100), same floor (80), or Haversine distance tiers |
| **Timeline** | 25% | Date proximity: same day (100) → within 14 days (20) → beyond (0) |
| **Description** | 20% | Token overlap (Jaccard-like) across description, color, brand, features |

- Matches **above 40%** are auto-created
- Matches **above 70%** are auto-escalated to "Reviewing" state and trigger notifications

## 🗂️ Project Structure

```
src/
├── fluent/                          # ServiceNow Fluent DSL metadata
│   ├── tables.now.ts                # 5 custom tables
│   ├── roles.now.ts                 # 3 roles (admin → desk_staff → student)
│   ├── state-models.now.ts          # 4 state machine lifecycles
│   ├── acls.now.ts                  # 20 ACLs (owner-based for students)
│   ├── match-engine.now.ts          # MatchEngine script include + 5 BRs
│   ├── workflows.now.ts             # 3 notification flows
│   ├── notifications.now.ts         # 4 email notifications
│   ├── catalog.now.ts               # 2 catalog items + category
│   ├── catalog-flows.now.ts         # 2 fulfillment flows
│   ├── dashboard.now.ts             # 3-tab admin dashboard (11 widgets)
│   └── application-menu.now.ts      # Navigation menu (6 modules)
└── server/
    ├── script-includes/
    │   ├── match-engine.js          # Core matching algorithm
    │   └── campus-lf-record-link.js # Email link generator
    └── business-rules/
        ├── trigger-match-lost-item.js
        ├── trigger-match-found-item.js
        ├── generate-claim-code.js
        ├── update-states-match-confirmed.js
        └── update-states-claim-pickup.js
```

## 📦 Components Summary

| Component | Count | Details |
|-----------|-------|---------|
| **Custom Tables** | 5 | Location, Lost Item, Found Item, Match, Claim |
| **Roles** | 3 | Admin → Desk Staff → Student (inherited hierarchy) |
| **State Models** | 4 | Full lifecycle with enforced transitions |
| **ACLs** | 20 | Owner-based access patterns for students |
| **Business Rules** | 13 | State enforcement + auto-matching triggers |
| **Script Includes** | 2 | MatchEngine + Record Link helper |
| **Flows** | 5 | 2 fulfillment + 3 notification workflows |
| **Email Notifications** | 4 | Confirmations + match alerts with claim codes |
| **Catalog Items** | 2 | Report Lost Item + Report Found Item (mobile-ready) |
| **Dashboard** | 1 | 3 tabs, 11 widgets (KPIs, lists, charts) |
| **Navigation Menu** | 1 | 6 modules for admin navigation |

## 🛠️ Tech Stack

- **ServiceNow App Engine** — Platform and runtime
- **Now SDK 4.13** (Fluent DSL/TypeScript) — Declarative metadata definitions
- **Flow Designer** — Workflow automation
- **Service Catalog** — Self-service intake forms
- **Performance Analytics** — Dashboard and reporting
- **State Transition Models** — Lifecycle enforcement

## 🚀 Getting Started

### Prerequisites
- ServiceNow PDI (Personal Developer Instance)
- Node.js 18+
- Now SDK CLI (`npm install -g @servicenow/sdk`)

### Installation
```bash
# Clone the repository
git clone https://github.com/The-shalinicodes/Campus-Lost-Found-Smart-Matcher.git
cd Campus-Lost-Found-Smart-Matcher

# Install dependencies
npm install

# Build the application
npm run build

# Deploy to your ServiceNow instance
npm run deploy
```

## 👩‍💻 Author

**Shalini** — [GitHub Profile](https://github.com/The-shalinicodes)

---

*Built with ❤️ using ServiceNow App Engine and Now SDK Fluent API*
