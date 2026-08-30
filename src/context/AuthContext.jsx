import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("azam_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("azam_user", JSON.stringify(user));
    else localStorage.removeItem("azam_user");
  }, [user]);

  const getUsers = () => JSON.parse(localStorage.getItem("azam_users") || "[]");
  const saveUsers = (users) =>
    localStorage.setItem("azam_users", JSON.stringify(users));

  const signup = (data) => {
    const users = getUsers();
    if (users.some((u) => u.email === data.email)) {
      return { success: false, message: "Email already registered" };
    }
    const newUser = { id: Date.now(), ...data };
    saveUsers([...users, newUser]);
    setUser(newUser);
    return { success: true };
  };

  const login = (email, password) => {
    const users = getUsers();
    const found = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!found) return { success: false, message: "Invalid email or password" };
    setUser(found);
    return { success: true, role: found.role };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
