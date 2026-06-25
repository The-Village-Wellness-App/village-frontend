import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./fonts.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProviderWrapper } from "./contexts/ThemeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProviderWrapper>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProviderWrapper>
  </StrictMode>,
);
