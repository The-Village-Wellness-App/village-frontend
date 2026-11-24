
import { useThemeContext } from "../contexts/ThemeContext";

import lightLogo from "../assets/banner-light.webp";
import darkLogo from "../assets/banner-dark.webp";

function Header() {
  const { mode } = useThemeContext();

  const logo = mode === "dark" ? darkLogo : lightLogo;

  return (
    <header>
      <img
        src={logo}
        alt="The Village Wellness App Logo"
        style={{
          display: "block",
          width: "100%",
          maxWidth: "1126px",
          height: "auto",
          maxHeight: "440px",
          objectFit: "contain",
          margin: "0 auto",
        }}
      />
    </header>
  );
}

export default Header;
