import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const role = session.user.app_metadata?.role || session.user.user_metadata?.role;
        if (role === 'admin') {
          setIsAdmin(true);
          setAdminEmail(session.user.email ?? null);
        }
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const role = session.user.app_metadata?.role || session.user.user_metadata?.role;
        if (role === 'admin') {
          setIsAdmin(true);
          setAdminEmail(session.user.email ?? null);
        } else {
          setIsAdmin(false);
          setAdminEmail(null);
        }
      } else {
        setIsAdmin(false);
        setAdminEmail(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Login failed. Please try again.' };
      }

      const role = data.user.app_metadata?.role || data.user.user_metadata?.role;
      if (role !== 'admin') {
        await supabase.auth.signOut();
        return { success: false, error: 'Access denied. Admin privileges required.' };
      }

      setIsAdmin(true);
      setAdminEmail(email);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setAdminEmail(null);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminEmail, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
};
