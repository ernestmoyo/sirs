// SADC Member States with mock INFORM-style risk data
export interface CountryRisk {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  riskScore: number;
  hazardScore: number;
  exposureScore: number;
  vulnerabilityScore: number;
  copingCapacity: number;
  population: number;
  affectedPopulation: number;
  activeAlerts: number;
  districts: DistrictRisk[];
}

export interface DistrictRisk {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  riskScore: number;
  hazardScore: number;
  exposureScore: number;
  vulnerabilityScore: number;
  population: number;
  affectedPopulation: number;
  facilities: {
    health: number;
    healthAtRisk: number;
    wash: number;
    washAtRisk: number;
    schools: number;
    schoolsAtRisk: number;
  };
}

export interface ActiveEvent {
  id: string;
  name: string;
  type: "cyclone" | "flood" | "drought" | "storm";
  severity: "critical" | "high" | "moderate" | "low";
  startDate: string;
  countries: string[];
  affectedPopulation: number;
  status: "active" | "watch" | "resolved";
  description: string;
  lat: number;
  lng: number;
}

export interface TriggerConfig {
  id: string;
  name: string;
  organization: string;
  country: string;
  metric: string;
  threshold: number;
  currentValue: number;
  status: "green" | "amber" | "red";
  lastUpdated: string;
  activationHistory: { date: string; value: number }[];
}

export interface Scenario {
  id: string;
  name: string;
  type: "cyclone" | "flood" | "drought";
  status: "draft" | "running" | "completed";
  createdBy: string;
  createdAt: string;
  description: string;
  affectedCountries: string[];
  estimatedAffected: number;
  estimatedFacilitiesAtRisk: number;
}

export interface Assessment {
  id: string;
  title: string;
  type: "rapid_damage" | "needs" | "facility_status" | "coping_capacity";
  status: "draft" | "deployed" | "collecting" | "completed";
  responses: number;
  targetResponses: number;
  createdAt: string;
  country: string;
  submittedBy: string;
}

// --- Mock Data ---

