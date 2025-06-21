import { create } from 'zustand';
import type { Candidate } from '@/app/lib/types';

interface CandidatesState {
  candidates: Candidate[];
  filteredCandidates: Candidate[] | undefined;
  selectedCandidate: Candidate | null;
  loading: boolean;
  error: string | null;
  visibleColumns: (keyof Candidate)[];
  showColumnSelector: boolean;
}

interface CandidatesActions {
  setCandidates: (candidates: Candidate[]) => void;
  setFilteredCandidates: (candidates: Candidate[] | undefined) => void;
  setSelectedCandidate: (candidate: Candidate | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setVisibleColumns: (columns: (keyof Candidate)[]) => void;
  setShowColumnSelector: (show: boolean) => void;
  fetchCandidates: () => Promise<void>;
}

const defaultVisibleColumns: (keyof Candidate)[] = [
  'full_name', 'title', 'location', 'years_experience', 'skills', 'work_preference'
];

export const useCandidatesStore = create<CandidatesState & CandidatesActions>((set) => ({
  // Initial state
  candidates: [],
  filteredCandidates: undefined,
  selectedCandidate: null,
  loading: true,
  error: null,
  visibleColumns: defaultVisibleColumns,
  showColumnSelector: false,

  // Actions
  setCandidates: (candidates) => set({ candidates }),
  setFilteredCandidates: (filteredCandidates) => set({ filteredCandidates }),
  setSelectedCandidate: (selectedCandidate) => set({ selectedCandidate }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setVisibleColumns: (visibleColumns) => set({ visibleColumns }),
  setShowColumnSelector: (showColumnSelector) => set({ showColumnSelector }),
  
  fetchCandidates: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('/api/candidates');
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      const data = await response.json();
      set({ candidates: data, loading: false });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred.';
      set({ error, loading: false });
      console.error(err);
    }
  },
})); 