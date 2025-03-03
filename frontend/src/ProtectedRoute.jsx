import { useAuth } from './context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />; // Redirect to a default page (e.g., home or user dashboard)
  }

  return <Outlet />;
};

export default ProtectedRoute;