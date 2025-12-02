import AppRouter from "./router";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "@/shared/theme/AppTheme";
import { Toaster } from "sonner";
import { type ReactNode } from "react";
import { Provider as JotaiProvider } from "jotai";
import { EditorProvider } from "react-simple-wysiwyg";

interface ProvidersProps {
  children?: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <JotaiProvider>
      <AppTheme>
        <CssBaseline enableColorScheme />
        <EditorProvider>
          <AppRouter />
        </EditorProvider>
        {children}
      </AppTheme>

      <Toaster />
    </JotaiProvider>
  );
};

export default Providers;
