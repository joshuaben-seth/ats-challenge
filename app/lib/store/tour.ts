import { create } from 'zustand';

interface TourState {
  showTour: boolean;
  currentStep: number;
  overlayVisible: boolean;
}

interface TourActions {
  setShowTour: (show: boolean) => void;
  setCurrentStep: (step: number) => void;
  setOverlayVisible: (visible: boolean) => void;
  completeTour: () => void;
  skipTour: () => void;
  startTour: () => void;
  checkTourStatus: () => void;
}

export const useTourStore = create<TourState & TourActions>((set) => ({
  // Initial state
  showTour: false,
  currentStep: 0,
  overlayVisible: false,

  // Actions
  setShowTour: (showTour) => set({ showTour }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setOverlayVisible: (overlayVisible) => set({ overlayVisible }),
  
  completeTour: () => {
    set({ showTour: false });
    localStorage.setItem('tour-completed', 'true');
  },
  
  skipTour: () => {
    set({ showTour: false });
    localStorage.setItem('tour-skipped', 'true');
  },
  
  startTour: () => set({ showTour: true }),
  
  checkTourStatus: () => {
    const tourCompleted = localStorage.getItem('tour-completed');
    const tourSkipped = localStorage.getItem('tour-skipped');
    
    if (!tourCompleted && !tourSkipped) {
      set({ showTour: true });
    }
  },
})); 