export const sadcCountries: CountryRisk[] = [
  {
    id: "moz", name: "Mozambique", code: "MZ", lat: -18.67, lng: 35.53,
    riskScore: 0.82, hazardScore: 0.88, exposureScore: 0.79, vulnerabilityScore: 0.81, copingCapacity: 0.35,
    population: 32_163_047, affectedPopulation: 2_450_000, activeAlerts: 3,
    districts: [
      { id: "moz-sofala", name: "Sofala", country: "Mozambique", lat: -19.84, lng: 34.84, riskScore: 0.91, hazardScore: 0.93, exposureScore: 0.88, vulnerabilityScore: 0.85, population: 2_221_803, affectedPopulation: 890_000, facilities: { health: 145, healthAtRisk: 67, wash: 312, washAtRisk: 134, schools: 487, schoolsAtRisk: 201 } },
      { id: "moz-zambezia", name: "Zambezia", country: "Mozambique", lat: -16.56, lng: 36.97, riskScore: 0.85, hazardScore: 0.82, exposureScore: 0.84, vulnerabilityScore: 0.88, population: 5_110_787, affectedPopulation: 670_000, facilities: { health: 198, healthAtRisk: 45, wash: 445, washAtRisk: 98, schools: 612, schoolsAtRisk: 156 } },
      { id: "moz-nampula", name: "Nampula", country: "Mozambique", lat: -15.12, lng: 39.27, riskScore: 0.72, hazardScore: 0.75, exposureScore: 0.71, vulnerabilityScore: 0.74, population: 6_102_867, affectedPopulation: 340_000, facilities: { health: 210, healthAtRisk: 28, wash: 520, washAtRisk: 67, schools: 734, schoolsAtRisk: 89 } },
      { id: "moz-inhambane", name: "Inhambane", country: "Mozambique", lat: -23.86, lng: 35.38, riskScore: 0.68, hazardScore: 0.71, exposureScore: 0.65, vulnerabilityScore: 0.72, population: 1_488_676, affectedPopulation: 180_000, facilities: { health: 87, healthAtRisk: 15, wash: 198, washAtRisk: 34, schools: 312, schoolsAtRisk: 45 } },
    ]
  },
  {
    id: "mwi", name: "Malawi", code: "MW", lat: -13.25, lng: 34.30,
    riskScore: 0.76, hazardScore: 0.79, exposureScore: 0.73, vulnerabilityScore: 0.78, copingCapacity: 0.31,
    population: 19_647_684, affectedPopulation: 1_230_000, activeAlerts: 2,
    districts: [
      { id: "mwi-nsanje", name: "Nsanje", country: "Malawi", lat: -16.92, lng: 35.26, riskScore: 0.88, hazardScore: 0.91, exposureScore: 0.85, vulnerabilityScore: 0.87, population: 299_168, affectedPopulation: 145_000, facilities: { health: 23, healthAtRisk: 12, wash: 67, washAtRisk: 34, schools: 89, schoolsAtRisk: 45 } },
      { id: "mwi-chikwawa", name: "Chikwawa", country: "Malawi", lat: -16.03, lng: 34.80, riskScore: 0.84, hazardScore: 0.86, exposureScore: 0.81, vulnerabilityScore: 0.83, population: 564_684, affectedPopulation: 210_000, facilities: { health: 34, healthAtRisk: 15, wash: 89, washAtRisk: 42, schools: 134, schoolsAtRisk: 56 } },
      { id: "mwi-zomba", name: "Zomba", country: "Malawi", lat: -15.39, lng: 35.32, riskScore: 0.65, hazardScore: 0.68, exposureScore: 0.63, vulnerabilityScore: 0.67, population: 746_724, affectedPopulation: 89_000, facilities: { health: 45, healthAtRisk: 8, wash: 112, washAtRisk: 19, schools: 178, schoolsAtRisk: 23 } },
    ]
  },
  {
    id: "mdg", name: "Madagascar", code: "MG", lat: -18.77, lng: 46.87,
    riskScore: 0.74, hazardScore: 0.81, exposureScore: 0.72, vulnerabilityScore: 0.76, copingCapacity: 0.28,
    population: 28_427_328, affectedPopulation: 980_000, activeAlerts: 2,
    districts: [
      { id: "mdg-analanjirofo", name: "Analanjirofo", country: "Madagascar", lat: -16.91, lng: 49.38, riskScore: 0.83, hazardScore: 0.87, exposureScore: 0.80, vulnerabilityScore: 0.82, population: 1_035_469, affectedPopulation: 320_000, facilities: { health: 56, healthAtRisk: 24, wash: 123, washAtRisk: 56, schools: 198, schoolsAtRisk: 78 } },
      { id: "mdg-atsimo", name: "Atsimo-Atsinanana", country: "Madagascar", lat: -23.35, lng: 47.06, riskScore: 0.78, hazardScore: 0.80, exposureScore: 0.76, vulnerabilityScore: 0.79, population: 898_755, affectedPopulation: 210_000, facilities: { health: 34, healthAtRisk: 14, wash: 78, washAtRisk: 32, schools: 145, schoolsAtRisk: 45 } },
    ]
  },
  {
    id: "tza", name: "Tanzania", code: "TZ", lat: -6.37, lng: 34.89,
    riskScore: 0.58, hazardScore: 0.62, exposureScore: 0.55, vulnerabilityScore: 0.61, copingCapacity: 0.45,
    population: 61_741_120, affectedPopulation: 540_000, activeAlerts: 1,
    districts: [
      { id: "tza-dar", name: "Dar es Salaam", country: "Tanzania", lat: -6.79, lng: 39.28, riskScore: 0.67, hazardScore: 0.70, exposureScore: 0.72, vulnerabilityScore: 0.55, population: 5_383_728, affectedPopulation: 180_000, facilities: { health: 234, healthAtRisk: 23, wash: 456, washAtRisk: 45, schools: 678, schoolsAtRisk: 56 } },
    ]
  },
  {
    id: "zaf", name: "South Africa", code: "ZA", lat: -30.56, lng: 22.94,
    riskScore: 0.42, hazardScore: 0.48, exposureScore: 0.40, vulnerabilityScore: 0.45, copingCapacity: 0.68,
    population: 59_308_690, affectedPopulation: 320_000, activeAlerts: 1,
    districts: []
  },
  {
    id: "zwe", name: "Zimbabwe", code: "ZW", lat: -19.02, lng: 29.15,
    riskScore: 0.61, hazardScore: 0.55, exposureScore: 0.58, vulnerabilityScore: 0.72, copingCapacity: 0.38,
    population: 15_092_171, affectedPopulation: 410_000, activeAlerts: 1,
    districts: []
  },
  {
    id: "zmb", name: "Zambia", code: "ZM", lat: -13.13, lng: 27.85,
    riskScore: 0.53, hazardScore: 0.50, exposureScore: 0.52, vulnerabilityScore: 0.59, copingCapacity: 0.48,
    population: 18_383_955, affectedPopulation: 280_000, activeAlerts: 0,
    districts: []
  },
  {
    id: "bwa", name: "Botswana", code: "BW", lat: -22.33, lng: 24.68,
    riskScore: 0.31, hazardScore: 0.28, exposureScore: 0.30, vulnerabilityScore: 0.35, copingCapacity: 0.72,
    population: 2_351_627, affectedPopulation: 45_000, activeAlerts: 0,
    districts: []
  },
  {
    id: "nam", name: "Namibia", code: "NA", lat: -22.96, lng: 18.49,
    riskScore: 0.35, hazardScore: 0.32, exposureScore: 0.34, vulnerabilityScore: 0.38, copingCapacity: 0.65,
    population: 2_540_905, affectedPopulation: 52_000, activeAlerts: 0,
    districts: []
  },
  {
    id: "ago", name: "Angola", code: "AO", lat: -11.20, lng: 17.87,
    riskScore: 0.62, hazardScore: 0.58, exposureScore: 0.60, vulnerabilityScore: 0.68, copingCapacity: 0.40,
    population: 32_866_272, affectedPopulation: 380_000, activeAlerts: 1,
    districts: []
  },
  {
    id: "cod", name: "DR Congo", code: "CD", lat: -4.04, lng: 21.76,
    riskScore: 0.78, hazardScore: 0.72, exposureScore: 0.75, vulnerabilityScore: 0.85, copingCapacity: 0.22,
    population: 89_561_403, affectedPopulation: 1_850_000, activeAlerts: 2,
    districts: []
  },
  {
    id: "swz", name: "Eswatini", code: "SZ", lat: -26.52, lng: 31.47,
    riskScore: 0.44, hazardScore: 0.41, exposureScore: 0.43, vulnerabilityScore: 0.50, copingCapacity: 0.52,
    population: 1_160_164, affectedPopulation: 67_000, activeAlerts: 0,
    districts: []
  },
  {
    id: "lso", name: "Lesotho", code: "LS", lat: -29.61, lng: 28.23,
    riskScore: 0.48, hazardScore: 0.45, exposureScore: 0.47, vulnerabilityScore: 0.55, copingCapacity: 0.47,
    population: 2_142_249, affectedPopulation: 89_000, activeAlerts: 0,
    districts: []
  },
  {
    id: "mus", name: "Mauritius", code: "MU", lat: -20.35, lng: 57.55,
    riskScore: 0.38, hazardScore: 0.52, exposureScore: 0.35, vulnerabilityScore: 0.30, copingCapacity: 0.78,
    population: 1_271_768, affectedPopulation: 15_000, activeAlerts: 0,
    districts: []
  },
  {
    id: "syc", name: "Seychelles", code: "SC", lat: -4.68, lng: 55.49,
    riskScore: 0.25, hazardScore: 0.35, exposureScore: 0.20, vulnerabilityScore: 0.22, copingCapacity: 0.82,
    population: 98_347, affectedPopulation: 2_000, activeAlerts: 0,
    districts: []
  },
  {
    id: "com", name: "Comoros", code: "KM", lat: -11.88, lng: 43.87,
    riskScore: 0.56, hazardScore: 0.60, exposureScore: 0.53, vulnerabilityScore: 0.62, copingCapacity: 0.35,
    population: 869_601, affectedPopulation: 34_000, activeAlerts: 0,
    districts: []
  },
];

