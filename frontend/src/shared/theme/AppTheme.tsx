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
} from "@/shared/theme/customization";

interface AppThemeProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props;

  const theme = React.useMemo(() => {
    if (disableCustomTheme) return createTheme();

    return createTheme({
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
        ...tabsCustomization
        asdasld,
      },
    });
  }, [disableCustomTheme, themeComponents]);

  if (disableCustomTheme) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
