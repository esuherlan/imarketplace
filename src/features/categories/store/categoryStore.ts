import { create } from 'zustand';
import type { Category } from '../types';

interface CategoryState {
  categories: Category[];
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  toggleStatus: (id: string) => void;
}

const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const initialCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', status: 'active', productCount: 128, createdAt: '2026-01-12' },
  { id: '2', name: 'Fashion', slug: 'fashion', status: 'active', productCount: 342, createdAt: '2026-02-03' },
  { id: '3', name: 'Home & Living', slug: 'home-living', status: 'active', productCount: 97, createdAt: '2026-03-19' },
  { id: '4', name: 'Beauty', slug: 'beauty', status: 'inactive', productCount: 54, createdAt: '2026-04-22' },
];

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: initialCategories,

  addCategory: (name) =>
    set((state) => ({
      categories: [
        {
          id: Date.now().toString(),
          name,
          slug: slugify(name),
          status: 'active',
          productCount: 0,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...state.categories,
      ],
    })),

  updateCategory: (id, name) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, name, slug: slugify(name) } : c
      ),
    })),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),

  toggleStatus: (id) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' }
          : c
      ),
    })),
}));
