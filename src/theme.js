import { createTheme } from "@mui/material/styles";

const headingStyle = {
  fontFamily: '"Roboto", sans-serif',
  fontWeight: 500,
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#8C52FF",
    },
    secondary: {
      main: "#7ED957",
    },
    background: {
      default: "#F2FFE2",
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

export default theme;
