import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import Spinner from '@/components/ui/Spinner';

interface Props {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { isAuthenticated, user, isInitialized } = useAuth();

  // Wait for the silent refreshAuth() check on app load to finish
  // before deciding anything — otherwise every reload briefly sees
  // isAuthenticated=false and redirects before the session restores.
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}