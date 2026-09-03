import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sanitizeInput } from '../../../lib/security';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  failedAttempts: number;
  lockedUntil: number | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Dummy user buat testing login (BE belum ready)
const DUMMY_USER = { email: 'admin@imago.us', password: 'password123' };

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 30_000;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      failedAttempts: 0,
      lockedUntil: null,

      login: async (email, password) => {
        const { lockedUntil } = get();
        if (lockedUntil && Date.now() < lockedUntil) {
          const secondsLeft = Math.ceil((lockedUntil - Date.now()) / 1000);
          throw new Error(`Too many attempts. Try again in ${secondsLeft}s`);
        }

        await new Promise((r) => setTimeout(r, 500)); // simulasi network delay

        const cleanEmail = sanitizeInput(email).toLowerCase();

        if (cleanEmail !== DUMMY_USER.email || password !== DUMMY_USER.password) {
          const attempts = get().failedAttempts + 1;
          if (attempts >= MAX_ATTEMPTS) {
            set({ failedAttempts: 0, lockedUntil: Date.now() + LOCK_DURATION_MS });
            throw new Error('Too many failed attempts. Account locked for 30s.');
          }
          set({ failedAttempts: attempts });
          throw new Error('Invalid email or password');
        }

        set({
          user: { id: '1', name: 'Admin', email: cleanEmail },
          token: 'dummy-jwt-token',
          failedAttempts: 0,
          lockedUntil: null,
        });
      },

      register: async (name, email, _password) => {
        await new Promise((r) => setTimeout(r, 500));

        const cleanName = sanitizeInput(name);
        const cleanEmail = sanitizeInput(email).toLowerCase();

        // Dummy: langsung anggap sukses & auto-login
        set({
          user: { id: Date.now().toString(), name: cleanName, email: cleanEmail },
          token: 'dummy-jwt-token',
        });
      },

      logout: () => set({ user: null, token: null, failedAttempts: 0, lockedUntil: null }),
    }),
    { name: 'imago-auth' } // key di localStorage
  )
);
