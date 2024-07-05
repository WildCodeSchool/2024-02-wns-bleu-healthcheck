import { Outlet } from "react-router-dom";
import "./App.scss";
import Header from "./common/components/header/Header.tsx";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import AuthContextProvider from "./common/providers/AuthContextProvider.tsx";

const theme = createTheme({
  palette: {
    primary: {
      light: "#C1E0F7",
      main: "#011936",
      dark: "#000000",
      contrastText: "#000",
    },
    secondary: {
      light: "#CBF0CA",
      main: "#6CF069",
      dark: "#CBF0CA",
      contrastText: "#000",
    },
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AuthContextProvider>
          <Header />
          <Outlet />
        </AuthContextProvider>
      </ThemeProvider>
    </>
  );
}
export default App;
