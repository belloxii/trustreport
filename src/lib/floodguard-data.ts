export type Severity = "low" | "moderate" | "high" | "critical";

export type IncidentCategory = "flooding" | "infrastructure" | "sanitation" | "utility" | "safety";

export type ReportStatus =
  "submitted" | "under_review" | "verified" | "in_progress" | "resolved" | "rejected";

export type VerificationStatus =
  "unverified" | "community_confirmed" | "field_verified" | "official_escalated";

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  note?: string;
}

export interface IncidentReport {
  id: string;
  title: string;
  category: IncidentCategory;
  severity: Severity;
  location: string; // Neighborhood / Area
  street: string;
  coordinates: {
    lat: number;
    lng: number;
    x?: number;
    y?: number;
  };
  isCoordinatesFuzzed?: boolean;
  fuzzedRadiusMeters?: number;
  description: string;
  waterLevel?: string; // Specific to flooding, optional for other categories
  hazardType?: string; // Sub-classification
  timestamp: string; // Relative time (e.g. "12 mins ago")
  reportedAt: string; // ISO date string
  createdAt?: string; // Alias for reportedAt
  photoUrl?: string;
  status: ReportStatus;
  verificationStatus: VerificationStatus;
  confidenceScore: number; // 0 - 100 percentage
  credibilityScore?: number; // Alias
  confirmationsCount: number; // Community neighbor confirmations
  confirmations?: number; // Alias
  usefulCount: number;
  isSimulated: boolean; // Flag to indicate demo dataset vs user submission
  reporter: {
    isAnonymous: boolean;
    displayName: string;
    badge?: string;
    contactPhonePrivate?: string; // Stored securely, strictly hidden from public view
  };
  verificationNotes?: string;
  reviewerBadge?: string;
  safetyAdvice: string;
  escalatedTo?: string; // e.g. "Kwara State Fire Service" or "Ministry of Works"
  assignedResponder?: string; // Alias
  auditLog: AuditEntry[];
}

// Backward compatibility alias
export type DemoReport = IncidentReport;

export const CATEGORIES: Record<
  IncidentCategory,
  {
    id: IncidentCategory;
    label: string;
    emoji: string;
    shortLabel: string;
    description: string;
    badgeColor: string;
    iconBg: string;
    defaultResponder: string;
    responderPhone?: string;
  }
> = {
  flooding: {
    id: "flooding",
    label: "Flooding & Environmental",
    shortLabel: "Flooding",
    emoji: "🌊",
    description: "Rising floodwaters, submerged roadways, breached canals, waterlogged homes.",
    badgeColor: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
    iconBg: "bg-sky-500/20 text-sky-600 dark:text-sky-300",
    defaultResponder: "Kwara State Fire and Emergency Services / SEMA",
    responderPhone: "0803 323 1122",
  },
  infrastructure: {
    id: "infrastructure",
    label: "Damaged Infrastructure",
    shortLabel: "Infrastructure",
    emoji: "🏗️",
    description: "Collapsed bridges, broken culverts, deep road gullies, eroded foundations.",
    badgeColor: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
    iconBg: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
    defaultResponder: "Kwara State Ministry of Works & Transport",
    responderPhone: "0805 120 4455",
  },
  sanitation: {
    id: "sanitation",
    label: "Blocked Drainage & Sanitation",
    shortLabel: "Drainage",
    emoji: "🗑️",
    description: "Gutters blocked with solid waste, stagnant contaminated runoff, illegal dumps.",
    badgeColor: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
    iconBg: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
    defaultResponder: "KWEPA (Kwara State Environmental Protection Agency)",
    responderPhone: "0814 556 7890",
  },
  utility: {
    id: "utility",
    label: "Public Utility Outages",
    shortLabel: "Utilities",
    emoji: "⚡",
    description: "Fallen high-tension electrical cables, water main bursts, exposed live wires.",
    badgeColor: "bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-500/30",
    iconBg: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
    defaultResponder: "IBEDC Customer Service / Kwara Water Corporation",
    responderPhone: "0700 123 7777",
  },
  safety: {
    id: "safety",
    label: "Community Safety Hazards",
    shortLabel: "Safety",
    emoji: "🛡️",
    description: "Unmarked deep open pits, hazardous school crossings, storm-damaged structures.",
    badgeColor: "bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30",
    iconBg: "bg-rose-500/20 text-rose-700 dark:text-rose-300",
    defaultResponder: "Nigeria Security & Civil Defence Corps (NSCDC) / Community Watch",
    responderPhone: "0802 344 5678",
  },
};

