import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import "./LoginModal.scss";
import { Link } from "react-router-dom";

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
        aria-describedby="modal-modal-form"
      >
        <Box className="login__modal-box">
          <h2 id="modal-modal-title" className="login__modal-title">
            Se connecter
          </h2>
          <div id="modal-modal-form" className="login__modal-form-container">
            <form className="login__modal-form">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
              <label htmlFor="password">Mot de passe</label>
              <input type="password" id="password" name="password" required />
              <Button type="submit" className="login__modal-form-button">
                Se connecter
              </Button>
            </form>
            <Link to="/register">
              <Button
                type="submit"
                className="login__modal-form-button"
                onClick={handleClose}
              >
                Créer un compte
              </Button>
            </Link>
          </div>
          <Button onClick={handleClose}>Fermer</Button>
        </Box>
      </Modal>
    </div>
  );
}
