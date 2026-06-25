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
import { registerUser } from "../services/api";

export default function RegisterForm({ onSwitchToLogin, onAuthSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
      setError("Username, email, and password are required.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      localStorage.setItem("authToken", response.result);
      setSuccess(response.message || "Account created successfully.");
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
        {success && <Alert severity="success">{success}</Alert>}

        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

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
          {loading ? "Creating account..." : "Create account"}
        </Button>

        <Typography variant="body2" textAlign="center">
          Already have an account? {" "}
          <Link component="button" type="button" onClick={onSwitchToLogin}>
            Log in
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}
