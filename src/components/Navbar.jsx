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

  if (isMobile) {
    return (
      <>
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#8C52FF",
          }}
        >
          <Toolbar>
            <Typography
              sx={{
                flexGrow: 1,
                color: "#7ED957",
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500,
                alignItems: "left",
              }}
            >
              WELCOME!
            </Typography>

            <IconButton sx={{ color: "#7ED957" }} onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              width: 250,
              display: "flex",
              flexDirection: "column",
              p: 2,
              gap: 2,
              backgroundColor: "#8C52FF",
              height: "100%",
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setOpen(false)}
                sx={{
                  color: "#7ED957",
                  fontFamily: '"Roboto", sans-serif',
                  fontWeight: 500,
                  justifyContent: "flex-start",
                  borderRadius: 1,

                  "&.active": {
                    backgroundColor: "#7ED957",
                    color: "#8C52FF",

                    "&:hover": {
                      backgroundColor: "#7ED957",
                    },
                  },
                }}
              >
                {item.label}
              </Button>
            ))}

            <IconButton
              component={NavLink}
              to="/login"
              onClick={() => setOpen(false)}
              sx={{
                alignSelf: "flex-start",
                color: "#7ED957",

                "&.active": {
                  backgroundColor: "#7ED957",
                  color: "#8C52FF",

                  "&:hover": {
                    backgroundColor: "#7ED957",
                  },
                },
              }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Drawer>
      </>
    );
  }

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#8C52FF",
      }}
    >
      <Toolbar>
        <Typography
          sx={{
            flexGrow: 1,
            color: "#7ED957",
            fontFamily: '"Roboto", sans-serif',
            fontWeight: 500,
          }}
        >
          WELCOME!
        </Typography>

        {navItems.map((item) => (
          <Button
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.path === "/"}
            sx={{
              color: "#7ED957",
              fontFamily: '"Roboto", sans-serif',
              fontWeight: 500,
              borderRadius: 1,
              px: 2,

              "&.active": {
                backgroundColor: "#7ED957",
                color: "#8C52FF",

                "&:hover": {
                  backgroundColor: "#7ED957",
                },
              },
            }}
          >
            {item.label}
          </Button>
        ))}
        <IconButton
          component={NavLink}
          to="/login"
          sx={{
            color: "#7ED957",

            "&.active": {
              backgroundColor: "#7ED957",
              color: "#8C52FF",
            },
          }}
        >
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
