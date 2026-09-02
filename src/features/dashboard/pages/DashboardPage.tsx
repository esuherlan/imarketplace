import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../auth/store/authStore';
import { Package, ShoppingBag, Users2, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const stats = [
    { label: t('dashboard.totalProducts'), value: '1,284', icon: Package, color: 'bg-indigo-50 text-indigo-600' },
    { label: t('dashboard.ordersToday'), value: '86', icon: ShoppingBag, color: 'bg-emerald-50 text-emerald-600' },
    { label: t('dashboard.activeSellers'), value: '312', icon: Users2, color: 'bg-amber-50 text-amber-600' },
    { label: t('dashboard.revenue'), value: '$24.6K', icon: TrendingUp, color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('dashboard.welcome', { name: user?.name ?? 'User' })}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.recentActivity')}</h2>
        <p className="text-sm text-gray-500">{t('dashboard.recentActivityDesc')}</p>
      </div>
    </div>
  );
}
