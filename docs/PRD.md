# Product Requirements Document (PRD)
# TrustReport

**Product:** TrustReport — Community Incident Reporting & Credibility Verification Platform  
**Version:** 1.0  
**Status:** Proof of Concept / Hackathon MVP  
**Hackathon:** OSF × Andela Hackathon  
**Theme:** Information You Can Trust  
**Primary Track:** Safety, Reporting & Protection  
**Initial Demonstration Context:** Ilorin, Kwara State, Nigeria  

---

## 1. Product Overview

TrustReport is a community incident reporting and credibility verification platform that helps citizens report hazards and public incidents, provides structured information for assessment, enables community confirmation and reviewer verification, and maintains a transparent history of how each report progresses.

The platform is designed around a simple principle:

> **Citizen observation → structured report → evidence → verification → transparent status → appropriate next action.**

Instead of treating every citizen report as automatically true, TrustReport makes the credibility and verification status of information visible.

The system supports multiple civic incident categories while using flooding and environmental hazards in Ilorin as one of its primary demonstration contexts.

---

## 2. Problem Statement

Citizens frequently encounter issues that require attention from communities, responders, or public institutions, including:

- Flooding;
- Blocked drainage;
- Damaged roads and infrastructure;
- Utility outages;
- Public safety hazards.

However, information about these incidents can be fragmented, incomplete, outdated, or difficult to verify.

A citizen may report an incident, but other people may not know:

- Whether the report is genuine;
- Whether anyone else has confirmed it;
- Whether a reviewer has inspected it;
- Whether the appropriate responder has been identified;
- What action should be taken;
- Whether the situation has been resolved.

TrustReport addresses this gap by creating a structured reporting and verification lifecycle.

---

## 3. Product Goal

Build a functional proof of concept that demonstrates how community-generated incident information can become more trustworthy through:

1. Structured reporting;
2. Evidence collection;
3. AI-assisted assessment;
4. Community confirmation;
5. Human/reviewer verification;
6. Transparent status progression;
7. Audit history;
8. Privacy-preserving reporting;
9. Appropriate responder recommendations;
10. Accessible presentation of information.

---

## 4. Objectives

### Primary Objectives
- Enable citizens to submit structured incident reports.
- Support multiple categories of civic incidents.
- Assess report credibility using AI-assisted analysis.
- Allow community members to confirm reported incidents.
- Allow authorized reviewers to inspect and update reports.
- Make verification status clearly visible.
- Maintain a chronological audit history.
- Protect reporter privacy.
- Help users understand appropriate next actions.
- Provide a map-based view of reported incidents.
- Support low-bandwidth access.

### Secondary Objectives
- Demonstrate how AI coding tools can accelerate development.
- Create a reusable architecture that can be adapted to different communities.
- Provide structured data that could support future civic-response systems.

---

## 5. Target Users

### 5.1 Citizens / Reporters
People who observe a public hazard or incident and want to report it.

**Needs:**
- Simple reporting;
- Ability to report anonymously;
- Location assistance;
- Ability to provide evidence;
- Ability to track report status;
- Clear information about what happens after submission.

### 5.2 Community Confirmers
Residents who encounter an existing incident and can provide confirmation.

**Needs:**
- Discover nearby/relevant reports;
- Review available evidence;
- Confirm whether they have independently observed the incident;
- Understand the current confidence/verification state.

### 5.3 Community Reviewers
Authorized users responsible for reviewing reports.

**Needs:**
- Inspect reports;
- View evidence;
- Review audit history;
- Record verification notes;
- Change verification status;
- Assign/recommend appropriate responders;
- Mark incidents as resolved where appropriate.

### 5.4 Civic/Response Stakeholders
Potential future users include relevant government agencies, emergency responders, utilities, NGOs, and community organizations.

*Note for MVP:* TrustReport does not claim direct integration with these organizations unless such integration actually exists. The system instead recommends an appropriate responder based on the incident category.

---

## 6. Supported Incident Categories

The MVP supports five major categories:

