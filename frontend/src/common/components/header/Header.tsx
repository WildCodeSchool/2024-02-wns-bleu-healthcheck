import uraliveLogo from '@assets/uralive-logo.png';
import './Header.scss';
import { AiOutlineUser } from "react-icons/ai";
import { Link, Outlet } from 'react-router-dom';

const Header = () => {
  return (
    <>
      <header className="navbar">
        {/* TODO: Add a link to the home page */}
        <Link to="/" className="navbar__logo">
          <img src={uraliveLogo} className="navbar__logo-img" alt="Uralive" />
          <div className="navbar__logo-txt">
            UR<span className="navbar__green">a</span>L<span className="navbar__green">ive</span>
          </div>
        </Link>
        {/* Prévoir un composant menu qui s'adapte en fonction de la connexion utilisateur (ou pas) */}
        <div className="navbar__menu">
          <div className="navbar__menu-item">
            <span>
              Login
            </span>
            <AiOutlineUser className="navbar__icon" size={20} />
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
}

export default Header;