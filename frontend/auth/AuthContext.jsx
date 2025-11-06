import React, { createContext, useState, useEffect } from "react";
import api from "./axiosInstance";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("jwt_profile");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  async function login(email, password) {
    const res = await api.post("/authentication/login", { email, password });
    const { token, profile } = res.data;
    if (!token) throw new Error("No token returned");
    localStorage.setItem("jwt", token);
    if (profile) {
      localStorage.setItem("jwt_profile", JSON.stringify(profile));
      setUser(profile);
    } else {
      // fallback: attempt to read minimal info from token or call /me
      await refreshProfileFromServer();
    }
    // avoid router navigation here (AuthProvider may be created outside Router)
    window.location.href = "/home-page";
  }

  // Signup helper: calls signup endpoint then logs in automatically.
  async function signup(payload) {
    // payload expected: { name, surName, email, password, phoneNumber }
    // axios will throw for non-2xx responses, so a successful call continues
    await api.post("/authentication/signup", payload);

    // After a successful signup, call login to obtain token/profile
    await login(payload.email, payload.password);
  }

  function logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("jwt_profile");
    setUser(null);
    window.location.href = "/";
  }

  async function refreshProfileFromServer() {
    try {
      const res = await api.get("/authentication/me");
      setUser(res.data);
      localStorage.setItem("jwt_profile", JSON.stringify(res.data));
    } catch {
      // token invalid/expired
      logout();
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, refreshProfileFromServer }}>
      {children}
    </AuthContext.Provider>
  );
}