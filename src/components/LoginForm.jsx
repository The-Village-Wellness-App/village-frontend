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
import { loginUser } from "../services/api";

export default function LoginForm({ onSwitchToRegister, onForgotPassword, onAuthSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      localStorage.setItem("authToken", response.result);
      onAuthSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Signing in..." : "Log in"}
        </Button>

        <Typography variant="body2" textAlign="center">
          <Link component="button" type="button" onClick={onForgotPassword}>
            Forgot password?
          </Link>
        </Typography>

        <Typography variant="body2" textAlign="center">
          Need an account? {" "}
          <Link component="button" type="button" onClick={onSwitchToRegister}>
            Register
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}
