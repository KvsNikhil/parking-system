import { createContext, useState } from "react";
import { login as loginAPI, register as registerAPI } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("parking_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("parking_token") || null;
  });

  const saveAuth = (data) => {
    localStorage.setItem("parking_token", data.token);
    localStorage.setItem("parking_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (formData) => {
    const response = await registerAPI(formData);
    saveAuth(response.data);
    return response;
  };

  const login = async (formData) => {
    const response = await loginAPI(formData);
    saveAuth(response.data);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("parking_token");
    localStorage.removeItem("parking_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
