import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'Admin@123';

interface AdminContextType {
  isAdmin: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('adminSession');
    if (stored) {
      try {
        const { email, timestamp } = JSON.parse(stored);
        const hoursSince = (Date.now() - timestamp) / (1000 * 60 * 60);
        if (hoursSince < 24) {
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

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setAdminEmail(email);
      localStorage.setItem('adminSession', JSON.stringify({ email, timestamp: Date.now() }));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password.' };
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
