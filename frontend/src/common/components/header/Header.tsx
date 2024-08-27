import uraliveLogo from "@assets/uralive-logo.png";
import "./Header.scss";
import { useState } from "react";
import LoginModal from "../loginModal/LoginModal";
import { Link } from "react-router-dom";
import HeaderMenu from "./header-menu/HeaderMenu";

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const handleOpen = () => setIsLoginModalOpen(true);
  const handleClose = () => setIsLoginModalOpen(false);

  return (
    <>
      <LoginModal open={isLoginModalOpen} handleClose={handleClose} />
      <header className="navbar">
        <Link to="/" className="navbar__logo">
          <img src={uraliveLogo} className="navbar__logo-img" alt="Uralive" />
          <div className="navbar__logo-txt">
            UR<span className="navbar__green">a</span>L
            <span className="navbar__green">ive</span>
          </div>
        </Link>
        <HeaderMenu handleOpen={handleOpen} handleClose={handleClose} />
      </header>
    </>
  );
};

export default Header;
