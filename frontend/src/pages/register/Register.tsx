import "./Register.scss";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState } from "react";
import { CREATE_USER } from "@/common/graphql/queries";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import LoginModal from "@/common/components/loginModal/LoginModal";
import { CssBaseline } from "@mui/material";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const navigate = useNavigate();
  const [registerQuery, { error }] = useMutation(CREATE_USER);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: "",
    nom: "",
    password: "",
  });

  const handleClose = () => setIsLoginModalOpen(false);

  const validateEmail = (email: FormDataEntryValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(email));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const nom = data.get("nom");
    const password = data.get("password");

    // Réinitialiser les erreurs
    const errors = { email: "", nom: "", password: "" };

    if (!email) {
      errors.email = "L'adresse email est requise.";
    } else if (!validateEmail(email)) {
      errors.email = "L'adresse email n'est pas valide.";
    }

    if (!nom) {
      errors.nom = "Le nom est requis.";
    }

    if (!password) {
      errors.password = "Le mot de passe est requis.";
    }

    setFormErrors(errors);

    if (!errors.email && !errors.nom && !errors.password) {
      try {
        await registerQuery({
          variables: {
            email: email,
            name: nom,
            password: password,
          },
        });
        if (!error) {
          toast.success("Compte créé avec succès !");
        }
        navigate("/");
      } catch (err) {
        toast.error("Erreur lors de la création du compte.");
      }
    }
  };

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
                    error={!!formErrors.email}
                    helperText={formErrors.email}
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
                    error={!!formErrors.nom}
                    helperText={formErrors.nom}
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
                    error={!!formErrors.password}
                    helperText={formErrors.password}
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