export const STATUS_CONFIG: Record<
  ReportStatus,
  {
    label: string;
    color: string;
    badgeBg: string;
    description: string;
    stepIndex: number;
  }
> = {
  submitted: {
    label: "Submitted",
    color: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
    description: "Report received and queued for community review.",
    stepIndex: 1,
  },
  under_review: {
    label: "Under Review",
    color: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    description: "Community reviewers and local observers are checking facts and evidence.",
    stepIndex: 2,
  },
  verified: {
    label: "Verified",
    color: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    description: "Confirmed by multiple community members or field verification.",
    stepIndex: 3,
  },
  in_progress: {
    label: "In Progress",
    color: "text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
    description: "Escalated to local volunteer teams or municipal emergency contacts.",
    stepIndex: 4,
  },
  resolved: {
    label: "Resolved",
    color: "text-teal-600 dark:text-teal-400",
    badgeBg: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30",
    description: "Hazard cleared, water receded, or repairs completed.",
    stepIndex: 5,
  },
  rejected: {
    label: "Unverified / Closed",
    color: "text-slate-500 dark:text-slate-400",
    badgeBg: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
    description: "Insufficient evidence or conflicting reports; closed without escalation.",
    stepIndex: 0,
  },
};

export const VERIFICATION_CONFIG: Record<
  VerificationStatus,
  {
    label: string;
    emoji: string;
    badgeBg: string;
    trustScoreBase: number;
    description: string;
  }
> = {
  unverified: {
    label: "Pending Verification",
    emoji: "⏳",
    badgeBg: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
    trustScoreBase: 40,
    description: "Initial citizen observation; awaits neighbor confirmation or field audit.",
  },
  community_confirmed: {
    label: "Community Confirmed",
    emoji: "👥",
    badgeBg: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
    trustScoreBase: 78,
    description: "3+ verified residents in the immediate vicinity confirmed the hazard.",
  },
  field_verified: {
    label: "Field Verified",
    emoji: "✅",
    badgeBg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    trustScoreBase: 95,
    description: "Inspected on-ground by a designated community observer or liaison.",
  },
  official_escalated: {
    label: "Official Escalated",
    emoji: "🚨",
    badgeBg: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
    trustScoreBase: 98,
    description: "Forwarded directly to municipal emergency responders for dispatch.",
  },
};

export const SEVERITY: Record<
  Severity,
  {
    label: string;
    color: string;
    ring: string;
    bg: string;
    border: string;
    description: string;
  }
> = {
  low: {
    label: "Low Risk",
    color: "bg-emerald-500",
    ring: "ring-emerald-500/30",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/40",
    description: "Puddle formation or minor blockage; passable with normal caution.",
  },
  moderate: {
    label: "Moderate",
    color: "bg-amber-400",
    ring: "ring-amber-400/30",
    bg: "bg-amber-500/10",
    border: "border-amber-500/40",
    description: "Knee-high water or partial road barrier; slow down, detour if possible.",
  },
  high: {
    label: "High Risk",
    color: "bg-orange-500",
    ring: "ring-orange-500/30",
    bg: "bg-orange-500/10",
    border: "border-orange-500/40",
    description: "Fast-flowing runoff or submerged roads; do not attempt crossing on foot or car.",
  },
  critical: {
    label: "Critical Danger",
    color: "bg-rose-500",
    ring: "ring-rose-500/30",
    bg: "bg-rose-500/10",
    border: "border-rose-500/40",
    description: "Deep surging currents or structural collapse; immediate evacuation advisory.",
  },
};

export const ILORIN_AREAS = [
  "Tanke",
  "GRA",
  "Fate",
  "Adewole",
  "Sango",
  "Oke-Odo",
  "Basin",
  "Taiwo",
  "Maraba",
  "Challenge",
  "Kulende",
  "Pakata",
  "Gaa Akanbi",
  "Agbo-Oba",
  "Post Office",
  "Airport Road",
] as const;

