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

import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

export interface UrlData {
  url: string;
  _id?: number;
  frequency?: number;
  name?: string;
  queryOrder: number;
}

interface UrlCardProps {
  urlData: UrlData;
  onLogsClick?: (logs: Log[], name: string) => void; // Optional onClick prop
}

function UrlCard({ urlData, onLogsClick }: UrlCardProps) {
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

  const lastLog = logs[0];

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
        lastLog.status === 2
          ? "success"
          : lastLog.status === 1
          ? "warning"
          : "error"
      }`}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      {urlData.name && <p className="card__name">{urlData.name}</p>}
      <div className="card__content">
        <ul className="card__list">
          <li className="card__element">
            <span className="card__icon">
              <InsertLinkOutlinedIcon style={{ fontSize: "20px" }} />
            </span>
            <span className="card__text">
              URL : {urlData.url}
            </span>
          </li>
          <li className="card__element">
            <span className="card__icon">
              <CodeOutlinedIcon style={{fontSize: "20px"}}/>
            </span>
            <span className="card__text">
              Code de retour : {lastLog.status_code}
            </span>
          </li>
          <li className="card__element">
            <span className="card__icon">
              <TimerOutlinedIcon style={{ fontSize: "20px" }} />
            </span>
            <span className="card__text">
                Temps de réponse :{" "}
                {lastLog.response_time ? `${lastLog.response_time} ms` : ""}
            </span>
          </li>
          {urlData.frequency && (
            <li className="card__frequence card__element">
              <span className="card__icon">
                <SyncOutlinedIcon />
              </span>
              <span className="card__text">
                Fréquence : {urlData.frequency} min
              </span>
            </li>
          )}
        </ul>
        <div
          className="card__logs"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onLogsClick && onLogsClick(logs, urlData.name || "")}
        >
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
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleOpenDeleteDialog}
            >
              <DeleteOutlinedIcon />
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
          <Button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleCloseDeleteDialog}
            color="primary"
          >
            Annuler
          </Button>
          <Button
            onPointerDown={(e) => e.stopPropagation()}
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
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleOpenEditDialog}
            >
              <EditOutlinedIcon />
            </Button>
          </Tooltip>
        </div>
      )}

      {/*Edit dialog*/}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onPointerDown={(e) => e.stopPropagation()}
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
          <Button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleCloseEditDialog}
            color="primary"
          >
            Annuler
          </Button>
          <Button
            onPointerDown={(e) => e.stopPropagation()}
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
