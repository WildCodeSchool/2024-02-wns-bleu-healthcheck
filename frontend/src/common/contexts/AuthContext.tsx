import { createContext } from "react";
import { User } from "../models/User";

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (login: string, password: string) => void;
  logout: () => void;
  register: (email: string, username: string, password: string) => void;
  isLoggedIn: () => boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default AuthContext;