| Category | Example |
| :--- | :--- |
| **Flooding & Environmental** | Flooded road, erosion, environmental hazard |
| **Damaged Infrastructure** | Damaged road, bridge, streetlight, public facility |
| **Blocked Drainage & Sanitation** | Blocked drainage, waste accumulation, sanitation issue |
| **Utility/Public Utility Outages** | Electricity or other public utility disruption |
| **Public Safety / Community Safety Hazards** | Unsafe structure, exposed hazard, dangerous public area |

The architecture allows additional categories to be added without redesigning the reporting system.

---

## 7. Core User Journey

The primary TrustReport workflow is:

$$\text{Observe} \rightarrow \text{Report} \rightarrow \text{Assess} \rightarrow \text{Confirm} \rightarrow \text{Review} \rightarrow \text{Verify} \rightarrow \text{Escalate/Recommend} \rightarrow \text{Resolve}$$

### Example
1. A resident observes flooding.
2. They open TrustReport.
3. They submit the location, description, category, severity, and evidence.
4. TrustReport performs AI-assisted credibility assessment.
5. The report initially appears as **Unverified/Pending**.
6. Other residents who independently observe the same situation can confirm it.
7. The report's community confirmation count increases.
8. An authorized reviewer inspects the report.
9. If appropriate, the reviewer marks it **Field Verified**.
10. The system records the action in the audit history.
11. The appropriate responder is displayed/recommended.
12. When genuinely addressed, the report can move toward **Resolved/Closed**.

---

## 8. Functional Requirements

### FR-01 — Incident Reporting
Users shall be able to create an incident report.

**Required information:**
- Incident category;
- Title/short description;
- Detailed description;
- Location;
- Severity;
- Optional evidence/photo;
- Optional additional context.

The system should provide clear guidance so users understand what constitutes useful evidence.

### FR-02 — Anonymous Reporting
Users shall be able to submit reports without publicly exposing their identity. Public incident views must not expose private reporter contact information.

### FR-03 — Location Capture
The system shall support location information for incidents. Where precise coordinates are collected, the system should support coordinate fuzzing/blurring to reduce privacy and safety risks.

### FR-04 — AI-Assisted Credibility Assessment
The system shall use AI to assist with initial incident assessment.

The AI may analyze:
- Incident description;
- Category;
- Severity indicators;
- Evidence;
- Missing information;
- Potential risk signals.

The system may produce a credibility/confidence score between 0–100%.

> **Important requirement:** AI assessment must not be presented as proof that an incident is true. The UI should use language such as:
> `AI-assisted credibility assessment` rather than `Verified by AI`.

### FR-05 — AI Failure Handling
The platform shall continue functioning when the AI service is unavailable. A deterministic local fallback shall provide basic assessment using predefined rules/signals. The application must not fail simply because the external AI service is unavailable or incorrectly configured.

---

## 9. Verification Lifecycle

Every incident shall have a clearly defined verification state.

```
Unverified / Pending
        ↓
Community Confirmed
        ↓
Field Verified
        ↓
Official Escalated
        ↓
Resolved / Closed
```

These states represent progressively stronger forms of confirmation.

### FR-06 — Unverified / Pending
Every newly submitted report begins as **Unverified / Pending**. This prevents the platform from presenting an unconfirmed citizen report as established fact.

### FR-07 — Community Confirmation
Community members shall be able to confirm an incident they have independently observed.

The system shall:
- Record confirmations;
- Prevent inappropriate duplicate confirmations where applicable;
- Update the confirmation count;
- Display the community confirmation state;
- Record relevant actions in the audit history.

The MVP uses a threshold of **3+ independent confirmations** to transition into the **Community Confirmed** state.

*Rule:* Community confirmation does not mean the incident is objectively proven.

---

## 10. Reviewer Mode

### FR-08 — Reviewer Access
Authorized reviewers shall have access to a reviewer interface.

Reviewer Mode shall allow authorized users to:
- Inspect reports;
- Review evidence;
- Examine confirmation history;
- Review AI assessment;
- Inspect audit logs;
- Add verification notes;
- Update report status;
- Recommend/assign responders where applicable;
- Mark reports as resolved where appropriate.

---

## 11. Audit Trail

