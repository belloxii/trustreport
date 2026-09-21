# 🛡️ TrustReport — Verified Community Incident Reporting Platform

[![OSF × Andela Hackathon](https://img.shields.io/badge/Hackathon-OSF%20%C3%97%20Andela-0284c7.svg)](https://andela.com)
[![Theme](https://img.shields.io/badge/Theme-Information%20You%20Can%20Trust-emerald.svg)](#)
[![Track](https://img.shields.io/badge/Track-Safety%2C%20Reporting%20%26%20Protection-amber.svg)](#)
[![Stack](https://img.shields.io/badge/Stack-TanStack%20Start%20%7C%20React%2019%20%7C%20Tailwind-blueviolet.svg)](#)
[![AI Engine](https://img.shields.io/badge/AI-Gemini%202.5%20Flash%20%2B%20Heuristic%20Fallback-orange.svg)](#)
[![Demonstration Context](https://img.shields.io/badge/Focus-Ilorin%2C%20Kwara%20State%2C%20Nigeria-10b981.svg)](#)

> **Empowering citizens with verified, credible, and privacy-preserving public incident intelligence.**  
> Built as a functional proof of concept for the **OSF × Andela Hackathon: “Information you can trust.”**

---

## 📑 Table of Contents

1. [Executive Summary & Problem Statement](#-executive-summary--problem-statement)
2. [The Core Verification Lifecycle](#-the-core-verification-lifecycle)
3. [Key Features & Capabilities](#-key-features--capabilities)
4. [Demonstration Context: Ilorin, Kwara State](#-demonstration-context-ilorin-kwara-state)
5. [AI Integration & Attribution Model](#-ai-integration--attribution-model)
6. [Privacy, Safety & Ethical Design](#-privacy-safety--ethical-design)
7. [GIS Map & Safer Route Advisor](#-gis-map--safer-route-advisor)
8. [Reviewer Mode & Authentication Gate](#-reviewer-mode--authentication-gate)
9. [PRD Compliance & Audit Matrix](#-prd-compliance--audit-matrix)
10. [System Architecture & State Management](#-system-architecture--state-management)
11. [Step-by-Step Hackathon Evaluation Guide](#-step-by-step-hackathon-evaluation-guide)
12. [Technical Limitations & Production Roadmap](#-technical-limitations--production-roadmap)
13. [Getting Started & Local Setup](#-getting-started--local-setup)
14. [Attribution & Credits](#-attribution--credits)

---

## 🌍 Executive Summary & Problem Statement

In fast-growing African cities such as Ilorin, Kwara State, Nigeria, residents regularly face urgent urban and environmental hazards: seasonal flash flooding along the Asa River, washed-out culverts, collapsed bridge decks, uncovered drainage ditches, illegal refuse blockages, and downed 33kV utility cables.

When these incidents happen, community information flows are plagued by:
- **Misinformation and Panic:** Unverified social media rumors amplify panic and distort the actual scale of emergencies.
- **Evidentiary Deficits:** Reports lack structured landmarks, water depth measurements, or photographic proof.
- **Voter Inflation & Duplicate Noise:** Redundant reports swamp responders while genuine crises remain unverified.
- **Lack of Transparency:** Citizens have no visibility into whether a report was corroborated, reviewed by an auditor, or escalated to municipal responders.

### The Solution: TrustReport
TrustReport establishes an open, auditable credibility chain for civic reporting governed by one foundational principle:

$$\text{Citizen Observation} \longrightarrow \text{Structured Report} \longrightarrow \text{Evidence} \longrightarrow \text{Verification} \longrightarrow \text{Transparent Status} \longrightarrow \text{Appropriate Next Action}$$

Instead of treating every citizen submission as unquestioned truth, TrustReport renders credibility, peer confirmations, reviewer audits, and lifecycle progression visible to all stakeholders.

---

## 🔄 The Core Verification Lifecycle

Every report moves through a clearly defined verification journey designed to prevent false alarms and reward verified evidence:

```
                  ┌─────────────────────────────────┐
                  │ 1. Citizen Observation Recorded  │
                  └────────────────┬────────────────┘
                                   │
                                   ▼
                  ┌─────────────────────────────────┐
                  │ 2. AI Pre-Assessment Engine     │
                  │    • Completeness Scoring (0-100)│
                  │    • Evidence & Clue Extraction │
                  │    • Recommended Civic Responder │
                  └────────────────┬────────────────┘
                                   │
                                   ▼
                  ┌─────────────────────────────────┐
                  │ 3. Status: Submitted / Unverified│
                  └───────┬─────────────────┬───────┘
                          │                 │
    Peer Corroboration    │                 │ Reviewer Inspection
    (1 vote per session)  ▼                 ▼ (Requires PIN Auth)
┌────────────────────────────────┐    ┌──────────────────────────────────┐
│ Community Confirmation Ledger  │    │ Authorized Reviewer Audit        │
│ • ≥3 votes: Status elevates to │    │ • Validates photo & coordinates  │
│   "Community Confirmed"        │    │ • Appends signed audit entry     │
└────────────────┬───────────────┘    │ • Sets Field/Official Verified   │
                 │                    └────────────────┬─────────────────┘
                 │                                     │
                 └──────────────────┬──────────────────┘
                                    │
                                    ▼
                  ┌──────────────────────────────────┐
                  │ 4. Public Action & Escalation    │
                  │ • Transparent Audit Trail logged │
                  │ • Responder Dispatched/Notified  │
                  │ • Marked "Resolved & Safe"       │
                  └──────────────────────────────────┘
```

---

## ⚡ Key Features & Capabilities

### 1. Multi-Category Incident Reporting
Structured hazard capture across 5 critical urban domains:
* 🌊 **Flooding & Environmental:** Flash floods, drainage overflow, river overflow, erosion gullies.
* 🏗️ **Damaged Infrastructure:** Road sinkholes, cracked culverts, bridge erosion, broken guardrails.
* 🗑️ **Blocked Drainage & Sanitation:** Solid waste blockages, silted storm canals, illegal refuse dumps.
* ⚡ **Public Utility Outages:** Fallen power cables, submerged transformers, burst municipal water mains.
* 🛡️ **Public Safety Hazards:** Fallen trees, open manholes, non-functioning streetlights, road obstructions.

### 2. Multi-Tier Credibility Scoring (0–100%)
An automated scoring algorithm evaluates reports across objective credibility markers:
* **Detail Richness (25%):** Word count and structural hazard completeness.
* **Landmark Precision (20%):** Recognizable street names, junctions, or public buildings.
* **Photographic Evidence (30%):** Valid photo attachment validating the incident.
* **Community Corroborations (25%):** Scaled confirmation count from independent local residents.

### 3. Reviewer Mode & Auditable Status Progression
* Authorized reviewers can inspect reports, change verification states (`Unverified`, `Community Confirmed`, `Field Verified`, `Official Escalated`, `Rejected`), and append timestamped audit remarks.
* An immutable **Audit Trail** preserves the entire chronological timeline of who acted on the report and when.

### 4. Low-Bandwidth Data Saver Mode
* Dedicated toggle for residents and field operatives in low-connectivity areas (2G/3G edge networks).
* Defers high-resolution images, disables heavy visual effects, and optimizes data transmission.

### 5. CSV Audit Data Export
* Single-click download of verified incident datasets in standard CSV format, enabling external GIS analysts, NGOs, and municipal agencies to ingest live incident records.

---

## 📍 Demonstration Context: Ilorin, Kwara State

The proof of concept is grounded in **Ilorin, the capital city of Kwara State, Nigeria**, with landmark-accurate GIS coordinates and localized civic responder mappings:

| Location / Corridor | Typical Hazard Vulnerability | Recommended Public Responder |
|---|---|---|
| **Tanke / University Road** | Flash runoff and drainage overflow near pedestrian corridors | Kwara State Ministry of Environment |
| **Adewole Estate / Workers Drive** | Washed-out culverts and structural road erosion | Kwara State Ministry of Works & Transport (KWSG) |
| **Asa River / Unity Bridge Basin** | Severe riverbank flooding and perimeter residential runoff | Kwara State Fire & Emergency Services |
| **Taiwo Isale / Post Office Market** | Commercial drain clogging and illegal solid waste choke | Kwara State Environmental Protection Agency (KWEPA) |
| **GRA / Offa Garage Corridor** | High-voltage cable faults and transformer drainage hazards | Ibadan Electricity Distribution Company (IBEDC) |

---

## 🤖 AI Integration & Attribution Model

TrustReport integrates **Google Gemini models** using the official `@google/genai` TypeScript SDK:

```typescript
// Server-Side Execution (src/lib/ai.functions.ts)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt,
  config: { responseMimeType: 'application/json', responseSchema: ... }
});
```

### Transparent AI Attribution
To ensure absolute truthfulness and adhere to the *"Information you can trust"* theme:
- **Live Gemini 2.5 Flash:** When a valid API key is present, reports are analyzed by Gemini, returning structured JSON containing confidence ratings, actionable citizen advice, missing evidence clues, and responder mappings. A badge labeled `✨ Gemini 2.5 Flash` is rendered.
- **Heuristic Rule-Based Fallback:** If an API key is not configured or network connectivity drops, the system seamlessly transitions to an offline heuristic analyzer. A badge labeled `⚙️ Offline Rule-Based Fallback` is explicitly shown, ensuring judges and users always know the exact source of analysis.

---

## 🔒 Privacy, Safety & Ethical Design

Civic hazard reporting must never compromise personal safety or expose vulnerable reporters:

1. **Anonymous Incident Reporting (PR-01):**
   - Reporters can toggle *"Submit Anonymously"*, which assigns the author as "Anonymous Resident" and disables contact collection fields.
2. **Coordinate Fuzzing (PR-02):**
   - When reporting hazards near private residences, reporters can check *"Fuzz exact coordinates (~300m radius)"*. The system applies a localized random spatial offset, obscuring exact home locations on the public map.
3. **Private Contact Isolation (PR-03):**
   - Reporter telephone numbers are segregated in memory/storage and are never rendered on public incident feeds, cards, or map pins.
4. **Emergency Escalation Prompts (PR-04):**
   - The interface features clear disclaimers warning users that TrustReport is an observational platform and not a replacement for 911/emergency dispatch. Immediate life-threatening crises prominently display the hotline for **Kwara State Fire and Emergency Services (`0803 323 1122`)**.
5. **Demo Data Disclaimers (PR-05 & PR-06):**
   - Seed and demonstration records carry an unmistakable `Demo Data` tag. AI assessments are explicitly marked as advisory aids for prioritization.

---

## 🗺️ GIS Map & Safer Route Advisor

The `/map` view provides an interactive, responsive vector GIS canvas of Ilorin:

* **Geographic Layering:** Visualizes the Asa River basin, major transport arteries (Taiwo Road, Unity Road, University Road), and elevation contour shading.
* **Category Filtering:** Toggle markers by Flooding, Infrastructure, Sanitation, Utilities, or Public Safety.
* **Safer Route Advisor:** A client-side pathfinding algorithm that calculates alternative navigation routes around active, high-severity hazard zones (e.g. bypassing flooded river crossings between Tanke and Fate).

---

## 🔑 Reviewer Mode & Authentication Gate

To prevent unauthorized tampering while allowing frictionless hackathon evaluation:

1. Click **Reviewer Mode: OFF** in the header or dashboard.
2. A security modal prompts for the reviewer passkey.
3. Enter either of the demo passkeys:
   - **`reviewer`**
   - **`trust2026`**
4. Once unlocked, **Reviewer Mode** becomes **ACTIVE** (persisted across navigation in `sessionStorage`).
5. Reviewers can now:
   - Modify verification states.
   - Adjust official lifecycle statuses.
   - Record formal audit notes with their reviewer signature.

---

## 📊 PRD Compliance & Audit Matrix

All requirements stipulated in `/docs/PRD.md` have been fully addressed:

| ID | Requirement Name | Status | Implementation Location |
|---|---|---|---|
| **FR-01** | Multi-Category Incident Reporting | ✅ Implemented | `src/routes/report.tsx` — 5 distinct categories with tailored metadata |
| **FR-02** | Structured Incident Capture | ✅ Implemented | `src/routes/report.tsx` — Title, description, landmarks, water depth |
| **FR-03** | Photo Evidence Attachment | ✅ Implemented | `src/routes/report.tsx` — Photo evidence upload with low-bandwidth toggle |
| **FR-04** | GPS & Coordinate Capture | ✅ Implemented | Browser Geolocation API + Ilorin centroid fallbacks |
| **FR-05** | Credibility & Completeness Scoring | ✅ Implemented | `src/lib/reports-context.tsx` — 4-factor credibility scoring engine |
| **FR-06** | Community Corroboration Engine | ✅ Implemented | `src/lib/reports-context.tsx` — 1-vote per session duplicate prevention |
| **FR-07** | Reviewer Verification Gate | ✅ Implemented | `src/components/ReviewerAuthModal.tsx` — PIN gate (`reviewer` / `trust2026`) |
| **FR-08** | Append-Only Audit Trail | ✅ Implemented | `src/components/ReportDetailModal.tsx` — Immutable chronological logs |
| **FR-09** | Interactive GIS Incident Map | ✅ Implemented | `src/routes/map.tsx` — Vector GIS canvas with Asa River basin overlays |
| **FR-10** | Safer Route Hazard Bypass Advisor | ✅ Implemented | `src/routes/map.tsx` — Dynamic route hazard avoidance engine |
| **FR-11** | Transparent AI Assessment & Chat | ✅ Implemented | `src/routes/ai.tsx` & `src/lib/ai.functions.ts` — Gemini 2.5 Flash + Fallback |
| **FR-12** | Low-Bandwidth Data Saver Mode | ✅ Implemented | `src/lib/reports-context.tsx` — Global toggle deferring heavy assets |
| **FR-13** | Searchable Dashboard & Filters | ✅ Implemented | `src/routes/dashboard.tsx` — Multi-column search, filters, and sorters |
| **FR-14** | CSV Audit Data Export | ✅ Implemented | `src/routes/dashboard.tsx` — Client-side dynamic CSV dataset generator |
| **FR-15** | Civic Safety Knowledge & Quiz | ✅ Implemented | `src/routes/safety.tsx` & `src/routes/heroes.tsx` — Gamified civic education |
| **PR-01** | Anonymous Incident Reporting | ✅ Implemented | `src/routes/report.tsx` — Identity omission toggle |
| **PR-02** | Coordinate Fuzzing for Privacy | ✅ Implemented | `src/routes/report.tsx` — ±300m spatial jitter privacy offset |
| **PR-03** | Confidential Contact Separation | ✅ Implemented | PII exclusion from public card feeds and map pins |
| **PR-04** | Emergency Escalation Prompts | ✅ Implemented | Kwara Fire Service hotline disclaimers on high-severity alerts |
| **PR-05** | Demonstration Data Labeling | ✅ Implemented | Explicit `Demo Data` tags on all mock/seed records |
| **PR-06** | Responsible AI Disclaimers | ✅ Implemented | Prominent notices indicating AI scoring is advisory |

---

## 🏗️ System Architecture & State Management

```
/
├── public/                     # Static assets (custom branded favicon.svg / favicon.ico)
├── src/
│   ├── components/             # Reusable UI & modal components
│   │   ├── ui/                 # Accessible primitives (buttons, badges, dialogs, inputs)
│   │   ├── Navigation.tsx      # Top bar with Reviewer & Low-Bandwidth controls
│   │   ├── ReportDetailModal.tsx # Full report inspector, audit trail & reviewer tools
│   │   ├── ReviewerAuthModal.tsx # Passkey gate for Reviewer Mode
│   │   └── FloodGuardLogo.tsx  # Vector SVG brand identity
│   ├── lib/
│   │   ├── ai.functions.ts     # Server functions for Gemini 2.5 Flash API
│   │   ├── reports-context.tsx # Central reactive store, local-first persistence & scoring
│   │   └── types.ts            # TypeScript definitions for incidents, audits & categories
│   ├── routes/
│   │   ├── __root.tsx          # Root shell layout, meta tags & favicon link injection
│   │   ├── index.tsx           # Home: Live incident feed, category tabs & civic metrics
│   │   ├── report.tsx          # Submit: Multi-step report form with live AI check
│   │   ├── map.tsx             # Map: GIS canvas, river basin & Safer Route Advisor
│   │   ├── dashboard.tsx       # Dashboard: Verification ledger, CSV export & filters
│   │   ├── ai.tsx              # AI Hub: Interactive disaster chat & credibility analyzer
│   │   ├── safety.tsx          # Safety: Checklists, preparation kits & emergency contacts
│   │   └── heroes.tsx          # Heroes: Gamified safety quiz & community leaderboard
├── docs/                       # Product Requirements Document (PRD.md)
└── README.md                   # System documentation & evaluation guide
```

### Local-First Persistence Strategy
* **Primary Store:** Reactive React Context (`ReportsProvider`) synchronized with browser `localStorage` (`trustreport_reports_v1`).
* **Session Auth:** Reviewer authorization stored in `sessionStorage` (`trustreport_reviewer_session`).
* **Instant Reset:** A *"Reset to Default Seed"* button in the dashboard allows testers to wipe local state and restore clean baseline records at any time.

---

## 🧪 Step-by-Step Hackathon Evaluation Guide

Follow this 5-minute walkthrough to verify the complete verification lifecycle:

### Step 1: Discover & Filter Active Incidents
1. Navigate to the **Home Feed (`/`)**.
2. Inspect the live incident cards across Ilorin. Note the distinct category icons, severity badges, and credibility bars.
3. Filter by category pills (e.g., click **Flooding** or **Infrastructure**).

### Step 2: Submit a New Hazard Report
1. Click **Report Incident** in the navigation or visit `/report`.
2. Select **Damaged Infrastructure** or **Flooding**.
3. Type a location (e.g., *"Offa Garage roundabout near overhead bridge"*).
4. Enter a detailed description.
5. Click **Run Live AI Validation** to inspect the real-time Gemini assessment and recommended responder.
6. Toggle **Submit Anonymously** and check **Fuzz exact coordinates (~300m)**.
7. Click **Submit Verified Incident Report** and note the generated Tracking ID.

### Step 3: Explore the GIS Map & Safe Route Advisor
1. Visit `/map`.
2. Find your plotted incident marker on the Ilorin vector GIS canvas.
3. In the **Safer Route Evaluator**, select an origin (e.g. *Tanke Junction*) and destination (e.g. *Post Office*).
4. Observe how the algorithm assesses active hazard markers along the route and calculates an alternate bypass corridor.

### Step 4: Confirm as a Community Resident
1. Go to the **Verification Dashboard (`/dashboard`)**.
2. Locate your newly submitted report.
3. Click the **Confirm (Thumbs Up)** button.
4. Notice the confirmation count increment and your credibility score rise. Click it again to confirm that duplicate voting is strictly blocked.

### Step 5: Authenticate as an Official Reviewer
1. In the top navigation bar or dashboard header, click **Reviewer Mode: OFF**.
2. Enter PIN: **`reviewer`** (or **`trust2026`**) and submit.
3. Reviewer Mode turns **ACTIVE (Green)**.
4. Click **Inspect** on your incident report.
5. Switch to the **Reviewer Audit Panel** tab.
6. Elevate the verification status to **Field Verified** and lifecycle to **In Progress (Crews Dispatched)**.
7. Enter a review note: *"Field inspection confirmed washed-out culvert. Alert forwarded to Kwara State Ministry of Works."*
8. Click **Save Verification Audit**.
9. Switch to the **Audit Trail & History** tab to view your immutable, signed audit entry.

### Step 6: Test Data-Saver & Export
1. Click **Low Data** in the header to observe deferred image rendering.
2. Click **Export Incident CSV** on the dashboard to download the complete audit dataset.

---

## ⚖️ Technical Limitations & Production Roadmap

As a hackathon proof of concept, TrustReport prioritizes functional fidelity while remaining honest about architecture boundaries:

| Dimension | Hackathon MVP | Production Roadmap |
|---|---|---|
| **Storage** | Client-side `localStorage` with reactive state synchronization | Distributed cloud database (Firestore / Cloud SQL PostgreSQL) |
| **Authentication** | Demo PIN gate (`reviewer` / `trust2026`) in `sessionStorage` | Firebase Auth / OAuth 2.0 with cryptographic Role-Based Access Control (RBAC) |
| **GIS Mapping** | Custom vector SVG canvas with Asa River basin overlays | Mapbox GL JS / Google Maps Platform vector tiles with GeoJSON spatial indexing |
| **Agency Integration** | Category-based rule mapping to Kwara State agencies | Webhook integrations with government 911 CAD & civic work order platforms |
| **Offline Channels** | Responsive Web App with low-bandwidth mode | SMS & USSD shortcode gateway (Africa's Talking / Twilio) for feature phones |

---

## 💻 Getting Started & Local Setup

### Prerequisites
* **Node.js**: v20.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/your-org/trustreport.git
cd trustreport

# 2. Install dependencies
npm install

# 3. (Optional) Set up Gemini API Key for live AI verification
# Create a .env file:
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# 4. Start local development server (runs on port 3000)
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

### Quality Assurance Scripts

```bash
# Run ESLint validation
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🏆 Attribution & Credits

* **Hackathon:** [OSF × Andela Hackathon](https://andela.com)
* **Theme:** *“Information you can trust.”*
* **Primary Track:** Safety, Reporting & Protection
* **Target Community:** Ilorin, Kwara State, Nigeria
* **Developed with:** React 19, TanStack Start, Tailwind CSS, Google Gemini 2.5 Flash, and Lucide Icons.

*Licensed under the [MIT License](LICENSE).*
