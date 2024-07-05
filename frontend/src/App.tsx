import { Outlet } from "react-router-dom";
import "./App.scss";
import Header from "./common/components/header/Header.tsx";
import AuthContextProvider from "./common/providers/AuthContextProvider.tsx";

function App() {
  return (
    <>
      <AuthContextProvider>
        <Header />
        <Outlet />
      </AuthContextProvider>
    </>
  );
}
export default App;
