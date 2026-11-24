
import { createTheme } from "@mui/material/styles";

const headingStyle = {
  fontFamily: '"Roboto", sans-serif',
  fontWeight: 500,
};

export default function createAppTheme(mode = "light") {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,

      primary: {
        main: isDark ? "#A78BFA" : "#8C52FF",
        contrastText: "#FFFFFF",
      },

      secondary: {
        main: "#7ED957",
        contrastText: "#142B4A",
      },

      background: {
        default: isDark ? "#101827" : "#F5F6FA",
        paper: isDark ? "#1C293B" : "#FFFFFF",
      },

      text: {
        primary: isDark ? "#F1F3F8" : "#142B4A",
        secondary: isDark ? "#B0BAC9" : "#64748B",
      },

      divider: isDark ? "#35445A" : "#E2E8F0",

      success: {
        main: "#7ED957",
      },
    },

    typography: {
      fontFamily: '"Roboto Condensed", sans-serif',

      h1: headingStyle,
      h2: headingStyle,
      h3: headingStyle,
      h4: headingStyle,
      h5: headingStyle,
      h6: headingStyle,

      body1: {
        color: "text.primary",
      },

      body2: {
        color: "text.secondary",
      },
    },

    shape: {
      borderRadius: 10,
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            minHeight: "100%",
          },

          body: {
            minHeight: "100vh",
            backgroundColor: isDark ? "#101827" : "#F5F6FA",
            color: isDark ? "#F1F3F8" : "#142B4A",
            transition: "background-color 0.2s ease, color 0.2s ease",
          },

          "#root": {
            minHeight: "100vh",
            backgroundColor: isDark ? "#101827" : "#F5F6FA",
          },

          "*": {
            boxSizing: "border-box",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "#1C293B" : "#FFFFFF",
            color: isDark ? "#F1F3F8" : "#142B4A",
            border: `1px solid ${isDark ? "#35445A" : "#E2E8F0"}`,
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "#1C293B" : "#FFFFFF",
            color: isDark ? "#F1F3F8" : "#142B4A",
            backgroundImage: "none",
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: isDark ? "#F1F3F8" : "#142B4A",

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark ? "#526179" : "#CBD5E1",
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark ? "#A78BFA" : "#8C52FF",
            },
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: isDark ? "#B0BAC9" : "#64748B",
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isDark ? "#35445A" : "#E2E8F0",
          },
        },
      },
    },
  });
}
