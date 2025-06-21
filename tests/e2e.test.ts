import { loadCandidates } from '@/app/lib/api/candidates/loader';
import { filterCandidates } from '@/app/lib/api/candidates/filter';
import { rankCandidates } from '@/app/lib/api/candidates/rank';
import type { Candidate, FilterPlan, RankingPlan } from '@/app/lib/types';

describe('E2E Candidate Search Flow', () => {
  let candidates: Candidate[];

  beforeAll(() => {
    candidates = loadCandidates();
  });

  test('should filter and rank candidates based on a complex query', () => {
    // 1. Define the user's query requirements
    const filterPlan: FilterPlan = {
      include: {
        skills: ['JavaScript', 'React'],
        years_experience_min: 3,
      },
      exclude: {
        work_preference: ['Onsite'],
      },
    };

    const rankingPlan: RankingPlan = {
      primary: { field: 'years_experience', direction: 'desc' },
    };

    // 2. Filter the candidates
    const filtered = filterCandidates(candidates, filterPlan);
    expect(filtered.length).toBeGreaterThan(0);

    // 3. Rank the filtered candidates
    const ranked = rankCandidates(filtered, rankingPlan);
    expect(ranked.length).toBe(filtered.length);

    // 4. Assert the results
    ranked.forEach(c => {
      expect(c.skills).toContain('JavaScript');
      expect(c.skills).toContain('React');
      expect(c.years_experience).toBeGreaterThanOrEqual(3);
      expect(c.work_preference).not.toBe('Onsite');
    });

    // Check the ranking order
    for (let i = 0; i < ranked.length - 1; i++) {
      expect(ranked[i].years_experience).toBeGreaterThanOrEqual(ranked[i + 1].years_experience);
    }
  });
}); 