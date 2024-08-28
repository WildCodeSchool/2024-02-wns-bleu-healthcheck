import { Outlet } from "react-router-dom";
import "./App.scss";
import Header from "./common/components/header/Header.tsx";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import AuthContextProvider from "./common/providers/AuthContextProvider.tsx";
import moment from 'moment';
import 'moment/dist/locale/fr';

// Set the moment locale globally to French
moment.locale("fr");

const theme = createTheme({
  palette: {
    primary: {
      light: "#C1E0F7",
      main: "#011936",
      dark: "#000000",
      contrastText: "#f1f1f1",
    },
    secondary: {
      light: "#CBF0CA",
      main: "#6CF069",
      dark: "#CBF0CA",
      contrastText: "#fff",
    },
    warning: {
      light: "#CBF0CA",
      main: "#ee3e3b",
      dark: "#CBF0CA",
      contrastText: "#fff",
    },
  },
});

// TOTOTOTOTOTOTO

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
