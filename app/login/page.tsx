"use client";
import React, { useState } from "react";
import {
  Box, Typography, Button, Card, TextField, Link, Divider,
  IconButton, Container, useTheme, useMediaQuery
} from "@mui/material";
import {
  Visibility, VisibilityOff, Facebook, Google, WhatsApp
} from "@mui/icons-material";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";
// import API from "../../utils/apiService"; // Uncomment and implement API logic in actual app
import { useRouter } from "next/navigation";

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Replace this with real authentication logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      // Example: const response = await API.login(formData);
      // localStorage.setItem("authToken", response.data.token);
      // localStorage.setItem("user", JSON.stringify(response.data.user));
      router.push("/");
    } catch (err: any) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome Back
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Login to your account to continue shopping
        </Typography>
      </Box>
      <Card sx={{
        p: isMobile ? 3 : 4,
        borderRadius: 2,
        boxShadow: 3
      }}>
        {error && (
          <Box sx={{ mb: 3 }}>
            <ErrorAlert error={error} onClose={() => setError("")} />
          </Box>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Link href="/forgot-password" variant="body2">
              Forgot Password?
            </Link>
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ py: 1.5, mb: 2, borderRadius: "50px" }}
          >
            {loading ? <LoadingSpinner size={24} /> : "Login"}
          </Button>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Typography variant="body2">
              Don&apos;t have an account?{" "}
              <Link href="/register" fontWeight={600}>
                Sign up
              </Link>
            </Typography>
          </Box>
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR LOGIN WITH
            </Typography>
          </Divider>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
            <IconButton sx={{ border: "1px solid #ddd", borderRadius: "50%", p: 2 }}>
              <Facebook color="primary" />
            </IconButton>
            <IconButton sx={{ border: "1px solid #ddd", borderRadius: "50%", p: 2 }}>
              <Google color="error" />
            </IconButton>
            <IconButton
              sx={{ border: "1px solid #ddd", borderRadius: "50%", p: 2 }}
              href="https://wa.me/254XXXXXXXXX"
              target="_blank"
            >
              <WhatsApp color="success" />
            </IconButton>
          </Box>
        </form>
      </Card>
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          By logging in, you agree to our{" "}
          <Link href="/terms" fontWeight={600}>Terms of Service</Link>{" "}
          and{" "}
          <Link href="/privacy" fontWeight={600}>Privacy Policy</Link>
        </Typography>
      </Box>
    </Container>
  );
}