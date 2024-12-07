import useAuth from "@/common/hooks/useAuth";
import "./HeaderMenu.scss";
import { Button } from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { LOGOUT } from "@/common/graphql/queries";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';


interface IHeaderMenu {
  handleOpen: () => void;
  handleClose: () => void;
}

const HeaderMenu = ({ handleOpen }: IHeaderMenu) => {
  const navigate = useNavigate();
  const [logout] = useLazyQuery(LOGOUT, {
    fetchPolicy: "no-cache",
    onCompleted: async () => {
      refetch();
      navigate("/");
    },
  });
  const { userInfos, refetch } = useAuth();

  return (
    <div className="header__menu">
      <div className="header__menu-item">
        {userInfos.isLoggedIn ? (
          <>
            {userInfos.role && userInfos.role < 1 && (
              <Button
                component={Link}
                to="/premium"
                className="header__menu-button"
              >
                <span>Premium</span>
                <StarBorderOutlinedIcon />
              </Button>
            )}
            <Button
              component={Link}
              to="/dashboard"
              className="header__menu-button"
            >
              <span>Dashboard</span>
              <MonitorHeartOutlinedIcon />
            </Button>
            <Button
              component={Link}
              to="/settings"
              className="header__menu-button"
            >
              <span>{userInfos.name}</span>
              <AccountCircleOutlinedIcon />
            </Button>
            <Button onClick={() => logout()} className="header__menu-button">
              <span>Logout</span>
              <LogoutOutlinedIcon />
            </Button>
          </>
        ) : (
          <Button onClick={handleOpen} className="header__menu-button">
            <span>Connexion</span>
            <AccountCircleOutlinedIcon />
          </Button>
        )}
      </div>
    </div>
  );
};

export default HeaderMenu;
