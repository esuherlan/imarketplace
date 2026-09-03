export type LicenseType = 'Standard' | 'Pro' | 'Free';

export interface License {
  id: string;
  domainName: string;
  licenseType: LicenseType;
  expiryDate: string;
}
