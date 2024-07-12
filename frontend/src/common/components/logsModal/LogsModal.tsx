import "./LogsModal.scss"
import {CircularProgress, Dialog, DialogContent, DialogTitle} from "@mui/material";
import {UrlData} from "@/common/components/UrlCard/UrlCard.tsx";
import {useQuery} from "@apollo/client";
import {GET_LOGS} from "@/common/graphql/queries.ts";

interface LogModalProps {
    open: boolean;
    handleClose: () => void;
    urlData: UrlData | null;
}

interface Log {
    _id: string;
    date: string;
    response_time: number;
    status: number;
    status_code: number;
    status_message: string;
}

const LogsModal: React.FC<LogModalProps> = ({open, handleClose, urlData}) => {

    const {data, loading, error} = useQuery(GET_LOGS, {
        variables: {savedQueryId: urlData?._id},
        skip: !urlData?._id,
    });

    if (!urlData) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle id="customized-dialog-title">
                {`Historique de la requête "${urlData?.name}"`}
            </DialogTitle>
            <DialogContent>
                {loading && <CircularProgress />}
                {error && <p>Error: {error.message}</p>}
                <div className="logsmodal__wrapper">
                    <div className="logsmodal__header">
                        <span>Date</span>
                        <span>Heure</span>
                        <span>Temps de réponse</span>
                        <span>Code de retour</span>
                        <span>Message</span>
                    </div>
                    {data && data.getLogsForSavedQuery && (
                        data.getLogsForSavedQuery.map((log: Log) => (
                            <div key={log._id} className={`logsmodal__item ${log.status === 2 ? "logsmodal__success" : log.status === 1 ? "logsmodal__warning" : "logsmodal__error"}`}>
                                <span>{log.date.substring(0,10)}</span>
                                <span>{log.date.substring(11,16)}</span>
                                <span>{log.response_time} ms</span>
                                <span>{log.status_code}</span>
                                <span>{log.status_message}</span>
                            </div>
                        ))
                    )}
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default LogsModal;
