import uraliveLogo from "@assets/uralive-logo.png";
import "./Header.scss";
import { AiOutlineUser } from "react-icons/ai";
import Button from "@mui/material/Button";
import { useState } from "react";
import LoginModal from "../loginModal/LoginModal";

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const handleOpen = () => setIsLoginModalOpen(true);
  const handleClose = () => setIsLoginModalOpen(false);

  console.log("isLoginModalOpen", isLoginModalOpen);

  return (
    <>
      <LoginModal open={isLoginModalOpen} handleClose={handleClose} />
      <header className="navbar">
        {/* TODO: Add a link to the home page */}
        <div className="navbar__logo">
          <img src={uraliveLogo} className="navbar__logo-img" alt="Uralive" />
          <div className="navbar__logo-txt">
            UR<span className="navbar__green">a</span>L
            <span className="navbar__green">ive</span>
          </div>
        </div>
        {/* Prévoir un composant menu qui s'adapte en fonction de la connexion utilisateur (ou pas) */}
        <div className="navbar__menu">
          <div className="navbar__menu-item">
            <Button onClick={handleOpen}>Login</Button>
            <AiOutlineUser className="navbar__icon" size={20} />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
