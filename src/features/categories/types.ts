export interface Category {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'inactive';
  productCount: number;
  createdAt: string;
}
