import { Menu, User } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { LanguageSwitcher } from '../LanguageSwitcher';

export default function Topbar() {
  const { openMobile } = useUIStore();

  return (
    <header className="h-16 sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100 px-4 sm:px-6 flex items-center justify-between gap-2">
      <button
        onClick={openMobile}
        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 shrink-0"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <LanguageSwitcher />
        <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-gray-100">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <User size={16} />
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">Admin</span>
        </div>
      </div>
    </header>
  );
}
