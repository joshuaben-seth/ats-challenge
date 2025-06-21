export interface Candidate {
  id: string;
  full_name: string;
  title: string;
  location: string;
  timezone: string;
  years_experience: number;
  skills: string[];
  languages: string[];
  education_level: string;
  degree_major: string;
  availability_weeks: number;
  willing_to_relocate: boolean;
  work_preference: string;
  notice_period_weeks: number;
  desired_salary_usd: number;
  open_to_contract: boolean;
  remote_experience_years: number;
  visa_status: string;
  citizenships: string[];
  summary: string;
  tags: string[];
  last_active: string;
  linkedin_url: string;
}

export interface FilterPlan {
  include?: {
    title?: string[];
    location?: string[];
    skills?: string[];
    languages?: string[];
    education_level?: string[];
    work_preference?: string[];
    visa_status?: string[];
    tags?: string[];
    years_experience_min?: number;
    years_experience_max?: number;
    desired_salary_min?: number;
    desired_salary_max?: number;
    availability_weeks_max?: number;
    notice_period_weeks_max?: number;
    willing_to_relocate?: boolean;
    open_to_contract?: boolean;
  };
  exclude?: {
    title?: string[];
    location?: string[];
    skills?: string[];
    languages?: string[];
    education_level?: string[];
    work_preference?: string[];
    visa_status?: string[];
    tags?: string[];
  };
}

export interface RankingPlan {
  primary: {
    field: keyof Candidate;
    direction: 'asc' | 'desc';
  };
  tie_breakers?: Array<{
    field: keyof Candidate;
    direction: 'asc' | 'desc';
  }>;
}

export interface AggregateStats {
  count: number;
  avg_experience: number;
  top_skills: string[];
  avg_salary: number;
  locations: string[];
  education_breakdown: Record<string, number>;
}

// Chat-related types
export interface StreamWriter {
  write: (data: string) => Promise<void>;
  close: () => Promise<void>;
}

export interface PhaseData {
  phase: string;
  message?: string;
  data?: Record<string, unknown>;
}

export interface MCPPlans {
  filter: FilterPlan;
  rank: RankingPlan;
}

export interface TimelineEntryPhase {
  id: string;
  timestamp: Date;
  phase: 'think' | 'act1' | 'act2' | 'speak' | 'completion';
  title: string;
  description: string;
  data?: {
    filterPlan?: Record<string, unknown>;
    matchCount?: number;
    rankingPlan?: Record<string, unknown>;
    rankedIds?: string[];
    duration?: number;
    [key: string]: unknown;
  };
}

export interface TimelineEntryQuery {
  id: string;
  timestamp: Date;
  query: string;
}

export type TimelineEntry =
  | ({ type: 'phase' } & TimelineEntryPhase)
  | ({ type: 'query' } & TimelineEntryQuery); 