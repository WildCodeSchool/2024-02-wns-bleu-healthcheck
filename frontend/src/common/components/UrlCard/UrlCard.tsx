import { GoLink, GoSync, GoCode } from "react-icons/go";
import { FaTrash } from "react-icons/fa";
import { CiTimer } from "react-icons/ci";
import { MdEdit} from "react-icons/md";
import "./_urlCard.scss";
import moment from "moment"
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material"
import {useState} from "react";
import {DELETE_SAVED_QUERY, GET_SAVED_QUERIES, EDIT_SAVED_QUERY} from "@/common/graphql/queries.ts";
import {useMutation} from "@apollo/client";
import TextField from "@mui/material/TextField";
import {toast} from "react-toastify";

export interface UrlData {
  url: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  frequency?: number;
  name?: string;
  lastStatus?: {
    date: string;
    response_time: number;
    status: number;
    status_code: number;
    status_message: string;
  };
}

interface UrlCardProps {
  urlData: UrlData;
  onClick?: () => void; // Optional onClick prop
}

function UrlCard({ urlData, onClick }: UrlCardProps) {


  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteQuery] = useMutation(DELETE_SAVED_QUERY, {
    refetchQueries: [{ query: GET_SAVED_QUERIES }],
    awaitRefetchQueries: true,
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(urlData.name || "");
  const [editedFrequency, setEditedFrequency] = useState(urlData.frequency || 0);

  const [editQuery] = useMutation(EDIT_SAVED_QUERY, {
     refetchQueries: [{ query: GET_SAVED_QUERIES }],
     awaitRefetchQueries: true,
  });


  const handleOpenDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteQuery({ variables: { queryId: urlData._id } });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression de la requête");
      console.error("Error deleting query:", error);
    }
  };

  const handleOpenEditDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(false);
  };

  const handleConfirmEdit = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      // Use existing values if no changes were made
      const updatedName = editedName !== undefined ? editedName : urlData.name;
      const updatedFrequency = editedFrequency !== undefined ? editedFrequency : urlData.frequency;

      await editQuery({
        variables: {
          queryId: urlData._id,
          name: updatedName,
          frequency: updatedFrequency
        }
      });
    } catch (error) {
      toast.error("Erreur lors de la modification de la requête");
      console.error("Error editing query:", error);
    } finally {
      setIsEditDialogOpen(false);
    }
  };




  return (
      <div
          className={`card ${urlData.lastStatus?.status === 2 ? "success" : urlData.lastStatus?.status === 1 ? "warning" : "error"} ${onClick ? "clickable" : ""}`}
          onClick={onClick}
      >
        {urlData.name && (<p className="card__name">{urlData.name}</p>)}
        <div className="card__content">
          <ul className="card__list">
            <li className="card__url card__element card__text">
              <span className="card__icon"><GoLink/></span>URL : {urlData.url}
            </li>
            <li className="card__url card__element">
              <span className="card__icon"><GoCode/></span>Code de retour : {urlData.lastStatus?.status_code}
            </li>
            <li className="card__url card__element">
              <span className="card__icon"><CiTimer/></span>Temps de réponse
              : {urlData.lastStatus?.response_time ? `${urlData.lastStatus?.response_time} ms` : ""}
            </li>
            {urlData.frequency && (<li className="card__frequence card__element">
              <span className="card__icon"><GoSync/></span>Fréquence : {urlData.frequency} min
            </li>)}
          </ul>
          <p className="card__lastquery">Dernière requête
            : {urlData.lastStatus?.date ? moment(urlData.lastStatus?.date).fromNow() : "en cours"}</p>
        </div>

        {/*Delete button in the top right corner, if this is a saved query*/}
        {urlData._id &&
            <div className="card__delete_button">
              <Button
                  sx={{
                    borderRadius: "50%",
                    height: "32px",
                    minHeight: "32px",
                    width: "32px",
                    minWidth: "32px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onClick={handleOpenDeleteDialog}
              >
                <FaTrash/>
              </Button>
            </div>
        }


        {/*Delete confirmation dialog */}
        <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Supprimer la requête</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir supprimer la requête "{urlData.name}" ?
              <br/>
              L'historique sera également supprimé, cette action est irréversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Annuler
            </Button>
            <Button onClick={handleConfirmDelete} variant="contained" color="error">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/*Edit button next to the delete button*/}
        {urlData._id &&
          <div className={"card__edit_button"}>
            <Button
                sx={{
                  borderRadius: "50%",
                  height: "32px",
                  minHeight: "32px",
                  width: "32px",
                  minWidth: "32px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
                onClick={handleOpenEditDialog}
            >
              <MdEdit/>
            </Button>
          </div>
        }

        {/*Edit dialog*/}
        <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} onClick={(e) => e.stopPropagation()}>
          <DialogTitle>Modifier la requête "{urlData.name}"</DialogTitle>
          <DialogContent>
            <div className={"card__edit_section"}>
              <TextField
                  id="outlined-basic"
                  label="Nom"
                  variant="outlined"
                  color={editedName.length > 0 ? "secondary" : "warning"}
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
              />
              <TextField
                  id="outlined-basic"
                  label="Fréquence (min)"
                  variant="outlined"
                  color={parseInt(editedFrequency) >= 1 && parseInt(editedFrequency) <= 60 ? "secondary" : "warning"}
                  value={editedFrequency || ""}
                  onChange={(e) => setEditedFrequency(parseInt(e.target.value) || 0)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="primary">
              Annuler
            </Button>
            <Button
                onClick={handleConfirmEdit}
                variant="contained"
                color="secondary"
                disabled = {editedName.length === 0 || editedFrequency < 1 || editedFrequency > 60}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>


      </div>
  );
}

export default UrlCard;
