import { Candidate } from '@/app/lib/types';

export function aggregateStats(candidates: Candidate[]) {
  if (!candidates.length) {
    return {
      count: 0,
      avg_experience: 0,
      top_skills: [],
      avg_salary: 0,
      locations: [],
      education_breakdown: {},
    };
  }
  const avg_experience = candidates.reduce((sum, c) => sum + c.years_experience, 0) / candidates.length;
  const avg_salary = candidates.reduce((sum, c) => sum + c.desired_salary_usd, 0) / candidates.length;
  const skillCounts: Record<string, number> = {};
  candidates.forEach(c => c.skills.forEach(s => { skillCounts[s] = (skillCounts[s] || 0) + 1; }));
  const top_skills = Object.entries(skillCounts).sort(([,a],[,b]) => b-a).slice(0,10).map(([s])=>s);
  const locations = [...new Set(candidates.map(c => c.location))];
  const education_breakdown: Record<string, number> = {};
  candidates.forEach(c => { education_breakdown[c.education_level] = (education_breakdown[c.education_level] || 0) + 1; });
  return {
    count: candidates.length,
    avg_experience: Math.round(avg_experience * 10) / 10,
    top_skills,
    avg_salary: Math.round(avg_salary),
    locations,
    education_breakdown,
  };
} 