import "./LogsModal.scss";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { UrlData } from "@/common/components/UrlCard/UrlCard.tsx";
import { Log } from "@/common/models/Log.ts";

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
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="customized-dialog-title">
        {`Historique de la requête "${urlName}"`}
      </DialogTitle>
      <DialogContent>
        <div className="logsmodal__wrapper">
          <div className="logsmodal__header">
            <span>Date</span>
            <span>Heure</span>
            <span>Temps de réponse</span>
            <span>Code de retour</span>
            <span>Message</span>
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
