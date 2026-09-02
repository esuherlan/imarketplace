export interface LibraryItem {
  id: string;
  name: string;
  type: 'image' | 'document' | 'font' | 'icon';
  status: 'active' | 'inactive';
  itemCount: number;
  createdAt: string;
}
