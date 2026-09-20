import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { zodResolver } from "@hookform/resolvers/zod";
import { useColorScheme } from "@mui/material/styles";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { LOCAL_STORAGE } from "@/const";
import { login } from "../auth.api";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { mode, setMode } = useColorScheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: true,
    },
  });

  const toggleTheme = () => {
    if (!mode) return;

    setMode(mode === "light" ? "dark" : "light");
  };

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);

    try {
      const res = await login(data);

      if (res?.accessToken) {
        localStorage.clear();
        localStorage.setItem(LOCAL_STORAGE.ACCESS_KEY, res.accessToken);

        toast.success("Logged in successfully!");

        navigate({ to: "/" });
      } else {
        toast.error("Login failed.");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred while logging in.";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        px: 2,
        py: 4,
        bgcolor: "background.default",
      }}
    >
      {/* Theme toggle */}
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label="Toggle theme"
        data-cy="theme-toggle"
        sx={{
          position: "absolute",
          top: 20,
          right: {
            xs: 16,
            sm: 24,
          },
        }}
      >
        {mode === "light" ? <DarkMode /> : <LightMode />}
      </IconButton>

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 430,
          p: {
            xs: 3,
            sm: 5,
          },
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 20px 60px rgba(0, 0, 0, 0.08)"
              : "0 20px 60px rgba(0, 0, 0, 0.35)",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2.5,
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src="/logo.jpg"
              alt="Logo"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          <Typography
            variant="h5"
            component="h1"
            fontWeight={700}
            textAlign="center"
          >
            Welcome back
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 0.75 }}
          >
            Sign in to access your dashboard
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          data-cy="login-form"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Username */}
            <TextField
              label="Username"
              placeholder="Enter your username"
              fullWidth
              autoComplete="username"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  "data-cy": "username-input",
                },
                formHelperText: {
                  "data-cy": "username-input-error",
                },
              }}
            />

            {/* Password */}
            <TextField
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              fullWidth
              autoComplete="current-password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        data-cy="toggle-password-visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  "data-cy": "password-input",
                },
                formHelperText: {
                  "data-cy": "password-input-error",
                },
              }}
            />

            {/* Remember + Forgot */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                mt: -0.5,
              }}
            >
              <FormControlLabel
                sx={{ m: 0 }}
                control={
                  <Checkbox
                    {...register("remember")}
                    data-cy="remember-checkbox"
                  />
                }
                label={<Typography variant="body2">Remember me</Typography>}
              />

              <Link
                href="#"
                underline="hover"
                color="secondary.main"
                data-cy="forgot-password-link"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                Forgot password?
              </Link>
            </Box>

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              disabled={loading}
              loading={loading}
              data-cy="login-submit"
              sx={{
                mt: 1,
                minHeight: 48,
                borderRadius: 1.5,
                fontWeight: 700,
              }}
            >
              {loading ? "Signing In..." : "SIGN IN"}
            </Button>
          </Box>
        </Box>

        {/* Footer */}
        <Typography
          variant="caption"
          color="text.secondary"
          textAlign="center"
          display="block"
          sx={{ mt: 4 }}
        >
          Preventive Maintenance Dashboard
        </Typography>
      </Paper>
    </Box>
  );
}
