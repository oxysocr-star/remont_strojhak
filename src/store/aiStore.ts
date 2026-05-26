import { create } from 'zustand';

export interface AiState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  // added state for session
  sessionId: string;
  viewedCasesCount: number;
  incrementViewedCases: () => void;
}

export const useAiStore = create<AiState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  sessionId: Math.random().toString(36).substring(7),
  viewedCasesCount: 0,
  incrementViewedCases: () => set((state) => ({ viewedCasesCount: state.viewedCasesCount + 1 }))
}));
