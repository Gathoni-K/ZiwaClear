import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Client-side auth gate. This is a UX convenience only — the real
 * enforcement is server-side (see backend/src/middleware/auth.ts, wired
 * into the claim/collect/delete batch routes). Without this component the
 * /dashboard tree rendered for anyone who hit the URL directly, regardless
 * of session state; data-mutating actions would still fail server-side, but
 * that's a broken experience, not a real login gate.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // AuthProvider withholds rendering its children until the initial
  // Supabase session check resolves, so by the time this component renders,
  // isAuthenticated already reflects real session state.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
