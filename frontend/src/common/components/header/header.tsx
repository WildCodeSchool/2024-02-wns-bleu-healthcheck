import uraliveLogo from '@assets/uralive-logo.png';
import styles from './header.module.scss';
import { useState } from 'react';
import { AiOutlineUser } from "react-icons/ai";

const Header = () => {
  const { userLoggedIn, setUserLoggedIn } = useState(false);
  return (
    <header className={styles["navbar"]}>
      {/* TODO: Add a link to the home page */}
      <div className={styles["logo"]}>
        <img src={uraliveLogo} className={styles["logo-img"]} alt="Uralive" />
        <div className={styles["logo-txt"]}>UR<span className={styles["green"]}>a</span>L<span className={styles["green"]}>ive</span></div>
      </div>
      {/* Prévoir un composant menu qui s'adapte en fonction de la connexion utilisateur (ou pas) */}
      <div className={styles["menu"]}>
        <div className={styles["menu-item"]}>
          <span>
            Login
          </span>
          <AiOutlineUser className={styles["icon"]} size={20} />
        </div>
      </div>
    </header>
  );
}

export default Header;