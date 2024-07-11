import useAuth from "@/common/hooks/useAuth";
import "./HeaderMenu.scss";
import { Button } from "@mui/material"
import { AiOutlineUser } from "react-icons/ai"
import { TbActivityHeartbeat } from "react-icons/tb";
import { IoIosLogOut } from "react-icons/io";

interface IHeaderMenu {
  handleOpen: () => void;
  handleClose: () => void;
}

const HeaderMenu = ({ handleOpen }: IHeaderMenu) => {

  const { userInfos } = useAuth();

  return (
    <div className="header__menu">
      <div className="header__menu-item">
        {userInfos.isLoggedIn
          ? (
            <>
              <span>Bienvenue, {userInfos.name}</span>
              <TbActivityHeartbeat className="header__menu-icon" />
              <IoIosLogOut className="header__menu-icon" />
            </>
          )
          : (
            <Button onClick={handleOpen} className="header__menu-button">
              <span>Login</span>
              <AiOutlineUser className="header__menu-icon" size={20} />
            </Button>
          )}
      </div>
    </div>
  )
}

export default HeaderMenu