import { Candidate, RankingPlan } from '@/app/lib/types';

export function rankCandidates(candidates: Candidate[], plan: RankingPlan): Candidate[] {
  return [...candidates].sort((a, b) => {
    // Primary sort
    const aValue = a[plan.primary.field];
    const bValue = b[plan.primary.field];
    
    let comparison = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
    }
    
    if (plan.primary.direction === 'desc') {
      comparison = -comparison;
    }
    
    if (comparison !== 0) return comparison;
    
    // Apply tie breakers
    if (plan.tie_breakers) {
      for (const tieBreaker of plan.tie_breakers) {
        const aTieValue = a[tieBreaker.field];
        const bTieValue = b[tieBreaker.field];
        
        let tieComparison = 0;
        if (typeof aTieValue === 'string' && typeof bTieValue === 'string') {
          tieComparison = aTieValue.localeCompare(bTieValue);
        } else if (typeof aTieValue === 'number' && typeof bTieValue === 'number') {
          tieComparison = aTieValue - bTieValue;
        } else if (typeof aTieValue === 'boolean' && typeof bTieValue === 'boolean') {
          tieComparison = aTieValue === bValue ? 0 : aValue ? 1 : -1;
        }
        
        if (tieBreaker.direction === 'desc') {
          tieComparison = -tieComparison;
        }
        
        if (tieComparison !== 0) return tieComparison;
      }
    }
    
    return 0;
  });
} 