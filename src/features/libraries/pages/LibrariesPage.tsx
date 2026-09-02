import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLibraryStore } from '../store/libraryStore';
import { Modal } from '../../../components/Modal';
import type { LibraryItem } from '../types';

const TYPES: LibraryItem['type'][] = ['image', 'document', 'font', 'icon'];

export default function LibrariesPage() {
  const { t } = useTranslation();
  const { libraries, addLibrary, updateLibrary, deleteLibrary, toggleStatus } =
    useLibraryStore();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<LibraryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LibraryItem | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [typeInput, setTypeInput] = useState<LibraryItem['type']>('image');

  const filtered = libraries.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditing(null);
    setNameInput('');
    setTypeInput('image');
    setModalOpen(true);
  };

  const openEditModal = (lib: LibraryItem) => {
    setEditing(lib);
    setNameInput(lib.name);
    setTypeInput(lib.type);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    if (editing) {
      updateLibrary(editing.id, nameInput.trim(), typeInput);
    } else {
      addLibrary(nameInput.trim(), typeInput);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteLibrary(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('libraries.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('libraries.subtitle')}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          {t('libraries.addLibrary')}
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('libraries.search') ?? ''}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-gray-500">
              <th className="px-6 py-3 font-medium">{t('libraries.name')}</th>
              <th className="px-6 py-3 font-medium">{t('libraries.type')}</th>
              <th className="px-6 py-3 font-medium">{t('libraries.items')}</th>
              <th className="px-6 py-3 font-medium">{t('libraries.status')}</th>
              <th className="px-6 py-3 font-medium">{t('libraries.created')}</th>
              <th className="px-6 py-3 font-medium text-right">{t('libraries.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                  {t('libraries.noResults')}
                </td>
              </tr>
            )}
            {filtered.map((lib) => (
              <tr key={lib.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-6 py-3.5 font-medium text-gray-900">{lib.name}</td>
                <td className="px-6 py-3.5 text-gray-500 capitalize">{lib.type}</td>
                <td className="px-6 py-3.5 text-gray-500">{lib.itemCount}</td>
                <td className="px-6 py-3.5">
                  <button
                    onClick={() => toggleStatus(lib.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      lib.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {lib.status === 'active' ? t('libraries.active') : t('libraries.inactive')}
                  </button>
                </td>
                <td className="px-6 py-3.5 text-gray-500">{lib.createdAt}</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEditModal(lib)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(lib)}
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t('libraries.editLibrary') : t('libraries.addLibrary')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('libraries.libraryName')}
            </label>
            <input
              type="text"
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder={t('libraries.namePlaceholder') ?? ''}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('libraries.type')}
            </label>
            <select
              value={typeInput}
              onChange={(e) => setTypeInput(e.target.value as LibraryItem['type'])}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
            >
              {TYPES.map((type) => (
                <option key={type} value={type} className="capitalize">
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {t('libraries.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              {editing ? t('libraries.saveChanges') : t('libraries.addLibrary')}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={t('libraries.deleteTitle')}
      >
        <p className="text-sm text-gray-600 mb-4">
          {t('libraries.deleteConfirm', { name: deleteTarget?.name })}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t('libraries.cancel')}
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            {t('libraries.delete')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
