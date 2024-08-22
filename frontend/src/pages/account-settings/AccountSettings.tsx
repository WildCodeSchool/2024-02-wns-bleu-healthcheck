import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import "./AccountSettings.scss"

import "./AccountSettings.scss";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/common/contexts/AuthContext";
import { useMutation } from "@apollo/client";
import { EDIT_USER } from "@/common/graphql/queries";
import useValidateEmail from "@/common/hooks/useValidateEmail";
import { toast } from "react-toastify";

const AccountSettings = () => {
  const { userInfos, loading, refetch } = useContext(AuthContext);
  const [editUserMutation] = useMutation(EDIT_USER);
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState(userInfos.name ?? "");
  const [email, setEmail] = useState(userInfos.email ?? "");
  const isValidEmail = useValidateEmail(email);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setName(userInfos.name ?? "");
    setEmail(userInfos.email ?? "");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isEditMode) {
      setIsEditMode(true);
    } else {
      editUserMutation({
        variables: {
          newEmail: email,
          name: name,
        },
        onCompleted: () => {
          setIsEditMode(false);
          toast.success("Vos informations ont été mises à jour.");
          refetch();
        },
        onError: () => {
          toast.error("Une erreur s'est produite lors de la mise à jour de vos informations.");
        }
      });
    }
  };

  useEffect(() => {
    if (!loading) {
      setName(userInfos.name ?? "");
      setEmail(userInfos.email ?? "");
    }
  }, [loading, userInfos]);

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: `calc(100vh - 40px)`, mt: 2, pt: 16, pb: 2 }}
    >
      <Typography variant="h4" sx={{ display: "flex", justifyContent: "center" }}>Informations</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} columns={1} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="Nom"
              variant="outlined"
              disabled={!isEditMode}
              fullWidth
              color={name ? "secondary" : "warning"}
              value={name}
              onChange={handleNameChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email"
              variant="outlined"
              disabled={!isEditMode}
              placeholder={email}
              fullWidth
              color={isValidEmail ? "secondary" : "warning"}
              value={email}
              onChange={handleEmailChange}
            />
          </Grid>
          <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
            {isEditMode &&
              <Button onClick={() => handleCancel()} variant="outlined" color="warning">
                Annuler
              </Button>}
            <Button type="submit" variant="contained" color={isEditMode ? "secondary" : "primary"}>
              {isEditMode ? "Confirmer" : "Modifier"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AccountSettings;