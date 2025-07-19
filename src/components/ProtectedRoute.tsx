
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLogin } from '@/components/AdminLogin';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();

  console.log('🛡️ ProtectedRoute:', { hasUser: !!user, loading, isAdmin, requireAdmin });

  // Show loading only if we have a user and are checking admin status
  if (user && loading && requireAdmin && isAdmin === null) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Verifica autenticazione...</p>
          </div>
        </div>
      </div>
    );
  }

  if (requireAdmin && (!user || !isAdmin)) {
    console.log('🚫 Access denied - Admin required');
    return <AdminLogin />;
  }

  if (!user) {
    console.log('🚫 Access denied - Authentication required');
    return <AdminLogin />;
  }

  console.log('✅ Access granted');
  return <>{children}</>;
};
