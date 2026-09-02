import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  LayoutDashboard,
  FolderTree,
  LayoutTemplate,
  Library,
  Users,
  BadgeCheck,
  ChevronLeft,
  X,
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, key: 'sidebar.dashboard', fallback: 'Dashboard' },
  { to: '/categories', icon: FolderTree, key: 'sidebar.categories', fallback: 'Categories' },
  { to: '/templates', icon: LayoutTemplate, key: 'sidebar.templates', fallback: 'Templates' },
  { to: '/libraries', icon: Library, key: 'sidebar.libraries', fallback: 'Libraries' },
  { to: '/users', icon: Users, key: 'sidebar.users', fallback: 'Users' },
  { to: '/license', icon: BadgeCheck, key: 'sidebar.license', fallback: 'License' },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const { collapsed, toggleCollapsed, mobileOpen, closeMobile } = useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={clsx(
          // mobile base: fixed off-canvas drawer, removed from normal flow
          'fixed inset-y-0 left-0 z-50 w-64 h-screen flex flex-col bg-white border-r border-gray-100',
          'transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          // desktop: back into normal flow as sticky sidebar, no transform
          'lg:sticky lg:top-0 lg:inset-auto lg:translate-x-0',
          collapsed ? 'lg:w-20' : 'lg:w-64'
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
              IM
            </div>
            {(!collapsed || mobileOpen) && (
              <span className="font-semibold text-gray-900 truncate">Imago Marketplace</span>
            )}
          </div>
          <button
            onClick={closeMobile}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ to, icon: Icon, key, fallback }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeMobile}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                )
              }
            >
              <Icon size={18} className="shrink-0" />
              {(!collapsed || mobileOpen) && (
                <span className="truncate">{t(key, fallback)}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 hidden lg:block">
          <button
            onClick={toggleCollapsed}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-2xl text-sm text-gray-500 hover:bg-gray-50"
          >
            <ChevronLeft
              size={18}
              className={clsx('transition-transform', collapsed && 'rotate-180')}
            />
            {!collapsed && <span>{t('sidebar.collapse', 'Collapse')}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
