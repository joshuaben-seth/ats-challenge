import { StreamWriter, RankingPlan, Candidate } from '@/app/lib/types';
import { rankCandidates } from '@/app/lib/api';
import { sendPhaseUpdate } from './utils';

export async function act2Phase(writer: StreamWriter, candidates: Candidate[], rankingPlan: RankingPlan): Promise<Candidate[]> {
  await sendPhaseUpdate(writer, {
    phase: 'act2',
    message: '📊 Ranking candidates by relevance...'
  });

  const rankedCandidates = rankCandidates(candidates, rankingPlan);
  console.log('Ranked candidates count:', rankedCandidates.length);

  await sendPhaseUpdate(writer, {
    phase: 'act2',
    data: { 
      count: rankedCandidates.length, 
      topCandidates: rankedCandidates,
      rankingPlan: rankingPlan,
      rankedIds: rankedCandidates.map(c => c.id)
    }
  });

  return rankedCandidates;
} 