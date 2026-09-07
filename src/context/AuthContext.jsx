import { createContext, useContext, useState, useEffect } from "react";
import { api, tokenStore } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing session

  // On first load, if we have a stored token, ask the backend who we are.
  useEffect(() => {
    async function restoreSession() {
      if (!tokenStore.getAccess()) {
        setLoading(false);
        return;
      }
      try {
        const me = await api.get("/auth/me");
        setUser(me);
      } catch {
        tokenStore.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  // Public signup — the backend always forces this to a manager account,
  // no matter what's sent, so there's no "admin" self-signup path.
  const signup = async (form) => {
    try {
      const data = await api.post(
        "/auth/signup",
        {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          building: form.building,
        },
        { auth: false },
      );
      tokenStore.set(data.access_token, data.refresh_token);
      setUser(data.user);
      return { success: true, role: data.user.role };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const login = async (email, password) => {
    try {
      const data = await api.post("/auth/login", { email, password }, { auth: false });
      tokenStore.set(data.access_token, data.refresh_token);
      setUser(data.user);
      return { success: true, role: data.user.role };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", undefined, { auth: true });
    } catch {
      // even if the network call fails, still clear the local session
    }
    tokenStore.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
