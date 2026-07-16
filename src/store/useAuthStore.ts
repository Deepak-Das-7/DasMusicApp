import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      updateProfile: (updates) => set((state) => ({ 
        user: state.user ? { ...state.user, ...updates } : null 
      })),
    }),
    {
      name: 'dasmusic-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