export const AREA_RISK: Record<string, "low" | "moderate" | "high" | "critical"> = {
  Tanke: "high",
  GRA: "moderate",
  Fate: "low",
  Adewole: "moderate",
  Sango: "high",
  "Oke-Odo": "low",
  Basin: "critical",
  Taiwo: "high",
  Maraba: "critical",
  Challenge: "moderate",
  Kulende: "low",
  Pakata: "moderate",
  "Gaa Akanbi": "moderate",
  "Agbo-Oba": "high",
  "Post Office": "moderate",
  "Airport Road": "low",
};

export const INITIAL_REPORTS: IncidentReport[] = [
  {
    id: "TR-ILR-2048",
    title: "Deep Surge Around Tanke Tipper Garage Junction",
    category: "flooding",
    severity: "critical",
    location: "Tanke",
    street: "Tipper Garage Junction / University Road",
    coordinates: { lat: 8.482, lng: 4.595 },
    description:
      "Water level has risen past knee-depth following 45 minutes of heavy downpour. Two sedans stalled in the center lane. Runoff from the hill is surging into roadside shops.",
    waterLevel: "Knee-deep (approx 45cm)",
    hazardType: "Flash Flood / Stalled Traffic",
    timestamp: "18 mins ago",
    reportedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    photoUrl: "/assets/report-street.jpg",
    status: "verified",
    verificationStatus: "field_verified",
    confidenceScore: 94,
    confirmationsCount: 14,
    usefulCount: 32,
    isSimulated: true,
    reporter: {
      isAnonymous: false,
      displayName: "Aminat B. (Student Observer)",
      badge: "Community Lead",
    },
    verificationNotes:
      "Verified on-site by UNILORIN Student Union safety volunteer. Water depth confirmed above wheel hubs.",
    reviewerBadge: "Community Verification Lead",
    safetyAdvice:
      "Avoid University Road from Tanke Oke. Divert through Mark Roundabout or wait in safe higher ground.",
    escalatedTo: "Kwara State Fire and Emergency Services",
    auditLog: [
      {
        id: "log-1",
        timestamp: "18 mins ago",
        action: "Report Submitted",
        actor: "Aminat B. (Citizen)",
        note: "Initial report submitted with geo-tag and photo.",
      },
      {
        id: "log-2",
        timestamp: "12 mins ago",
        action: "Status changed to Under Review",
        actor: "System AI / Auto-Triager",
        note: "High severity flagged based on keyword density and stalled vehicles.",
      },
      {
        id: "log-3",
        timestamp: "5 mins ago",
        action: "Report Verified",
        actor: "Tunde O. (Community Observer)",
        note: "Cross-checked with 12 neighbor confirmations. Field verified.",
      },
    ],
  },
  {
    id: "TR-ILR-1092",
    title: "Blocked Culvert & Overflow at Sango Bridge Area",
    category: "sanitation",
    severity: "high",
    location: "Sango",
    street: "Old Jebba Road / Sango Market Junction",
    coordinates: { lat: 8.52, lng: 4.568 },
    description:
      "Solid waste dumped into primary drainage canal caused complete blockage. Rain runoff has overflowed onto the roadway, carrying plastics and mud into open market stalls.",
    waterLevel: "Shin-deep (approx 25cm)",
    hazardType: "Blocked Storm Drainage Canal",
    timestamp: "42 mins ago",
    reportedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    photoUrl: "/assets/report-drainage.jpg",
    status: "in_progress",
    verificationStatus: "community_confirmed",
    confidenceScore: 88,
    confirmationsCount: 9,
    usefulCount: 21,
    isSimulated: true,
    reporter: {
      isAnonymous: true,
      displayName: "Local Trader (Anonymous)",
    },
    verificationNotes: "Community leaders confirmed blockage. Clean-up volunteer squad notified.",
    reviewerBadge: "Civil Observer",
    safetyAdvice:
      "Wear waterproof boots to prevent contact with contaminated wastewater. Drive on the elevated crown of the road.",
    escalatedTo: "KWEPA Sanitation Taskforce",
    auditLog: [
      {
        id: "log-1",
        timestamp: "42 mins ago",
        action: "Report Submitted",
        actor: "Anonymous Citizen",
      },
      {
        id: "log-2",
        timestamp: "25 mins ago",
        action: "Community Confirmed",
        actor: "Sango Market Association",
        note: "Confirmed culvert is 90% choked with PET bottles.",
      },
    ],
  },
  {
    id: "TR-ILR-3104",
    title: "Collapsed Culvert & Shoulder Erosion on Basin Canal",
    category: "infrastructure",
    severity: "high",
    location: "Basin",
    street: "Basin Road Near Upper River Basin Authority",
    coordinates: { lat: 8.498, lng: 4.58 },
    description:
      "Concrete canal wall cracked and partially collapsed under intense hydraulic pressure. The asphalt edge is undermined and crumbling near the pedestrian walkway.",
    hazardType: "Eroded Road Shoulder / Broken Culvert",
    timestamp: "1 hr ago",
    reportedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    photoUrl: "/assets/report-school.jpg",
    status: "under_review",
    verificationStatus: "unverified",
    confidenceScore: 72,
    confirmationsCount: 4,
    usefulCount: 16,
    isSimulated: true,
    reporter: {
      isAnonymous: false,
      displayName: "Ibrahim K.",
      badge: "Neighborhood Watch",
    },
    safetyAdvice:
      "Keep children away from the canal bank. Pedestrians should use the opposite paved sidewalk.",
    escalatedTo: "Ministry of Works & Transport",
    auditLog: [
      {
        id: "log-1",
        timestamp: "1 hr ago",
        action: "Report Submitted",
        actor: "Ibrahim K.",
      },
    ],
  },
  {
    id: "TR-ILR-4211",
    title: "Fallen Low-Tension Wire in Standing Water",
    category: "utility",
    severity: "critical",
    location: "Taiwo",
    street: "Taiwo Isale / Near Stadium Road",
    coordinates: { lat: 8.475, lng: 4.542 },
    description:
      "Strong wind gusts brought down a service wire spanning across the road. The cable is resting in water near a busy tricycle stop. High risk of electrical shock.",
    hazardType: "Live Wire in Water",
    timestamp: "2 hrs ago",
    reportedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    photoUrl: "/assets/report-utility-wire.jpg",
    status: "in_progress",
    verificationStatus: "official_escalated",
    confidenceScore: 97,
    confirmationsCount: 19,
    usefulCount: 45,
    isSimulated: true,
    reporter: {
      isAnonymous: false,
      displayName: "Kehinde A.",
    },
    verificationNotes:
      "Dispatched alert to IBEDC emergency substation. Local youth cordoned area with wooden branches.",
    reviewerBadge: "Civil Defense Liaison",
    safetyAdvice:
      "STAY AT LEAST 10 METERS AWAY. Do NOT touch standing water or fences in the immediate radius.",
    escalatedTo: "IBEDC Emergency Dispatch Unit",
    auditLog: [
      {
        id: "log-1",
        timestamp: "2 hrs ago",
        action: "Report Submitted",
        actor: "Kehinde A.",
      },
      {
        id: "log-2",
        timestamp: "1 hr 45 mins ago",
        action: "Escalated to Utility",
        actor: "Reviewer Mode",
        note: "IBEDC safety desk contacted for feeder isolation.",
      },
    ],
  },
  {
    id: "TR-ILR-5532",
    title: "Mild Roadside Ponding at Fate Roundabout",
    category: "flooding",
    severity: "low",
    location: "Fate",
    street: "Fate Road / Shoprite Approach",
    coordinates: { lat: 8.489, lng: 4.572 },
    description:
      "Minor puddle formation along outer lane. Vehicles are slowing down slightly but both lanes remain fully passable without obstruction.",
    waterLevel: "Ankle-deep (approx 8cm)",
    hazardType: "Surface Ponding",
    timestamp: "3 hrs ago",
    reportedAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    photoUrl: "/assets/report-submerged-road.jpg",
    status: "resolved",
    verificationStatus: "field_verified",
    confidenceScore: 91,
    confirmationsCount: 8,
    usefulCount: 12,
    isSimulated: true,
    reporter: {
      isAnonymous: false,
      displayName: "Dr. Alabi",
    },
    verificationNotes:
      "Drainage cleared naturally within 40 minutes after rain stopped. Road fully dry.",
    reviewerBadge: "Community Observer",
    safetyAdvice: "Drive with standard wet-weather headlights on. Maintain moderate speed.",
    auditLog: [
      {
        id: "log-1",
        timestamp: "3 hrs ago",
        action: "Report Submitted",
        actor: "Dr. Alabi",
      },
      {
        id: "log-2",
        timestamp: "1 hr ago",
        action: "Marked Resolved",
        actor: "Community Reviewer",
        note: "Water has completely drained.",
      },
    ],
  },
  {
    id: "TR-ILR-6019",
    title: "Open Uncovered Storm Drain Beside Primary School Gate",
    category: "safety",
    severity: "moderate",
    location: "Adewole",
    street: "Adewole Estate / Road 3 Gate",
    coordinates: { lat: 8.47, lng: 4.52 },
    description:
      "Concrete drain slab was removed during construction and left open. When flooded during morning school runs, children cannot see the deep trench under murky water.",
    hazardType: "Uncovered Deep Drain / School Hazard",
    timestamp: "4 hrs ago",
    reportedAt: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    photoUrl: "/assets/report-open-drain.jpg",
    status: "verified",
    verificationStatus: "community_confirmed",
    confidenceScore: 89,
    confirmationsCount: 11,
    usefulCount: 28,
    isSimulated: true,
    reporter: {
      isAnonymous: false,
      displayName: "Parent-Teacher Volunteer",
    },
    verificationNotes:
      "Temporary warning flags placed by community members. Formal notice sent to Estate Committee.",
    reviewerBadge: "Safety Hero",
    safetyAdvice:
      "Hold children's hands firmly when walking near school boundary. Do not step off the curb.",
    escalatedTo: "Adewole Community Development Association",
    auditLog: [
      {
        id: "log-1",
        timestamp: "4 hrs ago",
        action: "Report Submitted",
        actor: "PTA Volunteer",
      },
      {
        id: "log-2",
        timestamp: "3 hrs ago",
        action: "Verified & Flagged",
        actor: "Estate Safety Officer",
      },
    ],
  },
  {
    id: "TR-ILR-7188",
    title: "Asa River Spillover Threatens Unity Road Bridge",
    category: "flooding",
    severity: "critical",
    location: "Unity",
    street: "Unity Road / Asa River Bridge Approach",
    coordinates: { lat: 8.487, lng: 4.548 },
    description:
      "Asa River water level has reached the lower girder of the bridge after prolonged rainfall upstream. Floodwaters are creeping onto the commercial service road and threatening low-lying shop basements.",
    waterLevel: "Waist-deep (approx 90cm)",
    hazardType: "River Spillover / Structural Bridge Risk",
    timestamp: "50 mins ago",
    reportedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    photoUrl: "/assets/report-bridge-overflow.jpg",
    status: "under_review",
    verificationStatus: "field_verified",
    confidenceScore: 95,
    confirmationsCount: 23,
    usefulCount: 54,
    isSimulated: true,
    reporter: {
      isAnonymous: false,
      displayName: "Engr. Mustapha (Hydrology Observer)",
      badge: "Civil Engineer",
    },
    verificationNotes:
      "Civil engineering inspector measured river crest at 0.4m below critical roadway deck.",
    reviewerBadge: "Municipal Inspector",
    safetyAdvice:
      "Heavy vehicles should avoid Unity Bridge. Divert via Post Office or New Yidi Road.",
    escalatedTo: "Kwara State Ministry of Environment & Water Resources",
    auditLog: [
      {
        id: "log-1",
        timestamp: "50 mins ago",
        action: "Report Submitted",
        actor: "Engr. Mustapha",
        note: "Hydrological river gauge reading attached.",
      },
      {
        id: "log-2",
        timestamp: "30 mins ago",
        action: "Status changed to Field Verified",
        actor: "State Emergency Desk",
        note: "Emergency flood response team alerted.",
      },
    ],
  },
  {
    id: "TR-ILR-8240",
    title: "Severe Road Gully & Collapsed Asphalt on Kulende Express",
    category: "infrastructure",
    severity: "high",
    location: "Kulende",
    street: "Old Jebba Road / Kulende Housing Estate Junction",
    coordinates: { lat: 8.535, lng: 4.582 },
    description:
      "Heavy stormwater runoff gouged a 2-meter deep lateral erosion chasm along the northbound carriageway. Half the lane has collapsed into the ditch, leaving vehicles swerving dangerously into oncoming traffic.",
    hazardType: "Roadway Collapse / Erosion Chasm",
    timestamp: "1.5 hrs ago",
    reportedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    photoUrl: "/assets/report-road-sinkhole.jpg",
    status: "in_progress",
    verificationStatus: "official_escalated",
    confidenceScore: 92,
    confirmationsCount: 17,
    usefulCount: 39,
    isSimulated: true,
    reporter: {
      isAnonymous: false,
      displayName: "Comrade Salihu (Transport Union)",
      badge: "RTEAN Marshal",
    },
    verificationNotes:
      "RTEAN marshals erected reflective barrels around the collapsed edge. Ministry road maintenance gang scheduled for rapid aggregate filling.",
    reviewerBadge: "Transport Safety Liaison",
    safetyAdvice:
      "Do not overtake near Kulende junction. Slow down to 20km/h and follow traffic marshal hand signals.",
    escalatedTo: "Kwara State Ministry of Works & Transport (KWSG)",
    auditLog: [
      {
        id: "log-1",
        timestamp: "1.5 hrs ago",
        action: "Report Submitted",
        actor: "Comrade Salihu",
      },
      {
        id: "log-2",
        timestamp: "1 hr ago",
        action: "Escalated to Ministry",
        actor: "Field Reviewer",
        note: "Work order request generated for KWSG road division.",
      },
    ],
  },
  {
    id: "TR-ILR-9355",
    title: "Solid Waste Choke in Perimeter Canal near Post Office Market",
    category: "sanitation",
    severity: "moderate",
    location: "Post Office",
    street: "Murtala Mohammed Way / Behind Central Post Office",
    coordinates: { lat: 8.494, lng: 4.542 },
    description:
      "Massive pile of discarded carton bundles, Styrofoam containers, and plastic sacks has sealed the entrance of the primary underground storm culvert. Sludge is beginning to back up toward commercial store entrances.",
    waterLevel: "Shin-deep (approx 20cm)",
    hazardType: "Solid Waste Drainage Blockage",
    timestamp: "2.5 hrs ago",
    reportedAt: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    photoUrl: "/assets/report-waste-choke.jpg",
    status: "verified",
    verificationStatus: "community_confirmed",
    confidenceScore: 86,
    confirmationsCount: 8,
    usefulCount: 19,
    isSimulated: true,
    reporter: {
      isAnonymous: true,
      displayName: "Anonymous Shopkeeper (Anonymous)",
    },
    verificationNotes:
      "KWEPA sanitation sweepers conducted initial site survey. Heavy excavator backhoe requested for culvert clearance.",
    reviewerBadge: "Community Moderator",
    safetyAdvice:
      "Avoid parking alongside drainage curbs. Do not dump domestic refuse into open canals.",
    escalatedTo: "KWEPA Sanitation Taskforce",
    auditLog: [
      {
        id: "log-1",
        timestamp: "2.5 hrs ago",
        action: "Report Submitted",
        actor: "Anonymous Citizen",
      },
      {
        id: "log-2",
        timestamp: "1.5 hrs ago",
        action: "Community Corroborated",
        actor: "Market Traders Committee",
        note: "Confirmed canal entrance blocked by refuse.",
      },
    ],
  },
  {
    id: "TR-ILR-1049",
    title: "Submerged Transformer Plinth & Flooded Substation Yard",
    category: "utility",
    severity: "critical",
    location: "Oloje",
    street: "Oloje Industrial Layout / Near Flour Mills Road",
    coordinates: { lat: 8.512, lng: 4.528 },
    description:
      "Runoff from nearby high ground has inundated the distribution transformer enclosure with 30cm of murky water. Oil slicks visible on water surface and transformer hum has changed pitch. Imminent risk of flashover explosion.",
    hazardType: "Electrical Substation Submersion",
    timestamp: "35 mins ago",
    reportedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    photoUrl: "/assets/report-utility-wire.jpg",
    status: "under_review",
    verificationStatus: "field_verified",
    confidenceScore: 96,
    confirmationsCount: 15,
    usefulCount: 48,
    isSimulated: true,
    reporter: {
      isAnonymous: false,
      displayName: "Babatunde R. (Oloje Youth Vanguard)",
      badge: "Community Watch",
    },
    verificationNotes:
      "IBEDC control room dispatched technician to trip 11kV upstream feeder breaker to isolate the substation safely.",
    reviewerBadge: "Certified Electrical Auditor",
    safetyAdvice:
      "KEEP CLEAR OF PERIMETER FENCE. Do not attempt to step inside transformer gravel enclosure.",
    escalatedTo: "IBEDC Emergency Dispatch Unit",
    auditLog: [
      {
        id: "log-1",
        timestamp: "35 mins ago",
        action: "Report Submitted",
        actor: "Babatunde R.",
      },
      {
        id: "log-2",
        timestamp: "20 mins ago",
        action: "Field Verified & Priority Escalate",
        actor: "IBEDC Field Officer",
        note: "Feeder tripped remotely. Technicians en route.",
      },
    ],
  },
];

