import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  user: any | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (token: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,
  login: async (token, userData) => {
    await SecureStore.setItemAsync('access_token', token);
    set({ accessToken: token, user: userData, isLoading: false });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('access_token');
    set({ accessToken: null, user: null, isLoading: false });
  },
  checkAuth: async () => {
    const token = await SecureStore.getItemAsync('access_token');
    if (token) {
      // Decode JWT or fetch user details in real app
      set({ accessToken: token, user: { name: 'Student' }, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  }
}));
