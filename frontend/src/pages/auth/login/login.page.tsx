import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Logo from "@/assets/images/logo.jpg";

// تصاویر گالری
import TowerImage1 from "@/assets/images/gallery/DJI_0493.jpg";
import TowerImage2 from "@/assets/images/gallery/DJI_0494.jpg";
import TowerImage3 from "@/assets/images/gallery/DJI_0501.jpg";
import TowerImage4 from "@/assets/images/gallery/IPC08929.jpg";
import TowerImage5 from "@/assets/images/gallery/IPC08955.jpg";
import TowerImage6 from "@/assets/images/gallery/IPC08979.jpg";
import TowerImage7 from "@/assets/images/gallery/IPC08993.jpg";
import TowerImage8 from "@/assets/images/gallery/IPC09010.jpg";
import TowerImage9 from "@/assets/images/gallery/IPC09019.jpg";
import TowerImage10 from "@/assets/images/gallery/IPC09027.jpg";

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

import { useColorScheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { LOCAL_STORAGE } from "@/const";
import { login } from "../auth.api";
import { isEmpty } from "lodash-es";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean(),
});

type LoginForm = z.infer<typeof loginSchema>;

const galleryImages = [
  {
    src: TowerImage1,
    title: "Preventive Maintenance",
    description:
      "Maintain your assets, reduce downtime, and keep your operations running efficiently.",
  },
  {
    src: TowerImage9,
    title: "Efficient Workflow",
    description:
      "Streamline maintenance processes and keep your team focused on what matters most.",
  },
  {
    src: TowerImage3,
    title: "Reliable Operations",
    description:
      "Plan, manage, and optimize your maintenance processes from one central platform.",
  },
  {
    src: TowerImage4,
    title: "Asset Management",
    description:
      "Keep track of your assets and ensure every maintenance activity is properly managed.",
  },
  {
    src: TowerImage5,
    title: "Smart Planning",
    description:
      "Plan maintenance activities efficiently and stay ahead of potential operational issues.",
  },
  {
    src: TowerImage6,
    title: "Operational Excellence",
    description:
      "Improve reliability and maintain high standards across your maintenance operations.",
  },
  {
    src: TowerImage2,
    title: "Monitor Your Assets",
    description:
      "Track maintenance activities and stay informed about your operational status.",
  },
  {
    src: TowerImage7,
    title: "Performance Monitoring",
    description:
      "Monitor asset performance and identify maintenance requirements before they become critical.",
  },
  {
    src: TowerImage8,
    title: "Maintenance Insights",
    description:
      "Access the information you need to make informed maintenance and operational decisions.",
  },

  {
    src: TowerImage10,
    title: "Built for Reliability",
    description:
      "Create a more reliable operation with a centralized approach to preventive maintenance.",
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

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

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % galleryImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_KEY);

    if (token) navigate({ to: "/" });
  }, []);

  const toggleTheme = () => {
    if (!mode) return;

    setMode(mode === "light" ? "dark" : "light");
  };

  const handlePreviousSlide = () => {
    setActiveSlide(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % galleryImages.length);
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
        bgcolor: "background.default",
      }}
    >
      {/* ================= Gallery Section ================= */}
      <Box
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
          width: {
            md: "65%",
            lg: "65%",
          },
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
        }}
      >
        {/* Images */}
        {galleryImages.map((image, index) => (
          <Box
            key={image.title}
            component="img"
            src={image.src}
            alt={image.title}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: activeSlide === index ? 1 : 0,
              transform: activeSlide === index ? "scale(1)" : "scale(1.04)",
              transition: "opacity 700ms ease-in-out, transform 6s ease-out",
            }}
          />
        ))}

        {/* Dark Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {/* Gallery Content */}
        <Box
          sx={{
            position: "absolute",
            left: {
              md: 40,
              lg: 64,
            },
            right: {
              md: 40,
              lg: 64,
            },
            bottom: {
              md: 48,
              lg: 64,
            },
            color: "common.white",
          }}
        >
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 2,
              opacity: 0.8,
              fontWeight: 600,
            }}
          >
            PMS PLATFORM
          </Typography>

          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              mt: 1,
              mb: 2,
              maxWidth: 600,
            }}
          >
            {galleryImages[activeSlide].title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: 520,
              opacity: 0.9,
              lineHeight: 1.8,
              fontSize: "1.05rem",
            }}
          >
            {galleryImages[activeSlide].description}
          </Typography>

          {/* Bottom Controls */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 4,
            }}
          >
            {/* Indicators */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {galleryImages.map((image, index) => (
                <Box
                  key={image.title}
                  component="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  sx={{
                    border: 0,
                    cursor: "pointer",
                    padding: 0,
                    width: activeSlide === index ? 28 : 8,
                    height: 8,
                    borderRadius: 10,
                    bgcolor:
                      activeSlide === index
                        ? "common.white"
                        : "rgba(255,255,255,0.45)",
                    transition: "width 250ms ease, background-color 250ms ease",
                  }}
                />
              ))}
            </Box>

            {/* Navigation */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={handlePreviousSlide}
                aria-label="Previous slide"
                sx={{
                  color: "common.white",
                  border: 1,
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.12)",
                  },
                }}
              >
                <ArrowBackIosNewRoundedIcon fontSize="small" />
              </IconButton>

              <IconButton
                onClick={handleNextSlide}
                aria-label="Next slide"
                sx={{
                  color: "common.white",
                  border: 1,
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.12)",
                  },
                }}
              >
                <ArrowForwardIosRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ================= Login Section ================= */}
      <Box
        sx={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          px: {
            xs: 2,
            sm: 4,
            md: 6,
          },
          py: 4,
        }}
      >
        {/* Theme Toggle */}
        <IconButton
          onClick={toggleTheme}
          color="inherit"
          aria-label="Toggle theme"
          sx={{
            position: "absolute",
            top: {
              xs: 16,
              sm: 24,
            },
            right: {
              xs: 16,
              sm: 24,
            },
          }}
        >
          {mode === "light" ? <DarkMode /> : <LightMode />}
        </IconButton>
        <Box
          component="img"
          src={Logo}
          alt="Logo"
          sx={{
            mb: 2,
            width: "25%",
            height: "auto",
          }}
        />
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

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
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
                  control={<Checkbox {...register("remember")} />}
                  label={<Typography variant="body2">Remember me</Typography>}
                />

                <Link
                  href="#"
                  underline="hover"
                  color="secondary.main"
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
    </Box>
  );
}
