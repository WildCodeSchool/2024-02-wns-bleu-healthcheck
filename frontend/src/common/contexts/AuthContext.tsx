import { createContext } from "react";
import { Role } from "../models/User";
import { ApolloError } from "@apollo/client/errors";

type AuthContextType = {
  userInfos: {
    isLoggedIn: boolean,
    email: string | null,
    name: string | null,
    role: Role | null,
  },
  loading: boolean,
  error: ApolloError | undefined,
  refetch: () => Promise<void>,
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default AuthContext;