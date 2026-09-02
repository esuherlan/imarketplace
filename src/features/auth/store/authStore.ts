import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Dummy user buat testing login (BE belum ready)
const DUMMY_USER = { email: 'admin@imago.us', password: 'password123' };

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        await new Promise((r) => setTimeout(r, 500)); // simulasi network delay
        if (email !== DUMMY_USER.email || password !== DUMMY_USER.password) {
          throw new Error('Invalid email or password');
        }
        set({
          user: { id: '1', name: 'Admin', email },
          token: 'dummy-jwt-token',
        });
      },

      register: async (name, email, _password) => {
        await new Promise((r) => setTimeout(r, 500));
        // Dummy: langsung anggap sukses & auto-login
        set({
          user: { id: Date.now().toString(), name, email },
          token: 'dummy-jwt-token',
        });
      },

      logout: () => set({ user: null, token: null }),
    }),
    { name: 'imago-auth' } // key di localStorage
  )
);
