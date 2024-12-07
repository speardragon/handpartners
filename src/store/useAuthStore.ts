import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStoreInterface {
  authenticated: boolean;
  setAuthenticated: (val: boolean) => void;
  user: any;
  setUser: (user: any) => void;
  accessToken: string | null;
  setAccessToken: (finished: string) => void;
}

export const useAuthStore = create<AuthStoreInterface>((set) => ({
  authenticated: false,
  setAuthenticated: (val) => set((state) => ({ authenticated: val })),
  user: {},
  setUser: (user) => set({ user }),
  accessToken: null,
  setAccessToken: (token) => set((state) => ({ accessToken: token })),
}));
