import { create } from 'zustand';

interface GamificationState {
  xp: number;
  streak: number;
  badges: string[];
  addXP: (amount: number) => void;
  incrementStreak: () => void;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  xp: 0,
  streak: 0,
  badges: [],
  addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
  incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
}));
