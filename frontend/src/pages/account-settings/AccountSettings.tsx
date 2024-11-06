import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import "./AccountSettings.scss";

import { useContext, useEffect, useState } from "react";
import AuthContext from "@/common/contexts/AuthContext";
import { useMutation } from "@apollo/client";
import { EDIT_USER } from "@/common/graphql/queries";
import useValidateEmail from "@/common/hooks/useValidateEmail";
import { toast } from "react-toastify";
import { REMOVE_PREMIUM_ROLE } from "@/common/graphql/queries";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";


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
          toast.error(
            "Une erreur s'est produite lors de la mise à jour de vos informations."
          );
        },
      });
    }
  };

  const [removePremiumRole] = useMutation(REMOVE_PREMIUM_ROLE, {
    fetchPolicy: "no-cache",
    onCompleted: async () => {
      toast.success("Votre abonnement premium a été résilié.");
      refetch();
    },
  });

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
      <form onSubmit={handleSubmit}>
        <Grid
          container
          spacing={2}
          direction={"row"}
          display={"flex"}
          justifyContent={"space-between"}
        >
          <Grid sm={8}>
            <Typography
              variant="h4"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              Paramètres du compte
            </Typography>
          </Grid>
          <Grid sm={4} sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
            {isEditMode && (
              <Button
                onClick={() => handleCancel()}
                variant="text"
                color="warning"
                size="small"
              >
                <CancelOutlinedIcon style={{ fontSize: "20" }} />
              </Button>
            )}
            <Button type="submit" variant="text" color="primary">
              {isEditMode ? (
                <SaveOutlinedIcon style={{ fontSize: "20" }} />
              ) : (
                <EditOutlinedIcon style={{ fontSize: "20" }} />
              )}
            </Button>
          </Grid>
        </Grid>
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
        </Grid>
      </form>
      {userInfos.role == 1 && (
        <div className="account-settings__remove-premium-role">
          <Button color="error" onClick={() => removePremiumRole()}>
            Résilier l'abonnement premium
          </Button>
        </div>
      )}
    </Container>
  );
};

export default AccountSettings;