### FR-09 — Incident History
Each incident shall maintain a chronological history of significant events.

The audit history captures events such as:
- Report submitted;
- AI assessment performed;
- Community confirmation;
- Reviewer action;
- Status change;
- Verification note;
- Responder recommendation;
- Resolution.

Each event includes relevant timestamps and actor/action information where appropriate.

> **Integrity requirement:** If the underlying implementation does not cryptographically prevent modification, the product must describe this as an **append-only audit history**, not an immutable audit log.

---

## 12. Incident Inspection

### FR-10 — Incident Inspection Modal
Users/reviewers shall be able to inspect an incident in greater detail.

The inspection interface provides:
- Incident description;
- Category;
- Location;
- Severity;
- Evidence;
- AI assessment;
- Community confirmations;
- Current verification state;
- Audit history;
- Verification notes;
- Emergency/safety guidance;
- Recommended responder.

---

## 13. Responder Mapping

### FR-11 — Recommended Responder
TrustReport shall map incident categories to appropriate civic-response organizations or responder types.

| Incident | Recommended responder |
| :--- | :--- |
| **Flooding/environmental** | Relevant emergency/environmental authority |
| **Infrastructure damage** | Ministry/public works authority |
| **Drainage/sanitation** | Environmental/sanitation authority |
| **Utility outage** | Relevant utility provider |
| **Public safety hazard** | Relevant emergency/security authority |

The MVP clearly distinguishes **“Recommended responder”** from **“Report successfully sent to responder.”** Actual integration is only claimed if technically implemented.

---

## 14. GIS Map

### FR-12 — Incident Map
The platform shall provide a map displaying reported incidents.

Map functionality supports:
- Incident markers;
- Category filtering;
- Severity filtering;
- Incident selection;
- Current verification status;
- Location context.

The Ilorin environment serves as the primary demonstration context.

---

## 15. Safer Route Advisor

### FR-13 — Route Evaluation
The platform shall provide a Safer Route Advisor/Evaluator using available incident information.

The system identifies reported hazards that may affect a route. The feature clearly communicates that recommendations are based on available platform data and do not constitute authoritative emergency navigation.

---

## 16. Low-Bandwidth Mode

### FR-14 — Low-Bandwidth Experience
Users should be able to use TrustReport under limited connectivity.

Low-bandwidth mode prioritizes:
- Text over unnecessary media;
- Lightweight incident lists;
- Reduced map/media loading;
- Efficient data requests;
- Usable reporting without unnecessary assets.

---

## 17. Data Export

### FR-15 — CSV Dataset Export
Authorized users shall be able to export incident data as CSV.

Exported data supports:
- Incident analysis;
- Civic research;
- Operational review;
- Future integration.

Sensitive/private reporter information is not exposed in exports.

---

## 18. Accessibility

The application supports:
- Responsive mobile layouts;
- Readable typography;
- Keyboard-accessible interactions where applicable;
- Clear status labels;
- Understandable error messages;
- Sufficient contrast;
- Simple reporting workflows.

---

## 19. Privacy & Security Requirements

- **PR-01 — Reporter Privacy:** The platform shall avoid exposing private reporter information in public incident feeds.
- **PR-02 — Anonymous Reporting:** Reporter identity is not required for public participation where anonymity is selected.
- **PR-03 — Location Privacy:** Precise reporter location is not automatically publicly exposed where doing so creates unnecessary risk.
- **PR-04 — Authorization:** Reviewer functionality must not be available to ordinary users.
- **PR-05 — Input Validation:** User-generated content must be validated and sanitized.
- **PR-06 — API Security:** Sensitive AI/API credentials must remain server-side and must never be exposed through the frontend.

---

## 20. AI Requirements

AI is used as an assistive layer, not as the final authority.

### AI Responsibilities
- Classify incidents;
- Identify possible risk signals;
- Identify missing evidence;
- Assess report clarity;
- Produce credibility indicators;
- Suggest safety actions;
- Support structured processing.

### AI Limitations
AI must not:
- Independently declare an incident as fact;
- Replace human verification;
- Fabricate evidence;
- Create fake reports;
- Represent an unverified claim as official information.

