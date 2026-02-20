import { create } from "zustand";
import { UserProfile } from "@/actions/user-actions";

interface AuthStoreState {
  isLoading: boolean;
  user: UserProfile | null;
  accessToken: string | null;
  setLoading: (loading: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  isLoading: true,
  user: null,
  accessToken: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
  clearAuth: () => set({ user: null, accessToken: null, isLoading: false }),
}));
