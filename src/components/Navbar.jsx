
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Mood", path: "/mood" },
    { label: "Pain", path: "/pain" },
    { label: "Events", path: "/event" },
    { label: "Graphs & Reports", path: "/graphs" },
  ];

  const navButtonStyles = {
    color: "secondary.main",
    fontFamily: '"Roboto", sans-serif',
    fontWeight: 500,
    borderRadius: 1,
    px: 2,

    "&:hover": {
      backgroundColor: "rgba(126, 217, 87, 0.15)",
    },

    "&.active": {
      backgroundColor: "secondary.main",
      color: "#142B4A",

      "&:hover": {
        backgroundColor: "secondary.main",
      },
    },
  };

  const accountButtonStyles = {
    color: "secondary.main",

    "&:hover": {
      backgroundColor: "rgba(126, 217, 87, 0.15)",
    },

    "&.active": {
      backgroundColor: "secondary.main",
      color: "#142B4A",
    },
  };

  // Render navigation links without creating nested components.
  const renderNavigationLinks = (onNavigate) => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.path}
          component={NavLink}
          to={item.path}
          end={item.path === "/"}
          onClick={onNavigate}
          sx={{
            ...navButtonStyles,
            justifyContent: "flex-start",
          }}
        >
          {item.label}
        </Button>
      ))}

      <IconButton
        component={NavLink}
        to="/login"
        onClick={onNavigate}
        sx={accountButtonStyles}
        aria-label="Account and theme settings"
      >
        <AccountCircleIcon />
      </IconButton>
    </>
  );

  if (isMobile) {
    return (
      <>
        <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
          <Toolbar>
            <Typography
              sx={{
                flexGrow: 1,
                color: "secondary.main",
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500,
              }}
            >
              WELCOME!
            </Typography>

            <IconButton
              sx={{ color: "secondary.main" }}
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          anchor="right"
          open={open}
          onClose={() => setOpen(false)}
        >
          <Box
            sx={{
              width: 250,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 2,
              bgcolor: "background.paper",
            }}
          >
            {renderNavigationLinks(() => setOpen(false))}
          </Box>
        </Drawer>
      </>
    );
  }

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
      <Toolbar>
        <Typography
          sx={{
            flexGrow: 1,
            color: "secondary.main",
            fontFamily: '"Roboto", sans-serif',
            fontWeight: 500,
          }}
        >
          WELCOME!
        </Typography>

        {renderNavigationLinks()}
      </Toolbar>
    </AppBar>
  );
}
