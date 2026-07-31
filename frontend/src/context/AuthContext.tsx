import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";

interface Buyer {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
}

interface AuthContextType {
  buyer: Buyer | null;
  isAuthenticated: boolean;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => void;
  subscribeToPremium: () => void;
  cancelPremium: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setBuyer({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
          isPremium: false,
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setBuyer({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
          isPremium: false,
        });
      } else {
        setBuyer(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signup(name: string, email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw error;
  }

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setBuyer(null);
    setSession(null);
  }

  function deleteAccount() {
    console.warn("deleteAccount not fully implemented with Supabase Admin API in frontend");
  }

  function subscribeToPremium() {
    if (buyer) setBuyer({ ...buyer, isPremium: true });
  }

  function cancelPremium() {
    if (buyer) setBuyer({ ...buyer, isPremium: false });
  }

  return (
    <AuthContext.Provider
      value={{
        buyer,
        isAuthenticated: !!buyer,
        session,
        login,
        signup,
        logout,
        deleteAccount,
        subscribeToPremium,
        cancelPremium,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
