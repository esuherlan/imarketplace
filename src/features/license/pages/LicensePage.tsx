import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLicenseStore } from '../store/licenseStore';
import { Modal } from '../../../components/Modal';
import type { License, LicenseType } from '../types';

const LICENSE_BADGE_STYLES: Record<LicenseType, string> = {
  Free: 'bg-gray-100 text-gray-600',
  Standard: 'bg-blue-50 text-blue-700',
  Pro: 'bg-brand-50 text-brand-600',
};

export default function LicensePage() {
  const { t } = useTranslation();
  const { licenses, addLicense, updateLicense, deleteLicense } = useLicenseStore();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<License | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<License | null>(null);
  const [blockedTarget, setBlockedTarget] = useState<License | null>(null);

  const [domainInput, setDomainInput] = useState('');
  const [licenseTypeInput, setLicenseTypeInput] = useState<LicenseType>('Free');
  const [expiryInput, setExpiryInput] = useState('');

  const filtered = licenses.filter((l) =>
    l.domainName.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditing(null);
    setDomainInput('');
    setLicenseTypeInput('Free');
    setExpiryInput('');
    setModalOpen(true);
  };

  const openEditModal = (license: License) => {
    setEditing(license);
    setDomainInput(license.domainName);
    setLicenseTypeInput(license.licenseType);
    setExpiryInput(license.expiryDate);
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim() || !expiryInput) return;

    if (editing) {
      updateLicense(editing.id, domainInput.trim(), licenseTypeInput, expiryInput);
    } else {
      addLicense(domainInput.trim(), licenseTypeInput, expiryInput);
    }
    setModalOpen(false);
  };

  const requestDelete = (license: License) => {
    if (license.licenseType !== 'Free') {
      setBlockedTarget(license);
      return;
    }
    setDeleteTarget(license);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteLicense(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('license.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('license.subtitle')}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus size={16} />
          {t('license.addLicense')}
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('license.search') ?? ''}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-gray-500">
              <th className="px-6 py-3 font-medium">{t('license.domainName')}</th>
              <th className="px-6 py-3 font-medium">{t('license.licenseType')}</th>
              <th className="px-6 py-3 font-medium">{t('license.expiryDate')}</th>
              <th className="px-6 py-3 font-medium text-right">{t('license.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                  {t('license.noResults')}
                </td>
              </tr>
            )}
            {filtered.map((license) => (
              <tr key={license.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-6 py-3.5 font-medium text-gray-900">{license.domainName}</td>
                <td className="px-6 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${LICENSE_BADGE_STYLES[license.licenseType]}`}>
                    {license.licenseType}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-gray-500">{license.expiryDate}</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEditModal(license)}
                      className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => requestDelete(license)}
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
        title={editing ? t('license.editLicense') : t('license.addLicense')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('license.domainName')}
            </label>
            <input
              type="text"
              autoFocus
              required
              maxLength={100}
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder={t('license.domainPlaceholder') ?? ''}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('license.licenseType')}
            </label>
            <select
              value={licenseTypeInput}
              onChange={(e) => setLicenseTypeInput(e.target.value as LicenseType)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="Free">Free</option>
              <option value="Standard">Standard</option>
              <option value="Pro">Pro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('license.expiryDate')}
            </label>
            <input
              type="date"
              required
              value={expiryInput}
              onChange={(e) => setExpiryInput(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {t('license.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
            >
              {editing ? t('license.saveChanges') : t('license.addLicense')}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={t('license.deleteTitle')}
      >
        <p className="text-sm text-gray-600 mb-4">
          {t('license.deleteConfirm', { name: deleteTarget?.domainName })}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t('license.cancel')}
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            {t('license.delete')}
          </button>
        </div>
      </Modal>

      <Modal
        open={!!blockedTarget}
        onClose={() => setBlockedTarget(null)}
        title={t('license.blockedTitle')}
      >
        <p className="text-sm text-gray-600 mb-4">
          {t('license.blockedMessage', { name: blockedTarget?.domainName })}
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => setBlockedTarget(null)}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
          >
            {t('license.gotIt')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
