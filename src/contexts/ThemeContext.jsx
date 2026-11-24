
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

import {
  ThemeProvider,
  CssBaseline,
} from "@mui/material";

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

        if (response?.data?.theme === "light" ||
            response?.data?.theme === "dark") {
          setMode(response.data.theme);
        }
      } catch (err) {
        console.error("Failed to load user theme:", err);
      }
    };

    loadUserTheme();
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const updateTheme = async (newMode) => {
    if (newMode !== "light" && newMode !== "dark") return;

    // Apply the theme immediately
    setMode(newMode);

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
  };

  return (
    <ThemeContext.Provider value={{ mode, updateTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useThemeContext must be used within a ThemeProviderWrapper"
    );
  }

  return context;
}
