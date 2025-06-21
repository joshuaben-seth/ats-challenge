import { loadCandidates } from '@/app/lib/api/candidates/loader';
import { filterCandidates } from '@/app/lib/api/candidates/filter';
import { rankCandidates } from '@/app/lib/api/candidates/rank';
import type { Candidate, FilterPlan, RankingPlan } from '@/app/lib/types';

describe('Frontend USA Experience Search', () => {
  let candidates: Candidate[];

  beforeAll(() => {
    candidates = loadCandidates();
  });

  test('should find frontend engineers in USA sorted by experience desc, with Quinn Smith as the only result', () => {
    // 1. Define the filter plan for "frontend, usa"
    const filterPlan: FilterPlan = {
      include: {
        title: ['Frontend Engineer'],
        location: ['San Francisco, USA', 'New York, USA', 'Austin, USA', 'Seattle, USA', 'Boston, USA', 'Los Angeles, USA', 'Chicago, USA', 'Denver, USA', 'Atlanta, USA', 'Portland, USA']
      }
    };

    // 2. Define the ranking plan for "sort by experience desc"
    const rankingPlan: RankingPlan = {
      primary: { field: 'years_experience', direction: 'desc' }
    };

    // 3. Filter the candidates
    const filtered = filterCandidates(candidates, filterPlan);
    expect(filtered.length).toBeGreaterThan(0);

    // 4. Rank the filtered candidates
    const ranked = rankCandidates(filtered, rankingPlan);
    expect(ranked.length).toBe(filtered.length);

    // 5. Verify that all candidates are frontend engineers in USA
    ranked.forEach(c => {
      expect(c.title).toBe('Frontend Engineer');
      expect(c.location).toMatch(/, USA$/);
    });

    // 6. Find Quinn Smith
    const quinnSmith = ranked.find(c => c.id === '6'); // Quinn Smith

    // 7. Verify Quinn Smith is found and is the only result
    expect(quinnSmith).toBeDefined();
    expect(ranked.length).toBe(1);
    expect(quinnSmith!.full_name).toBe('Quinn Smith');
    expect(quinnSmith!.years_experience).toBe(18);

    // 8. Log the results for verification
    console.log('Frontend Engineers in USA (by experience desc):');
    ranked.forEach((c, index) => {
      console.log(`${index + 1}. ${c.full_name} (ID: ${c.id}) - ${c.years_experience} years - ${c.location}`);
    });

    console.log(`✅ Quinn Smith (ID: 6, ${quinnSmith!.years_experience} years) is the only Frontend Engineer in USA`);
  });

  test('should find engineers in USA sorted by experience desc, with higher experience candidates appearing first', () => {
    // 1. Define the filter plan for "usa" (broader search)
    const filterPlan: FilterPlan = {
      include: {
        location: ['San Francisco, USA', 'New York, USA', 'Austin, USA', 'Seattle, USA', 'Boston, USA', 'Los Angeles, USA', 'Chicago, USA', 'Denver, USA', 'Atlanta, USA', 'Portland, USA']
      }
    };

    // 2. Define the ranking plan for "sort by experience desc"
    const rankingPlan: RankingPlan = {
      primary: { field: 'years_experience', direction: 'desc' }
    };

    // 3. Filter the candidates
    const filtered = filterCandidates(candidates, filterPlan);
    expect(filtered.length).toBeGreaterThan(0);

    // 4. Rank the filtered candidates
    const ranked = rankCandidates(filtered, rankingPlan);
    expect(ranked.length).toBe(filtered.length);

    // 5. Verify that all candidates are in USA
    ranked.forEach(c => {
      expect(c.location).toMatch(/, USA$/);
    });

    // 6. Verify the ranking order (experience desc)
    for (let i = 0; i < ranked.length - 1; i++) {
      expect(ranked[i].years_experience).toBeGreaterThanOrEqual(ranked[i + 1].years_experience);
    }

    // 7. Find specific candidates by ID
    const rileyDavis = ranked.find(c => c.id === '20'); // Riley Davis - 20 years experience
    const quinnSmith = ranked.find(c => c.id === '6'); // Quinn Smith - 18 years experience
    const jessGarcia = ranked.find(c => c.id === '5'); // Jess Garcia - 8 years experience

    // 8. Verify candidates are found
    expect(rileyDavis).toBeDefined();
    expect(quinnSmith).toBeDefined();
    expect(jessGarcia).toBeDefined();

    // 9. Verify experience levels
    expect(rileyDavis!.years_experience).toBe(20);
    expect(quinnSmith!.years_experience).toBe(18);
    expect(jessGarcia!.years_experience).toBe(8);

    // 10. Verify ranking order
    const rileyIndex = ranked.findIndex(c => c.id === '20');
    const quinnIndex = ranked.findIndex(c => c.id === '6');
    const jessIndex = ranked.findIndex(c => c.id === '5');

    expect(rileyIndex).toBeLessThan(quinnIndex); // Riley (20 years) should be above Quinn (18 years)
    expect(quinnIndex).toBeLessThan(jessIndex); // Quinn (18 years) should be above Jess (8 years)

    // 11. Log the results for verification
    console.log('Engineers in USA (by experience desc):');
    ranked.forEach((c, index) => {
      console.log(`${index + 1}. ${c.full_name} (ID: ${c.id}) - ${c.years_experience} years - ${c.title} - ${c.location}`);
    });

    console.log(`✅ Riley - ${rileyDavis!.full_name} (ID: ${rileyDavis!.id}, ${rileyDavis!.years_experience} years) appears at position ${rileyIndex + 1}`);
    console.log(`✅ Quinn - ${quinnSmith!.full_name} (ID: ${quinnSmith!.id}, ${quinnSmith!.years_experience} years) appears at position ${quinnIndex + 1}`);
    console.log(`✅ Jess - ${jessGarcia!.full_name} (ID: ${jessGarcia!.id}, ${jessGarcia!.years_experience} years) appears at position ${jessIndex + 1}`);
  });
}); 