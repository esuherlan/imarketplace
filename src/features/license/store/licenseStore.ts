import { create } from 'zustand';
import type { License, LicenseType } from '../types';

interface LicenseState {
  licenses: License[];
  addLicense: (domainName: string, licenseType: LicenseType, expiryDate: string) => void;
  updateLicense: (id: string, domainName: string, licenseType: LicenseType, expiryDate: string) => void;
  deleteLicense: (id: string) => boolean;
}

const initialLicenses: License[] = [
  { id: '1', domainName: 'imago.us', licenseType: 'Pro', expiryDate: '2026-12-31' },
  { id: '2', domainName: 'shop.imago.us', licenseType: 'Standard', expiryDate: '2026-08-15' },
  { id: '3', domainName: 'staging.imago.us', licenseType: 'Free', expiryDate: '2026-06-01' },
];

export const useLicenseStore = create<LicenseState>((set) => ({
  licenses: initialLicenses,

  addLicense: (domainName, licenseType, expiryDate) =>
    set((state) => ({
      licenses: [
        { id: Date.now().toString(), domainName, licenseType, expiryDate },
        ...state.licenses,
      ],
    })),

  updateLicense: (id, domainName, licenseType, expiryDate) =>
    set((state) => ({
      licenses: state.licenses.map((l) =>
        l.id === id ? { ...l, domainName, licenseType, expiryDate } : l
      ),
    })),

  // Mirrors legacy Collab admin rule: license must be downgraded to "Free"
  // before it can be deleted. Returns false (and skips deletion) if blocked.
  deleteLicense: (id) => {
    const target = useLicenseStore.getState().licenses.find((l) => l.id === id);
    if (!target) return false;
    if (target.licenseType !== 'Free') return false;

    set((state) => ({
      licenses: state.licenses.filter((l) => l.id !== id),
    }));
    return true;
  },
}));
