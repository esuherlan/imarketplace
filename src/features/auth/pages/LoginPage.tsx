import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';
import { sanitizeInput, isValidEmail } from '../../../lib/security';

export default function LoginPage() {
  const { t } = useTranslation();
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = sanitizeInput(email);
    if (!isValidEmail(cleanEmail)) {
      setError(t('auth.invalidEmail', 'Please enter a valid email address'));
      return;
    }
    if (!password) {
      setError(t('auth.invalidCredentials'));
      return;
    }

    setLoading(true);
    try {
      await login(cleanEmail, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-xl shadow-sm mb-3">
            IM
          </div>
          <span className="font-semibold text-gray-900">Imago Marketplace</span>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('auth.signIn')}</h1>
          <p className="text-sm text-gray-500 mb-6">{t('auth.signInSubtitle')}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                maxLength={100}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="admin@imago.us"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition"
            >
              {loading ? t('auth.signingIn') : t('auth.signIn')}
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4 text-center">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-brand-600 font-medium">
              {t('auth.register')}
            </Link>
          </p>
          <p className="text-xs text-gray-400 mt-6 text-center">
            {t('auth.dummyHint')}
          </p>
        </div>
      </div>
    </div>
  );
}
