import { useMediaQuery } from "@mui/material";

import lightLogo from "../assets/banner-light.webp";
import darkLogo from "../assets/banner-dark.webp";

function Header() {
  const prefersDarkMode = useMediaQuery(
    "(prefers-color-scheme: dark)"
  );

  const logo = prefersDarkMode
    ? darkLogo
    : lightLogo;

  console.log("Browser prefers dark:", prefersDarkMode);

  return (
    <header>
      <img
        src={logo}
        alt="The Village Wellness App Logo"
        height="350"
      />
    </header>
  );
}

export default Header;