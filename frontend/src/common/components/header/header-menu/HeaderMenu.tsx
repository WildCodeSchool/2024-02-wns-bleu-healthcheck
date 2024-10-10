import useAuth from "@/common/hooks/useAuth";
import "./HeaderMenu.scss";
import { Button } from "@mui/material"
import { AiOutlineUser } from "react-icons/ai"
import { TbActivityHeartbeat, TbStar } from "react-icons/tb";
import { IoIosLogOut } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { LOGOUT } from "@/common/graphql/queries";

interface IHeaderMenu {
  handleOpen: () => void;
  handleClose: () => void;
}

const HeaderMenu = ({ handleOpen }: IHeaderMenu) => {

  const navigate = useNavigate();
  const [logout] = useLazyQuery(LOGOUT, {
    fetchPolicy: 'no-cache',
    onCompleted: async () => {
      refetch();
      navigate("/");
    }
  });
  const { userInfos, refetch } = useAuth();

  return (
    <div className="header__menu">
      <div className="header__menu-item">
        {userInfos.isLoggedIn
          ? (
            <>
              {userInfos.role && userInfos.role < 1 && (
                  <Button component={Link} to="/premium" className="header__menu-button">
                    <span>Premium</span>
                    <TbStar className="header__menu-icon" size={20} />
                  </Button>
                )
              }
              <Button component={Link} to="/dashboard" className="header__menu-button">
                <span>Dashboard</span>
                <TbActivityHeartbeat className="header__menu-icon" size={20} />
              </Button>
              <Button component={Link} to="/settings"  className="header__menu-button">
                <span>{userInfos.name}</span>
                <AiOutlineUser className="header__menu-icon" size={20} />
              </ Button>
              <Button onClick={() => logout()} className="header__menu-button">
                <span>Logout</span>
                <IoIosLogOut className="header__menu-icon" size={20} />
              </Button>
            </>
          )
            : (
              <Button onClick={handleOpen} className="header__menu-button">
              <span>Connexion</span>
              <AiOutlineUser className="header__menu-icon" size={20} />
            </Button>
          )}
      </div>
    </div>
  )
}

export default HeaderMenu
