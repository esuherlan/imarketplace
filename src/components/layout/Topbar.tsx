import { useState, useRef, useEffect } from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../features/auth/store/authStore';
import { LanguageSwitcher } from '../LanguageSwitcher';

export default function Topbar() {
  const { openMobile } = useUIStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

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
        <div className="relative pl-2 sm:pl-4 border-l border-gray-100" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-2 py-1"
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <User size={16} />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">Admin</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl border border-gray-100 shadow-lg py-1 z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-xl"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
