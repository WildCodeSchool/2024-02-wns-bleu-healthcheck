import { Outlet } from "react-router-dom";
import "./App.scss";
import Header from "./common/components/header/Header.tsx";

function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
export default App;
