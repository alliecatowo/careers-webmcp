
'use client';
import { create } from 'zustand';
import { MultiPhaseApplicationData } from '@/types';

type ApplicationState = {
  applicationData: Partial<MultiPhaseApplicationData>;
  setApplicationData: (data: Partial<MultiPhaseApplicationData>) => void;
  resetApplicationData: () => void;
};

export const useApplicationStore = create<ApplicationState>((set) => ({
  applicationData: {},
  setApplicationData: (data) => set((state) => ({ 
    applicationData: { ...state.applicationData, ...data }
  })),
  resetApplicationData: () => set({ applicationData: {} }),
}));
