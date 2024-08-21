import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import "./AccountSettings.scss"

import "./AccountSettings.scss";
import { useContext, useState } from "react";
import AuthContext from "@/common/contexts/AuthContext";
import { useMutation } from "@apollo/client";
import { EDIT_USER } from "@/common/graphql/queries";
import { error } from "console";

const AccountSettings = () => {
  const { userInfos } = useContext(AuthContext);
  const [editUserMutation] = useMutation(EDIT_USER);
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState(userInfos.name ?? "");
  const [email, setEmail] = useState(userInfos.email ?? "");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isEditMode) {
      setIsEditMode(true);
    } else {
      editUserMutation({
        variables: {
          email: userInfos.email,
          newEmail: email,
          name: name,
        },
        onCompleted: () => setIsEditMode(false),
      });
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: "calc(100vh-40px)", mt: 2 }}
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
              value={email}
              onChange={handleEmailChange}
            />
          </Grid>
          <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button type="submit" variant="contained" color={isEditMode ? "secondary" : "primary"}>
              {isEditMode ? "Confirmer" : "Modifier"}
            </Button>
            {isEditMode &&
              <Button onClick={() => setIsEditMode(false)} variant="outlined" color="warning">
                Annuler
              </Button>}
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AccountSettings;