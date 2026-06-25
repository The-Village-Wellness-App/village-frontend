import { createTheme } from "@mui/material/styles";

const headingStyle = {
  fontFamily: '"Roboto", sans-serif',
  fontWeight: 500,
};

export default function createAppTheme(mode = "light") {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#8C52FF",
      },
      secondary: {
        main: "#7ED957",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#F2FFE2",
        paper: mode === "dark" ? "#1e1e1e" : "#fff",
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
    },
  });
}
