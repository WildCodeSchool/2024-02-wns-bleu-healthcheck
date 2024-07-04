import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import "./LoginModal.scss";

interface LoginModalProps {
  open: boolean;
  handleClose: () => void;
}

export default function LoginModal({ open, handleClose }: LoginModalProps) {
  return (
    <div className="login__modal">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="login__modal-box">
          <h2 id="modal-modal-title">Text in a modal</h2>
          <p id="modal-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
}
