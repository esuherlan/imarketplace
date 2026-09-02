import { create } from 'zustand';
import type { AppUser } from '../types';

interface UserState {
  users: AppUser[];
  addUser: (name: string, email: string, role: AppUser['role']) => void;
  updateUser: (id: string, name: string, email: string, role: AppUser['role']) => void;
  deleteUser: (id: string) => void;
  toggleStatus: (id: string) => void;
}

const initialUsers: AppUser[] = [
  { id: '1', name: 'Admin User', email: 'admin@imago.us', role: 'admin', status: 'active', createdAt: '2026-01-05' },
  { id: '2', name: 'Siti Rahma', email: 'siti@imago.us', role: 'editor', status: 'active', createdAt: '2026-02-18' },
  { id: '3', name: 'John Tan', email: 'john@imago.us', role: 'viewer', status: 'inactive', createdAt: '2026-03-30' },
];

export const useUserStore = create<UserState>((set) => ({
  users: initialUsers,

  addUser: (name, email, role) =>
    set((state) => ({
      users: [
        {
          id: Date.now().toString(),
          name,
          email,
          role,
          status: 'active',
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...state.users,
      ],
    })),

  updateUser: (id, name, email, role) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, name, email, role } : u
      ),
    })),

  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),

  toggleStatus: (id) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      ),
    })),
}));
