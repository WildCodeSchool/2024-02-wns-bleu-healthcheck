import "./LogsModal.scss";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Log } from "@/common/models/Log.ts";
import {useEffect, useState} from "react";

interface LogModalProps {
  open: boolean;
  handleClose: () => void;
  urlName: string;
  logs: Log[] | null;
}


const LogsModal: React.FC<LogModalProps> = ({
  open,
  handleClose,
  urlName,
  logs,
}) => {

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Dialog open={open} onClose={handleClose} sx={{width: "100%"}}>
      <DialogTitle
        sx={{
          padding: {
            xs: '8px 16px',
            md: '16px 24px',
          },
        }}
        id="customized-dialog-title">
        {`Historique de la requête "${urlName}"`}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: {
            xs: '16px 8px',
            md: '16px 24px 16px 16px',
          },
        }}
      >
        <div className="logsmodal__wrapper">
          <div className="logsmodal__header">
            <span>Date</span>
            <span>Heure</span>
            <span>{isSmallScreen ? `Délai` : `Temps de réponse`}</span>
            <span>{isSmallScreen ? `Code` : `Code de retour`}</span>
            <span>{isSmallScreen ? `Msg` : `Message`}</span>
          </div>
          {logs &&
            logs.map((log: Log) => {
              const localeDate = new Date(log.date);
              return (
                <div
                  key={log._id}
                  className={`logsmodal__item ${
                    log.status === 2
                      ? "logsmodal__success"
                      : log.status === 1
                      ? "logsmodal__warning"
                      : "logsmodal__error"
                  }`}
                >
                  <span>{localeDate.toLocaleDateString("fr-FR")}</span>
                  <span>
                    {localeDate.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span>{log.response_time} ms</span>
                  <span>{log.status_code}</span>
                  <span>{log.status_message}</span>
                </div>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogsModal;
