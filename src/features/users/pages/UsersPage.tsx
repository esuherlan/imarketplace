import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../store/userStore';
import { Modal } from '../../../components/Modal';
import type { AppUser } from '../types';

const ROLES: AppUser['role'][] = ['admin', 'editor', 'viewer'];

export default function UsersPage() {
  const { t } = useTranslation();
  const { users, addUser, updateUser, deleteUser, toggleStatus } = useUserStore();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState<AppUser['role']>('viewer');

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditing(null);
    setNameInput('');
    setEmailInput('');
    setRoleInput('viewer');
    setModalOpen(true);
  };

  const openEditModal = (user: AppUser) => {
    setEditing(user);
    setNameInput(user.name);
    setEmailInput(user.email);
    setRoleInput(user.role);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) return;

    if (editing) {
      updateUser(editing.id, nameInput.trim(), emailInput.trim(), roleInput);
    } else {
      addUser(nameInput.trim(), emailInput.trim(), roleInput);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteUser(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const roleBadgeColor: Record<AppUser['role'], string> = {
    admin: 'bg-brand-50 text-brand-700',
    editor: 'bg-amber-50 text-amber-700',
    viewer: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('users.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('users.subtitle')}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus size={16} />
          {t('users.addUser')}
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('users.search') ?? ''}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-gray-500">
              <th className="px-6 py-3 font-medium">{t('users.name')}</th>
              <th className="px-6 py-3 font-medium">{t('users.email')}</th>
              <th className="px-6 py-3 font-medium">{t('users.role')}</th>
              <th className="px-6 py-3 font-medium">{t('users.status')}</th>
              <th className="px-6 py-3 font-medium">{t('users.created')}</th>
              <th className="px-6 py-3 font-medium text-right">{t('users.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                  {t('users.noResults')}
                </td>
              </tr>
            )}
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-6 py-3.5 font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-3.5 text-gray-500">{user.email}</td>
                <td className="px-6 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleBadgeColor[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      user.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {user.status === 'active' ? t('users.active') : t('users.inactive')}
                  </button>
                </td>
                <td className="px-6 py-3.5 text-gray-500">{user.createdAt}</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEditModal(user)}
                      className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(user)}
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
        title={editing ? t('users.editUser') : t('users.addUser')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('users.userName')}
            </label>
            <input
              type="text"
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder={t('users.namePlaceholder') ?? ''}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('users.email')}
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="you@imago.us"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('users.role')}
            </label>
            <select
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value as AppUser['role'])}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 capitalize"
            >
              {ROLES.map((role) => (
                <option key={role} value={role} className="capitalize">
                  {role}
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
              {t('users.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
            >
              {editing ? t('users.saveChanges') : t('users.addUser')}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={t('users.deleteTitle')}
      >
        <p className="text-sm text-gray-600 mb-4">
          {t('users.deleteConfirm', { name: deleteTarget?.name })}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t('users.cancel')}
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            {t('users.delete')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
