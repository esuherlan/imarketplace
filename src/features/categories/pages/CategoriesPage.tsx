import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCategoryStore } from '../store/categoryStore';
import { Modal } from '../../../components/Modal';
import type { Category } from '../types';

export default function CategoriesPage() {
  const { t } = useTranslation();
  const { categories, addCategory, updateCategory, deleteCategory, toggleStatus } =
    useCategoryStore();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [nameInput, setNameInput] = useState('');

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditing(null);
    setNameInput('');
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditing(cat);
    setNameInput(cat.name);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    if (editing) {
      updateCategory(editing.id, nameInput.trim());
    } else {
      addCategory(nameInput.trim());
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('categories.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('categories.subtitle')}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus size={16} />
          {t('categories.addCategory')}
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('categories.search') ?? ''}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-gray-500">
              <th className="px-6 py-3 font-medium">{t('categories.name')}</th>
              <th className="px-6 py-3 font-medium">{t('categories.slug')}</th>
              <th className="px-6 py-3 font-medium">{t('categories.products')}</th>
              <th className="px-6 py-3 font-medium">{t('categories.status')}</th>
              <th className="px-6 py-3 font-medium">{t('categories.created')}</th>
              <th className="px-6 py-3 font-medium text-right">{t('categories.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                  {t('categories.noResults')}
                </td>
              </tr>
            )}
            {filtered.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-6 py-3.5 font-medium text-gray-900">{cat.name}</td>
                <td className="px-6 py-3.5 text-gray-500">{cat.slug}</td>
                <td className="px-6 py-3.5 text-gray-500">{cat.productCount}</td>
                <td className="px-6 py-3.5">
                  <button
                    onClick={() => toggleStatus(cat.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      cat.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {cat.status === 'active' ? t('categories.active') : t('categories.inactive')}
                  </button>
                </td>
                <td className="px-6 py-3.5 text-gray-500">{cat.createdAt}</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t('categories.editCategory') : t('categories.addCategory')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('categories.categoryName')}
            </label>
            <input
              type="text"
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder={t('categories.namePlaceholder') ?? ''}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {t('categories.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
            >
              {editing ? t('categories.saveChanges') : t('categories.addCategory')}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={t('categories.deleteTitle')}
      >
        <p className="text-sm text-gray-600 mb-4">
          {t('categories.deleteConfirm', { name: deleteTarget?.name })}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t('categories.cancel')}
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            {t('categories.delete')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
