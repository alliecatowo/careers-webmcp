
import { create } from "zustand";
import { User, UserRole } from "@/types/contracts";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Start in a loading state until the session is checked
  setUser: (user) => set({ user, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setRole: (role) => set(state => state.user ? ({ user: { ...state.user, role } }) : state),
}));
