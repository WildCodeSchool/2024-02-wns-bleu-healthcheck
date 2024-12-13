import useAuth from "@/common/hooks/useAuth";
import "./HeaderMenu.scss";
import {Button, IconButton, SwipeableDrawer} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

import { Link, useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { LOGOUT } from "@/common/graphql/queries";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";


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

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [sidebarDisplayed, setSidebarDisplayed] = useState(false);
  const toggleDrawer = (open: boolean) => {
    setSidebarDisplayed(open);
  };

  return isSmallScreen ?
    (
      <>
        <div onClick={() => toggleDrawer(true)}>
          <IconButton>
            <MenuIcon/>
          </IconButton>
        </div>
        <SwipeableDrawer
          anchor='right'
          open={sidebarDisplayed}
          onClose={() => toggleDrawer(false)}
          onOpen={() => toggleDrawer(true)}
        >
          <Box sx={{ width: 200 }} role="presentation" onClick={() => toggleDrawer(false)}>
            {userInfos.isLoggedIn ? (
              <div className="header__drawer-container">
                {userInfos.role && userInfos.role < 1 && (
                  <Button
                    component={Link}
                    to="/premium"
                    className="header__drawer-button"
                  >
                    <span>Premium</span>
                    <StarBorderOutlinedIcon />
                  </Button>
                )}
                <Button
                  component={Link}
                  to="/dashboard"
                  className="header__drawer-button"
                >
                  <span>Dashboard</span>
                  <MonitorHeartOutlinedIcon />
                </Button>
                <Button
                  component={Link}
                  to="/settings"
                  className="header__drawer-button"
                >
                  <span>{userInfos.name}</span>
                  <AccountCircleOutlinedIcon />
                </Button>
                <Button onClick={() => logout()} className="header__drawer-button">
                  <span>Logout</span>
                  <LogoutOutlinedIcon />
                </Button>
              </div>
            ) : (
              <div className="header__drawer-container">
                <Button onClick={handleOpen} className="header__drawer-button">
                  <span>Connexion</span>
                  <AccountCircleOutlinedIcon />
                </Button>
              </div>
            )}
          </Box>
        </SwipeableDrawer>
      </>
    )
    :
    (
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
                  <StarBorderOutlinedIcon/>
                </Button>
              )}
              <Button
                component={Link}
                to="/dashboard"
                className="header__menu-button"
              >
                <span>Dashboard</span>
                <MonitorHeartOutlinedIcon/>
              </Button>
              <Button
                component={Link}
                to="/settings"
                className="header__menu-button"
              >
                <span>{userInfos.name}</span>
                <AccountCircleOutlinedIcon/>
              </Button>
              <Button onClick={() => logout()} className="header__menu-button">
                <span>Logout</span>
                <LogoutOutlinedIcon/>
              </Button>
            </>
          ) : (
            <Button onClick={handleOpen} className="header__menu-button">
              <span>Connexion</span>
              <AccountCircleOutlinedIcon/>
            </Button>
          )}
        </div>
      </div>
    )
};

export default HeaderMenu;
