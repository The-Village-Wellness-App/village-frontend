import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { forgotPassword, resetPassword } from "../services/api";

export default function ForgotPasswordForm({ onBackToLogin, onStatus }) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showReset, setShowReset] = useState(false);

  const handleRequestReset = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPassword(email.trim());
      const message = response?.message || "Reset instructions were sent.";
      setSuccess(message);
      setShowReset(true);
      onStatus(message);
      if (response?.resetToken) {
        setToken(response.resetToken);
      }
    } catch (err) {
      setError(err.message);
      onStatus(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token.trim()) {
      setError("Please enter the reset token.");
      return;
    }

    if (!password.trim() || password.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword({ token: token.trim(), password });
      const message = response?.message || "Password reset successfully.";
      setSuccess(message);
      onStatus(message, "success");
    } catch (err) {
      setError(err.message);
      onStatus(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={showReset ? handleResetPassword : handleRequestReset}>
      <Stack spacing={2}>
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success">
            {success}
          </Alert>
        )}

        {!showReset ? (
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        ) : (
          <>
            <TextField
              fullWidth
              label="Reset Token"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              required
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </>
        )}

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Please wait..." : showReset ? "Reset password" : "Send reset link"}
        </Button>

        <Typography variant="body2" textAlign="center">
          <Link component="button" type="button" onClick={onBackToLogin}>
            Back to login
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}
