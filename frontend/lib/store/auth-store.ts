import { create } from "zustand";
import { ApiUser } from "@/lib/types";

interface PersistedAuthSlice {
  user: ApiUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthState extends PersistedAuthSlice {
  hydrated: boolean;
  hydrate: () => void;
  setTokens: (tokens: { access: string; refresh: string }) => void;
  setUser: (user: ApiUser | null) => void;
  logout: () => void;
}

const STORAGE_KEY = "taskoria-auth";

const readFromStorage = (): PersistedAuthSlice | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedAuthSlice;
  } catch (error) {
    console.warn("Failed to read auth state", error);
    return null;
  }
};

const persistToStorage = (state: PersistedAuthSlice) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to persist auth state", error);
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) return;
    const stored = readFromStorage();
    if (stored) {
      set({ ...stored, hydrated: true });
    } else {
      set({ hydrated: true });
    }
  },
  setTokens: ({ access, refresh }) => {
    set((state) => {
      const nextState = {
        ...state,
        accessToken: access,
        refreshToken: refresh,
      };
      persistToStorage({
        user: nextState.user,
        accessToken: nextState.accessToken,
        refreshToken: nextState.refreshToken,
      });
      return nextState;
    });
  },
  setUser: (user) => {
    set((state) => {
      const nextState = {
        ...state,
        user,
      };
      persistToStorage({
        user: nextState.user,
        accessToken: nextState.accessToken,
        refreshToken: nextState.refreshToken,
      });
      return nextState;
    });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    set({ user: null, accessToken: null, refreshToken: null, hydrated: true });
  },
}));
