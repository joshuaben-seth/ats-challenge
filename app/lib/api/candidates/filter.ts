import { Candidate, FilterPlan } from '@/app/lib/types';
import { loadCandidates } from './loader';
import { normalizeText, hasMatch, hasMatchSingle } from '@/app/lib/utils/data';

export function filterCandidates(candidates: Candidate[], plan: FilterPlan): Candidate[] {
  if (!plan || (!plan.include && !plan.exclude)) {
    return candidates;
  }

  return candidates.filter(candidate => {
    // Check for exclusion first
    if (plan.exclude) {
      if (plan.exclude.title && hasMatch(plan.exclude.title, [candidate.title])) return false;
      if (plan.exclude.location && hasMatchSingle(plan.exclude.location, candidate.location)) return false;
      if (plan.exclude.skills && hasMatch(plan.exclude.skills, candidate.skills)) return false;
      if (plan.exclude.languages && hasMatch(plan.exclude.languages, candidate.languages)) return false;
      if (plan.exclude.education_level && plan.exclude.education_level.includes(candidate.education_level)) return false;
      if (plan.exclude.work_preference && plan.exclude.work_preference.includes(candidate.work_preference)) return false;
      if (plan.exclude.visa_status && plan.exclude.visa_status.includes(candidate.visa_status)) return false;
      if (plan.exclude.tags && hasMatch(plan.exclude.tags, candidate.tags)) return false;
      // Exclude by full_name if present
      if (plan.exclude.full_name && hasMatchSingle(plan.exclude.full_name, candidate.full_name)) return false;
    }
    
    // Then check for inclusion
    if (plan.include) {
      if (plan.include.title && !hasMatch(plan.include.title, [candidate.title])) return false;
      if (plan.include.location && !hasMatchSingle(plan.include.location, candidate.location)) return false;
      if (plan.include.skills && !plan.include.skills.every(skill => candidate.skills.includes(skill))) return false;
      if (plan.include.languages && !plan.include.languages.every(lang => candidate.languages.includes(lang))) return false;
      if (plan.include.education_level && !plan.include.education_level.includes(candidate.education_level)) return false;
      if (plan.include.work_preference && !plan.include.work_preference.includes(candidate.work_preference)) return false;
      if (plan.include.visa_status && !plan.include.visa_status.includes(candidate.visa_status)) return false;
      if (plan.include.tags && !plan.include.tags.every(tag => candidate.tags.includes(tag))) return false;
      // Include by full_name if present
      if (plan.include.full_name && !hasMatchSingle(plan.include.full_name, candidate.full_name)) return false;
      
      // Numeric range filters
      if (plan.include.years_experience_min && candidate.years_experience < plan.include.years_experience_min) return false;
      if (plan.include.years_experience_max && candidate.years_experience > plan.include.years_experience_max) return false;
      if (plan.include.desired_salary_min && candidate.desired_salary_usd < plan.include.desired_salary_min) return false;
      if (plan.include.desired_salary_max && candidate.desired_salary_usd > plan.include.desired_salary_max) return false;
      if (plan.include.availability_weeks_max && candidate.availability_weeks > plan.include.availability_weeks_max) return false;
      if (plan.include.notice_period_weeks_max && candidate.notice_period_weeks > plan.include.notice_period_weeks_max) return false;
      
      // Boolean filters
      if (plan.include.willing_to_relocate !== undefined && candidate.willing_to_relocate !== plan.include.willing_to_relocate) return false;
      if (plan.include.open_to_contract !== undefined && candidate.open_to_contract !== plan.include.open_to_contract) return false;
    }

    return true;
  });
}

// Wrapper function that matches the expected API signature from README
export function filterCandidatesByPlan(plan: FilterPlan): Candidate[] {
  const candidates = loadCandidates();
  return filterCandidates(candidates, plan);
}

// Test function to verify filtering works
export function testFiltering() {
  const candidates = loadCandidates();
  console.log('Testing filtering with sample data...');
  
  // Test 1: Filter by location
  const locationFilter: FilterPlan = {
    include: {
      location: ['San Francisco']
    }
  };
  const sfCandidates = filterCandidates(candidates, locationFilter);
  console.log(`San Francisco candidates: ${sfCandidates.length}`);
  
  // Test 2: Filter by skills
  const skillsFilter: FilterPlan = {
    include: {
      skills: ['React']
    }
  };
  const reactCandidates = filterCandidates(candidates, skillsFilter);
  console.log(`React candidates: ${reactCandidates.length}`);
  
  // Test 3: Filter by experience
  const experienceFilter: FilterPlan = {
    include: {
      years_experience_min: 10
    }
  };
  const seniorCandidates = filterCandidates(candidates, experienceFilter);
  console.log(`Senior candidates (10+ years): ${seniorCandidates.length}`);

  // Test 4: Filter by full_name
  const nameFilter: FilterPlan = {
    include: {
      full_name: ['Quinn Smith']
    }
  };
  const nameCandidates = filterCandidates(candidates, nameFilter);
  console.log(`Candidates named 'Quinn Smith': ${nameCandidates.length}`);
} 