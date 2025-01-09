import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import "./CreateGroup.scss";
import { CREATE_GROUP, GET_GROUPS_BY_USER } from "@/common/graphql/queries";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { Role } from "@/common/models/User";

interface CreateGroupProps {
  userInfos: {
    _id: number | null;
    isLoggedIn: boolean;
    email: string | null;
    name: string | null;
    role: Role | null;
  };
}

const CreateGroup = ({ userInfos }: CreateGroupProps) => {
  const [groupName, setGroupName] = useState("");
  const [emails, setEmails] = useState("");
  const [createGroupQuery, { error: createGroupError }] = useMutation(
    CREATE_GROUP,
    {
      refetchQueries: [
        { query: GET_GROUPS_BY_USER, variables: { userId: userInfos._id } },
      ],
      awaitRefetchQueries: true,
    }
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validation simple
    if (!groupName || !emails) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    // Préparer les données
    const emailArray = emails.split(",").map((email) => email.trim());
    if (userInfos.email) {
      emailArray.push(userInfos.email);
    }

    // Appel à l'API pour créer le groupe
    try {
      await createGroupQuery({
        variables: {
          name: groupName,
          emails: emailArray,
        },
      });

      // Réinitialiser le formulaire
      setGroupName("");
      setEmails("");
      toast.success("Groupe créé avec succès !");
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la création du groupe.");
    }
  };

  return (
    <div className="create-group__wrapper">
      <Typography variant="h4" gutterBottom>
        Créer un groupe
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Nom du groupe"
            variant="outlined"
            fullWidth
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Emails des utilisateurs (séparés par des virgules)"
            variant="outlined"
            fullWidth
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
        </Box>
        {createGroupError && (
          <Typography color="error" gutterBottom>
            {createGroupError.message}
          </Typography>
        )}
        <Button variant="contained" color="primary" type="submit">
          Créer un groupe
        </Button>
      </form>
    </div>
  );
};

export default CreateGroup;
