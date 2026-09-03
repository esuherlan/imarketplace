import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';
import { sanitizeInput, isValidEmail, isValidPassword, isValidName } from '../../../lib/security';

export default function RegisterPage() {
  const { t } = useTranslation();
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email);

    if (!isValidName(cleanName)) {
      setError(t('auth.invalidName', 'Name must be 2-100 characters'));
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setError(t('auth.invalidEmail', 'Please enter a valid email address'));
      return;
    }
    if (!isValidPassword(password)) {
      setError(t('auth.invalidPassword', 'Password must be at least 8 characters'));
      return;
    }

    setLoading(true);
    try {
      await register(cleanName, cleanEmail, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.registrationFailed'));
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('auth.createAccount')}</h1>
          <p className="text-sm text-gray-500 mb-6">{t('auth.signInSubtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.name')}
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                maxLength={50}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="John Doe"
              />
            </div>

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
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <input
                type="password"
                required
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
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
              {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4 text-center">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="text-brand-600 font-medium">
              {t('auth.signInLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
