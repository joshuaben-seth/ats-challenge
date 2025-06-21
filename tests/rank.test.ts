import { loadCandidates } from '@/app/lib/api/candidates/loader';
import { rankCandidates } from '@/app/lib/api/candidates/rank';
import type { Candidate, RankingPlan } from '@/app/lib/types';

describe('Candidate Ranking Logic', () => {
  let candidates: Candidate[];

  beforeAll(() => {
    candidates = loadCandidates();
  });

  test('should rank by years of experience in descending order', () => {
    const rankingPlan: RankingPlan = {
      primary: { field: 'years_experience', direction: 'desc' },
    };
    const ranked = rankCandidates(candidates, rankingPlan);
    expect(ranked[0].years_experience).toBeGreaterThanOrEqual(ranked[1].years_experience);
    expect(ranked[1].years_experience).toBeGreaterThanOrEqual(ranked[2].years_experience);
  });

  test('should rank by desired salary in ascending order', () => {
    const rankingPlan: RankingPlan = {
      primary: { field: 'desired_salary_usd', direction: 'asc' },
    };
    const ranked = rankCandidates(candidates, rankingPlan);
    expect(ranked[0].desired_salary_usd).toBeLessThanOrEqual(ranked[1].desired_salary_usd);
    expect(ranked[1].desired_salary_usd).toBeLessThanOrEqual(ranked[2].desired_salary_usd);
  });

  test('should use tie-breakers correctly', () => {
    const rankingPlan: RankingPlan = {
      primary: { field: 'work_preference', direction: 'asc' },
      tie_breakers: [{ field: 'years_experience', direction: 'desc' }],
    };
    const ranked = rankCandidates(candidates, rankingPlan);
    
    // Find two candidates with the same work preference to check the tie-breaker
    const firstHybrid = ranked.find(c => c.work_preference === 'Hybrid');
    const firstHybridIndex = ranked.findIndex(c => c.work_preference === 'Hybrid');
    
    const secondHybrid = ranked[firstHybridIndex + 1];

    if (firstHybrid && secondHybrid && firstHybrid.work_preference === secondHybrid.work_preference) {
      expect(firstHybrid.years_experience).toBeGreaterThanOrEqual(secondHybrid.years_experience);
    }
  });

  test('should handle string-based ranking', () => {
    const rankingPlan: RankingPlan = {
      primary: { field: 'full_name', direction: 'asc' },
    };
    const ranked = rankCandidates(candidates, rankingPlan);
    expect(ranked[0].full_name.localeCompare(ranked[1].full_name)).toBeLessThanOrEqual(0);
  });

  test('should return original order if ranking plan is invalid', () => {
    const invalidPlan = { primary: { field: 'invalid_field' } } as any;
    const ranked = rankCandidates(candidates, invalidPlan);
    expect(ranked).toEqual(candidates);
  });
}); 