// For backward compatibility
export const DEMO_REPORTS = INITIAL_REPORTS;

export interface SafetySection {
  phase: "Before" | "During" | "After";
  emoji: string;
  tagline: string;
  tips: string[];
}

export const SAFETY_SECTIONS: SafetySection[] = [
  {
    phase: "Before",
    emoji: "🌧️",
    tagline: "Prepare early before the dark clouds gather",
    tips: [
      "Keep drainage gutters and culverts in front of your home clear of plastic bottles and debris.",
      "Pack family emergency documents (IDs, school records) in a waterproof ziploc bag.",
      "Store flashlights, spare batteries, and 3 days of clean sealed drinking water.",
      "Identify higher ground routes in your neighborhood in case primary roads submerge.",
    ],
  },
  {
    phase: "During",
    emoji: "🌊",
    tagline: "Stay smart, never walk or drive through moving currents",
    tips: [
      "Turn Around, Don't Drown: Just 15cm (6 inches) of moving water can knock you off your feet.",
      "30cm of moving water can float a car; never attempt driving across flooded roads.",
      "Stay away from electrical power poles, fallen wires, and submerged transformer boxes.",
      "Move children and elderly family members to upper levels or designated shelters early.",
    ],
  },
  {
    phase: "After",
    emoji: "🌤️",
    tagline: "Inspect safely, avoid contamination and hidden hazards",
    tips: [
      "Avoid wading in standing floodwater—it often conceals sharp debris, open manholes, and reptiles.",
      "Do not switch on home power breakers until an electrician checks that wiring has dried.",
      "Boil all tap water or use water purification tablets before drinking.",
      "Report blocked public drainage or broken culverts on TrustReport to alert neighbors.",
    ],
  },
];

