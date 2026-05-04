import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Local fallback credentials (SHA-256 not needed — plain comparison for env-defined creds)
const LOCAL_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com';
const LOCAL_ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'Admin@123456';

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminSession');
    if (storedAdmin) {
      try {
        const { email, timestamp } = JSON.parse(storedAdmin);
        const hoursSinceLogin = (Date.now() - timestamp) / (1000 * 60 * 60);
        if (hoursSinceLogin < 24) {
          setIsAdmin(true);
          setAdminEmail(email);
        } else {
          localStorage.removeItem('adminSession');
        }
      } catch {
        localStorage.removeItem('adminSession');
      }
    }
    setLoading(false);
  }, []);

  const saveSession = (email: string) => {
    setIsAdmin(true);
    setAdminEmail(email);
    localStorage.setItem('adminSession', JSON.stringify({ email, timestamp: Date.now() }));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Try remote edge function first
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-auth`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email, password, action: 'login' }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      const data = await response.json();
      if (data.success) {
        saveSession(email);
        return true;
      }
    } catch {
      // DB unavailable — fall through to local check
    }

    // Local fallback: check against env-defined credentials
    if (email === LOCAL_ADMIN_EMAIL && password === LOCAL_ADMIN_PASS) {
      saveSession(email);
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setAdminEmail(null);
    localStorage.removeItem('adminSession');
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminEmail, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
};