export const activeEvents: ActiveEvent[] = [
  {
    id: "evt-001",
    name: "Tropical Cyclone Batsirai II",
    type: "cyclone",
    severity: "critical",
    startDate: "2026-02-07",
    countries: ["Mozambique", "Madagascar"],
    affectedPopulation: 1_850_000,
    status: "active",
    description: "Category 3 tropical cyclone approaching Mozambique Channel. Expected landfall in Sofala province within 48 hours. Maximum sustained winds 185 km/h.",
    lat: -17.5,
    lng: 42.3,
  },
  {
    id: "evt-002",
    name: "Zambezi Basin Flooding",
    type: "flood",
    severity: "high",
    startDate: "2026-02-03",
    countries: ["Malawi", "Mozambique", "Zambia", "Zimbabwe"],
    affectedPopulation: 980_000,
    status: "active",
    description: "Sustained heavy rainfall across the Zambezi basin has caused river levels to exceed critical thresholds at multiple gauging stations. Flash flooding reported in Lower Shire valley.",
    lat: -15.5,
    lng: 35.0,
  },
  {
    id: "evt-003",
    name: "Southern Madagascar Drought",
    type: "drought",
    severity: "moderate",
    startDate: "2026-01-15",
    countries: ["Madagascar"],
    affectedPopulation: 450_000,
    status: "active",
    description: "Below-average rainfall in Atsimo-Andrefana and Androy regions. Crop stress indicators elevated. IPC Phase 3 conditions projected.",
    lat: -24.0,
    lng: 45.5,
  },
  {
    id: "evt-004",
    name: "Dar es Salaam Urban Flooding",
    type: "flood",
    severity: "moderate",
    startDate: "2026-02-08",
    countries: ["Tanzania"],
    affectedPopulation: 120_000,
    status: "watch",
    description: "Heavy precipitation forecast for coastal Tanzania over next 72 hours. Urban drainage capacity likely to be exceeded in Dar es Salaam informal settlements.",
    lat: -6.8,
    lng: 39.3,
  },
];

