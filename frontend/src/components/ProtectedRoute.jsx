import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Bloqueia acesso a rotas que exigem login. Lembre-se: isso é só
// UX no front — a segurança de verdade é sempre no back-end
// (middleware requireAuth), nunca confie só no front pra proteger dados.
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
