import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import { useThemeContext } from "../contexts/ThemeContext";

export default function LoginPage() {
  const [view, setView] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusSeverity, setStatusSeverity] = useState("success");
  const { mode, updateTheme } = useThemeContext();

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem("authToken")));
  }, []);

  const handleAuthSuccess = () => {
    setStatusMessage("Authentication successful.");
    setStatusSeverity("success");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setView("login");
    setStatusMessage("You have been logged out.");
    setStatusSeverity("info");
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography variant="h4" component="h1" gutterBottom>
                {isAuthenticated ? "Welcome back" : view === "forgot" ? "Reset password" : view === "register" ? "Create account" : "Sign in"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {isAuthenticated
                  ? "You are signed in and can continue using the app."
                  : view === "forgot"
                    ? "Enter your email to receive a reset token."
                    : view === "register"
                      ? "Create an account to start tracking your mood and wellbeing."
                      : "Use your account to access your dashboard and health tracking."}
              </Typography>
            </Box>

            {statusMessage && (
              <Alert severity={statusSeverity}>{statusMessage}</Alert>
            )}

            {isAuthenticated ? (
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Current theme: {mode === "dark" ? "Dark" : "Light"}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant={mode === "light" ? "contained" : "outlined"}
                    onClick={() => updateTheme("light")}
                  >
                    Light
                  </Button>
                  <Button
                    variant={mode === "dark" ? "contained" : "outlined"}
                    onClick={() => updateTheme("dark")}
                  >
                    Dark
                  </Button>
                </Stack>
                <Button variant="contained" color="error" onClick={handleLogout}>
                  Log out
                </Button>
              </Stack>
            ) : view === "forgot" ? (
              <ForgotPasswordForm
                onBackToLogin={() => setView("login")}
                onStatus={(message, severity = "success") => {
                  setStatusMessage(message);
                  setStatusSeverity(severity);
                }}
              />
            ) : view === "register" ? (
              <RegisterForm
                onSwitchToLogin={() => setView("login")}
                onAuthSuccess={handleAuthSuccess}
              />
            ) : (
              <LoginForm
                onSwitchToRegister={() => setView("register")}
                onForgotPassword={() => setView("forgot")}
                onAuthSuccess={handleAuthSuccess}
              />
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
