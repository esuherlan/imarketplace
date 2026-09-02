import { create } from 'zustand';
import type { Template } from '../types';

interface TemplateState {
  templates: Template[];
  addTemplate: (name: string, category: string) => void;
  updateTemplate: (id: string, name: string, category: string) => void;
  deleteTemplate: (id: string) => void;
  toggleStatus: (id: string) => void;
}

const initialTemplates: Template[] = [
  { id: '1', name: 'Product Listing - Basic', category: 'E-commerce', status: 'active', usageCount: 214, createdAt: '2026-01-20' },
  { id: '2', name: 'Seller Storefront', category: 'E-commerce', status: 'active', usageCount: 87, createdAt: '2026-02-14' },
  { id: '3', name: 'Invoice Template', category: 'Finance', status: 'inactive', usageCount: 12, createdAt: '2026-03-05' },
];

export const useTemplateStore = create<TemplateState>((set) => ({
  templates: initialTemplates,

  addTemplate: (name, category) =>
    set((state) => ({
      templates: [
        {
          id: Date.now().toString(),
          name,
          category,
          status: 'active',
          usageCount: 0,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...state.templates,
      ],
    })),

  updateTemplate: (id, name, category) =>
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === id ? { ...t, name, category } : t
      ),
    })),

  deleteTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((t) => t.id !== id),
    })),

  toggleStatus: (id) =>
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === id ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' } : t
      ),
    })),
}));
