import * as React from "react";
import Box from "@mui/material/Box";
import IconButton, { type IconButtonOwnProps } from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { LOCAL_STORAGE } from "@/const";

type Language = "fa" | "en";

const STORAGE_KEY = LOCAL_STORAGE.LANG;

export default function LanguageDropdown(props: IconButtonOwnProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [language, setLanguage] = React.useState<Language>("en");

  const open = Boolean(anchorEl);

  // load initial language from localStorage
  React.useEffect(() => {
    const storedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (storedLang === "fa" || storedLang === "en") {
      setLanguage(storedLang);
    }
  }, []);

  // sync between tabs / external changes
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === STORAGE_KEY &&
        (e.newValue === "fa" || e.newValue === "en")
      ) {
        setLanguage(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLanguage = (lang: Language) => () => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    handleClose();
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClick} size="small" disableRipple {...props}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          {language === "fa" ? "FA" : "EN"}
        </Typography>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            variant: "outlined",
            elevation: 0,
            sx: { my: "4px", minWidth: 120 },
          },
        }}
      >
        <MenuItem
          selected={language === "en"}
          onClick={handleChangeLanguage("en")}
        >
          English
        </MenuItem>
        <MenuItem
          selected={language === "fa"}
          onClick={handleChangeLanguage("fa")}
        >
          Farsi
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
