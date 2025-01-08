import { useContext, useState } from "react";
import "./Groups.scss";

import AuthContext from "@/common/contexts/AuthContext";
import CreateGroup from "@/common/components/groups/createGroup/CreateGroup";
import {
  DELETE_GROUP,
  EDIT_GROUP,
  GET_GROUPS_BY_USER,
} from "@/common/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { toast } from "react-toastify";
import { Group } from "@/common/models/Group";
import { User } from "@/common/models/User";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const Groups = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<Group>();
  const [groupToEdit, setGroupToEdit] = useState<Group>();
  const [openGroupId, setOpenGroupId] = useState<number | null>(null);

  const { userInfos } = useContext(AuthContext);
  const { data, loading: loadingGroups } = useQuery(GET_GROUPS_BY_USER, {
    variables: {
      userId: userInfos._id,
    },
  });

  const [deleteGroup] = useMutation(DELETE_GROUP, {
    refetchQueries: [
      { query: GET_GROUPS_BY_USER, variables: { userId: userInfos._id } },
    ],
  });

  const [editGroup] = useMutation(EDIT_GROUP, {
    refetchQueries: [
      { query: GET_GROUPS_BY_USER, variables: { userId: userInfos._id } },
    ],
  });

  const handleOpenClick = (groupId: number) => {
    setOpenGroupId(openGroupId === groupId ? null : groupId);
  };

  const handleDeleteClick = (group: Group, event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDeleteDialogOpen(true);
    setGroupToDelete(group);
  };

  const handleEditClick = (group: Group, event: React.MouseEvent) => {
    event.stopPropagation();
    setIsEditDialogOpen(true);
    setGroupToEdit(group);
  };

  const handleEdit = async (group: Group) => {
    try {
      const name = groupToEdit?.name || group.name;
      const emails = (groupToEdit?.users || group.users).map(
        (user: User) => user.email
      );

      await editGroup({
        variables: {
          updateGroupId: group._id,
          name,
          emails,
        },
      });

      toast.success("Groupe modifié avec succès !");
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(
        "Une erreur s'est produite lors de la modification du groupe. Veuillez réessayer."
      );
    }
  };

  const handleDelete = async (groupId: number) => {
    try {
      await deleteGroup({
        variables: {
          deleteGroupId: groupId,
        },
      });
    } catch (error) {
      console.error(error);
      toast.error(
        "Une erreur s'est produite lors de la suppression du groupe. Veuillez réessayer."
      );
      return;
    }
    toast.success("Groupe supprimé avec succès !");
    setIsDeleteDialogOpen(false);
  };
  const handleCloseDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(false);
  };
  const handleCloseEditDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(false);
  };

  if (!data || loadingGroups) {
    return <div>Loading...</div>;
  }

  return (
    <div className="group__wrapper">
      <CreateGroup userInfos={userInfos} />

      <div className="group__list">
        <Typography variant="h4" gutterBottom className="group__list-title">
          Mes groupes
        </Typography>

        {data.getGroupsByUser.map((group: Group) => (
          <div key={group._id} className="group__list-item">
            <ListItemButton onClick={() => handleOpenClick(group._id)}>
              <ListItemText primary={group.name} />
              <div className="group__list-header-actions">
                <Button
                  type="submit"
                  variant="text"
                  color="primary"
                  onClick={(event) => handleEditClick(group, event)}
                >
                  <EditOutlinedIcon style={{ fontSize: "20" }} />
                </Button>
                <Button
                  variant="text"
                  color="warning"
                  size="small"
                  onClick={(event) => handleDeleteClick(group, event)}
                >
                  <CancelOutlinedIcon style={{ fontSize: "20" }} />
                </Button>
              </div>
              {openGroupId === group._id ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse
              in={openGroupId === group._id}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <div className="group__list-user">
                    {group.users.map((user: User) => (
                      <ListItemText key={user._id} primary={user.name} />
                    ))}
                  </div>
                </ListItemButton>
              </List>
            </Collapse>
          </div>
        ))}
      </div>
      {/*Delete confirmation dialog */}
      {groupToDelete && (
        <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Supprimer le groupe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir supprimer le groupe "
              {groupToDelete?.name}" ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleCloseDeleteDialog}
              color="primary"
            >
              Annuler
            </Button>
            <Button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => handleDelete(groupToDelete._id)}
              variant="contained"
              color="error"
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {/*Edit confirmation dialog */}
      {groupToEdit && (
        <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog}>
          <DialogTitle>Modifier le groupe</DialogTitle>
          <DialogContent>
            <DialogContent>
              <div className={"card__edit_section"}>
                <TextField
                  id="outlined-basic"
                  label="Nom"
                  variant="outlined"
                  color={groupToEdit.name.length > 0 ? "secondary" : "warning"}
                  value={groupToEdit.name}
                  onChange={(e) =>
                    setGroupToEdit({ ...groupToEdit, name: e.target.value })
                  }
                />
                <TextField
                  id="outlined-basic"
                  label="Emails"
                  variant="outlined"
                  color={groupToEdit.users.length > 0 ? "secondary" : "warning"}
                  value={groupToEdit.users.map((user: User) => user.email)}
                  onChange={(e) =>
                    setGroupToEdit({
                      ...groupToEdit,
                      users: e.target.value
                        .split(",")
                        .map((email) => ({ email } as User)),
                    })
                  }
                />
              </div>
            </DialogContent>
          </DialogContent>
          <DialogActions>
            <Button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleCloseEditDialog}
              color="primary"
            >
              Annuler
            </Button>
            <Button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => handleEdit(groupToEdit)}
              variant="contained"
              color="error"
            >
              Modifier
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Groups;
