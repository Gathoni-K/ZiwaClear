import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface Buyer {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
}

interface AuthContextType {
  buyer: Buyer | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  deleteAccount: () => void;
  subscribeToPremium: () => void;
  cancelPremium: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Simulate a backend
const getUsers = (): Record<string, { name: string; password: string; isPremium: boolean }> => {
  try {
    return JSON.parse(localStorage.getItem("ZiwaClear-users") || "{}");
  } catch {
    return {};
  }
};

const saveUsers = (users: Record<string, any>) => {
  localStorage.setItem("ZiwaClear-users", JSON.stringify(users));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [buyer, setBuyer] = useState<Buyer | null>(() => {
    const stored = localStorage.getItem("ZiwaClear-buyer");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (buyer) {
      localStorage.setItem("ZiwaClear-buyer", JSON.stringify(buyer));
    } else {
      localStorage.removeItem("ZiwaClear-buyer");
    }
  }, [buyer]);

  async function signup(name: string, email: string, password: string) {
    await new Promise((r) => setTimeout(r, 600));

    if (!name || !email || !password) {
      throw new Error("All fields are required.");
    }
    if (!email.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const users = getUsers();
    if (users[email]) {
      throw new Error("An account with this email already exists.");
    }

    users[email] = { name, password, isPremium: false };
    saveUsers(users);

    const newBuyer: Buyer = { id: crypto.randomUUID(), email, name, isPremium: false };
    setBuyer(newBuyer);
  }

  async function login(email: string, password: string) {
    await new Promise((r) => setTimeout(r, 600));

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const users = getUsers();
    const user = users[email];

    if (!user) {
      throw new Error("No account found with this email. Please sign up.");
    }
    if (user.password !== password) {
      throw new Error("Incorrect password. Please try again.");
    }

    const loggedIn: Buyer = { id: crypto.randomUUID(), email, name: user.name, isPremium: user.isPremium };
    setBuyer(loggedIn);
  }

  function logout() {
    setBuyer(null);
  }

  function deleteAccount() {
    if (!buyer) return;
    const users = getUsers();
    delete users[buyer.email];
    saveUsers(users);
    setBuyer(null);
  }

  function subscribeToPremium() {
    if (!buyer) return;
    const updated = { ...buyer, isPremium: true };
    setBuyer(updated);

    const users = getUsers();
    if (users[buyer.email]) {
      users[buyer.email].isPremium = true;
      saveUsers(users);
    }
  }

  function cancelPremium() {
    if (!buyer) return;
    const updated = { ...buyer, isPremium: false };
    setBuyer(updated);

    const users = getUsers();
    if (users[buyer.email]) {
      users[buyer.email].isPremium = false;
      saveUsers(users);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        buyer,
        isAuthenticated: !!buyer,
        login,
        signup,
        logout,
        deleteAccount,
        subscribeToPremium,
        cancelPremium,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}