export const FLOOD_CAUSES = [
  {
    emoji: "🌧️",
    title: "Heavy Tropical Downpours",
    explanation:
      "Ilorin experiences intense rainfall peaks during the wet season, discharging millions of liters of stormwater within short 30-to-60 minute windows that quickly overwhelm ground absorption.",
  },
  {
    emoji: "🗑️",
    title: "Blocked Canals & Waste Disposal",
    explanation:
      "Single-use plastics, domestic waste, and silt build up in drainage gutters around market junctions (like Sango and Maraba), preventing stormwater from draining freely into natural river channels.",
  },
  {
    emoji: "🏗️",
    title: "Building on Natural Floodplains",
    explanation:
      "Urban expansion into natural wetland basins (such as parts of Basin, Asa River corridors, and lower Tanke) creates impermeable concrete surfaces where water cannot naturally soak into the soil.",
  },
  {
    emoji: "🏙️",
    title: "Undersized Culverts & Bridges",
    explanation:
      "Older drainage infrastructure built decades ago is too narrow for current urban density, creating bottleneck backflows that submerge adjacent streets and homes.",
  },
];

export const CHALLENGE_TASKS = [
  { id: "task-gutter", emoji: "🧹", text: "Cleared plastic bottles and leaves from front gutter" },
  { id: "task-bag", emoji: "🎒", text: "Prepared a waterproof grab-bag for family documents" },
  {
    id: "task-report",
    emoji: "🚨",
    text: "Submitted a verified hazard or flood report on TrustReport",
  },
  { id: "task-share", emoji: "📢", text: "Shared safety rules with 3 neighbors or school friends" },
  {
    id: "task-waste",
    emoji: "♻️",
    text: "Disposed of plastic containers in a bin instead of the drain",
  },
  { id: "task-verify", emoji: "🔎", text: "Confirmed or audited an incident report in my area" },
];

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  how: string;
}

