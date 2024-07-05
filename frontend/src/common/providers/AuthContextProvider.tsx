/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { User } from "../models/User";

const AuthProvider = ({ children } : { children : React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (_login: string, _password: string) => {
    // implementation
  };

  const logout = () => {
    // implementation
  };

  const register = (_email: string, _username: string, _password: string) => {
    // implementation
  };

  const isLoggedIn = () => {
    // implementation
    return false;
  };

  const contextValue = {
    user,
    token,
    login,
    logout,
    register,
    isLoggedIn
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
};

export default AuthProvider;