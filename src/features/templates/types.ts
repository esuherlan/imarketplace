export interface Template {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive';
  usageCount: number;
  createdAt: string;
}
