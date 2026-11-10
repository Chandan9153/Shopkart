import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("shopkart_user");
    return saved ? JSON.parse(saved) : null;
  });

  function login(authResponse) {
    localStorage.setItem("shopkart_token", authResponse.token);
    const currentUser = {
      id: authResponse.userId,
      name: authResponse.name,
      email: authResponse.email,
      role: authResponse.role,
    };
    localStorage.setItem("shopkart_user", JSON.stringify(currentUser));
    setUser(currentUser);
  }

  function logout() {
    localStorage.removeItem("shopkart_token");
    localStorage.removeItem("shopkart_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
