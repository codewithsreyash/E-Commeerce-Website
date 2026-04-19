import { Navigate } from 'react-router-dom';
import { isAuthenticated, parseJwt, TOKEN_KEY } from '../services/api';

function AdminRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const payload = parseJwt(token);
  if (!payload || payload.role !== 'ADMIN') {
    // If authenticated but not admin, kick them back to storefront
    return <Navigate to="/shop" replace />;
  }

  return children;
}

export default AdminRoute;
