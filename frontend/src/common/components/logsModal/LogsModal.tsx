import "./LogsModal.scss"
import {Modal} from "@mui/material";
import {UrlData} from "@/common/components/UrlCard/UrlCard.tsx";

interface LogModalProps {
    open: boolean;
    handleClose: () => void;
    urlData: UrlData | null;
}

const LogsModal: React.FC<LogModalProps> = ({open, handleClose, urlData}) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <div>{urlData?.name}</div>
        </Modal>
    );
};

export default LogsModal;
