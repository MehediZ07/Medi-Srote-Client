import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  image?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
}

interface AuthStore {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => Promise<boolean>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      
      setUser: (user) => set({ user }),
      
      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem('auth-token', token);
        } else {
          localStorage.removeItem('auth-token');
        }
      },
      
      logout: async () => {
        try {
          await api.post('/api/auth/sign-out', {});
        } catch (error) {
          console.error('Logout API error:', error);
        } finally {
          set({ user: null, token: null });
          localStorage.removeItem('auth-token');
          return true;
        }
      },
      
      checkAuth: async () => {
        set({ loading: true });
        try {
          const token = localStorage.getItem('auth-token');
          if (!token) {
            set({ user: null, token: null });
            return;
          }
          
          const response = await api.get('/api/auth/me');
          set({ 
            user: response.data.data, 
            token 
          });
        } catch (error) {
          set({ user: null, token: null });
          localStorage.removeItem('auth-token');
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);