export const BADGES: Badge[] = [
  { id: "rain-watcher", name: "Rain Watcher", emoji: "🌧️", how: "Visit TrustReport & explore map" },
  { id: "safety-learner", name: "Safety Learner", emoji: "🛟", how: "Score 4+ on the Safety Quiz" },
  {
    id: "incident-reporter",
    name: "Community Reporter",
    emoji: "📢",
    how: "Submit your first incident report",
  },
  {
    id: "truth-guardian",
    name: "Truth Guardian",
    emoji: "🔍",
    how: "Verify or confirm 3 community alerts",
  },
  {
    id: "ilorin-champion",
    name: "Ilorin Champion",
    emoji: "🏆",
    how: "Earn 100+ community safety points",
  },
];

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  why: string;
  level: "Easy" | "Medium" | "Pro";
}

export const QUIZ: QuizQuestion[] = [
  {
    q: "How much moving floodwater is enough to sweep an adult off their feet?",
    options: [
      "1 meter",
      "15 centimeters (6 inches)",
      "Up to the waist",
      "Only deep river currents",
    ],
    answer: 1,
    why: "Just 15cm of fast-moving water has enough hydraulic force to knock an adult down, while 30cm can float most passenger cars.",
    level: "Easy",
  },
  {
    q: "If you see a fallen electrical wire lying in floodwater, what should you do?",
    options: [
      "Try to push it aside with a dry stick",
      "Walk quickly through the water before it charges",
      "Stay at least 10 meters away, warn others, and alert emergency services",
      "Throw a rubber mat over it",
    ],
    answer: 2,
    why: "Water conducts electricity rapidly. Stay far back (at least 10 meters) and immediately notify authorities or IBEDC.",
    level: "Medium",
  },
  {
    q: "What is the most effective daily action community members can take to prevent street flooding?",
    options: [
      "Keep drainage gutters clear of plastic waste and trash",
      "Build higher walls around individual houses only",
      "Wait for rain to wash everything away",
      "Close all house windows",
    ],
    answer: 0,
    why: "Blocked drains are the #1 cause of flash flooding in Ilorin neighborhoods. Keeping gutters clear allows stormwater to drain immediately.",
    level: "Easy",
  },
  {
    q: "When submitting an incident report on TrustReport, what makes it most credible?",
    options: [
      "Using all capital letters",
      "Providing exact street location, clear factual description, and photo evidence",
      "Writing rumors heard from social media",
      "Exaggerating the water depth",
    ],
    answer: 1,
    why: "Credible reporting relies on verifiable facts: specific cross-streets, objective descriptions, and clear visual evidence help responders triage effectively.",
    level: "Medium",
  },
  {
    q: "What should you do before drinking tap or well water after a major flood event?",
    options: [
      "Drink it immediately if it looks clear",
      "Boil it vigorously or use certified water purification tablets",
      "Just add ice cubes",
      "Store it in an open bucket",
    ],
    answer: 1,
    why: "Floodwaters frequently contaminate underground wells and municipal pipes with bacteria. Boiling kills harmful pathogens.",
    level: "Pro",
  },
];

export const LEADERBOARD = [
  { rank: 1, name: "Farida S.", area: "Tanke", points: 260, emoji: "🥇", badge: "Truth Guardian" },
  { rank: 2, name: "Ibrahim K.", area: "GRA", points: 215, emoji: "🥈", badge: "Community Lead" },
  { rank: 3, name: "Emmanuel A.", area: "Fate", points: 190, emoji: "🥉", badge: "Safety Hero" },
  { rank: 4, name: "Zainab Y.", area: "Adewole", points: 145, emoji: "⭐", badge: "Reporter" },
  { rank: 5, name: "Chinedu O.", area: "Basin", points: 120, emoji: "⭐", badge: "Rain Watcher" },
];
