import { Modal, Box, Container, CssBaseline, Avatar, Typography, TextField, Button, CircularProgress } from "@mui/material";
import KeyIcon from '@mui/icons-material/Key';
import { useMutation } from "@apollo/client";
import { EDIT_USER_PASSWORD } from "@/common/graphql/queries";
import { useState } from "react";
import { toast } from "react-toastify";

interface ChangePasswordModalProps {
  open: boolean;
  handleClose: () => void;
}

const ChangePasswordModal = ({ open, handleClose }: ChangePasswordModalProps) => {
  const [editPassword, { loading }] = useMutation(EDIT_USER_PASSWORD);
  const [formErrors, setFormErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const oldPassword = data.get("oldPassword");
    const newPassword = data.get("newPassword");
    const confirmNewPassword = data.get("confirmNewPassword");

    // Réinitialiser les erreurs
    const errors = { oldPassword: "", newPassword: "", confirmNewPassword: "" };

    if (!oldPassword) {
      errors.oldPassword = "Le mot de passe actuel est requis.";
    }

    if (!newPassword) {
      errors.newPassword = "Le nouveau mot de passe est requis.";
    }

    if (!confirmNewPassword) {
      errors.confirmNewPassword = "La confirmation du nouveau mot de passe est requise.";
    }

    if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = "Les mots de passe ne correspondent pas.";
    }

    setFormErrors(errors);

    if (!(errors.oldPassword || errors.newPassword || errors.confirmNewPassword)) {
      try {
        await editPassword({
          variables: {
            oldPassword: oldPassword,
            newPassword: newPassword,
          },
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      catch (error: any) {
        toast.error(error.message);
        return;
      }
      toast.success("Le mot de passe a bien été changé!");
      handleClose();
    }
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
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1 }} >
                <KeyIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Changer le mot de passe
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
                  id="oldPassword"
                  label="Mot de passe actuel"
                  type="password"
                  name="oldPassword"
                  autoFocus
                  autoComplete="current-password"
                  error={!!formErrors.oldPassword}
                  helperText={formErrors.oldPassword}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="newPassword"
                  label="Nouveau mot de passe"
                  type="password"
                  id="newPassword"
                  autoComplete="new-password"
                  error={!!formErrors.newPassword}
                  helperText={formErrors.newPassword}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmNewPassword"
                  label="Confirmez le nouveau mot de passe"
                  type="password"
                  id="confirmNewPassword"
                  autoComplete="new-password"
                  error={!!formErrors.confirmNewPassword}
                  helperText={formErrors.confirmNewPassword}
                />

                <Button
                  type="submit"
                  color="warning"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? (
                    <CircularProgress color="inherit" size={25} />
                  ) : (
                    "Changer le mot de passe"
                  )}
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      </Modal>
    </div>
  );
};

export default ChangePasswordModal;