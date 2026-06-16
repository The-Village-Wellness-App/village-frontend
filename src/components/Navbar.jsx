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
import { useState } from "react";

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);

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
            <Typography sx={{ flexGrow: 1, color: "#7ED957" }}>
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
              padding: 2,
              gap: 2,
              backgroundColor: "#8C52FF",
            }}
          >
            <Button
              onClick={() => setOpen(false)}
              sx={{
                color: "#7ED957",
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500,
              }}
            >
              Home
            </Button>
            <Button
              onClick={() => setOpen(false)}
              sx={{
                color: "#7ED957",
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500,
              }}
            >
              Dashboard
            </Button>
            <Button
              onClick={() => setOpen(false)}
              sx={{
                color: "#7ED957",
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500,
              }}
            >
              Mood
            </Button>
            <Button
              onClick={() => setOpen(false)}
              sx={{
                color: "#7ED957",
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500,
              }}
            >
              Pain
            </Button>
            <Button
              onClick={() => setOpen(false)}
              sx={{
                color: "#7ED957",
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500,
              }}
            >
              Events
            </Button>
            <Button
              onClick={() => setOpen(false)}
              sx={{
                color: "#7ED957",
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500,
              }}
            >
              Graphs & Reports
            </Button>
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
            textAlign: "left",
            fontFamily: '"Roboto", sans-serif',
            fontWeight: 500,
          }}
        >
          WELCOME!
        </Typography>

        <Button
          sx={{
            color: "#7ED957",
            fontFamily: '"Roboto", sans-serif',
            fontWeight: 500,
          }}
        >
          Home
        </Button>
        <Button
          sx={{
            color: "#7ED957",
            fontFamily: '"Roboto", sans-serif',
            fontWeight: 500,
          }}
        >
          Dashboard
        </Button>
        <Button
          sx={{
            color: "#7ED957",
            fontFamily: '"Roboto", sans-serif',
            fontWeight: 500,
          }}
        >
          Mood
        </Button>
        <Button
          sx={{
            color: "#7ED957",
            fontFamily: '"Roboto", sans-serif',
            fontWeight: 500,
          }}
        >
          Pain
        </Button>
        <Button
          sx={{
            color: "#7ED957",
            fontFamily: '"Roboto", sans-serif',
            fontWeight: 500,
          }}
        >
          Events
        </Button>
        <Button
          sx={{
            color: "#7ED957",
            fontFamily: '"Roboto", sans-serif',
            fontWeight: 500,
          }}
        >
          Graphs & Reports
        </Button>
      </Toolbar>
    </AppBar>
  );
}
