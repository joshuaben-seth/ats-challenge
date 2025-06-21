import { loadCandidates } from '@/app/lib/api/candidates/loader';
import { filterCandidates } from '@/app/lib/api/candidates/filter';
import type { Candidate, FilterPlan } from '@/app/lib/types';

describe('Candidate Filtering Logic', () => {
  let candidates: Candidate[];

  beforeAll(() => {
    candidates = loadCandidates();
  });

  test('should filter by a single skill', () => {
    const filterPlan: FilterPlan = {
      include: { skills: ['Python'] },
    };
    const filtered = filterCandidates(candidates, filterPlan);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach(c => {
      expect(c.skills).toContain('Python');
    });
  });

  test('should filter by multiple skills (AND logic)', () => {
    const filterPlan: FilterPlan = {
      include: { skills: ['JavaScript', 'React'] },
    };
    const filtered = filterCandidates(candidates, filterPlan);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach(c => {
      expect(c.skills).toContain('JavaScript');
      expect(c.skills).toContain('React');
    });
  });

  test('should filter by years of experience', () => {
    const filterPlan: FilterPlan = {
      include: { years_experience_min: 10 },
    };
    const filtered = filterCandidates(candidates, filterPlan);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach(c => {
      expect(c.years_experience).toBeGreaterThanOrEqual(10);
    });
  });

  test('should exclude candidates by location', () => {
    const filterPlan: FilterPlan = {
      exclude: { location: ['New York, USA'] },
    };
    const filtered = filterCandidates(candidates, filterPlan);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach(c => {
      expect(c.location).not.toBe('New York, USA');
    });
  });

  test('should combine include and exclude filters', () => {
    const filterPlan: FilterPlan = {
      include: { skills: ['AWS'], years_experience_min: 5 },
      exclude: { work_preference: ['Onsite'] },
    };
    const filtered = filterCandidates(candidates, filterPlan);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach(c => {
      expect(c.skills).toContain('AWS');
      expect(c.years_experience).toBeGreaterThanOrEqual(5);
      expect(c.work_preference).not.toBe('Onsite');
    });
  });

  test('should return all candidates if filter plan is empty', () => {
    const filterPlan: FilterPlan = {};
    const filtered = filterCandidates(candidates, filterPlan);
    expect(filtered.length).toBe(candidates.length);
  });
}); 