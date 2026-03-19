import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const API = "https://wordspy-backend-qth7.onrender.com";

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem("wordspy_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay to see loading
    const { data } = await axios.get(`${API}/api/auth/profile`);
    setUser(data.user);
  } catch {
    logout();
  } finally {
    setLoading(false);
  }
};

  const login = async (username, password) => {
    const { data } = await axios.post(`${API}/api/auth/login`, { username, password });
    localStorage.setItem("wordspy_token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (username, password) => {
    const { data } = await axios.post(`${API}/api/auth/register`, { username, password });
    localStorage.setItem("wordspy_token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("wordspy_token");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  const updateStats = async (scoreEarned, won, role) => {
    try {
      const { data } = await axios.post(`${API}/api/auth/update-stats`, { scoreEarned, won, role });
      setUser(data.user);
    } catch (err) {
      console.error("Update stats error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateStats, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}