export const triggers: TriggerConfig[] = [
  {
    id: "trg-001", name: "WFP AA - Southern Malawi Floods", organization: "WFP",
    country: "Malawi", metric: "Composite Flood Risk Score", threshold: 0.7,
    currentValue: 0.83, status: "red", lastUpdated: "2026-02-10T08:00:00Z",
    activationHistory: [
      { date: "2026-02-05", value: 0.45 }, { date: "2026-02-06", value: 0.58 },
      { date: "2026-02-07", value: 0.67 }, { date: "2026-02-08", value: 0.74 },
      { date: "2026-02-09", value: 0.79 }, { date: "2026-02-10", value: 0.83 },
    ]
  },
  {
    id: "trg-002", name: "IFRC DREF - Cyclone Mozambique", organization: "IFRC",
    country: "Mozambique", metric: "Cyclone Impact Score", threshold: 0.65,
    currentValue: 0.91, status: "red", lastUpdated: "2026-02-10T06:00:00Z",
    activationHistory: [
      { date: "2026-02-07", value: 0.32 }, { date: "2026-02-08", value: 0.55 },
      { date: "2026-02-09", value: 0.78 }, { date: "2026-02-10", value: 0.91 },
    ]
  },
  {
    id: "trg-003", name: "NDMA Readiness - Zambezia", organization: "NDMA Mozambique",
    country: "Mozambique", metric: "Composite Risk Score", threshold: 0.6,
    currentValue: 0.72, status: "amber", lastUpdated: "2026-02-10T07:00:00Z",
    activationHistory: [
      { date: "2026-02-06", value: 0.41 }, { date: "2026-02-07", value: 0.48 },
      { date: "2026-02-08", value: 0.56 }, { date: "2026-02-09", value: 0.65 },
      { date: "2026-02-10", value: 0.72 },
    ]
  },
  {
    id: "trg-004", name: "WFP Food Security - Madagascar South", organization: "WFP",
    country: "Madagascar", metric: "Food Insecurity Risk Score", threshold: 0.6,
    currentValue: 0.58, status: "amber", lastUpdated: "2026-02-10T08:00:00Z",
    activationHistory: [
      { date: "2026-01-20", value: 0.35 }, { date: "2026-01-27", value: 0.42 },
      { date: "2026-02-03", value: 0.51 }, { date: "2026-02-10", value: 0.58 },
    ]
  },
  {
    id: "trg-005", name: "IFRC Volunteer Deploy - Tanzania", organization: "IFRC",
    country: "Tanzania", metric: "Urban Flood Risk Score", threshold: 0.55,
    currentValue: 0.47, status: "green", lastUpdated: "2026-02-10T08:00:00Z",
    activationHistory: [
      { date: "2026-02-08", value: 0.31 }, { date: "2026-02-09", value: 0.39 },
      { date: "2026-02-10", value: 0.47 },
    ]
  },
  {
    id: "trg-006", name: "SADC Standby - Regional Activation", organization: "SADC",
    country: "Regional", metric: "Multi-Country Risk Index", threshold: 0.75,
    currentValue: 0.71, status: "amber", lastUpdated: "2026-02-10T06:00:00Z",
    activationHistory: [
      { date: "2026-02-05", value: 0.52 }, { date: "2026-02-06", value: 0.58 },
      { date: "2026-02-07", value: 0.63 }, { date: "2026-02-08", value: 0.67 },
      { date: "2026-02-09", value: 0.69 }, { date: "2026-02-10", value: 0.71 },
    ]
  },
];

