import AppRouter from "./router";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "@/shared/theme/AppTheme";
import { Toaster } from "sonner";
import { type ReactNode } from "react";
import { Provider as JotaiProvider, useAtomValue } from "jotai";
import { EditorProvider } from "react-simple-wysiwyg";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { atomLanguage } from "@/shared/atoms/general.atom";
import { jotaiStore } from "@/shared/atoms/jotai.store";

interface ProvidersProps {
  children?: ReactNode;
}

/** 🔹 Inner provider that CAN use hooks */
const LocalizationWrapper = ({ children }: ProvidersProps) => {
  const lang = useAtomValue(atomLanguage);
  const isJalali = lang === "fa";

  const adapter = isJalali ? AdapterDateFnsJalali : AdapterDateFns;

  return (
    <LocalizationProvider dateAdapter={adapter}>
      {children}
    </LocalizationProvider>
  );
};

const Providers = ({ children }: ProvidersProps) => {
  return (
    <JotaiProvider store={jotaiStore}>
      <LocalizationWrapper>
        <AppTheme>
          <CssBaseline enableColorScheme />
          <EditorProvider>
            <AppRouter />
            {children}
          </EditorProvider>
        </AppTheme>
      </LocalizationWrapper>

      <Toaster position="bottom-center" richColors />
    </JotaiProvider>
  );
};

export default Providers;
