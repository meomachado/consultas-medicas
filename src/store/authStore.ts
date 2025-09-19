import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/User";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// Usamos `persist` para que o login continue salvo mesmo se o usuário recarregar a página.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage", // nome da chave no localStorage
    }
  )
);