import { create } from 'zustand';

interface UIState {
  isSidebarVisible: boolean;
  showIntro: boolean;
  componentsLoaded: boolean;
}

interface UIActions {
  setIsSidebarVisible: (visible: boolean) => void;
  setShowIntro: (show: boolean) => void;
  setComponentsLoaded: (loaded: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  // Initial state
  isSidebarVisible: true,
  showIntro: true,
  componentsLoaded: false,

  // Actions
  setIsSidebarVisible: (isSidebarVisible) => set({ isSidebarVisible }),
  setShowIntro: (showIntro) => set({ showIntro }),
  setComponentsLoaded: (componentsLoaded) => set({ componentsLoaded }),
  toggleSidebar: () => set((state) => ({ isSidebarVisible: !state.isSidebarVisible })),
})); 