import Modal from "@mui/material/Modal";
import "./LoginModal.scss";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useLazyQuery } from "@apollo/client";
import { LOGIN } from "@/common/graphql/queries";
import useAuth from "@/common/hooks/useAuth";

interface LoginModalProps {
  open: boolean;
  handleClose: () => void;
}
const defaultTheme = createTheme();

const LoginModal = ({ open, handleClose }: LoginModalProps) => {

  const { refetch } = useAuth();
  const [loginQuery] = useLazyQuery(LOGIN);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await loginQuery({
      variables: {
        email: data.get("email"),
        password: data.get("password"),
      },
    });
    refetch();
  };
  return (
    <div className="login__modal">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-form"
      >
        <Box className="login__modal-box">
          <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1 }} className="login__modal-avatar">
                  <LockOutlinedIcon className="login__modal-lock" />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Se connecter
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Adresse mail"
                    name="email"
                    autoComplete="email"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Mot de passe"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    className="login__modal-button"
                  >
                    Se connecter
                  </Button>
                  <Grid container>
                    <Grid item>
                      <Link href="/register" variant="body2">
                        <Button>{"Créer un compte"}</Button>
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </Box>
      </Modal>
    </div>
  );
};

export default LoginModal;
