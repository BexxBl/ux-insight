export type ReportType =
  | 'ux_audit'
  | 'accessibility_audit'
  | 'cro_audit'
  | 'design_system_review'
  | 'mobile_review';

export type ReportStatus = 'draft' | 'in_review' | 'delivered' | 'archived';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type Impact = 'high' | 'medium' | 'low';

export type Effort = 'low' | 'medium' | 'high';

export type Confidence = 'high' | 'medium' | 'low';

export type Theme = 'light' | 'dark' | 'auto';

export type FindingStatus = 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'wont_fix';

export type TargetType = 'website' | 'web_app' | 'mobile_app' | 'prototype';

export type EvidenceSource = 'source_code' | 'dom' | 'screenshot' | 'tool_output';

export type MediaType = 'screenshot' | 'annotation' | 'video' | 'document';

export type Horizon = 'now' | 'next' | 'later';

export interface ScoreBand {
  label: string;
  min: number;
  max: number;
  color: string;
}

export interface ScoreScale {
  min: number;
  max: number;
  bands?: ScoreBand[];
}

export interface ScoringCategory {
  key: string;
  label: string;
  score: number;
  weight: number;
  band?: string;
  rationale?: string;
  previousScore?: number | null;
}

export interface Scoring {
  scale: ScoreScale;
  overall: number;
  overallBand?: string;
  categories: ScoringCategory[];
}

export interface Client {
  clientId: string;
  name: string;
  contactName?: string;
  contactEmail?: string;
}

export interface Branding {
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  footerText?: string;
}

export interface Target {
  targetId: string;
  name: string;
  url: string;
  type?: TargetType;
  description?: string;
}

export interface Author {
  name: string;
  role?: string;
  organization?: string;
}

export interface Methodology {
  sources: string[];
  standards?: string[];
  limitations?: string[];
}

export interface Meta {
  createdAt: string;
  updatedAt?: string;
  version?: string;
  previousReportId?: string | null;
  author: Author;
  methodology: Methodology;
}

export interface Summary {
  headline?: string;
  narrative?: string;
  keyTakeaways?: string[];
  aiGenerated?: boolean;
  aiModel?: string | null;
  generatedAt?: string | null;
}

export interface Annotation {
  x?: number;
  y?: number;
  label?: string;
}

export interface Media {
  id: string;
  type: MediaType;
  url?: string | null;
  placeholder?: boolean;
  caption?: string;
  alt?: string;
  annotations?: Annotation[];
}

export interface EvidenceLocation {
  source?: EvidenceSource;
  file?: string;
  lines?: string;
  selector?: string;
  note?: string;
}

export interface Measurement {
  label: string;
  value: number | string;
  unit?: string;
  threshold?: number | string;
  passes?: boolean;
}

export interface Evidence {
  summary?: string;
  locations?: EvidenceLocation[];
  measurements?: Measurement[];
}

export interface WcagRef {
  criterion: string;
  name?: string;
  level?: 'A' | 'AA' | 'AAA';
}

export interface FindingAccessibility {
  isAccessibilityIssue?: boolean;
  wcag?: WcagRef[];
}

export interface Finding {
  id: string;
  rank?: number;
  categoryKey: string;
  categoryLabel?: string;
  title: string;
  severity: Severity;
  businessImpact: Impact;
  effort: Effort;
  confidence: Confidence;
  status?: FindingStatus;
  problem: string;
  evidence?: Evidence;
  recommendation: string;
  userBenefit?: string;
  businessBenefit?: string;
  uxPrinciple?: string;
  accessibility?: FindingAccessibility;
  media?: Media[];
  isOpportunity?: boolean;
  tags?: string[];
}

export interface Strength {
  id: string;
  title: string;
  description: string;
  categoryKey?: string;
  evidence?: Evidence;
}

export interface QuickWin {
  id: string;
  title: string;
  findingId?: string | null;
  effort?: Effort;
  businessImpact?: Impact;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description?: string;
  horizon: Horizon;
  relatedFindingIds?: string[];
}

export interface UxReport {
  schemaVersion: '1.0.0';
  reportId: string;
  reportType: ReportType;
  status?: ReportStatus;
  locale?: string;
  i18n?: Record<string, Record<string, string>>;
  client: Client;
  branding?: Branding;
  theme?: Theme;
  target: Target;
  meta: Meta;
  summary?: Summary;
  scoring: Scoring;
  strengths?: Strength[];
  quickWins?: QuickWin[];
  recommendationsRoadmap?: RoadmapItem[];
  findings: Finding[];
  attachments?: Media[];
  tags?: string[];
}
