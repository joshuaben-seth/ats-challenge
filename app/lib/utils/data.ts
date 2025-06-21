import type { Candidate, FilterPlan, RankingPlan } from '../types';

// Data normalization utilities
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove non-alphanumeric chars except spaces
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
    .trim();
}

export function normalizeArray(arr: string[]): string[] {
  return arr.map(item => normalizeText(item)).filter(Boolean);
}

// Search and matching utilities
export function hasMatch(searchTerms: string[], candidateData: string[]): boolean {
  const normalizedSearchTerms = searchTerms.map(term => normalizeText(term));
  const normalizedCandidateData = candidateData.map(item => normalizeText(item));
  
  return normalizedSearchTerms.some(searchTerm => 
    normalizedCandidateData.some(candidateItem => 
      candidateItem.includes(searchTerm) || searchTerm.includes(candidateItem)
    )
  );
}

export function hasMatchSingle(searchTerms: string[], candidateData: string): boolean {
  const normalizedSearchTerms = searchTerms.map(term => normalizeText(term));
  const normalizedCandidateData = normalizeText(candidateData);
  
  return normalizedSearchTerms.some(searchTerm => 
    normalizedCandidateData.includes(searchTerm) || searchTerm.includes(normalizedCandidateData)
  );
}

// Array utilities
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function uniqueArray<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function sortByProperty<T, K extends keyof T>(
  array: T[], 
  property: K, 
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// Object utilities
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as T;
  
  const clonedObj = {} as any;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone((obj as any)[key]);
    }
  }
  return clonedObj as T;
}

export function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

// Candidate-specific utilities
export function getCandidateSkills(candidate: Candidate): string[] {
  return candidate.skills || [];
}

export function getCandidateLanguages(candidate: Candidate): string[] {
  return candidate.languages || [];
}

export function getCandidateTags(candidate: Candidate): string[] {
  return candidate.tags || [];
}

export function getCandidateLocation(candidate: Candidate): string {
  return candidate.location || '';
}

export function getCandidateExperience(candidate: Candidate): number {
  return candidate.years_experience || 0;
}

export function getCandidateSalary(candidate: Candidate): number {
  return candidate.desired_salary_usd || 0;
}

// Filter utilities
export function createFilterPlan(include?: Partial<FilterPlan['include']>, exclude?: Partial<FilterPlan['exclude']>): FilterPlan {
  return { include, exclude };
}

export function createRankingPlan(primary: RankingPlan['primary'], tieBreakers?: RankingPlan['tie_breakers']): RankingPlan {
  return { primary, tie_breakers: tieBreakers || [] };
}

// Data validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
} 