import { create } from 'zustand';
import type { LibraryItem } from '../types';

interface LibraryState {
  libraries: LibraryItem[];
  addLibrary: (name: string, type: LibraryItem['type']) => void;
  updateLibrary: (id: string, name: string, type: LibraryItem['type']) => void;
  deleteLibrary: (id: string) => void;
  toggleStatus: (id: string) => void;
}

const initialLibraries: LibraryItem[] = [
  { id: '1', name: 'Product Photography', type: 'image', status: 'active', itemCount: 542, createdAt: '2026-01-08' },
  { id: '2', name: 'Legal Documents', type: 'document', status: 'active', itemCount: 34, createdAt: '2026-02-27' },
  { id: '3', name: 'Brand Icons', type: 'icon', status: 'inactive', itemCount: 128, createdAt: '2026-04-11' },
];

export const useLibraryStore = create<LibraryState>((set) => ({
  libraries: initialLibraries,

  addLibrary: (name, type) =>
    set((state) => ({
      libraries: [
        {
          id: Date.now().toString(),
          name,
          type,
          status: 'active',
          itemCount: 0,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...state.libraries,
      ],
    })),

  updateLibrary: (id, name, type) =>
    set((state) => ({
      libraries: state.libraries.map((l) =>
        l.id === id ? { ...l, name, type } : l
      ),
    })),

  deleteLibrary: (id) =>
    set((state) => ({
      libraries: state.libraries.filter((l) => l.id !== id),
    })),

  toggleStatus: (id) =>
    set((state) => ({
      libraries: state.libraries.map((l) =>
        l.id === id ? { ...l, status: l.status === 'active' ? 'inactive' : 'active' } : l
      ),
    })),
}));