export const scenarios: Scenario[] = [
  {
    id: "scn-001", name: "Cyclone Batsirai II - Sofala Landfall",
    type: "cyclone", status: "completed", createdBy: "SHOC Duty Officer",
    createdAt: "2026-02-08T14:30:00Z",
    description: "Category 3 cyclone making landfall at Beira, Sofala province. Wind speed 185 km/h, storm surge 3.5m.",
    affectedCountries: ["Mozambique"], estimatedAffected: 1_200_000, estimatedFacilitiesAtRisk: 342,
  },
  {
    id: "scn-002", name: "Cyclone Batsirai II - Inhambane Shift",
    type: "cyclone", status: "completed", createdBy: "SHOC Duty Officer",
    createdAt: "2026-02-08T15:00:00Z",
    description: "Alternative track: cyclone shifts south, making landfall at Inhambane. Wind speed 165 km/h, storm surge 2.8m.",
    affectedCountries: ["Mozambique"], estimatedAffected: 780_000, estimatedFacilitiesAtRisk: 198,
  },
  {
    id: "scn-003", name: "Zambezi Flood - 100yr Return Period",
    type: "flood", status: "completed", createdBy: "CIMA Foundation",
    createdAt: "2026-02-05T09:00:00Z",
    description: "100-year return period flood event across the Zambezi basin affecting Malawi, Mozambique, Zambia, and Zimbabwe.",
    affectedCountries: ["Malawi", "Mozambique", "Zambia", "Zimbabwe"], estimatedAffected: 2_100_000, estimatedFacilitiesAtRisk: 567,
  },
  {
    id: "scn-004", name: "Dar es Salaam - Extreme Rainfall 72h",
    type: "flood", status: "running", createdBy: "Tanzania NDMA",
    createdAt: "2026-02-09T11:00:00Z",
    description: "72-hour extreme rainfall event (>200mm) causing urban flooding in Dar es Salaam informal settlements.",
    affectedCountries: ["Tanzania"], estimatedAffected: 340_000, estimatedFacilitiesAtRisk: 89,
  },
];

