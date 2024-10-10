import { GoLink, GoSync, GoCode } from "react-icons/go";
import { FaTrash } from "react-icons/fa";
import { CiTimer } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import "./_urlCard.scss";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import { useMemo, useState } from "react";
import {
  DELETE_SAVED_QUERY,
  GET_SAVED_QUERIES,
  EDIT_SAVED_QUERY,
  GET_LOGS,
} from "@/common/graphql/queries.ts";
import { useMutation, useQuery } from "@apollo/client";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { Log } from "@/common/models/Log";
import moment from "moment";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface UrlData {
  url: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  frequency?: number;
  name?: string;
  order?: number;
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
  const {
    data: logsData,
    loading,
    error,
  } = useQuery(GET_LOGS, {
    variables: { savedQueryId: urlData._id },
    pollInterval: 60000, // Refetch every 60 seconds
    fetchPolicy: "cache-and-network",
  });
  const [deleteQuery] = useMutation(DELETE_SAVED_QUERY, {
    refetchQueries: [{ query: GET_SAVED_QUERIES }],
    awaitRefetchQueries: true,
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [editedName, setEditedName] = useState(urlData.name || "");
  const [editedFrequency, setEditedFrequency] = useState(
    urlData.frequency || 0
  );

  const logs = useMemo(() => {
    let l = logsData?.getLogsForSavedQuery || [];
    if (l.length < 33) {
      const emptyLogs = Array.from({ length: 33 - l.length }, (_, index) => ({
        _id: `empty-${index}`,
        date: "",
        response_time: 0,
        status: 3,
        status_code: 0,
        status_message: "",
      }));
      l = [...l, ...emptyLogs];
    } else if (l.length > 33) {
      l = l.slice(0, 33);
    }
    return l;
  }, [logsData]);

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
      const updatedFrequency =
        editedFrequency !== undefined ? editedFrequency : urlData.frequency;

      await editQuery({
        variables: {
          queryId: urlData._id,
          name: updatedName,
          frequency: updatedFrequency,
        },
      });
    } catch (error) {
      toast.error("Erreur lors de la modification de la requête");
      console.error("Error editing query:", error);
    } finally {
      setIsEditDialogOpen(false);
    }
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: urlData._id || "default-id" });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      className={`card ${
        urlData.lastStatus?.status === 2
          ? "success"
          : urlData.lastStatus?.status === 1
          ? "warning"
          : "error"
      } ${onClick ? "clickable" : ""}`}
      onClick={onClick}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      {urlData.name && <p className="card__name">{urlData.name}</p>}
      <div className="card__content">
        <ul className="card__list">
          <li className="card__url card__element card__text">
            <span className="card__icon">
              <GoLink />
            </span>
            URL : {urlData.url}
          </li>
          <li className="card__url card__element">
            <span className="card__icon">
              <GoCode />
            </span>
            Code de retour : {urlData.lastStatus?.status_code}
          </li>
          <li className="card__url card__element">
            <span className="card__icon">
              <CiTimer />
            </span>
            Temps de réponse :{" "}
            {urlData.lastStatus?.response_time
              ? `${urlData.lastStatus?.response_time} ms`
              : ""}
          </li>
          {urlData.frequency && (
            <li className="card__frequence card__element">
              <span className="card__icon">
                <GoSync />
              </span>
              Fréquence : {urlData.frequency} min
            </li>
          )}
        </ul>
        <div className="card__logs" onClick={onClick}>
          {!loading &&
            !error &&
            logs.map((log: Log) => (
              <Tooltip
                key={log._id}
                title={
                  log.date !== ""
                    ? `${moment(log.date).format("DD/MM/y HH:mm")} - ${
                        log.status_code
                      } - ${log.response_time}ms`
                    : ""
                }
                arrow
                placement="bottom"
              >
                <div
                  key={log._id}
                  className="card__log"
                  style={
                    log.status === 3
                      ? { backgroundColor: "#bdbdbd" }
                      : log.status === 2
                      ? { backgroundColor: "#4caf50" }
                      : log.status === 1
                      ? { backgroundColor: "#ffeb3b" }
                      : { backgroundColor: "#f44336" }
                  }
                >
                  &nbsp;
                </div>
              </Tooltip>
            ))}
        </div>
      </div>

      {/*Delete button in the top right corner, if this is a saved query*/}
      {urlData._id && (
        <div className="card__delete_button">
          <Tooltip title="Supprimer" arrow placement="top">
            <Button
              sx={{
                borderRadius: "50%",
                height: "32px",
                minHeight: "32px",
                width: "32px",
                minWidth: "32px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={handleOpenDeleteDialog}
            >
              <FaTrash />
            </Button>
          </Tooltip>
        </div>
      )}

      {/*Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Supprimer la requête</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer la requête "{urlData.name}" ?
            <br />
            L'historique sera également supprimé, cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Annuler
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/*Edit button next to the delete button*/}
      {urlData._id && (
        <div className={"card__edit_button"}>
          <Tooltip title="Modifier" arrow placement="top">
            <Button
              sx={{
                borderRadius: "50%",
                height: "32px",
                minHeight: "32px",
                width: "32px",
                minWidth: "32px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={handleOpenEditDialog}
            >
              <MdEdit />
            </Button>
          </Tooltip>
        </div>
      )}

      {/*Edit dialog*/}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onClick={(e) => e.stopPropagation()}
      >
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
              color={
                editedFrequency >= 1 && editedFrequency <= 60
                  ? "secondary"
                  : "warning"
              }
              value={editedFrequency || ""}
              onChange={(e) =>
                setEditedFrequency(parseInt(e.target.value) || 0)
              }
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
            disabled={
              editedName.length === 0 ||
              editedFrequency < 1 ||
              editedFrequency > 60
            }
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UrlCard;
