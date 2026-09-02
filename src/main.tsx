import './i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import DashboardPage from './features/dashboard/pages/DashboardPage'
import CategoriesPage from './features/categories/pages/CategoriesPage'
import TemplatesPage from './features/templates/pages/TemplatesPage'
import LibrariesPage from './features/libraries/pages/LibrariesPage'
import UsersPage from './features/users/pages/UsersPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Placeholder routes — nanti diisi masing-masing feature page */}
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/libraries" element={<LibrariesPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/license" element={<div className="text-gray-500">License page — coming soon</div>} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
