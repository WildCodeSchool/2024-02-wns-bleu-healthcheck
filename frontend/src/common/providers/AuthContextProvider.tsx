import { useQuery } from "@apollo/client"
import AuthContext from "../contexts/AuthContext"
import { WHO_AM_I } from "../graphql/queries";

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, loading, error, refetch } = useQuery(WHO_AM_I);

  const contextValue = {
    userInfos: {
      isLoggedIn: data?.whoAmI.isLoggedIn ?? false,
      email: data?.whoAmI.email ?? null,
      name: data?.whoAmI.name ?? null,
      role: data?.whoAmI.role ?? null,
    },
    loading: loading,
    error: error,
    refetch: refetch,
  }
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
};

export default AuthContextProvider
