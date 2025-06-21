import { StreamWriter, FilterPlan, Candidate } from '@/app/lib/types';
import { loadCandidates, filterCandidates } from '@/app/lib/api';
import { sendPhaseUpdate } from './utils';

export async function act1Phase(writer: StreamWriter, filterPlan: FilterPlan): Promise<Candidate[]> {
  await sendPhaseUpdate(writer, {
    phase: 'act1',
    message: '🔍 Filtering candidates based on your criteria...'
  });

  console.log('=== ACT1 PHASE DEBUG ===');
  console.log('Filter plan received:', JSON.stringify(filterPlan, null, 2));
  console.log('Filter plan type:', typeof filterPlan);
  console.log('Has include:', !!filterPlan.include);
  console.log('Has exclude:', !!filterPlan.exclude);
  if (filterPlan.include) {
    console.log('Include keys:', Object.keys(filterPlan.include));
    console.log('Include values:', filterPlan.include);
  }

  const candidates = loadCandidates();
  console.log('Loaded candidates count:', candidates.length);

  // Test filtering with a simple filter to verify it works
  const testFilter: FilterPlan = {
    include: {
      location: ['San Francisco']
    }
  };
  const testResult = filterCandidates(candidates, testFilter);
  console.log(`Test filter (San Francisco) result: ${testResult.length} candidates`);

  const filteredCandidates = filterCandidates(candidates, filterPlan);
  console.log('Filtered candidates count:', filteredCandidates.length);
  console.log('=== END ACT1 PHASE DEBUG ===');

  await sendPhaseUpdate(writer, {
    phase: 'act1',
    data: { 
      count: filteredCandidates.length,
      filterPlan: filterPlan
    }
  });

  return filteredCandidates;
} 