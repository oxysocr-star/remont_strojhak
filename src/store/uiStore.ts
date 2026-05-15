import { create } from 'zustand';

export interface UiState {
  activeSection: string;
  setActiveSection: (s: string) => void;
  caseViews: number;
  incrementCaseViews: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeSection: 'hero',
  setActiveSection: (activeSection) => set({ activeSection }),
  caseViews: 0,
  incrementCaseViews: () => set((state) => ({ caseViews: state.caseViews + 1 }))
}));