---

## 21. Trust Model

TrustReport uses multiple signals rather than relying on a single score:

- Report quality;
- Evidence provided;
- AI-assisted assessment;
- Independent community confirmations;
- Reviewer inspection;
- Field verification;
- Official escalation;
- Resolution status.

The UI makes these signals understandable rather than hiding them behind one unexplained score.

---

## 22. Demo Data Requirements

Any seeded/demo incidents used during the hackathon presentation must be clearly identifiable as:

> **Demo Data**

The application must not create the impression that fictional incidents are real community reports.

---

## 23. Non-Functional Requirements

### Performance
- Fast initial loading.
- Efficient API calls.
- Functional on moderate mobile hardware.

### Reliability
- Core reporting must work without AI availability.
- Errors should fail gracefully.
- A temporary AI outage must not prevent incident submission.

### Scalability
- The incident-category architecture allows additional categories and jurisdictions to be introduced without rebuilding the entire application.

### Maintainability
- Clear separation between frontend, backend, AI services, and data.
- Reusable category/taxonomy definitions.
- Centralized verification-state handling.

---

## 24. MVP Scope

### Included
- Multi-category reporting
- Incident persistence
- Anonymous reporting
- Location capture
- Evidence
- AI-assisted assessment
- Local fallback assessment
- Community confirmation
- Verification lifecycle
- Reviewer Mode
- Audit history
- Incident inspection
- Responder recommendation
- GIS map
- Severity/category filters
- Safer Route Advisor
- Low-bandwidth mode
- CSV export
- Privacy controls
- Responsive UI

### Not Required for Hackathon MVP
- Direct government API integrations
- Real-time emergency dispatch
- Native mobile applications
- Nationwide deployment
- Fully automated official verification
- Production-grade emergency navigation
- Large-scale infrastructure deployment
- Guaranteed government response

---

## 25. Success Metrics

For the hackathon proof of concept, success is demonstrated through functionality rather than fabricated adoption numbers.

### Product Success
A user can:
- Submit an incident;
- Receive an AI-assisted assessment;
- See the report begin as unverified;
- Obtain community confirmations;
- Observe verification-state changes;
- Inspect the audit history;
- Have a reviewer inspect/update the report;
- Identify the recommended next responder/action;
- View the incident geographically;
- Use the system without AI availability.

### Trust Success
The demonstration makes it difficult for a user to confuse:
- Reported information with community-confirmed information, or
- Reviewer/field-verified information.

---

## 26. Key User Stories

- **Citizen:** As a resident, I want to report a public hazard so that other people and relevant stakeholders can know about it.
- **Anonymous Reporter:** As a reporter, I want to submit an incident anonymously so that I can contribute information without exposing my identity.
- **Community Member:** As a community member, I want to confirm an incident I have personally observed so that the platform can distinguish independently supported reports from single-user claims.
- **Reviewer:** As a reviewer, I want to inspect evidence and the report history so that I can make an informed verification decision.
- **Citizen:** As a citizen, I want to know whether an incident is unverified, community-confirmed, field-verified, escalated, or resolved so that I can judge how much confidence to place in the information.
- **Citizen:** As a citizen, I want to know the appropriate next action or responder so that reporting does not end with simply submitting a form.

---

## 27. Core Product Principle

TrustReport should never answer only:

> *“What happened?”*

It should also answer:

> *“How do we know?”*  
> *“What has happened since it was reported?”*  
> *“What should I do next?”*

That is the central product value of TrustReport.

---

## 28. Hackathon Positioning

TrustReport is a community incident reporting and credibility verification platform designed to make civic information more trustworthy by showing not only what people report, but how those reports are assessed, independently confirmed, reviewed, and progressed toward resolution.

The strongest demonstration focuses on the verification journey, not simply the map or reporting form.

### Recommended Demo Narrative
> A resident sees a hazard → submits a report → TrustReport structures and assesses it → the report remains unverified → other residents confirm it → a reviewer examines the evidence → the verification state changes → the audit history records what happened → the citizen sees the current status and appropriate next action.

That is the clearest expression of **“Information you can trust.”**
