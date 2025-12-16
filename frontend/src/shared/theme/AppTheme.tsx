import * as React from "react";
import type { ThemeOptions } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { colorSchemes, shadows, shape, typography } from "./themePrimitives";
import {
  dataDisplayCustomizations,
  dataGridCustomizations,
  inputsCustomizations,
  navigationCustomizations,
  surfacesCustomizations,
  tabsCustomization,
  feedbackCustomizations,
} from "@/shared/theme/customization";

interface AppThemeProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
}

// تم ثابت خارج از کامپوننت
const defaultTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-mui-color-scheme",
    cssVarPrefix: "template",
  },
  colorSchemes,
  typography,
  shadows,
  shape,
  components: {
    ...navigationCustomizations,
    ...inputsCustomizations,
    ...dataDisplayCustomizations,
    ...surfacesCustomizations,
    ...dataGridCustomizations,
    ...tabsCustomization,
    ...feedbackCustomizations,
  },
});

export default function AppTheme({
  children,
  disableCustomTheme,
  themeComponents,
}: AppThemeProps) {
  const theme = React.useMemo(() => {
    if (disableCustomTheme) return createTheme(); // تم پیش‌فرض MUI

    if (!themeComponents) return defaultTheme;

    // اگر themeComponents اضافه شده، فقط آن‌ها را merge کن
    return createTheme({
      ...defaultTheme,
      components: {
        ...defaultTheme.components,
        ...themeComponents,
      },
    });
  }, [disableCustomTheme, themeComponents]);

  if (disableCustomTheme) return <>{children}</>;

  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
