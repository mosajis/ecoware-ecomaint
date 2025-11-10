import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { colorSchemes, shadows, shape, typography } from "./themePrimitives";
export default function AppTheme(props) {
    const { children, disableCustomTheme, themeComponents } = props;
    const theme = React.useMemo(() => {
        if (disableCustomTheme)
            return createTheme();
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
                ...themeComponents,
            },
        });
    }, [disableCustomTheme, themeComponents]);
    if (disableCustomTheme) {
        return _jsx(_Fragment, { children: children });
    }
    return (_jsx(ThemeProvider, { theme: theme, disableTransitionOnChange: true, children: children }));
}
