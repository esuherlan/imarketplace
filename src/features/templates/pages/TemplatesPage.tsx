import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTemplateStore } from '../store/templateStore';
import { Modal } from '../../../components/Modal';
import type { Template } from '../types';

export default function TemplatesPage() {
  const { t } = useTranslation();
  const { templates, addTemplate, updateTemplate, deleteTemplate, toggleStatus } =
    useTemplateStore();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Template | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Template | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');

  const filtered = templates.filter((tpl) =>
    tpl.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditing(null);
    setNameInput('');
    setCategoryInput('');
    setModalOpen(true);
  };

  const openEditModal = (tpl: Template) => {
    setEditing(tpl);
    setNameInput(tpl.name);
    setCategoryInput(tpl.category);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !categoryInput.trim()) return;

    if (editing) {
      updateTemplate(editing.id, nameInput.trim(), categoryInput.trim());
    } else {
      addTemplate(nameInput.trim(), categoryInput.trim());
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteTemplate(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('templates.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('templates.subtitle')}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus size={16} />
          {t('templates.addTemplate')}
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('templates.search') ?? ''}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-gray-500">
              <th className="px-6 py-3 font-medium">{t('templates.name')}</th>
              <th className="px-6 py-3 font-medium">{t('templates.category')}</th>
              <th className="px-6 py-3 font-medium">{t('templates.usage')}</th>
              <th className="px-6 py-3 font-medium">{t('templates.status')}</th>
              <th className="px-6 py-3 font-medium">{t('templates.created')}</th>
              <th className="px-6 py-3 font-medium text-right">{t('templates.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                  {t('templates.noResults')}
                </td>
              </tr>
            )}
            {filtered.map((tpl) => (
              <tr key={tpl.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-6 py-3.5 font-medium text-gray-900">{tpl.name}</td>
                <td className="px-6 py-3.5 text-gray-500">{tpl.category}</td>
                <td className="px-6 py-3.5 text-gray-500">{tpl.usageCount}</td>
                <td className="px-6 py-3.5">
                  <button
                    onClick={() => toggleStatus(tpl.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      tpl.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {tpl.status === 'active' ? t('templates.active') : t('templates.inactive')}
                  </button>
                </td>
                <td className="px-6 py-3.5 text-gray-500">{tpl.createdAt}</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEditModal(tpl)}
                      className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(tpl)}
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
        title={editing ? t('templates.editTemplate') : t('templates.addTemplate')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('templates.templateName')}
            </label>
            <input
              type="text"
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder={t('templates.namePlaceholder') ?? ''}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('templates.category')}
            </label>
            <input
              type="text"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              placeholder={t('templates.categoryPlaceholder') ?? ''}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {t('templates.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
            >
              {editing ? t('templates.saveChanges') : t('templates.addTemplate')}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={t('templates.deleteTitle')}
      >
        <p className="text-sm text-gray-600 mb-4">
          {t('templates.deleteConfirm', { name: deleteTarget?.name })}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t('templates.cancel')}
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            {t('templates.delete')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
