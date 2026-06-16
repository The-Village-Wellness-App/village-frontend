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
import { Link } from "react-router-dom";

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
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
                component={Link}
                to={item.path}
                onClick={() => setOpen(false)}
                sx={{
                  color: "#7ED957",
                  fontFamily: '"Roboto", sans-serif',
                  fontWeight: 500,
                  justifyContent: "flex-start",
                }}
              >
                {item.label}
              </Button>
            ))}
            <IconButton component={Link} to="/login" sx={{ color: "#7ED957" }}>
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
            component={Link}
            to={item.path}
            sx={{
              color: "#7ED957",
              fontFamily: '"Roboto", sans-serif',
              fontWeight: 500,
            }}
          >
            {item.label}
          </Button>
        ))}
        <IconButton component={Link} to="/login" sx={{ color: "#7ED957" }}>
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