export const assessments: Assessment[] = [
  { id: "asmt-001", title: "Sofala Rapid Damage Assessment", type: "rapid_damage", status: "collecting", responses: 127, targetResponses: 200, createdAt: "2026-02-09T08:00:00Z", country: "Mozambique", submittedBy: "IFRC Mozambique" },
  { id: "asmt-002", title: "Lower Shire Needs Assessment", type: "needs", status: "collecting", responses: 89, targetResponses: 150, createdAt: "2026-02-07T10:00:00Z", country: "Malawi", submittedBy: "Malawi Red Cross" },
  { id: "asmt-003", title: "Beira Health Facility Status", type: "facility_status", status: "deployed", responses: 34, targetResponses: 145, createdAt: "2026-02-09T14:00:00Z", country: "Mozambique", submittedBy: "WHO Mozambique" },
  { id: "asmt-004", title: "Madagascar Community Coping Capacity", type: "coping_capacity", status: "completed", responses: 312, targetResponses: 300, createdAt: "2026-01-20T09:00:00Z", country: "Madagascar", submittedBy: "UNDP Madagascar" },
];

export const riskTimeSeries = [
  { date: "Feb 1", mozambique: 0.52, malawi: 0.48, madagascar: 0.45, tanzania: 0.38 },
  { date: "Feb 2", mozambique: 0.55, malawi: 0.51, madagascar: 0.47, tanzania: 0.39 },
  { date: "Feb 3", mozambique: 0.61, malawi: 0.58, madagascar: 0.50, tanzania: 0.41 },
  { date: "Feb 4", mozambique: 0.65, malawi: 0.62, madagascar: 0.53, tanzania: 0.43 },
  { date: "Feb 5", mozambique: 0.70, malawi: 0.67, madagascar: 0.58, tanzania: 0.45 },
  { date: "Feb 6", mozambique: 0.74, malawi: 0.71, madagascar: 0.62, tanzania: 0.48 },
  { date: "Feb 7", mozambique: 0.78, malawi: 0.74, madagascar: 0.67, tanzania: 0.52 },
  { date: "Feb 8", mozambique: 0.80, malawi: 0.75, madagascar: 0.70, tanzania: 0.55 },
  { date: "Feb 9", mozambique: 0.81, malawi: 0.76, madagascar: 0.73, tanzania: 0.57 },
  { date: "Feb 10", mozambique: 0.82, malawi: 0.76, madagascar: 0.74, tanzania: 0.58 },
];

export const recentActivities = [
  { id: "act-001", action: "Scenario completed", detail: "Cyclone Batsirai II - Sofala Landfall", user: "SHOC Duty Officer", time: "2 hours ago", type: "scenario" as const },
  { id: "act-002", action: "Trigger activated", detail: "WFP AA - Southern Malawi crossed threshold (0.83 > 0.70)", user: "System", time: "4 hours ago", type: "trigger" as const },
  { id: "act-003", action: "Assessment deployed", detail: "Beira Health Facility Status form sent to 145 facilities", user: "WHO Mozambique", time: "6 hours ago", type: "assessment" as const },
  { id: "act-004", action: "Risk advisory published", detail: "SADC Regional Cyclone Advisory #3 - Batsirai II", user: "SADC DRR Unit", time: "8 hours ago", type: "advisory" as const },
  { id: "act-005", action: "Trigger warning", detail: "IFRC DREF - Cyclone Mozambique crossed threshold (0.91 > 0.65)", user: "System", time: "10 hours ago", type: "trigger" as const },
  { id: "act-006", action: "Data updated", detail: "INFORM Subnational Risk Index Q1 2026 ingested", user: "Data Pipeline", time: "1 day ago", type: "data" as const },
  { id: "act-007", action: "Assessment completed", detail: "Madagascar Community Coping Capacity (312 responses)", user: "UNDP Madagascar", time: "2 days ago", type: "assessment" as const },
];
