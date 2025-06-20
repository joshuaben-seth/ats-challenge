import { Candidate, FilterPlan } from '@/app/lib/types';
import { loadCandidates } from './loader';

export function filterCandidates(candidates: Candidate[], plan: FilterPlan): Candidate[] {
  console.log('Filtering candidates with plan:', JSON.stringify(plan, null, 2));
  console.log('Total candidates to filter:', candidates.length);
  
  if (!plan.include && !plan.exclude) {
    console.log('No filter plan provided, returning all candidates');
    return candidates;
  }
  
  const filtered = candidates.filter(candidate => {
    if (plan.include) {
      const include = plan.include;
      if (include.title && !include.title.some(t => candidate.title.toLowerCase().includes(t.toLowerCase()))) {
        console.log(`Excluding candidate ${candidate.full_name} - title mismatch: ${candidate.title} vs ${include.title}`);
        return false;
      }
      if (include.location && !include.location.some(l => candidate.location.toLowerCase().includes(l.toLowerCase()))) {
        console.log(`Excluding candidate ${candidate.full_name} - location mismatch: ${candidate.location} vs ${include.location}`);
        return false;
      }
      if (include.skills && !include.skills.some(s => candidate.skills.some((cs: string) => cs.toLowerCase().includes(s.toLowerCase())))) {
        console.log(`Excluding candidate ${candidate.full_name} - skills mismatch: ${candidate.skills} vs ${include.skills}`);
        return false;
      }
      if (include.languages && !include.languages.some(l => candidate.languages.some((cl: string) => cl.toLowerCase().includes(l.toLowerCase())))) {
        console.log(`Excluding candidate ${candidate.full_name} - languages mismatch: ${candidate.languages} vs ${include.languages}`);
        return false;
      }
      if (include.education_level && !include.education_level.includes(candidate.education_level)) {
        console.log(`Excluding candidate ${candidate.full_name} - education mismatch: ${candidate.education_level} vs ${include.education_level}`);
        return false;
      }
      if (include.work_preference && !include.work_preference.includes(candidate.work_preference)) {
        console.log(`Excluding candidate ${candidate.full_name} - work preference mismatch: ${candidate.work_preference} vs ${include.work_preference}`);
        return false;
      }
      if (include.visa_status && !include.visa_status.includes(candidate.visa_status)) {
        console.log(`Excluding candidate ${candidate.full_name} - visa status mismatch: ${candidate.visa_status} vs ${include.visa_status}`);
        return false;
      }
      if (include.tags && !include.tags.some(t => candidate.tags.some((ct: string) => ct.toLowerCase().includes(t.toLowerCase())))) {
        console.log(`Excluding candidate ${candidate.full_name} - tags mismatch: ${candidate.tags} vs ${include.tags}`);
        return false;
      }
      if (include.years_experience_min !== undefined && candidate.years_experience < include.years_experience_min) {
        console.log(`Excluding candidate ${candidate.full_name} - experience too low: ${candidate.years_experience} < ${include.years_experience_min}`);
        return false;
      }
      if (include.years_experience_max !== undefined && candidate.years_experience > include.years_experience_max) {
        console.log(`Excluding candidate ${candidate.full_name} - experience too high: ${candidate.years_experience} > ${include.years_experience_max}`);
        return false;
      }
      if (include.desired_salary_min !== undefined && candidate.desired_salary_usd < include.desired_salary_min) {
        console.log(`Excluding candidate ${candidate.full_name} - salary too low: ${candidate.desired_salary_usd} < ${include.desired_salary_min}`);
        return false;
      }
      if (include.desired_salary_max !== undefined && candidate.desired_salary_usd > include.desired_salary_max) {
        console.log(`Excluding candidate ${candidate.full_name} - salary too high: ${candidate.desired_salary_usd} > ${include.desired_salary_max}`);
        return false;
      }
      if (include.availability_weeks_max !== undefined && candidate.availability_weeks > include.availability_weeks_max) {
        console.log(`Excluding candidate ${candidate.full_name} - availability too long: ${candidate.availability_weeks} > ${include.availability_weeks_max}`);
        return false;
      }
      if (include.notice_period_weeks_max !== undefined && candidate.notice_period_weeks > include.notice_period_weeks_max) {
        console.log(`Excluding candidate ${candidate.full_name} - notice period too long: ${candidate.notice_period_weeks} > ${include.notice_period_weeks_max}`);
        return false;
      }
      if (include.willing_to_relocate !== undefined && candidate.willing_to_relocate !== include.willing_to_relocate) {
        console.log(`Excluding candidate ${candidate.full_name} - relocation mismatch: ${candidate.willing_to_relocate} vs ${include.willing_to_relocate}`);
        return false;
      }
      if (include.open_to_contract !== undefined && candidate.open_to_contract !== include.open_to_contract) {
        console.log(`Excluding candidate ${candidate.full_name} - contract mismatch: ${candidate.open_to_contract} vs ${include.open_to_contract}`);
        return false;
      }
    }
    if (plan.exclude) {
      const exclude = plan.exclude;
      if (exclude.title && exclude.title.some(t => candidate.title.toLowerCase().includes(t.toLowerCase()))) {
        console.log(`Excluding candidate ${candidate.full_name} - title in exclude list: ${candidate.title}`);
        return false;
      }
      if (exclude.location && exclude.location.some(l => candidate.location.toLowerCase().includes(l.toLowerCase()))) {
        console.log(`Excluding candidate ${candidate.full_name} - location in exclude list: ${candidate.location}`);
        return false;
      }
      if (exclude.skills && exclude.skills.some(s => candidate.skills.some((cs: string) => cs.toLowerCase().includes(s.toLowerCase())))) {
        console.log(`Excluding candidate ${candidate.full_name} - skills in exclude list: ${candidate.skills}`);
        return false;
      }
      if (exclude.languages && exclude.languages.some(l => candidate.languages.some((cl: string) => cl.toLowerCase().includes(l.toLowerCase())))) {
        console.log(`Excluding candidate ${candidate.full_name} - languages in exclude list: ${candidate.languages}`);
        return false;
      }
      if (exclude.education_level && exclude.education_level.includes(candidate.education_level)) {
        console.log(`Excluding candidate ${candidate.full_name} - education in exclude list: ${candidate.education_level}`);
        return false;
      }
      if (exclude.work_preference && exclude.work_preference.includes(candidate.work_preference)) {
        console.log(`Excluding candidate ${candidate.full_name} - work preference in exclude list: ${candidate.work_preference}`);
        return false;
      }
      if (exclude.visa_status && exclude.visa_status.includes(candidate.visa_status)) {
        console.log(`Excluding candidate ${candidate.full_name} - visa status in exclude list: ${candidate.visa_status}`);
        return false;
      }
      if (exclude.tags && exclude.tags.some(t => candidate.tags.some((ct: string) => ct.toLowerCase().includes(t.toLowerCase())))) {
        console.log(`Excluding candidate ${candidate.full_name} - tags in exclude list: ${candidate.tags}`);
        return false;
      }
    }
    return true;
  });
  
  console.log(`Filtered candidates count: ${filtered.length}`);
  return filtered;
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
} 