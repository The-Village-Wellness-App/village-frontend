import { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import createAppTheme from "../theme";
import { fetchData } from "../services/api";

const ThemeContext = createContext();

export function ThemeProviderWrapper({ children }) {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const loadUserTheme = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const response = await fetchData(`/users/${payload.userId}`);
        if (response?.data?.theme) {
          setMode(response.data.theme);
        }
      } catch (err) {
        console.error("Failed to load user theme:", err);
      }
    };

    loadUserTheme();
  }, []);

  const theme = createAppTheme(mode);

  const updateTheme = async (newMode) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        await fetchData(`/users/${payload.userId}`, {
          method: "PATCH",
          body: JSON.stringify({ theme: newMode }),
        });
      } catch (err) {
        console.error("Failed to update theme:", err);
      }
    }

    setMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, updateTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProviderWrapper");
  }
  return context;
}
