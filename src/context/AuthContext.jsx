import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const saved = localStorage.getItem("admin_user");
    
    if (token && saved) {
      setUser(JSON.parse(saved));
      
      // Verify token is still valid
      API.get("/admin/auth/me")
        .then((res) => {
          // ✅ Handle nested response: res.data.data
          const userData = res.data.data || res.data.user || res.data;
          setUser(userData);
          localStorage.setItem("admin_user", JSON.stringify(userData));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post("/admin/auth/login", { email, password });
    
    // ✅ Your backend returns: { success: true, data: { token, user } }
    const responseData = res.data.data || res.data;
    const { token, user: u } = responseData;
    
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_user", JSON.stringify(u));
    
    setUser(u);
    return u;
  };

  const logout = async () => {
    try {
      await API.post("/admin/auth/logout");
    } catch (err) {
      // Ignore logout errors
    }
    
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setUser(null);
  };

  const updateUser = (data) => {
    setUser(data);
    localStorage.setItem("admin_user", JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);