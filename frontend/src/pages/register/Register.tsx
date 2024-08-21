import "./Register.scss";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState } from "react";
import LoginModal from "@/common/components/loginModal/LoginModal";
import { CREATE_USER } from "@/common/graphql/queries";
import { useMutation } from "@apollo/client";


const Register = () => {
  const [registerQuery] = useMutation(CREATE_USER);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    registerQuery({ variables: {
      email: data.get("email"),
      name: data.get("nom"),
      password: data.get("password"),
    } });
  };

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const handleClose = () => setIsLoginModalOpen(false);

  return (
    <div className="register">
      {isLoginModalOpen && (
        <LoginModal open={isLoginModalOpen} handleClose={handleClose} />
      )}
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1 }} className="register-avatar">
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Créer un compte
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Adresse mail"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="nom"
                    label="Nom"
                    name="nom"
                    autoComplete="nom"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Mot de passe"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                color="secondary"
              >
                Créer un compte
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Button
                    onClick={() => setIsLoginModalOpen(true)}
                    variant="text"
                    color="primary"
                  >
                    Vous avez déjà un compte ? Se connecter
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
    </div>
  );
};

export default Register;
