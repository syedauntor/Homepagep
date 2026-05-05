import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Lock, Mail, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';

const DEFAULT_EMAIL = 'admin@admin.com';
const DEFAULT_PASSWORD = 'Admin@123';

export default function AdminLoginPage() {
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'setup'>('login');
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'setup') {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-auth`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ email, password, action: 'create' }),
          }
        );
        const data = await response.json();
        if (data.success) {
          setSuccess('Admin account created! You can now log in.');
          setMode('login');
        } else {
          setError(data.error || 'Failed to create admin account.');
        }
      } else {
        const success = await login(email, password);
        if (success) {
          navigate('/admin/dashboard');
        } else {
          setError('Invalid email or password. If no admin exists yet, use "Setup Admin" below.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupDefault = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-auth`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD, action: 'create' }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setSuccess('Default admin created! Email: admin@admin.com | Password: Admin@123');
        setMode('login');
        setEmail(DEFAULT_EMAIL);
        setPassword(DEFAULT_PASSWORD);
      } else {
        setError(data.error || 'Failed to create default admin.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full mb-4">
              {mode === 'setup' ? <UserPlus className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              {mode === 'setup' ? 'Setup Admin' : 'Admin Login'}
            </h1>
            <p className="text-slate-600 mt-2">
              {mode === 'setup' ? 'Create your admin account' : 'Sign in to manage your site'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  placeholder="admin@admin.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (mode === 'setup' ? 'Creating...' : 'Signing in...') : (mode === 'setup' ? 'Create Admin Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 space-y-3 text-center">
            {mode === 'login' ? (
              <>
                <button
                  onClick={handleSetupDefault}
                  disabled={loading}
                  className="block w-full text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors py-2.5 rounded-lg font-medium disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Default Admin (admin@admin.com)'}
                </button>
                <button
                  onClick={() => { setMode('setup'); setError(''); setSuccess(''); }}
                  className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Setup custom admin account
                </button>
              </>
            ) : (
              <button
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                Already have an account? Sign in
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Default credentials: admin@admin.com / Admin@123
        </p>
      </div>
    </div>
  );
}
