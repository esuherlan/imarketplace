import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLang = () => {
    const next = i18n.language === 'id' ? 'en' : 'id';
    i18n.changeLanguage(next);
  };

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
    >
      <Globe size={15} />
      {i18n.language === 'id' ? 'ID' : 'EN'}
    </button>
  );
}
